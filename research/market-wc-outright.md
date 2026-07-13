# Kalshi Market Research: 2026 World Cup Outright Winner

**Series:** `KXMENWORLDCUP` — "Men's World Cup winner" (Kalshi API, `/series/KXMENWORLDCUP`)
**Event:** `KXMENWORLDCUP-26` — "2026 FIFA World Cup Winner"
**Market tickers:** `KXMENWORLDCUP-26-{COUNTRY}` (e.g. `-AR` Argentina, `-FR` France, `-ES` Spain, `-GB` England, `-NO` Norway, `-DE` Germany, `-BR` Brazil, `-CH` Switzerland)
**Research date:** 2026-07-13

> Note: a series `KXMWORLDCUP` also exists with the same title but returns **zero events and zero markets** from the API. The live market is under `KXMENWORLDCUP`. Confirmed via `GET /events?series_ticker=KXMENWORLDCUP&with_nested_markets=true`.

As of 2026-07-13, exactly four team markets remain `active` (the semifinalists): France, Spain, England, Argentina. All others are `finalized`. Semifinals: **France vs Spain** (Arlington, TX) and **England vs Argentina** (Atlanta) — verified via Yahoo Sports/NPR (sources below).

## Data provenance

All prices are from the public Kalshi API (`https://api.elections.kalshi.com/trade-api/v2`), candlesticks endpoint, pulled 2026-07-13. Raw JSON saved to:

- `research/data/kxmenworldcup_events.json` — full event + market list
- `research/data/wc_outright_{AR,FR,ES,GB,BR,MA,NO,PT,DE,CH}_daily.json` — daily (1440-min) candles, 2026-05-25 → 2026-07-13
- `research/data/wc_outright_{AR,GB,NO,CH}_hourly_jul11.json` — hourly candles for quarterfinal day, July 11 ET

**Timestamp convention:** daily candles end at 04:00 UTC = **midnight ET**, so each daily candle covers one US calendar day (the day matches are played). All dates below are ET match days. Prices in cents (yes-price = implied probability to win the tournament).

## Daily close prices (¢), selected days

| ET day | Context | AR | FR | ES | GB | BR | NO | DE | CH |
|---|---|---|---|---|---|---|---|---|---|
| Jun 10 | eve of opener | 8.8 | 16.0 | 17.6 | 10.8 | 8.9 | 2.5 | 5.6 | 1.0 |
| Jun 15 | Spain 0-0 Cape Verde | 8.3 | 18.0 | **14.3** | 10.3 | 6.6 | 2.6 | 6.2 | 0.7 |
| Jun 29 | Germany out (R32) | 21.3 | 29.8 | 10.8 | 9.4 | 6.8 | 2.0 | **0.1** | 0.9 |
| Jul 2 | mid-knockouts | **18.4** | 34.0 | 12.1 | 7.6 | 6.5 | 1.8 | — | 0.9 |
| Jul 5 | Norway 2-1 Brazil (R16) | 18.1 | 35.0 | 12.2 | 14.0 | **0.1** | **5.4** | — | 0.8 |
| Jul 9 | France 2-0 Morocco (QF) | 18.5 | **40.1** | 17.1 | 15.6 | — | 6.4 | — | 1.8 |
| Jul 10 | eve of last QFs | **18.4** | 38.1 | 21.0 | 14.8 | — | 6.5 | — | 1.9 |
| Jul 11 | ENG 2-1 NOR aet; ARG bt SUI | 20.9 | 39.4 | 20.1 | **20.5** | — | **0.1** | — | 0.1 |
| Jul 13 | pre-semifinals | 18.1 | 39.7 | 20.8 | 21.6 | — | — | — | — |

(Full 50-day table reproducible from the saved JSON.)

## Lens fit: (a) SAME NUMBER, DIFFERENT STATE — strong. Three verified pairs.

### Pair 1 (best, and it hooks directly into the page's ARG-SUI centerpiece): Argentina 18.4¢ twice

- **Jul 2 ET close: 18.4¢** — Argentina had the entire remaining gauntlet ahead (round of 16 not yet played; **four** wins needed). Candle ending 2026-07-03T04:00Z.
- **Jul 10 ET close: 18.4¢** — midnight before the Switzerland quarterfinal. Open 18.4, close 18.4, dead flat all day (hourly candles: 18.3–18.8 for 17 straight hours). Now only **three** wins needed.

