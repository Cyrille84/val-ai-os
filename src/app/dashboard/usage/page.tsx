"use client";

import { BarChart2, TrendingUp, Zap, MessageSquare, Clock } from "lucide-react";

const STATS = [
  { label: "Tokens utilisés (7j)",    value: "124,580", delta: "+12%", icon: Zap },
  { label: "Messages envoyés (7j)",   value: "342",     delta: "+8%",  icon: MessageSquare },
  { label: "Temps moyen / requête",   value: "1.4s",    delta: "-5%",  icon: Clock },
  { label: "Tâches complétées (7j)",  value: "89",      delta: "+23%", icon: TrendingUp },
];

const DAILY = [
  { day: "Lun", tokens: 18400, messages: 52 },
  { day: "Mar", tokens: 21200, messages: 61 },
  { day: "Mer", tokens: 15800, messages: 44 },
  { day: "Jeu", tokens: 19600, messages: 57 },
  { day: "Ven", tokens: 22100, messages: 63 },
  { day: "Sam", tokens: 14300, messages: 41 },
  { day: "Dim", tokens: 13180, messages: 24 },
];

const MAX_TOKENS = Math.max(...DAILY.map((d) => d.tokens));

const MODEL_USAGE = [
  { model: "claude-sonnet-4-6",          tokens: 89200, pct: 72 },
  { model: "claude-haiku-4-5-20251001",  tokens: 28100, pct: 23 },
  { model: "claude-opus-4-6",            tokens: 7280,  pct: 5  },
];

export default function UsagePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-val-text">Usage</h2>
        <p className="text-val-subtle text-sm">Statistiques d&apos;utilisation des agents et modèles IA</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, delta, icon: Icon }) => {
          const positive = delta.startsWith("+");
          return (
            <div key={label} className="val-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <Icon size={16} className="text-val-primary" />
                <span className={`text-xs font-semibold ${positive ? "text-green-400" : "text-val-primary"}`}>{delta}</span>
              </div>
              <p className="text-2xl font-bold text-val-text">{value}</p>
              <p className="text-xs text-val-subtle">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily bar chart */}
        <div className="val-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={16} className="text-val-primary" />
            <h3 className="text-sm font-semibold text-val-text">Tokens par jour (7 derniers jours)</h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {DAILY.map((d) => {
              const h = Math.round((d.tokens / MAX_TOKENS) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-sm bg-val-primary/70 hover:bg-val-primary transition-all cursor-default"
                    style={{ height: `${h}%` }}
                    title={`${d.tokens.toLocaleString()} tokens`}
                  />
                  <span className="text-xs text-val-subtle">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model breakdown */}
        <div className="val-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-val-primary" />
            <h3 className="text-sm font-semibold text-val-text">Répartition par modèle</h3>
          </div>
          <div className="space-y-4">
            {MODEL_USAGE.map((m) => (
              <div key={m.model} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-val-subtle">{m.model}</span>
                  <span className="text-xs font-semibold text-val-text">{m.pct}%</span>
                </div>
                <div className="h-1.5 bg-val-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-val-primary rounded-full transition-all"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
                <span className="text-xs text-val-subtle/60">{m.tokens.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
