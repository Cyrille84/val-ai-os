"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap, Bot, KanbanSquare, Vault, Settings, LogOut,
  Sparkles, Workflow, CalendarClock, Brain, BarChart2,
} from "lucide-react";
import clsx from "clsx";

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { href: "/dashboard",        icon: Zap,          label: "Overview" },
      { href: "/dashboard/agents", icon: Bot,          label: "Agents" },
      { href: "/dashboard/kanban", icon: KanbanSquare, label: "Kanban" },
      { href: "/dashboard/vault",  icon: Vault,        label: "Vault" },
    ],
  },
  {
    label: "Automation",
    items: [
      { href: "/dashboard/skills",           icon: Sparkles,     label: "Skills" },
      { href: "/dashboard/automations",      icon: Workflow,     label: "Automations" },
      { href: "/dashboard/scheduled-tasks",  icon: CalendarClock,label: "Scheduled Tasks" },
    ],
  },
  {
    label: "Système",
    items: [
      { href: "/dashboard/memory",   icon: Brain,    label: "Memory" },
      { href: "/dashboard/usage",    icon: BarChart2,label: "Usage" },
      { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-val-surface border-r border-val-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-val-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden border border-val-border val-glow-sm shrink-0">
          <Image src="/logo.jpg" alt="Val AI OS" width={40} height={40} unoptimized className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="text-sm font-bold text-val-text leading-none">#Val AI OS</p>
          <p className="text-xs text-val-subtle mt-0.5">Agent Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-val-subtle/50 px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-val-primary/15 text-val-primary border border-val-primary/25 val-glow-sm"
                        : "text-val-subtle hover:text-val-text hover:bg-val-muted"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 border-t border-val-border pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-val-subtle hover:text-val-primary hover:bg-val-primary/10 transition-all"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
