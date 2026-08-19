import { defineConfig } from "tsup";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  treeshake: true,
  splitting: false,
  external: ["react", "react-dom"],
  async onSuccess() {
    const files = ["dist/index.js", "dist/index.mjs"];
    for (const f of files) {
      const p = path.resolve(f);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        if (!content.startsWith('"use client";') && !content.startsWith("'use client';")) {
          fs.writeFileSync(p, `"use client";\n${content}`);
        }
      }
    }
  },
});
