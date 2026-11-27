import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const blocks = process.env.BLOCKS;
if (!blocks) throw new Error("set BLOCKS to a jirathip-dev/blocks checkout with web/dist built");
const { webkit } = createRequire(join(blocks, "web/package.json"))("playwright");
const repo = fileURLToPath(new URL("..", import.meta.url));
const BASE = "http://synergy.test/";
const types = { html: "text/html", js: "text/javascript", css: "text/css", json: "application/json" };
const browser = await webkit.launch();
for (const page of ["tokens", "blocks"])
  for (const mode of ["light", "dark"])
    for (const width of [1440, 390]) {
      const p = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: mode, deviceScaleFactor: 1 });
      await p.route("**/*", (r) => {
        const url = r.request().url();
        if (!url.startsWith(BASE)) return r.continue();
        const path = url.slice(BASE.length).split("?")[0];
        const file = path.startsWith("_blocks/") ? join(blocks, "web/dist", path.slice(8)) : join(repo, path);
        try {
          return r.fulfill({ body: readFileSync(file), contentType: types[file.split(".").pop()] ?? "application/octet-stream" });
        } catch {
          return r.fulfill({ status: 404 });
        }
      });
      p.on("pageerror", (e) => console.error(page, mode, width, e.message));
      await p.goto(`${BASE}sheet/${page}.html`);
      await p.waitForSelector("body[data-ready]", { timeout: 20000 });
      await p.screenshot({ path: join(repo, "sheet", `${page}-${mode}-${width}.png`), fullPage: true });
      await p.close();
    }
await browser.close();
