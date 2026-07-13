# Published parameters for the soccer probability model ("rational baseline" layer)

Research date: 2026-07-12. Every fact below was verified by opening the cited source
(WebFetch, or PDF downloaded and read). Items that could not be verified are listed in
**Unverifiable / not found** at the end. Values we derive ourselves from published tables
are explicitly labeled **derived**; anything the page will present that goes beyond these
sources must be labeled a **model assumption**.

---

## 1. Average goals per match at recent World Cups

| Tournament | Goals | Matches | Goals/match | Status |
|---|---|---|---|---|
| 2018 (Russia) | 169 (excl. shootouts) | 64 | ≈ 2.64 (derived: 169/64) | verified |
| 2022 (Qatar) | 172 (excl. shootouts) | 64 | ≈ 2.69 (derived: 172/64) | verified |
| 2026 group stage | 215 | 72 | 2.98 | verified (as of 2026-07-02) |
| 2026 through 83 matches | 244 | 83 | 2.94 | verified (as of 2026-07-02; tournament still in progress) |

- Degrenne & Carling (2024), "Comparison of goalscoring patterns between the 2018 and 2022
  FIFA World Cups," *Frontiers in Sports and Active Living* 6:1394621 — "Altogether, 169
  goals were scored in WC 2018 vs. 172 goals in WC 2022" (penalty-shootout goals excluded).
  Per-match averages are our division by the 64 matches each tournament had.
  Source: https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1394621/full
- beIN Sports (2026-07-02): 2026 group stage "A total of 215 goals were scored across the
  first 72 matches, averaging 2.98 goals per game"; "After 83 matches, the tournament has
  produced 244 goals... an average of 2.94 goals per game"; highest since Mexico 1970
  (2.97). 2026 has already surpassed 2022's total of 172.
  Source: https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/fifa-world-cup-2026-posts-highest-goals-per-game-average-in-nearly-60-years-2026-07-02
- Cross-check: footballhistory.org reports 2018 group stage at 2.54 goals/match (122 goals
  in 48 group matches). Source: https://www.footballhistory.org/world-cup/statistics.html

**Model implication:** a two-team total-goal intensity of ~2.6–2.7 goals per 90 minutes is
a literature-grounded baseline for a World Cup match; 2026 has run hotter (~2.9–3.0).

---

## 2. Effect of a red card on scoring rates

### Vecer, Kopriva & Ichiba (2009) — betting-market estimate
"Estimating the Effect of the Red Card in Soccer: When to Commit an Offense in Exchange for
Preventing a Goal Opportunity," *Journal of Quantitative Analysis in Sports* 5(1), pp. 1–20.
Verified via the IDEAS/RePEc abstract page: they estimate scoring intensities from live
betting odds for FIFA World Cup 2006 and Euro 2008; **the scoring intensity of the
penalized team drops significantly, while the scoring intensity of the opposing team
increases slightly**; a red card to the stronger team typically reduces total goals, but a
red card to the weaker team can increase them.
Source: https://ideas.repec.org/a/bpj/jqsprt/v5y2009i1n8.html
(The precise multipliers often quoted for this paper — sanctioned team to ~2/3 of prior
intensity, opponent ×~5/4 — appeared only in search snippets we could not open; see
Unverifiable.)

### Červený, van Ours & van Tuijl (2017) — World Cup hazard-rate estimate (open access, full PDF read)
"Effects of a red card on goal-scoring in World Cup football matches," *Empirical
Economics* (DOI 10.1007/s00181-017-1287-5). 320 FIFA World Cup matches, 1998–2014, mixed
proportional hazard model. Verified from the paper itself:
- Opponent gets a red card → your probability of scoring "increases by almost
  (exp(0.81) − 1) × 100 ≈ **124%**".
