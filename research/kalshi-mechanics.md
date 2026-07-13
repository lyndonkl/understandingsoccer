# Kalshi Mechanics — Verified Research

Research date: 2026-07-12 (Pacific) / 2026-07-13 UTC.
Method: every fact below was taken from a page actually opened via WebFetch/WebSearch or
from the public Kalshi API queried live via `curl` (no auth). Live API observations are
timestamped. Items that could not be directly verified are listed in "Unverifiable /
flagged" at the bottom — do not state them as fact on the page.

---

## 1. Contract structure: binary, $1/$0, prices 1–99¢

- **Settlement**: "Each contract on Kalshi settles to $1 if your answer is right, and $0
  otherwise." — Kalshi's own explainer.
  Source: https://news.kalshi.com/p/what-are-event-contracts
- **Price range**: "Prices for contracts range from $0.01 and $0.99." — same Kalshi page.
- **API confirmation** (live, 2026-07-13 UTC): every market object returns
  `"market_type": "binary"`, `"notional_value_dollars": "1.0000"`,
  `"price_level_structure": "linear_cent"`, and `price_ranges` of `0.0000 → 1.0000` in
  `0.0100` steps. Source: `GET https://api.elections.kalshi.com/trade-api/v2/markets`
- **YES/NO pairs**: "Each market has two types of contracts, YES contracts and NO
  contracts, which cover each possible answer to the Yes/No question."
  Source: https://news.kalshi.com/p/what-are-event-contracts

## 2. YES/NO complementarity

- Kalshi's worked example: "let's say that you pay market price, $0.60 for a YES
  contract. That means you matched with another user who paid $0.40 for a NO contract on
  the same market." YES price + NO price of a matched pair = $1.00.
  Source: https://news.kalshi.com/p/what-are-event-contracts
