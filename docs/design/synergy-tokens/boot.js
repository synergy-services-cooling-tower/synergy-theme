import * as B from "/_blocks/blocks.js";

const get = (f) => fetch(f).then((r) => r.json());
const [light, dark, style] = await Promise.all(["light", "dark", "style"].map((m) => get(`dist/blocks/synergy-${m}.json`)));
const font = await fetch("dist/blocks/synergy-font.css").then((r) => r.text());
const tag = document.createElement("style");
tag.textContent = B.tiles + B.plain.css({ light, dark }, style) + font + "html{color:var(--fg);background:var(--bg)}";
document.head.append(tag);
document.documentElement.dataset.mode = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const root = document.getElementById("root");
if (root) {
  const screen = await get("kinds.json");
  const ctx = { file: async () => null, screen: "kinds", act: async () => true, tap: () => true, open: new Set(), theme: B.plain, store: { get: () => null, put: () => {} }, drop: () => {}, held: new Map() };
  const sync = B.behave(root, () => screen);
  root.replaceChildren(...[B.render(screen, ctx)].filter(Boolean));
  sync();
}
await document.fonts.ready;
document.body.dataset.ready = "1";
