#!/usr/bin/env node
import { getR2Config } from "./lib/r2-env.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const { accountId, bucket, apiToken } = getR2Config();

async function cf(path, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const json = await res.json();
  if (!json.success) {
    const message = json.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(message);
  }
  return json.result;
}

async function ensureBucket() {
  try {
    await cf(`/accounts/${accountId}/r2/buckets/${bucket}`);
    console.log(`Bucket '${bucket}' already exists.`);
  } catch {
    await cf(`/accounts/${accountId}/r2/buckets`, {
      method: "POST",
      body: JSON.stringify({ name: bucket }),
    });
    console.log(`Created bucket '${bucket}'.`);
  }
}

async function enablePublicDevUrl() {
  const result = await cf(`/accounts/${accountId}/r2/buckets/${bucket}/domains/managed`, {
    method: "PUT",
    body: JSON.stringify({ enabled: true }),
  });
  const publicUrl = `https://${result.domain}`;
  console.log(`Public R2 URL: ${publicUrl}`);
  return publicUrl;
}

async function main() {
  if (!apiToken) throw new Error("Missing CLOUDFLARE_API_TOKEN");
  await ensureBucket();
  const publicUrl = await enablePublicDevUrl();

  const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env.local");
  let text = await fs.readFile(envPath, "utf8").catch(() => "");
  const lines = text.split("\n").filter((line) => !line.startsWith("NEXT_PUBLIC_R2_PUBLIC_URL="));
  lines.push(`NEXT_PUBLIC_R2_PUBLIC_URL=${publicUrl}`);
  await fs.writeFile(envPath, `${lines.join("\n").trim()}\n`);
  console.log(`Saved NEXT_PUBLIC_R2_PUBLIC_URL=${publicUrl} to .env.local`);
  console.log(JSON.stringify({ bucket, publicUrl }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
