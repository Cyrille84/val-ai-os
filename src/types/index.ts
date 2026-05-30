export type AgentStatus = "idle" | "running" | "paused" | "error";

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  type: "coordinator" | "worker" | "specialist";
  model: string;
  lastRun?: string;
  tasksCompleted: number;
  instructions?: string;
}

export type KanbanStatus = "backlog" | "todo" | "in_progress" | "review" | "done";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status: KanbanStatus;
  assignedAgent?: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  tags?: string[];
}

export interface VaultEntry {
  id: string;
  key: string;
  value: string;
  category: "context" | "prompt" | "data" | "config";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAgentMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  agentId?: string;
}
