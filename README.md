# CURRENT — by zhaocun

## Version 2 — review candidate

A procedural neon night drive with recycled architecture, light trails, three atmospheres, bloom, cruise/warp modes and a distraction-free experience.

Personal frontend design experiment. All sculptures and environments in this version are generated in code. No commercial clients, products or commissions are claimed.

Production (previous approved version): https://zhaocun-current.netlify.app

Review source: branch `codex/immersive-review-v2`. The review URL is recorded in `review-deployment.json` after upload. Production is unchanged pending review.

## Run and edit

```sh
npm ci
npm run dev
npm run build
npm run preview
```

- `src/content.js`: names, text, links and scenes.
- `src/main.js`: procedural 3D geometry, materials, animation and controls.
- `src/style.css`: responsive layout and visual identity.
- `public/credits.html`: attribution and license references.

Deploy the contents of `dist/` to Netlify. `netlify.toml` declares the build command and output folder; it does not connect the Git repository automatically.

## Credits

Three.js and its included rendering utilities — MIT. Fonts — SIL Open Font License 1.1. Source notices are retained in `public/licenses/`. The earlier fluid study remains in Git history; its MIT source notice is retained.

## Accessibility

Controls have keyboard focus states and accessible names. Escape leaves immersive mode. Reduced-motion preference starts the animation paused. A readable fallback is shown if WebGL cannot initialize. Mobile layouts preserve normal scrolling until immersive mode is explicitly entered.
