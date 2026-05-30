"use client";

import { useState } from "react";
import { useAgentStore, useChatStore } from "@/lib/store";
import type { Agent, SuperAgentMessage } from "@/types";
import { Bot, Plus, Send, Trash2, Play, Pause, X } from "lucide-react";
import clsx from "clsx";

const STATUS_COLORS: Record<Agent["status"], string> = {
  idle: "bg-val-muted text-val-subtle",
  running: "bg-green-400/15 text-green-400 border border-green-400/30",
  paused: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30",
  error: "bg-red-400/15 text-red-400 border border-red-400/30",
};

function AgentCard({ agent }: { agent: Agent }) {
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const removeAgent = useAgentStore((s) => s.removeAgent);

  return (
    <div className="val-card p-5 space-y-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "p-2.5 rounded-xl border",
            agent.type === "coordinator"
              ? "bg-val-primary/10 border-val-primary/20 text-val-primary"
              : "bg-val-accent/10 border-val-accent/20 text-val-accent"
          )}>
            <Bot size={18} />
          </div>
          <div>
            <p className="font-semibold text-val-text">{agent.name}</p>
            <span className="text-xs text-val-subtle capitalize">{agent.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_COLORS[agent.status])}>
            {agent.status}
          </span>
          {agent.id !== "super-agent" && (
            <button onClick={() => removeAgent(agent.id)} className="text-val-subtle hover:text-red-400 transition-colors p-1">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-val-subtle leading-relaxed">{agent.description}</p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-mono text-val-subtle/70 bg-val-muted px-2 py-0.5 rounded">{agent.model}</span>
        <div className="flex gap-2">
          <button
            onClick={() => updateAgent(agent.id, { status: agent.status === "running" ? "idle" : "running" })}
            className={clsx(
              "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
              agent.status === "running"
                ? "bg-yellow-400/15 text-yellow-400 hover:bg-yellow-400/25"
                : "bg-val-primary/15 text-val-primary hover:bg-val-primary/25"
            )}
          >
            {agent.status === "running" ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewAgentModal({ onClose }: { onClose: () => void }) {
  const addAgent = useAgentStore((s) => s.addAgent);
  const [form, setForm] = useState({ name: "", description: "", model: "claude-sonnet-4-6", type: "worker" as Agent["type"] });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addAgent({
      id: `agent-${Date.now()}`,
      ...form,
      status: "idle",
      tasksCompleted: 0,
      createdAt: new Date().toISOString(),
    } as Agent);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="val-card w-full max-w-md p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-val-text">Nouvel Agent</h3>
          <button onClick={onClose} className="text-val-subtle hover:text-val-text"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Nom</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary" />
          </div>
          <div>
            <label className="text-xs text-val-subtle mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-val-subtle mb-1 block">Modèle</label>
              <select value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary">
                <option>claude-sonnet-4-6</option>
                <option>claude-opus-4-6</option>
                <option>claude-haiku-4-5-20251001</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-val-subtle mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Agent["type"] }))}
                className="w-full bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text focus:outline-none focus:border-val-primary">
                <option value="worker">Worker</option>
                <option value="specialist">Specialist</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-val-primary hover:bg-val-primary/90 text-white font-semibold py-2 rounded-lg text-sm transition-all">
            Créer l&apos;agent
          </button>
        </form>
      </div>
    </div>
  );
}

function SuperAgentChat() {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage({ id: `m${Date.now()}`, role: "user", content: input.trim(), timestamp: new Date().toISOString() });
    const userMsg = input.trim();
    setInput("");
    // Simulated response
    setTimeout(() => {
      addMessage({
        id: `m${Date.now()}`,
        role: "assistant",
        content: `Instruction reçue : "${userMsg}". Je vais analyser et déléguer aux agents appropriés. (Connecte l'API Anthropic dans /dashboard/settings pour activer les vraies réponses.)`,
        timestamp: new Date().toISOString(),
      });
    }, 800);
  }

  return (
    <div className="val-card flex flex-col h-80">
      <div className="px-4 py-3 border-b border-val-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-val-primary animate-pulse" />
        <span className="text-sm font-semibold text-val-text">Super Agent Val — Chat</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-val-subtle/50 text-sm text-center mt-8">Envoie une instruction au Super Agent...</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={clsx(
              "max-w-[80%] px-3 py-2 rounded-xl text-sm",
              m.role === "user"
                ? "bg-val-primary/20 text-val-text border border-val-primary/30"
                : "bg-val-muted text-val-text border border-val-border"
            )}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 p-3 border-t border-val-border">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Donne une instruction au Super Agent..."
          className="flex-1 bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text placeholder-val-subtle/50 focus:outline-none focus:border-val-primary" />
        <button type="submit" className="bg-val-primary hover:bg-val-primary/90 text-white px-3 py-2 rounded-lg transition-all">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

export default function AgentsPage() {
  const agents = useAgentStore((s) => s.agents);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Agents IA</h2>
          <p className="text-val-subtle text-sm">{agents.length} agent{agents.length > 1 ? "s" : ""} configuré{agents.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm">
          <Plus size={16} /> Nouvel agent
        </button>
      </div>

      <SuperAgentChat />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
      </div>

      {showModal && <NewAgentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
