import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("common");
  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-[60vh]">
      <div className="max-w-[1600px] mx-auto px-6">
        <h1 className="font-serif text-4xl text-forest">Privacy</h1>
        <p className="mt-4 text-driftwood">{t("infoSoon")}</p>
      </div>
    </div>
  );
}
