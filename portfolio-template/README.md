# POW Portfolio Template — HTML/CSS/TS

Pure HTML, CSS, and TypeScript port of the React portfolio template.
No build step required — `app.ts` is precompiled to `app.js`.

## Run
Just open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```

## Files
- `index.html` — markup and section structure
- `styles.css` — design tokens, themes (light/white/dark), animations, solar system, scroll scene
- `app.ts` — typed source. Edit this for changes.
- `app.js` — compiled output the browser loads. Recompile with:
  ```
  npx tsc app.ts --target ES2020 --module ES2020
  ```

## Features
- Inline editing (toggle Edit in the header)
- Skills, Experience, Education, Projects, Socials editors
- Theme toggle: Light / White / Dark
- Accent color picker
- Import / Export JSON, Reset
- 3D solar system, scroll-driven parallax (ring rotation, cube tilt), comet, sparkles
- Tilt-on-hover project cards
- Data persisted in `localStorage` under key `pow-portfolio-v1`

## Embed in mypow.app
The data shape (PortfolioData) matches the React version, so the same JSON exports are interchangeable.
