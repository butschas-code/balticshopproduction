#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getR2Config, partnerPathToKey } from "./lib/r2-env.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(scriptDir, "../public/partners");
const CONCURRENCY = 6;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function runWranglerPut(bucket, key, filePath, apiToken) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["wrangler", "r2", "object", "put", `${bucket}/${key}`, "--file", filePath, "--remote"],
      {
        env: { ...process.env, CLOUDFLARE_API_TOKEN: apiToken },
        stdio: ["ignore", "ignore", "pipe"],
      },
    );
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(stderr.trim() || `wrangler exit ${code}`));
    });
  });
}

async function main() {
  const { bucket, apiToken } = getR2Config();
  if (!apiToken) throw new Error("Missing CLOUDFLARE_API_TOKEN");

  const files = await walk(ROOT);
  console.log(`Uploading ${files.length} files to R2 bucket '${bucket}' via wrangler...`);

  let uploaded = 0;
  let failed = 0;
  let index = 0;

  async function worker(workerId) {
    while (index < files.length) {
      const filePath = files[index++];
      const key = partnerPathToKey(path.relative(path.resolve(scriptDir, "../public"), filePath));
      try {
        await runWranglerPut(bucket, key, filePath, apiToken);
        uploaded += 1;
      } catch (error) {
        failed += 1;
        console.error(`Worker ${workerId} failed ${key}: ${error.message}`);
      }
      const done = uploaded + failed;
      if (done % 50 === 0 || done === files.length) {
        console.log(`Progress: ${done}/${files.length} (${uploaded} ok, ${failed} failed)`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));

  if (failed > 0) {
    throw new Error(`Upload finished with ${failed} failures`);
  }
  console.log(`Done. Uploaded ${uploaded} files.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
