import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const blockedPatterns = [
  /Ã/g,
  /Â/g,
  /â[€™€œ€�™¥]/g,
  /Letâ/g,
  /BaÃ/g,
];

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".tsx",
  ".ts",
  ".txt",
]);

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "dist",
  "github-pages-dist",
  "netlify-dist",
  "node_modules",
  "outputs",
]);
const ignoredFiles = new Set(["encoding-guard.mjs"]);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await collectFiles(join(directory, entry.name))));
      }
      continue;
    }

    const extension = entry.name.slice(entry.name.lastIndexOf("."));
    if (!ignoredFiles.has(entry.name) && textExtensions.has(extension)) {
      files.push(join(directory, entry.name));
    }
  }

  return files;
}

test("source files do not contain mojibake encoding artifacts", async () => {
  const files = await collectFiles(root);
  const failures = [];

  for (const file of files) {
    const text = await readFile(file, "utf8");
    for (const pattern of blockedPatterns) {
      if (pattern.test(text)) {
        failures.push(file);
        break;
      }
    }
  }

  assert.deepEqual(failures, []);
});
