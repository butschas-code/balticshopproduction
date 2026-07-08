#!/usr/bin/env node
/**
 * One-time CMS bootstrap: creates super admin user and grants cms_role=admin.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/setup-cms-admin.mjs
 *
 * Optional env:
 *   CMS_ADMIN_EMAIL (default: sascha.butscha@gmail.com)
 *   CMS_ADMIN_PASSWORD (required unless user already exists)
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.CMS_ADMIN_EMAIL ?? "sascha.butscha@gmail.com";
const password = process.env.CMS_ADMIN_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (match) return match;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  let user = await findUserByEmail(email);

  if (!user) {
    if (!password) {
      console.error("User not found. Set CMS_ADMIN_PASSWORD to create the account.");
      process.exit(1);
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "CMS Admin" },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Created auth user: ${email}`);
  } else {
    console.log(`Found existing auth user: ${email}`);
    if (password) {
      const { error } = await admin.auth.admin.updateUserById(user.id, { password });
      if (error) throw error;
      console.log("Updated password.");
    }
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email,
      full_name: "CMS Admin",
      cms_role: "admin",
    },
    { onConflict: "id" },
  );

  if (profileError) throw profileError;
  console.log("Granted cms_role=admin on profiles.");
  console.log("CMS ready at /admin/login");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
