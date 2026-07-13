# Backup generalization market: 2025 NYC Mayoral Election on Kalshi

**Chosen market (priority option a):** the Kalshi NYC mayoral race markets —
the general-election series `KXMAYORNYCPARTY` ("New York City Mayor Election")
and the Democratic-primary series `KXMAYORNYCNOMD` ("Democratic NYC Mayor
nominee in 2025?"). Candidates (b) World Cup 2026, (c) Oscars 2026, and (d) CPI
were not pursued because (a) immediately yielded the best-documented
price-vs-event record: dated prices recovered from Kalshi's own pages via the
Internet Archive, plus dated news reports of Kalshi prices at every major event.

**Research date:** 2026-07-12.

---

## Why this market fits the page's thesis

The page argues that a price is a metaphor whose meaning changes with the state
of the world. This race gives that argument three distinct mechanisms in one
price series:

1. **Referent swap (June 24, 2025).** The general-election contract
   `KXMAYORNYCPARTY-25-D` asks "Will a representative of the Democratic party
   win the NYC Mayor race in 2025?" Before the primary, that sentence
   effectively meant *Andrew Cuomo* (the presumptive nominee). After primary
   night it meant *Zohran Mamdani*. Same ticker, same question, different human
   being behind the price.
2. **Structural uncertainty resolving (Sept 28, 2025).** Through September the
   Mamdani price was suppressed not by doubt about voters but by doubt about
   the *shape of the field* (would the anti-Mamdani vote consolidate?). When
   Eric Adams withdrew — the consolidation event itself — Mamdani's price went
   **up**, from 80¢ to 84¢. The move reveals what the missing 20¢ had been made
   of.
3. **Time decay into certainty (October 2025).** With no comparable news
   events, the price ground upward 85¢ → 91¢ → 92¢ → 94¢ as calendar time for a
   Cuomo comeback drained away — the direct political analogue of the soccer
   late-game "survival" price.

---

## The contracts (verified from Kalshi's own archived pages)

From the archived Kalshi event page (Internet Archive snapshot of
kalshi.com, 2025-10-23; SSR JSON embedded in page):

| Ticker | Question ("title") | yes_sub_title (candidate) |
|---|---|---|
| KXMAYORNYCPARTY-25-D | Will a representative of the Democratic party win the NYC Mayor race in 2025? | Zohran Mamdani |
| KXMAYORNYCPARTY-25-AC | Will a representative of the Andrew Cuomo party win the NYC Mayor race in 2025? | Andrew Cuomo |
| KXMAYORNYCPARTY-25-EADA | Will a representative of the Eric Adams party win the NYC Mayor race in 2025? | Eric Adams |
| KXMAYORNYCPARTY-25-R | Will a representative of the Republican party win the NYC Mayor race in 2025? | Curtis Sliwa |
| KXMAYORNYCPARTY-25-JWAL | Will a representative of the Jim Walden party win the NYC Mayor race in 2025? | Jim Walden |

Market metadata (from archived page JSON, snapshot 2025-09-02): the D contract
was created 2024-11-09 and listed/opened 2024-11-09T19:00:00Z — i.e. the
market existed roughly a year before the election. Resolution rule
("underlying"): "If || Person/Party || wins the NYC Mayoral election on ||
Election ||, then the market resolves to Yes."

Source (all archive.org snapshots of kalshi.com):
- https://web.archive.org/web/20250902212645/https://kalshi.com/markets/kxmayornycparty
- https://web.archive.org/web/20251023010045/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25

**API note:** Kalshi's public API still returns the events
(`GET /trade-api/v2/events?series_ticker=KXMAYORNYCPARTY` → event
`KXMAYORNYCPARTY-25`, "New York City Mayor Election"; `KXMAYORNYCNOMD-25`,
"Democratic NYC Mayor nominee in 2025?") but the settled markets and their
candlesticks have been purged from the public market-data endpoints
(`GET /markets/{ticker}` → 404). Price history below therefore comes from
archived copies of Kalshi's own pages and from dated news reports of Kalshi
prices — not from memory.

---

## Verified event-vs-price timeline (all prices are REAL Kalshi prices)

Prices in the "archived Kalshi page" rows are `last_price` values (in cents)
from the SSR JSON embedded in Internet Archive snapshots of kalshi.com;
snapshot timestamps are UTC. News-reported prices are cited to the article.

### 1. June 19, 2025 — five days before the primary: Mamdani at 19¢
Kalshi's Democratic-nomination market had Mamdani contracts trading at **19¢**
five days before the June 24 primary (reported by Gothamist, 2025-11-03).
Kalshi's own Times Square billboard showed Mamdani at **23%** four days before
his primary win (same source). *Meaning:* a longshot insurgent price —
capability, priced coldly against a famous former governor leading the polls.
- Source: https://gothamist.com/news/ny-wants-to-shut-down-kalshi-the-company-behind-the-nyc-mayors-race-odds

### 2. June 24, 2025 (morning) — primary day: the flip before the votes
Fox Business, published 7:53am EDT on primary day: Kalshi gave **Mamdani 56%**
and **Cuomo 44%** for the Democratic nomination; Mamdani "yes" shares at
roughly $0.57; more than **$8 million** total series volume. (Gothamist later
reported Mamdani at **49¢** "the morning of" the primary — an intraday
difference between the two papers' snapshot times; both are morning-of prices.)
*Meaning:* in five days the same contract went 19¢ → ~half-dollar on momentum
and late polls — a coin-flip price on a live question.
- Source: https://www.foxbusiness.com/media/who-democratic-nominee-nyc-mayor-millions-betting-live
- Source: https://gothamist.com/news/ny-wants-to-shut-down-kalshi-the-company-behind-the-nyc-mayors-race-odds

### 3. June 24 (night) – July 1, 2025 — the upset resolves the referent
Mamdani won the primary: first-round count **43.82%** (469,642 votes) to
Cuomo's **36.12%** (387,137); final ranked-choice tabulation **56.39% to
43.61%** (573,169 vs 443,229). From this night on, the general-election "D"
contract's price is a price *about Mamdani*, having been a price effectively
about Cuomo. Cuomo announced an independent general-election run on the "Fight
and Deliver" line on **July 14, 2025**. (Adams had already left the Democratic
primary on **April 3, 2025** to run as an independent.)
- Source: https://en.wikipedia.org/wiki/2025_New_York_City_mayoral_election

### 4. Aug 24 → Sept 11, 2025 — the five-way field: Mamdani 83¢, then a wobble to 80¢
Archived Kalshi pages (general-election market, last_price in ¢):

| Snapshot (UTC) | Mamdani (D) | Cuomo (AC) | Adams (EADA) | Sliwa (R) | Walden (JWAL) |
|---|---|---|---|---|---|
| 2025-08-24 17:36 | **83** | 10 | 5 | 2 | 1 |
| 2025-09-02 21:26 | **83** (bid 83 / ask 84; D volume 12,855,260 contracts) | — | — | — | — |
| 2025-09-11 10:04 | **80** | **17** | 2 | 3 | 1 |

*Meaning:* the ~17–20¢ of non-Mamdani probability was concentrated in Cuomo,
and Cuomo's 17¢ on Sept 11 was mostly a bet on field consolidation (Adams
dropping out and his support transferring), not on any polled Cuomo lead.
- Source: https://web.archive.org/web/20250824173640/https://kalshi.com/markets/kxmayornycparty
- Source: https://web.archive.org/web/20250902212645/https://kalshi.com/markets/kxmayornycparty
- Source: https://web.archive.org/web/20250911100401/https://kalshi.com/markets/kxmayornycparty/kxmayornycparty-25

