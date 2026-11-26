# Michael Hans G. Magbojos — Duelist Developer Portfolio

Interactive Yu-Gi-Oh!-inspired developer portfolio built with **React 19, TypeScript, Tailwind CSS v4, and GSAP**, featuring a 60fps 3D deck-draw opening, code-rendered holographic cards with real project logos/screenshots, a 3D shadowbox Ace Card, a 1-click **Recruiter View**, and a non-overlapping `hans@duel-disk ~ $` command-line terminal.

## Local Development

```bash
npm install
npm run dev
```

## Production Build & GitHub Pages Deploy

```bash
npm run build
npm run preview
```

When ready to publish on `https://michaelhans32116.github.io/`:
1. Merge branch `redesign/yugioh-duelist` into `main` and push.
2. In GitHub repo **Settings -> Pages -> Build and deployment**, set **Source** to **GitHub Actions** (uses `.github/workflows/deploy.yml`).
