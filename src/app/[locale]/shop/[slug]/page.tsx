import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getCatalogArtisanBySlug,
  getCatalogProductBySlug,
  getCatalogProducts,
} from "@/lib/catalog-supabase";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { EditorialProductCard } from "@/components/shop/EditorialProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { enrichShopProduct, getRelatedProducts } from "@/lib/shop/curation";

const fallbackProduct = {
  id: "",
  slug: "",
  name: "Handcrafted Object",
  description: "",
  artisanName: "Baltic Artisan",
  artisanSlug: "",
  location: "The Baltic",
  craft: "Craft",
  materials: "Natural materials",
  technique: "Traditional craftsmanship",
  story: "A story of craft and place.",
  price: "€ —",
  image: "",
  images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"],
  details: [] as { label: string; value: string }[],
  priceAmount: null as number | null,
  currencyCode: "EUR",
  collectionSlug: null as string | null,
  productType: null as string | null,
};

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

  const rawProduct = (await getCatalogProductBySlug(slug, activeLocale)) || fallbackProduct;
  const product = enrichShopProduct(rawProduct);
  const artisan = product.artisanSlug ? await getCatalogArtisanBySlug(product.artisanSlug, activeLocale) : null;
  const images = product.images.length > 0 ? product.images : product.image ? [product.image] : fallbackProduct.images;
  const related = getRelatedProducts(allProducts.map(enrichShopProduct), product.slug, 3);

  const typeLabel = tShop(`types.${product.productType}` as never);
  const collectionLabel = tCollections(product.collectionSlug);

  return (
    <div className="pb-24">
      <section className="border-b border-fog/80">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-28 md:pt-36 pb-8 md:pb-10">
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-driftwood">
            <Link href="/shop" className="hover:text-amber transition-colors">
              {tShop("title")}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/shop?collection=${product.collectionSlug}`}
              className="hover:text-amber transition-colors"
            >
              {collectionLabel}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/shop?collection=${product.collectionSlug}&type=${product.productType}`}
              className="hover:text-amber transition-colors"
            >
              {typeLabel}
            </Link>
          </nav>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-10 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 xl:gap-20 items-start">
          <ProductGallery images={images} productName={product.name} label={typeLabel} />

          <div className="lg:pt-4">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 text-[11px] uppercase tracking-[0.22em] border border-driftwood/25 text-forest">
                {collectionLabel}
              </span>
              <span className="px-3 py-1 text-[11px] uppercase tracking-[0.22em] bg-linen border border-fog text-driftwood">
                {typeLabel}
              </span>
            </div>

            <p className="text-driftwood text-[11px] uppercase tracking-[0.24em]">
              {product.artisanSlug ? (
                <Link href={`/artisans/${product.artisanSlug}`} className="hover:text-amber transition-colors">
                  {product.artisanName}
                </Link>
              ) : (
                product.artisanName
              )}
              <span className="text-driftwood/70"> · {product.location}</span>
            </p>

            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-[3.4rem] text-forest tracking-tight leading-[1.05]">
              {product.name}
            </h1>

            <p className="mt-6 text-2xl md:text-3xl text-forest font-medium">{product.price}</p>

            <p className="mt-8 text-forest/80 text-base md:text-lg leading-relaxed max-w-xl">
              {product.description}
            </p>

            <div className="mt-10 pt-10 border-t border-fog/80">
              {product.id && product.priceAmount != null ? (
                <AddToCartButton
                  productId={product.id}
                  productSlug={product.slug}
                  productName={product.name}
                  productImageUrl={product.image}
                  unitPrice={product.priceAmount}
                  currencyCode={product.currencyCode}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full md:w-auto px-12 py-4 bg-forest text-linen font-medium tracking-[0.12em] uppercase text-sm opacity-60"
                >
                  {tProducts("addToCart")}
                </button>
              )}
            </div>

            <dl className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 text-sm border-t border-fog/80 pt-10">
              <DetailItem label={tProducts("materials")} value={product.materials} />
              <DetailItem label={tProducts("technique")} value={product.technique} />
              <DetailItem label={t("craft")} value={product.craft} />
              {product.details.map((detail) => (
                <DetailItem key={`${detail.label}-${detail.value}`} label={detail.label} value={detail.value} />
              ))}
            </dl>
          </div>
        </div>

        {product.story ? (
          <section className="mt-20 md:mt-28 py-12 md:py-16 border-y border-fog/80">
            <div className="max-w-3xl">
              <p className="text-driftwood text-xs uppercase tracking-[0.28em]">{t("storyEyebrow")}</p>
              <blockquote className="mt-6 font-serif text-2xl md:text-3xl text-forest leading-relaxed">
                {product.story}
              </blockquote>
            </div>
          </section>
        ) : null}

        {artisan ? (
          <section className="mt-20 md:mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
              <div className="relative aspect-[4/5] max-w-md bg-fog overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${artisan.portrait})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/35 via-transparent to-transparent" />
              </div>
              <div className="lg:pt-8">
                <p className="text-driftwood text-xs uppercase tracking-[0.28em]">{tProducts("meetArtisan")}</p>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl text-forest">{artisan.name}</h2>
                <p className="mt-2 text-driftwood text-sm uppercase tracking-[0.18em]">{artisan.location}</p>
                <p className="mt-8 text-forest/85 leading-relaxed text-base md:text-lg max-w-2xl">{artisan.bio}</p>
                <Link
                  href={`/artisans/${artisan.slug}`}
                  className="inline-flex items-center gap-2 mt-8 text-forest font-medium hover:text-amber transition-colors"
                >
                  {tProducts("viewProfile")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-20 md:mt-28 pt-16 border-t border-fog/80">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
              <div>
                <p className="text-driftwood text-xs uppercase tracking-[0.28em]">{t("relatedEyebrow")}</p>
                <h2 className="mt-3 font-serif text-3xl md:text-4xl text-forest">{t("relatedTitle")}</h2>
              </div>
              <Link
                href={`/shop?collection=${product.collectionSlug}&type=${product.productType}`}
                className="text-sm uppercase tracking-[0.16em] text-forest hover:text-amber transition-colors"
              >
                {t("relatedCta", { type: typeLabel })}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {related.map((item) => (
                <EditorialProductCard
                  key={item.slug}
                  product={item}
                  locale={activeLocale}
                  variant="feature"
                  label={tShop(`types.${item.productType}` as never)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-driftwood text-[11px] uppercase tracking-[0.18em]">{label}</dt>
      <dd className="mt-2 text-forest/90 leading-relaxed">{value}</dd>
    </div>
  );
}
