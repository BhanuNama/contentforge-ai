import { create } from "zustand";
import type { Platform } from "../utils";

export type AgentStep = {
  id: string;
  name: string;
  status: "pending" | "running" | "done" | "failed";
  description: string;
  startedAt?: number;
  completedAt?: number;
};

export type ForgeResult = {
  id: string;
  job_id: string;
  platform: string;
  content: string;
  hook_variants: string[] | null;
  critic_score: number | null;
  critic_feedback: Record<string, unknown> | null;
  created_at: string;
};

export type JobStatus = "idle" | "pending" | "running" | "done" | "failed";

interface ForgeStore {
  // Input
  inputContent: string;
  selectedPlatforms: Platform[];
  sourceUrl: string;

  // Job state
  jobId: string | null;
  jobStatus: JobStatus;
  jobError: string | null;

  // Agent pipeline steps
  agentSteps: AgentStep[];

  // Results
  results: ForgeResult[];
  editedContent: Record<string, string>;

  // Actions
  setInputContent: (content: string) => void;
  setSelectedPlatforms: (platforms: Platform[]) => void;
  setSourceUrl: (url: string) => void;
  togglePlatform: (platform: Platform) => void;
  setJobId: (id: string) => void;
  setJobStatus: (status: JobStatus) => void;
  setJobError: (error: string | null) => void;
  setAgentSteps: (steps: AgentStep[]) => void;
  updateAgentStep: (id: string, updates: Partial<AgentStep>) => void;
  setResults: (results: ForgeResult[]) => void;
  setEditedContent: (platform: string, content: string) => void;
  reset: () => void;
}

const INITIAL_AGENT_STEPS: AgentStep[] = [
  { id: "orchestrator", name: "Orchestrator", status: "pending", description: "Planning execution strategy..." },
  { id: "analyst", name: "Content Analyst", status: "pending", description: "Extracting core ideas and hooks..." },
  { id: "platforms", name: "Platform Specialists", status: "pending", description: "Running 8 specialist agents in parallel..." },
  { id: "critic", name: "Quality Critic", status: "pending", description: "Reviewing all outputs before delivery..." },
  { id: "voice", name: "Voice Agent", status: "pending", description: "Applying your brand voice..." },
];

export const useForgeStore = create<ForgeStore>((set) => ({
  inputContent: "",
  selectedPlatforms: ["twitter", "linkedin", "email"],
  sourceUrl: "",
  jobId: null,
  jobStatus: "idle",
  jobError: null,
  agentSteps: INITIAL_AGENT_STEPS,
  results: [],
  editedContent: {},

  setInputContent: (content) => set({ inputContent: content }),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setSourceUrl: (url) => set({ sourceUrl: url }),
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),
  setJobId: (id) => set({ jobId: id }),
  setJobStatus: (status) => set({ jobStatus: status }),
  setJobError: (error) => set({ jobError: error }),
  setAgentSteps: (steps) => set({ agentSteps: steps }),
  updateAgentStep: (id, updates) =>
    set((state) => ({
      agentSteps: state.agentSteps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    })),
  setResults: (results) => set({ results }),
  setEditedContent: (platform, content) =>
    set((state) => ({
      editedContent: { ...state.editedContent, [platform]: content },
    })),
  reset: () =>
    set({
      jobId: null,
      jobStatus: "idle",
      jobError: null,
      agentSteps: INITIAL_AGENT_STEPS,
      results: [],
      editedContent: {},
    }),
}));
