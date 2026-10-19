/**
 * NexusAgent Windows Harness Types & Interfaces
 * Engineered for Windows OS Security & CAD/EDA Interoperability (Altium, Proteus, etc.)
 */

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'reflecting';

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  toolRequired?: string;
  dependencies: string[];
  output?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface AgentThought {
  id: string;
  timestamp: string;
  step: number;
  subtaskId?: string;
  reasoning: string;
  plannedAction: string;
  critique?: string;
  confidence?: number;
}

export interface ToolCall {
  id: string;
  step: number;
  subtaskId?: string;
  toolName: string;
  parameters: Record<string, any>;
  output?: any;
  stderr?: string;
  durationMs: number;
  status: 'pending' | 'awaiting_approval' | 'executing' | 'success' | 'error';
  timestamp: string;
  requiresElevation?: boolean;
}

export type ArtifactType =
  | 'code'
  | 'markdown'
  | 'json'
  | 'log'
  | 'diff'
  | 'diagram'
  | 'powershell'
  | 'batch'
  | 'eda_script'
  | 'netlist'
  | 'bom';

export interface AgentArtifact {
  id: string;
  filename: string;
  path: string;
  type: ArtifactType;
  language: string;
  content: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentStats {
  totalTokens: number;
  runTimeMs: number;
  toolsExecuted: number;
  successfulSteps: number;
  failedSteps: number;
  commandsBlockedByGuardrail: number;
}

export interface WindowsGuardrails {
  enabled: boolean;
  requireApprovalForShell: boolean;
  requireApprovalForFileWrite: boolean;
  allowPowershellScripting: boolean;
  protectedPaths: string[];
  blockDestructiveCommands: boolean;
  blockRemotePipes: boolean;
  preventElevatedExecution: boolean;
  whitelistedEdaApps: string[];
}

export interface WindowsSystemStats {
  os: string;
  architecture: string;
  powershellVersion: string;
  workingDir: string;
  cpuUsagePercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  activeProcessesCount: number;
  uacIntegrityLevel: 'Low' | 'Medium' | 'High' | 'System';
  windowsDefenderSafe: boolean;
}

export interface OrchestratorSession {
  id: string;
  goal: string;
  model: string;
  mode: 'autonomous' | 'step_by_step' | 'dry_run';
  status: 'idle' | 'decomposing' | 'running' | 'paused' | 'awaiting_user_approval' | 'completed' | 'failed';
  tasks: AgentTask[];
  thoughts: AgentThought[];
  toolCalls: ToolCall[];
  artifacts: AgentArtifact[];
  currentStep: number;
  maxSteps: number;
  stats: AgentStats;
  virtualFiles: Record<string, string>;
  guardrails: WindowsGuardrails;
  systemStats: WindowsSystemStats;
  pendingApproval?: ToolCall | null;
}

export interface ToolDefinition {
  name: string;
  label: string;
  description: string;
  category: 'windows_os' | 'filesystem' | 'execution' | 'system' | 'eda_cad' | 'interop';
  parametersSchema: Record<string, { type: string; description: string; required?: boolean }>;
}
