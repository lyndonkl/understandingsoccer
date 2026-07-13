# Soccer worked example — Argentina vs Switzerland, 2026 World Cup quarterfinal

Research date: 2026-07-12. All Kalshi figures below were pulled directly from the
public Kalshi API (`api.elections.kalshi.com/trade-api/v2`, no auth) on 2026-07-12.
All match facts were verified against at least two press sources. Anything inferred
rather than observed is explicitly labeled **[inference]** or **[model assumption]**.

## Verdict up front

**The anchor match is real, and the "two 26¢" story is real — with one correction.**
Argentina played Switzerland in the 2026 World Cup **quarterfinal** on July 11, 2026
(not the group stage). Switzerland (the underdog) equalized to 1-1 in the 67th
minute, went down to ten men on a red card in the ~72nd–73rd minute, held 1-1
through the end of regulation, and lost 3-1 in extra time.

The market that carries the story is **`KXWCADVANCE-26JUL11ARGSUI-SUI`**
("Will Switzerland advance past Argentina?", i.e. win by any means including extra
time and penalties):

- **Kickoff price: 25–26¢** (it had traded 25–28¢ continuously for the four days
  since the market opened on July 7).
- **~90'+stoppage, 1-1, down to ten men: back to 25–26¢** (26¢ closes at 03:05 and
  03:06 UTC, right at the regulation whistle), after having been driven down to
  9–10¢ while trailing 0-1.

Same number, same market, same match — first as *capability* (can Switzerland beat
Argentina over 90+ minutes?), then as *survival* (can ten men hold a draw into
penalties?). The regulation-time moneyline (`KXWCGAME-...-SUI`) does NOT show this
pattern (it opens at 15–16¢ and dies to 3–5¢ after the red card, because a
regulation win requires Switzerland to *score again* with ten men). The page's
framing should use the **Advance** market, and should be precise that "26¢ late" =
"advance via holding for extra time / penalties."

---

## 1. The match — verified facts

| Fact | Value | Sources |
|---|---|---|
| Fixture | Argentina vs Switzerland, FIFA World Cup 2026 **quarterfinal** | NBC, FOX, Yahoo |
| Date / venue | Saturday **July 11, 2026**, Arrowhead Stadium (FOX styles it "Kansas City Stadium"), Kansas City, MO; kickoff 9 PM ET (= 01:00 UTC Jul 12) | NBC, Yahoo, FOX |
| Final score | **Argentina 3–1 Switzerland (after extra time)**; 1-1 at 90 minutes | NBC, FOX, Yahoo |
| 10' (NBC/FOX; Yahoo says 11') | **1-0** Alexis Mac Allister header, off a Messi corner | NBC, FOX, Yahoo |
| Halftime | 1-0 Argentina | NBC, FOX |
| 44' | Embolo first yellow | FOX boxscore |
| 67' | **1-1** Dan Ndoye equalizer (through ball from Ricardo Rodríguez slipped under Emiliano Martínez) | NBC, FOX, Yahoo |
| 72'–73' | **Red card: Breel Embolo**, second yellow for simulation/diving after VAR review — Switzerland down to 10 men (NBC says 72', FOX boxscore says 73') | NBC, FOX, Yahoo |
| 90' | Still 1-1; match goes to extra time | NBC, FOX, Yahoo |
| 112' | **2-1** Julián Álvarez, curled shot into the top corner | NBC, FOX |
| 120'+1 (FOX lists 120') | **3-1** Lautaro Martínez, rebound finish | NBC, FOX |
| Aftermath | Argentina advance to the semifinal vs England, Wed July 15, Mercedes-Benz Stadium, Atlanta | Yahoo, WebSearch results |
| Pre-match framing | Argentina "heavily favored" | Yahoo |

Minor source discrepancies to be honest about on the page: first goal 10' vs 11';
red card 72' vs 73'. Use "10th minute" and "72nd–73rd minute" or pick one and
footnote it.

### Tournament context (bracket so far)

