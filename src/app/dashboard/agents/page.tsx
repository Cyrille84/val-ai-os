"use client";

import { useEffect, useRef, useState } from "react";
import { useAgentStore, useChatStore } from "@/lib/store";
import type { Agent } from "@/types";
import { Bot, Plus, Send, Trash2, Play, Pause, X, Loader2, Trash } from "lucide-react";
import clsx from "clsx";

// ─── Agent Card ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<Agent["status"], string> = {
  idle: "bg-val-muted text-val-subtle",
  running: "bg-green-400/15 text-green-400 border border-green-400/30",
  paused: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30",
  error: "bg-red-400/15 text-red-400 border border-red-400/30",
};

const AGENT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "super-agent": { bg: "bg-val-primary/10", border: "border-val-primary/20", text: "text-val-primary" },
  "agent-positionnement": { bg: "bg-blue-400/10", border: "border-blue-400/20", text: "text-blue-400" },
  "agent-attraction": { bg: "bg-emerald-400/10", border: "border-emerald-400/20", text: "text-emerald-400" },
  "agent-education": { bg: "bg-violet-400/10", border: "border-violet-400/20", text: "text-violet-400" },
  "agent-conversion": { bg: "bg-orange-400/10", border: "border-orange-400/20", text: "text-orange-400" },
  "agent-scale": { bg: "bg-cyan-400/10", border: "border-cyan-400/20", text: "text-cyan-400" },
};

const CORE_IDS = ["super-agent", "agent-positionnement", "agent-attraction", "agent-education", "agent-conversion", "agent-scale"];

function AgentCard({ agent }: { agent: Agent }) {
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const removeAgent = useAgentStore((s) => s.removeAgent);
  const colors = AGENT_COLORS[agent.id] ?? { bg: "bg-val-muted", border: "border-val-border", text: "text-val-subtle" };

  return (
    <div className="val-card p-5 space-y-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx("p-2.5 rounded-xl border", colors.bg, colors.border, colors.text)}>
            <Bot size={18} />
          </div>
          <div>
            <p className="font-semibold text-val-text text-sm leading-tight">{agent.name}</p>
            <span className="text-xs text-val-subtle capitalize">{agent.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_COLORS[agent.status])}>
            {agent.status}
          </span>
          {!CORE_IDS.includes(agent.id) && (
            <button onClick={() => removeAgent(agent.id)} className="text-val-subtle hover:text-val-primary transition-colors p-1">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-val-subtle leading-relaxed">{agent.description}</p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-mono text-val-subtle/60 bg-val-muted px-2 py-0.5 rounded">{agent.model}</span>
        {agent.id === "agent-positionnement" ? (

          href = "/dashboard/positionnement-unique"
    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all bg-val-primary/15 text-val-primary hover:bg-val-primary/25"
  >
        <Play size={12} /> Ouvrir
      </a>
      ) : (
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
)}
    </div>
    </div >
  );
}

// ─── New Agent Modal ─────────────────────────────────────────────────────────

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

// ─── Super Agent Chat ────────────────────────────────────────────────────────

function SuperAgentChat() {
  const { messages, addMessage, updateMessage, clearMessages } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userContent = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    addMessage({
      id: `m${Date.now()}`,
      role: "user",
      content: userContent,
      timestamp: new Date().toISOString(),
    });

    // Add empty assistant message to stream into
    const assistantId = `m${Date.now() + 1}`;
    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    });

    try {
      // Build conversation history for the API (user + assistant only, non-empty)
      const history = messages
        .filter((m) => (m.role === "user" || m.role === "assistant") && m.content.trim())
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      history.push({ role: "user", content: userContent });

      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Erreur API" }));
        updateMessage(assistantId, `Erreur : ${err.error ?? "Réponse invalide"}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        const lines = raw.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) {
              accumulated = `Erreur : ${parsed.error}`;
              updateMessage(assistantId, accumulated);
              break;
            }
            if (parsed.text) {
              accumulated += parsed.text;
              updateMessage(assistantId, accumulated);
            }
          } catch {
            // incomplete JSON chunk, skip
          }
        }
      }
    } catch {
      updateMessage(assistantId, "Erreur réseau. Vérifie que le serveur tourne et que ANTHROPIC_API_KEY est défini dans .env.local.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="val-card flex flex-col" style={{ height: "480px" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-val-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-val-primary/10 border border-val-primary/20 flex items-center justify-center">
              <Bot size={16} className="text-val-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-val-surface" />
          </div>
          <div>
            <p className="text-sm font-semibold text-val-text leading-none">Super Agent #Val</p>
            <p className="text-xs text-val-subtle mt-0.5">COO · claude-sonnet-4-6</p>
          </div>
        </div>
        <button
          onClick={clearMessages}
          title="Effacer la conversation"
          className="text-val-subtle hover:text-val-primary transition-colors p-1.5 rounded-lg hover:bg-val-primary/10"
        >
          <Trash size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-val-primary/10 border border-val-primary/20 flex items-center justify-center">
              <Bot size={22} className="text-val-primary" />
            </div>
            <div>
              <p className="text-val-text font-medium text-sm">Super Agent #Val</p>
              <p className="text-val-subtle/60 text-xs mt-1">Donne-moi une instruction et je délègue au bon agent.</p>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={clsx("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-val-primary/10 border border-val-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-val-primary" />
              </div>
            )}
            <div className={clsx(
              "max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap",
              m.role === "user"
                ? "bg-val-primary/15 text-val-text border border-val-primary/25"
                : "bg-val-muted text-val-text border border-val-border"
            )}>
              {m.role === "assistant" && m.content === "" && loading ? (
                <span className="flex items-center gap-2 text-val-subtle">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="text-xs">En train de réfléchir...</span>
                </span>
              ) : m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex gap-2 p-3 border-t border-val-border shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Donne une instruction au Super Agent #Val..."
          disabled={loading}
          className="flex-1 bg-val-muted border border-val-border rounded-lg px-3 py-2 text-sm text-val-text placeholder-val-subtle/40 focus:outline-none focus:border-val-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-val-primary hover:bg-val-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all val-glow-sm"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const agents = useAgentStore((s) => s.agents);
  const [showModal, setShowModal] = useState(false);

  const coreAgents = agents.filter((a) => CORE_IDS.includes(a.id));
  const customAgents = agents.filter((a) => !CORE_IDS.includes(a.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-val-text">Agents IA</h2>
          <p className="text-val-subtle text-sm">{agents.length} agent{agents.length > 1 ? "s" : ""} configuré{agents.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-val-primary hover:bg-val-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all val-glow-sm"
        >
          <Plus size={16} /> Nouvel agent
        </button>
      </div>

      {/* Super Agent Chat */}
      <SuperAgentChat />

      {/* Core agents */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-val-subtle/50 mb-3">Équipe #Val</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coreAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      </div>

      {/* Custom agents */}
      {customAgents.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-val-subtle/50 mb-3">Agents personnalisés</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </div>
      )}

      {showModal && <NewAgentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
