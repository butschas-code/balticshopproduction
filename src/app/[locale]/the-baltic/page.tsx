import { getTranslations } from "next-intl/server";

export default async function TheBalticPage() {
  const t = await getTranslations("common");
  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-[1600px] mx-auto px-6 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-forest">The Baltic</h1>
        <p className="mt-4 text-driftwood">{t("comingSoon")}</p>
      </div>
    </div>
  );
}
