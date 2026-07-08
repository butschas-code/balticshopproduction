"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const locale = useLocale();
  const isDe = locale === "de";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const labels = {
    title: isDe ? "Anmelden" : "Sign in",
    subtitle: isDe
      ? "Melde dich an, um Bestellungen und Profil zu verwalten."
      : "Sign in to manage your orders and profile.",
    email: "Email",
    password: isDe ? "Passwort" : "Password",
    button: isDe ? "Einloggen" : "Login",
    success: isDe ? "Erfolgreich eingeloggt." : "Signed in successfully.",
    error: isDe ? "Anmeldung fehlgeschlagen." : "Login failed.",
    noAccount: isDe ? "Noch kein Konto?" : "No account yet?",
    register: isDe ? "Registrieren" : "Register",
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(`${labels.error} ${error.message}`);
    } else {
      setMessage(labels.success);
      router.push("/account/orders");
    }

    setLoading(false);
  }

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <div className="max-w-xl mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-forest tracking-tight">{labels.title}</h1>
        <p className="mt-4 text-driftwood">{labels.subtitle}</p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-forest/80 mb-2">
              {labels.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-driftwood/30 bg-white px-4 py-3 text-forest"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-forest/80 mb-2">
              {labels.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-driftwood/30 bg-white px-4 py-3 text-forest"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-linen py-3 font-medium tracking-wide hover:bg-forest/90 transition-colors disabled:opacity-60"
          >
            {loading ? "..." : labels.button}
          </button>

          {message && <p className="text-sm text-driftwood">{message}</p>}

          <p className="text-sm text-driftwood">
            {labels.noAccount}{" "}
            <Link href="/register" className="text-forest hover:text-amber transition-colors">
              {labels.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
