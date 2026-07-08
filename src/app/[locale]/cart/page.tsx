"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  getActiveCartWithItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/supabase/cart";

type CartItem = {
  id: string;
  product_slug: string | null;
  product_name: string;
  product_image_url: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type CartData = {
  id: string;
  currency_code: string;
  cart_items: CartItem[];
};

export default function CartPage() {
  const locale = useLocale();
  const isDe = locale === "de";

  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);
  const [cart, setCart] = useState<CartData | null>(null);
  const [message, setMessage] = useState("");

  const labels = {
    title: isDe ? "Warenkorb" : "Cart",
    empty: isDe ? "Dein Warenkorb ist leer." : "Your cart is empty.",
    loginPrompt: isDe ? "Bitte melde dich an, um den Warenkorb zu nutzen." : "Please sign in to use your cart.",
    login: isDe ? "Anmelden" : "Login",
    qty: isDe ? "Menge" : "Qty",
    remove: isDe ? "Entfernen" : "Remove",
    checkout: isDe ? "Zur Kasse" : "Checkout",
    total: isDe ? "Gesamt" : "Total",
  };

  const loadCart = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getActiveCartWithItems();
      setCart((data as CartData | null) ?? null);
      setAuthed(true);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unknown error";
      if (messageText === "NOT_AUTHENTICATED") {
        setAuthed(false);
        setCart(null);
      } else {
        setMessage(messageText);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const formatter = useMemo(() => {
    const currency = cart?.currency_code || "EUR";
    return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
      style: "currency",
      currency,
    });
  }, [cart?.currency_code, locale]);

  const total = useMemo(
    () => (cart?.cart_items || []).reduce((sum, item) => sum + Number(item.line_total || 0), 0),
    [cart?.cart_items],
  );

  const onAdjust = async (itemId: string, nextQuantity: number) => {
    await updateCartItemQuantity(itemId, nextQuantity);
    await loadCart();
  };

  const onRemove = async (itemId: string) => {
    await removeCartItem(itemId);
    await loadCart();
  };

  if (loading) {
    return (
      <div className="pt-28 md:pt-36 pb-24 min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 text-driftwood">Loading...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="pt-28 md:pt-36 pb-24 min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-forest">{labels.title}</h1>
          <p className="mt-4 text-driftwood">{labels.loginPrompt}</p>
          <Link href="/login" className="inline-flex mt-6 bg-forest text-linen px-5 py-3 text-sm tracking-wide">
            {labels.login}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-[60vh]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-forest">{labels.title}</h1>

        {!cart?.cart_items?.length ? (
          <p className="mt-6 text-driftwood">{labels.empty}</p>
        ) : (
          <div className="mt-8 space-y-4">
            {cart.cart_items.map((item) => (
              <article key={item.id} className="border border-fog bg-white p-4 md:p-6 flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-36 h-36 bg-fog overflow-hidden">
                  {item.product_image_url && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.product_image_url})` }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-forest font-medium">{item.product_name}</p>
                  <p className="text-sm text-driftwood mt-2">
                    {formatter.format(Number(item.unit_price))} x {item.quantity}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" className="border border-fog px-3 py-1" onClick={() => onAdjust(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span className="text-sm text-forest">{labels.qty}: {item.quantity}</span>
                    <button type="button" className="border border-fog px-3 py-1" onClick={() => onAdjust(item.id, item.quantity + 1)}>
                      +
                    </button>
                    <button type="button" className="text-sm text-driftwood hover:text-forest" onClick={() => onRemove(item.id)}>
                      {labels.remove}
                    </button>
                  </div>
                </div>
                <p className="text-forest font-medium">{formatter.format(Number(item.line_total))}</p>
              </article>
            ))}

            <div className="mt-8 border-t border-fog pt-6 flex items-center justify-between">
              <p className="text-lg text-forest">{labels.total}</p>
              <p className="text-xl text-forest font-medium">{formatter.format(total)}</p>
            </div>

            <Link
              href="/checkout"
              className="inline-flex mt-4 bg-forest text-linen px-8 py-3 text-sm tracking-wide hover:bg-forest/90 transition-colors"
            >
              {labels.checkout}
            </Link>
          </div>
        )}

        {message && <p className="mt-6 text-sm text-driftwood">{message}</p>}
      </div>
    </div>
  );
}
