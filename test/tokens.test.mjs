import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const blocks = (selector, css) => css.match(new RegExp(`(?:^|\\n)${selector.replace(".", "\\.")} \\{([^}]*)\\}`))[1];
const vars = (body) => Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const resolved = (css) => {
  const root = vars(blocks(":root", css));
  const dark = { ...root, ...vars(blocks(".dark", css)) };
  const deref = (all, v) => (v.startsWith("var(--") ? deref(all, all[v.slice(6, -1)]) : v);
  const flat = (own, all) => Object.fromEntries(Object.entries(own).map(([k, v]) => [k, deref(all, v)]));
  return { root: flat(root, root), dark: flat(vars(blocks(".dark", css)), dark) };
};
const site = resolved(read("test/website-tokens.css"));
const ours = resolved(read("dist/tokens.css"));

test("tokens.css defines the website's variable names on :root and .dark", () => {
  assert.deepEqual(Object.keys(ours.root).sort(), Object.keys(site.root).sort());
  assert.deepEqual(Object.keys(ours.dark).sort(), Object.keys(site.dark).sort());
});

test("tokens.css values match the website's token block", () => {
  assert.deepEqual(ours.root, site.root);
  assert.deepEqual(ours.dark, site.dark);
});

test("light mode uses the darkened accent", () => {
  assert.equal(ours.root.accent, "#0b6b4f");
  assert.equal(JSON.parse(read("dist/blocks/synergy-light.json")).tokens["--l"], "#0b6b4f");
});
