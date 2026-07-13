# Kalshi Fed-Rate-Decision Market — Generalization Example #1

**Research date:** 2026-07-12
**Data provenance:** All prices below are **real Kalshi market data** pulled from the public
Kalshi trade API (`api.elections.kalshi.com/trade-api/v2`, no auth). All event facts are
verified from opened web pages. Interpretation is labeled as interpretation. Anything that
could not be verified is listed in [Unverifiable / unexplained](#unverifiable--unexplained).

---

## 1. The market

| Field | Value | Source |
|---|---|---|
| Ticker | `KXFEDDECISION-26JUN-C25` | Kalshi API (market object) |
| Question | "Will the Federal Reserve Cut rates by 25bps at their June 2026 meeting?" | Kalshi API |
| Resolution rule | "If the Federal Reserve does a Cut of 25bps on June 17, 2026, then the market resolves to Yes." Mutually exclusive event with sibling markets: Cut >25bps, Maintain, Hike 25bps, Hike >25bps. | Kalshi API `rules_primary` / `rules_secondary` |
| Settlement source | Federal Reserve (federalreserve.gov) | Kalshi API (series object) |
| Opened | 2025-09-29 14:00 UTC (10 a.m. ET) | Kalshi API `open_time` |
| Closed / settled | 2026-06-17 17:59 UTC; settled 18:07 UTC | Kalshi API |
| Result | **NO** (settlement value $0.00; the Fed maintained 3.50–3.75%) | Kalshi API `result`, `settlement_value_dollars` |
| Sibling that paid | `KXFEDDECISION-26JUN-H0` "Fed maintains rate" → YES | Kalshi API |
| Lifetime volume | 9,796,684.97 contracts (`volume_fp`) | Kalshi API |
| Final open interest | 8,370,507.95 (`open_interest_fp`) | Kalshi API |

API endpoints used (opened via curl):
- `GET /trade-api/v2/markets/KXFEDDECISION-26JUN-C25` (market object, rules, result)
- `GET /trade-api/v2/series/KXFEDDECISION/markets/KXFEDDECISION-26JUN-C25/candlesticks?period_interval=1440` (261 daily candles, 2025-09-29 → 2026-06-16)
- Same endpoint with `period_interval=60` for intraday windows around events
- `GET /trade-api/v2/series/KXFEDDECISION` and `/events?series_ticker=KXFEDDECISION` (series metadata, meeting list)

**Candle convention (verified empirically):** Kalshi daily candles end at midnight
US/Eastern (end timestamps flip 04:00Z↔05:00Z exactly at the Nov 2, 2025 and Mar 8, 2026
DST transitions). All dates below are the **ET trading day**. Candle data also shows trades
on Saturdays/Sundays (weekend candles have volume), i.e. the market trades outside NYSE hours.

---

## 2. Why this market is a good "lens" example

Over its ~9-month life this single contract was, in sequence:

1. A bet on **the tail end of Jerome Powell's easing cycle** (autumn 2025),
2. A bet on **where the single projected 2026 cut would land** (winter),
3. A bet on **whether a Fed would cut into a war-driven oil shock** (March),
4. A bet on **whether a brand-new chair (Kevin Warsh) would cut at his first meeting** while the dot plot flipped toward a *hike* (April–June).

The number on the screen (44¢ → 63¢ → 16¢ → 1¢) never says which of these it is. That is
the page's core claim, and this market demonstrates it with real data.

---

## 3. Verified event timeline with price moves

All prices = daily close of `KXFEDDECISION-26JUN-C25` in cents (real Kalshi data).
"vol" = contracts traded that ET day; "OI" = open interest at day end.

### E0 — Market opens (Mon 2025-09-29)
- **Price:** first-day close **44¢** (day range 42–44¢, vol 400, OI 400). Next day 43¢.
- **State of the world:** The Fed's 2025 easing cycle was underway (it had cut in September; it would cut again in October and December — see E1). June 2026 was the 4th-of-8 FOMC meetings ahead.
- **Caveat (real data, honestly thin):** volumes were tens-to-hundreds of contracts and OI < 2,500 until late January 2026. Early closes are last-trade prices in a thin book.

### E1 — FOMC cuts 25bp (Wed 2025-12-10)
- **Event (verified):** FOMC lowered the target range 25bp to **3.50–3.75%**, with three dissents — Miran preferred a 50bp cut; Goolsbee and Schmid preferred no change (Federal Reserve statement, opened directly). Bloomberg's headline: "Fed Cuts Rates With 3 Dissents, Projects One Cut in 2026" — the December dot plot showed **just one more cut in 2026**.
- **Price move (real):** 46¢ → **60¢** close (+14). Hourly candles show the entire jump printed in the 19:00–20:00Z hour — right after the 2 p.m. ET statement, on just 32 contracts. Given back next day: **45¢** (vol 38). Thin, but the timing matches the decision to the hour.
- **Meaning at this point (interpretation):** with a cut delivered in December and one 2026 cut projected, "June" is one candidate slot for that single cut.

### E2 — FOMC holds; Powell says policy may not be restrictive (Wed 2026-01-28)
- **Event (verified):** FOMC held at 3.50–3.75% (statement opened via search; Miran and Waller dissented, preferring a cut). Powell at the presser: it was "hard to look at the data and say that policy is significantly restrictive right now" (J.P. Morgan meeting recap).
- **Price move (real):** 42¢ → **55¢** (+13), continuing to 57¢ the next day.
- **The seeming paradox (interpretation, data-backed):** a *hawkish hold* made this market go **up** — because the market is not "will the Fed cut?" in general; it is "will the cut land *on June 17*?" A January cut not happening pushes the probability mass of the year's single projected cut toward mid-year. Same news, opposite sign to the naive reading. This is the clearest "you cannot read the price without the event-state" moment in the series.

### E3 — Trump nominates Kevin Warsh as Fed chair (Fri 2026-01-30)
- **Event (verified):** Trump nominated Kevin Warsh to succeed Powell, whose chair term expired May 15 (CNN live coverage dated 01-30-26; Al Jazeera 2026-01-30).
- **Price move (real):** intraday **57¢ → 44¢ low → 57¢ close** (vol 1,493 — 8× the prior day). The market dipped hard on the news and fully recovered within the day.
- **Context (verified):** this landed 19 days after Powell's extraordinary Jan 11 statement that DOJ grand-jury subpoenas over his Senate renovation testimony were "an attempt to influence monetary policy through intimidation" (federalreserve.gov, opened directly). Fed-independence risk was live news while this market traded near 50¢.

### E4 — Delayed January CPI comes in cool (Fri 2026-02-13)
- **Event (verified):** BLS released January CPI on **Feb 13** (archive URL `cpi_02132026.htm`): headline **2.4% y/y**, down from 2.7% in December; +0.2% m/m; core 2.5% (BLS TED page title + CNBC). The release had been delayed by a partial government shutdown (CNBC).
- **Price move (real):** 51¢ → **56¢** (intraday high 67¢). The market then ground up to its **all-time closing high of 63¢ on Sun 2026-02-22** (thin weekend tape, vol 217).

### E5 — The Iran war repricing (Sat 2026-02-28 → Tue 2026-03-03)
- **Event (verified, Wikipedia "Economic impact of the 2026 Iran war"):** war began **Feb 28, 2026** with joint US-Israeli strikes; **Mar 2**: Brent +10–13% to ~$80–82; **Mar 4**: Strait of Hormuz closure, Brent past $120; by Mar 27 Brent $112.57, +55% from Feb 28's $72.48. Verified inflation aftermath: March CPI **3.3% y/y** vs 2.4% in February (CNBC); March PCE **3.5%**, ~3-year high (CNN).
- **Price move (real):** Feb 28 close 54¢ → Mar 1 **53¢** → Mar 2 **47¢** (−6) → Mar 3 **32¢** (−15, vol 4,085, the second-largest daily drop of the market's life). The mirror market `H0` ("maintain") rose 48¢ → 60¢ over the same two days.
- **Meaning at this point (interpretation):** an oil-supply shock is inflationary — a Fed facing 3%+ headline inflation doesn't deliver the mid-year cut. Half the contract's value evaporated in two trading days without the Fed saying a word.

### E6 — FOMC holds; hot PPI; hawkish presser (Wed 2026-03-18)
- **Event (verified):** FOMC held at 3.50–3.75%, 11-1 (Miran dissent) — Fed statement; dot plot still showed one cut in 2026 but Powell: "The forecast is that we will be making progress on inflation, not as much as we had hoped" (CNBC live blog, which also reported February PPI at **0.7% vs 0.3% expected**).
- **Price move (real):** 34¢ → **16¢** (−18, the largest daily move of the market's life; vol 16,358; intraday low 12¢). Hourly candles: ~31–34¢ through the morning, 26¢ by 1 p.m. ET, and the heaviest hour (4,388 contracts) printed 5–6 p.m. ET as the presser was digested, closing 16¢. `H0` closed **85¢**.

### E7 — Endgame: Powell exits, Warsh confirmed, dots flip (April–June 2026)
- **Events (verified):**
  - Apr 21: Warsh's Senate confirmation hearing (C-SPAN/WSJ video).
  - Apr 29: FOMC holds — **Powell's final meeting as chair**; he remains on the Board (Al Jazeera). Price that day: **5¢**.
  - May 13: Senate confirms Warsh **54–45**, "closest in the modern era" (CNBC; C-SPAN roll-call clip). Price: **3¢**.
  - May 22: Warsh sworn in (StockTitan).
  - **Jun 17: FOMC holds 3.50–3.75%, 12-0, Warsh's first meeting** (Fed statement, opened directly). Statement dramatically shortened; dot plot median for end-2026 flipped **from 3.4% (March) to 3.8%** — implying a *hike*, not a cut; 9 of 18 participants projected higher rates by year-end, 1 lower (StockTitan; CNBC/Fox headlines: "Fed holds rates steady as Warsh era begins").
- **Price (real):** last traded **1¢**; settled **NO** at $0. Note the OI explosion in the endgame: from ~95k contracts on Mar 20 to **7.13M** by Jun 16 (final API OI 8.37M) — the vast majority of this market's lifetime volume traded in its final weeks at 1–5¢.

---

## 4. Price/volume table at key dates (real Kalshi daily candles, ET days)

| ET date | Close | Day range | Vol | OI | Event |
|---|---|---|---|---|---|
| 2025-09-29 | 44¢ | 42–44¢ | 400 | 400 | market opens |
| 2025-12-10 | 60¢ | 60–60¢ | 32 | 824 | FOMC cuts 25bp |
| 2025-12-11 | 45¢ | 44–45¢ | 38 | 862 | post-FOMC giveback (thin) |
| 2026-01-27 | 42¢ | 42–44¢ | 20 | 1,960 | eve of FOMC |
| 2026-01-28 | 55¢ | 52–55¢ | 233 | 2,005 | FOMC holds |
| 2026-01-30 | 57¢ | 44–57¢ | 1,493 | 2,211 | Warsh nominated |
| 2026-02-13 | 56¢ | 42–67¢ | 768 | 10,025 | Jan CPI 2.4% (delayed release) |
| 2026-02-22 | **63¢** | 46–65¢ | 217 | 14,626 | all-time closing high (Sunday, thin) |
| 2026-02-28 | 54¢ | 46–55¢ | 471 | 24,652 | Iran war begins |
| 2026-03-02 | 47¢ | 40–52¢ | 1,408 | 26,007 | Brent +10–13% |
| 2026-03-03 | 32¢ | 30–46¢ | 4,085 | 29,317 | Hormuz closure unfolding |
| 2026-03-17 | 34¢ | 30–37¢ | 4,524 | 52,423 | eve of FOMC |
| 2026-03-18 | **16¢** | 12–34¢ | 16,358 | 66,063 | FOMC holds, hawkish |
| 2026-04-29 | 5¢ | 4–9¢ | 100,631 | 456,423 | Powell's final meeting (hold) |
| 2026-05-13 | 3¢ | 2–3¢ | 136,865 | 1,342,790 | Warsh confirmed 54–45 |
| 2026-06-16 | 1¢ | 1–1¢ | 1,596,085 | 7,133,897 | eve of decision |
| 2026-06-17 | — | settled NO ($0.00) | | final OI 8,370,508 | FOMC holds 12-0, Warsh's first meeting |

---

## 5. Same number, different meaning (the page's beat for this market)

**The pair: ~54–55¢, one month apart.**

- **Wed 2026-01-28, close 55¢.** The Fed had just *held* rates and Powell had leaned hawkish — and the price *rose* 13¢ that day. At 55¢ the contract meant: *calm-macro scheduling*. Inflation was cooling toward 2.4%, the dot plot promised one 2026 cut, and January's hold had just made June the modal landing slot for it. OI ~2,000 contracts; a policy-nerd's calendar bet.
- **Sat 2026-02-28, close 54¢.** Joint US-Israeli strikes on Iran had begun that day. At 54¢ the contract now meant: *will the Fed cut into a war?* — same number, but now conditioned on an oil shock nobody could size yet. OI was 12× larger (~24,650). Within two trading days the same contract printed 32¢, and within three weeks, 16¢.

One cent apart on the screen; opposite worlds underneath. (Prices real; the "meaning"
narration is interpretation grounded in the verified events above.)

**Supporting shift (how meaning migrated):** 44¢ at open (Sep 29, 2025) = "one leg of
Powell's ongoing easing cycle." 45¢ on Dec 11, 2025 = "one candidate slot for the *single*
cut the December dots now project." Numerically the same coin-flip-ish price; structurally a
different bet.

**Directional inversion (strongest single teaching moment):** the Jan 28 *hold* moved this
market **up** +13¢ (a cut not happening elsewhere made *this* cut more likely), while the
Mar 18 *hold* moved it **down** −18¢ (the hold came with evidence the Fed wouldn't cut soon
at all). Identical headline — "Fed holds rates" — opposite price reaction, because the
event-state differed.

---

## 6. Data integrity caveats (carry these onto the page)

1. **Thin early tape.** Until late Jan 2026, daily volume was 20–400 contracts and OI < 2,500. Early closes are last-trade prices; treat single-day spikes (e.g., Dec 10's 60¢ print on 32 contracts) as directionally meaningful but not deep-liquidity consensus.
2. **Sibling-market closes don't sum to ~$1 in the thin period** (e.g., Jan 28: C25 55¢ + H0 64¢) because closes are non-simultaneous last trades. By March (liquid), they sum properly (Mar 18: 16¢ + 85¢ ≈ $1.01).
3. **Candle volume sums to ~8.55M vs API lifetime volume 9.80M.** The gap is consistent with the final settlement-day session (ET Jun 17) falling outside the pulled candle window plus fractional/fee-rounded units. Use the API lifetime figure for totals, candles for daily shape.
4. **Kalshi prices are prices, not probabilities.** Fees, spread, and capital costs sit inside them; the page should say "the market priced roughly X%" not "the probability was X%."
5. Dot-plot details ("one cut in 2026" in Dec; 3.4%→3.8% median flip in June) are verified from press summaries of the SEP (Bloomberg headline, StockTitan), not from parsing the SEP PDFs themselves.

## Unverifiable / unexplained

- **Feb 11, 2026 intraday spike to 70¢** (10–11 a.m. ET, 203 contracts) and same-day fade to 50¢: no verifiable cause found. (A "Powell testifies Feb 11" lead turned out to be **Feb 11, 2025** — Bloomberg Law article dated Feb 4, 2025. Do not attribute.) Searched; no 2026-02-11 event confirmed.
- **Feb 22→23, 2026 drop 63¢→52¢** (vol 217→3,808): plausibly pre-war escalation headlines, but no specific dated event verified. Label illustrative if used.
- **Exact date of Warsh's confirmation hearing:** C-SPAN/WSJ video metadata says Apr 21, 2026; a banking.senate.gov URL slug says 04/14/2026. Use "late April 2026" or cite the video date with the discrepancy noted.
- **December 2025 FOMC numeric vote tally:** the Fed statement names three dissenters (Miran; Goolsbee; Schmid) and Bloomberg's headline says "3 dissents," but one fetched summary rendered the tally inconsistently. Report "cut 25bp with three dissents," not a numeric split.
- **Kalshi front-end page wording** for this market (kalshi.com returned HTTP 429/403 to fetches). The API's official `title`/`rules_primary` are used instead — this is authoritative anyway.
- **Who was long/short at 1¢** in the endgame OI explosion (6.9M contracts added after Mar 20): order-flow direction is not public. Do not narrate "traders piled into NO" as fact.

## Sources

**Kalshi public API (market data, no auth):**
- https://api.elections.kalshi.com/trade-api/v2/markets/KXFEDDECISION-26JUN-C25
- https://api.elections.kalshi.com/trade-api/v2/series/KXFEDDECISION/markets/KXFEDDECISION-26JUN-C25/candlesticks?start_ts=1748736000&end_ts=1781740800&period_interval=1440 (and `period_interval=60` windows)
- https://api.elections.kalshi.com/trade-api/v2/series/KXFEDDECISION
- https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXFEDDECISION&status=settled

**Federal Reserve (opened directly):**
- https://www.federalreserve.gov/newsevents/pressreleases/monetary20251210a.htm (Dec 10, 2025 cut to 3.50–3.75%, dissenter names)
- https://www.federalreserve.gov/newsevents/pressreleases/monetary20260128a.htm (Jan 28, 2026 hold)
- https://www.federalreserve.gov/newsevents/pressreleases/monetary20260318a.htm (Mar 18, 2026 hold, Miran dissent)
- https://www.federalreserve.gov/newsevents/pressreleases/monetary20260617a.htm (Jun 17, 2026 hold, 12-0)
- https://www.federalreserve.gov/newsevents/speech/powell20260111a.htm (Powell statement on DOJ subpoenas, Jan 11, 2026)

**Press / data (via WebSearch results and fetches):**
- https://www.bloomberg.com/news/articles/2025-12-10/fed-cuts-rates-with-three-dissents-projects-one-cut-in-2026
- https://www.cnbc.com/2025/12/10/fed-interest-rate-decision-december-2025-.html
- https://www.jpmorgan.com/insights/markets-and-economy/economy/fed-meeting-january-2026 (Powell "significantly restrictive" quote)
- https://www.cnn.com/business/live-news/fed-chair-nominee-kevin-warsh-01-30-26 (Warsh nomination, Jan 30, 2026)
- https://www.aljazeera.com/economy/2026/1/30/trump-nominates-kevin-warsh-to-replace-powell-as-fed-chair
- https://www.bls.gov/news.release/archives/cpi_02132026.htm (Jan 2026 CPI, released Feb 13, 2026)
- https://www.bls.gov/opub/ted/2026/consumer-prices-up-2-4-percent-over-the-year-ended-january-2026.htm
- https://www.cnbc.com/amp/2026/02/13/cpi-inflation-report-january-2026.html
- https://en.wikipedia.org/wiki/Economic_impact_of_the_2026_Iran_war (war Feb 28; Brent $72.48→$118+/$112.57; Hormuz closure Mar 4)
- https://www.cnbc.com/2026/03/18/fed-meeting-today-live-updates.html (Powell "not as much as we had hoped"; Feb PPI 0.7% vs 0.3%)
- https://www.cnbc.com/2026/04/10/cpi-inflation-march-2026-breakdown.html (Mar CPI 3.3%)
- https://www.cnn.com/2026/04/30/economy/us-pce-fed-inflation-spending-march (Mar PCE 3.5%)
- https://www.aljazeera.com/economy/2026/4/29/us-fed-holds-rates-steady-in-powells-final-meeting-as-fed-chair (Apr 29 hold; Powell's last meeting as chair)
- https://www.cnbc.com/2026/05/13/kevin-warsh-wins-senate-confirmation-as-the-next-federal-reserve-chair.html (May 13; 54–45)
- https://www.c-span.org/clip/us-senate/senate-confirms-kevin-warsh-as-fed-chair-54-45/5200274
- https://www.stocktitan.net/articles/fed-rate-decision-june-17-2026 (Warsh sworn in May 22; first meeting; dots 3.4%→3.8%)
- https://www.foxbusiness.com/economy/federal-reserve-interest-rate-decision-june-17-2026 ("Warsh era begins")
- https://news.bloomberglaw.com/banking-law/powell-to-testify-to-senate-committee-on-feb-11 (confirmed to be **2025**, not 2026 — used only to rule out a false lead)
