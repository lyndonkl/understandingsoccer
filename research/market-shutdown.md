# Kalshi Government-Shutdown Market — Research Notes (Generalization Example #2)

Research date: 2026-07-12. Every figure below is tagged **[VERIFIED]** (opened the
source directly), **[DERIVED]** (arithmetic from verified facts, labeled), or
**[UNVERIFIED]** (could not open a source; do not present as fact). All prices are
real traded/reported market values unless explicitly marked otherwise — no modeled
values appear in this file.

---

## 1. The event: Oct 1 – Nov 12, 2025 shutdown (longest in US history)

- **[VERIFIED]** Shutdown ran from **October 1, 2025 to November 12, 2025 — 43 days**,
  the longest full government shutdown in U.S. history, caused by failure to pass
  FY2026 appropriations; Senate Democrats opposed the House CR because it lacked an
  extension of expiring ACA subsidies. The House CR failed in the Senate **14 times**.
  — Wikipedia, https://en.wikipedia.org/wiki/2025_United_States_federal_government_shutdown
- **[VERIFIED]** Shutdown began **just after midnight Oct 1** ("12:01 a.m. ET
  Wednesday" per Fox Business Oct 6; "early Wednesday morning" per CNBC Oct 1).
  — https://www.foxbusiness.com/politics/hopes-dim-prediction-markets-traders-bet-government-shutdown-drag-weeks
- **[VERIFIED]** It **became the longest shutdown ever on Nov 4–5, 2025**: CBS —
  record surpassed late on **day 35 (Nov 4)**, hours after the **14th failed Senate
  procedural vote (54–44, 60 needed)**; NBC — "at 36 days" on **Nov 5** it is the
  longest in history, breaking the 35-day 2018–19 record.
  — https://www.cbsnews.com/live-updates/government-shutdown-latest-record-history-trump-senate-votes/
  — https://www.nbcnews.com/politics/politics-news/35-days-government-shutdown-record-longest-history-election-day-rcna241576
- **[VERIFIED]** Resolution: **Nov 9** bipartisan agreement brokered by Sens. Shaheen,
  Hassan, and King; Senate voted **60–40 to advance** (8 Democrats + King + 51
  Republicans); **Nov 10** Senate passage **60–40**; **Nov 12** House passage
  **222–209**; **Trump signed at 10:24 PM EST Nov 12**.
  — Wikipedia (above); corroborated (dates, 43 days, Nov 10 Senate / Nov 12 House)
  by NADO: https://www.nado.org/longest-government-shutdown-ends/
- **[VERIFIED]** Pre-shutdown context: on Sep 30 the Senate rejected both a
  Democratic plan (47–53) and the Republican CR (51–47, short of the 60-vote
  threshold). — Wikipedia (above)

## 2. The Kalshi markets

- **[VERIFIED via public API]** Series **KXGOVSHUT** — "Government shutdown" —
  binary "Government shutdown on [date]?" markets; the relevant event was
  **KXGOVSHUT-25OCT01** ("Government shutdown on Oct 1, 2025?"). Settlement source:
  **U.S. Office of Personnel Management** (opm.gov operating status). Category:
  Politics. Fee type: quadratic. Contract terms:
  https://kalshi-public-docs.s3.amazonaws.com/contract_terms/SHUTDOWN.pdf
  — API: https://api.elections.kalshi.com/trade-api/v2/series/KXGOVSHUT and
  /events?series_ticker=KXGOVSHUT
- **[VERIFIED via public API]** Series **KXGOVSHUTLENGTH** — "How long will the
  government shutdown last?" — the Oct–Nov 2025 shutdown falls under event
  **KXGOVSHUTLENGTH-26JAN01** (window "Sep 5, 2025 to Jan 1, 2026"), a
  non-mutually-exclusive ladder of threshold contracts ("more than N days").
  Settlement source: OPM.
  — API: https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXGOVSHUTLENGTH&with_nested_markets=true
- **[VERIFIED]** Kalshi web market page for the length ladder:
  https://kalshi.com/markets/kxgovshutlength/number-of-days-of-government-shutdown/kxgovshutlength-26feb28
  (current series page; the 2025 event page is the -26jan01 sibling).
- **[VERIFIED]** Related markets cited in Kalshi's newsroom during the shutdown:
  "Will the U.S. government reopen this year?", "Will the next government funding
  bill be a clean CR?", House vote-timing and House vote-count markets, and
  individual-legislator vote markets (sources in §3).
- **[UNVERIFIED / infeasible]** The individual settled market tickers and price
  history (candlesticks) for the 2025 length ladder are **no longer retrievable from
  the public API** — `/markets?event_ticker=KXGOVSHUTLENGTH-26JAN01` returns an
  empty list and direct ticker guesses 404. Intraday price series around each event
  therefore cannot be pulled from the API today; the dated price record below comes
  from Kalshi's own newsroom and contemporaneous press.

## 3. Dated timeline with real Kalshi prices

All prices below are **real reported market prices** (Kalshi newsroom = Kalshi's own
reporting of its markets; Fox/CNBC = press citing Kalshi).

### Event A — Sep 23, 2025: Trump cancels meeting with Schumer/Jeffries
- **[VERIFIED]** Kalshi "shutdown on Oct 1" jumped **~56% → 71%** (+15 pts) on the
  news; "shutdown anytime in 2025" hit an all-time high 71% (+35 pts); "Trump meets
  Schumer/Jeffries" fell 41% → 20%.
- **[VERIFIED]** Length ladder that day: >3 days 56%, >5 days 44%, >10 days 33%,
  **>35 days 17%**. **Median forecast: 4.5 days.**
  — Kalshi newsroom (pub. Sep 23, 2025):
  https://news.kalshi.com/p/shutdown-odds-hit-new-high-trump-walks-from-talks

### Event B — Oct 1, 2025: shutdown begins
- **[VERIFIED]** Kalshi's implied length forecast on day 1: **11.1 days**, "up
  sharply in recent days as negotiations stalled." (CNBC also: Polymarket 38% on
  reopening Oct 15 or later; historical average shutdown ~14 days per BofA.)
  — CNBC, pub. Oct 1, 2025 9:16 AM EDT:
  https://www.cnbc.com/2025/10/01/prediction-markets-see-government-shutdown-lasting-nearly-two-weeks.html

