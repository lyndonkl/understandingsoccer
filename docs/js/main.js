/* main.js — scroll orchestration, beat definitions, D3 annotation layers.
 *
 * Split of responsibilities (design/architecture.md):
 *   WebGL (engine.js)  — the 10,000-unit layer, GPU tweens
 *   D3 + SVG (here)    — scales, axes, price chart, order book, annotations
 *   HTML cards         — the prose; a passive scroll listener drives beats
 * One shared coordinate system: D3 scales in CSS pixels feed both layers.
 */

import { createEngine } from './engine.js';
import {
  PALETTE, fieldScatter, worldGrid, scorelineGrid, priceColumn,
  glyph, glyphPixels, smallMultiples, twinGlyphs, marginalBars,
} from './layouts.js';
import {
  poissonPmf, outcomeFromState, advanceProbFromState, advanceProbET,
  solveLambdasForPrice, allocateUnits,
} from './model.js';
import { ADVANCE, EVENTS, META } from '../data/argsui-prices.js';
import { ORDERBOOK } from '../data/orderbook.js';
import { TAPE, EQUALIZER_WINDOW } from '../data/tape.js';

const N = 10000;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DUR = REDUCED ? 0 : 750;

/* ---------------------------------------------------------------- */
/* Model boot — everything derived here is a LABELED MODEL OUTPUT.   */
/* Parameters: research/model-parameters.md.                         */
const TOTAL_GOALS = 2.7;      // WC 2018 ≈2.64, WC 2022 ≈2.69 (cited)
const RED_SHORT = 0.53;       // Červený et al. 2017: own red card −47%
const RED_FULL = 2.24;        // Červený et al. 2017: opponent red +124%
const KICKOFF_PRICE = 0.26;   // real (Kalshi API)

const CAL = solveLambdasForPrice(KICKOFF_PRICE, TOTAL_GOALS, { redShort: RED_SHORT, redFull: RED_FULL });
const kickoffState = {
  lamA: CAL.lamA, lamB: CAL.lamB, minute: 0, scoreA: 0, scoreB: 0,
  redCard: null, redShort: RED_SHORT, redFull: RED_FULL,
};
const KICK = advanceProbFromState(kickoffState);
const ENDGAME = advanceProbFromState({ ...kickoffState, minute: 90, scoreA: 1, scoreB: 1, redCard: 'B' });
const FAIR90 = ENDGAME.pAdvance; // ≈ 0.17 — the "cold" late-game read [MODEL]

/* Kickoff scoreline cells for beat 3 (final 90' scores, 4+ aggregated). */
function buildKickoffCells() {
  const { grid } = outcomeFromState(kickoffState);
  const pAdvGivenDraw = KICK.pEt; // even-strength ET + pens
  const bins = 5;
  const acc = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const bi = Math.min(i, bins - 1), bj = Math.min(j, bins - 1);
      const key = bi + ',' + bj;
      if (!acc[key]) acc[key] = { i: bi, j: bj, prob: 0, yes: 0 };
      const p = grid[i][j];
      const yesFrac = j > i ? 1 : (i > j ? 0 : pAdvGivenDraw);
      acc[key].prob += p;
      acc[key].yes += p * yesFrac;
    }
  }
  const cells = Object.values(acc);
  const total = cells.reduce((s, c) => s + c.prob, 0);
  cells.forEach(c => { c.yesFrac = c.yes / c.prob; c.prob /= total; });
  const alloc = allocateUnits(N, cells.map(c => c.prob));
  return { cells, alloc };
}
const KCELLS = buildKickoffCells();

/* The two Poisson marginals (0..4+, tail aggregated) for the dice beat. */
function marginalProbs(lam) {
  const p = [];
  let acc = 0;
  for (let k = 0; k < 4; k++) { const v = poissonPmf(k, lam); p.push(v); acc += v; }
  p.push(Math.max(1 - acc, 0));
  return p;
}
const MARGA = marginalProbs(CAL.lamA);
const MARGB = marginalProbs(CAL.lamB);

/* Model conditionals quoted on cards (all MODEL). */
const AT10 = advanceProbFromState({ ...kickoffState, minute: 10, scoreA: 1, scoreB: 0 });
const FAIR72 = advanceProbFromState({ ...kickoffState, minute: 72, scoreA: 1, scoreB: 1, redCard: 'B' }).pAdvance;

/* Minute-by-minute model fair value along the real timeline.
 * Match-clock <-> UTC mapping is INFERRED, anchored at the verified event
 * candles (kickoff 01:00, goal 01:11, equalizer 02:29, red card 02:33,
 * whistle 03:05, ET goals 03:33/03:44); halftime and the pre-ET break are
 * held flat. States between anchors are the verified score/card states. */
const TAU_ANCHORS = [
  [0, '01:00'], [10, '01:11'], [45, '01:48'], [45, '02:04'],
  [67, '02:29'], [72, '02:33'], [90, '03:05'], [90, '03:10'],
  [112, '03:33'], [120, '03:44'],
];
function tauAtUtc(t) {
  const A = TAU_ANCHORS.map(([m, u]) => [m, utcMin(u)]);
  if (t <= A[0][1]) return 0;
  for (let k = 0; k < A.length - 1; k++) {
    const [m0, u0] = A[k], [m1, u1] = A[k + 1];
    if (t <= u1) {
      if (u1 === u0) return m1;
      return m0 + (m1 - m0) * (t - u0) / (u1 - u0);
    }
  }
  return 120;
}
function fairValueAtTau(tau) {
  const st = { scoreA: 0, scoreB: 0, redCard: null };
  if (tau >= 10) st.scoreA = 1;
  if (tau >= 67) st.scoreB = 1;
  if (tau >= 72) st.redCard = 'B';
  if (tau >= 112) st.scoreA = 2;
  if (tau >= 120) st.scoreA = 3;
  if (tau <= 90) {
    return advanceProbFromState({ ...kickoffState, minute: tau, ...st }).pAdvance;
  }
  return advanceProbET({
    lamA: CAL.lamA, lamB: CAL.lamB, etMinute: tau - 90,
    redShort: RED_SHORT, redFull: RED_FULL, ...st,
  });
}

