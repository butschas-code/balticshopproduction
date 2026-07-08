"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { CmsRole } from "@/lib/cms/types";
import type { Session } from "@supabase/supabase-js";

type CmsAuthState = {
  loading: boolean;
  session: Session | null;
  role: CmsRole | null;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CmsAuthContext = createContext<CmsAuthState | null>(null);

async function fetchRole(token: string): Promise<CmsRole | null> {
  const res = await fetch("/api/cms/auth/check", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { ok?: boolean; role?: CmsRole | null };
  return data.ok ? (data.role ?? null) : null;
}

export function CmsAuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<CmsRole | null>(null);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const nextSession = data.session;
    setSession(nextSession);

    if (!nextSession?.access_token) {
      setRole(null);
      setLoading(false);
      return;
    }

    const nextRole = await fetchRole(nextSession.access_token);
    setRole(nextRole);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({ loading, session, role, signOut, refresh }),
    [loading, session, role, signOut, refresh],
  );

  return <CmsAuthContext.Provider value={value}>{children}</CmsAuthContext.Provider>;
}

export function useCmsAuth() {
  const ctx = useContext(CmsAuthContext);
  if (!ctx) throw new Error("useCmsAuth must be used within CmsAuthProvider");
  return ctx;
}

export function CmsAuthGate({ children }: { children: React.ReactNode }) {
  const { loading, session, role } = useCmsAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session || !role) {
      router.replace("/admin/login");
    }
  }, [loading, session, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F2A24] text-linen">
        Loading CMS…
      </div>
    );
  }

  if (!session || !role) return null;
  return <>{children}</>;
}
