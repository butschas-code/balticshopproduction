import { Hero } from "@/components/Hero";
import { CollectionGrid } from "@/components/CollectionGrid";
import { ArtisansSection } from "@/components/ArtisansSection";
import { SignatureProducts } from "@/components/SignatureProducts";
import { JournalSection } from "@/components/JournalSection";
import { getTranslations } from "next-intl/server";
import { getCatalogArtisans, getCatalogProducts } from "@/lib/catalog-supabase";
import { buildHomepageCategoryImages, buildSignatureProducts } from "@/lib/homepage-curation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locale === "de" ? "de" : "en";

  const [tHero, artisans, products] = await Promise.all([
    getTranslations("hero"),
    getCatalogArtisans(activeLocale),
    getCatalogProducts(activeLocale),
  ]);

  const featuredArtisans = artisans.filter((artisan) => artisan.isPartner);
  const categoryImages = buildHomepageCategoryImages(artisans, products);
  const signatureProducts = buildSignatureProducts(
    featuredArtisans,
    products,
    8,
    Object.values(categoryImages).filter((image): image is string => Boolean(image)),
  );

  return (
    <>
      <Hero
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        ctaLabel={tHero("cta")}
        imageUrl="/hero/old-culture-modern-home-premium.png"
      />
      <CollectionGrid categoryImages={categoryImages} />
      <ArtisansSection artisans={featuredArtisans} />
      <SignatureProducts products={signatureProducts} />
      <JournalSection locale={activeLocale} />
    </>
  );
}
