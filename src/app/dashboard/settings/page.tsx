"use client";

import { useState } from "react";
import { Key, Bot, Shield, Info } from "lucide-react";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="val-card p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-val-border">
        <Icon size={16} className="text-val-primary" />
        <h3 className="text-sm font-semibold text-val-text">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-val-text">Paramètres</h2>
        <p className="text-val-subtle text-sm">Configuration de Val AI OS</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-val-accent/5 border border-val-accent/20 rounded-xl p-4">
        <Info size={16} className="text-val-accent mt-0.5 shrink-0" />
        <div className="text-sm text-val-subtle">
          <p>Les paramètres sensibles (clés API, mot de passe) sont configurés via le fichier <code className="text-val-text font-mono text-xs bg-val-muted px-1.5 py-0.5 rounded">.env.local</code> à la racine du projet.</p>
          <p className="mt-1">Copie <code className="text-val-text font-mono text-xs bg-val-muted px-1.5 py-0.5 rounded">.env.local.example</code> → <code className="text-val-text font-mono text-xs bg-val-muted px-1.5 py-0.5 rounded">.env.local</code> puis remplis les valeurs.</p>
        </div>
      </div>

      <Section title="Clé API Anthropic" icon={Key}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-xs text-val-subtle mb-1 block">ANTHROPIC_API_KEY</label>
            <input type="password" placeholder="sk-ant-..." defaultValue=""
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm font-mono text-val-text focus:outline-none focus:border-val-primary" />
            <p className="text-xs text-val-subtle/60 mt-1">Défini dans .env.local — non visible ici pour la sécurité</p>
          </div>
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Modèle par défaut</label>
            <select defaultValue="claude-sonnet-4-6"
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary">
              <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (recommandé)</option>
              <option value="claude-opus-4-6">Claude Opus 4.6 (plus puissant)</option>
              <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (plus rapide)</option>
            </select>
          </div>
          <button type="submit" className="bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            {saved ? "Sauvegardé !" : "Sauvegarder"}
          </button>
        </form>
      </Section>

      <Section title="Super Agent" icon={Bot}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Nom du Super Agent</label>
            <input defaultValue="Super Agent Val"
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary" />
          </div>
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Prompt système</label>
            <textarea rows={4} defaultValue="Tu es Val, un super agent coordinateur IA. Tu reçois des instructions et tu les délègues aux agents spécialisés. Tu es précis, efficace et professionnel."
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm font-mono text-val-text focus:outline-none focus:border-val-primary resize-none" />
          </div>
        </div>
      </Section>

      <Section title="Sécurité" icon={Shield}>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-val-border/50">
            <span className="text-val-subtle">Authentification par mot de passe</span>
            <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-0.5 rounded-full">Activée</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-val-border/50">
            <span className="text-val-subtle">Session JWT (24h)</span>
            <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-0.5 rounded-full">Activée</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-val-subtle">Cookie httpOnly</span>
            <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2 py-0.5 rounded-full">Activée</span>
          </div>
          <p className="text-xs text-val-subtle/60">
            Pour changer le mot de passe, modifie <code className="text-val-text font-mono bg-val-muted px-1 rounded">DASHBOARD_PASSWORD</code> dans .env.local et redémarre le serveur.
          </p>
        </div>
      </Section>
    </div>
  );
}