- **Live API confirmation** (KXWCADVANCE-26JUL15ENGARG-ENG, "England vs Argentina: To
  Advance", 2026-07-13 ~06:05 UTC): `yes_bid $0.54 / yes_ask $0.55` and
  `no_bid $0.45 / no_ask $0.46` — i.e. yes_ask = 1 − no_bid and yes_bid = 1 − no_ask.
  A trade record shows both sides at once: `"yes_price_dollars": "0.5500",
  "no_price_dollars": "0.4500"`.
  Source: `GET /trade-api/v2/markets?series_ticker=KXWCADVANCE` and
  `GET /trade-api/v2/markets/trades?ticker=KXWCADVANCE-26JUL15ENGARG-ENG`
- Help Center on spreads: quoted YES-buy and NO-buy prices "should always add up to
  something bigger than $1… The amount over $1 is called the spread of the market."
  Source (via search result of Help Center content):
  https://help.kalshi.com/en/articles/13823821-market-faqs and
  https://help.kalshi.com/en/articles/13823828-the-orderbook

## 3. Central limit order book — an exchange, not a sportsbook

- Kalshi Help Center ("The Orderbook"): the order book "displays all the resting orders
  available on the market." A resting order is "an offer to purchase contracts at a
  certain price that is not matched immediately." Bids are "the maximum price a buyer is
  willing to pay"; asks are "the minimum price that a member is willing to sell that
  contract for."
  Source: https://help.kalshi.com/en/articles/13823828-the-orderbook
- Price formation is user-driven, not house-set: "The fraction that you pay is determined
  entirely by users on Kalshi trading on the exchange." The market price is "the price
  you'd need to pay to instantly get matched with another buyer."
  Source: https://news.kalshi.com/p/what-are-event-contracts
- **Live order book depth** (KXWCADVANCE-26JUL15ENGARG-ENG, 2026-07-13 ~06:06 UTC),
  fetched without auth — 5 visible YES-bid levels $0.50–$0.54 (e.g. 713,208.56 contracts
  resting at $0.54) and 5 NO-bid levels $0.41–$0.45 (e.g. 7,154,938.46 at $0.45).
  Source: `GET /trade-api/v2/markets/KXWCADVANCE-26JUL15ENGARG-ENG/orderbook?depth=5`
- Contrast with sportsbooks (third-party analysis, opened): a sportsbook "sets a line,
  takes your bet as the counterparty, and profits from the vig baked into odds on both
  sides," while Kalshi "runs a central limit order book under CFTC oversight" where
  "every contract has a counterparty who is another user, not the house."
  Source (search-result content):
  https://pillarlabai.com/blog/kalshi-meaning-what-it-is/ ,
  https://www.alphascope.app/blog/kalshi-sports-betting (via WebSearch snippets)
- **Important nuance for data honesty** (Sportico, opened): counterparties are anonymous;
  "Kalshi's website says 'the majority of participants on Kalshi today are retail
  traders,' but those terms are not defined." Kalshi's own affiliated trading arm
  (Kalshi Trading) participates in markets, and Kalshi does not disclose its share of
  volume. So "peer-to-peer" ≠ "you're trading against another retail fan" — the other
  side is often a professional market maker.
  Source: https://www.sportico.com/business/sports-betting/2025/kalshi-trading-exchange-peer-house-1234870465/

## 4. Who trades

- Retail + institutions: Wikipedia (opened) — "The platform attracts retail traders,
  institutions, and hedge funds." Also reports (from company data) ~2.9 unprofitable
  users per profitable one. Source: https://en.wikipedia.org/wiki/Kalshi
- Market makers: Kalshi announced on **April 3, 2024** that Susquehanna International
  Group (SIG) became its **first major institutional market maker**, quoting depth of
  "100,000 contracts or more," spreads of "2-3¢ or less (on average)," and "98%
  availability across all trading hours"; Kalshi claimed ~30× liquidity increase in
  select markets. Source: https://news.kalshi.com/p/liquid-prediction-markets-are-finally-here
- Market makers receive "financial benefits, reduced fees, differing position limits and
  enhanced access" (Sportico, opened).
  Source: https://www.sportico.com/business/sports-betting/2025/kalshi-trading-exchange-peer-house-1234870465/

## 5. Fees

- Kalshi Help Center ("Fees"): Kalshi "charges a transaction fee on the expected earnings
  on the contract"; maker fees "are charged for orders placed that are not immediately
  matched and are instead left as resting orders on the orderbook" and apply only when
  trades execute; cancelling resting orders costs nothing; "Some markets have fees that
  are different from those of other markets."
  Source: https://help.kalshi.com/en/articles/13823805-fees
- Formula (third-party explainer, opened — pm.wiki): taker fee per contract =
  **$0.07 × P × (1 − P)** (P = price in dollars), rounded up; maximum **1.75¢ per
  contract at a 50¢ price**; e.g. 0.63¢ at 10¢ or 90¢. Maker fees are "exactly 25% of
  the taker fee" (0.44¢ at 50¢). Holding a winning contract to settlement costs $0 (no
  settlement fee); exiting early means paying trading fees again on the exit.
  Source: https://pm.wiki/learn/kalshi-fees-explained
- **API confirmation of the quadratic shape** (live): series objects expose
  `"fee_type": "quadratic", "fee_multiplier": 1` — consistent with the P(1−P) formula.
  Source: `GET https://api.elections.kalshi.com/trade-api/v2/series`
- Caveat: Kalshi's official Fee Schedule PDF (kalshi.com/docs/kalshi-fee-schedule.pdf)
  could not be opened (Vercel security checkpoint), so exact current per-market fee
  tables are cited from pm.wiki + the Help Center, not the PDF itself.

## 6. CFTC regulation status (as of mid-2026)

