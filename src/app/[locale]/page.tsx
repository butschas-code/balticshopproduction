import { Hero } from "@/components/Hero";
import { CollectionGrid } from "@/components/CollectionGrid";
import { ArtisansSection } from "@/components/ArtisansSection";
import { SignatureProducts } from "@/components/SignatureProducts";
import { StorySection } from "@/components/StorySection";
import { JournalSection } from "@/components/JournalSection";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const tStory = await getTranslations("story");
  const tHero = await getTranslations("hero");
  return (
    <>
      <Hero
        title={tHero("title")}
        subtitle={tHero("subtitle")}
        ctaLabel={tHero("cta")}
      />
      <CollectionGrid />
      <ArtisansSection />
      <SignatureProducts />
      <StorySection
        imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"
        quote={tStory("quote")}
        subtitle={tStory("subtitle")}
      />
      <JournalSection />
    </>
  );
}
