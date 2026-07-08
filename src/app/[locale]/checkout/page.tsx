"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { getActiveCartWithItems } from "@/lib/supabase/cart";
import {
  calculateCheckoutTotals,
  checkoutWithDetails,
  type CheckoutAddress,
  type CheckoutTotals,
} from "@/lib/supabase/checkout";
import { supabase } from "@/lib/supabase/client";

type AddressForm = {
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  countryCode: string;
};

const emptyAddress: AddressForm = {
  firstName: "",
  lastName: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  countryCode: "LV",
};

function toCheckoutAddress(form: AddressForm): CheckoutAddress {
  return {
    first_name: form.firstName,
    last_name: form.lastName,
    line1: form.line1,
    line2: form.line2,
    city: form.city,
    postal_code: form.postalCode,
    country_code: form.countryCode,
  };
}

export default function CheckoutPage() {
  const locale = useLocale();
  const isDe = locale === "de";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authed, setAuthed] = useState(true);
  const [hasItems, setHasItems] = useState(false);
  const [shipping, setShipping] = useState<AddressForm>(emptyAddress);
  const [billing, setBilling] = useState<AddressForm>(emptyAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [totals, setTotals] = useState<CheckoutTotals | null>(null);
  const [message, setMessage] = useState("");

  const labels = {
    title: isDe ? "Kasse" : "Checkout",
    subtitle: isDe
      ? "Prüfe Adressen, Promo-Code und Gesamtbetrag vor der Bestellung."
      : "Review addresses, promo code, and totals before placing your order.",
    shipping: isDe ? "Lieferadresse" : "Shipping address",
    billing: isDe ? "Rechnungsadresse" : "Billing address",
    sameAsShipping: isDe ? "Rechnungsadresse entspricht Lieferadresse" : "Billing address same as shipping",
    promo: isDe ? "Promo-Code" : "Promo code",
    applyPromo: isDe ? "Anwenden" : "Apply",
    subtotal: isDe ? "Zwischensumme" : "Subtotal",
    shippingCost: isDe ? "Versand" : "Shipping",
    tax: isDe ? "MwSt." : "Tax",
    discount: isDe ? "Rabatt" : "Discount",
    total: isDe ? "Gesamt" : "Total",
    placeOrder: isDe ? "Bestellung abschicken" : "Place order",
    loginPrompt: isDe ? "Bitte melde dich an, um zur Kasse zu gehen." : "Please sign in to checkout.",
    login: isDe ? "Anmelden" : "Login",
    emptyCart: isDe ? "Dein Warenkorb ist leer." : "Your cart is empty.",
    backToCart: isDe ? "Zurück zum Warenkorb" : "Back to cart",
    priceUpdated: isDe ? "Preise wurden aktualisiert" : "Prices were updated",
    stockIssue: isDe ? "Lagerbestand" : "Stock issue",
  };

  const refreshTotals = useCallback(
    async (promo: string, countryCode: string) => {
      try {
        const result = await calculateCheckoutTotals(promo, countryCode);
        setTotals(result);
        if (result.promo_code) setAppliedPromo(result.promo_code);
        return result;
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to calculate totals");
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthed(false);
        setLoading(false);
        return;
      }

      const cart = await getActiveCartWithItems();
      const itemCount = cart?.cart_items?.length ?? 0;
      setHasItems(itemCount > 0);

      const { data: addresses } = await supabase
        .from("customer_addresses")
        .select("first_name, last_name, line1, line2, city, postal_code, country_code, is_default_shipping, is_default_billing")
        .eq("profile_id", user.id);

      const shippingAddress = addresses?.find((a) => a.is_default_shipping);
      const billingAddress = addresses?.find((a) => a.is_default_billing);

      if (shippingAddress) {
        setShipping({
          firstName: shippingAddress.first_name ?? "",
          lastName: shippingAddress.last_name ?? "",
          line1: shippingAddress.line1 ?? "",
          line2: shippingAddress.line2 ?? "",
          city: shippingAddress.city ?? "",
          postalCode: shippingAddress.postal_code ?? "",
          countryCode: shippingAddress.country_code ?? "LV",
        });
      }

      if (billingAddress) {
        setBilling({
          firstName: billingAddress.first_name ?? "",
          lastName: billingAddress.last_name ?? "",
          line1: billingAddress.line1 ?? "",
          line2: billingAddress.line2 ?? "",
          city: billingAddress.city ?? "",
          postalCode: billingAddress.postal_code ?? "",
          countryCode: billingAddress.country_code ?? "LV",
        });
      }

      if (itemCount > 0) {
        await refreshTotals("", shippingAddress?.country_code ?? "LV");
      }

      setLoading(false);
    };

    void load();
  }, [refreshTotals]);

  useEffect(() => {
    if (!hasItems) return;
    const country = sameAsShipping ? shipping.countryCode : billing.countryCode;
    void refreshTotals(appliedPromo, country);
  }, [appliedPromo, billing.countryCode, hasItems, refreshTotals, sameAsShipping, shipping.countryCode]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
        style: "currency",
        currency: totals?.currency_code || "EUR",
      }),
    [locale, totals?.currency_code],
  );

  const onApplyPromo = async () => {
    setMessage("");
    const result = await refreshTotals(promoCode, shipping.countryCode);
    if (result?.promo_error) {
      setMessage(result.promo_error);
      setAppliedPromo("");
    } else if (result?.promo_code) {
      setAppliedPromo(result.promo_code);
      setMessage(isDe ? "Promo-Code angewendet." : "Promo code applied.");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const billingForm = sameAsShipping ? shipping : billing;

    try {
      const latestTotals = await refreshTotals(appliedPromo, shipping.countryCode);
      if (!latestTotals?.can_checkout) {
        setMessage(isDe ? "Checkout derzeit nicht möglich." : "Checkout is not available right now.");
        return;
      }

      if ((latestTotals.stock_issues?.length ?? 0) > 0) {
        setMessage(isDe ? "Einige Artikel sind nicht verfügbar." : "Some items are unavailable.");
        return;
      }

      const orderId = await checkoutWithDetails({
        promoCode: appliedPromo || undefined,
        shippingAddress: toCheckoutAddress(shipping),
        billingAddress: toCheckoutAddress(billingForm),
      });

      router.push(`/account/orders?placed=${orderId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 md:pt-36 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 text-driftwood">Loading...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="pt-28 md:pt-36 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h1 className="font-serif text-4xl text-forest">{labels.title}</h1>
          <p className="mt-4 text-driftwood">{labels.loginPrompt}</p>
          <Link href="/login" className="inline-flex mt-6 bg-forest text-linen px-5 py-3 text-sm tracking-wide">
            {labels.login}
          </Link>
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="pt-28 md:pt-36 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <h1 className="font-serif text-4xl text-forest">{labels.title}</h1>
          <p className="mt-4 text-driftwood">{labels.emptyCart}</p>
          <Link href="/cart" className="inline-flex mt-6 text-forest hover:text-amber">
            {labels.backToCart}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-forest tracking-tight">{labels.title}</h1>
        <p className="mt-3 text-driftwood">{labels.subtitle}</p>

        <form onSubmit={onSubmit} className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl text-forest mb-4">{labels.shipping}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={shipping.firstName} onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))} placeholder={isDe ? "Vorname" : "First name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                <input value={shipping.lastName} onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))} placeholder={isDe ? "Nachname" : "Last name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                <input value={shipping.line1} onChange={(e) => setShipping((s) => ({ ...s, line1: e.target.value }))} placeholder={isDe ? "Adresse" : "Address line 1"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" required />
                <input value={shipping.line2} onChange={(e) => setShipping((s) => ({ ...s, line2: e.target.value }))} placeholder={isDe ? "Adresszusatz" : "Address line 2"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" />
                <input value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} placeholder={isDe ? "Stadt" : "City"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                <input value={shipping.postalCode} onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))} placeholder={isDe ? "PLZ" : "Postal code"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                <input value={shipping.countryCode} onChange={(e) => setShipping((s) => ({ ...s, countryCode: e.target.value.toUpperCase() }))} placeholder={isDe ? "Land (z. B. LV)" : "Country (e.g. LV)"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" required />
              </div>
            </section>

            <section>
              <label className="text-sm text-forest/80 flex items-center gap-3 mb-4">
                <input type="checkbox" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} />
                {labels.sameAsShipping}
              </label>

              {!sameAsShipping && (
                <>
                  <h2 className="font-serif text-2xl text-forest mb-4">{labels.billing}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input value={billing.firstName} onChange={(e) => setBilling((s) => ({ ...s, firstName: e.target.value }))} placeholder={isDe ? "Vorname" : "First name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                    <input value={billing.lastName} onChange={(e) => setBilling((s) => ({ ...s, lastName: e.target.value }))} placeholder={isDe ? "Nachname" : "Last name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                    <input value={billing.line1} onChange={(e) => setBilling((s) => ({ ...s, line1: e.target.value }))} placeholder={isDe ? "Adresse" : "Address line 1"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" required />
                    <input value={billing.line2} onChange={(e) => setBilling((s) => ({ ...s, line2: e.target.value }))} placeholder={isDe ? "Adresszusatz" : "Address line 2"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" />
                    <input value={billing.city} onChange={(e) => setBilling((s) => ({ ...s, city: e.target.value }))} placeholder={isDe ? "Stadt" : "City"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                    <input value={billing.postalCode} onChange={(e) => setBilling((s) => ({ ...s, postalCode: e.target.value }))} placeholder={isDe ? "PLZ" : "Postal code"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" required />
                    <input value={billing.countryCode} onChange={(e) => setBilling((s) => ({ ...s, countryCode: e.target.value.toUpperCase() }))} placeholder={isDe ? "Land" : "Country"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" required />
                  </div>
                </>
              )}
            </section>
          </div>

          <aside className="border border-fog bg-white p-6 h-fit space-y-5">
            <div className="flex gap-3">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder={labels.promo}
                className="flex-1 border border-driftwood/30 bg-white px-4 py-3 text-forest"
              />
              <button type="button" onClick={onApplyPromo} className="border border-forest text-forest px-4 py-3 text-sm">
                {labels.applyPromo}
              </button>
            </div>

            {totals && (
              <div className="space-y-2 text-sm text-forest/90">
                <div className="flex justify-between"><span>{labels.subtotal}</span><span>{formatter.format(Number(totals.subtotal))}</span></div>
                <div className="flex justify-between"><span>{labels.shippingCost}</span><span>{formatter.format(Number(totals.shipping))}</span></div>
                <div className="flex justify-between"><span>{labels.tax}</span><span>{formatter.format(Number(totals.tax))}</span></div>
                {Number(totals.discount) > 0 && (
                  <div className="flex justify-between text-amber"><span>{labels.discount}</span><span>-{formatter.format(Number(totals.discount))}</span></div>
                )}
                <div className="flex justify-between text-base font-medium pt-3 border-t border-fog">
                  <span>{labels.total}</span>
                  <span>{formatter.format(Number(totals.total))}</span>
                </div>
              </div>
            )}

            {(totals?.price_updates?.length ?? 0) > 0 && (
              <div className="text-sm text-driftwood border-t border-fog pt-4">
                <p className="text-forest mb-2">{labels.priceUpdated}:</p>
                <ul className="space-y-1">
                  {totals?.price_updates.map((update) => (
                    <li key={`${update.product_name}-${update.new_price}`}>
                      {update.product_name}: {formatter.format(Number(update.old_price))} → {formatter.format(Number(update.new_price))}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(totals?.stock_issues?.length ?? 0) > 0 && (
              <div className="text-sm text-red-700 border-t border-fog pt-4">
                <p className="mb-2">{labels.stockIssue}:</p>
                <ul className="space-y-1">
                  {totals?.stock_issues.map((issue) => (
                    <li key={`${issue.product_name}-${issue.message}`}>
                      {issue.product_name}: {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !totals?.can_checkout || (totals?.stock_issues?.length ?? 0) > 0}
              className="w-full bg-forest text-linen py-3 text-sm tracking-wide hover:bg-forest/90 transition-colors disabled:opacity-60"
            >
              {submitting ? "..." : labels.placeOrder}
            </button>

            <Link href="/cart" className="block text-center text-sm text-driftwood hover:text-forest">
              {labels.backToCart}
            </Link>
          </aside>
        </form>

        {message && <p className="mt-6 text-sm text-driftwood">{message}</p>}
      </div>
    </div>
  );
}