Same number, one full round survived. Proximity bought Argentina nothing because the rest of the bracket hardened around them: France went 34.0 → 40.1 (thrashing Morocco 2-0 in their QF), and the eventual semifinal opponent England sat waiting. 18.4¢ on Jul 2 priced *capability across four matches*; 18.4¢ on Jul 10 priced *three matches against a much stronger conditional field*. The market did the per-match arithmetic invisibly and landed on the identical number.

Then, during the Switzerland QF itself (Jul 11, ~9pm ET kickoff), the **outright** market breathed with the match: hourly lows of 16.2¢ (21:00 candle), 13.0¢ (23:00), 12.0¢ (00:00 candle) — while Switzerland's outright spiked from 1.7¢ to an intraday high of **3.5¢** — before Argentina's advance closed the day at 20.9¢ on 3.96M contracts, its highest daily volume of the tournament. This is the same match as the page's central 26¢ advance-market example, seen through the tournament-winner lens: the advance market asked "who survives tonight?", the outright asked "who lifts the trophy?", and both convulsed on the same red card.

### Pair 2: England ~10.8¢ at kickoff vs Spain ~10.8¢ in the knockouts

- **Jun 10-11 ET: England 10.7-10.8¢** — tournament about to start, seven matches from the trophy. Pure pre-tournament capability.
- **Jun 29-30 ET: Spain 10.4-10.8¢** — the reigning European champion, already through the group stage (five matches from the trophy) but wounded: held 0-0 by debutant Cape Verde on Jun 15 (17.0 → 14.3 that day, then drifting to ~10 by the round of 32).

Same number: a fresh favorite seven wins away vs a damaged favorite five wins away. Distance-to-trophy and confidence traded off exactly.

### Pair 3: Germany ~6¢ vs Norway ~6.5¢

- **Jun 15-16 ET: Germany 6.1-6.2¢** — four-time champion, mid-group-stage. The 6¢ is brand-name capability across the whole tournament.
- **Jul 10-11 ET (pre-QF): Norway 6.4-6.5¢** — a team at its first World Cup in 28 years, three wins from the trophy, having just knocked out Brazil behind Haaland's late double.

Same ~6¢: one is a blue-chip's *a priori* class, the other a dark horse's *earned proximity*. Germany's 6¢ resolved to 0.1 in a single evening (Jun 29, penalty loss to Paraguay in the R32, intraday high 5.3 → close 0.1); Norway's 6.5¢ died the same way (Jul 11: intraday high 10.0¢ while leading England 1-0, then 0.1 by the 20:00 ET candle).

## Round-by-round steps (all results web-verified)

