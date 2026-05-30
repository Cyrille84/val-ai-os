"use client";

import { CalendarClock, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

const TASKS = [
  { id: "t1", name: "Rapport hebdomadaire", cron: "0 9 * * MON", nextRun: "Lun. 02 juin, 09:00", agent: "Super Agent Val", active: true  },
  { id: "t2", name: "Nettoyage Vault",      cron: "0 0 * * *",   nextRun: "Demain, 00:00",        agent: "Worker-01",       active: true  },
  { id: "t3", name: "Sync données",         cron: "*/30 * * * *",nextRun: "Dans 12 min",           agent: "Worker-02",       active: false },
  { id: "t4", name: "Health check agents",  cron: "*/5 * * * *", nextRun: "Dans 3 min",            agent: "Super Agent Val", active: true  },
];

export default function ScheduledTasksPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Scheduled Tasks</h2>
          <p className="text-val-subtle text-sm">Tâches planifiées par cron pour les agents</p>
        </div>
        <button className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Planifier
        </button>
      </div>

      <div className="val-card overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-5 py-3 border-b border-val-border text-xs font-semibold text-val-subtle uppercase tracking-wider">
          <span>Tâche</span>
          <span>Cron</span>
          <span>Prochaine exécution</span>
          <span>Agent</span>
          <span />
        </div>
        {TASKS.map((task) => (
          <div key={task.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-5 py-4 border-b border-val-border/50 last:border-0 items-center hover:bg-val-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <CalendarClock size={15} className="text-val-primary shrink-0" />
              <span className="text-sm font-medium text-val-text">{task.name}</span>
            </div>
            <span className="text-xs font-mono text-val-subtle bg-val-muted px-2 py-1 rounded w-fit">{task.cron}</span>
            <span className="text-sm text-val-subtle">{task.nextRun}</span>
            <span className="text-xs text-val-subtle truncate">{task.agent}</span>
            <div className="flex items-center gap-2">
              <div className={clsx("w-8 h-4 rounded-full cursor-pointer transition-all", task.active ? "bg-val-primary" : "bg-val-muted")} />
              <button className="text-val-subtle hover:text-val-primary transition-colors p-1"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
