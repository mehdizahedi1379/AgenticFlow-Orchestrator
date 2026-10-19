/**
 * Pure Agent Orchestrator Logic with Windows OS Security Guardrails
 * and EDA/CAD Engineering Interoperability (Altium, Proteus, etc.)
 * Decoupled from UI and network for fast, deterministic unit testing.
 */

import type {
  AgentTask,
  AgentThought,
  ToolCall,
  AgentArtifact,
  WindowsGuardrails,
} from '../types/agent.ts';

/**
 * Extracts and sanitizes JSON from LLM markdown code blocks or raw strings.
 */
export function extractJsonFromResponse(raw: string): any {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty response received');
  }

  const trimmed = raw.trim();

  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Proceed to regex extraction
  }

  // Check for ```json ... ``` blocks
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = jsonBlockRegex.exec(trimmed);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch {
      // Continue searching
    }
  }

  // Look for first '{' or '[' and last '}' or ']'
  const firstBrace = trimmed.indexOf('{');
  const firstBracket = trimmed.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = trimmed.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = trimmed.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx > startIdx) {
    const candidate = trimmed.substring(startIdx, endIdx + 1);
    try {
      return JSON.parse(candidate);
    } catch (err: any) {
      throw new Error(`Failed to parse extracted JSON candidate: ${err.message}`);
    }
  }

  throw new Error('No valid JSON structure found in output');
}

/**
 * Validates and normalizes decomposed tasks from LLM or template generator.
 */
export function normalizeDecomposedTasks(rawTasks: any[]): AgentTask[] {
  if (!Array.isArray(rawTasks) || rawTasks.length === 0) {
    throw new Error('Task list must be a non-empty array');
  }

  return rawTasks.map((t, index) => {
    const id = t.id ? String(t.id) : `task-${index + 1}`;
    const title =
      typeof t.title === 'string' && t.title.trim().length > 0
        ? t.title.trim()
        : `Subtask ${index + 1}`;
    const description =
      typeof t.description === 'string' ? t.description.trim() : '';
    const toolRequired =
      typeof t.toolRequired === 'string' && t.toolRequired.trim().length > 0
        ? t.toolRequired.trim()
        : undefined;

    const dependencies = Array.isArray(t.dependencies)
      ? t.dependencies.map(String).filter((dep: string) => dep !== id)
      : [];

    return {
      id,
      title,
      description,
      status: 'pending' as const,
      toolRequired,
      dependencies,
      retryCount: 0,
      maxRetries: 3,
    };
  });
}

/**
 * Resolves the next executable task based on dependency topology and current status.
 */
export function resolveNextRunnableTask(tasks: AgentTask[]): AgentTask | null {
  const completedIds = new Set(
    tasks.filter((t) => t.status === 'completed').map((t) => t.id)
  );

  for (const task of tasks) {
    if (task.status === 'completed' || task.status === 'skipped') {
      continue;
    }

    if (task.status === 'running' || task.status === 'reflecting') {
      return task;
    }

    if (
      task.status === 'pending' ||
      (task.status === 'failed' && task.retryCount < task.maxRetries)
    ) {
      const allDepsMet = task.dependencies.every((depId) => completedIds.has(depId));
      if (allDepsMet) {
        return task;
      }
    }
  }

  return null;
}

/**
 * Pure state updater for tasks.
 */
export function updateTaskState(
  tasks: AgentTask[],
  taskId: string,
  patch: Partial<AgentTask>
): AgentTask[] {
  return tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, ...patch };
    }
    return task;
  });
}

/**
 * Validates tool parameters against required keys and type expectations.
 */
