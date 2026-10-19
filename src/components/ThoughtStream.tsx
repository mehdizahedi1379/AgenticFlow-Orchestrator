import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import type { AgentThought, ToolCall } from '../types/agent.ts';

interface ThoughtStreamProps {
  thoughts: AgentThought[];
  toolCalls: ToolCall[];
  currentStep: number;
  pendingApproval?: ToolCall | null;
  onApproveTool?: () => void;
  onRejectTool?: () => void;
  onInjectGuidance?: (guidance: string) => void;
  isExecuting?: boolean;
}

export const ThoughtStream: React.FC<ThoughtStreamProps> = ({
  thoughts,
  toolCalls,
  currentStep,
  pendingApproval,
  onApproveTool,
  onRejectTool,
  onInjectGuidance,
  isExecuting = false,
}) => {
  const [userGuidance, setUserGuidance] = useState('');
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuidance.trim() || !onInjectGuidance) return;
    onInjectGuidance(userGuidance.trim());
    setUserGuidance('');
  };

  return (
    <div className="bg-[#111827]/90 border border-[#1e293b] rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col h-full min-h-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-[#1e293b] pb-2.5">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Trace & Reasoning Stream
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/40">
            {thoughts.length} Cycles
          </span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
            {toolCalls.length} Tools
          </span>
        </div>
      </div>

      {/* Security Guardrail Approval Banner (If pending) */}
      {pendingApproval && (
        <div className="mb-3 p-3.5 rounded-xl border border-amber-500/50 bg-amber-950/30 text-xs shadow-lg animate-pulse-subtle">
          <div className="flex items-start space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-200 tracking-tight">
                Security Guardrail Triggered: User Approval Required
              </h4>
              <p className="text-[11px] text-amber-300/80 mt-1 leading-relaxed">
                Agent proposes invoking{' '}
                <span className="font-mono text-amber-200 font-bold bg-amber-900/40 px-1 py-0.5 rounded">
                  {pendingApproval.toolName}
                </span>
                . Please verify the arguments before allowing execution.
              </p>

              <div className="bg-[#0b0f17] border border-amber-500/30 rounded-lg p-2.5 my-2 font-mono text-[10px] text-slate-300 overflow-x-auto">
                <pre>{JSON.stringify(pendingApproval.parameters, null, 2)}</pre>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <button
                  type="button"
                  onClick={onApproveTool}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Authorize Execution
                </button>
                <button
                  type="button"
                  onClick={onRejectTool}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Block Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thought Stream List */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1">
        {thoughts.length === 0 && !isExecuting && (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[220px]">
            <Sparkles className="w-8 h-8 text-slate-700 mb-2" />
            <p className="text-sm font-medium text-slate-300">Live Trace & Reasoning Stream</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Start a mission in the chat box to observe real-time chain-of-thought monologue, tool execution, and reflection.
            </p>
          </div>
        )}

        {thoughts.map((thought, idx) => {
          const correspondingToolCall = toolCalls.find((tc) => tc.step === thought.step);
          const isExpanded = expandedThoughtId === thought.id || idx === thoughts.length - 1;

          return (
            <div
              key={thought.id}
              className="rounded-xl border border-[#1e293b] bg-[#0b0f17]/60 overflow-hidden text-xs transition-all shadow-sm"
            >
              {/* Step Header */}
              <button
                type="button"
                onClick={() => setExpandedThoughtId(isExpanded ? null : thought.id)}
                className="w-full text-left p-3 flex items-center justify-between bg-[#111827]/80 hover:bg-[#161f30] border-b border-[#1e293b] transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 font-semibold">
                    Cycle {thought.step}
                  </span>
                  <span className="font-medium text-slate-200 truncate">
                    {thought.plannedAction}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  {thought.confidence && (
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      {thought.confidence}% conf
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Body: DeepSeek Signature "Thinking Process" Block */}
              {isExpanded && (
                <div className="p-3.5 space-y-3 bg-[#0b0f17]/40">
                  {/* Signature Thinking Process Container */}
                  <div className="rounded-xl border border-sky-900/40 bg-sky-950/10 p-3.5">
                    <div className="flex items-center justify-between text-sky-300 text-xs font-semibold mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Brain className="w-3.5 h-3.5 text-sky-400" />
                        <span className="tracking-wide">Thinking Process</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">
                          (Thought for {Math.max(1, Math.round(thought.step * 1.5))}s)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(thought.id, thought.reasoning)}
                        className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        title="Copy reasoning"
                      >
                        {copiedId === thought.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap font-sans border-l-2 border-sky-500/40 pl-3 my-1">
                      {thought.reasoning}
                    </div>
                  </div>

                  {/* Tool Execution Details */}
                  {correspondingToolCall && (
                    <div className="rounded-xl border border-[#1e293b] bg-[#0b0f17] p-3 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-slate-400 mb-1.5">
                        <div className="flex items-center space-x-1.5">
                          <Terminal className="w-3.5 h-3.5 text-sky-400" />
                          <span className="text-sky-300 font-semibold">
                            {correspondingToolCall.toolName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px]">
                          {correspondingToolCall.durationMs > 0 && (
                            <span>{correspondingToolCall.durationMs}ms</span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              correspondingToolCall.status === 'success'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : correspondingToolCall.status === 'error'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {correspondingToolCall.status}
                          </span>
                        </div>
                      </div>

                      {/* Tool Parameters */}
                      <div className="bg-[#111827]/60 rounded p-2 text-slate-300 text-[10px] overflow-x-auto mb-2 border border-slate-800/60">
                        <pre>{JSON.stringify(correspondingToolCall.parameters, null, 2)}</pre>
                      </div>

                      {/* Tool Output or Error */}
                      {correspondingToolCall.output && (
                        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded p-2 text-emerald-300 text-[10px] overflow-x-auto">
                          <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mb-1">
                            Output:
                          </div>
                          <pre className="whitespace-pre-wrap">
                            {typeof correspondingToolCall.output === 'object'
                              ? JSON.stringify(correspondingToolCall.output, null, 2)
                              : String(correspondingToolCall.output)}
                          </pre>
                        </div>
                      )}

                      {correspondingToolCall.stderr && (
                        <div className="bg-rose-950/20 border border-rose-900/40 rounded p-2 text-rose-300 text-[10px] overflow-x-auto">
                          <div className="text-[9px] uppercase tracking-wider text-rose-400 font-bold mb-1">
                            Error Output:
                          </div>
                          <pre className="whitespace-pre-wrap">{correspondingToolCall.stderr}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reflection Card */}
                  {thought.critique && (
                    <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-2.5 text-[11px]">
                      <div className="flex items-center space-x-1.5 text-emerald-300 font-semibold mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Self-Reflection & Outcome Verification:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {thought.critique}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isExecuting && (
          <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20 flex items-center space-x-2.5 text-xs text-sky-300 animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span>Reasoning and evaluating next tool parameters...</span>
          </div>
        )}
      </div>

      {/* Steering Input */}
      {thoughts.length > 0 && (
        <form onSubmit={handleSendGuidance} className="mt-3 pt-2.5 border-t border-[#1e293b]">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userGuidance}
              onChange={(e) => setUserGuidance(e.target.value)}
              placeholder="Guide agent reasoning (e.g. 'Use strict try-catch blocks')..."
              className="flex-1 bg-[#0b0f17] border border-[#1e293b] rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-sans"
            />
            <button
              type="submit"
              disabled={!userGuidance.trim()}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span className="hidden sm:inline">Steer</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
