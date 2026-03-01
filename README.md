# Tool-Call Tactics

A browser-based puzzle game that puts you in the role of an AI agent navigating a locked-down facility. Each room runs a different **tool harness** — a set of constraints that limits which actions you can perform — forcing you to think strategically about when to observe, move, and act.

**Play it live:** [toolcalltactics.loukik.dev](https://toolcalltactics.loukik.dev)

## The Game

You play as an AI maintenance agent tasked with retrieving a backup encryption key from a sealed server room. The facility has three areas, each with its own harness:

| Room | Harness | Available Tools |
|------|---------|-----------------|
| Corridor | FIELD-OPS | Observe, Examine, Use, Navigate |
| Control Room | DIAGNOSTICS | Observe, Search, Access, Navigate |
| Server Room | RECOVERY | Observe, Inspect, Retrieve, Navigate |

The challenge: complete the mission in as few moves as possible. The optimal path is **13 moves** for 100% efficiency.

## Features

- 2D top-down game view with animated character movement
- CSS-only pixel art — no sprites, no canvas, no external assets
- Room-specific tool harnesses that constrain available actions
- Smooth character walking animations via `requestAnimationFrame`
- Efficiency scoring based on move count
- Mobile responsive

## Tech Stack

- React 19 + Vite 7
- Pure CSS animations and pixel art (gradients, box-shadows, keyframes)
- Deployed to GitHub Pages via GitHub Actions

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` auto-deploy via GitHub Actions to GitHub Pages.

```bash
npm run build    # Build to dist/
npm run deploy   # Manual deploy via gh-pages
```
