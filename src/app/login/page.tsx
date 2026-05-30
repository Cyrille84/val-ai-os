"use client";

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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-val-surface border border-val-border val-glow mb-4">
            <span className="text-2xl font-bold text-val-primary">#</span>
            <span className="text-2xl font-bold text-val-accent">V</span>
          </div>
          <h1 className="text-2xl font-bold text-val-text">Val AI OS</h1>
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
              className="w-full bg-val-muted border border-val-border rounded-lg px-4 py-2.5 text-val-text placeholder-val-subtle/50 focus:outline-none focus:border-val-primary focus:ring-1 focus:ring-val-primary/50 font-mono"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
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

        <p className="text-center text-val-subtle/50 text-xs mt-6">
          Val AI OS · Système de gestion d&apos;agents IA
        </p>
      </div>
    </div>
  );
}
