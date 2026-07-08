"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCmsAuth } from "./CmsAuthProvider";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/social", label: "Instagram" },
  { href: "/admin/pipeline", label: "Pipeline" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut, role } = useCmsAuth();

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#0F2A24]">
      <div className="border-b border-[#D9D6CF] bg-[#0F2A24] text-[#F6F3EE]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C89A4B]">Baltic Artisan CMS</p>
            <h1 className="font-serif text-xl">Stories & Instagram</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#D9D6CF] capitalize">{role}</span>
            <Link href="/en/journal" className="hover:text-[#C89A4B] transition-colors">
              View site
            </Link>
            <button type="button" onClick={() => void signOut()} className="hover:text-[#C89A4B] transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-[#0F2A24] text-[#F6F3EE]" : "hover:bg-[#D9D6CF]/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
