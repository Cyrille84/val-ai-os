"use client";

import { useState } from "react";
import { useKanbanStore } from "@/lib/store";
import type { KanbanCard } from "@/types";
import { Plus, X, GripVertical, Trash2 } from "lucide-react";
import clsx from "clsx";

const COLUMNS: { id: KanbanCard["status"]; label: string; color: string }[] = [
  { id: "backlog",     label: "Backlog",    color: "text-val-subtle" },
  { id: "todo",        label: "À faire",    color: "text-blue-400" },
  { id: "in_progress", label: "En cours",   color: "text-val-primary" },
  { id: "review",      label: "Révision",   color: "text-yellow-400" },
  { id: "done",        label: "Terminé",    color: "text-green-400" },
];

const PRIORITY_COLORS: Record<KanbanCard["priority"], string> = {
  low:      "bg-val-muted text-val-subtle",
  medium:   "bg-blue-400/15 text-blue-400",
  high:     "bg-yellow-400/15 text-yellow-400",
  critical: "bg-red-400/15 text-red-400",
};

function Card({ card }: { card: KanbanCard }) {
  const { moveCard, removeCard } = useKanbanStore();

  return (
    <div className="val-card p-3 space-y-2 cursor-grab active:cursor-grabbing group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-val-text leading-snug">{card.title}</p>
        <button onClick={() => removeCard(card.id)} className="text-val-subtle hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5">
          <Trash2 size={13} />
        </button>
      </div>
      {card.description && <p className="text-xs text-val-subtle">{card.description}</p>}
      <div className="flex items-center justify-between">
        <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", PRIORITY_COLORS[card.priority])}>
          {card.priority}
        </span>
        {card.tags && card.tags.map((t) => (
          <span key={t} className="val-tag">{t}</span>
        ))}
      </div>
      {/* Quick move buttons */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        {COLUMNS.filter((c) => c.id !== card.status).map((col) => (
          <button key={col.id} onClick={() => moveCard(card.id, col.id)}
            className="text-xs px-1.5 py-0.5 rounded bg-val-muted hover:bg-val-border text-val-subtle hover:text-val-text transition-all">
            → {col.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NewCardModal({ defaultStatus, onClose }: { defaultStatus: KanbanCard["status"]; onClose: () => void }) {
  const addCard = useKanbanStore((s) => s.addCard);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" as KanbanCard["priority"], status: defaultStatus });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addCard({ id: `c${Date.now()}`, ...form, createdAt: new Date().toISOString() });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="val-card w-full max-w-sm p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-val-text">Nouvelle carte</h3>
          <button onClick={onClose} className="text-val-subtle hover:text-val-text"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Titre</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary" />
          </div>
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-val-subtle mb-1 block">Priorité</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as KanbanCard["priority"] }))}
                className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-val-subtle mb-1 block">Colonne</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as KanbanCard["status"] }))}
                className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary">
                {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-val-primary hover:bg-val-primary/90 text-white font-semibold py-2 rounded-lg text-sm transition-all">
            Ajouter la carte
          </button>
        </form>
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const cards = useKanbanStore((s) => s.cards);
  const [modal, setModal] = useState<KanbanCard["status"] | null>(null);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Kanban</h2>
          <p className="text-val-subtle text-sm">{cards.length} tâche{cards.length > 1 ? "s" : ""} au total</p>
        </div>
        <button onClick={() => setModal("todo")} className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Nouvelle carte
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.status === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-64 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={clsx("text-sm font-semibold", col.color)}>{col.label}</h3>
                  <span className="text-xs bg-val-muted text-val-subtle px-1.5 py-0.5 rounded-full">{colCards.length}</span>
                </div>
                <button onClick={() => setModal(col.id)} className="text-val-subtle hover:text-val-text transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {colCards.map((card) => <Card key={card.id} card={card} />)}
              </div>
            </div>
          );
        })}
      </div>

      {modal && <NewCardModal defaultStatus={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
