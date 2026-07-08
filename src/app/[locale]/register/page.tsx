"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const locale = useLocale();
  const isDe = locale === "de";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const labels = {
    title: isDe ? "Konto erstellen" : "Create account",
    subtitle: isDe
      ? "Registriere dich, um Bestellungen und Kundendaten sicher zu verwalten."
      : "Register to manage orders and customer data securely.",
    name: isDe ? "Vollständiger Name" : "Full name",
    email: "Email",
    password: isDe ? "Passwort" : "Password",
    button: isDe ? "Registrieren" : "Register",
    success: isDe
      ? "Prüfe dein Postfach, um die Registrierung zu bestätigen."
      : "Check your email to confirm registration.",
    error: isDe ? "Registrierung fehlgeschlagen." : "Registration failed.",
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(`${labels.error} ${error.message}`);
    } else {
      setMessage(labels.success);
      setEmail("");
      setPassword("");
      setFullName("");
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
            <label htmlFor="fullName" className="block text-sm text-forest/80 mb-2">
              {labels.name}
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-driftwood/30 bg-white px-4 py-3 text-forest"
              required
            />
          </div>

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
        </form>
      </div>
    </div>
  );
}
