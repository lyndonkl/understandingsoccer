# Rendering Architecture & Unit Model

Status: core decisions settled; market-dependent numbers pending `research/`.

## The unit model

**Population: 10,000 units. Each unit is one simulated playing-out of the match** —
one "possible world" drawn from a bivariate-Poisson match model (the model is
labeled as such on the page; its parameters are grounded in published literature
per `research/model-parameters.md`).

Why 10,000 and why "possible worlds":

- **Semantic fit.** A price of 26¢ *is* a claim about frequency: "in 26% of the
  ways this event can unfold, YES happens." 10,000 worlds make one cent = 100
  units — fine-grained enough that a 1¢ move is visible mass, coarse enough
  that a single unit is still a discrete, followable object.
- **The two 26¢ states are literally the same population reconditioned.** At
  kickoff the 10,000 worlds are unconstrained (0–0, 90 minutes of variance
  ahead). At the late-game state the *same* worlds are re-evaluated conditional
  on (1–1, red card, ~20 minutes left). Units re-sort; the price is
  reconstituted from the re-sorted population. Object constancy is not a visual
  trick here — it is the argument.
- **Scale forces the right renderer.** 10,000 independently tweening objects is
  beyond comfortable DOM/SVG territory (the d3-visualization skill caps SVG at
  ~1–10K points; per-frame attribute writes on 10K nodes will not hold 60fps
  with concurrent scroll work), which motivates the WebGL layer below.

## Object-constancy discipline

- Every unit has a **permanent integer identity (0…9999)** carried in a static
  vertex attribute. No unit is ever created or destroyed after boot.
- A **state** is a set of per-identity targets: position (x, y), color, size —
  computed on the CPU in JS (layout functions) and uploaded as buffer pairs.
- **Transitions tween in the vertex shader**: attributes `posA`, `posB`,
  `colorA`, `colorB` plus a scroll-driven uniform `t` (with per-unit stagger
  seeded by identity). Between any two states the GPU interpolates; **we never
  clear-and-redraw a new population.**
- Scroll position drives `t` through a scrubbed timeline (beat boundaries →
  state pairs), so scrubbing backwards replays transitions in reverse —
  constancy holds in both directions.

## Rational vs emotional encoding (the spread layer)

Each unit carries a second attribute: **justification** — whether that
hundredth-of-a-cent of price mass is accounted for by the statistical baseline
(model fair value) or sits above it (sentiment: narrative premium, sunk-cost
squeeze). Encoding:

- **Model-justified mass → the cold ink** (rational palette pole).
- **Sentiment mass → the hot ink** (emotional palette pole), always laid out as
  the *top stratum* of the price column, so the spread between fair value and
  traded price reads as a visible hot band with a measurable height.
- At kickoff (liquid, sharp-dominated) the hot band is a sliver; late-game it
  is a thick stratum. The reader sees the same 26¢ column with a different
  internal composition — the central claim, made visible.

Real vs modeled is *also* encoded: verified market numbers are rendered with a
solid "recorded" treatment and dated source tags; model outputs carry a
distinct "modeled" treatment (outline/hatch + explicit label). This is a
data-integrity requirement from CLAUDE.md, enforced in the visual grammar.

## Rendering split (and why)

| Layer | Tech | Why |
|---|---|---|
| 10,000-unit animation | **Raw WebGL 2** (single point-sprite draw call, ~40 lines of shader; no three.js) | One `drawArrays(POINTS)` call, tweening on GPU; 10K units is trivial for WebGL, hostile to SVG. No dependency, no build step. |
| Scales, axes, price line, order-book bars, annotations | **D3 + SVG** overlaid on the canvas | These are dozens of elements, not thousands; D3's scales/axes/joins are the right tool and stay crisp at any DPI. |
| Prose, scroll beats | **HTML + IntersectionObserver / scroll listener** | Native scrollytelling; no scroll-jacking library needed. |

Shared coordinate system: one set of D3 scales maps data space → CSS pixels;
the WebGL layer consumes the same scales (converted to clip space) so SVG
annotations and GPU units land on identical geometry.

**No build step.** ES modules served as static files; D3 vendored at
`docs/vendor/d3.v7.min.js`; shaders inlined as JS template strings. GitHub
Pages serves `docs/` as-is.

## Performance budget

- 60fps target during scroll on a mid-range laptop; the unit layer's per-frame
  cost is one uniform update + one draw call (buffer uploads only at beat
  boundaries, not per frame).
- Fallback: if WebGL 2 is unavailable, WebGL 1 path (same shaders, `#version`
  differences handled); if no WebGL at all, a static-image + prose fallback so
  the argument survives.
- `prefers-reduced-motion`: transitions snap to end states; scroll still
  reveals beats.
