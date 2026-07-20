import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { ScrollRevealItem, ScrollRevealStagger } from "@/components/shop/ScrollReveal";

type SignatureProduct = {
  slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  artisanName: string;
  craft: string;
};

type SignatureProductsProps = {
  products: SignatureProduct[];
};

export function SignatureProducts({ products }: SignatureProductsProps) {
  const t = useTranslations("products");

  return (
    <section className="premium-section py-24 md:py-32 lg:py-40 bg-linen/80 relative z-10">
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollRevealStagger className="text-center mb-16 md:mb-24">
          <ScrollRevealItem>
            <p className="premium-eyebrow mx-auto">{t("signatureTitle")}</p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <h2 className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl text-forest tracking-tight">{t("signatureTitle")}</h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 text-driftwood text-lg max-w-xl mx-auto">{t("signatureSubtitle")}</p>
          </ScrollRevealItem>
        </ScrollRevealStagger>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {products.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