- **DCM since Nov 2020**: CFTC press release (opened) — on **November 4, 2020** the CFTC
  "issued an Order of Designation to KalshiEX LLC, granting it status as a designated
  contract market (DCM)" under Section 5 of the Commodity Exchange Act and CFTC
  Regulation 38.3(a). Source: https://www.cftc.gov/PressRoom/PressReleases/8302-20
- Kalshi's own statement: "Kalshi is regulated by the Commodity Futures Trading
  Commission (CFTC)… Kalshi is regulated as a Designated Contract Market (DCM)."
  Source: https://help.kalshi.com/en/articles/13823765-how-is-kalshi-regulated
- Public launch of trading: "The site was publicly launched in July 2021." Founded 2018
  by Tarek Mansour and Luana Lopes Lara. Source: https://en.wikipedia.org/wiki/Kalshi
- **CFTC rulemaking (June 2026)**: on **June 10, 2026** the CFTC published a Notice of
  Proposed Rulemaking amending Regulation 40.11 (plus new Appendix F to part 40),
  creating a framework to evaluate whether event contracts "involve" enumerated
  activities ("terrorism, assassination, war, gaming, or conduct that is unlawful"),
  with a 90-day contract review process. CFTC quote: "This proposal gives the Commission
  a durable, transparent framework to identify the contracts Congress directed us to
  scrutinize while letting legitimate markets move forward."
  Source: https://www.cftc.gov/PressRoom/PressReleases/9249-26

## 7. Sports event contracts: since when, and legal status as of July 2026

- **Launch**: Kalshi rolled out its first sports event contracts on **January 23–24,
  2025** — self-certified with the CFTC on the Wednesday, live the next day — starting
  with Super Bowl LIX / championship futures (Super Bowl, Stanley Cup, NCAA men's
  tournament winner, NFL conference championships). Covers (opened): "The federally
  regulated prediction market rolled out several event contracts on Thursday [Jan 23,
  2025] – as it said it would on Wednesday in a regulatory filing." The Block (via
  search): the "Kansas City vs. Philadelphia" Super Bowl market launched Jan. 24.
  Sources: https://www.covers.com/industry/kalshi-launch-sports-event-contracts-betting-super-bowl-march-madness-january-2025 ;
  https://www.covers.com/industry/kalshi-sports-contracts-event-trading-betting-expand-achievments-january-2025
  (confirms >$1.8M traded on Super Bowl contracts by Jan 30, 2025)
- Expanded to props/spreads/totals ahead of the 2025 football season (CFTC notified
  Aug 18, 2025). Source: https://frontofficesports.com/kalshi-adds-props-parlays-amid-legal-uncertainty/
- Scale (Wikipedia, opened; attributes to reporting on company figures): sports now
  constitute over 90% of site activity and 89% of Kalshi's 2025 revenue.
  Source: https://en.wikipedia.org/wiki/Kalshi
- **Legal status, July 2026 — contested but trading nationwide**:
  - **Third Circuit, April 6, 2026** (*KalshiEX LLC v. Flaherty*, No. 25-1922): first
    federal appeals court on the issue; a divided panel affirmed Kalshi's preliminary
    injunction against New Jersey, holding sports event contracts are "swaps" under the
    CEA and that the CEA preempts state gambling law for contracts on a CFTC-registered
    DCM (field + conflict preemption). Judge Roth dissented.
    Sources: https://www.paulweiss.com/insights/client-memos/a-divided-third-circuit-holds-that-the-cftc-has-exclusive-jurisdiction-over-sports-related-event-contracts ;
    https://www.skadden.com/insights/publications/2026/04/third-circuit-affirms-kalshis-preliminary-injunction
  - Litigation continues elsewhere: prediction-market operators have filed suits against
    11 states (AZ, CT, IA, MD, MI, NV, NJ, NY, OH, TN, UT) with conflicting lower-court
    outcomes; the CFTC itself sued Arizona, Connecticut, and Illinois on April 2, 2026,
    asserting CEA preemption (Paul Weiss, opened). Multiple states (Massachusetts,
    Arizona, Michigan, Nevada, Ohio, Washington, Wisconsin) have alleged illegal gambling;
    Minnesota enacted a ban effective August 1, 2025 (Wikipedia, opened).
  - Sports contracts remained available "in all 50 states" per industry press (SBC
    Americas, via search snippet — not directly opened; treat as secondary).