/* ---------------------------------------------------------------- */
/* Stage geometry                                                    */
let W = 0, H = 0, region, chartRect, mobile = false;
function computeRegions() {
  W = window.innerWidth; H = window.innerHeight;
  mobile = W < 900;
  region = mobile
    ? { x: W * 0.06, y: H * 0.09, w: W * 0.88, h: H * 0.55 }
    : { x: W * 0.40, y: H * 0.11, w: W * 0.56, h: H * 0.78 };
  chartRect = {
    x: region.x + 8,
    y: region.y + region.h * 0.60,
    w: region.w * (mobile ? 0.94 : 0.60),
    h: region.h * 0.36,
  };
}

function gridRectSquare() {
  const side = Math.min(region.w * 0.92, region.h * 0.92);
  return { x: region.x + (region.w - side) / 2, y: region.y + (region.h - side) / 2, w: side, h: side };
}
function glyphRect() {
  return { x: region.x + region.w * 0.05, y: region.y + region.h * 0.16, w: region.w * 0.9, h: region.h * 0.62 };
}

/* ---------------------------------------------------------------- */
/* Time helpers for the real price series                            */
const utcMin = u => { const [h, m] = u.split(':').map(Number); return h * 60 + m; };
const T0 = utcMin('00:30'), T1 = utcMin('03:45');
function priceAt(utc) {
  const t = utcMin(utc);
  let last = ADVANCE[0].sui;
  for (const r of ADVANCE) { if (utcMin(r.utc) <= t) last = r.sui; else break; }
  return last;
}

/* ---------------------------------------------------------------- */
/* Engine boot                                                       */
const canvas = document.getElementById('units');
let engine = null;
try { engine = createEngine(canvas, N); } catch (e) { engine = null; }
if (!engine) document.body.classList.add('no-webgl');

const svg = d3.select('#anno');

/* ---------------------------------------------------------------- */
/* Persistent chart layer (real price line, beats goal→resolution)   */
let chartG = null, xScale = null, yScale = null, clipRect = null, modelG = null;