- 2026 WC quarterfinals: **France beat Morocco** (Jul 9), **Spain beat Belgium**
  (Jul 10), **England beat Norway** (Jul 11), **Argentina beat Switzerland**
  (Jul 11). Winners verified from settled Kalshi Advance markets
  (`KXWCADVANCE-26JUL09FRAMAR`: FRA yes / MAR no; `KXWCADVANCE-26JUL10ESPBEL`:
  ESP yes; `KXWCADVANCE-26JUL11NORENG`: ENG yes) and press.
- Semifinals: **France vs Spain**, Tue Jul 14, AT&T Stadium, Arlington TX, 3 PM ET;
  **England vs Argentina**, Wed Jul 15, Mercedes-Benz Stadium, Atlanta, 3 PM ET.
  Final Jul 19 at MetLife Stadium (sources: Yahoo semifinal bracket article, FOX,
  Mercedes-Benz Stadium event page — via WebSearch results listed below).
- Argentina's path (from Kalshi event fixtures, `KXWCGAME` series): group games vs
  Austria (Jun 22) and Jordan (Jun 27); Round of 32 vs Cape Verde (Jul 3); Round
  of 16 vs Egypt (Jul 7). Switzerland's path: group vs Bosnia and Herzegovina
  (Jun 18) and Canada (Jun 24); R32 vs Algeria (Jul 2); R16 vs Colombia (Jul 7).
  (Fixture existence verified via API; individual scores of those earlier games
  were not researched here.)
- So Argentina vs Switzerland happened **exactly once** in this World Cup: the
  quarterfinal. The user's memory of watching it live matches a match played
  9 PM ET July 11 / ending ~11:45 PM ET.

---

## 2. The Kalshi markets — verified via public API

Two relevant event tickers, both real, both settled, both with full price history
available from the candlesticks endpoint:

### A. `KXWCADVANCE-26JUL11ARGSUI` — "Argentina vs Switzerland" (to advance)

Series `KXWCADVANCE` ("World Cup Advance"). Binary markets, any means of advancing
(regulation, extra time, penalties).

| Market | Rules (primary) | Result | Volume (contracts) | Open interest |
|---|---|---|---|---|
| `...-ARG` | "If Argentina advance past Switzerland … Quarterfinal of the FIFA World Cup" | **yes** | 57,410,549 | 35,527,452 |
| `...-SUI` | "If Switzerland advance past Argentina …" | **no** | 41,975,546 | 23,577,440 |

Opened 2026-07-07T23:10Z, closed 2026-07-12T03:44:46Z (early close after winner
declared).

### B. `KXWCGAME-26JUL11ARGSUI` — "Argentina vs Switzerland: Regulation Time Moneyline"

Series `KXWCGAME` ("World Cup Game"). Three binary markets — 90 minutes + stoppage
only, extra time excluded.