| ET date | Verified event | Price step (daily candle) |
|---|---|---|
| Jun 15 | Spain 0-0 Cape Verde, group H opener (ESPN) | ES 17.0 → 14.3 (-2.7); ES had opened the tournament at 17.6, the field's co-favorite |
| Jun 29 | Germany 1-1 Paraguay, out on penalties, R32 (ESPN/CBS) | DE 3.7 → **0.1**; intraday high 5.3 during the match. First powerhouse eliminated |
| Jul 5 | Norway 2-1 Brazil, R16, Haaland 86'/89' (ESPN/Al Jazeera) | NO 1.6 → **5.4** (3.4x, 6.1M vol); BR 6.7 → **0.1** the same candle |
| Jul 9 | France 2-0 Morocco, QF (NPR/FIFA) | FR 33.2 → **40.1** (intraday low 28.0 — a mid-match scare); MA → 0.1 |
| Jul 11 | England 2-1 Norway aet, QF, Bellingham x2 (ESPN/NPR/Al Jazeera) | GB open 14.7, **intraday low 8.0 while trailing**, close 20.5; NO intraday **high 10.0** (briefly priced above England), close 0.1 on 8.4M vol — Norway's largest volume day |
| Jul 11 | Argentina beats Switzerland, QF (NBC live blog; page centerpiece) | AR open 18.4, intraday low 12.0, close 20.9 on 3.96M vol (AR's max); CH intraday high 3.5 → 0.1 |

The Jul 11 England-Norway hourly tape is a gift: at the 18:00-19:00 ET candles (Norway leading 1-0), England-to-win-it-all traded down to **8.0¢** and Norway up to **10.0¢** — for roughly an hour the dark horse's trophy price exceeded the favorite's. Two hours later: 20.5 vs 0.1.

## Which lens the data supports

**(a) Same number, different state — strongly.** Three clean pairs, the best of which (Argentina 18.4/18.4) is the tournament-length echo of the page's central 26¢/26¢ advance-market example and even shares its match. **(b) Time decay — weakly:** the outright does not drift on clock; it steps on results and re-prices on bracket shape (e.g., England 10.8 → 6.5 between Jun 10 and Jul 4 despite advancing, then doubling on one R16 evening). Recommend lens (a).

## Unverifiable / flagged

- **Cause of Argentina's Jun 27-28 jump (15.8 → 22.3)**: not verified against a specific result; do not attribute without checking Argentina's group-finale/bracket news.
- **Argentina's R32/R16 opponents and dates**: not web-verified in this pass (AR's price was nearly flat Jul 4-7, suggesting heavily-favored wins, but that is inference).
- **Intraday event-to-price alignment** (e.g., GB's 8.0¢ low occurring exactly while Norway led): the hourly candles bracket the match window and the match narrative (Schjelderup opener, Bellingham equalizer, extra-time winner) is verified, but tick-level goal-time alignment was not done. Safe to state as "during the match"; do not claim exact minutes without pulling `/markets/trades`.
- Candle `mean`/`volume` fields are exchange-computed; volumes quoted are `volume_fp` (contract units per Kalshi API, unaudited).

## Sources

- Kalshi API: `GET /series/KXMENWORLDCUP`, `GET /events?series_ticker=KXMENWORLDCUP&with_nested_markets=true`, `GET /series/KXMENWORLDCUP/markets/KXMENWORLDCUP-26-{XX}/candlesticks` (raw pulls in `research/data/`)
- Germany out: [ESPN — Germany dumped out of World Cup by Paraguay on penalties](https://www.espn.com/soccer/story/_/id/49220268/germany-dumped-world-cup-paraguay-penalties); [CBS Sports live](https://www.cbssports.com/soccer/news/germany-vs-paraguay-live-updates-world-cup-2026-score-result/live/); [FIFA match centre](https://www.fifa.com/en/match-centre/match/17/285023/289287/400021513)
- Spain 0-0 Cape Verde: [ESPN final score, Jun 15 2026](https://www.espn.com/soccer/match/_/gameId/760428/cape-verde-spain)
- Norway 2-1 Brazil: [ESPN game analysis, Jul 5 2026](https://www.espn.com/soccer/report/_/gameId/760504); [Al Jazeera live blog](https://www.aljazeera.com/sports/liveblog/2026/7/5/brazil-vs-norway-live-fifa-world-cup-2026-last-16); [FIFA match centre](https://www.fifa.com/en/match-centre/match/17/285023/289288/400021532)
- France 2-0 Morocco (QF): [NPR, Jul 9 2026](https://www.npr.org/2026/07/09/nx-s1-5887619/2026-world-cup-fifa-france-morocco-quarterfinal); [FIFA match centre](https://www.fifa.com/en/match-centre/match/17/285023/289289/400021536)
- England 2-1 Norway aet (QF): [ESPN final score, Jul 11 2026](https://www.espn.com/soccer/match/_/gameId/760512/england-norway); [NPR](https://www.npr.org/2026/07/11/nx-s1-5890169/2026-world-cup-fifa-england-norway-quarterfinal); [Al Jazeera live blog](https://www.aljazeera.com/sports/liveblog/2026/7/11/england-vs-norway-live-fifa-world-cup-2026-quarterfinal)
- Semifinal matchups (FRA-ESP, ENG-ARG): [Yahoo Sports bracket](https://sports.yahoo.com/soccer/article/world-cup-semifinals-bracket-full-schedule-matchups-and-path-to-the-final-164942403.html); [NBC News live blog, Jul 11](https://www.nbcnews.com/sports/soccer/live-blog/fifa-world-cup-games-2026-july-11-live-updates-rcna385914)
