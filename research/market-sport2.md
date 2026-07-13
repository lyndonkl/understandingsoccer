# Second sport market: Knicks 2026 NBA Championship (KXNBA-26-NYK)

**Researched:** 2026-07-13. Second worked example for the scrollytelling page (different sport
from the Argentina–Switzerland soccer spine).

## Market identification (Kalshi API, verified 2026-07-13)

- **Series:** `KXNBA` — "Pro Basketball Champion"
- **Event:** `KXNBA-26` — "2026 Pro Basketball Champion"
- **Market ticker:** `KXNBA-26-NYK` — "Will New York win the 2026 Pro Basketball Finals?"
- **Result:** `yes`. Open `2025-07-12T14:00:00Z`, closed `2026-06-14T03:32:24Z`.
- **Volume:** $72,138,070.47 (volume_fp); open interest at settlement $28,095,272.75.
- Source: `GET /markets?event_ticker=KXNBA-26` → `research/data/kxnba26_markets.json`

Note: Super Bowl LX (candidate #1) was tried first and is a **dead end on the API**: event
`KXSB-26` ("2026 Pro Football Championship: Seattle vs New England, On Feb 8 2026") still
exists, but its markets list returns empty and candlestick/trade queries return not_found —
markets settled in February 2026 appear archived. Raw pulls kept in
`research/data/kxsb26_event.json`, `kxsb26_markets.json`.

## Verified event timeline (web sources)

- **Regular season / seeding:** Knicks were the East #3 seed; Spurs the West #2 seed with
  home-court advantage in the Finals. (Wikipedia, 2026 NBA Finals)
- **First round (vs Atlanta, won 4–2):** Knicks won G1 113–102, then lost G2 107–106 and
  G3 109–108 (G3 on **April 23**) to trail the series 1–2; they closed with wins of 114–98,
  126–97, and 140–89, the last including a record 47-point halftime margin. (NBA.com /
  Basketball-Reference / ESPN via search)
- **Conference semifinals:** swept Philadelphia 4–0. (NBA.com)
- **Eastern Conference Finals:** swept Cleveland 4–0, clinching **May 25** with a 130–93
  rout — first Finals berth since 1999. (CNN, ESPN recap, Olympics.com)
- **NBA Finals vs San Antonio (won 4–1, June 3–13):**
  - **G1, Jun 3 @ SA:** NY 105–95 — overcame a 14-point first-quarter deficit.
  - **G2, Jun 5 @ SA:** NY 105–104 — decided by a late Wembanyama turnover.
  - **G3, Jun 8 @ NY:** SA 115–111 — ended the Knicks' 13-game postseason win streak.
  - **G4, Jun 10 @ NY:** NY 107–106 — **29-point comeback, the largest in Finals history**;
    Spurs led 76–52 with 9:27 left in Q3; OG Anunoby game-winning tip-in with 1.2 s left.
  - **G5, Jun 13 @ SA:** NY 94–90 — Brunson 45 points (franchise playoff record), Finals
    MVP (32.6 ppg). First Knicks title in 53 years (since 1973).
  (Wikipedia 2026 NBA Finals; ESPN)

## Verified price path (Kalshi candlesticks API; prices in dollars per $1 contract)

All from `GET /series/KXNBA/markets/KXNBA-26-NYK/candlesticks`. Timestamps are UTC candle
periods (`end_period_ts` = end of period). US evening games span into the next UTC day.

### Season arc (daily candles, `period_interval=1440` → `kxnba26_nyk_daily.json`)

| Date (UTC) | O | C | Low | High | Context (verified separately) |
|---|---|---|---|---|---|
| 2026-04-01 | .05 | .04 | .04 | .05 | Pre-playoff baseline: a 4–5¢ team |
| 2026-04-24 | .04 | **.02** | **.01** | .04 | Night of G3 loss to Atlanta (Apr 23 ET); down 1–2 in round one after back-to-back one-point losses |
| 2026-05-05 | .09 | .10 | .07 | .10 | Through round one / into semis vs 76ers |
| 2026-05-26 | .25 | **.29** | .25 | .30 | After May 25 ECF sweep of Cleveland: Finals-bound, waiting |
| 2026-06-03 | .37 | **.37** | .36 | .37 | Finals eve/day: settled underdog price vs Spurs |
| 2026-06-04 | .36 | .54 | **.23** | .62 | G1 night: down 14 in Q1 (low 23¢) → won 105–95 |
| 2026-06-06 | .54 | .80 | .47 | .82 | G2 night: 105–104 escape → 2–0 |
| 2026-06-09 | .77 | .63 | .57 | .80 | G3 night: loss, streak ends → 2–1 |
| 2026-06-11 | .63 | .81 | **.30** | .84 | G4 night: down 29 (low 30¢) → historic comeback, 3–1 |
| 2026-06-14 | .79 | **.99** | .70 | .99 | G5 night: Brunson 45, title clinched |

### Game 4 in minutes (`period_interval=1`, Jun 11 00:00–06:00 UTC → `kxnba26_nyk_min_g4.json`)

- **01:20 UTC** — session low **30¢** (open of night: 62–63¢) as San Antonio built the lead.
- **01:54–02:24 UTC** — a long shelf of **37¢** prints (closes at exactly .3700 in 20+
  separate minute candles) while the comeback was underway.
- **03:00–05:00 UTC hours** — 38¢ → high **84¢**, closing the night at 81¢ after the
  Anunoby tip-in with 1.2 s left (hourly file `kxnba26_nyk_hourly_finals.json`).

### Game 1 in minutes (`kxnba26_nyk_min_g1.json`)

- **01:11–01:13 UTC Jun 4** — lows of **23¢** (from 37–38¢ an hour earlier) during the
  early 14-point deficit; night closed 54¢ after the 105–95 win.

## The lens this supports

**Primary: (a) SAME NUMBER, DIFFERENT STATE — 37¢ twice.**

- **37¢ on June 3 (all day, hourly candles 17:00–23:00 UTC all 36–37¢):** the *capability*
  price. A #3 seed without home court, priced coldly against a full seven-game series —
  hours of flat, low-variance trade.
- **37¢ on June 11 ~01:54–02:24 UTC (Game 4 in progress):** the *survival* price. The same
  number, printed on the way back up from a 29-point hole, minutes-to-hours from either a
  2–2 series or the greatest Finals comeback ever. Reached from above (62¢ → 30¢ → 37¢),
  volatile, sentiment-laden.

This mirrors the page's kickoff-26¢ vs late-game-26¢ structure almost exactly, with a second
supporting pair: **~29–30¢ on May 26** (just swept into the Finals, idle favorite-in-waiting)
vs **30¢ at 01:20 UTC June 11** (down 29 in Finals G4).

**Secondary: series-arc grind** — 37¢ → 54¢ → 80¢ → 63¢ → 81¢ → 99¢, one step per game on
the published schedule, with the 1¢ April near-death as the origin of the whole arc.

## Real vs. modeled

Every price above is **real Kalshi trade data** from the public API (raw JSON under
`research/data/`). Event facts are from the web sources below. Nothing modeled.

## Unverifiable / caveats

- Exact game-clock ↔ candle-timestamp alignment (e.g., that the 01:20 UTC 30¢ low coincides
  with the precise 76–52 moment) is inferred from candle shape, not verified — tip-off
  times were not confirmed and no play-by-play-to-timestamp mapping was opened.
- Super Bowl LX Kalshi prices: unrecoverable from the public API (markets archived); no
  in-game price data verified for it.
- Exact calendar date of Hawks–Knicks Game 2 (only G3 = April 23 verified).

## Sources

- Kalshi public API (opened via curl, 2026-07-13):
  `https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXNBA-26`;
  `.../series/KXNBA/markets/KXNBA-26-NYK/candlesticks` at `period_interval` 1440/60/1;
  `.../events?series_ticker=KXSB` (Super Bowl dead-end). Raw pulls in `research/data/`.
- https://en.wikipedia.org/wiki/2026_NBA_Finals (game-by-game results, deficits, MVP)
- https://www.espn.com/nba/story/_/id/48419498/nba-playoffs-2026-play-finals-schedule-scores-news-highlights-bracket-dates (first-round results, G3 April 23)
- https://www.cnn.com/2026/05/25/sport/knicks-sweep-cavaliers-eastern-conference-finals (ECF sweep, May 25)
- https://www.espn.com/nba/recap/_/gameId/401873344 (ECF clincher 130–93)
- https://www.nba.com/news/knicks-76ers-2026-playoffs-game-4-takeaways (semifinal sweep)
- Super Bowl LX verification (candidate #1, not used):
  https://www.espn.com/nfl/game/_/gameId/401772988/seahawks-patriots ;
  https://en.wikipedia.org/wiki/Super_Bowl_LX
