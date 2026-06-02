"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Agent, KanbanCard, VaultEntry, SuperAgentMessage } from "@/types";

// ─── Default agents ────────────────────────────────────────────────────────

const DEFAULT_AGENTS: Agent[] = [
  {
    id: "super-agent",
    name: "Super Agent #Val",
    description: "COO — Coordinateur principal. Reçoit les instructions, analyse et délègue aux 5 agents chefs.",
    status: "idle",
    type: "coordinator",
    model: "claude-sonnet-4-6",
    tasksCompleted: 0,
    instructions: "Coordonner et déléguer aux agents chefs selon les instructions reçues.",
  },
  {
    {
  id: "meta-agent",
  name: "Meta-Agent Val",
  description: "L'architecte de Val AI OS. Conçoit l'architecture complète de tout agent en 7 étapes — COO, Directeur ou Employé IA.",
  status: "idle",
  type: "coordinator",
  model: "claude-sonnet-4-6",
  tasksCompleted: 0,
  instructions: "Identifier le type d'agent, définir le workflow, produire les System Prompts.",
},
    id: "agent-positionnement",
    name: "Agent Positionnement Unique",
    description: "Définit le positionnement stratégique, la proposition de valeur unique et la différenciation marché.",
    status: "idle",
    type: "specialist",
    model: "claude-sonnet-4-6",
    tasksCompleted: 0,
    instructions: "Analyser et affiner le positionnement, le message central et la différenciation.",
  },
  {
    id: "agent-attraction",
    name: "Agent Attraction",
    description: "Stratégies d'acquisition, croissance d'audience, SEO, contenu organique et publicité payante.",
    status: "idle",
    type: "specialist",
    model: "claude-sonnet-4-6",
    tasksCompleted: 0,
    instructions: "Générer des stratégies d'attraction et de génération de leads.",
  },
  {
    id: "agent-education",
    name: "Agent Education",
    description: "Contenu pédagogique, nurturing, onboarding, formation et engagement de l'audience.",
    status: "idle",
    type: "specialist",
    model: "claude-sonnet-4-6",
    tasksCompleted: 0,
    instructions: "Créer et structurer le contenu éducatif pour nourrir l'audience.",
  },
  {
    id: "agent-conversion",
    name: "Agent Conversion",
    description: "Tunnels de vente, copywriting, offres, sales pages, closing et taux de conversion.",
    status: "idle",
    type: "specialist",
    model: "claude-sonnet-4-6",
    tasksCompleted: 0,
    instructions: "Optimiser les parcours de conversion et le copywriting.",
  },
  {
    id: "agent-scale",
    name: "Agent Scale",
    description: "Systémisation, automatisation, délégation et scalabilité des processus et revenus.",
    status: "idle",
    type: "specialist",
    model: "claude-sonnet-4-6",
    tasksCompleted: 0,
    instructions: "Identifier et mettre en place les systèmes de scale.",
  },
];

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
      agents: DEFAULT_AGENTS,
      addAgent: (agent) => set((s) => ({ agents: [...s.agents, agent] })),
      updateAgent: (id, patch) =>
        set((s) => ({ agents: s.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      removeAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
    }),
    {
      name: "val-agents-v2", // bumped version resets to new defaults
    }
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
        { id: "c1", title: "Configurer les 5 agents chefs", status: "todo", priority: "high", createdAt: new Date().toISOString(), tags: ["setup"] },
        { id: "c2", title: "Définir le positionnement unique", status: "in_progress", priority: "critical", createdAt: new Date().toISOString(), tags: ["positionnement"] },
        { id: "c3", title: "Créer la stratégie d'attraction", status: "backlog", priority: "high", createdAt: new Date().toISOString(), tags: ["attraction"] },
        { id: "c4", title: "Construire le tunnel de conversion", status: "backlog", priority: "medium", createdAt: new Date().toISOString(), tags: ["conversion"] },
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
        { id: "v1", key: "SUPER_AGENT_ROLE", value: "COO — Coordinateur des 5 agents chefs.", category: "prompt", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "v2", key: "PROJECT_CONTEXT", value: "Val AI OS — Dashboard de gestion d'agents IA. 5 agents chefs : Positionnement, Attraction, Education, Conversion, Scale.", category: "context", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
      updateEntry: (id, patch) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e)) })),
      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    { name: "val-vault" }
  )
);

// ─── Chat (Super Agent) ────────────────────────────────────────────────────

interface ChatStore {
  messages: SuperAgentMessage[];
  addMessage: (msg: SuperAgentMessage) => void;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      updateMessage: (id, content) =>
        set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, content } : m)) })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: "val-chat" }
  )
);
