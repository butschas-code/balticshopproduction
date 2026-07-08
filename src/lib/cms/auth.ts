import type { SupabaseClient } from "@supabase/supabase-js";
import type { CmsRole } from "./types";

export async function getCmsRole(client: SupabaseClient): Promise<CmsRole | null> {
  const { data: userData } = await client.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data: profile } = await client
    .from("profiles")
    .select("cms_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.cms_role;
  if (role === "admin" || role === "editor") return role;
  return null;
}

export async function requireCmsStaff(client: SupabaseClient) {
  const role = await getCmsRole(client);
  if (!role) throw new Error("CMS access denied.");
  return role;
}
