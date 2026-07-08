"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function CmsLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setError("Signed in but no session token was returned.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/cms/auth/check", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      await supabase.auth.signOut();
      setError("This account does not have CMS access.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0F2A24] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-[#F6F3EE] rounded-lg p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C89A4B]">Baltic Artisan</p>
        <h1 className="font-serif text-3xl text-[#0F2A24] mt-2">CMS Login</h1>
        <p className="text-sm text-[#8A857A] mt-2">Manage stories and Instagram pipeline.</p>

        <label className="block mt-8 text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-[#D9D6CF] px-3 py-2 bg-white"
        />

        <label className="block mt-4 text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-[#D9D6CF] px-3 py-2 bg-white"
        />

        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-[#0F2A24] text-[#F6F3EE] py-2.5 text-sm font-medium hover:bg-[#163a31] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
