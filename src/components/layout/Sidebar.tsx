"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, KanbanSquare, Vault, Settings, LogOut, Zap } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard",          icon: Zap,           label: "Overview" },
  { href: "/dashboard/agents",   icon: Bot,           label: "Agents" },
  { href: "/dashboard/kanban",   icon: KanbanSquare,  label: "Kanban" },
  { href: "/dashboard/vault",    icon: Vault,         label: "Vault" },
  { href: "/dashboard/settings", icon: Settings,      label: "Paramètres" },
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
    <aside className="flex flex-col w-60 min-h-screen bg-val-surface border-r border-val-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-val-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-val-bg border border-val-border val-glow-sm shrink-0">
          <span className="text-sm font-bold text-val-primary">#</span>
          <span className="text-sm font-bold text-val-accent">V</span>
        </div>
        <div>
          <p className="text-sm font-bold text-val-text leading-none">Val AI OS</p>
          <p className="text-xs text-val-subtle mt-0.5">Agent Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
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
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 border-t border-val-border pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-val-subtle hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
