import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getCmsRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ ok: false, role: null }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "Supabase not configured." }, { status: 500 });
  }

  const client = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const role = await getCmsRole(client);
  if (!role) {
    return NextResponse.json({ ok: false, role: null }, { status: 403 });
  }

  return NextResponse.json({ ok: true, role });
}
