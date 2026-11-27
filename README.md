# synergy-theme

The one token source for the Synergy Services look: carbon and paper grounds, a green accent, Montserrat then
Noto Sans Thai, an 8px radius and hairline rules. `tokens/synergy.json` holds every value; `just build`
(`node scripts/build.mjs`) writes everything under `dist/`:

- `dist/blocks/synergy-light.json`, `dist/blocks/synergy-dark.json`: a Blocks scheme pair (all 19 colour tokens).
- `dist/blocks/synergy-style.json`: the Blocks style file (radius 0.6667 × 12px = 8px, glass surface, tint fills).
- `dist/blocks/synergy-font.css`: one line naming the font stack, since Blocks' style file has no font field.
- `dist/tokens.css`: the website's token layer under its own names (raw scale, `--t-*` type, `--s-*` spacing,
  `--radius`, light on `:root`, dark on `.dark`).

No fonts ship here: consumers self-host Montserrat and Noto Sans Thai.

## Pin it

Releases are git tags (`v0.1.0`, …) cut from `main`; the outputs are committed under `dist/`, so a pin needs no build.

From a Blocks app, take the pair and style at a tag and hand them to Blocks:

```sh
curl -fsSLO https://raw.githubusercontent.com/synergy-services-cooling-tower/synergy-theme/v0.1.0/dist/blocks/synergy-{light,dark,style}.json
```

```ts
import { css, tiles } from "@jirathip-dev/blocks";
style.textContent = tiles + css({ light, dark }, synergyStyle) + synergyFont;
```

(or vendor the repo as a git submodule checked out at the tag). Web apps add `synergy-font.css` after Blocks' CSS.

From plain CSS, load `tokens.css` at a tag before the component CSS, and put `.dark` on `<html>` for the dark theme:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/synergy-services-cooling-tower/synergy-theme@v0.1.0/dist/tokens.css">
```

## Tokens

Blocks pair (`dist/blocks/`):

| Token | Light | Dark | Website token |
|---|---|---|---|
| `--bg` | `#eef3ef` | `#0b100f` | `--bg` |
| `--card` | `#ffffff` | `#1d2824` | `--surface` |
| `--edge` | `#cbd9d0` | `#354740` | `--rule` |
| `--line` | `#dde7e1` | `#26332e` | — |
| `--scrim` | `#06251c66` | `#000000a6` | — |
| `--fg` | `#06251c` | `#e4f2eb` | `--fg` |
| `--mute` | `#4a6157` | `#9dbcaf` | `--fg-quiet` (light one step darker for the needs-you tint) |
| `--l` | `#0b6b4f` | `#34d399` | `--accent` |
| `--link` | `#0b6b4f` | `#34d399` | `--accent` |
| `--g` | `#5f7514` | `#b4c458` | — (ok: leaf) |
| `--a` | `#8c5f0e` | `#e8a65e` | — (warn: amber) |
| `--r` | `#b4442f` | `#f27c84` | — (bad, needs-you: rose) |
| `--p` | `#6e5b9a` | `#b8a3e6` | — (purple) |
| `--c` | `#1f6f8b` | `#6cc4e0` | — (teal-blue) |
| `--fk-l` | `#095a43` | `#6ee7b7` | `--accent-ink` (light) |
| `--fk-p` | `#5c4c84` | `#c9b8f0` | — |
| `--fk-c` | `#195d75` | `#8fd3ea` | — |
| `--fk-g` | `#4f6210` | `#ccd37a` | — |
| `--fk-a` | `#77510c` | `#ebc47e` | — |

Website semantic tokens (`dist/tokens.css`):

| Token | Light (`:root`) | Dark (`.dark`) |
|---|---|---|
| `--bg` | `#eef3ef` | `#0b100f` |
| `--surface` | `#ffffff` | `#1d2824` |
| `--surface-2` | `#e3ebe6` | `#2b3934` |
| `--fg` | `#06251c` | `#e4f2eb` |
| `--fg-quiet` | `#52695f` | `#9dbcaf` |
| `--rule` | `#cbd9d0` | `#354740` |
| `--accent` | `#0b6b4f` | `#34d399` |
| `--accent-hi` | `#13855c` | `#6ee7b7` |
| `--on-accent` | `#ffffff` | `#0b100f` |
| `--accent-ink` | `#095a43` | `#34d399` |

Raw scale: carbon-950 `#0b100f`, carbon-900 `#1d2824`, carbon-800 `#2b3934`, green-900 `#064e3b`, green-400
`#34d399`, green-300 `#6ee7b7`, haze `#9dbcaf`, paper `#eef3ef`, ink `#06251c`. Type `--t-xs`…`--t-2xl`:
0.6875 / 0.8125 / 1 / 1.25 / 1.75 / 2.75rem. Spacing `--s-1`…`--s-6`: 4 / 8 / 16 / 32 / 64 / 112px. `--radius` 8px.

The token sheet, `sheet/tokens.html`, shows every token as Blocks paints it (`sheet/tokens-{light,dark}-{1440,390}.png`),
and `sheet/blocks.html` draws Blocks' core kinds in the pair (`sheet/blocks-*.png`).

## Checks

- `just check`: a fresh build matches the committed `dist/` and sheet.
- `just test`: `tokens.css` has the same variable names and values as the website's token block (`test/website-tokens.css`).
- `just gate <blocks checkout>`: both schemes pass Blocks' `gate` under tint, outline and solid fills.
  CI runs it against the Blocks rev pinned in `.github/workflows/ci.yml`.
- `just render <blocks checkout with web deps installed>`: rewrites the sheet PNGs with WebKit.
