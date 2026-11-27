import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const blocks = process.env.BLOCKS;
if (!blocks) throw new Error("set BLOCKS to a jirathip-dev/blocks checkout at the pinned rev");
const { gate } = await import(pathToFileURL(join(blocks, "web/src/core/gate.ts")));
let misses = 0;
for (const mode of ["light", "dark"]) {
  const scheme = JSON.parse(readFileSync(new URL(`../dist/blocks/synergy-${mode}.json`, import.meta.url)));
  for (const fills of ["tint", "outline", "solid"]) {
    const miss = gate(scheme, fills);
    misses += miss.length;
    console.log(`${mode} ${fills}: ${miss.length ? "FAIL" : "pass"}`);
    for (const m of miss) console.log(`  ${m.what}: ${m.got.toFixed(2)} < ${m.min}`);
  }
}
process.exit(misses ? 1 : 0);
