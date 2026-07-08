"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  currency_code: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
};

const pastStatuses = new Set(["delivered", "cancelled", "refunded"]);

export default function AccountOrdersPage() {
  const locale = useLocale();
  const isDe = locale === "de";

  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const labels = {
    title: isDe ? "Meine Bestellungen" : "My orders",
    subtitle: isDe
      ? "Aktuelle und vergangene Bestellungen an einem Ort."
      : "Current and past orders in one place.",
    current: isDe ? "Aktuelle Bestellungen" : "Current orders",
    past: isDe ? "Vergangene Bestellungen" : "Past orders",
    emptyCurrent: isDe ? "Keine aktuellen Bestellungen." : "No current orders.",
    emptyPast: isDe ? "Keine vergangenen Bestellungen." : "No past orders.",
    signInPrompt: isDe
      ? "Bitte melde dich an, um deine Bestellungen zu sehen."
      : "Please sign in to see your orders.",
    signIn: isDe ? "Zur Anmeldung" : "Go to login",
    qty: isDe ? "Menge" : "Qty",
    status: isDe ? "Status" : "Status",
    total: isDe ? "Gesamt" : "Total",
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthed(false);
        setOrders([]);
        setLoading(false);
        return;
      }

      setAuthed(true);

      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(
          "id, order_number, status, currency_code, total_amount, created_at, order_items (id, product_name, quantity, unit_price, line_total)",
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setOrders((data as Order[]) ?? []);
      }

      setLoading(false);
    };

    void loadOrders();
  }, []);

  const [currentOrders, pastOrders] = useMemo(() => {
    const current: Order[] = [];
    const past: Order[] = [];
    for (const order of orders) {
      if (pastStatuses.has(order.status)) {
        past.push(order);
      } else {
        current.push(order);
      }
    }
    return [current, past];
  }, [orders]);

  const currencyFormatter = (currencyCode: string) =>
    new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
      style: "currency",
      currency: currencyCode || "EUR",
    });

  if (loading) {
    return <p className="text-driftwood">Loading...</p>;
  }

  if (!authed) {
    return (
      <div className="rounded-2xl border border-fog bg-white p-8">
        <h1 className="font-serif text-3xl text-forest">{labels.title}</h1>
        <p className="mt-4 text-driftwood">{labels.signInPrompt}</p>
        <Link
          href="/login"
          className="inline-flex mt-6 bg-forest text-linen px-5 py-3 text-sm tracking-wide hover:bg-forest/90 transition-colors"
        >
          {labels.signIn}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest tracking-tight">{labels.title}</h1>
      <p className="mt-3 text-driftwood">{labels.subtitle}</p>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-forest">{labels.current}</h2>
        <div className="mt-5 space-y-4">
          {currentOrders.length === 0 && <p className="text-driftwood">{labels.emptyCurrent}</p>}
          {currentOrders.map((order) => (
            <article key={order.id} className="border border-fog bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-forest font-medium">#{order.order_number}</p>
                <p className="text-sm text-driftwood">
                  {labels.status}: {order.status}
                </p>
                <p className="text-sm text-driftwood">
                  {labels.total}: {currencyFormatter(order.currency_code).format(order.total_amount)}
                </p>
              </div>
              <ul className="mt-4 space-y-2">
                {order.order_items?.map((item) => (
                  <li key={item.id} className="text-sm text-forest/85">
                    {item.product_name} - {labels.qty}: {item.quantity} - {currencyFormatter(order.currency_code).format(item.line_total)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-forest">{labels.past}</h2>
        <div className="mt-5 space-y-4">
          {pastOrders.length === 0 && <p className="text-driftwood">{labels.emptyPast}</p>}
          {pastOrders.map((order) => (
            <article key={order.id} className="border border-fog bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-forest font-medium">#{order.order_number}</p>
                <p className="text-sm text-driftwood">
                  {labels.status}: {order.status}
                </p>
                <p className="text-sm text-driftwood">
                  {labels.total}: {currencyFormatter(order.currency_code).format(order.total_amount)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
