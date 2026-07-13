# Narrative Arc — beat map

Spine (Jaynes): understanding is metaphor — the unfamiliar (a traded price) is
grasped by mapping it onto the familiar. Each act supplies one familiar thing:
**counting** (Act I), **the match itself** (Act II), **translation** (Act III).
One conceptual move per beat. The stage never unmounts; 10,000 units persist
from the first pixel to the last.

Real data = solid "recorded" treatment + source tag. Model outputs = hollow
"modeled" treatment + model chip. (Grammar defined in design-plan.md.)

| # | Beat | Conceptual move (ONE) | Units: from → to | Real vs modeled |
|---|------|----------------------|------------------|-----------------|
| 0 | **Hero** | The claim: same contract, 26¢ at 9:00 PM and 26¢ three hours later — not the same price | scattered field → title constellation | dates/prices real (API) |
| 1 | **A price is a count** | 26¢ = 26% implied: 2,600 of 10,000 equally-likely endings are YES | constellation → 100×100 world-grid, YES mass lights left of the x=26 boundary | price real; "worlds" framing is the page's metaphor, said aloud |
| 2 | **Nobody set this number** | It's a meeting point of an order book — humans + algorithms agreeing to disagree; not an oracle's confidence score | grid holds; a bid/ask ladder (D3) slides in; units shade by "who's quoting" | mechanics real (research/kalshi-mechanics); ladder is illustrative-of-mechanism, labeled |
| 3 | **Kickoff 26¢ = capability** | At 0–0 with 90+ min ahead, 26¢ prices *out-scoring a superior team over a long, high-variance horizon* | world-grid → scoreline grid (final-score cells, cell mass = model probability); SUI-win cells total ≈ the price | kickoff 25–26¢ real; scoreline distribution **modeled** (double-Poisson, params cited) |
| 4 | **The price lives the match** | Prices are conditional: each event re-conditions every ending (10' 1–0 → 12¢; 67' 1–1 → 32¢ spike, 1.28M-contract minute; 72' red card → 16¢) | scoreline grid mass flows as the scroll scrubs the real minute-by-minute price line | all prices/volumes real (1-min candles); minute↔timestamp mapping labeled inference |
| 5 | **Late-game 26¢ = survival** | Same number rebuilt: ten men, 1–1, hold ~30 more minutes → penalties ≈ coin flip. Capability has left the price; survival replaced it | units re-form the dot-matrix **26¢** glyph — second time, different internal mix; side ghost of the kickoff glyph for direct comparison | 26¢ at 03:05–03:06 UTC real; the decomposition of *what must happen* modeled (conditional model, labeled) |
| 6 | **The spread is sentiment** | Cold model baseline vs traded price; the gap band = narrative premium + sunk-cost squeeze — *or* information the model lacks. Gaps inside the ~2–5¢ fee band mean nothing | price column splits: cold stratum (model-justified) below, hot stratum (the gap) on top, band height readable on a common scale | market price real; fair-value **modeled & labeled**; gap interpretation explicitly framed as interpretation |
| 7 | **Resolution without hindsight** | 112' Álvarez → 2¢; 3–1 → 0¢. A 26% world simply didn't arrive — 26% events fail 74% of the time; the price wasn't "wrong" | glyph collapses along the real price line to zero; NO mass absorbs the population | all real; annotation guards against outcome bias |
| 8 | **The lens, elsewhere #1** | Same-number-different-state in a non-sport market (from research: Fed / shutdown / backup — best-verified wins) | population splits; a small-multiple price column reconstitutes for market #2 | per research file; real prices tagged, any baseline modeled |
| 9 | **The lens, elsewhere #2** | Second generalization; the reader now does the translation almost unprompted | second small multiple | same |
| 10 | **Coda — understanding is metaphor** | To read a price is to translate it back into the event-state it compresses. One price is never one thing | the two 26¢ glyphs re-form side by side (cold-heavy vs hot-mixed), then release to the field | restates only established facts |

Aside (annotation, not a beat): at 02:55 UTC Argentina's *regulation-time*
market also touched 26¢ — the same digits meaning a third thing (a favorite
racing the clock). One label on the beat-4 price line.

## HUD (sticky scoreboard) per beat

`⏱ clock │ score │ ARG–SUI │ SUI advance ¢ │ beat title`. Beats 0–2: pre-match
(clock 00:00). Beats 3–7: real match clock/score/price as scrubbed. Beats 8–9:
HUD swaps to the generalization market's ticker/date. Beat 10: both 26¢ stamps.

## Cognitive compliance

- ≤4 concept groups per beat (YES-cold / YES-hot / NO / context-dim — never more).
- Anything to be read precisely (price, count, gap height) = position/length on
  a common baseline; hue = category only; redundant via position + label.
- `--alarm` red appears exactly once: the 72' red card.
- Comparison beats re-show ghosts; never ask the reader to recall a prior state.
- Each beat's insight is annotated (callout + arrow), not left to discovery.
- Misread guards: beat 1 "26¢ is a traded price, not Kalshi's confidence";
  beat 7 anti-hindsight callout; beat 6 fee-band note.
