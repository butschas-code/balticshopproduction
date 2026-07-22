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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useDarkNav ? "bg-linen/90 backdrop-blur-md shadow-sm nav-scrolled" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-4 transition-colors duration-300 nav-link"
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
            <img
              src={useDarkNav ? "/brand/delmara-logo-green.png" : "/brand/delmara-logo-beige.png"}
              alt=""
              className="h-11 w-11 object-contain transition-transform duration-500 group-hover:scale-105 md:h-[3.25rem] md:w-[3.25rem]"
            />
          </span>
          <span className="brand-lockup brand-lockup-nav hidden text-linen group-hover:text-beeswax nav-link sm:inline-flex">
            <span className="brand-lockup-primary">Delmara</span>
            <span className="brand-lockup-secondary">Baltic Living</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-11">
          {navKeys.map(({ href, key }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[15px] tracking-wide transition-colors duration-300 text-linen/95 hover:text-beeswax nav-link"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <LanguageSelector />
          <Link
            href={isAuthenticated ? "/account/orders" : "/login"}
            className="hidden md:inline text-linen/95 hover:text-beeswax transition-colors duration-300 text-[15px] nav-link"
          >
            {isAuthenticated ? t("account") : t("login")}
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline text-linen/95 hover:text-beeswax transition-colors duration-300 text-[15px] nav-link"
            >
              {t("logout")}
            </button>
          )}
          <Link
            href="/cart"
            className="text-linen hover:text-beeswax transition-colors duration-300 nav-link"
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
            className="lg:hidden text-linen p-2 nav-link"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("menu")}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-linen border-t border-fog"
          >
            <ul className="px-6 py-8 flex flex-col gap-6">
              {navKeys.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-forest hover:text-amber transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={isAuthenticated ? "/account/orders" : "/login"}
                  className="text-forest hover:text-amber transition-colors"
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
