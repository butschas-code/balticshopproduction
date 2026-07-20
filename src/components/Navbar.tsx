"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSelector } from "./LanguageSelector";
import { supabase } from "@/lib/supabase/client";

const navKeys = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/artisans", key: "artisans" },
  { href: "/stories", key: "stories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isHome = pathname === "/";
  const useDarkNav = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
    };

    void loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        useDarkNav ? "nav-scrolled" : ""
      }`}
    >
      <nav
        className={`pointer-events-auto max-w-[1500px] mx-4 md:mx-8 lg:mx-auto mt-4 md:mt-6 px-4 md:px-5 py-3 flex items-center justify-between rounded-full border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          useDarkNav
            ? "border-forest/10 bg-linen/78 text-forest shadow-[0_24px_80px_rgba(15,42,36,0.10)] backdrop-blur-xl"
            : "border-linen/18 bg-forest/8 text-linen backdrop-blur-sm"
        }`}
      >
        <Link
          href="/"
          className="font-serif text-lg md:text-xl tracking-tight transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-linen hover:text-amber nav-link px-2"
        >
          {t("brand")}
        </Link>

        <ul className="hidden lg:flex items-center gap-1 rounded-full bg-white/10 p-1">
          {navKeys.map(({ href, key }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-full px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-linen/95 hover:bg-amber/12 hover:text-amber nav-link"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSelector />
          <Link
            href={isAuthenticated ? "/account/orders" : "/login"}
            className="hidden md:inline rounded-full px-3 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-linen/95 hover:text-amber transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] nav-link"
          >
            {isAuthenticated ? t("account") : t("login")}
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline rounded-full px-3 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-linen/95 hover:text-amber transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] nav-link"
            >
              {t("logout")}
            </button>
          )}
          <Link
            href="/cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-linen hover:text-amber transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] nav-link"
            aria-label={t("cart")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </Link>
          <button
            type="button"
            className="relative lg:hidden h-10 w-10 rounded-full bg-white/10 text-linen nav-link"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("menu")}
          >
            <span
              className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileOpen ? "rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileOpen ? "-rotate-45" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto fixed inset-x-4 top-24 lg:hidden rounded-[1.7rem] border border-forest/10 bg-linen/92 shadow-[0_30px_120px_rgba(15,42,36,0.22)] backdrop-blur-2xl"
          >
            <ul className="px-6 py-7 flex flex-col gap-1">
              {navKeys.map(({ href, key }, index) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.04 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={href}
                    className="block rounded-full px-4 py-3 text-forest hover:bg-forest/5 hover:text-amber transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(key)}
                  </Link>
                </motion.li>
              ))}
              <li>
                <Link
                  href={isAuthenticated ? "/account/orders" : "/login"}
                  className="block rounded-full px-4 py-3 text-forest hover:bg-forest/5 hover:text-amber transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {isAuthenticated ? t("account") : t("login")}
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <button
                    type="button"
                    className="text-forest hover:text-amber transition-colors"
                    onClick={handleLogout}
                  >
                    {t("logout")}
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