- Historical note (elections): a 2024 DC District Court ruling let Kalshi list
  congressional-control contracts after the CFTC tried to block them; an appellate court
  rejected the CFTC's stay request (Wikipedia, opened).
  Source: https://en.wikipedia.org/wiki/Kalshi

## 8. Public data: what anyone can see without an account

All of the following were fetched live with plain `curl`, **no authentication**, base
`https://api.elections.kalshi.com/trade-api/v2` (observed 2026-07-13 ~06:00–06:10 UTC):

| Endpoint | What it returns (observed) |
|---|---|
| `/series?limit=N` | Series metadata: category, `fee_type` ("quadratic"), `fee_multiplier`, settlement sources (e.g. WSJ, ESPN), contract-terms PDF URLs |
| `/events?limit=N&status=open` | Event groupings, `mutually_exclusive` flag, settlement sources |
| `/markets?limit=N&status=open[&series_ticker=…]` | Full market objects: `yes_bid/yes_ask/no_bid/no_ask` (dollars), `last_price`, `previous_price`, `open_interest_fp`, `volume_fp`, `volume_24h_fp`, rules text, `market_type: binary`, price ranges |
| `/markets/{ticker}/orderbook?depth=N` | Aggregated resting-order depth per price level, both YES and NO sides, sizes in contracts |
| `/markets/trades?ticker=…` | Public trade tape: timestamp, yes/no price, size (`count_fp`), taker side |
| `/series/{series}/markets/{ticker}/candlesticks?start_ts=&end_ts=&period_interval=` | OHLC + mean price, bid/ask OHLC, volume, open interest per period (e.g. 60-min bars) |
| `/exchange/status` | `exchange_active: true, trading_active: true` |

So: **price history, the live order book, and the full public trade tape are all
publicly visible** — usable directly by the scrollytelling page.

Observation: quantity fields carry an `_fp` suffix and show fractional values (e.g. a
trade of `count_fp: "1.76"` contracts; resting size `7,154,938.46`), i.e. the API now
reports fractional/fixed-point contract quantities. (Observed directly; Kalshi's docs
page for this could not be opened due to rate-limiting.)

### Live sample worth reusing (REAL data, timestamped 2026-07-13 ~06:05 UTC)

Market `KXWCADVANCE-26JUL15ENGARG-ENG` — "England vs Argentina: To Advance" (FIFA World
Cup semifinal, expected expiration 2026-07-15T22:00Z):
- last price **$0.55** (yes), yes_bid/ask $0.54/$0.55, no_bid/ask $0.45/$0.46
- open interest ≈ **716,029.67** contracts (England-advance side); Argentina-advance
  side market open interest ≈ 1,876,327.70
- lifetime volume ≈ 762,596.96; 24h volume ≈ 564,219.81
- rules: "If England advance past Argentina … in the Semifinal of the FIFA World Cup,
  then the market resolves to Yes."
Source: `GET /trade-api/v2/markets?series_ticker=KXWCADVANCE` (public API)

## 9. Phrasings the page can state as fact (with the above citations)

1. A Kalshi contract is binary: it settles at $1 if the stated event happens, $0 if not.
2. Prices trade between 1¢ and 99¢ in 1¢ ticks; the price is the cost of a $1 claim.
3. Every YES at P¢ is matched with a NO at (100−P)¢; the pair always sums to $1.
4. Prices come from a central limit order book — resting bids and asks from traders —
   not from a bookmaker setting a line. Kalshi is the venue, not the counterparty.
