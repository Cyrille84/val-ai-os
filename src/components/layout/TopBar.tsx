"use client";

import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard":                   "Overview",
  "/dashboard/agents":            "Agents IA",
  "/dashboard/kanban":            "Kanban",
  "/dashboard/vault":             "Vault",
  "/dashboard/skills":            "Skills",
  "/dashboard/automations":       "Automations",
  "/dashboard/scheduled-tasks":   "Scheduled Tasks",
  "/dashboard/memory":            "Memory",
  "/dashboard/usage":             "Usage",
  "/dashboard/settings":          "Paramètres",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";
  const now = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-val-bg">{title}</h1>
        <p className="text-xs text-gray-400 capitalize">{now}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-val-primary">
          <Activity size={14} className="animate-pulse" />
          <span className="text-xs font-medium">Système actif</span>
        </div>
        <div className="text-xs font-bold text-val-bg opacity-30 font-mono">#Val AI OS</div>
      </div>
    </header>
  );
}
