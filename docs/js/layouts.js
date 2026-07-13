/* layouts.js — pure, deterministic layout functions for the unit population.
 *
 * Every function returns a full state { x, y, color, size } for all N units.
 * No RNG: jitter comes from integer hashes of unit identity, so every load
 * and every scrub replays identically.
 *
 * Group semantics (≤4 per beat, cognitive brief):
 *   YES-cold  — price mass the model accounts for
 *   YES-hot   — price mass above the model baseline (the sentiment band)
 *   NO        — the complement, dim
 *   context   — de-emphasized background population
 */

export const PALETTE = {
  cold: [0x7b / 255, 0xc8 / 255, 0xe8 / 255],
  heat: [0xf2 / 255, 0xa0 / 255, 0x3d / 255],
  alarm: [0xe4 / 255, 0x57 / 255, 0x2e / 255],
  chalk: [0xe8 / 255, 0xe4 / 255, 0xd8 / 255],
  dim: [0x98 / 255, 0xa0 / 255, 0x92 / 255],
};

function hash01(i, salt) {
  // Math.imul keeps the multiplies exact in 32 bits; a plain * overflows
  // double precision and silently biases the hash.
  let h = (Math.imul(i, 2654435761) + Math.imul(salt, 40503)) | 0;
  h ^= h >>> 15; h = Math.imul(h, 2246822519);
  h ^= h >>> 13; h = Math.imul(h, 3266489917);
  h ^= h >>> 16;
  return ((h >>> 8) & 0xffffff) / 16777216;
}

export function blankState(N) {
  return {
    x: new Float32Array(N),
    y: new Float32Array(N),
    color: new Float32Array(N * 4),
    size: new Float32Array(N),
  };
}

function paint(state, i, rgb, alpha) {
  state.color[i * 4] = rgb[0];
  state.color[i * 4 + 1] = rgb[1];
  state.color[i * 4 + 2] = rgb[2];
  state.color[i * 4 + 3] = alpha;
}

