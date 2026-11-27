import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const here = (f) => new URL(f, import.meta.url);
const src = JSON.parse(readFileSync(here("synergy.json")));
mkdirSync(here("dist/blocks"), { recursive: true });

const stack = src.type.font.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
const json = (v) => JSON.stringify(v, null, 2) + "\n";
const label = { light: "Synergy light", dark: "Synergy dark" };
for (const m of ["light", "dark"])
  writeFileSync(here(`dist/blocks/synergy-${m}.json`), json({ label: label[m], "color-scheme": m, tokens: src.blocks[m] }));
const style = { format: 2, type: "default", space: 1, radius: Math.round((parseFloat(src.radius) / 12) * 1e4) / 1e4, motion: 1, easing: "standard", surface: "glass", fills: "tint", buttons: "filled", marks: "symbols", sections: "title", labels: {} };
writeFileSync(here("dist/blocks/synergy-style.json"), json(style));
writeFileSync(here("dist/blocks/synergy-font.css"), `:root{font-family:${stack}}\n`);

const decl = (o, pre = "") => Object.entries(o).map(([k, v]) => `  --${pre}${k}: ${v};`).join("\n");
const steps = (a, pre) => Object.fromEntries(a.map((v, i) => [`${pre}${i + 1}`, v]));
writeFileSync(
  here("dist/tokens.css"),
  `:root {\n${decl(src.raw)}\n${decl(steps(src.type.scale, "fs-"))}\n${decl(steps(src.space, "space-"))}\n  --radius: ${src.radius};\n  --font: ${stack};\n${decl(src.site.light)}\n}\n.dark {\n${decl(src.site.dark)}\n}\n`,
);

const role = {
  "--bg": ["page", "bg"], "--card": ["card, sheet", "surface"], "--edge": ["borders, hairlines", "rule"], "--line": ["dividers, tracks", "—"],
  "--scrim": ["behind a sheet", "—"], "--fg": ["text", "fg"], "--mute": ["secondary text", "fg-quiet*"], "--l": ["accent: primary fill, focus", "accent"],
  "--link": ["links", "accent"], "--g": ["ok state: leaf", "—"], "--a": ["warn state: amber", "—"], "--r": ["bad state, needs-you: rose", "—"],
  "--p": ["purple tone", "—"], "--c": ["teal-blue tone", "—"], "--fk-l": ["accent tone text", "accent-ink"], "--fk-p": ["purple tone text", "—"],
  "--fk-c": ["teal-blue tone text", "—"], "--fk-g": ["ok tone text", "—"], "--fk-a": ["warn tone text", "—"],
};
const sw = (v) => `<span class="sw" style="background:${v}"></span><code>${v}</code>`;
const rows = Object.keys(src.blocks.light).map((k) => `<tr><td><code>${k}</code></td><td class="m">${role[k][0]}</td><td class="m"><code>${role[k][1]}</code></td><td>${sw(src.blocks.light[k])}</td><td>${sw(src.blocks.dark[k])}</td></tr>`).join("");
const raw = Object.entries(src.raw).map(([k, v]) => `<div class="chip"><span class="big" style="background:${v}"></span><code>--${k}</code><code class="m">${v}</code></div>`).join("");
const type = src.type.scale.map((v, i) => `<tr><td><code>--fs-${i + 1}</code></td><td><code>${v}</code></td><td style="font-size:${v}">${i === 5 ? "Synergy" : i >= 3 ? "Cooling towers, kept running" : "Cooling towers, kept running · หอผึ่งเย็น"}</td></tr>`).join("");
const space = src.space.map((v, i) => `<tr><td><code>--space-${i + 1}</code></td><td><code>${v}</code></td><td><span class="bar" style="width:${v}"></span></td></tr>`).join("");
const site = (m) => Object.entries(src.site[m]).map(([k, v]) => `<tr><td><code>--${k}</code></td><td>${sw(v)}</td></tr>`).join("");
const sheet = readFileSync(here("tokens.tpl.html"), "utf8")
  .replace("{{rows}}", rows).replace("{{raw}}", raw).replace("{{type}}", type).replace("{{space}}", space)
  .replaceAll("{{radius}}", src.radius).replace("{{font}}", stack).replace("{{siteLight}}", site("light")).replace("{{siteDark}}", site("dark"))
  .replace("{{style}}", Object.entries(style).filter(([k]) => k !== "labels").map(([k, v]) => `<tr><td><code>${k}</code></td><td><code>${v}</code></td></tr>`).join(""));
writeFileSync(here("tokens.html"), sheet);
