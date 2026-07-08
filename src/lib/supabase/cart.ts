import { supabase } from "@/lib/supabase/client";

export type CartLineInput = {
  productId: string;
  productSlug: string;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  currencyCode?: string;
  quantity?: number;
};

async function requireUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("NOT_AUTHENTICATED");
  }

  return user.id;
}

export async function getOrCreateActiveCartId() {
  const userId = await requireUserId();

  const { data: activeCart } = await supabase
    .from("carts")
    .select("id")
    .eq("profile_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeCart?.id) return activeCart.id;

  const { data: created, error: createError } = await supabase
    .from("carts")
    .insert({ profile_id: userId, status: "active", currency_code: "EUR" })
    .select("id")
    .single();

  if (createError || !created?.id) {
    throw createError || new Error("Failed to create cart");
  }

  return created.id;
}

export async function addLineToCart(input: CartLineInput) {
  const cartId = await getOrCreateActiveCartId();
  const qtyToAdd = input.quantity ?? 1;

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", input.productId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + qtyToAdd })
      .eq("id", existing.id);

    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("cart_items").insert({
    cart_id: cartId,
    product_id: input.productId,
    product_slug: input.productSlug,
    product_name: input.productName,
    product_image_url: input.productImageUrl,
    quantity: qtyToAdd,
    unit_price: input.unitPrice,
    currency_code: input.currencyCode ?? "EUR",
  });

  if (error) throw error;
}

export async function getActiveCartWithItems() {
  const userId = await requireUserId();

  const { data: cart, error } = await supabase
    .from("carts")
    .select("id, currency_code, cart_items(id, product_slug, product_name, product_image_url, quantity, unit_price, line_total)")
    .eq("profile_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return cart;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
  if (error) throw error;
}

export async function removeCartItem(itemId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
  if (error) throw error;
}

export async function getActiveCartItemCount() {
  const cart = await getActiveCartWithItems();
  return (cart?.cart_items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}
