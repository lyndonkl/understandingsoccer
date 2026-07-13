/* orderbook.js — REAL order book snapshot (not modeled).
 * Market: KXWCADVANCE-26JUL15ENGARG-ENG — "Will England advance past
 * Argentina?" (World Cup semifinal, July 15 2026).
 * Pulled 2026-07-13T06:26:01Z from the public Kalshi API:
 *   GET /trade-api/v2/markets/KXWCADVANCE-26JUL15ENGARG-ENG/orderbook?depth=6
 * Raw response saved at research/data/engarg-orderbook.json.
 * A NO bid at (1-P) is the matching side of a YES ask at P; sizes carry over.
 */
export const ORDERBOOK = {
  ticker: 'KXWCADVANCE-26JUL15ENGARG-ENG',
  question: 'Will England advance past Argentina?',
  pulledUtc: '2026-07-13 06:26 UTC',
  lastPrice: 0.55,
  // [price_dollars, resting_contracts]
  yesBids: [
    [0.54, 710793], [0.53, 260075], [0.52, 345665],
    [0.51, 127408], [0.50, 3848], [0.49, 3211],
  ],
  yesAsks: [
    [0.55, 7872155], [0.56, 2060950], [0.57, 215266],
    [0.58, 147004], [0.59, 14726], [0.60, 12841],
  ],
};