export function validateToolParameters(
  toolName: string,
  params: Record<string, any>
): { valid: boolean; error?: string } {
  if (!params || typeof params !== 'object') {
    return { valid: false, error: 'Parameters must be an object' };
  }

  switch (toolName) {
    case 'powershell_exec':
    case 'cmd_exec':
    case 'bash_exec':
      if (!params.command || typeof params.command !== 'string') {
        return { valid: false, error: `Missing required parameter 'command' for ${toolName}` };
      }
      return { valid: true };

    case 'win_fs_write':
    case 'fs_write':
      if (!params.path || typeof params.path !== 'string') {
        return { valid: false, error: `Missing required parameter 'path' for ${toolName}` };
      }
      if (params.content === undefined || params.content === null) {
        return { valid: false, error: `Missing required parameter 'content' for ${toolName}` };
      }
      return { valid: true };

    case 'win_fs_read':
    case 'fs_read':
      if (!params.path || typeof params.path !== 'string') {
        return { valid: false, error: `Missing required parameter 'path' for ${toolName}` };
      }
      return { valid: true };

    case 'eda_altium_bridge':
      if (!params.action || typeof params.action !== 'string') {
        return { valid: false, error: "Missing required parameter 'action' for eda_altium_bridge" };
      }
      if (!params.projectName || typeof params.projectName !== 'string') {
        return { valid: false, error: "Missing required parameter 'projectName' for eda_altium_bridge" };
      }
      return { valid: true };

    case 'eda_proteus_bridge':
      if (!params.action || typeof params.action !== 'string') {
        return { valid: false, error: "Missing required parameter 'action' for eda_proteus_bridge" };
      }
      if (!params.projectName || typeof params.projectName !== 'string') {
        return { valid: false, error: "Missing required parameter 'projectName' for eda_proteus_bridge" };
      }
      return { valid: true };

    case 'win_software_interop':
      if (!params.targetApp || typeof params.targetApp !== 'string') {
        return { valid: false, error: "Missing required parameter 'targetApp' for win_software_interop" };
      }
      if (!params.interopMode || typeof params.interopMode !== 'string') {
        return { valid: false, error: "Missing required parameter 'interopMode' for win_software_interop" };
      }
      return { valid: true };

    case 'code_runner':
      if (!params.code || typeof params.code !== 'string') {
        return { valid: false, error: "Missing required parameter 'code' for code_runner" };
      }
      return { valid: true };

    case 'win_process_inspect':
    case 'sys_env_inspect':
    case 'fs_list':
    case 'data_parser':
      return { valid: true };

    default:
      return { valid: true };
  }
}

/**
 * Windows Guardrail Security Check:
 * Enforces human-in-the-loop safety for potentially dangerous OS operations,
 * path traversals, destructive disk operations, and UAC elevation requests.
 */
export function checkWindowsGuardrails(
  toolName: string,
  params: Record<string, any>,
  guardrails: WindowsGuardrails
): { needsApproval: boolean; reason?: string } {
  if (!guardrails.enabled) {
    return { needsApproval: false };
  }

  // 1. Check for UAC Elevation Requests FIRST
  if (params.elevationRequired || params.requiresElevation) {
    return {
      needsApproval: true,
      reason: `Action requested UAC Administrator Elevation. NexusAgent runs in Standard User mode for Windows safety.`,
    };
  }

  // 2. Check for dangerous destructive commands or remote pipes in Shell/CMD/PowerShell
  if (
    toolName === 'powershell_exec' ||
    toolName === 'cmd_exec' ||
    toolName === 'bash_exec' ||
    toolName === 'win_software_interop'
  ) {
    const cmd = ((params.command || params.payloadScript || '') as string).toLowerCase();

    // Destructive disk / system commands
    const destructivePatterns = [
      'format',
      'del /f /s c:\\',
      'del /s /f c:\\',
      'rmdir /s /q c:\\',
      'remove-item -recurse c:\\',
      'reg delete',
      'vssadmin delete',
      'cipher /w',
      'diskpart',
      'takeown /f',
      'taskkill /f /im explorer.exe',
      'net user',
      'set-executionpolicy unrestricted',
      'set-executionpolicy bypass',
    ];

    for (const pattern of destructivePatterns) {
      if (cmd.includes(pattern)) {
        return {
          needsApproval: true,
          reason: `High-risk destructive Windows command detected: "${pattern}". Explicit administrator approval required.`,
        };
      }
    }

    // Remote script download & memory injection pipes
    if (guardrails.blockRemotePipes) {
      const remotePipePatterns = [
        'iex (new-object',
        'downloadstring',
        'curl | powershell',
        'invoke-webrequest | iex',
        'certutil -urlcache',
        'bitsadmin /transfer',
      ];
      for (const pattern of remotePipePatterns) {
        if (cmd.includes(pattern)) {
          return {
            needsApproval: true,
            reason: `Remote script download or piping detected: "${pattern}". Blocked by Windows Security Guardrail policy.`,
          };
        }
      }
    }

    // General Shell Approval if configured
    if (guardrails.requireApprovalForShell) {
      return {
        needsApproval: true,
        reason: `Terminal execution requires explicit user authorization: "${params.command || params.payloadScript}"`,
      };
    }
  }

  // 3. File System Protection (Windows System32, Program Files, Registry)
  if (
    guardrails.requireApprovalForFileWrite &&
    (toolName === 'win_fs_write' || toolName === 'fs_write')
  ) {
    const filePath = (params.path || '').toLowerCase();
    const isProtected = guardrails.protectedPaths.some((p) =>
      filePath.includes(p.toLowerCase())
    );

    if (isProtected) {
      return {
        needsApproval: true,
        reason: `Target file "${params.path}" resides within protected Windows directory system (${guardrails.protectedPaths.join(', ')}).`,
      };
    }
  }

  return { needsApproval: false };
}