### Event C — Oct 6, 2025: first week ends with no deal
- **[VERIFIED]** Kalshi: **64% chance the shutdown lasts more than 21 days**; volume
  $2.5M. Polymarket: 72% at least two weeks.
  — Fox Business, pub. Oct 6, 2025 10:53 AM EDT:
  https://www.foxbusiness.com/politics/hopes-dim-prediction-markets-traders-bet-government-shutdown-drag-weeks

### Event D — Oct 20–22, 2025: stalemate hardens (day 20–22)
- **[VERIFIED]** Fox (Oct 20): traders see the shutdown running **~44 days** total;
  **44% chance it lasts until Nov 15**; ~1-in-3 past Nov 20; Kalshi volume $12.7M.
  — https://www.foxbusiness.com/politics/prediction-markets-signal-government-shutdown-may-last-mid-november
- **[VERIFIED]** Kalshi newsroom (Oct 22, day 22): expected length **~40 days**;
  **>35 days: 67%**; **>40 days: ~49–50¢**; >$15M traded on the length market;
  "clean CR" dropped 8 pts in a day to **20%**; only 6% on a House vote before
  Oct 25. — https://news.kalshi.com/p/kalshi-government-shutdown-market-forecast
- **NOTE (discrepancy, unresolved):** Fox's Oct 20 "~44 days" vs Kalshi's own Oct 22
  "~40 days" cannot be reconciled from the open sources; both are reported as
  published.

