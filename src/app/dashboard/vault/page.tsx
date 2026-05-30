"use client";

import { useState } from "react";
import { useVaultStore } from "@/lib/store";
import type { VaultEntry } from "@/types";
import { Plus, X, Trash2, Edit3, Copy, Check, Search } from "lucide-react";
import clsx from "clsx";

const CATEGORY_COLORS: Record<VaultEntry["category"], string> = {
  context: "bg-val-accent/10 text-val-accent border-val-accent/20",
  prompt:  "bg-val-primary/10 text-val-primary border-val-primary/20",
  data:    "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  config:  "bg-green-400/10 text-green-400 border-green-400/20",
};

function EntryRow({ entry }: { entry: VaultEntry }) {
  const { removeEntry, updateEntry } = useVaultStore();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(entry.value);

  function copyValue() {
    navigator.clipboard.writeText(entry.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function saveEdit() {
    updateEntry(entry.id, { value: val });
    setEditing(false);
  }

  return (
    <div className="val-card p-4 space-y-2 group animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={clsx("text-xs px-2 py-0.5 rounded-full border font-medium", CATEGORY_COLORS[entry.category])}>
            {entry.category}
          </span>
          <span className="text-sm font-mono font-semibold text-val-text">{entry.key}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={copyValue} className="p-1.5 hover:text-val-accent text-val-subtle transition-colors">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button onClick={() => setEditing(!editing)} className="p-1.5 hover:text-val-primary text-val-subtle transition-colors">
            <Edit3 size={14} />
          </button>
          <button onClick={() => removeEntry(entry.id)} className="p-1.5 hover:text-red-400 text-val-subtle transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {entry.description && <p className="text-xs text-val-subtle/70">{entry.description}</p>}

      {editing ? (
        <div className="flex gap-2">
          <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={3}
            className="flex-1 bg-val-muted border border-val-primary/40 rounded-lg px-3 py-2 text-sm font-mono text-val-text focus:outline-none resize-none" />
          <div className="flex flex-col gap-1">
            <button onClick={saveEdit} className="px-3 py-1.5 bg-val-primary/20 text-val-primary text-xs rounded-lg hover:bg-val-primary/30">OK</button>
            <button onClick={() => { setEditing(false); setVal(entry.value); }} className="px-3 py-1.5 bg-val-muted text-val-subtle text-xs rounded-lg">✕</button>
          </div>
        </div>
      ) : (
        <p className="text-sm font-mono text-val-subtle bg-val-muted rounded-lg px-3 py-2 line-clamp-3 whitespace-pre-wrap break-all">
          {entry.value}
        </p>
      )}
    </div>
  );
}

function NewEntryModal({ onClose }: { onClose: () => void }) {
  const addEntry = useVaultStore((s) => s.addEntry);
  const [form, setForm] = useState({ key: "", value: "", category: "context" as VaultEntry["category"], description: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addEntry({ id: `v${Date.now()}`, ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="val-card w-full max-w-md p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-val-text">Nouvelle entrée Vault</h3>
          <button onClick={onClose} className="text-val-subtle hover:text-val-text"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-val-subtle mb-1 block">Clé</label>
              <input value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value.toUpperCase() }))} required placeholder="MA_CLE"
                className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm font-mono text-val-text focus:outline-none focus:border-val-primary" />
            </div>
            <div>
              <label className="text-xs text-val-subtle mb-1 block">Catégorie</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as VaultEntry["category"] }))}
                className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary">
                <option value="context">Context</option>
                <option value="prompt">Prompt</option>
                <option value="data">Data</option>
                <option value="config">Config</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Valeur</label>
            <textarea value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} required rows={4}
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm font-mono text-val-text focus:outline-none focus:border-val-primary resize-none" />
          </div>
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Description (optionnel)</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary" />
          </div>
          <button type="submit" className="w-full bg-val-primary hover:bg-val-primary/90 text-white font-semibold py-2 rounded-lg text-sm transition-all">
            Ajouter au Vault
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VaultPage() {
  const entries = useVaultStore((s) => s.entries);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VaultEntry["category"] | "all">("all");

  const filtered = entries.filter((e) => {
    const matchSearch = !search || e.key.toLowerCase().includes(search.toLowerCase()) || e.value.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Vault</h2>
          <p className="text-val-subtle text-sm">Mémoire partagée entre agents — {entries.length} entrée{entries.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Nouvelle entrée
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-val-subtle" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full bg-val-surface border border-val-border rounded-lg pl-8 pr-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary" />
        </div>
        {(["all", "context", "prompt", "data", "config"] as const).map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
              filter === cat ? "bg-val-primary/20 text-val-primary border border-val-primary/30" : "bg-val-surface border border-val-border text-val-subtle hover:text-val-text")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((e) => <EntryRow key={e.id} entry={e} />)}
        {filtered.length === 0 && <p className="text-val-subtle text-sm col-span-2 text-center py-8">Aucune entrée trouvée.</p>}
      </div>

      {showModal && <NewEntryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
