/* tape.js — REAL public trade tape (not modeled).
 * ENGARG prints: GET /trade-api/v2/markets/trades?ticker=
 *   KXWCADVANCE-26JUL15ENGARG-ENG, pulled 2026-07-13 16:23 UTC.
 * All 30 most-recent prints were taker_side=yes at $0.55 — buyers crossing
 * the spread and accepting the resting 55c ask. Raw: research/data/.
 * EQUALIZER_WINDOW: trades on KXWCADVANCE-26JUL11ARGSUI-SUI between
 * 02:29:00-02:32:00 UTC Jul 12 (the API returned its 1000-trade page cap
 * for that 3-minute window; range shown is of that page).
 */
export const TAPE = {
  ticker: 'KXWCADVANCE-26JUL15ENGARG-ENG',
  pulledUtc: '2026-07-13 16:23 UTC',
  allTakerYes: true,
  prints: [{"t":"16:23:06 UTC","price":0.55,"count":88.1,"taker":"yes"},{"t":"16:23:01 UTC","price":0.55,"count":14.0,"taker":"yes"},{"t":"16:22:51 UTC","price":0.55,"count":59.0,"taker":"yes"},{"t":"16:22:42 UTC","price":0.55,"count":352.5,"taker":"yes"},{"t":"16:22:34 UTC","price":0.55,"count":909.1,"taker":"yes"},{"t":"16:21:25 UTC","price":0.55,"count":10.0,"taker":"yes"},{"t":"16:21:25 UTC","price":0.55,"count":78.0,"taker":"yes"},{"t":"16:21:13 UTC","price":0.55,"count":10.0,"taker":"yes"},{"t":"16:21:08 UTC","price":0.55,"count":63.5,"taker":"yes"},{"t":"16:20:58 UTC","price":0.55,"count":70.5,"taker":"yes"},{"t":"16:20:57 UTC","price":0.55,"count":8.8,"taker":"yes"},{"t":"16:20:43 UTC","price":0.55,"count":35.2,"taker":"yes"},{"t":"16:20:40 UTC","price":0.55,"count":8.8,"taker":"yes"},{"t":"16:20:39 UTC","price":0.55,"count":5.3,"taker":"yes"}],
};

export const EQUALIZER_WINDOW = {
  ticker: 'KXWCADVANCE-26JUL11ARGSUI-SUI',
  window: '02:29\u201302:32 UTC',
  tradesAtLeast: 1000,
  pageCapHit: true,
  priceMinInPage: 0.25,
  priceMaxInPage: 0.32,
};