/* ------------------------------------------------------------------ */
/* Hero: loose constellation drifting over the whole stage             */
export function fieldScatter(N, rect, opts = {}) {
  const s = blankState(N);
  for (let i = 0; i < N; i++) {
    s.x[i] = rect.x + hash01(i, 1) * rect.w;
    s.y[i] = rect.y + hash01(i, 2) * rect.h;
    paint(s, i, PALETTE.dim, opts.alpha !== undefined ? opts.alpha : 0.35);
    s.size[i] = 2.4;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* Beat 1: 100 x 100 world grid. Unit i -> column floor(i/100), row i%100.
 * Columns fill left->right, so the first `yesCount` units occupy the
 * leftmost columns: the price boundary is a vertical line at x = price. */
export function worldGrid(N, rect, { yesCount, hotCount = 0, dimNo = false }) {
  const s = blankState(N);
  const cols = 100, rows = N / 100;
  const cw = rect.w / cols, ch = rect.h / rows;
  const sz = Math.max(Math.min(cw, ch) * 0.62, 1.6);
  for (let i = 0; i < N; i++) {
    const col = Math.floor(i / rows);
    const row = i % rows;
    s.x[i] = rect.x + (col + 0.5) * cw;
    s.y[i] = rect.y + rect.h - (row + 0.5) * ch; // fill bottom-up
    if (i < yesCount - hotCount) paint(s, i, PALETTE.cold, 0.95);
    else if (i < yesCount) paint(s, i, PALETTE.heat, 0.95);
    else paint(s, i, PALETTE.dim, dimNo ? 0.18 : 0.4);
    s.size[i] = sz;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* Beat "dice": the two Poisson marginals as unit-bar histograms.
 * Top block = team A's goal-count distribution (0..4+), bottom = team B's.
 * Half the population works each histogram; both use a common baseline so
 * bar heights read as position-on-common-scale. */
function largestRemainder(total, probs) {
  const raw = probs.map(p => p * total);
  const counts = raw.map(Math.floor);
  let short = total - counts.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < short; k++) counts[order[k % order.length].i]++;
  return counts;
}

export function marginalBars(N, rect, { probsA, probsB }) {
  const s = blankState(N);
  const half = Math.floor(N / 2);
  const bins = probsA.length;
  const binW = rect.w / bins;
  const rowH = rect.h * 0.40;
  const baseA = rect.y + rowH;             // top histogram baseline
  const baseB = rect.y + rect.h;           // bottom histogram baseline
  const size = 2.3;
  const step = size + 0.9;
  const cols = Math.max(Math.floor((binW * 0.7) / step), 6);

  function place(offset, count, alloc, base, rgb, alpha) {
    let cursor = offset;
    for (let b = 0; b < bins; b++) {
      const x0 = rect.x + b * binW + (binW - cols * step) / 2;
      for (let k = 0; k < alloc[b]; k++) {
        const i = cursor++;
        const gx = k % cols, gy = Math.floor(k / cols);
        s.x[i] = x0 + (gx + 0.5) * step;
        s.y[i] = base - (gy + 0.5) * step;
        paint(s, i, rgb, alpha);
        s.size[i] = size;
      }
    }
    return cursor;
  }
  const allocA = largestRemainder(half, probsA);
  const allocB = largestRemainder(N - half, probsB);
  let cursor = place(0, half, allocA, baseA, PALETTE.chalk, 0.75);
  place(cursor, N - half, allocB, baseB, PALETTE.cold, 0.9);
  return s;
}

/* ------------------------------------------------------------------ */
/* Beats 3 & 5: scoreline grid. cells: [{i, j, prob, yesFrac}] where
 * (i, j) are FINAL goals (capped at kMax for display), prob sums to 1,
 * and yesFrac is the fraction of that cell's worlds that end YES
 * (Switzerland advances). Allocation is largest-remainder deterministic. */
export function scorelineGrid(N, rect, { cells, kMax = 4, alloc }) {
  const s = blankState(N);
  const bins = kMax + 1;
  const cellW = rect.w / bins, cellH = rect.h / bins;
  // unit cursor walks cells in a fixed order; within a cell, mini-grid
  let cursor = 0;
  const placed = new Array(N);
  for (let c = 0; c < cells.length; c++) {
    const cell = cells[c];
    const count = alloc[c];
    if (!count) continue;
    const cx = rect.x + cell.j * cellW; // j = SUI goals -> x axis
    const cy = rect.y + rect.h - (cell.i + 1) * cellH; // i = ARG goals -> y up
    const yesN = Math.round(count * cell.yesFrac);
    const side = Math.ceil(Math.sqrt(count));
    const pad = 0.16;
    const innerW = cellW * (1 - 2 * pad), innerH = cellH * (1 - 2 * pad);
    const step = Math.min(innerW, innerH) / Math.max(side, 1);
    for (let k = 0; k < count; k++) {
      const idx = cursor + k;
      if (idx >= N) break;
      const gx = k % side, gy = Math.floor(k / side);
      s.x[idx] = cx + cellW * pad + (gx + 0.5) * step + (hash01(idx, 7) - 0.5) * step * 0.3;
      s.y[idx] = cy + cellH * pad + (gy + 0.5) * step + (hash01(idx, 8) - 0.5) * step * 0.3;
      // YES worlds first within the cell (they read as the "lit" fraction)
      if (k < yesN) paint(s, idx, PALETTE.cold, 0.95);
      else paint(s, idx, PALETTE.dim, 0.32);
      s.size[idx] = Math.max(Math.min(step * 0.7, 4.2), 1.5);
    }
    cursor += count;
  }
  // any remainder (shouldn't happen): park off the visible mass, dim
  for (; cursor < N; cursor++) {
    s.x[cursor] = rect.x + hash01(cursor, 9) * rect.w;
    s.y[cursor] = rect.y + rect.h + 40;
    paint(s, cursor, PALETTE.dim, 0);
    s.size[cursor] = 1.5;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* Beat 4: price column beside the timeline chart. Filled height = price.
 * First yesCount units stack bottom-up in a narrow column; the rest form
 * a dim reservoir block to the left (the NO mass), also stacked. */
export function priceColumn(N, rect, { price, fair = null, colW = 0.22 }) {
  const s = blankState(N);
  const yesCount = Math.round(price * N);
  const fairCount = fair === null ? yesCount : Math.round(fair * N);
  const colX = rect.x + rect.w * (1 - colW);
  const colWpx = rect.w * colW;
  const resWpx = rect.w * (1 - colW) - 14;
  // column: 40 units wide
  const cw = 40;
  const stepX = colWpx / cw;
  const rowsCol = Math.ceil(N / cw);
  const stepY = rect.h / rowsCol; // full population would fill the column
  for (let i = 0; i < N; i++) {
    if (i < yesCount) {
      const gx = i % cw, gy = Math.floor(i / cw);
      s.x[i] = colX + (gx + 0.5) * stepX;
      s.y[i] = rect.y + rect.h - (gy + 0.5) * stepY;
      // Units above the model's fair-value line render hot (the sentiment
      // band). The fair > price case (market below model) is drawn as a
      // hollow SVG bracket by the annotation layer, not with unit color.
      if (fair !== null && i >= fairCount && yesCount > fairCount) {
        paint(s, i, PALETTE.heat, 0.95);
      } else {
        paint(s, i, PALETTE.cold, 0.95);
      }
      s.size[i] = Math.max(Math.min(stepX, stepY) * 0.75, 1.8);
    } else {
      // NO reservoir: wide dim block anchored TOP-left, clear of the price
      // chart that occupies the bottom-left of the region during these beats
      const k = i - yesCount;
      const rw = 125;
      const gx = k % rw, gy = Math.floor(k / rw);
      s.x[i] = rect.x + (gx + 0.5) * (resWpx / rw);
      s.y[i] = rect.y + (gy + 0.5) * stepY;
      paint(s, i, PALETTE.dim, 0.16);
      s.size[i] = 1.8;
    }
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* Beats 0/5/10: dot-matrix glyph "26¢" built from the YES mass.
 * Each lit pixel of the 5x7 (6 wide for ¢) matrix becomes a chunky block
 * of units. hotCount of the yes units render hot, filling pixels from the
 * TOP of the glyph downward (the band sits visibly on top). */
const DOTFONT = {
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '¢': ['..#...', '.####.', '#.#...', '#.#...', '#.#...', '.####.', '..#...'],
};

export function glyphPixels(text) {
  // returns [{col,row}] pixel coords + total width in pixel units
  const pix = [];
  let ox = 0;
  for (const ch of text) {
    const bmp = DOTFONT[ch];
    if (!bmp) { ox += 3; continue; }
    const w = bmp[0].length;
    for (let r = 0; r < bmp.length; r++) {
      for (let c = 0; c < w; c++) {
        if (bmp[r][c] === '#') pix.push({ col: ox + c, row: r });
      }
    }
    ox += w + 1;
  }
  return { pix, width: ox - 1, height: 7 };
}

export function glyph(N, rect, { text, yesCount, hotCount = 0, contextAlpha = 0.1 }) {
  const s = blankState(N);
  const { pix, width, height } = glyphPixels(text);
  // pixels sorted top-to-bottom then left-to-right so hot fills from top
  const sorted = pix.slice().sort((a, b) => a.row - b.row || a.col - b.col);
  const scale = Math.min(rect.w / (width + 1), rect.h / (height + 1));
  const gx0 = rect.x + (rect.w - width * scale) / 2;
  const gy0 = rect.y + (rect.h - height * scale) / 2;
  // allocate yes units across pixels (largest remainder on equal weights)
  const base = Math.floor(yesCount / sorted.length);
  let extra = yesCount - base * sorted.length;
  const counts = sorted.map((_, k) => base + (k < extra ? 1 : 0));
  let cursor = 0;
  for (let p = 0; p < sorted.length; p++) {
    const { col, row } = sorted[p];
    const count = counts[p];
    const side = Math.ceil(Math.sqrt(count));
    const inner = scale * 0.78;
    const step = inner / Math.max(side, 1);
    for (let k = 0; k < count; k++) {
      const i = cursor + k;
      const ggx = k % side, ggy = Math.floor(k / side);
      s.x[i] = gx0 + col * scale + (scale - inner) / 2 + (ggx + 0.5) * step;
      s.y[i] = gy0 + row * scale + (scale - inner) / 2 + (ggy + 0.5) * step;
      const hot = cursor + k < hotCount; // hot fills the top-first pixel order
      paint(s, i, hot ? PALETTE.heat : PALETTE.cold, 0.97);
      s.size[i] = Math.max(step * 0.8, 1.8);
    }
    cursor += count;
  }
  // the NO mass: faint field behind/below the glyph
  for (let i = cursor; i < N; i++) {
    s.x[i] = rect.x + hash01(i, 11) * rect.w;
    s.y[i] = rect.y + hash01(i, 12) * rect.h;
    paint(s, i, PALETTE.dim, contextAlpha);
    s.size[i] = 1.9;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* Beats 8/9: small-multiple columns for other markets.
 * markets: [{price, fair|null, label}] — population split evenly. */
export function smallMultiples(N, rect, markets) {
  const s = blankState(N);
  const K = markets.length;
  const per = Math.floor(N / K);
  const gap = rect.w * 0.08;
  const colW = (rect.w - gap * (K - 1)) / K;
  for (let m = 0; m < K; m++) {
    const mk = markets[m];
    const x0 = rect.x + m * (colW + gap);
    const yesCount = Math.round(mk.price * per);
    const fairCount = mk.fair === null ? yesCount : Math.round(mk.fair * per);
    const cw = 25;
    const stepX = colW / cw;
    const rows = Math.ceil(per / cw);
    const stepY = rect.h / rows;
    for (let k = 0; k < per; k++) {
      const i = m * per + k;
      const gx = k % cw, gy = Math.floor(k / cw);
      s.x[i] = x0 + (gx + 0.5) * stepX;
      s.y[i] = rect.y + rect.h - (gy + 0.5) * stepY;
      if (k < Math.min(fairCount, yesCount)) paint(s, i, PALETTE.cold, 0.95);
      else if (k < yesCount) paint(s, i, PALETTE.heat, 0.95);
      else paint(s, i, PALETTE.dim, 0.15);
      s.size[i] = Math.max(Math.min(stepX, stepY) * 0.72, 1.6);
    }
  }
  // leftovers invisible at the bottom edge
  for (let i = K * per; i < N; i++) {
    s.x[i] = rect.x + rect.w / 2;
    s.y[i] = rect.y + rect.h + 30;
    paint(s, i, PALETTE.dim, 0);
    s.size[i] = 1.5;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* Beat 10: two ghost glyphs side by side (kickoff mix vs late mix). */
export function twinGlyphs(N, rect, { yesCount, hotLate }) {
  const s = blankState(N);
  const half = Math.floor(yesCount / 2);
  const leftRect = { x: rect.x, y: rect.y, w: rect.w * 0.46, h: rect.h };
  const rightRect = { x: rect.x + rect.w * 0.54, y: rect.y, w: rect.w * 0.46, h: rect.h };
  const L = glyph(half, leftRect, { text: '26¢', yesCount: half, hotCount: 0 });
  const R = glyph(half, rightRect, { text: '26¢', yesCount: half, hotCount: Math.round(half * hotLate / yesCount) });
  for (let i = 0; i < half; i++) {
    s.x[i] = L.x[i]; s.y[i] = L.y[i]; s.size[i] = L.size[i];
    for (let c = 0; c < 4; c++) s.color[i * 4 + c] = L.color[i * 4 + c];
  }
  for (let i = 0; i < half; i++) {
    const t = half + i;
    s.x[t] = R.x[i]; s.y[t] = R.y[i]; s.size[t] = R.size[i];
    for (let c = 0; c < 4; c++) s.color[t * 4 + c] = R.color[i * 4 + c];
  }
  for (let i = half * 2; i < N; i++) {
    s.x[i] = rect.x + hash01(i, 21) * rect.w;
    s.y[i] = rect.y + hash01(i, 22) * rect.h;
    paint(s, i, PALETTE.dim, 0.08);
    s.size[i] = 1.8;
  }
  return s;
}
