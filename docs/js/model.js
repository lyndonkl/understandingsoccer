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
 * Calibrate lamB (underdog) so that P(B wins) matches an observed price,
 * holding the total-goals assumption fixed: lamA + lamB = totalGoals.
 * Used to reverse-engineer "what strength gap does this kickoff price imply?"
 * — the answer is a model output, labeled as such.
 */
export function solveLambdasForPrice(priceB, totalGoals, opts = {}) {
  let lo = 0.05, hi = totalGoals / 2; // underdog: lamB <= half the total
  for (let iter = 0; iter < 60; iter++) {
    const mid = (lo + hi) / 2;
    const { winB } = outcomeFromState({
      lamA: totalGoals - mid, lamB: mid,
      minute: 0, scoreA: 0, scoreB: 0, redCard: null,
      redShort: 1, redFull: 1,
      ...opts,
    });
    if (winB < priceB) lo = mid; else hi = mid;
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