### 5. Sept 28–29, 2025 — Adams withdraws; Mamdani RISES to 84¢
Eric Adams withdrew from the race on Sunday **Sept 28, 2025** (his name stayed
on the printed ballot). Fox Business, Sept 29, 10:08am EDT: Kalshi showed
**Mamdani 84%**, **Cuomo 16%**, **Sliwa 2%**, on just over **$28 million** of
total wagers. *Meaning:* the one event that was supposed to threaten Mamdani —
consolidation of the opposition — happened, and his price went up (80¢ → 84¢).
The market had been holding back probability for *structural uncertainty*, not
for voter sentiment; once the structure resolved, that reserve was released.
- Source: https://www.foxbusiness.com/politics/prediction-market-traders-give-mamdani-84-chance-winning-new-york-mayoral-race
- Source (withdrawal date also): https://en.wikipedia.org/wiki/2025_New_York_City_mayoral_election

### 6. October 2025 — clock decay: 85¢ → 91¢ → 92¢ → 94¢
Archived Kalshi pages:

| Snapshot (UTC) | Mamdani (D) | Cuomo (AC) |
|---|---|---|
| 2025-10-06 12:29 | **85** | 15 |
| 2025-10-19 20:18 | **91** | 9 |
| 2025-10-23 01:00 | **92** | 9 |

Gothamist (2025-11-03) reported the Mamdani contract at **94¢** and Cuomo at
**8¢** as of Friday afternoon (Oct 31). Fox Business on election eve (Nov 3,
10:50am EST): **Mamdani 92%, Cuomo 8%, Sliwa 1%**, volume "just north of
**$71.5 million**." *Meaning:* no single October event moved the price; the
climb is time running out on the trailing candidates — the same
survival-against-the-clock dynamic as a late-game soccer price, but spread over
weeks instead of minutes.
- Source: https://web.archive.org/web/20251006122915/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/KXMAYORNYCPARTY-25
- Source: https://web.archive.org/web/20251019201802/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25
- Source: https://web.archive.org/web/20251023010045/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25
- Source: https://gothamist.com/news/ny-wants-to-shut-down-kalshi-the-company-behind-the-nyc-mayors-race-odds
- Source: https://www.foxbusiness.com/politics/prediction-markets-favor-democrats-new-york-new-jersey-virginia-election-day-races

