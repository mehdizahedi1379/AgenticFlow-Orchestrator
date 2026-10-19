/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { WindowsTitleBar } from './components/WindowsTitleBar.tsx';
import { GoalConsole } from './components/GoalConsole.tsx';
import { TaskTree } from './components/TaskTree.tsx';
import { ThoughtStream } from './components/ThoughtStream.tsx';
import { HistorySidebar, type HistorySessionSummary } from './components/HistorySidebar.tsx';
import { ShowcaseLanding } from './components/ShowcaseLanding.tsx';
import { PythonInstallerHub } from './components/PythonInstallerHub.tsx';
import type {
  OrchestratorSession,
  AgentTask,
  AgentThought,
  ToolCall,
  WindowsGuardrails,
} from './types/agent.ts';
import {
  resolveNextRunnableTask,
  updateTaskState,
  evaluateAgentReflection,
  extractArtifactsFromToolCall,
  checkWindowsGuardrails,
} from './utils/agent-logic.ts';

const INITIAL_GUARDRAILS: WindowsGuardrails = {
  enabled: true,
  requireApprovalForShell: false,
  requireApprovalForFileWrite: false,
  allowPowershellScripting: true,
  protectedPaths: ['C:\\Windows', 'System32', 'Program Files', 'HKLM'],
  blockDestructiveCommands: true,
  blockRemotePipes: true,
  preventElevatedExecution: true,
  whitelistedEdaApps: ['Altium Designer', 'Proteus 8 Professional', 'KiCad', 'AutoCAD'],
};

const STORAGE_KEY = 'nexus_agent_history_v2_en';