- Your own red card → your goal-scoring rate is lowered by **47%** (coefficient −0.63).
- Timing heterogeneity (Table 6): opponent-red-card effect coefficient 0.80 (0–45'),
  0.53 (45–75'), **1.41 (75–120')** — i.e. a late red card boosts the non-sanctioned
  team's scoring rate the most; own-red-card effect −1.19 (0–45'), −0.30 (45–75'),
  +0.51 n.s. (75–120').
- Literature reviewed in the same paper (verified on its pages): **Ridder et al. (1994)**,
  340 Dutch matches 1991–92: goal-scoring intensity of the team still playing 11
  **increases by 88%**, while the 10-man team's intensity **does not change**; around the
  70th minute it becomes optimal for a defender to commit a professional foul to stop a
  clear goal chance. **Vecer et al. (2009)** summarized as above.
- Red-card *issuance* is score-dependent: each goal ahead lowers the probability of
  receiving a red card by ≈75% (exp(−1.42)); red cards are more likely in the second half
  and extra time.
Source (open-access PDF): https://repub.eur.nl/pub/109448/REPUB_109448_OA.pdf
Publisher page: https://link.springer.com/article/10.1007/s00181-017-1287-5

### Titman, Costain, Ridall & Gregory (2015) — EPL/Championship counting-process model
"Joint Modelling of Goals and Bookings in Association Football," *JRSS Series A*
178(3):659–683 (DOI 10.1111/rssa.12075). Quantitative results verified from the authors'
slide deck at Lancaster (maths.lancs.ac.uk), which presents the paper's estimates:
- **Home red card → away team's scoring rate +60%, home team's −17%.**
- **Away red card → home team's scoring rate +69%, away team's −42%.**
- At a score draw, both teams' scoring rates fall vs 0-0: **home −13%, away −27%**
  (teams "sit back"; relevant to a 1-1 endgame).
- **No direct effect of yellow cards on goal-scoring rates**; a team's booking rate rises
  25% after an opponent yellow; a first yellow more than doubles the hazard of a
  subsequent straight red for that team.
- Weibull baseline intensities: all event intensities increase as the match progresses.
Slides: https://www.maths.lancs.ac.uk/~titman/football_rss.pdf
Journal page: https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/rssa.12075
Publisher (OA landing): https://academic.oup.com/jrsssa/article/178/3/659/7058647

### Maia, Pennanen, da Silva & Targino — Cox-process model, Brazilian Série A (full PDF read)
"Stochastic modelling of football matches," arXiv:2312.04338. Eight seasons of Campeonato
Brasileiro Série A:
- **A team that receives a red card sees its goal intensity decrease by more than 30%.**
- **A team losing by one goal has a ~10% higher goal rate; losing by two, ~20% higher.**
- Stoppage time lengthens when the goal difference at the end of the second half is ≤ 1.
Source: https://arxiv.org/pdf/2312.04338

---

## 3. Poisson / bivariate-Poisson match-model literature

### Maher (1982) — the foundational model (full PDF read)
Maher, M.J., "Modelling association football scores," *Statistica Neerlandica* 36(3):109–118.
- Home score X ~ Poisson(α_i β_j), away score Y ~ Poisson(γ_i δ_j): team attack ×
  opponent defence multiplicative intensities, fitted by maximum likelihood to English
  Football League data (Rothmans Yearbooks 1973–75).
- Model selection: a single attack parameter and a single defence parameter per team
  suffice, with **home advantage entering as one constant multiplicative factor applied to
  every team** (his "model 2": δ = kα, γ = kβ); "each team's inherent scoring power is
  diminished by a constant factor when playing away."
- Independent Poisson fits reasonably (19 of 24 goodness-of-fit tests non-significant), but
  score *differences* fit better with a **bivariate Poisson with correlation ≈ 0.2**.
- Observed Division 1 1971–72 goal distributions (Table 4/5, 462 matches):
  home goals 0/1/2/3/4+ proportions 0.217/0.321/0.254/0.130/0.078; away
  0.388/0.371/0.177/0.051/0.014. **Derived** from these tables: mean home goals ≈ 1.5,
  mean away goals ≈ 0.9 per match (our computation from his published frequencies).
Source (full text): http://www.90minut.pl/misc/maher.pdf
Journal record: https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9574.1982.tb00782.x

### Dixon & Coles (1997) — the standard betting-market model
Dixon, M.J. & Coles, S.G., "Modelling Association Football Scores and Inefficiencies in the
Football Betting Market," *JRSS Series C (Applied Statistics)* 46(2):265–280.
- Verified via the journal abstract: Poisson-regression-based model with team attack and
  defence parameters, fitted to English league and cup data 1992–95; exploited
  inefficiencies against bookmakers' odds 1995–96 with **a positive betting return**;
  team performances treated as dynamic (time-downweighted likelihood).
  Source: https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/1467-9876.00065
- Model structure verified in detail via Michels, Ötting & Karlis (2023), "Extending the
  Dixon and Coles model: an application to women's football data" (arXiv:2307.02139, full
  PDF read): independent Poisson marginals with means λ1, λ2 multiplied by a correction
  τ(x1,x2) that shifts probability among the scores 0-0, 1-0, 0-1, 1-1 via a dependence
  parameter ω̃ (draws otherwise underestimated); their illustration fixes **λ1 = 1.3 and
  λ2 = 1.2 as "reasonable means"** for the two teams' Poisson marginals.
  Source: https://arxiv.org/pdf/2307.02139
- Dixon & Coles' own numeric home-advantage estimate is behind a paywall (see Unverifiable).

### In-play pricing on Poisson intensities
Divos, del Bano Rollin, Bihari & Aste (2018), "Risk-Neutral Pricing and Hedging of In-Play
Football Bets," arXiv:1811.03931 (full PDF read): in-play football bets are priced by
modelling the two teams' scores as **independent time-homogeneous Poisson processes**; the
market of in-play bets is arbitrage-free and complete in this model; calibrated to Betfair
Match Odds and Over/Under quotes (worked example: Portugal–Netherlands, Euro 2012). They
note (citing Vecer et al. 2009) that in-play bets carry **additional sensitivities beyond
the standard Poisson model, e.g. to red cards**.
Source: https://arxiv.org/pdf/1811.03931

**Model implication:** modelling each team's goals as a Poisson process whose intensity is
(attack × opponent-defence), with a draw-inflation correction and state-dependent
multipliers for red cards and score line, is exactly the published standard
(Maher → Dixon-Coles → Titman → Cox-process extensions).

---

## 4. Defending a draw a man down: published outcome numbers

No published in-play model table giving "win probability of a team defending a draw with
ten men in minute X" was found from an openable source (see Unverifiable). The nearest
published, citable anchors:

### Chowdhury (2015), Marquette University working paper 2015-01 (full PDF read)
"Can Ten do it Better? Impact of Red Card in the English Premier League," EPL 1992-93 to
2012-13:
- **Of the 20 EPL teams that were drawing at the moment they received a red card in
  2012-13: 65% went on to lose, 30% held on for a draw, and 5% (one team) won.**
  So a team drawing when reduced to ten avoided defeat only ~35% of the time.
- 2012-13 season: average dismissal at minute 56; after the dismissal the 10-man team
  averaged **0.38 goals vs 0.77** for the 11-man team (red-card team scored 33% of
  post-dismissal goals).
- Timing of the deficit (footnote, citing prior EPL research): a red card in the 1st
  minute reduces expected goal difference by ≈1.5 goals; at half-time ≈0.85; at the
  60th minute ≈0.62.
- ~15% of EPL matches in a given year feature at least one red card.
Source: https://epublications.marquette.edu/cgi/viewcontent.cgi?article=1047&context=econ_workingpapers

### Supporting state-dependence estimates (verified above)
- Titman et al. (2015): at a score draw both teams' scoring intensities drop (home −13%,
  away −27% vs 0-0), and a red card shifts intensities +60/69% (opponent) and −17/42%
  (sanctioned) — the ingredients an in-play model combines for the 1-1 man-down endgame.
