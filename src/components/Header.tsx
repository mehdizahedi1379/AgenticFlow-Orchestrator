import React from 'react';
import {
  Cpu,
  Layers,
  Wrench,
  FileCode2,
  Sparkles,
  RefreshCw,
  Terminal,
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { OrchestratorSession } from '../types/agent.ts';

interface HeaderProps {
  session: OrchestratorSession;
  geminiConnected: boolean;
  onReset: () => void;
  onOpenTools: () => void;
  onTogglePause: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  geminiConnected,
  onReset,
  onOpenTools,
  onTogglePause,
}) => {
  const completedCount = session.tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = session.tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-30 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 text-white font-bold text-sm tracking-wider">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
                NexusAgent
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                v2.4-harness
              </span>
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border bg-emerald-950/30 border-emerald-800/40 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{geminiConnected ? 'Gemini 3.8 Flash' : 'Local Harness Engine'}</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Autonomous Multi-Step Reasoning & Local Tool Execution Harness
            </p>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center space-x-2 sm:space-x-4 bg-zinc-900/90 border border-zinc-800/80 px-3 py-1.5 rounded-lg text-xs">
          <div className="flex items-center space-x-1.5" title="Tasks Completed">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-400">Tasks:</span>
            <span className="font-mono font-medium text-zinc-200">
              {completedCount}/{totalTasks || 0}
            </span>
          </div>

          <div className="h-3 w-px bg-zinc-800" />

          <div className="flex items-center space-x-1.5" title="Tools Invoked">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Tools:</span>
            <span className="font-mono font-medium text-zinc-200">
              {session.stats.toolsExecuted}
            </span>
          </div>

          <div className="h-3 w-px bg-zinc-800 hidden md:block" />

          <div className="items-center space-x-1.5 hidden md:flex" title="Generated Artifacts">
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Artifacts:</span>
            <span className="font-mono font-medium text-zinc-200">
              {session.artifacts.length}
            </span>
          </div>

          <div className="h-3 w-px bg-zinc-800 hidden lg:block" />

          <div className="items-center space-x-1.5 hidden lg:flex" title="Current Step">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400">Step:</span>
            <span className="font-mono font-medium text-zinc-200">
              {session.currentStep}/{session.maxSteps}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {session.status === 'running' && (
            <button
              onClick={onTogglePause}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              title="Pause Execution"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          {session.status === 'paused' && (
            <button
              onClick={onTogglePause}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
              title="Resume Execution"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          )}

          <button
            onClick={onOpenTools}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Inspect Available Tools & Sandbox"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tools (7)</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="Reset Workspace and Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Strip */}
      {totalTasks > 0 && (
        <div className="w-full bg-zinc-900 h-1 mt-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
