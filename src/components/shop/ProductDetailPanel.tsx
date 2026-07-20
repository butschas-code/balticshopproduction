import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { isPlaceholderDetail, type ProductSpec } from "@/lib/shop/product-description";

type ProductDetailPanelProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: string;
    priceAmount: number | null;
    currencyCode: string;
    artisanName: string;
    artisanSlug: string;
    location: string;
    materials: string;
    technique: string;
    craft: string;
    details: { label: string; value: string }[];
  };
  intro: string;
  specs: ProductSpec[];
  collectionLabel: string;
  typeLabel: string;
  labels: {
    addToCart: string;
    materials: string;
    technique: string;
    craft: string;
    details: string;
  };
};

export function ProductDetailPanel({
  product,
  intro,
  specs,
  collectionLabel,
  typeLabel,
  labels,
}: ProductDetailPanelProps) {
  const detailRows = [
    ...specs,
    ...product.details.filter((detail) => !isPlaceholderDetail(detail.value)),
    ...(isPlaceholderDetail(product.materials) ? [] : [{ label: labels.materials, value: product.materials }]),
    ...(isPlaceholderDetail(product.technique) ? [] : [{ label: labels.technique, value: product.technique }]),
    ...(isPlaceholderDetail(product.craft) ? [] : [{ label: labels.craft, value: product.craft }]),
  ];

  const uniqueRows = detailRows.filter(
    (row, index, array) =>
      array.findIndex((item) => item.label.toLowerCase() === row.label.toLowerCase()) === index,
  );

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="premium-shell">
        <div className="premium-core px-6 py-8 md:px-8 md:py-10 lg:px-10 bg-white/35">
      <div className="premium-eyebrow flex flex-wrap gap-x-3 gap-y-2">
        <span>{collectionLabel}</span>
        <span aria-hidden className="text-forest/25">
          ·
        </span>
        <span>{typeLabel}</span>
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-driftwood">
        {product.artisanSlug ? (
          <Link href={`/artisans/${product.artisanSlug}`} className="hover:text-amber transition-colors">
            {product.artisanName}
          </Link>
        ) : (
          product.artisanName
        )}
        <span className="text-driftwood/60"> · {product.location}</span>
      </p>

      <h1 className="mt-4 font-serif text-[2.35rem] md:text-5xl lg:text-[3.25rem] text-forest tracking-tight leading-[1.04]">
        {product.name}
      </h1>

      <p className="mt-7 text-[1.65rem] md:text-[1.85rem] text-forest font-light tabular-nums tracking-tight">{product.price}</p>

      {intro ? (
        <p className="mt-10 text-[17px] md:text-lg leading-[1.85] text-forest/72 font-light max-w-md">{intro}</p>
      ) : null}

      <div className="mt-12 pt-10 border-t border-fog/70">
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
            className="w-full sm:w-auto min-w-[220px] px-10 py-4 bg-forest text-linen text-sm font-medium tracking-[0.14em] uppercase opacity-60"
          >
            {labels.addToCart}
          </button>
        )}
      </div>

      {uniqueRows.length > 0 ? (
        <div className="mt-12 pt-10 border-t border-fog/70">
          <p className="text-[11px] uppercase tracking-[0.28em] text-driftwood mb-6">{labels.details}</p>
          <dl className="space-y-5">
            {uniqueRows.map((row) => (
              <div key={`${row.label}-${row.value}`} className="grid grid-cols-[minmax(0,34%)_minmax(0,1fr)] gap-x-6 gap-y-1">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-driftwood pt-0.5">{row.label}</dt>
                <dd className="text-[15px] leading-relaxed text-forest/85 font-light">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
        </div>
      </div>
    </div>
  );
}
