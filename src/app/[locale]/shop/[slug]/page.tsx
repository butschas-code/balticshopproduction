import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getCatalogArtisanBySlug,
  getCatalogProductBySlug,
  getCatalogProducts,
} from "@/lib/catalog-supabase";
import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import { ProductDetailPanel } from "@/components/shop/ProductDetailPanel";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { enrichShopProduct, getRelatedProducts } from "@/lib/shop/curation";
import { parseProductDescription } from "@/lib/shop/product-description";

const fallbackImages = ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = locale === "de" ? "de" : "en";

  const [t, tProducts, tShop, tCollections, allProducts] = await Promise.all([
    getTranslations("product"),
    getTranslations("products"),
    getTranslations("shop"),
    getTranslations("collections"),
    getCatalogProducts(activeLocale),
  ]);

  const rawProduct = await getCatalogProductBySlug(slug, activeLocale);
  if (!rawProduct) notFound();

  const product = enrichShopProduct(rawProduct);
  const artisan = product.artisanSlug ? await getCatalogArtisanBySlug(product.artisanSlug, activeLocale) : null;
  const images = product.images.length > 0 ? product.images : product.image ? [product.image] : fallbackImages;
  const related = getRelatedProducts(allProducts.map(enrichShopProduct), product.slug, 3);
  const { intro, specs } = parseProductDescription(product.description);

  const typeLabel = tShop(`types.${product.productType}` as never);
  const collectionLabel = tCollections(product.collectionSlug);

  return (
    <div className="relative pb-30 md:pb-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-28 md:pt-32 pb-8">
        <nav className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-forest/8 bg-white/35 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-driftwood backdrop-blur-sm">
          <Link href="/shop" className="hover:text-amber transition-colors">
            {tShop("title")}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/shop?collection=${product.collectionSlug}`} className="hover:text-amber transition-colors">
            {collectionLabel}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-forest/55">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
          <div className="lg:col-span-7 xl:col-span-7">
            <ProductGallery images={images} productName={product.name} />
          </div>

          <div className="lg:col-span-5 xl:col-span-5">
            <ProductDetailPanel
              product={product}
              intro={intro}
              specs={specs}
              collectionLabel={collectionLabel}
              typeLabel={typeLabel}
              labels={{
                addToCart: tProducts("addToCart"),
                materials: tProducts("materials"),
                technique: tProducts("technique"),
                craft: t("craft"),
                details: t("details"),
              }}
            />
          </div>
        </div>

        {artisan ? (
          <section className="premium-section mt-24 md:mt-32 pt-12 md:pt-16">
            <div className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] lg:grid-cols-[140px_minmax(0,1fr)] gap-8 md:gap-10 items-center max-w-3xl">
              <div className="premium-shell">
                <div className="premium-core relative aspect-[4/5]">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${artisan.portrait})` }} />
                </div>
              </div>
              <div>
                <p className="premium-eyebrow">{tProducts("meetArtisan")}</p>
                <h2 className="mt-3 font-serif text-2xl md:text-3xl text-forest tracking-tight">{artisan.name}</h2>
                <p className="mt-2 text-sm text-driftwood">{artisan.location}</p>
                <p className="mt-5 text-[15px] leading-[1.75] text-forest/70 font-light line-clamp-4">{artisan.bio}</p>
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="inline-flex items-center gap-2 mt-6 text-[11px] uppercase tracking-[0.22em] text-forest hover:text-amber transition-colors"
                >
                  {tProducts("viewProfile")}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="premium-section mt-24 md:mt-32 pt-16 md:pt-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
              <div>
                <p className="premium-eyebrow">{t("relatedEyebrow")}</p>
                <h2 className="mt-3 font-serif text-3xl md:text-4xl text-forest tracking-tight">{t("relatedTitle")}</h2>
              </div>
              <Link
                href={`/shop?collection=${product.collectionSlug}&type=${product.productType}`}
                className="inline-flex items-center rounded-full border border-forest/10 bg-white/35 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-forest hover:text-amber transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {t("relatedCta", { type: typeLabel })}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {related.map((item, index) => (
                <EditorialProductCard
                  key={item.slug}
                  product={item}
                  locale={activeLocale}
                  variant="feature"
                  index={index}
                  label={`${item.artisanName} · ${tShop(`types.${item.productType}` as never)}`}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