5. But "traders" includes professional market makers (e.g. Susquehanna since April
   2024) and Kalshi's own trading affiliate — not just retail peers.
6. Fees are charged per trade, scaled as ~0.07·P·(1−P) per contract (max 1.75¢ at 50¢);
   winning contracts held to settlement pay no extra fee.
7. Kalshi has been a CFTC-designated contract market since November 2020; sports
   contracts launched January 2025; as of July 2026 the Third Circuit has held state
   gambling law preempted for DCM-listed sports contracts, while litigation in ~10 other
   states and a June 2026 CFTC rulemaking are still pending.

## 10. Unverifiable / flagged — do NOT state as fact

- **Exact ruling date discrepancy**: Paul Weiss (opened) says the Third Circuit ruled
  **April 6, 2026**; the Skadden page summary rendered it as April 4, 2026. Use "April
  2026" or "April 6, 2026 (per Paul Weiss)" — do not present both.
- **NPRM comment-period close date (July 27, 2026)**: appeared only in search-result
  summaries (WilmerHale/SBC), not on a page directly opened. Verify before using.
- **"Available in all 50 states"**: from an SBC Americas search snippet (page returned
  403 on fetch). Use "available nationwide, contested in several states" instead.
- **Kalshi total user counts / exact volume shares by trader type**: Kalshi does not
  publicly disclose user numbers (Sportico, Wikipedia); the retail/institution volume
  split is undisclosed. Never invent a split — if the visualization needs one, label it
  MODEL ASSUMPTION.
- **Kalshi's official Fee Schedule PDF**: blocked by a Vercel security checkpoint; fee
  formula is verified only via pm.wiki + Help Center prose + the API's
  `fee_type: quadratic` field.
- **kalshi.com/docs pages** (how-kalshi-works, fees): returned HTTP 429 on every
  attempt; equivalents verified via help.kalshi.com and news.kalshi.com instead.
- Whether Kalshi still markets itself with the exact phrase "not a sportsbook": the
  framing is supported by opened third-party analyses and Kalshi's mechanics pages, but
  no opened Kalshi page uses that exact phrase.

## Sources (all opened via WebFetch / WebSearch / curl)

Official — Kalshi:
- https://news.kalshi.com/p/what-are-event-contracts
- https://help.kalshi.com/en/articles/13823828-the-orderbook
- https://help.kalshi.com/en/articles/13823821-market-faqs
- https://help.kalshi.com/en/articles/13823805-fees
- https://help.kalshi.com/en/articles/13823765-how-is-kalshi-regulated
- https://news.kalshi.com/p/liquid-prediction-markets-are-finally-here
- https://api.elections.kalshi.com/trade-api/v2/ (series, events, markets, orderbook, trades, candlesticks, exchange/status — public, no auth)

Official — CFTC:
- https://www.cftc.gov/PressRoom/PressReleases/8302-20 (Nov 4, 2020 DCM designation)
- https://www.cftc.gov/PressRoom/PressReleases/9249-26 (June 10, 2026 NPRM)

Legal analysis / press:
- https://www.paulweiss.com/insights/client-memos/a-divided-third-circuit-holds-that-the-cftc-has-exclusive-jurisdiction-over-sports-related-event-contracts
- https://www.skadden.com/insights/publications/2026/04/third-circuit-affirms-kalshis-preliminary-injunction
- https://www.sportico.com/business/sports-betting/2025/kalshi-trading-exchange-peer-house-1234870465/
- https://www.covers.com/industry/kalshi-launch-sports-event-contracts-betting-super-bowl-march-madness-january-2025
- https://www.covers.com/industry/kalshi-sports-contracts-event-trading-betting-expand-achievments-january-2025
- https://frontofficesports.com/kalshi-adds-props-parlays-amid-legal-uncertainty/
- https://en.wikipedia.org/wiki/Kalshi
- https://pm.wiki/learn/kalshi-fees-explained
