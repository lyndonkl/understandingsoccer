# Verification record

## Round 2 — the six deepenings (2026-07-13, later the same day)

User feedback converted to a six-point goal; how each was met:

1. **Price formation.** The order-book beat now explains bids/asks/spread in
   plain terms, and a new "tape" beat shows 30 real prints (all taker-YES at
   55¢, public /markets/trades pull, timestamped) with the crossing mechanic
   and the level-consumption rule ("eat the 7.9M at 55¢ and the next print
   reads 56¢"). Verified by screenshot.
2. **Poisson → grid.** New "dice" beat: both marginals (λ 1.8 / 0.9) as
   unit-bar histograms with per-bin percentages, multiplying into the grid;
   the grid beat now states cell mass = row share × column share. The voice
   pass caught and fixed a data error: the modal cell is 1–0 (≈12%), not 1–1.
3. **Minute-10 math.** Card quantifies the state change (model ≈10¢ vs market
   12¢; remaining expected goals 1.6 vs 0.8; equalizer ≈54%; Argentina 83%
   regulation favorite replaces "almost never trails twice").
4. **Equalizer microstructure.** OHLC re-pulled: the 02:29 candle spans
   10–35¢ in one minute; a real high/low envelope now rides the price line,
   and the copy frames volume-with-range as disagreement, not bare emotion.
5. **Fair-value overlay.** Minute-by-minute model fair value (score, cards,
   clock only) drawn kickoff→settlement as a dashed line with amber/ice gap
   bands vs the traded price; minute↔UTC mapping labeled INFERRED with
   anchors at verified event candles. Trader-composition framing reworded to
   an explicit interpretation (Kalshi does not disclose composition).
6. **Pacing.** New "twoclocks" beat sits inside the 72'–90' stretch (story
   reading vs clock reading), one move per beat, cards ≤ ~120 words.

Copy pass enforced strategist-voice + slop-detector rules (zero em dashes in
prose/annotations, jargon defined or removed, topic-forward cards). A
three-agent fresh-eyes panel audited comprehension of the six questions,
voice compliance, and chip coverage; findings addressed before deploy.

## Round 1 — initial build

Date: 2026-07-13 (UTC). How each goal criterion was checked.

## 1. Object-constant unit rendering of the two 26¢ states

- Fixed population of 10,000 WebGL point sprites created once at boot
  (`docs/js/engine.js`); no unit is created or destroyed afterwards. Every
  beat change is `transitionTo` — per-identity attribute interpolation on the
  GPU with CPU retargeting on interrupt. There is no clear-and-redraw path in
  the codebase.
- Verified in Chrome (screenshots at every beat, plus mid-tween frames showing
  the same units in transit between layouts): kickoff capability state
  (scoreline grid, beat 3) and late-game survival state (dot-matrix 26¢
  glyph, beat 5) are both reconstitutions of the same population.
- The two 26¢ prices are REAL Kalshi 1-minute closes (25–26¢ pre-kickoff;
  26¢ at 03:05–03:06 UTC), not modeled — `research/soccer-market.md`,
  raw pulls in `research/data/`.

## 2. Rational-vs-emotional split visibly encoded

- Beat 6: price column with the model-justified mass in `--model` (ice) and
  the mass above the model's fair value in `--heat` (amber), always the top
  stratum — hue + position + direct labels (redundant coding, survives
  grayscale). Model fair value 17¢ [MODEL] vs traded 26¢ [REAL]; the 9¢ band
  is bracketed and labeled "feeling, or knowledge the model lacks," with the
  fee bound (≤1.75¢) stated. Verified by screenshot.
- Honesty guard: the card notes the gap ran the other way at the equalizer
  (market 32¢ below model 35%) — the split is an interpretation, not a fact.

## 3. Generalization to ≥2 other real Kalshi markets

- Government shutdown 2025 (`KXGOVSHUTLENGTH`): two real 17¢ prices —
  Sept 23 ">35 days" (settled YES) vs Nov 5 ">60 days" (settled NO), from
  Kalshi newsroom dated posts. `research/market-shutdown.md`.
- NYC mayor 2025 (`KXMAYORNYCPARTY-25-D`): real dated prices 80→84→94¢
  (archived Kalshi pages + dated press), the Adams-withdrawal structural
  release, October theta-decay. `research/market-backup.md`.
- A third verified market (June 2026 Fed decision, full candle history) is
  documented in `research/market-fed.md` as a spare.

## 4. GitHub Pages compatibility (no build step)

- `docs/` is served as-is: hand-written HTML/CSS/JS ES modules, vendored D3
  (`docs/vendor/d3.v7.min.js`), self-hosted woff2 fonts, inline shaders.
  No bundler, no transpiler, no CI step. Verified by serving with a plain
  static server (`python3 -m http.server`) and loading with zero console
  errors.
- Publish path: Settings → Pages → Deploy from a branch → `main` + `/docs`.

## Performance

- Node micro-benchmarks (N=10,000): every layout build ≤0.21 ms (beat-boundary
  cost), CPU retarget bake 0.07 ms, model calibration at boot 0.21 ms.
- Steady-state per frame: 4 uniform writes + one `drawArrays(POINTS, 10000)`;
  buffer uploads only at beat boundaries. Total site weight ~800 KB.
- Environment note: browser-automation verification ran in a hidden tab where
  Chrome suspends rAF entirely; this exposed and led to two robustness fixes
  (scroll-listener beat activation instead of IntersectionObserver;
  compositor-driven CSS transitions for annotation fades/chart reveal, which
  snap to end state on resume). End states of all 14 beats were verified by
  forced-frame screenshots; live 60fps motion should be spot-checked once in
  a visible tab: `python3 -m http.server 8000 --directory docs`.

## Data integrity

- Every on-page number carries a chip: REAL (recorded, sourced), MODEL
  (labeled model output), or INFERRED (stated alignment judgment). The
  methodology footer lists every source; full research notes with flagged
  unverifiable items live in `research/`.
