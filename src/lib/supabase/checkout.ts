import { supabase } from "@/lib/supabase/client";

export type CheckoutAddress = {
  first_name: string;
  last_name: string;
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country_code: string;
};

export type CheckoutTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency_code: string;
  promo_code: string | null;
  promo_error: string | null;
  price_updates: Array<{ product_name: string; old_price: number; new_price: number }>;
  stock_issues: Array<{ product_name: string; message: string; requested?: number; available?: number }>;
  can_checkout: boolean;
};

export async function calculateCheckoutTotals(promoCode?: string, countryCode?: string) {
  const { data, error } = await supabase.rpc("calculate_checkout_totals", {
    promo_code_input: promoCode?.trim() || null,
    country_code_input: countryCode?.trim().toUpperCase() || "LV",
  });

  if (error) throw error;
  return data as CheckoutTotals;
}

export async function checkoutWithDetails(input: {
  promoCode?: string;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  orderNote?: string;
}) {
  const { data, error } = await supabase.rpc("checkout_active_cart", {
    promo_code_input: input.promoCode?.trim() || null,
    shipping_address_input: input.shippingAddress,
    billing_address_input: input.billingAddress,
    order_note: input.orderNote ?? null,
  });

  if (error) throw error;
  return data as string;
}
