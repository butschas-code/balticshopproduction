"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { addLineToCart } from "@/lib/supabase/cart";

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  currencyCode: string;
};

export function AddToCartButton({
  productId,
  productSlug,
  productName,
  productImageUrl,
  unitPrice,
  currencyCode,
}: Props) {
  const locale = useLocale();
  const isDe = locale === "de";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const label = isDe ? "In den Warenkorb" : "Add to cart";

  const onAdd = async () => {
    setLoading(true);
    setMessage("");

    try {
      await addLineToCart({
        productId,
        productSlug,
        productName,
        productImageUrl,
        unitPrice,
        currencyCode,
        quantity: 1,
      });
      setMessage(isDe ? "Zum Warenkorb hinzugefügt." : "Added to cart.");
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unknown error";
      if (messageText === "NOT_AUTHENTICATED") {
        router.push("/login");
        return;
      }
      setMessage(`${isDe ? "Fehler" : "Error"}: ${messageText}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={onAdd}
        className="w-full md:w-auto px-12 py-4 bg-forest text-linen text-sm font-medium tracking-[0.12em] uppercase hover:bg-forest/90 transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? "..." : label}
      </button>
      {message && <p className="mt-3 text-sm text-driftwood">{message}</p>}
    </div>
  );
}