/**
 * Evaluates execution reflection:
 * Checks whether the step produced satisfactory results or needs retry / plan adaptation.
 */
export function evaluateAgentReflection(
  lastToolSuccess: boolean,
  outputMessage: string,
  currentRetryCount: number,
  maxRetries: number = 3
): {
  success: boolean;
  nextStatus: 'completed' | 'failed' | 'running';
  reflectionSummary: string;
} {
  if (lastToolSuccess) {
    return {
      success: true,
      nextStatus: 'completed',
      reflectionSummary: `Step verified successfully on Windows harness. Execution output satisfies criteria.`,
    };
  }

  if (currentRetryCount + 1 >= maxRetries) {
    return {
      success: false,
      nextStatus: 'failed',
      reflectionSummary: `Step failed after reaching maximum retries (${maxRetries}). Error: ${outputMessage || 'Unknown fault'}`,
    };
  }

  return {
    success: false,
    nextStatus: 'running',
    reflectionSummary: `Error observed: "${outputMessage}". Adjusting parameters and retrying (${currentRetryCount + 1}/${maxRetries}).`,
  };
}

/**
 * Automatically creates or updates virtual artifacts when files are written or scripts created.
 */
export function extractArtifactsFromToolCall(
  toolCall: ToolCall,
  existingArtifacts: AgentArtifact[]
): AgentArtifact[] {
  const artifacts = [...existingArtifacts];

  if (
    (toolCall.toolName === 'win_fs_write' ||
      toolCall.toolName === 'fs_write' ||
      toolCall.toolName === 'eda_altium_bridge' ||
      toolCall.toolName === 'eda_proteus_bridge') &&
    toolCall.status === 'success'
  ) {
    let filePath = toolCall.parameters?.path;
    let content = toolCall.parameters?.content;

    // Handle Altium / Proteus tool outputs
    if (toolCall.toolName === 'eda_altium_bridge') {
      filePath = toolCall.output?.scriptPath || toolCall.output?.bomPath || toolCall.output?.netlistPath;
      content = toolCall.output?.preview || JSON.stringify(toolCall.output, null, 2);
    } else if (toolCall.toolName === 'eda_proteus_bridge') {
      filePath = toolCall.output?.destination || toolCall.output?.simulationScript;
      content = JSON.stringify(toolCall.output, null, 2);
    }

    if (!filePath || !content) return artifacts;

    const filename = filePath.replace(/\\/g, '/').split('/').pop() || 'file.txt';
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    let type: AgentArtifact['type'] = 'code';
    let language = 'typescript';

    if (ext === 'pas') {
      type = 'eda_script';
      language = 'delphi';
    } else if (ext === 'dscript') {
      type = 'eda_script';
      language = 'c';
    } else if (ext === 'net') {
      type = 'netlist';
      language = 'plaintext';
    } else if (ext === 'csv') {
      type = 'bom';
      language = 'csv';
    } else if (ext === 'ps1') {
      type = 'powershell';
      language = 'powershell';
    } else if (['bat', 'cmd'].includes(ext)) {
      type = 'batch';
      language = 'batch';
    } else if (['md', 'markdown'].includes(ext)) {
      type = 'markdown';
      language = 'markdown';
    } else if (['json', 'yaml', 'yml'].includes(ext)) {
      type = 'json';
      language = ext;
    } else if (['py'].includes(ext)) {
      type = 'code';
      language = 'python';
    } else if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
      type = 'code';
      language = ext.includes('ts') ? 'typescript' : 'javascript';
    }

    const stringContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const existingIndex = artifacts.findIndex((a) => a.path === filePath);

    const artifactEntry: AgentArtifact = {
      id:
        existingIndex >= 0
          ? artifacts[existingIndex].id
          : `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      filename,
      path: filePath,
      type,
      language,
      content: stringContent,
      size: stringContent.length,
      createdAt:
        existingIndex >= 0
          ? artifacts[existingIndex].createdAt
          : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      artifacts[existingIndex] = artifactEntry;
    } else {
      artifacts.push(artifactEntry);
    }
  }

  return artifacts;
}