// Seed demo sessions showcasing both EDA (Altium/Proteus) and Windows System Administration
const DEMO_SESSIONS: HistorySessionSummary[] = [
  {
    id: 'sess-demo-eda',
    goal: 'Bridge Altium Designer project to Proteus VSM for STM32 microcontroller simulation',
    createdAt: 'Today, 10:15 AM',
    status: 'completed',
    taskCount: 4,
    completedTasks: 4,
    sessionData: {
      id: 'sess-demo-eda',
      goal: 'Bridge Altium Designer project to Proteus VSM for STM32 microcontroller simulation',
      model: 'gemini-3.8-flash',
      mode: 'autonomous',
      status: 'completed',
      tasks: [
        {
          id: 'task-1',
          title: 'Extract Altium Project Netlist & Generate DelphiScript BOM Exporter',
          description: 'Access Altium DXP Client API, parse MainBoard_RevB.PrjPcb hierarchy, and export component parameters to CSV.',
          status: 'completed',
          toolRequired: 'eda_altium_bridge',
          dependencies: [],
          retryCount: 0,
          maxRetries: 2,
          output: 'Altium DelphiScript generated at C:\\NexusAgent\\Workspace\\Altium_Scripts\\MainBoard_DRC_BOM.pas. Telesis Netlist exported.',
        },
        {
          id: 'task-2',
          title: 'Perform Automated PCB Design Rule Check (DRC)',
          description: 'Run clearance and trace width audits with 0.15mm tolerance.',
          status: 'completed',
          toolRequired: 'eda_altium_bridge',
          dependencies: ['task-1'],
          retryCount: 0,
          maxRetries: 2,
          output: 'DRC Passed with 0 clearance violations, 0 short circuits, and 1 minor silkscreen note.',
        },
        {
          id: 'task-3',
          title: 'Convert Altium Netlist into Proteus ISIS Schematic Format',
          description: 'Translate component pin connectivity into Proteus SPICE-compatible netlist.',
          status: 'completed',
          toolRequired: 'eda_proteus_bridge',
          dependencies: ['task-2'],
          retryCount: 0,
          maxRetries: 2,
          output: 'Netlist converted to C:\\NexusAgent\\Workspace\\Proteus_Models\\Proteus_Circuit_ISIS.NET with STM32 pinouts verified.',
        },
        {
          id: 'task-4',
          title: 'Execute Proteus VSM Microcontroller Batch Simulation',
          description: 'Automate Proteus DScript runner, attach firmware, and verify 8MHz clock & bus logic.',
          status: 'completed',
          toolRequired: 'eda_proteus_bridge',
          dependencies: ['task-3'],
          retryCount: 0,
          maxRetries: 2,
          output: 'Simulation PASSED. 500,000 cycles executed with 0 bus contention errors. UART output: "BOOT OK: Clock 8MHz PLL Locked".',
        },
      ],
      thoughts: [
        {
          id: 'th-demo-1',
          timestamp: new Date().toISOString(),
          step: 1,
          reasoning: 'Need to inspect the Altium project file structure and generate an automation script to extract the netlist and BOM without manual UI intervention.',
          plannedAction: 'Invoke eda_altium_bridge to produce DelphiScript automation file.',
          critique: 'DelphiScript exported cleanly; netlist is ready for translation.',
          confidence: 97,
        },
        {
          id: 'th-demo-2',
          timestamp: new Date().toISOString(),
          step: 2,
          reasoning: 'Translating Altium Telesis netlist pins to Proteus ISIS SPICE subcircuit representation for STM32 microcontroller.',
          plannedAction: 'Invoke eda_proteus_bridge with convert_netlist_for_proteus action.',
          critique: 'Pin definitions matched target Proteus MCU model.',
          confidence: 98,
        },
      ],
      toolCalls: [
        {
          id: 'tc-demo-1',
          step: 1,
          toolName: 'eda_altium_bridge',
          parameters: { action: 'generate_delphi_script', projectName: 'MainBoard_RevB.PrjPcb' },
          status: 'success',
          durationMs: 420,
          timestamp: new Date().toISOString(),
          output: {
            status: 'success',
            action: 'generate_delphi_script',
            scriptPath: 'C:\\NexusAgent\\Workspace\\Altium_Scripts\\MainBoard_DRC_BOM.pas',
            features: ['BOM CSV Exporter', 'Altium DM_FocusedProject Access', 'DRC Rule Verification Hook'],
          },
        },
        {
          id: 'tc-demo-2',
          step: 2,
          toolName: 'eda_proteus_bridge',
          parameters: { action: 'batch_simulate_mcu', projectName: 'Proteus_Circuit.DSN', mcuFamily: 'STM32' },
          status: 'success',
          durationMs: 680,
          timestamp: new Date().toISOString(),
          output: {
            status: 'success',
            simulationResults: {
              executionCycles: 500000,
              busContentionErrors: 0,
              powerRailVoltage: '3.31V (Nominal)',
            },
            verdict: 'Proteus VSM Simulation PASSED.',
          },
        },
      ],
      artifacts: [],
      currentStep: 4,
      maxSteps: 8,
      stats: {
        totalTokens: 1840,
        runTimeMs: 5120,
        toolsExecuted: 4,
        successfulSteps: 4,
        failedSteps: 0,
        commandsBlockedByGuardrail: 0,
      },
      virtualFiles: {},
      guardrails: INITIAL_GUARDRAILS,
      systemStats: {
        os: 'Windows 11 Pro 64-bit',
        architecture: 'x64',
        powershellVersion: '7.4.2 Core',
        workingDir: 'C:\\NexusAgent\\Workspace',
        cpuUsagePercent: 12.4,
        memoryUsedMb: 8200,
        memoryTotalMb: 32768,
        activeProcessesCount: 168,
        uacIntegrityLevel: 'Medium',
        windowsDefenderSafe: true,
      },
      pendingApproval: null,
    },
  },
  {
    id: 'sess-demo-diag',
    goal: 'Audit Windows processes, memory consumption, and disk space under Standard User security',
    createdAt: 'Today, 09:40 AM',
    status: 'completed',
    taskCount: 3,
    completedTasks: 3,
    sessionData: {
      id: 'sess-demo-diag',
      goal: 'Audit Windows processes, memory consumption, and disk space under Standard User security',
      model: 'gemini-3.8-flash',
      mode: 'autonomous',
      status: 'completed',
      tasks: [
        {
          id: 'task-1',
          title: 'Inspect Running Windows Processes & Resource Usage',
          description: 'Run Get-Process to identify active processes and background engineering CAD instances.',
          status: 'completed',
          toolRequired: 'powershell_exec',
          dependencies: [],
          retryCount: 0,
          maxRetries: 2,
          output: 'CPU Usage: 12.4% | Altium (DXP.EXE: 1420MB), Proteus (ISIS.EXE: 890MB)',
        },
        {
          id: 'task-2',
          title: 'Audit Windows Security Guardrails & Directory Permissions',
          description: 'Verify Standard User token, protected System32 status, and workspace sandbox capacity.',
          status: 'completed',
          toolRequired: 'sys_env_inspect',
          dependencies: ['task-1'],
          retryCount: 0,
          maxRetries: 2,
          output: 'UAC Level: Medium (Standard User). Windows Defender Safe: Certified.',
        },
        {
          id: 'task-3',
          title: 'Generate System Health and Security Report',
          description: 'Save structured diagnostic summary to workspace.',
          status: 'completed',
          toolRequired: 'win_fs_write',
          dependencies: ['task-2'],
          retryCount: 0,
          maxRetries: 2,
          output: 'Report generated successfully at C:\\NexusAgent\\Workspace\\system_report.json',
        },
      ],
      thoughts: [
        {
          id: 'th-demo-diag-1',
          timestamp: new Date().toISOString(),
          step: 1,
          reasoning: 'Querying system telemetry without requiring administrative elevation to maintain full Windows security.',
          plannedAction: 'Invoke powershell_exec with safe read-only cmdlet.',
          critique: 'Process table retrieved successfully.',
          confidence: 96,
        },
      ],
      toolCalls: [
        {
          id: 'tc-demo-diag-1',
          step: 1,
          toolName: 'powershell_exec',
          parameters: { command: 'Get-Process | Select-Object -First 5' },
          status: 'success',
          durationMs: 280,
          timestamp: new Date().toISOString(),
          output: { stdout: 'Handles NPM PM WS CPU(s) Id ProcessName\n720 36 84200 142000 4.12 3820 DXP.EXE' },
        },
      ],
      artifacts: [],
      currentStep: 3,
      maxSteps: 8,
      stats: {
        totalTokens: 1120,
        runTimeMs: 3800,
        toolsExecuted: 3,
        successfulSteps: 3,
        failedSteps: 0,
        commandsBlockedByGuardrail: 0,
      },
      virtualFiles: {},
      guardrails: INITIAL_GUARDRAILS,
      systemStats: {
        os: 'Windows 11 Pro 64-bit',
        architecture: 'x64',
        powershellVersion: '7.4.2 Core',
        workingDir: 'C:\\NexusAgent\\Workspace',
        cpuUsagePercent: 12.4,
        memoryUsedMb: 8200,
        memoryTotalMb: 32768,
        activeProcessesCount: 168,
        uacIntegrityLevel: 'Medium',
        windowsDefenderSafe: true,
      },
      pendingApproval: null,
    },
  },
];

