/* model.js — the page's statistical baseline. EVERYTHING in this module is a
 * MODEL, not market data. The page renders its outputs with the "modeled"
 * visual treatment. Parameter sources and their citations live in
 * research/model-parameters.md; where a value is a calibration choice rather
 * than a published estimate it is named `assumed*`.
 *
 * The model is an independent double-Poisson match model (Maher 1982 lineage):
 * each team's goals in an interval ~ Poisson(rate x time-fraction). This is
 * the standard baseline in the literature; it deliberately ignores
 * correlation and momentum, which is the point — it is the "cold" reading.
 */

export function poissonPmf(k, lambda) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  // exp(k ln λ − λ − ln k!)
  let lnFact = 0;
  for (let i = 2; i <= k; i++) lnFact += Math.log(i);
  return Math.exp(k * Math.log(lambda) - lambda - lnFact);
}

/**
 * Full-interval score grid for remaining goals.
 * lamA/lamB: expected goals for team A / team B over the interval.
 * Returns P[i][j] = P(A scores i more, B scores j more), i,j <= kMax.
 */
export function scoreGrid(lamA, lamB, kMax = 8) {
  const pa = [], pb = [];
  for (let k = 0; k <= kMax; k++) {
    pa.push(poissonPmf(k, lamA));
    pb.push(poissonPmf(k, lamB));
  }
  const P = [];
  for (let i = 0; i <= kMax; i++) {
    P.push([]);
    for (let j = 0; j <= kMax; j++) P[i].push(pa[i] * pb[j]);
  }
  return P;
}

/**
 * Outcome probabilities from an in-game state.
 *
 * state = {
 *   lamA, lamB     — full-match expected goals at even strength (model assumption)
 *   minute         — current minute (0 = kickoff)
 *   scoreA, scoreB — current score
 *   redCard        — null | 'A' | 'B' (team reduced to 10)
 *   redShort, redFull — multipliers on the short-handed / full-strength team's
 *                        remaining scoring rate (from literature; see research)
 *   matchLength    — default 90
 * }
 * Returns { winA, winB, draw, grid, lamRemA, lamRemB }
 * where grid[i][j] covers REMAINING goals.
 */
export function outcomeFromState(state) {
  const T = state.matchLength || 90;
  const frac = Math.max(T - state.minute, 0) / T;
  let lamRemA = state.lamA * frac;
  let lamRemB = state.lamB * frac;
  if (state.redCard === 'A') {
    lamRemA *= state.redShort;
    lamRemB *= state.redFull;
  } else if (state.redCard === 'B') {
    lamRemB *= state.redShort;
    lamRemA *= state.redFull;
  }
  const kMax = 8;
  const grid = scoreGrid(lamRemA, lamRemB, kMax);
  let winA = 0, winB = 0, draw = 0;
  for (let i = 0; i <= kMax; i++) {
    for (let j = 0; j <= kMax; j++) {
      const finalA = state.scoreA + i;
      const finalB = state.scoreB + j;
      if (finalA > finalB) winA += grid[i][j];
      else if (finalB > finalA) winB += grid[i][j];
      else draw += grid[i][j];
    }
  }
  // Normalize the tiny tail mass beyond kMax.
  const s = winA + winB + draw;
  return { winA: winA / s, winB: winB / s, draw: draw / s, grid, lamRemA, lamRemB };
}

/**
 * P(team B ADVANCES) from an in-regulation state, for a knockout tie:
 * win in the remaining 90' + (drawn at 90') x (win ET + draw ET x P(win pens)).
 * Extra time runs at 1/3 of full-match rates (30 of 90 minutes); a red card
 * persists into ET; penalties default to 0.5 (stated model assumption).
 */
export function advanceProbFromState(state) {
  const reg = outcomeFromState(state);
  let eA = state.lamA / 3, eB = state.lamB / 3;
  if (state.redCard === 'A') { eA *= state.redShort; eB *= state.redFull; }
  else if (state.redCard === 'B') { eB *= state.redShort; eA *= state.redFull; }
  const kMax = 8;
  const g = scoreGrid(eA, eB, kMax);
  let wA = 0, wB = 0, dr = 0;
  for (let i = 0; i <= kMax; i++) {
    for (let j = 0; j <= kMax; j++) {
      if (i > j) wA += g[i][j];
      else if (j > i) wB += g[i][j];
      else dr += g[i][j];
    }
  }
  const s = wA + wB + dr;
  const pens = state.pens !== undefined ? state.pens : 0.5;
  const et = { winA: wA / s, winB: wB / s, draw: dr / s };
  const pEt = et.winB + et.draw * pens;
  return { pAdvance: reg.winB + reg.draw * pEt, reg, et, pEt };
}

/**
 * P(team B advances) evaluated DURING extra time. etMinute in [0, 30];
 * scoreA/scoreB are the aggregate score; a red card persists; level at the
 * end of ET goes to penalties (pens, default 0.5 — stated assumption).
 */
export function advanceProbET(state) {
  const frac = Math.max(30 - state.etMinute, 0) / 30;
  let eA = (state.lamA / 3) * frac;
  let eB = (state.lamB / 3) * frac;
  if (state.redCard === 'A') { eA *= state.redShort; eB *= state.redFull; }
  else if (state.redCard === 'B') { eB *= state.redShort; eA *= state.redFull; }
  const kMax = 8;
  const g = scoreGrid(eA, eB, kMax);
  const pens = state.pens !== undefined ? state.pens : 0.5;
  let adv = 0, tot = 0;
  for (let i = 0; i <= kMax; i++) {
    for (let j = 0; j <= kMax; j++) {
      const p = g[i][j];
      tot += p;
      const fA = state.scoreA + i, fB = state.scoreB + j;
      if (fB > fA) adv += p;
      else if (fB === fA) adv += p * pens;
    }
  }
  return adv / tot;
}

/**
 * Calibrate the lambda split so that P(underdog B advances) matches an
 * observed kickoff price, holding the total-goals assumption fixed:
 * lamA + lamB = totalGoals. Reverse-engineers "what strength gap does this
 * price imply?" — the answer is a model output, labeled as such.
 */
export function solveLambdasForPrice(priceB, totalGoals, opts = {}) {
  let lo = 0.05, hi = totalGoals / 2; // underdog: lamB <= half the total
  for (let iter = 0; iter < 60; iter++) {
    const mid = (lo + hi) / 2;
    const { pAdvance } = advanceProbFromState({
      lamA: totalGoals - mid, lamB: mid,
      minute: 0, scoreA: 0, scoreB: 0, redCard: null,
      redShort: 1, redFull: 1,
      ...opts,
    });
    if (pAdvance < priceB) lo = mid; else hi = mid;
  }
  const lamB = (lo + hi) / 2;
  return { lamA: totalGoals - lamB, lamB };
}

/**
 * Deterministic largest-remainder allocation of N units across outcome
 * probabilities. Same inputs -> same allocation; no RNG, so every page load
 * and every scrub replays identically (object constancy across reloads).
 */
export function allocateUnits(N, probs) {
  const raw = probs.map(p => p * N);
  const counts = raw.map(Math.floor);
  let short = N - counts.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < short; k++) counts[order[k % order.length].i]++;
  return counts;
}