function ensureChart() {
  if (chartG) return;
  xScale = d3.scaleLinear().domain([T0, T1]).range([chartRect.x, chartRect.x + chartRect.w]);
  yScale = d3.scaleLinear().domain([0, 1]).range([chartRect.y + chartRect.h, chartRect.y]);

  chartG = svg.append('g').attr('class', 'chart-layer').style('opacity', 0);

  const defs = svg.append('defs');
  clipRect = defs.append('clipPath').attr('id', 'reveal').append('rect')
    .attr('x', chartRect.x).attr('y', chartRect.y - 30)
    .attr('width', 0).attr('height', chartRect.h + 60);

  // axes (created once; classes per d3 brief)
  const xticks = ['01:00', '01:30', '02:00', '02:30', '03:00', '03:30'];
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xticks.map(utcMin))
    .tickFormat(t => {
      const h = Math.floor(t / 60), m = t % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    })
    .tickSize(3);
  chartG.append('g').attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${chartRect.y + chartRect.h})`).call(xAxis);
  const yAxis = d3.axisLeft(yScale).tickValues([0, 0.25, 0.5, 0.75, 1])
    .tickFormat(v => `${Math.round(v * 100)}¢`).tickSize(3);
  chartG.append('g').attr('class', 'axis y-axis')
    .attr('transform', `translate(${chartRect.x},0)`).call(yAxis);

  // real volume bars (per-minute, sqrt-free linear scale, zero-based)
  const vmax = d3.max(ADVANCE, d => d.vol);
  const vScale = d3.scaleLinear().domain([0, vmax]).range([0, chartRect.h * 0.55]);
  chartG.append('g').attr('clip-path', 'url(#reveal)')
    .selectAll('rect').data(ADVANCE).join('rect')
    .attr('x', d => xScale(utcMin(d.utc)) - 0.75)
    .attr('y', d => chartRect.y + chartRect.h - vScale(d.vol))
    .attr('width', 1.5)
    .attr('height', d => vScale(d.vol))
    .attr('fill', 'rgba(152,160,146,0.28)');

  // intraminute high-low envelope (real): the visible width of disagreement
  const env = d3.area()
    .x(d => xScale(utcMin(d.utc)))
    .y0(d => yScale(d.l))
    .y1(d => yScale(d.h))
    .curve(d3.curveStepAfter);
  chartG.append('g').attr('clip-path', 'url(#reveal)')
    .append('path').datum(ADVANCE)
    .attr('d', env)
    .attr('fill', 'rgba(232,228,216,0.28)')
    .attr('stroke', 'rgba(232,228,216,0.35)')
    .attr('stroke-width', 0.7);

  // model fair-value overlay: dashed line + gap bands vs the traded price.
  // Revealed only from the beats that introduce it (b.model flag).
  const FL = ADVANCE
    .filter(d => d.utc >= '01:00')
    .map(d => ({ utc: d.utc, close: d.sui, fv: fairValueAtTau(tauAtUtc(utcMin(d.utc))) }));
  modelG = chartG.append('g').attr('class', 'model-layer').style('opacity', 0);
  const mgc = modelG.append('g').attr('clip-path', 'url(#reveal)');
  const mx = d => xScale(utcMin(d.utc));
  mgc.append('path').datum(FL) // market above model: the premium band (hot)
    .attr('d', d3.area().x(mx).y0(d => yScale(d.fv)).y1(d => yScale(Math.max(d.close, d.fv))).curve(d3.curveStepAfter))
    .attr('fill', 'rgba(242,160,61,0.32)');
  mgc.append('path').datum(FL) // market below model: the discount band (cold)
    .attr('d', d3.area().x(mx).y0(d => yScale(Math.min(d.close, d.fv))).y1(d => yScale(d.fv)).curve(d3.curveStepAfter))
    .attr('fill', 'rgba(123,200,232,0.26)');
  mgc.append('path').datum(FL)
    .attr('d', d3.line().x(mx).y(d => yScale(d.fv)).curve(d3.curveStepAfter))
    .attr('fill', 'none')
    .attr('stroke', '#7bc8e8')
    .attr('stroke-width', 1.3)
    .attr('stroke-dasharray', '5 3');
  const ms = modelG.append('g');
  ms.append('rect')
    .attr('x', chartRect.x + 262).attr('y', chartRect.y + chartRect.h + 26)
    .attr('width', 300).attr('height', 15)
    .attr('fill', 'transparent').attr('stroke', '#7bc8e8').attr('stroke-dasharray', '3 3');
  ms.append('text').attr('class', 'stamp model')
    .attr('x', chartRect.x + 267).attr('y', chartRect.y + chartRect.h + 37.5)
    .text('MODEL · FAIR VALUE, DASHED · MINUTE MAP INFERRED');
  // direct labels on the two lines, placed where they separate (post red card)
  ms.append('text').attr('class', 'callout mono')
    .attr('x', xScale(utcMin('02:40'))).attr('y', yScale(0.20) - 6)
    .attr('text-anchor', 'middle').attr('font-size', 10.5).attr('fill', '#e8e4d8')
    .text('market · traded Kalshi price');
  ms.append('text').attr('class', 'callout mono')
    .attr('x', xScale(utcMin('02:44'))).attr('y', yScale(0.115) + 24)
    .attr('text-anchor', 'middle').attr('font-size', 10.5).attr('fill', '#7bc8e8')
    .text('model fair value · the dice, re-rolled');

  // the real price line
  const line = d3.line()
    .x(d => xScale(utcMin(d.utc)))
    .y(d => yScale(d.sui))
    .curve(d3.curveStepAfter);
  chartG.append('g').attr('clip-path', 'url(#reveal)')
    .append('path').datum(ADVANCE)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#e8e4d8')
    .attr('stroke-width', 1.6);

  // 26¢ reference rule
  chartG.append('line')
    .attr('x1', chartRect.x).attr('x2', chartRect.x + chartRect.w)
    .attr('y1', yScale(0.26)).attr('y2', yScale(0.26))
    .attr('stroke', 'rgba(242,160,61,0.5)').attr('stroke-dasharray', '2 4');
  chartG.append('text').attr('class', 'callout mono')
    .attr('x', chartRect.x + chartRect.w + 6).attr('y', yScale(0.26) + 4)
    .attr('font-size', 11).attr('fill', '#f2a03d').text('26¢');

  // event markers, revealed as time passes
  const evG = chartG.append('g');
  EVENTS.forEach((ev, idx) => {
    const g = evG.append('g').attr('class', 'ev').attr('data-utc', ev.utc).style('opacity', 0);
    const x = xScale(utcMin(ev.utc));
    g.append('line').attr('x1', x).attr('x2', x)
      .attr('y1', chartRect.y).attr('y2', chartRect.y + chartRect.h)
      .attr('stroke', ev.kind === 'alarm' ? '#e4572e' : 'rgba(232,228,216,0.25)')
      .attr('stroke-width', ev.kind === 'alarm' ? 1.4 : 1);
    // alternate label rows so neighbors at 02:29/02:33/03:05 don't collide;
    // the regulation-end label gets its own third row, hung right of its line
    const rightHang = ev.utc === '03:05';
    const row = rightHang ? 2 : idx % 2;
    g.append('text').attr('class', 'callout')
      .attr('x', x + (rightHang ? 5 : 0)).attr('y', chartRect.y - 10 - row * 15)
      .attr('text-anchor', rightHang ? 'start' : 'middle').attr('font-size', 10.5)
      .attr('fill', ev.kind === 'alarm' ? '#e4572e' : '#98a092')
      .text(ev.label.split('(')[0].trim());
  });

  // provenance stamp
  const st = chartG.append('g');
  st.append('rect').attr('x', chartRect.x).attr('y', chartRect.y + chartRect.h + 26)
    .attr('width', 246).attr('height', 15).attr('fill', '#e8e4d8');
  st.append('text').attr('class', 'stamp real')
    .attr('x', chartRect.x + 4).attr('y', chartRect.y + chartRect.h + 37.5)
    .text('REAL · KALSHI 1-MIN CLOSES · JUL 11–12 2026 UTC');
}

let chartShown = false;
function showChart(endUtc, model) {
  ensureChart();
  chartShown = true;
  chartG.style('opacity', 1);
  modelG.style('opacity', model ? 1 : 0);
  clipRect.style('width', Math.max(xScale(utcMin(endUtc)) - chartRect.x, 0) + 'px');
  chartG.selectAll('.ev').each(function () {
    const past = utcMin(this.dataset.utc) <= utcMin(endUtc);
    this.style.opacity = past ? 1 : 0;
  });
}
function hideChart() {
  if (!chartG || !chartShown) return;
  chartShown = false;
  chartG.style('opacity', 0);
}

/* ---------------------------------------------------------------- */
/* Per-beat annotation layer                                         */
let annoLayer = null;
function setAnno(drawFn) {
  // Sweep: drop layers that already finished fading; fade the rest out.
  svg.selectAll(':scope > g.layer').each(function () {
    if (this.style.opacity === '0') this.remove();
    else this.style.opacity = 0;
  });
  annoLayer = svg.append('g').attr('class', 'layer').style('opacity', 0);
  if (drawFn) drawFn(annoLayer);
  // Synchronous style flush so opacity:0 is the committed start value, then
  // flip to 1 — kicks the CSS transition without depending on rAF timing.
  const el = annoLayer.node();
  void el.getBoundingClientRect();
  el.style.opacity = 1;
}

function stamp(g, x, y, kind, text) {
  const isReal = kind === 'real';
  const w = text.length * 6.6 + 10;
  g.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', 15)
    .attr('fill', isReal ? '#e8e4d8' : 'transparent')
    .attr('stroke', isReal ? 'none' : '#7bc8e8')
    .attr('stroke-dasharray', isReal ? null : '3 3');
  g.append('text').attr('class', `stamp ${kind}`)
    .attr('x', x + 5).attr('y', y + 11.5).text(text);
}

function callout(g, x, y, lines, opts = {}) {
  const t = g.append('text').attr('class', 'callout' + (opts.mono ? ' mono' : ''))
    .attr('x', x).attr('y', y)
    .attr('text-anchor', opts.anchor || 'start')
    .attr('font-size', opts.size || 13);
  if (opts.fill) t.attr('fill', opts.fill);
  (Array.isArray(lines) ? lines : [lines]).forEach((ln, i) => {
    t.append('tspan').attr('x', x).attr('dy', i === 0 ? 0 : '1.35em').text(ln);
  });
  return t;
}

/* Column geometry shared with priceColumn(colW=0.24) */
function columnGeom(rect) {
  const r = rect || region;
  const colW = 0.24;
  const x0 = r.x + r.w * (1 - colW);
  return { x0, x1: r.x + r.w, yFor: p => r.y + r.h * (1 - p) };
}

/* The spread beat needs breathing room to the right of the column for the
 * gap bracket and its labels, so it uses a narrower rect. */
function spreadRect() {
  return { x: region.x, y: region.y, w: region.w * 0.76, h: region.h };
}

/* ---------------------------------------------------------------- */
/* Beat definitions                                                  */
const fmt = v => `${Math.round(v * 100)}¢`;

const BEATS = {
  hero: {
    hud: { clock: 'JUL 11 2026', beat: 'Quarterfinal · Kansas City', price: `SUI to advance · <b>26¢</b>` },
    state: () => fieldScatter(N, { x: 0, y: 0, w: W, h: H }),
    anno: null, chart: false,
  },

  count: {
    hud: { clock: '9:00 PM ET', beat: 'The naive reading', price: `26¢ ≈ <b>26 in 100</b>` },
    state: () => worldGrid(N, gridRectSquare(), { yesCount: 2600 }),
    chart: false,
    anno: g => {
      const r = gridRectSquare();
      const bx = r.x + r.w * 0.26;
      g.append('line').attr('x1', bx).attr('x2', bx)
        .attr('y1', r.y - 6).attr('y2', r.y + r.h + 6)
        .attr('stroke', '#e8e4d8').attr('stroke-width', 1).attr('stroke-dasharray', '4 3');
      callout(g, bx, r.y - 26, '2,600 of 10,000 endings · the market’s count', { anchor: 'middle' });
      callout(g, r.x + r.w * 0.13, r.y + r.h + 24, 'SWITZERLAND ADVANCES', { anchor: 'middle', size: 11, fill: '#7bc8e8' });
      callout(g, r.x + r.w * 0.63, r.y + r.h + 24, 'IT DOESN’T', { anchor: 'middle', size: 11 });
      stamp(g, r.x, r.y + r.h + 40, 'real', 'REAL · KICKOFF PRICE 26¢ · KALSHI');
    },
  },

  book: {
    hud: { clock: 'JUL 13 2026', beat: 'The order book, live', price: `ENG–ARG last · <b>55¢</b>` },
    state: () => worldGrid(N, gridRectSquare(), { yesCount: 2600, dimNo: true }),
    chart: false,
    anno: g => {
      // real ladder, drawn center-right over the dimmed grid
      const r = gridRectSquare();
      const bw = Math.min(r.w * 0.72, 420);
      const bx = r.x + (r.w - bw) / 2, by = r.y + r.h * 0.14, bh = r.h * 0.6;
      const maxQ = d3.max([...ORDERBOOK.yesBids, ...ORDERBOOK.yesAsks], d => d[1]);
      const q = d3.scaleLinear().domain([0, maxQ]).range([0, bw * 0.46]);
      const rowH = bh / 6.6;
      const mid = bx + bw / 2;
      g.append('rect').attr('x', r.x).attr('y', r.y).attr('width', r.w).attr('height', r.h)
        .attr('fill', 'rgba(16,25,19,0.72)');
      ORDERBOOK.yesBids.forEach((d, i) => {
        const y = by + i * rowH;
        g.append('rect').attr('x', mid - 34 - q(d[1])).attr('y', y)
          .attr('width', q(d[1])).attr('height', rowH * 0.62)
          .attr('fill', 'rgba(123,200,232,0.75)');
        callout(g, mid - 28, y + rowH * 0.45, fmt(d[0]), { mono: true, size: 11.5, anchor: 'end', fill: '#e8e4d8' });
      });
      ORDERBOOK.yesAsks.forEach((d, i) => {
        const y = by + i * rowH;
        g.append('rect').attr('x', mid + 34).attr('y', y)
          .attr('width', q(d[1])).attr('height', rowH * 0.62)
          .attr('fill', 'rgba(242,160,61,0.7)');
        callout(g, mid + 28, y + rowH * 0.45, fmt(d[0]), { mono: true, size: 11.5, fill: '#e8e4d8' });
      });
      callout(g, mid - 40, by - 14, 'BUYERS WAITING (BIDS)', { anchor: 'end', size: 10.5, fill: '#7bc8e8' });
      callout(g, mid + 40, by - 14, 'SELLERS WAITING (ASKS)', { size: 10.5, fill: '#f2a03d' });
      callout(g, mid, by + 6 * rowH + 20, `${(ORDERBOOK.yesAsks[0][1] / 1e6).toFixed(1)}M contracts resting at 55¢: the wall the price must eat through`, { anchor: 'middle', size: 12 });
      callout(g, mid, by - 34, ORDERBOOK.question, { anchor: 'middle', size: 13, fill: '#e8e4d8' });
      stamp(g, bx, by + 6 * rowH + 34, 'real', `REAL · PUBLIC API · ${ORDERBOOK.pulledUtc}`);
    },
  },

  prints: {
    hud: { clock: 'JUL 13 2026', beat: 'The public tape', price: `every print · <b>55¢</b>` },
    state: () => worldGrid(N, gridRectSquare(), { yesCount: 2600, dimNo: true }),
    chart: false,
    anno: g => {
      const r = gridRectSquare();
      g.append('rect').attr('x', r.x).attr('y', r.y).attr('width', r.w).attr('height', r.h)
        .attr('fill', 'rgba(16,25,19,0.78)');
      const px = r.x + r.w * 0.5, py = r.y + r.h * 0.10;
      callout(g, px, py, 'THE TAPE · MOST RECENT PRINTS', { anchor: 'middle', size: 11.5, fill: '#e8e4d8' });
      const rows = TAPE.prints.slice(0, 10);
      rows.forEach((p, i) => {
        const y = py + 26 + i * 19;
        callout(g, px - 160, y, p.t.replace(' UTC', ''), { mono: true, size: 11.5 });
        callout(g, px - 55, y, fmt(p.price), { mono: true, size: 11.5, fill: '#e8e4d8' });
        callout(g, px + 45, y, String(p.count), { mono: true, size: 11.5, anchor: 'end' });
        callout(g, px + 62, y, 'buyer crossed ↑', { size: 10.5, fill: '#7bc8e8' });
      });
      const yb = py + 26 + rows.length * 19 + 18;
      callout(g, px, yb, 'thirty straight prints, all buyers accepting the 55¢ ask', { anchor: 'middle', size: 12, fill: '#e8e4d8' });
      callout(g, px, yb + 18, 'the price is the last handshake, and buyers keep reaching', { anchor: 'middle', size: 11 });
      stamp(g, px - 120, yb + 30, 'real', `REAL · /markets/trades · ${TAPE.pulledUtc}`);
    },
  },

  dice: {
    hud: { clock: "0' · 0–0", beat: 'Two scoring processes', price: `λ <b>1.8</b> · λ <b>0.9</b>` },
    state: () => marginalBars(N, gridRectSquare(), { probsA: MARGA, probsB: MARGB }),
    chart: false,
    anno: g => {
      const r = gridRectSquare();
      const bins = 5, binW = r.w / bins;
      const rowH = r.h * 0.40;
      const baseA = r.y + rowH, baseB = r.y + r.h;
      for (let b = 0; b < bins; b++) {
        const cx = r.x + (b + 0.5) * binW;
        const lab = b === 4 ? '4+' : String(b);
        callout(g, cx, baseA + 16, lab, { anchor: 'middle', mono: true, size: 11 });
        callout(g, cx, baseA + 30, Math.round(MARGA[b] * 100) + '%', { anchor: 'middle', mono: true, size: 10, fill: '#98a092' });
        callout(g, cx, baseB + 16, lab, { anchor: 'middle', mono: true, size: 11 });
        callout(g, cx, baseB + 30, Math.round(MARGB[b] * 100) + '%', { anchor: 'middle', mono: true, size: 10, fill: '#7bc8e8' });
      }
      callout(g, r.x, baseA - rowH * 0.82, ['ARGENTINA', 'goals · λ ≈ 1.8'], { size: 11, fill: '#e8e4d8' });
      callout(g, r.x, baseB - rowH * 0.82, ['SWITZERLAND', 'goals · λ ≈ 0.9'], { size: 11, fill: '#7bc8e8' });
      stamp(g, r.x, r.y - 24, 'model', 'MODEL · POISSON, EACH TEAM SEPARATELY');
    },
  },

  kickoff: {
    hud: { clock: "0' · 0–0", beat: '26¢ = capability', price: `SUI advance · <b>26¢</b>` },
    state: () => scorelineGrid(N, gridRectSquare(), { cells: KCELLS.cells, kMax: 4, alloc: KCELLS.alloc }),
    chart: false,
    anno: g => {
      const r = gridRectSquare();
      const bins = 5, cw = r.w / bins, ch = r.h / bins;
      for (let k = 0; k < bins; k++) {
        callout(g, r.x + (k + 0.5) * cw, r.y + r.h + 18, k === 4 ? '4+' : String(k), { anchor: 'middle', mono: true, size: 11 });
        callout(g, r.x - 14, r.y + r.h - (k + 0.5) * ch + 4, k === 4 ? '4+' : String(k), { anchor: 'end', mono: true, size: 11 });
      }
      callout(g, r.x + r.w / 2, r.y + r.h + 38, 'SWITZERLAND FINAL GOALS →', { anchor: 'middle', size: 10.5 });
      g.append('text').attr('class', 'callout')
        .attr('transform', `translate(${r.x - 38},${r.y + r.h / 2}) rotate(-90)`)
        .attr('text-anchor', 'middle').attr('font-size', 10.5).text('ARGENTINA FINAL GOALS →');
      // direct percentage labels on key cells: likelihood = dot count, and
      // the number makes the count readable at a glance
      const cellProb = (ai, sj) => {
        const c = KCELLS.cells.find(x => x.i === ai && x.j === sj);
        return c ? Math.round(c.prob * 100) : 0;
      };
      [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [2, 1]].forEach(([ai, sj]) => {
        const p = cellProb(ai, sj);
        const hot = ai === 1 && sj === 0; // the modal cell
        callout(g, r.x + sj * cw + 7, r.y + r.h - (ai + 1) * ch + 15,
          p + '%' + (hot ? ' · likeliest' : ''),
          { mono: true, size: hot ? 11.5 : 10.5, fill: hot ? '#e8e4d8' : '#98a092' });
      });
      // one-line reading key + the lit-mass total
      callout(g, r.x + r.w / 2, r.y + r.h + 56,
        'each cell = one final score · its chance = its dot count (any cell can be likely) · lit blue = endings where Switzerland advances',
        { anchor: 'middle', size: 11 });
      callout(g, r.x + r.w / 2, r.y + r.h + 76,
        '2,600 of 10,000 dots lit = the 26¢ price', { anchor: 'middle', mono: true, size: 12.5, fill: '#7bc8e8' });
      callout(g, r.x + r.w - 6, r.y - 24, 'cell dots = row share × column share × 10,000', { anchor: 'end', size: 10.5 });
      stamp(g, r.x, r.y - 24, 'model', 'MODEL · POISSON, CALIBRATED TO THE REAL 26¢');
    },
  },

  goal: {
    hud: { clock: "10' · 1–0", beat: 'The favorite scores', price: `<b>12¢</b> · model 10¢` },
    state: () => priceColumn(N, region, { price: priceAt('01:15') }),
    chart: '01:26',
    anno: g => {
      const c = columnGeom();
      callout(g, c.x0 - 10, c.yFor(0.12) - 24, 'market 12¢', { anchor: 'end', mono: true, size: 13.5, fill: '#e8e4d8' });
      callout(g, c.x0 - 10, c.yFor(0.12) - 8, 'model ≈10¢', { anchor: 'end', mono: true, size: 12, fill: '#7bc8e8' });
      callout(g, c.x0 - 10, c.yFor(0.12) + 10, 'the same 10,000 endings, re-counted', { anchor: 'end', size: 11.5 });
    },
  },

  equalizer: {
    hud: { clock: "67' · 1–1", beat: 'The market floods', price: `<b>10–35¢</b> in 1 min` },
    state: () => priceColumn(N, region, { price: 0.32 }),
    chart: '02:32',
    anno: g => {
      if (!xScale) return;
      const xEq = xScale(utcMin('02:29'));
      const labelX = chartRect.x + chartRect.w * 0.72;
      const labelY = chartRect.y + chartRect.h * 0.14;
      callout(g, labelX, labelY, ['02:29: prints from 10¢ to 35¢', 'inside one minute'], { anchor: 'end', size: 12, fill: '#e8e4d8' });
      // leader line from the label down to the band where it blows open
      g.append('line')
        .attr('x1', labelX - 58).attr('y1', labelY + 10)
        .attr('x2', xEq + 2).attr('y2', yScale(0.33))
        .attr('stroke', 'rgba(232,228,216,0.85)').attr('stroke-width', 1.3);
      g.append('circle').attr('cx', xEq + 2).attr('cy', yScale(0.33)).attr('r', 3)
        .attr('fill', '#e8e4d8');
      callout(g, labelX, chartRect.y + chartRect.h * 0.52,
        ['02:30: 1.28M contracts,', '≈ 22× the pre-kickoff rate'], { anchor: 'end', size: 12 });
      callout(g, chartRect.x + chartRect.w, chartRect.y + chartRect.h + 52, 'pale band = each minute’s full range of prints (REAL)', { anchor: 'end', size: 10.5 });
    },
  },

  redcard: {
    hud: { clock: "72' · 1–1 · 10 MEN", beat: 'The alarm', price: `<b>16¢</b>` },
    state: () => priceColumn(N, region, { price: 0.16 }),
    chart: '02:40',
    anno: g => {
      const c = columnGeom();
      callout(g, c.x0 - 10, c.yFor(0.16) - 8, '32¢ → 16¢', { anchor: 'end', mono: true, size: 14, fill: '#e4572e' });
      callout(g, c.x0 - 10, c.yFor(0.16) + 10, 'half the hope, gone in two minutes', { anchor: 'end', size: 11.5 });
    },
  },

  twoclocks: {
    hud: { clock: "75' · 1–1 · 10 MEN", beat: 'Two readings', price: `market <b>17¢</b> · model ≈12¢` },
    state: () => priceColumn(N, region, { price: 0.17 }),
    chart: '02:47', model: true,
    anno: g => {
      if (!xScale) return;
      const c = columnGeom();
      callout(g, c.x0 - 10, c.yFor(0.17) - 24, 'market 17¢', { anchor: 'end', mono: true, size: 13, fill: '#e8e4d8' });
      callout(g, c.x0 - 10, c.yFor(0.17) - 8, 'model ≈12¢', { anchor: 'end', mono: true, size: 12, fill: '#7bc8e8' });
      callout(g, c.x0 - 10, c.yFor(0.17) + 10, 'an interpretation, not a census of traders', { anchor: 'end', size: 11 });
    },
  },

  climb: {
    hud: { clock: "90' · 1–1", beat: 'Time decay, live', price: `<b>26¢</b> · model 17¢` },
    state: () => priceColumn(N, region, { price: 0.26 }),
    chart: '03:06', model: true,
    anno: g => {
      const c = columnGeom();
      callout(g, c.x0 - 10, c.yFor(0.26) - 8, '16 → 19 → 22 → 25 → 26¢', { anchor: 'end', mono: true, size: 13, fill: '#e8e4d8' });
      callout(g, c.x0 - 10, c.yFor(0.26) + 10, 'every scoreless minute is worth cents', { anchor: 'end', size: 11.5 });
      if (xScale) {
        const xm = xScale(utcMin('02:54'));
        callout(g, xm, yScale(0.40), ['the amber wedge: the climb', 'the clock alone can’t explain'], { anchor: 'middle', size: 11, fill: '#f2a03d' });
        const x = xScale(utcMin('02:55'));
        callout(g, x, chartRect.y + chartRect.h + 52,
          ['02:55 UTC: Argentina’s regulation-time contract also read 26¢.', 'The same digits, a favorite racing the clock. (REAL)'],
          { anchor: 'middle', size: 10.5 });
      }
    },
  },

  survival: {
    hud: { clock: "FT · 1–1", beat: '26¢ = survival', price: `<b>26¢</b> · again` },
    state: () => glyph(N, glyphRect(), { text: '26¢', yesCount: 2600, hotCount: 0 }),
    chart: false,
    anno: g => {
      const r = glyphRect();
      // ghost of the kickoff glyph, small, upper-left: re-show, don't ask recall
      const { pix, width, height } = glyphPixels('26¢');
      const sc = Math.min((r.w * 0.2) / width, (r.h * 0.22) / height);
      const gx = region.x + 6, gy = region.y + 6;
      pix.forEach(p => {
        g.append('rect')
          .attr('x', gx + p.col * sc).attr('y', gy + p.row * sc)
          .attr('width', sc * 0.7).attr('height', sc * 0.7)
          .attr('fill', 'rgba(123,200,232,0.28)');
      });
      callout(g, gx, gy + height * sc + 16, '9:00 PM · capability', { size: 10.5, fill: '#7bc8e8' });
      callout(g, r.x + r.w / 2, r.y + r.h + 30, '11:05 PM · the same number, rebuilt from different worlds', { anchor: 'middle', size: 12.5 });
      stamp(g, r.x + r.w / 2 - 90, r.y + r.h + 42, 'real', 'REAL · 26¢ AT 03:05–03:06 UTC');
    },
  },

  spread: {
    hud: { clock: "FT · 1–1", beat: 'The gap', price: `market <b>26¢</b> · <span class="hot">model 17¢</span>` },
    state: () => priceColumn(N, spreadRect(), { price: 0.26, fair: FAIR90 }),
    chart: false,
    anno: g => {
      const c = columnGeom(spreadRect());
      const yFair = c.yFor(FAIR90), yMkt = c.yFor(0.26);
      g.append('line').attr('x1', c.x0 - 64).attr('x2', c.x1)
        .attr('y1', yFair).attr('y2', yFair)
        .attr('stroke', '#7bc8e8').attr('stroke-dasharray', '5 4').attr('stroke-width', 1.2);
      callout(g, c.x0 - 70, yFair + 4, [`model fair value ${fmt(FAIR90)}`], { anchor: 'end', mono: true, size: 12.5, fill: '#7bc8e8' });
      callout(g, c.x0 - 70, yFair + 22, ['≈ 4¢ win ET a man down', `+ 13¢ reach penalties × coin flip`], { anchor: 'end', size: 11 });
      callout(g, c.x0 - 70, yMkt + 4, 'traded price 26¢', { anchor: 'end', mono: true, size: 12.5 });
      // the band
      g.append('path')
        .attr('d', `M ${c.x1 + 8} ${yMkt} h 10 V ${yFair} h -10`)
        .attr('fill', 'none').attr('stroke', '#f2a03d').attr('stroke-width', 1.4);
      callout(g, c.x1 + 24, (yMkt + yFair) / 2 + 4, ['9¢: feeling,', 'or knowledge', 'the model lacks'], { size: 12, fill: '#f2a03d' });
      callout(g, c.x1 + 24, (yMkt + yFair) / 2 + 58, 'fees ≤ 1.75¢ of it', { size: 10.5 });
      stamp(g, c.x0 - 70, yFair + 58, 'model', 'MODEL · SEE METHOD NOTES');
      stamp(g, c.x0 - 70, yMkt - 22, 'real', 'REAL · KALSHI');
    },
  },

  resolution: {
    hud: { clock: "112' · 2–1", beat: 'Resolution', price: `<b>2¢</b> → $0` },
    state: () => priceColumn(N, region, { price: 0.01 }),
    chart: '03:45', model: true,
    anno: g => {
      const c = columnGeom();
      callout(g, c.x0 - 10, c.yFor(0.05) - 12, 'settles $0', { anchor: 'end', mono: true, size: 14 });
      callout(g, c.x0 - 10, c.yFor(0.05) + 6, ['a 26% world simply didn’t arrive;', 'that is what 26% means'], { anchor: 'end', size: 11.5 });
    },
  },

  shutdown: {
    hud: { clock: 'FALL 2025', beat: 'Same lens: Washington', price: `17¢ = <b>17¢</b>?` },
    state: () => smallMultiples(N, gridRectSquare(), [{ price: 0.17, fair: null }, { price: 0.17, fair: null }]),
    chart: false,
    anno: g => {
      const r = gridRectSquare();
      const colW = (r.w - r.w * 0.08) / 2;
      const x1 = r.x + colW / 2, x2 = r.x + colW * 1.5 + r.w * 0.08;
      const yTop = r.y + r.h * (1 - 0.17);
      callout(g, x1, yTop - 58, 'SEP 23 · “> 35 days”', { anchor: 'middle', size: 12, fill: '#e8e4d8' });
      callout(g, x1, yTop - 40, 'a lottery ticket on the unthinkable', { anchor: 'middle', size: 11 });
      callout(g, x1, yTop - 18, 'settled YES · paid $1', { anchor: 'middle', mono: true, size: 11.5, fill: '#7bc8e8' });
      callout(g, x2, yTop - 58, 'NOV 5 · “> 60 days”', { anchor: 'middle', size: 12, fill: '#e8e4d8' });
      callout(g, x2, yTop - 40, 'an exhaustion tail, day 36', { anchor: 'middle', size: 11 });
      callout(g, x2, yTop - 18, 'settled NO · paid $0', { anchor: 'middle', mono: true, size: 11.5, fill: '#f2a03d' });
      stamp(g, r.x, r.y + r.h + 18, 'real', 'REAL · KALSHI NEWSROOM, DATED POSTS · 2025');
    },
  },

  nyc: {
    hud: { clock: 'OCT 2025', beat: 'Same lens: New York', price: `83¢ → <b>94¢</b>` },
    state: () => smallMultiples(N, gridRectSquare(), [
      { price: 0.80, fair: null }, { price: 0.84, fair: null }, { price: 0.94, fair: null },
    ]),
    chart: false,
    anno: g => {
      const r = gridRectSquare();
      const gap = r.w * 0.08, colW = (r.w - gap * 2) / 3;
      const cx = k => r.x + k * (colW + gap) + colW / 2;
      const yFor = p => r.y + r.h * (1 - p);
      [['SEP 11', 0.80, '80¢'], ['SEP 29', 0.84, '84¢'], ['OCT 31', 0.94, '94¢']].forEach(([d, p, l], k) => {
        callout(g, cx(k), yFor(p) - 26, d, { anchor: 'middle', size: 11.5 });
        callout(g, cx(k), yFor(p) - 10, l, { anchor: 'middle', mono: true, size: 13, fill: '#e8e4d8' });
      });
      callout(g, cx(1), yFor(0.84) - 58, ['Adams withdraws; the “threat”', 'lands, and the price goes UP'], { anchor: 'middle', size: 11 });
      callout(g, cx(2), yFor(0.94) - 44, 'no news; just clock', { anchor: 'middle', size: 11 });
      stamp(g, r.x, r.y + r.h + 18, 'real', 'REAL · ARCHIVED KALSHI PAGES + DATED PRESS · 2025');
    },
  },

  coda: {
    hud: { clock: '—', beat: 'Understanding is metaphor', price: `26¢ ≠ <b>26¢</b>` },
    state: () => twinGlyphs(N, { x: region.x, y: region.y + region.h * 0.2, w: region.w, h: region.h * 0.5 }, { yesCount: 2600, hotLate: Math.round((0.26 - FAIR90) * N) }),
    chart: false,
    anno: g => {
      const y = region.y + region.h * 0.78;
      callout(g, region.x + region.w * 0.23, y, 'capability', { anchor: 'middle', size: 12.5, fill: '#7bc8e8' });
      callout(g, region.x + region.w * 0.77, y, 'survival · with its band of feeling', { anchor: 'middle', size: 12.5, fill: '#f2a03d' });
      callout(g, region.x + region.w / 2, y + 34, 'the same 2,600 units, twice', { anchor: 'middle', size: 11.5 });
    },
  },
};

/* ---------------------------------------------------------------- */
/* HUD                                                               */
const hudClock = document.getElementById('hud-clock');
const hudBeat = document.getElementById('hud-beat');
const hudPrice = document.getElementById('hud-price');
function setHud(h) {
  hudClock.textContent = h.clock;
  hudBeat.textContent = h.beat;
  hudPrice.innerHTML = h.price;
}

/* ---------------------------------------------------------------- */
/* Activation                                                        */
let currentBeat = null;
function activate(name) {
  if (name === currentBeat || !BEATS[name]) return;
  currentBeat = name;
  console.log('[26c] beat', name);
  const b = BEATS[name];
  setHud(b.hud);
  if (engine) engine.transitionTo(b.state(), { duration: DUR });
  if (b.chart) showChart(b.chart, b.model); else hideChart();
  setAnno(b.anno);
}

function repaint() {
  // hard resize: rebuild current state with no tween, redraw chart geometry
  computeRegions();
  if (engine) engine.resize(W, H);
  svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);
  if (chartG) { chartG.remove(); chartG = null; modelG = null; svg.selectAll('defs').remove(); }
  const name = currentBeat;
  currentBeat = null;
  if (name) {
    const b = BEATS[name];
    setHud(b.hud);
    if (engine) engine.setState(b.state());
    if (b.chart) { ensureChart(); showChart(b.chart, b.model); } else hideChart();
    setAnno(b.anno);
    currentBeat = name;
  }
}

/* ---------------------------------------------------------------- */
/* Boot                                                              */
computeRegions();
if (engine) engine.resize(W, H);
svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);

// First paint: set, don't transition (d3 brief: never animate initial render)
if (engine) engine.setState(BEATS.hero.state());
setHud(BEATS.hero.hud);
currentBeat = 'hero';

/* Beat activation: a passive scroll listener + rAF, not IntersectionObserver.
 * IO notifications ride the main-thread rendering steps, and on a static page
 * Chrome scrolls on the compositor — observations can arrive seconds late.
 * The rule is explicit and direction-symmetric: the active beat is the LAST
 * card whose top has crossed 60% of the viewport height. */
const cardEls = Array.from(document.querySelectorAll('.card[data-beat]'));
function computeActiveBeat() {
  const marker = window.innerHeight * 0.60;
  let active = 'hero';
  for (const el of cardEls) {
    if (el.getBoundingClientRect().top < marker) active = el.dataset.beat;
    else break;
  }
  activate(active);
}
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => { scrollTick = false; computeActiveBeat(); });
}, { passive: true });
computeActiveBeat();

let resizeT = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(repaint, 160);
});

// Console self-check for the build log (also useful in verification)
console.log('[26c] model calibration', {
  lamARG: +CAL.lamA.toFixed(3), lamSUI: +CAL.lamB.toFixed(3),
  kickoffAdvance: +KICK.pAdvance.toFixed(4), fair90: +FAIR90.toFixed(4),
});

// Deterministic hook for tests and debugging (not used by the page itself)
window.__kalshi = {
  activate,
  beats: Object.keys(BEATS),
  get current() { return currentBeat; },
};
