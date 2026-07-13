# Cognitive Design Constraint Brief — Kalshi Unit Visualization

Constraints extracted from the cognitive-design skill (quick-reference, frameworks, data-visualization, cognitive-foundations) for a scroll-driven WebGL unit visualization with thousands of persistent dots.

## Hard constraints

1. **Working memory: 4±1 chunks** (Cowan 2001; not Miller's 7±2). Never ask the reader to hold more than ~4 concurrent concepts, groups, or legend entries at once. Group dot clusters into 3–5 named categories max per scroll beat.
2. **One conceptual move per scroll beat.** Segmenting (Mayer) + progressive disclosure: each beat reveals exactly one new idea; complexity accumulates only as prior beats are absorbed.
3. **Cleveland–McGill encoding hierarchy** (most→least accurate): position on common scale > position non-aligned > length > angle/slope > area > volume > color hue > color saturation. Position/length is 5–10x more accurate than angle/area. Encode the quantity that must be *read precisely* (the price, the count) as position/length of the dot mass against a common baseline; use hue only for category (rational vs emotional units), never for magnitude.
4. **Color rules:** hue for categorical only (limit 5–7 categories; here 2–3); lightness/saturation gradient for any quantitative shading (dark = more); no rainbow scales; perceptually uniform maps (viridis/magma/plasma) if a continuous scale ever appears. Redundant coding required — color + position/shape/label — because 8% of male viewers are colorblind; the rational/emotional split must survive grayscale.
5. **Contrast:** WCAG AA minimum — 4.5:1 body text, 3:1 large text/key graphics. Dot colors against background must clear 3:1 to register as figure vs ground.
6. **Preattentive salience is zero-sum.** Reserve pop-out features (red, motion, size outlier) for 1–3 critical elements per state. If many dots move or glow at once, nothing stands out. Red only for the true "alarm" moment (e.g., red card / threshold violation), never for all negative movement — alert fatigue.
7. **Data integrity (Three-Layer Model, Layer 1):** no cherry-picked windows, no truncated axes without explicit notation; bar/length encodings start at zero. Real vs modeled values labeled at the point of display (this also matches CLAUDE.md's non-negotiable data rule).

## Concrete recommendations

- **Object constancy is the anti-change-blindness tool.** "Never cut and redraw" is exactly the skill's feedback-loop guidance: users learn state changes by watching them happen. Tween dots between states so the reader perceives the *transformation* (units re-sorting into a new price), not two disconnected pictures. Smooth transitions; keep the canvas persistent while scroll copy advances (scrollytelling pattern: chart stays visible, story progresses, user can scroll back).
- **Gestalt for dot clusters:**
  - *Proximity:* dots physically clustered = one group. Separate unrelated groups with whitespace, not borders (closure: implied boundaries suffice, less ink).
  - *Similarity:* identical styling = same meaning everywhere. Once "warm hue = sentiment-driven unit" is established, never reuse that hue for anything else.
  - *Continuity:* align cluster baselines so the eye reads them as one comparable system; a common baseline turns cluster heights into position-on-common-scale (top of encoding hierarchy).
  - *Figure-ground:* the active dot mass must contrast strongly with background; dim inactive/context layers when a beat focuses attention.
- **Progressive disclosure (Shneiderman):** overview first (all units, whole market), zoom/filter as beats focus (kickoff 26¢), details on demand (hover/tooltip for a unit's meaning, exact figures). Never dump granular numbers into the default view.
- **Externalize state — recognition over recall.** Always show where the reader is: match clock, score, current price, and scroll position visible at all times (sticky HUD). Reader should never have to remember "wait, which game state is this?"
- **Visual hierarchy per beat:** one primary readable figure (the price, 36–48px equivalent prominence), secondary context at 18–24px weight, tertiary detail smaller/on-demand. Squint test each beat: hierarchy must survive blur.
- **Annotation strategy (narrative viz):** annotate the main insight (1–2 sentence callouts near the relevant dots), arrows connecting text to specific units, shaded regions for event periods (red-card window), direct labels on clusters instead of a legend. Don't annotate the obvious. Test: is the beat's message graspable in 5 seconds without reading body copy? If not, add guidance.
- **Narrative arc:** Context → Question → Evidence → Insight per beat and across the whole piece. The two-26¢ payoff is the Resolution beat; earlier beats build the question.
- **Dual coding:** pair the dot animation with a short text label of the exact value ("26¢ = 26 of 100 units") — visual + verbal traces reinforce each other. Spatial contiguity: labels adjacent to the units they describe, never split across the viewport.
- **Data-ink:** no gridlines/borders/gradients/3D on the canvas beyond what encodes data. The dots ARE the ink; everything else earns its place or goes.
- **Feedback timing:** scroll-driven transitions should respond within ~100ms of scroll input to feel coupled; a laggy tween breaks the perception–action loop (this is the cognitive argument for WebGL over DOM at high dot counts).
- **Small multiples for the generalization section** (2–3 other Kalshi markets): repeat identical structure, consistent axes/scales across multiples for fair comparison, arrange in logical order, 6–12 max.
- **Pyramid ordering for build/QA:** fix tiers bottom-up. T1 Perceptual efficiency (contrast, hierarchy, legible dots) → T2 Cognitive coherence (consistent terminology, chunked beats, visible state) → T3 Emotional engagement (aesthetic quality, no anxiety — scroll-back always works, no lost state) → T4 Behavioral alignment (the takeaway "one price is not one thing" is the highlighted, unmissable endpoint). Don't polish T3/T4 while T1 fails.

## Pitfalls to avoid

- **Cut-and-redraw between states** — destroys object constancy and invites change blindness; the reader loses the causal thread of why the price changed.
- **Encoding the price as area or angle** of a blob — area is rank 5 of 8 in perceptual accuracy; the reader can't verify "26" from area. Use counted units on a positional scale.
- **Everything moving at once** — motion is the strongest preattentive attractor; simultaneous mass motion in multiple clusters means nothing is prioritized. Stagger or dim.
- **Hue for magnitude** (e.g., redder = higher price) — hue has no perceptual ordering.
- **More than ~4 legend categories or simultaneous concept groups per beat** — exceeds working memory; the split is rational vs emotional (2), maybe +1 neutral. Stop there.
- **Requiring recall across beats** — "remember the kickoff price from three screens ago" fails; re-show the earlier state (side-by-side or ghost overlay) when comparing.
- **Uniform spacing / no whitespace structure** — even spacing everywhere reads as no grouping at all.
- **Red used decoratively** — reserve for the single genuine alarm state.
- **Annotation-free "let the data speak"** — heap of dots without a guided insight fails Layer 3 (interpretation); the reader must be led to the two-prices-same-number contrast, not left to discover it.
- **Misinterpretation left open** — annotate what NOT to conclude (e.g., "26¢ is not a 26% 'confidence score' from Kalshi; it is the traded price" — prevent the causation-style misread).
- **Legend lookups** — direct-label clusters; a legend forces split attention across the viewport.
- **Chartjunk on the canvas** (glows, gradients, decorative particles) — attention spent on decoration is stolen from comprehension.

## Quick QA gates per beat

1. Attention: obvious what to look at first? (squint test passes)
2. Memory: nothing to remember that could be shown? ≤4±1 groups?
3. Clarity: main message graspable in 5 seconds by a newcomer?