- Červený et al. (2017): the late-window (75–120') opponent-red-card coefficient is the
  largest (1.41), i.e. the man-advantage team's scoring hazard is boosted most late on.

**Model implication:** any specific late-game survival probability shown on the page (e.g.
"P(draw holds | 1-1, red card, minute 80)") must be computed from our own Poisson model
using the multipliers above and labeled a **model assumption**, anchored to Chowdhury's
observed 65/30/5 outcome split as the empirical sanity check.

---

## Unverifiable / not found (do not present as fact)

1. **Vecer et al.'s exact multipliers ("sanctioned team falls to ~2/3 of prior intensity,
   opponent ×~5/4").** These figures appeared in search-result snippets attributed to the
   paper but the full text (De Gruyter, ResearchGate, academia.edu, Wiley Significance
   2015 article) was 403/paywalled and Vecer's homepage had no copy. Use the verified
   qualitative statement from the RePEc abstract, or the verified alternatives (Červený:
   −47%/+124%; Titman: −17/42%/+60/69%; Maia: −30%+).
2. **Dixon & Coles (1997) numeric home-advantage parameter estimate** (often quoted around
   1.3–1.4): the paper PDF at academic.oup.com returned 403; only the abstract was
   openable. Cite the model structure, not a specific γ value.
3. **A published in-play win-probability table for "defending a draw a man down late"**
   (e.g. from a bookmaker model paper). Clegg et al. 2026 (arXiv:2605.16066) and Divos et
   al. 2018 calibrate in-play models to Betfair but do not publish that scenario's number.
4. **Final 2026 World Cup goals-per-match average** — tournament still in progress on
   2026-07-12; only group-stage (2.98) and through-83-matches (2.94) figures are published.

---

## Sources

1. https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1394621/full — Degrenne & Carling 2024, Frontiers in Sports and Active Living (2018: 169 goals; 2022: 172 goals)
2. https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/fifa-world-cup-2026-posts-highest-goals-per-game-average-in-nearly-60-years-2026-07-02 — 2026 WC: 215 goals/72 group matches (2.98), 244/83 (2.94)
3. https://www.footballhistory.org/world-cup/statistics.html — 2018 group stage 2.54 goals/match
4. https://ideas.repec.org/a/bpj/jqsprt/v5y2009i1n8.html — Vecer, Kopriva & Ichiba 2009, JQAS 5(1), abstract
5. https://repub.eur.nl/pub/109448/REPUB_109448_OA.pdf — Červený, van Ours & van Tuijl 2017, Empirical Economics (open-access PDF; +124%/−47%, timing effects, Ridder et al. +88%)
6. https://link.springer.com/article/10.1007/s00181-017-1287-5 — publisher page for #5
7. https://www.maths.lancs.ac.uk/~titman/football_rss.pdf — Titman et al. slides (paper estimates: +60/+69%, −17/−42%, draw-state −13/−27%)
8. https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/rssa.12075 — Titman et al. 2015, JRSS-A 178(3):659–683
9. http://www.90minut.pl/misc/maher.pdf — Maher 1982, Statistica Neerlandica 36(3):109–118 (full text)
10. https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9574.1982.tb00782.x — journal record for Maher 1982
11. https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/1467-9876.00065 — Dixon & Coles 1997, JRSS-C 46(2):265–280 (abstract)
12. https://arxiv.org/pdf/2307.02139 — Michels, Ötting & Karlis 2023 (DC model structure; λ1=1.3, λ2=1.2 illustration)
13. https://arxiv.org/pdf/1811.03931 — Divos et al. 2018, Risk-Neutral Pricing and Hedging of In-Play Football Bets
14. https://arxiv.org/pdf/2312.04338 — Maia et al., Stochastic modelling of football matches (red card −30%+; trailing +10/20%)
15. https://epublications.marquette.edu/cgi/viewcontent.cgi?article=1047&context=econ_workingpapers — Chowdhury 2015, Marquette WP 2015-01 (65/30/5 split; 0.38 vs 0.77 goals)
16. https://arxiv.org/pdf/2605.16066 — Clegg, Song & Cartlidge 2026 (market-calibrated in-play AFT model; context for item 4)
