import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = (f) => new URL(`../${f}`, import.meta.url);
const src = JSON.parse(readFileSync(root("tokens/synergy.json")));
mkdirSync(root("dist/blocks"), { recursive: true });

const stack = src.type.font.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
const json = (v) => JSON.stringify(v, null, 2) + "\n";
for (const m of ["light", "dark"])
  writeFileSync(root(`dist/blocks/synergy-${m}.json`), json({ label: `${src.name} ${m}`, "color-scheme": m, tokens: src.blocks[m] }));
const style = { format: 2, type: "default", space: 1, radius: Math.round((parseFloat(src.radius) / 12) * 1e4) / 1e4, motion: 1, easing: "standard", surface: "glass", fills: "tint", buttons: "filled", marks: "symbols", sections: "title", labels: {} };
writeFileSync(root("dist/blocks/synergy-style.json"), json(style));
writeFileSync(root("dist/blocks/synergy-font.css"), `:root{font-family:${stack}}\n`);

const rootVars = { ...src.raw, ...src.type.scale, ...src.space, radius: src.radius, ...src.site.fixed, ...src.site.light };
const decl = (o) => Object.entries(o).map(([k, v]) => `  --${k}: ${v};`).join("\n");
writeFileSync(root("dist/tokens.css"), `:root {\n${decl(rootVars)}\n}\n.dark {\n${decl(src.site.dark)}\n}\n`);

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
const scale = Object.entries(src.type.scale);
const type = scale.map(([k, v], i) => `<tr><td><code>--${k}</code></td><td><code>${v}</code></td><td style="font-size:${v}">${i === scale.length - 1 ? "Synergy" : i >= 3 ? "Cooling towers, kept running" : "Cooling towers, kept running · หอผึ่งเย็น"}</td></tr>`).join("");
const space = Object.entries(src.space).map(([k, v]) => `<tr><td><code>--${k}</code></td><td><code>${v}</code></td><td><span class="bar" style="width:${v}"></span></td></tr>`).join("");
const resolve = (v, vars) => v.replace(/^var\(--([\w-]+)\)$/, (_, k) => vars[k] ?? v);
const site = (o, vars) => Object.entries(o).map(([k, v]) => `<tr><td><code>--${k}</code></td><td>${/^#/.test(resolve(v, vars)) ? sw(resolve(v, vars)) : `<code>${v}</code>`}</td></tr>`).join("");
const sheet = readFileSync(root("sheet/tokens.tpl.html"), "utf8")
  .replace("{{rows}}", rows).replace("{{raw}}", raw).replace("{{type}}", type).replace("{{space}}", space)
  .replaceAll("{{radius}}", src.radius).replace("{{font}}", stack)
  .replace("{{siteFixed}}", site(src.site.fixed, src.raw)).replace("{{siteLight}}", site(src.site.light, src.site.light)).replace("{{siteDark}}", site(src.site.dark, src.site.dark))
  .replace("{{style}}", Object.entries(style).filter(([k]) => k !== "labels").map(([k, v]) => `<tr><td><code>${k}</code></td><td><code>${v}</code></td></tr>`).join(""));
writeFileSync(root("sheet/tokens.html"), sheet);
