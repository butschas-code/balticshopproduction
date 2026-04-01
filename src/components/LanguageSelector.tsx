"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { type Locale } from "@/i18n/config";

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <span className="flex items-center gap-1.5 text-xs tracking-wide text-current/80" aria-label="Language">
      {locale === "en" ? (
        <>
          <span className="text-current font-medium" aria-current="true">EN</span>
          <span className="text-current/40">/</span>
          <Link href={pathname || "/"} locale="de" className="hover:text-amber transition-colors duration-200">
            DE
          </Link>
        </>
      ) : (
        <>
          <Link href={pathname || "/"} locale="en" className="hover:text-amber transition-colors duration-200">
            EN
          </Link>
          <span className="text-current/40">/</span>
          <span className="text-current font-medium" aria-current="true">DE</span>
        </>
      )}
    </span>
  );
}
