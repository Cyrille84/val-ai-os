"use client";

import { Brain, Plus, Search, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const MEMORIES = [
  { id: "m1", agent: "Super Agent Val", content: "L'utilisateur préfère les réponses courtes et directes en français.", type: "preference", date: "Il y a 2h" },
  { id: "m2", agent: "Super Agent Val", content: "Projet en cours : Val AI OS — dashboard Next.js avec agents IA.", type: "context",    date: "Il y a 3h" },
  { id: "m3", agent: "Worker-01",       content: "API Anthropic configurée avec le modèle claude-sonnet-4-6.",           type: "config",     date: "Hier" },
  { id: "m4", agent: "Worker-02",       content: "Dernière tâche complétée : analyse des logs système.",                  type: "task",       date: "Hier" },
  { id: "m5", agent: "Super Agent Val", content: "Stack technique validée : Next.js 16, Tailwind CSS, Zustand.",          type: "context",    date: "Il y a 2j" },
];

const TYPE_COLORS: Record<string, string> = {
  preference: "bg-val-primary/10 text-val-primary border-val-primary/20",
  context:    "bg-blue-400/10 text-blue-400 border-blue-400/20",
  config:     "bg-green-400/10 text-green-400 border-green-400/20",
  task:       "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
};

export default function MemoryPage() {
  const [search, setSearch] = useState("");

  const filtered = MEMORIES.filter(
    (m) => !search || m.content.toLowerCase().includes(search.toLowerCase()) || m.agent.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Memory</h2>
          <p className="text-val-subtle text-sm">Mémoire long-terme partagée entre tous les agents</p>
        </div>
        <button className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-val-subtle" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un souvenir..."
          className="w-full bg-val-surface border border-val-border rounded-lg pl-8 pr-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary"
        />
      </div>

      {/* Memory entries */}
      <div className="space-y-3">
        {filtered.map((mem) => (
          <div key={mem.id} className="val-card p-4 flex items-start gap-4 group">
            <div className="p-2.5 rounded-xl bg-val-primary/10 border border-val-primary/20 text-val-primary shrink-0 mt-0.5">
              <Brain size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-val-text">{mem.agent}</span>
                <span className={clsx("text-xs px-2 py-0.5 rounded-full border font-medium", TYPE_COLORS[mem.type])}>
                  {mem.type}
                </span>
              </div>
              <p className="text-sm text-val-subtle leading-relaxed">{mem.content}</p>
              <div className="flex items-center gap-1 mt-2 text-val-subtle/50">
                <Clock size={11} />
                <span className="text-xs">{mem.date}</span>
              </div>
            </div>
            <button className="text-val-subtle hover:text-val-primary opacity-0 group-hover:opacity-100 transition-all p-1 shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-val-subtle text-sm text-center py-8">Aucun souvenir trouvé.</p>
        )}
      </div>
    </div>
  );
}