### 7. Nov 4, 2025 — resolution
Mamdani won the general election with **1,114,184 votes (50.78%)** vs Cuomo
**906,614 (41.32%)** and Sliwa **153,749 (7.01%)**; turnout 2,218,647 (43.47%).
The D contract resolved YES. Post-settlement archived snapshot (2025-11-15):
D last_price 99 (settled), lifetime volume on the D market **97,427,964
contracts** and on the Cuomo market **106,846,300 contracts** (contract
counts, not dollars). Gothamist (Nov 3) reported Kalshi had facilitated more
than **$63 million** in trades on the mayor's race.
- Source: https://en.wikipedia.org/wiki/2025_New_York_City_mayoral_election
- Source: https://web.archive.org/web/20251115021208/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25
- Source: https://gothamist.com/news/ny-wants-to-shut-down-kalshi-the-company-behind-the-nyc-mayors-race-odds

---

## What the price "meant" before/after (summary for the page)

| Phase | Price | What the number was made of |
|---|---|---|
| June 19 (primary mkt) | Mamdani 19¢ | Longshot capability: insurgent vs famous frontrunner, cold polling evidence |
| June 24 am (primary mkt) | Mamdani ~49–57¢ | Live coin flip: momentum repricing faster than polls |
| Aug 24 (general) | Mamdani 83¢ | Favorite, discounted by *field-structure* uncertainty in a 5-way race |
| Sept 11 (general) | Mamdani 80¢ / Cuomo 17¢ | Peak consolidation hope: Cuomo's price is a bet on Adams quitting |
| Sept 29 (general) | Mamdani 84¢ | Consolidation happened; the structural discount is released *upward* |
| Oct 6 → Nov 3 (general) | 85¢ → 92–94¢ | Pure time decay: no news, just a shrinking window for an upset |
| Nov 4 | 100¢ / 0¢ | Resolution; metaphor collapses into fact |

---

## Data-integrity notes

- **Real vs modeled:** every price above is a real, dated Kalshi price from an
  archived Kalshi page or a dated news report. Nothing in this file is modeled.
- **Volume units:** archived-page `volume` fields are contract counts; dollar
  figures ($8M June 24, $28M Sept 29, $63M+/$71.5M Nov 3) are as reported by
  the cited outlets and may measure different scopes — see unverifiable list.
- **Discarded datum:** a 2025-09-19 snapshot repeats the 2025-09-11 values and
  volumes exactly (stale cache); it was discarded rather than used as a second
  September point.
- **Intraday discrepancy:** June 24 "morning" prices differ between Fox
  Business (56–57¢) and Gothamist (49¢); both are reported as morning-of
  prices and are quoted with attribution rather than reconciled.

## Unverifiable (searched, could not verify — do not invent)

- Kalshi price of the general-election `KXMAYORNYCPARTY-25-D` contract
  *before* June 24, 2025 (pre-primary archived snapshots of the page are
  client-side shells with no embedded prices; the API has purged the market).
- Kalshi's minute-by-minute path on primary night June 24 (claims exist that
  the market "settled on Mamdani in the final minutes" but no primary source
  with timestamps was opened).
- End-of-May nomination prices *on Kalshi specifically* (the widely cited
  ~93% Cuomo / ~6% Mamdani late-May figure is reported for Polymarket, with
  Kalshi described only qualitatively as telling "a similar story" —
  tech-insider.org retrospective, 2026-07-08).
- Reconciliation of the $63M (Gothamist, "mayor's race alone") vs $71.5M
  (Fox Business, same day) volume figures — likely different scopes; neither
  source defines its denominator.
- Dollar-equivalent of the archived contract-count volumes.

## Sources

- https://web.archive.org/web/20250824173640/https://kalshi.com/markets/kxmayornycparty
- https://web.archive.org/web/20250902212645/https://kalshi.com/markets/kxmayornycparty
- https://web.archive.org/web/20250911100401/https://kalshi.com/markets/kxmayornycparty/kxmayornycparty-25
- https://web.archive.org/web/20251006122915/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/KXMAYORNYCPARTY-25
- https://web.archive.org/web/20251019201802/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25
- https://web.archive.org/web/20251023010045/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25
- https://web.archive.org/web/20251115021208/https://kalshi.com/markets/kxmayornycparty/mayor-of-nyc-party-winner/kxmayornycparty-25
- https://www.foxbusiness.com/media/who-democratic-nominee-nyc-mayor-millions-betting-live (2025-06-24)
- https://www.foxbusiness.com/politics/prediction-market-traders-give-mamdani-84-chance-winning-new-york-mayoral-race (2025-09-29)
- https://www.foxbusiness.com/politics/prediction-markets-favor-democrats-new-york-new-jersey-virginia-election-day-races (2025-11-03)
- https://gothamist.com/news/ny-wants-to-shut-down-kalshi-the-company-behind-the-nyc-mayors-race-odds (2025-11-03)
- https://en.wikipedia.org/wiki/2025_New_York_City_mayoral_election
- https://tech-insider.org/prediction-markets/nyc-mayor-odds/ (2026-07-08 retrospective; used for narrative cross-checks and the Polymarket late-May figure only)
- Kalshi public API (event metadata only; settled markets purged): https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXMAYORNYCPARTY
