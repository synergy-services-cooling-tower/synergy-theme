## Summary
Decision: one file, `synergy.json`, holds every value. It writes a Blocks light/dark pair, a style file, one font line and the website's `tokens.css`. The website's grounds, text and accent map onto Blocks' tokens. The five state colours are new: leaf, amber, rose, purple and teal-blue. Both schemes pass Blocks' gate in every fill mode.
Screens: the token sheet (every token, light and dark) and Blocks' core kinds drawn by Blocks' own renderer in the Synergy pair; each at 1440 and 390, light and dark.
Open questions: (1) Blocks' style file can't name a font, so the stack ships as a one-line `synergy-font.css` for web apps and SwiftUI apps keep the system font. OK for v0.1, or ask Blocks for a font field first? (2) Light `--mute` is `#4a6157`, one step darker than the website's `fg-quiet` `#52695f`, which misses the gate on the needs-you tint by a hair. OK?

## Images → decisions

| Image | Shows |
|---|---|
| `tokens-light-1440.png`, `tokens-dark-1440.png`, `tokens-light-390.png`, `tokens-dark-390.png` | The token sheet (the issue's AC page): the 19 Blocks colours, with the website token each comes from; a needs-you strip, states, a link and buttons painted with them; the style values (radius 0.6667 × Blocks' 12px = 8px; glass surface with 1px hairlines; tint fills; filled buttons); then the website's `tokens.css`: raw scale, light on `:root`, dark on `.dark` (light accent `#0b6b4f`, not `#34d399`), the type scale with Thai text, spacing and radius. |
| `blocks-light-1440.png`, `blocks-dark-1440.png`, `blocks-light-390.png`, `blocks-dark-390.png` | Blocks' `fixtures/look/kinds.json` drawn by Blocks' real `blocks.js`/`blocks.css`, wearing the pair through Blocks' own `css(pair, style)` plus the font line: stats, rows with state chips, cards, a needs-you card, chips and a form. |

## The mapping

- Blocks ← website: `--bg` ← bg, `--card` ← surface, `--edge` ← rule, `--fg` ← fg, `--mute` ← fg-quiet (light darkened, see above), `--l` and `--link` ← accent, `--fk-l` ← accent-ink.
- Chosen here: `--line` (a step lighter than `--edge`), `--scrim` (ink at 40% in light, black at 65% in dark), and `--g --a --r --p --c` with their `--fk-*` text pairs. The ok-green is pushed toward yellow (leaf/lime): the gate wants it ΔE2000 ≥ 20 from the green accent. Tightest checks: light `--l`↔`--g` ΔE 20.56; light `--bg` on `--g` 4.63:1.
- `tokens.css` writes the website's own names (from the issue). `--fs-1..6`, `--space-1..6` and `--font` are placeholder names: impl takes the real ones from the committed copy of the website's token block.

## Files

- `synergy.json`: the draft source file (impl moves it to `tokens/synergy.json`).
- `build.mjs` → `dist/blocks/synergy-{light,dark,style}.json`, `dist/blocks/synergy-font.css`, `dist/tokens.css`, `tokens.html` (filled from `tokens.tpl.html`). The sheet's layout is in `sheet.css`. `boot.js` loads the pair into Blocks; `kinds.json` is copied from Blocks.
- `render.mjs`: `node build.mjs && BLOCKS=<blocks checkout with web/dist built> node render.mjs` writes the 8 PNGs. It uses WebKit (the engine Blocks' own screenshots use) and full-page captures, and loads Montserrat and Noto Sans Thai from Google Fonts for the preview only. The repo ships no fonts. Rendered against Blocks `127042f`.
- Gate: checked with Blocks' own `web/src/core/gate.ts` at `127042f`: light and dark pass with tint, outline and solid fills. Blocks has no gate CLI, so impl's CI check needs a small runner against a pinned Blocks (the Rust `theme::gate`, or this TS gate).
