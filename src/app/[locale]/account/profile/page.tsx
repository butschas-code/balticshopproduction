"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

type Address = {
  id: string;
  label: string | null;
  first_name: string | null;
  last_name: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  postal_code: string | null;
  country_code: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
};

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

export default function AccountProfilePage() {
  const locale = useLocale();
  const isDe = locale === "de";

  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [shipping, setShipping] = useState<AddressForm>(emptyAddress);
  const [billing, setBilling] = useState<AddressForm>(emptyAddress);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const labels = {
    title: isDe ? "Profil & Adressen" : "Profile & addresses",
    subtitle: isDe
      ? "Verwalte persönliche Daten, Liefer- und Rechnungsadresse sowie Passwort."
      : "Manage personal details, shipping/billing addresses, and password.",
    signInPrompt: isDe ? "Bitte melde dich an, um dein Profil zu bearbeiten." : "Please sign in to edit your profile.",
    signIn: isDe ? "Zur Anmeldung" : "Go to login",
    save: isDe ? "Speichern" : "Save changes",
    passwordButton: isDe ? "Passwort aktualisieren" : "Update password",
    success: isDe ? "Daten erfolgreich gespeichert." : "Saved successfully.",
    error: isDe ? "Speichern fehlgeschlagen." : "Save failed.",
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthed(false);
        setLoading(false);
        return;
      }

      setAuthed(true);
      setProfileId(user.id);

      const [{ data: profile }, { data: addresses }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, marketing_opt_in").eq("id", user.id).maybeSingle(),
        supabase
          .from("customer_addresses")
          .select("id, label, first_name, last_name, line1, line2, city, postal_code, country_code, is_default_shipping, is_default_billing")
          .eq("profile_id", user.id),
      ]);

      if (profile) {
        setFullName(profile.full_name ?? "");
        setPhone(profile.phone ?? "");
        setMarketingOptIn(profile.marketing_opt_in ?? false);
      }

      if (addresses) {
        const shippingAddress = addresses.find((a: Address) => a.is_default_shipping);
        const billingAddress = addresses.find((a: Address) => a.is_default_billing);

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
      }

      setLoading(false);
    };

    void load();
  }, []);

  const saveAddress = async (kind: "shipping" | "billing", value: AddressForm) => {
    if (!profileId) return;

    const { data: existing } = await supabase
      .from("customer_addresses")
      .select("id")
      .eq("profile_id", profileId)
      .eq(kind === "shipping" ? "is_default_shipping" : "is_default_billing", true)
      .maybeSingle();

    const payload = {
      profile_id: profileId,
      label: kind,
      first_name: value.firstName,
      last_name: value.lastName,
      line1: value.line1,
      line2: value.line2,
      city: value.city,
      postal_code: value.postalCode,
      country_code: value.countryCode,
      is_default_shipping: kind === "shipping",
      is_default_billing: kind === "billing",
    };

    if (existing?.id) {
      await supabase.from("customer_addresses").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("customer_addresses").insert(payload);
    }
  };

  const onSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileId) return;

    setMessage("");

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, marketing_opt_in: marketingOptIn, locale: locale === "de" ? "de" : "en" })
      .eq("id", profileId);

    if (profileError) {
      setMessage(`${labels.error} ${profileError.message}`);
      return;
    }

    await Promise.all([saveAddress("shipping", shipping), saveAddress("billing", billing)]);
    setMessage(labels.success);
  };

  const onUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (newPassword.length < 8) {
      setMessage(isDe ? "Passwort muss mindestens 8 Zeichen lang sein." : "Password must be at least 8 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(`${labels.error} ${error.message}`);
    } else {
      setNewPassword("");
      setMessage(isDe ? "Passwort aktualisiert." : "Password updated.");
    }
  };

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

      <form className="mt-10 space-y-10" onSubmit={onSaveProfile}>
        <section className="grid md:grid-cols-2 gap-5">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isDe ? "Vollständiger Name" : "Full name"}
            className="border border-driftwood/30 bg-white px-4 py-3 text-forest"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={isDe ? "Telefon" : "Phone"}
            className="border border-driftwood/30 bg-white px-4 py-3 text-forest"
          />
          <label className="text-sm text-forest/80 flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />
            {isDe ? "Marketing-Updates erhalten" : "Receive marketing updates"}
          </label>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest mb-4">{isDe ? "Lieferadresse" : "Shipping address"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={shipping.firstName} onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))} placeholder={isDe ? "Vorname" : "First name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
            <input value={shipping.lastName} onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))} placeholder={isDe ? "Nachname" : "Last name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
            <input value={shipping.line1} onChange={(e) => setShipping((s) => ({ ...s, line1: e.target.value }))} placeholder={isDe ? "Adresse Zeile 1" : "Address line 1"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" />
            <input value={shipping.line2} onChange={(e) => setShipping((s) => ({ ...s, line2: e.target.value }))} placeholder={isDe ? "Adresse Zeile 2" : "Address line 2"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" />
            <input value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} placeholder={isDe ? "Stadt" : "City"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
            <input value={shipping.postalCode} onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))} placeholder={isDe ? "PLZ" : "Postal code"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-forest mb-4">{isDe ? "Rechnungsadresse" : "Billing address"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={billing.firstName} onChange={(e) => setBilling((s) => ({ ...s, firstName: e.target.value }))} placeholder={isDe ? "Vorname" : "First name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
            <input value={billing.lastName} onChange={(e) => setBilling((s) => ({ ...s, lastName: e.target.value }))} placeholder={isDe ? "Nachname" : "Last name"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
            <input value={billing.line1} onChange={(e) => setBilling((s) => ({ ...s, line1: e.target.value }))} placeholder={isDe ? "Adresse Zeile 1" : "Address line 1"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" />
            <input value={billing.line2} onChange={(e) => setBilling((s) => ({ ...s, line2: e.target.value }))} placeholder={isDe ? "Adresse Zeile 2" : "Address line 2"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest md:col-span-2" />
            <input value={billing.city} onChange={(e) => setBilling((s) => ({ ...s, city: e.target.value }))} placeholder={isDe ? "Stadt" : "City"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
            <input value={billing.postalCode} onChange={(e) => setBilling((s) => ({ ...s, postalCode: e.target.value }))} placeholder={isDe ? "PLZ" : "Postal code"} className="border border-driftwood/30 bg-white px-4 py-3 text-forest" />
          </div>
        </section>

        <button type="submit" className="bg-forest text-linen px-6 py-3 text-sm tracking-wide hover:bg-forest/90 transition-colors">
          {labels.save}
        </button>
      </form>

      <form className="mt-12 border-t border-fog pt-8 space-y-4" onSubmit={onUpdatePassword}>
        <h2 className="font-serif text-2xl text-forest">{isDe ? "Passwort" : "Password"}</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          placeholder={isDe ? "Neues Passwort" : "New password"}
          className="max-w-md w-full border border-driftwood/30 bg-white px-4 py-3 text-forest"
        />
        <div>
          <button type="submit" className="bg-forest text-linen px-6 py-3 text-sm tracking-wide hover:bg-forest/90 transition-colors">
            {labels.passwordButton}
          </button>
        </div>
      </form>

      {message && <p className="mt-6 text-sm text-driftwood">{message}</p>}
    </div>
  );
}
