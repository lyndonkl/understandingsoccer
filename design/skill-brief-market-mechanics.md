# Constraint Brief: market-mechanics-betting skill → price/probability layer

Source: `/Users/kushaldsouza/.claude/skills/market-mechanics-betting/` (SKILL.md, resources/betting-theory.md, resources/scoring-rules.md). Everything below is what the skill actually says; gaps are flagged at the end.

## Hard constraints (data integrity for the page)

- **Price → probability conversion must use the skill's formulas.** Decimal odds: P = 1/odds. American +150 → 100/(150+100) = 40%; −150 → 150/(150+100) = 60%. Fractional 3/1 → 1/(3+1) = 25%. On Kalshi, a 26¢ contract = 26% implied probability directly.
- **Edge = your probability − market probability.** This is the skill's definition of the "spread between fair value and traded price." Any visual gap between model dots and price dots must be labeled as this edge, and the model side must be an explicitly labeled assumption.
- **Edge thresholds are real numbers — use them, don't invent softer ones.** Prediction markets: 5–10% minimum edge (fees ~2–5% eat the rest). Sports betting: 3–5%. The page can honestly show that a 2–3¢ gap between fair value and price is *inside the fee band* and means nothing tradeable.
- **Judge decisions by EV, not outcomes.** The skill is emphatic: good decisions lose, bad decisions win; process dominates below ~50 trials, results dominate above ~100. Do not let the narrative imply a price was "wrong" because the outcome went the other way.
- **Only strictly proper scoring rules for accuracy claims.** Brier = (1/N)Σ(p−o)², range 0 (perfect) to 1; random-guessing baseline = 0.25. If the page scores prices against outcomes, use Brier, never binary right/wrong ("threshold accuracy" is explicitly improper and gameable).
- **Sample-size floor for any "the market was accurate" claim:** 50+ forecasts minimum, 100+ preferred; calibration bins need 20–50 points for moderate evidence, 50+ for strong. Do not draw a calibration curve from a handful of matches.

## Concrete recommendations for the visualization

- **Calibration curve is a native visual for this page.** X = stated/market probability, Y = actual frequency; perfect calibration is the diagonal y = x. Points below the diagonal = overconfidence (market said 90%, happened 70%); above = underconfidence. This maps directly onto dots re-sorting against a diagonal reference line.
- **The 26¢ dot count has a probabilistic reading the skill endorses:** at 26%, out of 100 persistent units, ~26 "resolve YES" worlds vs ~74 "NO" worlds. Law of large numbers gives concrete convergence beats: at 10 trials variance dominates, at 100 results near EV, at 1000 tightly centered. A three-beat "run the match 10× / 100× / 1000×" sequence has skill-grounded thresholds.
- **Variance vs signal is quantifiable and dramatic:** the skill's worked example (60% event, even odds, $100) gives EV = $20 but σ = $98 — standard deviation ~5× the EV. Coefficient of variation bands: CV<1 low (10–30 trials to see EV), 1–3 moderate (30–50), 3–10 high (50–100), >10 extreme (100+). Good numeric grounding for the "late-game volatility" beat.
- **Log score = bits of surprise** is a clean encoding hook: −log₂(p). A 50% event resolving = 1 bit, 25% = 2 bits, 12.5% = 3 bits. A 26¢ contract resolving YES ≈ 1.94 bits of surprise. Usable if the page wants to show *how surprising* the underdog win is.
- **Extremizing (Good Judgment Project finding):** averaged crowd forecasts are systematically too moderate; push away from 50% by factor 1.2–1.5 (default 1.3): Extremized = 50% + (avg − 50%) × factor. Relevant if the page compares individual model vs aggregated market price.
- **Murphy decomposition** for the fair-value-vs-price layer: Brier = Reliability (calibration error, lower better) − Resolution (discrimination, higher better) + Uncertainty (base-rate variance, uncontrollable). "Sharpness" = variance of stated probabilities; a market stuck near 50% is unsharp/useless even if calibrated. The kickoff-26¢ price being far from 50% is the market being *sharp*.

## Sentiment / bias vocabulary the skill actually names

Use these exact named biases for the "emotional units" color channel — each has a skill definition:

- **Recency bias, base-rate neglect, narrative following** — listed as the behavioral-bias category where market edges come from (i.e., where price detaches from fair value).
- **Overconfidence bias** — stating 90% when true rate is 70%; detected as calibration-curve points below the diagonal.
- **Loss aversion / chasing losses** — increasing exposure after losses, driven by emotional arousal.
- **Tilt** — emotional betting after a bad beat or streak; "no analysis, revenge betting." The late-game red-card panic beat is essentially a tilt visualization.
- **Outcome bias** — judging the decision by the result; **hindsight bias** — "I knew it" after resolution.
- **When to trust vs question a price (skill's explicit test):** Trust = liquid, mature, objective outcome, many informed participants, low emotion. Question = illiquid, new, subjective, few participants, **high emotion (politics, fandom)**. This is the skill's direct license for the page's claim that a late-game soccer price is more sentiment-laden than a kickoff price — cite it as the framework, and mark the *magnitude* of any drawn sentiment gap as a model assumption.
- **Efficiency framing:** "Market is usually right — you need edge to beat it." Liquid markets are semi-strong efficient (price already contains polls, news, base rates, obvious stats). The page should present the market price as the default best estimate, with sentiment as a deviation, not the other way around.

## Pitfalls to avoid

- **Do not visualize a fair-value/price gap smaller than the fee band (~2–5%) as meaningful.** The skill's own threshold table says sub-5% edges in prediction markets are noise.
- **Do not use binary right/wrong framing anywhere** ("the market got it wrong when the 26% team won") — that is the improper threshold rule; 26% events happen 26% of the time and the skill's Event-D example makes exactly this point.
- **Do not imply single-event calibration.** One match tells you nothing (variance dominates <30 trials). Any calibration claim needs the 50+ sample framing.
- **Do not conflate variance with mispricing.** A 20–40% drawdown is expected even under optimal betting; late-game price volatility is not itself evidence of irrationality.
- **Do not extremize without independence.** Extremizing factor scales with forecaster independence (correlated 1.1–1.2, very independent 1.5+); markets already aggregate, so don't extremize a market price as if it were a naive average.
- **Do not treat correlated markets as independent** in the generalization section: positive correlation means combined exposure/information overlap is larger than it looks (skill's heuristic: correlation >0.5 → 30–50% reduction).

## Gaps — NOT covered by this skill (must be sourced elsewhere or labeled as assumptions)

- **Vig/overround** (YES+NO summing above 100¢): not defined anywhere in the skill. Closest content is "fees ~2–5%" on prediction markets. Do not cite the skill for overround mechanics.
- **Favorite-longshot bias**: not mentioned by name or substance. If the page uses it, it needs an external verified source.
- **Price formation / order-book microstructure**: absent. The skill treats the market price as given.
- **Quantified sentiment premia** (how many cents fear adds late-game): not in the skill; any drawn value is a model assumption and must be labeled as such.