export default function App() {
  const [session, setSession] = useState<OrchestratorSession>({
    id: `sess-${Date.now()}`,
    goal: '',
    model: 'gemini-3.8-flash',
    mode: 'autonomous',
    status: 'idle',
    tasks: [],
    thoughts: [],
    toolCalls: [],
    artifacts: [],
    currentStep: 0,
    maxSteps: 8,
    stats: {
      totalTokens: 0,
      runTimeMs: 0,
      toolsExecuted: 0,
      successfulSteps: 0,
      failedSteps: 0,
      commandsBlockedByGuardrail: 0,
    },
    virtualFiles: {},
    guardrails: INITIAL_GUARDRAILS,
    systemStats: {
      os: 'Windows 11 Pro 64-bit',
      architecture: 'x64',
      powershellVersion: '7.4.2 Core',
      workingDir: 'C:\\NexusAgent\\Workspace',
      cpuUsagePercent: 12.4,
      memoryUsedMb: 8420,
      memoryTotalMb: 32768,
      activeProcessesCount: 168,
      uacIntegrityLevel: 'Medium',
      windowsDefenderSafe: true,
    },
    pendingApproval: null,
  });

  const [geminiConnected, setGeminiConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'app' | 'website' | 'python-installer'>('app');

  const handleDownloadExe = () => {
    const link = document.createElement('a');
    link.href = '/api/download/NexusAgent-Windows-v2.4.0.zip';
    link.setAttribute('download', 'NexusAgent-Windows-v2.4.0.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load history from localStorage
  const [historySessions, setHistorySessions] = useState<HistorySessionSummary[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage:', e);
    }
    return DEMO_SESSIONS;
  });

  const executionRef = useRef<{ isRunning: boolean; isPaused: boolean }>({
    isRunning: false,
    isPaused: false,
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historySessions));
    } catch (e) {
      console.warn('Failed to save history to localStorage:', e);
    }
  }, [historySessions]);

  // Check API health on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.geminiConfigured) {
          setGeminiConnected(true);
        }
      })
      .catch(() => {
        // Fallback local engine active
      });
  }, []);

  // Update current session in history list helper
  const upsertSessionInHistory = (currentSess: OrchestratorSession) => {
    if (!currentSess.goal) return;

    setHistorySessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === currentSess.id);
      const summary: HistorySessionSummary = {
        id: currentSess.id,
        goal: currentSess.goal,
        createdAt:
          existingIndex >= 0
            ? prev[existingIndex].createdAt
            : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: currentSess.status,
        taskCount: currentSess.tasks.length,
        completedTasks: currentSess.tasks.filter((t) => t.status === 'completed').length,
        sessionData: currentSess,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = summary;
        return updated;
      }
      return [summary, ...prev];
    });
  };

  // Handle Launching a New Mission / Goal from Chat Box
  const handleStartMission = async (
    goal: string,
    mode: 'autonomous' | 'step_by_step' = 'autonomous',
    maxSteps: number = 8
  ) => {
    executionRef.current.isRunning = true;
    executionRef.current.isPaused = false;

    const newSessionId = `sess-${Date.now()}`;
    const newSessionState: OrchestratorSession = {
      ...session,
      id: newSessionId,
      goal,
      mode,
      maxSteps,
      status: 'decomposing',
      tasks: [],
      thoughts: [],
      toolCalls: [],
      currentStep: 0,
      pendingApproval: null,
      stats: {
        totalTokens: 0,
        runTimeMs: 0,
        toolsExecuted: 0,
        successfulSteps: 0,
        failedSteps: 0,
        commandsBlockedByGuardrail: 0,
      },
    };

    setSession(newSessionState);
    upsertSessionInHistory(newSessionState);

    try {
      // 1. Task Decomposition Call
      const res = await fetch('/api/agent/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      if (!res.ok) {
        throw new Error('Decomposition request failed');
      }

      const data = await res.json();
      const decomposedTasks: AgentTask[] = data.tasks || [];

      const readyState: OrchestratorSession = {
        ...newSessionState,
        tasks: decomposedTasks,
        status: 'running',
      };
      setSession(readyState);
      upsertSessionInHistory(readyState);

      // Start sequential autonomous execution loop
      runAgentLoop(decomposedTasks, goal, maxSteps, newSessionId);
    } catch (err: any) {
      console.error('Error starting mission:', err);
      const failedState: OrchestratorSession = {
        ...newSessionState,
        status: 'failed',
      };
      setSession(failedState);
      upsertSessionInHistory(failedState);
      executionRef.current.isRunning = false;
    }
  };

  // Main Sequential Autonomous Agent Loop
  const runAgentLoop = async (
    initialTasks: AgentTask[],
    goal: string,
    maxSteps: number,
    sessionId: string
  ) => {
    let currentTasks = [...initialTasks];
    let stepCount = 0;
    const startTime = Date.now();

    while (executionRef.current.isRunning && stepCount < maxSteps) {
      if (executionRef.current.isPaused) {
        break;
      }

      const nextTask = resolveNextRunnableTask(currentTasks);
      if (!nextTask) {
        break;
      }

      stepCount++;

      // 1. Mark task running
      currentTasks = updateTaskState(currentTasks, nextTask.id, {
        status: 'running',
      });
      setSession((prev) => {
        const updated = {
          ...prev,
          tasks: currentTasks,
          currentStep: stepCount,
          status: 'running' as const,
        };
        upsertSessionInHistory(updated);
        return updated;
      });

      // 2. Request Next Tool Call & Reasoning from Backend
      let stepPlan: any = null;
      try {
        const stepRes = await fetch('/api/agent/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal,
            currentTask: nextTask,
            completedTasks: currentTasks.filter((t) => t.status === 'completed'),
            previousToolCalls: session.toolCalls,
            virtualFiles: session.virtualFiles,
            stepNumber: stepCount,
          }),
        });

        if (!stepRes.ok) {
          throw new Error('Agent step request failed');
        }
        stepPlan = await stepRes.json();
      } catch (stepErr: any) {
        console.warn('Backend step error, constructing safe local step:', stepErr.message);
        stepPlan = {
          step: stepCount,
          reasoning: `Executing planned subtask "${nextTask.title}" using tool ${nextTask.toolRequired || 'win_fs_write'}.`,
          plannedAction: `Invoke ${nextTask.toolRequired || 'win_fs_write'} with verified safe parameters.`,
          toolName: nextTask.toolRequired || 'win_fs_write',
          parameters:
            nextTask.toolRequired === 'eda_altium_bridge'
              ? { action: 'generate_delphi_script', projectName: 'MainBoard_RevB.PrjPcb' }
              : nextTask.toolRequired === 'eda_proteus_bridge'
              ? { action: 'batch_simulate_mcu', projectName: 'Proteus_Circuit.DSN', mcuFamily: 'STM32' }
              : { path: `C:\\NexusAgent\\Workspace\\${nextTask.id}.log`, content: `Execution log for ${nextTask.title}` },
          confidence: 95,
        };
      }

      // Record thought
      const thought: AgentThought = {
        id: `th-${Date.now()}-${stepCount}`,
        timestamp: new Date().toISOString(),
        step: stepCount,
        subtaskId: nextTask.id,
        reasoning: stepPlan.reasoning,
        plannedAction: stepPlan.plannedAction,
        confidence: stepPlan.confidence || 95,
      };

      const plannedToolCall: ToolCall = {
        id: `tc-${Date.now()}-${stepCount}`,
        step: stepCount,
        subtaskId: nextTask.id,
        toolName: stepPlan.toolName,
        parameters: stepPlan.parameters || {},
        durationMs: 0,
        status: 'executing',
        timestamp: new Date().toISOString(),
      };

      // 3. Windows Guardrail Verification
      const guardCheck = checkWindowsGuardrails(
        plannedToolCall.toolName,
        plannedToolCall.parameters,
        session.guardrails
      );

      if (guardCheck.needsApproval) {
        plannedToolCall.status = 'awaiting_approval';
        executionRef.current.isPaused = true;

        setSession((prev) => {
          const updated = {
            ...prev,
            thoughts: [...prev.thoughts, thought],
            toolCalls: [...prev.toolCalls, plannedToolCall],
            pendingApproval: plannedToolCall,
            status: 'awaiting_user_approval' as const,
          };
          upsertSessionInHistory(updated);
          return updated;
        });
        return; // Pause until user approves in ThoughtStream
      }

      // 4. Tool Execution
      const toolStartTime = Date.now();
      let toolResult: any = { output: null };

      try {
        const toolRes = await fetch('/api/agent/execute-tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolName: plannedToolCall.toolName,
            parameters: plannedToolCall.parameters,
            virtualFiles: session.virtualFiles,
          }),
        });

        if (toolRes.ok) {
          toolResult = await toolRes.json();
          plannedToolCall.output = toolResult.output;
          plannedToolCall.stderr = toolResult.stderr;
          plannedToolCall.status = !toolResult.stderr ? 'success' : 'error';
        } else {
          plannedToolCall.status = 'error';
          plannedToolCall.stderr = 'Tool execution endpoint returned non-200';
        }
      } catch (toolEx: any) {
        plannedToolCall.status = 'error';
        plannedToolCall.stderr = toolEx.message;
      }

      plannedToolCall.durationMs = Date.now() - toolStartTime;

      // 5. Evaluate Reflection Loop
      const reflection = evaluateAgentReflection(
        plannedToolCall.status === 'success',
        plannedToolCall.stderr || '',
        nextTask.retryCount,
        nextTask.maxRetries
      );

      thought.critique = reflection.reflectionSummary;

      // Update task status
      currentTasks = updateTaskState(currentTasks, nextTask.id, {
        status: reflection.nextStatus,
        output:
          typeof plannedToolCall.output === 'object'
            ? JSON.stringify(plannedToolCall.output)
            : String(plannedToolCall.output || ''),
        error: plannedToolCall.stderr,
        retryCount:
          reflection.nextStatus === 'running'
            ? nextTask.retryCount + 1
            : nextTask.retryCount,
      });

      // Update virtual files if tool produced new files
      const newVirtualFiles = {
        ...session.virtualFiles,
        ...(toolResult.newFiles || {}),
      };

      // Extract artifacts
      const updatedArtifacts = extractArtifactsFromToolCall(
        plannedToolCall,
        session.artifacts
      );

      // Commit step state
      setSession((prev) => {
        const updated = {
          ...prev,
          tasks: currentTasks,
          thoughts: [...prev.thoughts, thought],
          toolCalls: [...prev.toolCalls, plannedToolCall],
          artifacts: updatedArtifacts,
          virtualFiles: newVirtualFiles,
          stats: {
            ...prev.stats,
            runTimeMs: Date.now() - startTime,
            toolsExecuted: prev.stats.toolsExecuted + 1,
            successfulSteps:
              plannedToolCall.status === 'success'
                ? prev.stats.successfulSteps + 1
                : prev.stats.successfulSteps,
            failedSteps:
              plannedToolCall.status === 'error'
                ? prev.stats.failedSteps + 1
                : prev.stats.failedSteps,
          },
        };
        upsertSessionInHistory(updated);
        return updated;
      });

      // Realistic smooth pacing
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const allFinished = currentTasks.every((t) => t.status === 'completed');
    setSession((prev) => {
      const finalState = {
        ...prev,
        status: (allFinished ? 'completed' : 'idle') as any,
      };
      upsertSessionInHistory(finalState);
      return finalState;
    });
    executionRef.current.isRunning = false;
  };

  // Guardrail Approval Handler
  const handleApproveTool = async () => {
    if (!session.pendingApproval) return;
    const pending = session.pendingApproval;

    setSession((prev) => ({
      ...prev,
      pendingApproval: null,
      status: 'running',
    }));

    executionRef.current.isPaused = false;
    executionRef.current.isRunning = true;

    const toolStartTime = Date.now();
    const toolRes = await fetch('/api/agent/execute-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolName: pending.toolName,
        parameters: pending.parameters,
        virtualFiles: session.virtualFiles,
      }),
    });
    const toolResult = await toolRes.json();
    const durationMs = Date.now() - toolStartTime;

    const updatedCalls = session.toolCalls.map((tc) =>
      tc.id === pending.id
        ? {
            ...tc,
            output: toolResult.output,
            stderr: toolResult.stderr,
            durationMs,
            status: (!toolResult.stderr ? 'success' : 'error') as any,
          }
        : tc
    );

    const activeTask = session.tasks.find((t) => t.id === pending.subtaskId);
    let updatedTasks = session.tasks;
    if (activeTask) {
      updatedTasks = updateTaskState(session.tasks, activeTask.id, {
        status: !toolResult.stderr ? 'completed' : 'failed',
      });
    }

    setSession((prev) => {
      const updated = {
        ...prev,
        tasks: updatedTasks,
        toolCalls: updatedCalls,
        status: 'running' as const,
      };
      upsertSessionInHistory(updated);
      return updated;
    });

    runAgentLoop(updatedTasks, session.goal, session.maxSteps, session.id);
  };

  // Guardrail Reject Handler
  const handleRejectTool = () => {
    if (!session.pendingApproval) return;
    const pending = session.pendingApproval;

    const updatedCalls = session.toolCalls.map((tc) =>
      tc.id === pending.id
        ? {
            ...tc,
            status: 'error' as any,
            stderr: 'Action blocked by user safety policy.',
          }
        : tc
    );

    let updatedTasks = session.tasks;
    if (pending.subtaskId) {
      updatedTasks = updateTaskState(session.tasks, pending.subtaskId, {
        status: 'failed',
        error: 'Blocked by user safety guardrail.',
      });
    }

    setSession((prev) => {
      const updated = {
        ...prev,
        pendingApproval: null,
        tasks: updatedTasks,
        toolCalls: updatedCalls,
        status: 'idle' as const,
        stats: {
          ...prev.stats,
          commandsBlockedByGuardrail: prev.stats.commandsBlockedByGuardrail + 1,
        },
      };
      upsertSessionInHistory(updated);
      return updated;
    });

    executionRef.current.isRunning = false;
  };

  const handleReset = () => {
    executionRef.current.isRunning = false;
    executionRef.current.isPaused = false;
    setSession((prev) => ({
      ...prev,
      id: `sess-${Date.now()}`,
      status: 'idle',
      goal: '',
      tasks: [],
      thoughts: [],
      toolCalls: [],
      currentStep: 0,
      pendingApproval: null,
      stats: {
        totalTokens: 0,
        runTimeMs: 0,
        toolsExecuted: 0,
        successfulSteps: 0,
        failedSteps: 0,
        commandsBlockedByGuardrail: 0,
      },
    }));
  };

  // History Sidebar Actions
  const handleSelectSession = (selectedSession: OrchestratorSession) => {
    executionRef.current.isRunning = false;
    executionRef.current.isPaused = false;
    setSession(selectedSession);
  };

  const handleNewChat = () => {
    handleReset();
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistorySessions((prev) => prev.filter((s) => s.id !== id));
    if (session.id === id) {
      handleReset();
    }
  };

  const handleClearAllHistory = () => {
    setHistorySessions([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const isExecuting =
    session.status === 'running' || session.status === 'decomposing';

  if (viewMode === 'website') {
    return (
      <ShowcaseLanding
        onLaunchLiveApp={() => setViewMode('app')}
        onOpenPythonInstaller={() => setViewMode('python-installer')}
        geminiConnected={geminiConnected}
      />
    );
  }

  if (viewMode === 'python-installer') {
    return (
      <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-sky-600/30 selection:text-sky-200">
        <WindowsTitleBar
          session={session}
          geminiConnected={geminiConnected}
          onReset={handleReset}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onSwitchToWebsite={() => setViewMode('website')}
          onSwitchToApp={() => setViewMode('app')}
          onSwitchToPythonInstaller={() => setViewMode('python-installer')}
          onDownloadExe={handleDownloadExe}
          activeView="python-installer"
        />
        <main className="flex-1 overflow-y-auto">
          <PythonInstallerHub onLaunchWebAgent={() => setViewMode('app')} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-600/30 selection:text-sky-200">
      {/* Top Header with Original Name, Windows Security & EDA Status, Website switch, Download .exe, and Sidebar Toggle */}
      <WindowsTitleBar
        session={session}
        geminiConnected={geminiConnected}
        onReset={handleReset}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSwitchToWebsite={() => setViewMode('website')}
        onSwitchToApp={() => setViewMode('app')}
        onSwitchToPythonInstaller={() => setViewMode('python-installer')}
        onDownloadExe={handleDownloadExe}
        activeView="app"
      />

      {/* Main Layout: History Sidebar + Agent Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation History Sidebar */}
        <HistorySidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          sessions={historySessions}
          currentSessionId={session.id}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAllHistory}
        />

        {/* Core Workspace: Chat Box + Active Plan Sequence + Live Trace & Reasoning Stream ONLY */}
        <main className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto flex flex-col gap-4 overflow-y-auto">
          {/* 1. Chat Box */}
          <GoalConsole
            session={session}
            onStart={handleStartMission}
            onReset={handleReset}
            isExecuting={isExecuting}
          />

          {/* 2 & 3. Active Plan Sequence + Live Trace & Reasoning Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch min-h-[500px]">
            {/* Active Plan Sequence (Left Panel) */}
            <div className="lg:col-span-5 h-full">
              <TaskTree
                tasks={session.tasks}
                currentTaskId={resolveNextRunnableTask(session.tasks)?.id}
                isDecomposing={session.status === 'decomposing'}
              />
            </div>

            {/* Live Trace & Reasoning Stream (Right Panel) */}
            <div className="lg:col-span-7 h-full">
              <ThoughtStream
                thoughts={session.thoughts}
                toolCalls={session.toolCalls}
                currentStep={session.currentStep}
                pendingApproval={session.pendingApproval}
                onApproveTool={handleApproveTool}
                onRejectTool={handleRejectTool}
                onInjectGuidance={(guidance) => {
                  console.log('User guidance injected:', guidance);
                }}
                isExecuting={isExecuting}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
