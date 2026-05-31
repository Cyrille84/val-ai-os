"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Mot de passe incorrect");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-val-bg flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(254,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(254,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      {/* Radial glow center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(254,0,0,0.06),transparent)]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden border border-val-border val-glow mb-4">
            <Image src="/logo.jpg" alt="Val AI OS" width={80} height={80} unoptimized className="object-cover w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-val-text">#Val AI OS</h1>
          <p className="text-val-subtle text-sm mt-1">Accès sécurisé au dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="val-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-val-subtle mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full bg-val-muted border border-val-border rounded-lg px-4 py-2.5 text-val-text placeholder-val-subtle/50 focus:outline-none focus:border-val-primary focus:ring-1 focus:ring-val-primary/30 font-mono"
            />
          </div>

          {error && (
            <p className="text-val-primary text-sm bg-val-primary/10 border border-val-primary/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-val-primary hover:bg-val-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all val-glow-sm"
          >
            {loading ? "Connexion..." : "Accéder au dashboard"}
          </button>
        </form>

        <p className="text-center text-val-subtle/40 text-xs mt-6">
          #Val AI OS · Système de gestion d&apos;agents IA
        </p>
      </div>
    </div>
  );
}
