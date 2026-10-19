import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Terminal,
  Layers,
  RotateCw,
  GitBranch,
} from 'lucide-react';
import type { AgentTask } from '../types/agent.ts';

interface TaskTreeProps {
  tasks: AgentTask[];
  currentTaskId?: string;
  isDecomposing?: boolean;
}

export const TaskTree: React.FC<TaskTreeProps> = ({
  tasks,
  currentTaskId,
  isDecomposing = false,
}) => {
  if (isDecomposing) {
    return (
      <div className="bg-[#111827]/90 border border-[#1e293b] rounded-2xl p-6 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-10 h-10 border-2 border-sky-500/30 border-t-sky-400 rounded-full animate-spin mb-3" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Decomposing Subtasks...
        </h3>
        <p className="text-[11px] text-slate-400 max-w-xs mt-1">
          Formulating sequential atomic tasks and tool dependencies.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-[#111827]/40 border border-dashed border-[#1e293b] rounded-2xl p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[300px]">
        <GitBranch className="w-9 h-9 text-slate-700 mb-2" />
        <p className="text-sm font-medium text-slate-300">Active Plan Sequence</p>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Enter a task in the chat box to generate and execute an autonomous plan sequence.
        </p>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="bg-[#111827]/90 border border-[#1e293b] rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col h-full min-h-[360px]">
      <div className="flex items-center justify-between mb-3 border-b border-[#1e293b] pb-2.5">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Active Plan Sequence
          </h2>
        </div>
        <span className="text-[11px] font-mono text-sky-400 font-semibold px-2.5 py-0.5 rounded-full bg-sky-950/70 border border-sky-800/50">
          {completedCount}/{tasks.length} Completed
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
        {tasks.map((task, index) => {
          const isCurrent = task.id === currentTaskId;
          let statusBadge = (
            <span className="flex items-center space-x-1 text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-800">
              <Clock className="w-2.5 h-2.5" />
              <span>Pending</span>
            </span>
          );

          if (task.status === 'running') {
            statusBadge = (
              <span className="flex items-center space-x-1 text-sky-300 bg-sky-950/80 border border-sky-500/60 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <RotateCw className="w-2.5 h-2.5 animate-spin text-sky-400" />
                <span>Executing</span>
              </span>
            );
          } else if (task.status === 'reflecting') {
            statusBadge = (
              <span className="flex items-center space-x-1 text-purple-300 bg-purple-950/80 border border-purple-500/60 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                <span>Reflecting</span>
              </span>
            );
          } else if (task.status === 'completed') {
            statusBadge = (
              <span className="flex items-center space-x-1 text-emerald-300 bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>Done</span>
              </span>
            );
          } else if (task.status === 'failed') {
            statusBadge = (
              <span className="flex items-center space-x-1 text-rose-300 bg-rose-950/80 border border-rose-500/60 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                <span>Failed</span>
              </span>
            );
          }

          return (
            <div
              key={task.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                isCurrent
                  ? 'border-sky-500 bg-sky-950/20 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : task.status === 'completed'
                  ? 'border-[#1e293b] bg-[#0b0f17]/40 opacity-90'
                  : 'border-[#1e293b] bg-[#0b0f17]/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-sky-400 font-bold bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                    #{index + 1}
                  </span>
                  <h4 className="font-semibold text-slate-200 tracking-tight leading-snug">
                    {task.title}
                  </h4>
                </div>
                {statusBadge}
              </div>

              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed font-sans">
                {task.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e293b]/70 text-[10px] font-mono">
                <div className="flex items-center space-x-2">
                  {task.toolRequired && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#0b0f17] text-sky-300 border border-sky-800/40">
                      <Terminal className="w-2.5 h-2.5 text-sky-400" />
                      <span>{task.toolRequired}</span>
                    </span>
                  )}

                  {task.dependencies.length > 0 && (
                    <span className="text-slate-500">
                      Deps: {task.dependencies.join(', ')}
                    </span>
                  )}
                </div>

                {task.retryCount > 0 && (
                  <span className="text-amber-400">
                    Retries: {task.retryCount}/{task.maxRetries}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
