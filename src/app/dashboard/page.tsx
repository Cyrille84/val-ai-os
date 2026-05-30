"use client";

import { useAgentStore, useKanbanStore, useVaultStore } from "@/lib/store";
import { Bot, KanbanSquare, Vault, Activity, Zap } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ElementType; label: string; value: number | string;
  color: "primary" | "accent"; href: string;
}) {
  return (
    <Link href={href} className={clsx(
      "val-card p-5 flex items-center gap-4 group cursor-pointer hover:border-val-primary/40 transition-all",
      color === "primary" ? "hover:val-glow" : "hover:accent-glow"
    )}>
      <div className={clsx(
        "p-3 rounded-xl border",
        color === "primary"
          ? "bg-val-primary/10 border-val-primary/20 text-val-primary"
          : "bg-val-accent/10 border-val-accent/20 text-val-accent"
      )}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-val-text">{value}</p>
        <p className="text-sm text-val-subtle">{label}</p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const agents = useAgentStore((s) => s.agents);
  const cards = useKanbanStore((s) => s.cards);
  const entries = useVaultStore((s) => s.entries);

  const activeAgents = agents.filter((a) => a.status === "running").length;
  const inProgressCards = cards.filter((c) => c.status === "in_progress").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="val-card p-6 border-val-primary/30 bg-gradient-to-r from-val-primary/5 to-val-accent/5 val-glow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Zap size={20} className="text-val-primary" />
          <h2 className="text-lg font-semibold text-val-text">Bienvenue sur Val AI OS</h2>
        </div>
        <p className="text-val-subtle text-sm">
          Dashboard de gestion d&apos;agents IA — orchestrez vos agents, suivez vos tâches, gérez votre mémoire partagée.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Bot} label="Agents total" value={agents.length} color="primary" href="/dashboard/agents" />
        <StatCard icon={Activity} label="Agents actifs" value={activeAgents} color="accent" href="/dashboard/agents" />
        <StatCard icon={KanbanSquare} label="Tâches en cours" value={inProgressCards} color="primary" href="/dashboard/kanban" />
        <StatCard icon={Vault} label="Entrées Vault" value={entries.length} color="accent" href="/dashboard/vault" />
      </div>

      {/* Quick status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent agents */}
        <div className="val-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-val-text">Agents récents</h3>
            <Link href="/dashboard/agents" className="text-xs text-val-primary hover:text-val-glow">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {agents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between py-2 border-b border-val-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    agent.status === "running" ? "bg-green-400 animate-pulse" :
                    agent.status === "error" ? "bg-red-400" :
                    agent.status === "paused" ? "bg-yellow-400" : "bg-val-muted"
                  )} />
                  <span className="text-sm text-val-text">{agent.name}</span>
                </div>
                <span className="text-xs text-val-subtle font-mono">{agent.model}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban summary */}
        <div className="val-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-val-text">Kanban — résumé</h3>
            <Link href="/dashboard/kanban" className="text-xs text-val-primary hover:text-val-glow">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {(["backlog","todo","in_progress","review","done"] as const).map((col) => {
              const count = cards.filter((c) => c.status === col).length;
              const labels: Record<string, string> = { backlog: "Backlog", todo: "À faire", in_progress: "En cours", review: "Révision", done: "Terminé" };
              const colors: Record<string, string> = { backlog: "bg-val-muted", todo: "bg-blue-500", in_progress: "bg-val-primary", review: "bg-yellow-500", done: "bg-green-500" };
              return (
                <div key={col} className="flex items-center gap-3">
                  <div className={clsx("w-2 h-2 rounded-full shrink-0", colors[col])} />
                  <span className="text-sm text-val-subtle flex-1">{labels[col]}</span>
                  <span className="text-sm font-semibold text-val-text">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