### Event E — Nov 1, 2025: forecast hits record high (day 32)
- **[VERIFIED]** Kalshi length forecast: **46.7 days** (record high; "more than
  doubled since mid-September when traders expected under two weeks").
  **">46 days" contracts traded at 51¢** (~even odds); >45 days ~56%; **>60 days
  (past Nov 30) ~18%**. "Reopen this year": **90%, down 5 pts on the week**.
  Clean CR: 25%.
  — Kalshi newsroom, pub. Nov 1, 2025:
  https://news.kalshi.com/p/kalshi-government-shutdown-market-forecast-record-high

### Event F — Nov 4–5, 2025: 14th failed Senate vote; record broken (day 35–36)
- **[VERIFIED]** Nov 4: 14th failed procedural vote, **54–44** (60 needed); the
  2019 record fell late that night (CBS). Nov 5: day 36, longest ever (NBC).
- **[VERIFIED]** Kalshi that day (newsroom, Nov 5): forecast **~47 days**;
  **>46 days: 52%**; >50 days: 34%; **>60 days: 17%**; "reopen before year-end":
  **94%**; FAA facility-closure-in-November market: 37%.
  — https://news.kalshi.com/p/government-shutdown-record-market-forecast
  — https://www.cbsnews.com/live-updates/government-shutdown-latest-record-history-trump-senate-votes/
  — https://www.nbcnews.com/politics/politics-news/35-days-government-shutdown-record-longest-history-election-day-rcna241576

### Event G — Nov 9–11, 2025: Senate breakthrough; prices collapse to certainty
- **[VERIFIED]** Nov 9 (Sunday night): Senate votes **60–40** to advance the
  Shaheen/Hassan/King deal (Wikipedia). Kalshi newsroom (Nov 11): market volume
  **spiked above $60M** after the Sunday breakthrough — described as "the swiftest
  market shift of the year on Kalshi"; average forecast **dropped ~2 days since the
  week's start** to **"just over a 43-day closure"**; **">45 days" fell to 6%**;
  **">47 days" under 3¢**; House-vote-before-Nov-15: **97%**; most likely House
  vote count: **217–220** (218 needed); legislator markets: Golden (D) 99%,
  Roy (R) 95%, Lawler (R) 95%, Cuellar (D) 66%, Gottheimer (D) 53%.
  — https://news.kalshi.com/p/kalshi-traders-forecast-vote-end-government-shutdown
  — https://en.wikipedia.org/wiki/2025_United_States_federal_government_shutdown

### Event H — Nov 10–12, 2025: resolution
- **[VERIFIED]** Senate passes 60–40 (Nov 10); House passes 222–209 (Nov 12); Trump
  signs 10:24 PM EST Nov 12. Shutdown length settles at **43 days**.
  — Wikipedia (above); NADO (above)

## 4. The lens: the SAME price level, different meanings

These are the pairs the scrolly page can use. Settlement outcomes are **[DERIVED]**
from the verified 43-day length (43 > 35 → YES; 43 < 46, 45, 60 → NO).

### Pair 1 — 17¢ as pre-crisis tail hedge vs 17¢ as exhaustion tail
- **Sep 23** (8 days *before* the shutdown): ">35 days" — the *break-the-record*
  scenario — traded at **17%** [VERIFIED, Kalshi newsroom Sep 23]. Median forecast
  was 4.5 days: 17¢ was a lottery ticket on the unthinkable. **It settled YES**
  (43 > 35) [DERIVED] — the "unthinkable" paid ~5.9x.
- **Nov 5** (day 36, record just broken): ">60 days" traded at **17%** [VERIFIED,
  Kalshi newsroom Nov 5]. Same 17¢, but now it priced *how much longer collapse
  continues* after every prior floor had failed — 14 failed votes deep. **It
  settled NO** (43 < 61) [DERIVED].
- Same number, opposite outcomes, opposite psychology: pre-crisis 17¢ = "surely
  not"; day-36 17¢ = "why would it ever end."

### Pair 2 — the ~50¢ coin flip: negotiation uncertainty vs endurance uncertainty
- **Oct 22** (day 22): ">40 days" ≈ **49–50¢** [VERIFIED]. A coin flip on whether
  the political fight survives ~18 more days — uncertainty about *bargaining*.
- **Nov 1** (day 32): ">46 days" = **51¢** [VERIFIED]; **Nov 5** (day 36):
  ">46 days" = **52%** [VERIFIED]. A near-identical coin flip, but the question had
  inverted: the record was falling, no catalyst existed, and 50¢ now priced pure
  *endurance* — how long institutions can keep failing.
- Resolution of the pair: ">40 days" settled **YES**; ">46 days" settled **NO**
  [DERIVED] — two ~50¢ contracts a week apart, one worth $1, one worth $0.
- And the collapse: ">45 days" went **~56% (Nov 1) → 6% (Nov 11)** [VERIFIED both
  ends] once the Nov 9 deal landed — the 50¢-zone ambiguity vaporized in ~48 hours
  of news.

### The forecast's arc (Kalshi implied shutdown length, all [VERIFIED] above)
4.5 days (Sep 23) → 11.1 (Oct 1) → ~40 (Oct 22) → 46.7 record (Nov 1) → ~47
(Nov 5) → "just over 43" (Nov 11) → **settled at 43** (fact). The market
overshot at peak pessimism (46.7–47) and converged from above once the deal formed.

### Volume arc (all [VERIFIED] above)
$2.5M (Oct 6) → $12.7M (Oct 20) → $15M+ (Oct 22) → **spike above $60M** after the
Nov 9 breakthrough — the *resolution*, not the crisis, drew peak trading.

## 5. Unverifiable / not retrievable (do not present as fact)

1. **Settled market tickers & intraday price history** for the 2025 length ladder —
   the public API (`api.elections.kalshi.com/trade-api/v2`) no longer lists markets
   under `KXGOVSHUTLENGTH-26JAN01`; candlestick pulls are impossible without
   tickers. Any intraday curve on the page must be labeled **illustrative/modeled**.
2. **Hour-level price path around the Nov 9 breakthrough** — only the Nov 11 Kalshi
   summary ("swiftest market shift of the year", >$60M volume, forecast -2 days) is
   verified; no tick data.
3. **Final total volume** of the shutdown-length market at settlement.
4. The **Fox Oct 20 (~44 days) vs Kalshi Oct 22 (~40 days)** forecast discrepancy —
   both reported; cannot be reconciled from open sources.
5. Whether the Sep 23 ">35 days" contract and the Oct–Nov length ladder are the
   *same* API event (KXGOVSHUTLENGTH-26JAN01, window "Sep 5, 2025–Jan 1, 2026" —
   consistent, but the market-level mapping is not confirmable via the API today).

## Sources

- https://en.wikipedia.org/wiki/2025_United_States_federal_government_shutdown
- https://www.cbsnews.com/live-updates/government-shutdown-latest-record-history-trump-senate-votes/
- https://www.nbcnews.com/politics/politics-news/35-days-government-shutdown-record-longest-history-election-day-rcna241576
- https://www.nado.org/longest-government-shutdown-ends/
- https://www.cnbc.com/2025/10/01/prediction-markets-see-government-shutdown-lasting-nearly-two-weeks.html
- https://www.foxbusiness.com/politics/hopes-dim-prediction-markets-traders-bet-government-shutdown-drag-weeks
- https://www.foxbusiness.com/politics/prediction-markets-signal-government-shutdown-may-last-mid-november
- https://news.kalshi.com/p/shutdown-odds-hit-new-high-trump-walks-from-talks
- https://news.kalshi.com/p/kalshi-government-shutdown-market-forecast
- https://news.kalshi.com/p/kalshi-government-shutdown-market-forecast-record-high
- https://news.kalshi.com/p/government-shutdown-record-market-forecast
- https://news.kalshi.com/p/kalshi-traders-forecast-vote-end-government-shutdown
- https://api.elections.kalshi.com/trade-api/v2/series/KXGOVSHUT (public API)
- https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXGOVSHUTLENGTH (public API)
- https://kalshi.com/markets/kxgovshutlength/number-of-days-of-government-shutdown/kxgovshutlength-26feb28 (market page)
- https://www.crfb.org/papers/government-shutdowns-qa-everything-you-should-know (confirms Oct 1–Nov 12 span)