| Market | Result | Volume (contracts) |
|---|---|---|
| `...-ARG` (Reg Time: Argentina) | **no** | 15,117,837 |
| `...-SUI` (Reg Time: Switzerland) | **no** | 7,029,853 |
| `...-TIE` (Reg Time: Tie) | **yes** (1-1 at 90') | 9,192,932 |

Settlement sources named in the series metadata: ESPN and FIFA. Kalshi also lists
dozens of other 2026 WC series (`KXWCSCORE` correct score, `KXWCTOTAL`,
`KXWCSPREAD`, `KXMWORLDCUP` outright winner, etc.) — confirmed in the series list
pull but not needed for this example.

---

## 3. Price history — the load-bearing numbers (all real, from API candlesticks)

Candlesticks endpoint used:
`GET /trade-api/v2/series/{series}/markets/{market}/candlesticks?start_ts=&end_ts=&period_interval={1|60}`.
Prices below are 1-minute **close** prices in dollars (yes side). Raw minute data
saved to `research/data/argsui-advance-minute.txt` and
`research/data/argsui-regulation-minute.txt`.

### Switzerland-to-advance (`KXWCADVANCE-26JUL11ARGSUI-SUI`) — the hero series

Pre-match (hourly closes): traded **27–28¢** from open (Jul 7) through Jul 10,
drifting to **26¢** on Jul 10–11 and sitting at **25–26¢ all day** on match day.
This is a four-day, ~42M-contract market saying "Switzerland ~26%."

In-match (UTC, Jul 12; kickoff 01:00 UTC):

| UTC | Match state [inference: mapping of clock to match minute] | SUI advance (close) |
|---|---|---|
| 00:30–00:55 | pre-kickoff | **26¢** |
| 01:00–01:10 | kickoff, opening minutes | **25¢** |
| 01:15 | after Mac Allister 10' goal (0-1 down) | **12¢** |
| 01:20–02:10 | trailing 0-1 through halftime and into 2H | 10–13¢ |
| 02:25–02:27 | just before the equalizer | 9–10¢ |
| 02:29–02:31 | **Ndoye 67' equalizer** — spike | 30–32¢ (1-min closes; hourly candle high 35¢) |
| 02:33 | **Embolo red card ~72'** — spike snuffed | **16¢** |
| 02:33–02:47 | 1-1, ten men, ~73'–85' | 16–17¢ |
| 02:48–03:04 | the survival climb as regulation dies | 19¢ → 21¢ → 22¢ → 23¢ → 25¢ |
| **03:05–03:06** | **regulation ends 1-1** (reg-time markets closed 03:04:25 UTC) | **26¢** |
| 03:07–03:32 | extra time, ten men, penalties approaching | 22¢ → 30¢ → **33–35¢ peak** (03:23–03:32) |
| 03:33 | **Álvarez 112' goal** | **2¢** |
| 03:35–03:45 | 2-1, then 3-1 | 1¢ → settles **0** |

Volume tells the emotional story too: ~40–100K contracts/hour pre-match, then
**1.28M contracts in the single minute of the equalizer** (02:30), and >200K/min
through the endgame climb.

### Regulation-time moneyline (same match, for contrast)

Pre-kickoff closes: **SUI 15–16¢ / ARG 57¢ / TIE 29–30¢** (sums ≈ 102¢, typical
bid/ask rounding). After the 10' goal: SUI 6–7¢, ARG 75–78¢, TIE 17–18¢. After
equalizer + red card: SUI 3–5¢ (a ten-man team must now score to win in
regulation), TIE climbing 45¢ → 72¢ → **93¢ (03:00)** → 99¢ at close. A nice
mirror: **Argentina's reg-time price was 26¢ at 02:55 UTC** — the same digits
meaning a third thing (favorite racing the clock).

### The two 26¢ moments, precisely stated

1. **Kickoff 26¢ (capability):** Switzerland-to-advance closed at 26¢ through the
   final pre-kickoff hour (25¢ in the kickoff minutes; 25–26¢ range all day).
   Meaning: full-strength Switzerland beating Argentina by any route over 90–120
   minutes + penalties.
2. **Late-game 26¢ (survival):** same market back at 26¢ at 03:05–03:06 UTC —
   1-1, Embolo sent off, regulation just ending. Meaning: ten men holding a draw
   through extra time to reach penalties, then a coin-flip-ish shootout.

Both are **real traded prices**, not modeled. The identity is essentially exact
(25 vs 26 at the kickoff minute is the only wobble; "~26¢" is honest for both).

---

## 4. Real vs. modeled — what the page must label

**Real (verified, cite as such):**
- Everything in sections 1–3: fixture, timeline, cards, scores, tickers, rules
  text, settlement results, volumes, open interest, and every price quoted.

**Inference (label on the page):**
- The mapping of UTC price timestamps to match minutes (kickoff 01:00 UTC per NBC
  "9 PM ET"; 10' goal aligns with the 01:11–01:15 repricing; 67' equalizer with
  the 02:29 spike; red card with the 02:33 crush; regulation end with the
  03:04:25 reg-market close). The alignment is tight and internally consistent,
  but Kalshi timestamps candles, not match events.
- Minor: first goal 10' vs 11', red card 72' vs 73' (source disagreement).

**Model assumptions (if the page decomposes the price):**
- Any split of the 26¢ into "statistical fair value" vs "sentiment/emotional
  premium" is a **model assumption** — no verified source provides a fair-value
  benchmark for either moment. The extra-time drift from 22¢ → 35¢ (as penalties
  neared) and the 1.28M-contract equalizer minute are real observables the page
  can use as *evidence* of regime change without inventing a fair-value number.
- Any per-unit narrative ("each dot = X contracts") is a design choice, not data;
  real totals to anchor it: SUI-advance volume 41,975,546 contracts, OI 23,577,440.

**Not verifiable / not found (do not claim):**
- Whether the *user's remembered* 26¢ was the Advance market or something else —
  the Advance market matches the description; the reg-time moneyline does not.
- Intra-minute tick data (finest public granularity is 1-minute candles).
- Official attendance figure (not captured in the fetched pages).
- Pre-match implied odds from other sportsbooks (not researched; Kalshi's own
  75–76¢ ARG / 25–26¢ SUI advance prices establish underdog status on their own).

---

## 5. Reusable API notes for the build

- Series list: `GET https://api.elections.kalshi.com/trade-api/v2/series?category=Sports`
- Event with markets: `GET /trade-api/v2/events/KXWCADVANCE-26JUL11ARGSUI?with_nested_markets=true`
- Candles: `GET /trade-api/v2/series/KXWCADVANCE/markets/KXWCADVANCE-26JUL11ARGSUI-SUI/candlesticks?start_ts=<unix>&end_ts=<unix>&period_interval=1`
  (max ~100 candles per hourly request window; minute requests return ≤ ~3.2h per call).
  Candle schema: `price.{open,high,low,close,mean,previous}_dollars`,
  `yes_bid.*_dollars`, `yes_ask.*_dollars`, `volume_fp`, `open_interest_fp`,
  `end_period_ts`.
- No auth required for any of the above.
- Raw pulls saved: `research/data/argsui-advance-minute.txt` (SUI/ARG advance,
  00:30–03:45 UTC), `research/data/argsui-regulation-minute.txt` (SUI/ARG/TIE
  reg-time, 00:30–03:05 UTC).

## Sources

- Kalshi public API (all market/price/volume data, pulled 2026-07-12):
  - https://api.elections.kalshi.com/trade-api/v2/series?category=Sports
  - https://api.elections.kalshi.com/trade-api/v2/events/KXWCGAME-26JUL11ARGSUI?with_nested_markets=true
  - https://api.elections.kalshi.com/trade-api/v2/events/KXWCADVANCE-26JUL11ARGSUI?with_nested_markets=true
  - https://api.elections.kalshi.com/trade-api/v2/markets/KXWCGAME-26JUL11ARGSUI-TIE
  - https://api.elections.kalshi.com/trade-api/v2/series/KXWCADVANCE/markets/KXWCADVANCE-26JUL11ARGSUI-SUI/candlesticks
  - https://api.elections.kalshi.com/trade-api/v2/series/KXWCGAME/markets/KXWCGAME-26JUL11ARGSUI-{ARG,SUI,TIE}/candlesticks
  - https://api.elections.kalshi.com/trade-api/v2/events/KXWCADVANCE-26JUL{09FRAMAR,10ESPBEL,11NORENG}?with_nested_markets=true
- NBC Sports live blog (timeline, venue, kickoff time):
  https://www.nbcsports.com/soccer/live/argentina-vs-switzerland-live-updates-score-goals-highlights-stats-2026-fifa-world-cup-july-11
- FOX Sports boxscore (goal/card minutes incl. Embolo 44' + 73'):
  https://www.foxsports.com/soccer/fifa-world-cup-men-argentina-vs-switzerland-jul-11-2026-game-boxscore-607930
- Yahoo Sports match report (result, semifinal opponent, "heavily favored"):
  https://sports.yahoo.com/articles/argentina-vs-switzerland-live-score-200002967.html
- Semifinal schedule (WebSearch corroboration):
  https://sports.yahoo.com/soccer/article/world-cup-semifinals-bracket-full-schedule-matchups-and-path-to-the-final-164942403.html
  https://www.mercedesbenzstadium.com/events/fifa-world-cup-26-tm---semi-final
  https://www.foxsports.com/stories/soccer/2026-world-cup-bracket-semifinals-finals-matchups
- Additional search-result corroboration (not separately fetched):
  https://www.vavel.com/en-us/soccer/2026/07/12/1265583-argentina-vs-switzerland-live-score-2026-world-cup.html
  https://sports.yahoo.com/articles/argentina-vs-switzerland-results-today-113651048.html
