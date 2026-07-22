"use client";

import { useTranslations } from "next-intl";
import { Link as NavLink } from "@/i18n/navigation";

const footerLinkKeys = {
  shop: [
    { href: "/shop", key: "shop" },
    { href: "/artisans", key: "artisans" },
    { href: "/stories", key: "stories" },
    { href: "/about", key: "about" },
  ],
  support: [
    { href: "/shipping", key: "shipping" },
    { href: "/returns", key: "returns" },
    { href: "/privacy", key: "privacy" },
  ],
};

const socialLinks = [
  { href: "#", label: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" },
  { href: "#", label: "Pinterest", icon: "M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.211 2.138.475 2.966.052.127.06.285.045.43-.046.18-.148.696-.17.807-.027.117-.089.158-.164.155-.666-.078-2.35-.958-2.966-2.37-.246-.589-.131-1.219-.131-1.219.328-1.551 1.011-2.851 1.989-3.656 1.009-.843 2.111-1.258 3.238-1.258 2.451 0 4.163 1.689 4.163 4.222 0 2.452-1.512 6.01-4.416 6.01-1.372 0-2.657-.714-2.657-1.929 0-1.516 1.058-2.936 1.058-2.936s-1.058-2.086-1.058-3.26c0-2.187 1.4-4.196 4.022-4.196 1.101 0 2.094.462 2.808 1.209.866.865 1.284 2.005 1.284 3.226 0 1.215-.328 2.54-.328 2.54s.492 1.963-.109 3.405c-.319.756-1.011 1.257-1.695 1.257-2.007 0-3.3-2.109-3.3-5.199 0-4.075 2.923-7.036 7.036-7.036 3.704 0 6.572 2.627 6.572 6.157 0 3.677-2.319 6.848-5.753 6.848-1.124 0-2.179-.584-2.761-1.593l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  return (
    <footer className="relative overflow-hidden bg-forest text-linen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(200,154,75,0.18)_0%,transparent_34%),radial-gradient(circle_at_86%_26%,rgba(246,243,238,0.08)_0%,transparent_30%)]" aria-hidden />
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          <div className="lg:col-span-2">
            <p className="premium-eyebrow border-linen/10 bg-linen/10 text-linen/70">{t("explore")}</p>
            <div className="mt-7 flex items-center gap-4">
              <img src="/brand/delmara-logo-beige.png" alt="" className="h-14 w-14 object-contain" />
              <p className="brand-lockup brand-lockup-footer text-linen/95">
                <span className="brand-lockup-primary">Delmara</span>
                <span className="brand-lockup-secondary">Baltic Living</span>
              </p>
            </div>
            <p className="mt-6 text-linen/70 text-sm leading-relaxed max-w-md">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-amber/90 mb-6">{t("explore")}</p>
            <ul className="space-y-4">
              {footerLinkKeys.shop.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    className="text-linen/80 hover:text-amber transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-sm"
                  >
                    {tNav(link.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-amber/90 mb-6">{t("support")}</p>
            <ul className="space-y-4">
              {footerLinkKeys.support.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    className="text-linen/80 hover:text-amber transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-sm"
                  >
                    {t(link.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-12 border-t border-linen/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-linen/50 text-sm">
            © {new Date().getFullYear()} {tNav("brand")}. {t("rights")}
          </p>
          <div className="flex gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-linen/60 hover:text-amber transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                aria-label={social.label}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
