"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Agent, KanbanCard, VaultEntry, SuperAgentMessage } from "@/types";

// ─── Agents ────────────────────────────────────────────────────────────────

interface AgentStore {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set) => ({
      agents: [
        {
          id: "super-agent",
          name: "Super Agent Val",
          description: "Coordinateur principal — reçoit les instructions et orchestre les agents.",
          status: "idle",
          type: "coordinator",
          model: "claude-sonnet-4-6",
          tasksCompleted: 0,
        },
      ],
      addAgent: (agent) => set((s) => ({ agents: [...s.agents, agent] })),
      updateAgent: (id, patch) =>
        set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      removeAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
    }),
    { name: "val-agents" }
  )
);

// ─── Kanban ────────────────────────────────────────────────────────────────

interface KanbanStore {
  cards: KanbanCard[];
  addCard: (card: KanbanCard) => void;
  updateCard: (id: string, patch: Partial<KanbanCard>) => void;
  moveCard: (id: string, status: KanbanCard["status"]) => void;
  removeCard: (id: string) => void;
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set) => ({
      cards: [
        { id: "c1", title: "Configurer les agents IA", status: "todo", priority: "high", createdAt: new Date().toISOString(), tags: ["setup"] },
        { id: "c2", title: "Définir les prompts système", status: "in_progress", priority: "critical", createdAt: new Date().toISOString(), tags: ["prompts"] },
        { id: "c3", title: "Connecter Anthropic API", status: "backlog", priority: "medium", createdAt: new Date().toISOString() },
      ],
      addCard: (card) => set((s) => ({ cards: [...s.cards, card] })),
      updateCard: (id, patch) =>
        set((s) => ({ cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      moveCard: (id, status) =>
        set((s) => ({ cards: s.cards.map((c) => (c.id === id ? { ...c, status } : c)) })),
      removeCard: (id) => set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),
    }),
    { name: "val-kanban" }
  )
);

// ─── Vault ─────────────────────────────────────────────────────────────────

interface VaultStore {
  entries: VaultEntry[];
  addEntry: (entry: VaultEntry) => void;
  updateEntry: (id: string, patch: Partial<VaultEntry>) => void;
  removeEntry: (id: string) => void;
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set) => ({
      entries: [
        { id: "v1", key: "SYSTEM_PROMPT", value: "Tu es Val, un assistant IA avancé.", category: "prompt", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "v2", key: "USER_CONTEXT", value: "Projet: Val AI OS — dashboard de gestion d'agents.", category: "context", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
      updateEntry: (id, patch) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e)) })),
      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    { name: "val-vault" }
  )
);

// ─── Super Agent Messages ──────────────────────────────────────────────────

interface ChatStore {
  messages: SuperAgentMessage[];
  addMessage: (msg: SuperAgentMessage) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: "val-chat" }
  )
);
