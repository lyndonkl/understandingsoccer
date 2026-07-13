# The Two Meanings of 26¢

A scrollytelling explanation of what a price on a prediction market (Kalshi)
actually represents — built with unit visualization and object constancy.

The structural spine is Julian Jaynes's claim that *understanding is metaphor*:
we grasp the unfamiliar by mapping it onto the familiar. A Kalshi price is the
unfamiliar object; the concrete event-state it corresponds to is the familiar
thing that gives it meaning. Two identical 26¢ prices on the same soccer
contract — one at kickoff, one late in the game at 1–1 with a red card — mean
opposite things, and the page makes you *feel* that rather than telling you.

**Live at: https://lyndonkl.github.io/understandingsoccer/**

## Publishing (GitHub Pages)

The site is fully static and lives in **`/docs`**. No build step.

To publish: push to GitHub, then **Settings → Pages → Source: Deploy from a
branch → Branch: `main`, folder: `/docs`**. That's the only toggle needed.

## Repository layout

- `docs/` — the served site (GitHub Pages source directory)
- `research/` — verified facts, sources, and labeled model assumptions
- `design/` — narrative arc, unit-model spec, rendering-architecture notes

## Running locally

Any static server works:

```sh
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000.

## Data integrity

Every quantitative claim on the page is either grounded in a cited source or
explicitly labeled as a model assumption. Real market data and modeled /
illustrative values are visually distinguished on the page itself.
