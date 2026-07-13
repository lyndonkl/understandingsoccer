# D3 Skill Constraint Brief — Scroll-Driven Unit Visualization

Source: `~/.claude/skills/d3-visualization/` (SKILL.md + resources: transitions-interactions, selections-datajoins, common-patterns, workflows). Scope: what bears on a WebGL-canvas unit layer (thousands of persistent dots, object constancy) with D3 handling scales/axes/light layers.

## Hard constraints

1. **DOM/SVG performance ceiling.** SKILL.md (line 26) verbatim: "Prefer simpler tools when: ... you need 3D (Three.js, WebGL), or datasets exceed 10K points without aggregation." D3's own guidance disqualifies DOM/SVG for the unit layer at our object counts unless aggregated — this validates the CLAUDE.md WebGL split. Dots go to WebGL; D3 stays on scales, axes, order-book charts, annotations.
2. **Key functions are mandatory for object constancy.** `.data(data, d => d.id)` — without a key function D3 joins by index, so any reorder/filter rebinds elements to the wrong data and transitions animate the wrong objects. This applies to every D3-rendered layer whose data can reorder (annotations, order-book rows). The same identity discipline must be replicated manually in the WebGL layer: each dot carries a stable id; state transitions interpolate per-id attribute buffers, never re-generate the population.
3. **Never transition on initial render.** Transitions show *change*; there must be a previous state. First paint sets attributes directly; only subsequent scroll-beat updates animate.
4. **Re-joins return new selections.** `circles.data(newData).join(...)` returns a NEW selection; a stale variable still points at the old one. Reassign inside the update function, or re-select each time.

## Concrete recommendations (with numbers)

- **Durations:** 500–750ms for data-update transitions (skill's canonical examples use 750ms); 200ms for rapid/streaming updates ("200ms feels responsive") and hover effects. Scroll-beat morphs sit at the 750ms end; live-price-style ticks at 200ms.
- **Staggering:** `.delay((d, i) => i * 50)` — 50ms per element. For thousands of dots, compute the equivalent per-dot delay in the WebGL shader/tween (index- or position-based offset), not per-element DOM delays.
- **Easing:** `d3.easeCubicOut` (fast start, slow finish) is the skill's default for update transitions. Use the same curve in the WebGL tween so canvas dots and D3 axes feel like one system. Avoid bounce/elastic for a data-integrity piece.
- **Interrupt handling via named transitions:** `selection.transition('name')` — a new transition with the same name cancels the in-flight one. Essential for scroll: rapid scrubbing across beats must interrupt, not queue. Name every scroll-driven transition (e.g. `.transition('beat')`); apply the same interrupt semantics in the WebGL tweener (new target state cancels and retargets from current interpolated position, never from the stale start state).
- **Encapsulate one `render(state)` / `update(data)` function** per layer: update scale domains FIRST, then transition axes, then transition marks — all with the same duration so axis and marks move together. Scroll handler calls `render(beatState)`; nothing renders outside it.
- **Axis reuse:** create axis `<g>` once with a class (`.x-axis`, `.y-axis`); on update do `svg.select('.y-axis').transition().duration(750).call(d3.axisLeft(yScale))`. Never append a new axis group per update. Same scale objects are shared by the WebGL layer (D3 scales are plain functions — call them in JS to fill position buffers; one source of truth for pixel mapping).
- **Enter/update/exit discipline** for the D3 layers: use the three-function `.join(enter, update, exit)` form only when enter/exit need distinct animations (fade/grow in, shrink/remove out, `exit.transition(...).remove()`); use plain `.join('circle')` for simple cases. For the unit layer specifically: the population is fixed by design, so there should be NO enter/exit after first render — everything is update. If a beat needs "new" units, that's a design smell; re-sort/re-color existing ones instead.
- **Real-time / streaming pattern** (for live-price flourishes): sliding window with fixed max points, `data.shift()` past the cap, 200ms transitions.
- **Chained transitions** (`.transition().transition()`) sequence phases (move, then recolor) — useful for two-phase beat morphs (re-sort spatially, then flip rational/emotional color), but scroll-interruptibility must still hold across the chain.
- **Linked views:** coordinate highlighting across charts through shared ids and a single `highlight(id)` handler that updates every view — pattern for connecting the dot layer to the order-book/timeline charts.

## Pitfalls to avoid

- **Index-based join on dynamic data** — the skill's most repeated warning. Elements silently bind to wrong data on reorder; transitions look "wrong" without erroring.
- **Transitioning from nothing on first render** (dots flying in from attr-less default positions).
- **Unnamed scroll transitions queueing instead of interrupting** — fast scrolling produces a backlog of stale animations landing out of order.
- **Accessor without a return value:** `.attr('r', d => { console.log(d); })` sets `undefined`. Explicit return in block-bodied accessors.
- **Zoom/drag on individual elements instead of a container group** — if any pan/zoom is added, transform one `<g>`, attach the behavior to the `svg`.
- **Appending axes/groups inside the update function** — duplicates accumulate per scroll beat. Create structure once, update via `select` + `call`.
- **Selecting elements before they exist** — build selections from the `.join()` return, not a prior `selectAll`.
- **`.datum()` vs `.data()` confusion:** single path (a line) takes `.datum(data)`; multiple elements take `.data(data)`.
- **`.sort()` on selections reorders the DOM** (changes paint order) — irrelevant to WebGL dots but relevant to any SVG overlay layering.
- **Attr vs style:** SVG geometry/paint via `.attr()` (`x`, `r`, `fill`); CSS via `.style()` (`opacity`, `font-size`). Mixing them causes specificity surprises.

## Split summary (justified by skill)

WebGL owns: dot positions, per-dot color (rational/emotional encoding), tweening between beat states — because the skill caps un-aggregated D3 rendering at 10K points and our counts approach/exceed that with per-frame animation. D3 owns: scales (shared with WebGL as pure functions), axes, order-book/price-line charts, annotations, brush/zoom if needed — all well under the threshold and benefiting from `.join()` lifecycle management.
