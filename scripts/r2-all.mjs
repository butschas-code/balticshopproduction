#!/usr/bin/env node
import { spawn } from "node:child_process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: false, env: process.env });
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

async function main() {
  const nodeArgs = ["--env-file=.env.local"];
  console.log("Step 1/3: Create bucket + enable public R2 URL...");
  await run("node", [...nodeArgs, "scripts/setup-r2.mjs"]);
  console.log("Step 2/3: Upload partner images (~1.9 GB, may take 20-40 min)...");
  await run("node", [...nodeArgs, "scripts/upload-partners-to-r2.mjs"]);
  console.log("Step 3/3: Rewrite Supabase asset URLs...");
  await run("node", [...nodeArgs, "scripts/migrate-supabase-asset-urls.mjs"]);
  console.log("R2 migration complete.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
