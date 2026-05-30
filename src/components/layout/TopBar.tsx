"use client";

import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard":          "Overview",
  "/dashboard/agents":   "Agents IA",
  "/dashboard/kanban":   "Kanban",
  "/dashboard/vault":    "Vault",
  "/dashboard/settings": "Paramètres",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";
  const now = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-val-border bg-val-surface/50 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-val-text">{title}</h1>
        <p className="text-xs text-val-subtle capitalize">{now}</p>
      </div>
      <div className="flex items-center gap-2 text-val-accent">
        <Activity size={15} className="animate-pulse" />
        <span className="text-xs font-medium">Système actif</span>
      </div>
    </header>
  );
}
