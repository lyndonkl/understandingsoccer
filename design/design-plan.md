# Design Plan — "The Two Meanings of 26¢"

Subject: a Kalshi price and the soccer match it is priced on. Audience: curious
generalist (Pudding-style reader), no trading background. The page's single
job: make the reader *feel* that one price is not one thing.

## Direction: the stadium ledger

The subject's own world supplies the materials: night matches under floodlights,
the amber dot-matrix of an old stadium scoreboard, and the terminal green-red of
an exchange. The design fuses the two rooms where this story happens — the
stadium and the order book — into one instrument: **a scoreboard that prices
possible worlds.**

One deliberate aesthetic risk, stated: this is a dark page. Dark is adjacent to
an AI-default look (near-black + single acid accent), so the execution must
differ structurally, and does: the ground is a deep pitch-green-charcoal (not
neutral black), the accent system is **two-pole** (cold/hot — the
rational/emotional encoding, not a decorative accent), and the light source is
diegetic — everything luminous on the page is something that would actually
glow at a night match: scoreboard segments, LED units, the price ticker.

## Tokens

### Color (4+2 named values)

| Token | Hex | Role |
|---|---|---|
| `--pitch` | `#101913` | ground: floodlit pitch at 22:00, green-black |
| `--chalk` | `#E8E4D8` | primary text: chalk-line off-white (4.5:1+ on pitch) |
| `--chalk-dim`| `#98A092` | secondary text, axes, captions |
| `--model` | `#7BC8E8` | THE COLD POLE: model-justified price mass, "ice" |
| `--heat` | `#F2A03D` | THE HOT POLE: sentiment mass, scoreboard amber |
| `--alarm` | `#E4572E` | reserved: the red card, and nothing else |

Rational/emotional is hue + **position** (hot mass always the top stratum of
the price column) + label — redundant coding, survives grayscale. `--alarm`
appears exactly once per the cognitive brief (preattentive red reserved for the
single genuine alarm).

Real-vs-modeled grammar: **recorded values = solid fill + source tag;
modeled values = outlined/hollow treatment + "model" chip.** Everywhere.

### Type (3 roles, self-hosted, latin subsets)

| Role | Face | Why |
|---|---|---|
| Display & HUD | **Archivo variable (wdth 62–125, wght 100–900)** | one file gives both expanded poster headlines and condensed scoreboard capitals; grotesque with athletic-signage DNA |
| Body prose | **Newsreader (opsz variable)** | warm editorial serif = the human/event register; optical sizing keeps small annotations crisp |
| Market data | **IBM Plex Mono 400/500/600** | the machine/market register; tabular numerals for prices |

The type system *is* the metaphor: everything the market says is set in mono;
everything the event-world says is set in serif; the page's own voice is the
grotesque. When prose quotes a price, the price appears in mono inside the
serif sentence — the two registers visibly touching.

### Layout

Classic scrolly armature, one signature deviation:

```
┌──────────────────────────────────────────────┐
│ HUD: ⏱ 00:00 │ 0–0 │ SUI 26¢ │ state chip   │  ← sticky scoreboard strip
├──────────────┬───────────────────────────────┤
│ prose card   │                               │
│ (serif,      │   sticky stage:               │
│  ~34ch,      │   WebGL unit canvas           │
│  left rail)  │   + SVG annotation layer      │
│              │                               │
│ next card…   │   (units re-sort here)        │
└──────────────┴───────────────────────────────┘
```

- The **HUD scoreboard strip** externalizes state (clock, score, price, beat
  name) at all times — recognition over recall.
- Prose cards scroll on the left; the stage is sticky and never unmounts.
  Mobile: cards overlay bottom, stage stays behind (canvas full-bleed).
- Annotations are direct labels on the stage, not legends.

### Signature element

**The price as a dot-matrix numeral built from the units themselves.** At the
two 26¢ beats, the 2,600 "yes-world" units tween into the glyph "26¢" — a
stadium scoreboard digit whose pixels are possible worlds. Same glyph twice;
different internal composition (cold vs hot mix). The reader literally watches
the same number get rebuilt out of different stuff. Everything else on the page
stays quiet to let this land.

## Anti-default critique (pass 2)

- *Would I have produced this for any similar brief?* The generic scrolly
  answer is: white page, Inter, purple gradient, dots in a grid that recolor.
  Rejected: dark diegetic ground, two-pole encoding, dot-matrix signature,
  dual-register type. Each choice traces to the subject (scoreboard LEDs,
  order-book terminal, chalk lines).
- *Is the dark ground the banned default?* Banned look = near-black + ONE
  acid-green/vermilion accent. Here: green-cast ground from the pitch, a
  two-pole semantic accent system, amber from scoreboard hardware. Structural
  difference, kept deliberately.
- *Numbered markers?* The beats ARE a sequence (a match clock: kickoff → goal →
  red card → endgame), so the HUD clock is the sequence marker — real content,
  not decoration. No 01/02/03 eyebrows.
- *Motion restraint:* one orchestrated morph per beat (the re-sort), 750ms,
  easeCubicOut, per-unit stagger ≤400ms extra; no ambient particle drift.
  `prefers-reduced-motion` snaps to end states.

## Quality floor

Responsive to 360px; keyboard-scrollable; visible focus; reduced motion
respected; WCAG AA contrast (chalk on pitch = ~11:1, model/heat on pitch ≥ 4:1);
canvas has an aria-label + the prose carries the full argument without the
canvas (screen-reader parity).
