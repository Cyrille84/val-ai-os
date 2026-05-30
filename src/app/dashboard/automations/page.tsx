"use client";

import { Workflow, Plus, Play, Pause, Zap } from "lucide-react";
import clsx from "clsx";

const AUTOMATIONS = [
  { id: "a1", name: "Daily Briefing",      description: "Génère un résumé quotidien à 8h du matin.",        status: "active",   trigger: "Cron: 8h",         lastRun: "Aujourd'hui 08:00" },
  { id: "a2", name: "Code Review Agent",   description: "Analyse les PRs GitHub et commente automatiquement.", status: "paused",  trigger: "Webhook: GitHub",  lastRun: "Hier 14:32" },
  { id: "a3", name: "Vault Sync",          description: "Synchronise le Vault avec une source externe.",       status: "active",  trigger: "Cron: toutes 6h",  lastRun: "Il y a 2h" },
  { id: "a4", name: "Alert Monitor",       description: "Surveille les métriques et envoie des alertes.",      status: "draft",   trigger: "Event: metric",    lastRun: "—" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-400/15 text-green-400 border border-green-400/30",
  paused: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30",
  draft:  "bg-val-muted text-val-subtle border border-val-border",
};

export default function AutomationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Automations</h2>
          <p className="text-val-subtle text-sm">Workflows automatiques pilotés par les agents</p>
        </div>
        <button className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Nouvelle automation
        </button>
      </div>

      <div className="space-y-3">
        {AUTOMATIONS.map((auto) => (
          <div key={auto.id} className="val-card p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-val-primary/10 border border-val-primary/20 text-val-primary shrink-0">
              <Workflow size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-val-text text-sm">{auto.name}</p>
                <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_COLORS[auto.status])}>
                  {auto.status}
                </span>
              </div>
              <p className="text-sm text-val-subtle truncate">{auto.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-val-subtle/60 font-mono flex items-center gap-1">
                  <Zap size={10} /> {auto.trigger}
                </span>
                <span className="text-xs text-val-subtle/60">Dernière exécution : {auto.lastRun}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className={clsx(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
                auto.status === "active"
                  ? "bg-yellow-400/15 text-yellow-400 hover:bg-yellow-400/25"
                  : "bg-val-primary/15 text-val-primary hover:bg-val-primary/25"
              )}>
                {auto.status === "active" ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
