# CURRENT — by zhaocun

Personal creative development / frontend showcase. An interactive concept, not a commercial client commission.

Live: https://zhaocun-current.netlify.app  
Portfolio: https://zhaocun-portfolio.netlify.app

## Run and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Deploy the contents of `dist/` to Netlify. The included `netlify.toml` also supports Git-connected deployment with `npm run build` and `dist`.

## Edit your content

- `src/content.js`: all main text, names, personal links and content data.
- `src/style.css`: layout, typography, colors and mobile presentation.
- `src/main.js`: interface behavior and rendering.
- `public/`: locally hosted assets and credits.

## Source and attribution

Fluid engine adapted from Pavel Dobryakov’s WebGL Fluid Simulation (MIT). Modified palettes, pointer handling, performance, API, automatic motion; new website interface and content.

Original source: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

All source credits are retained in `public/credits.html` and `public/licenses/`. The code license does not replace third-party photo, font or library licenses.

## Accessibility

Keyboard-accessible controls, visible focus states, mobile layouts and reduced-motion support. WebGL pages provide a fallback when graphics cannot initialize.

Upstream reference commit: `a2d292931f19d9b3b9f564e23e6c32729d2121c3`.
