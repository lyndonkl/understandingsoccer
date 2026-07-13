# CLAUDE.md — Kalshi Price Visualization

Standing context for this project. These rules hold across every turn and every
workflow step. The task itself and the workflow arrive as a separate prompt; this
file is the durable "how we build here."

## What this project is

A scrollytelling web page that explains what a price on a prediction market (Kalshi)
actually represents, using **unit visualization with object constancy**. The
structural spine is Julian Jaynes's claim that *understanding is metaphor*: we grasp
the unfamiliar by mapping it onto the familiar. A Kalshi price is the unfamiliar
object; the concrete real-world event-state it corresponds to is the familiar thing
that gives it meaning. The reader should *feel*, not be told, that one price is not
one thing.

## Repository & publishing

- **This is not yet a git repo.** Initializing it is part of the work. There is full
  git access.
- Early in the build: `git init`, establish a sensible `.gitignore`, make an initial
  commit, and commit in logical increments thereafter (not one giant final commit).
- The deliverable must be **publishable as a GitHub Page**: fully static, no build
  step that cannot run on GitHub Pages / GitHub Actions. Prefer zero-build or a
  trivial static setup. If any bundling is used, it must produce committed static
  assets that Pages can serve directly.
- Set up the Pages-serving structure explicitly (e.g. root or `/docs`, and note the
  branch/source assumption) so the page is one settings-toggle away from live.

## Tech & rendering conventions

- **Performant rendering approach.** Use WebGL or WebAssembly for the unit-animation
  layer wherever object counts make DOM/SVG too slow. D3 is fine for scales, axes,
  order-book charts, and lighter layers. State and justify the split.
- Scroll-driven state transitions, consistent with prior scrolly / tally-style
  animation work.
- Apply the repo's **cognitive-design-architecture** and **D3-visualization** skills
  for visual hierarchy, cognitive-load management, and encoding choices. Read them
  before designing.

## Object-constancy discipline (core technique)

- A fixed population of discrete objects. Decide and justify the count and what each
  object represents (a contract, a simulated outcome, a cent of price, a dollar of
  open interest).
- Objects **persist and tween** between states — kickoff → goal → red-card endgame,
  and between different markets. **Never cut and redraw.** The price is reconstituted
  from re-sorted units at each state.
- Encode the rational-vs-emotional split visibly in the units (color / sort) so the
  spread between statistical fair value and traded price is something you can *see*.

## Aesthetics

- Distinctive, intentional design. Deliberate typography, a cohesive color theme,
  purposeful motion. **Avoid generic "AI-slop" defaults** (Inter/Roboto/Arial,
  purple-on-white gradients, predictable layouts).
- Reveal **one conceptual move per scroll beat**; manage cognitive load deliberately.

## Data integrity (enforced, non-negotiable)

- Ground every quantitative claim in a **verified source** or an **explicitly
  labeled model assumption**. Never speculate about market data or event facts you
  have not opened or searched.
- For any real Kalshi market or real-world event, **verify current facts via web
  search** rather than relying on memory. Show the sources.
- Clearly label **real data vs. modeled/illustrative values** everywhere they appear
  in the page.
- If a figure cannot be verified, mark it a model assumption rather than presenting
  it as fact. If something is infeasible or unverifiable, say so rather than working
  around it with invented values.

## Content backbone (for reference; full spec comes in the task prompt)

Worked example: a soccer contract with two identical ~26¢ prices meaning opposite
things — **kickoff 26¢ = capability** (inferior team out-scoring a superior one over
90 high-variance minutes; cold, model-driven) vs. **late-game 26¢** (1-1, red card,
clock decaying) **= survival** (holding a draw against collapsing time, a man down;
volatile, sentiment-laden). Then generalize the lens to 2–3 other real Kalshi
markets, correlating price movements with researched event timelines.
