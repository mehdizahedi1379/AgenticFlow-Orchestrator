import React, { useState } from 'react';
import { ArrowUp, RotateCcw, Bot, Cpu } from 'lucide-react';
import type { OrchestratorSession } from '../types/agent.ts';

interface ChatBoxProps {
  session: OrchestratorSession;
  onStart: (goal: string, mode: 'autonomous' | 'step_by_step', maxSteps: number) => void;
  onReset: () => void;
  isExecuting: boolean;
}

export const GoalConsole: React.FC<ChatBoxProps> = ({
  session,
  onStart,
  onReset,
  isExecuting,
}) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goal.trim() || isExecuting) return;
    onStart(goal.trim(), 'autonomous', 8);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasActiveSession = session.tasks.length > 0;

  return (
    <div className="w-full space-y-2">
      {/* Main Chat Box */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative rounded-2xl border border-[#1e293b] bg-[#111827]/95 p-3.5 shadow-xl focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <div className="flex items-start gap-2.5">
            <div className="mt-1 text-slate-500">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isExecuting}
              rows={2}
              placeholder="Assign a mission, Altium/Proteus EDA automation, or Windows system task (Enter to send, Shift+Enter for newline)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#1e293b]/70">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
              {hasActiveSession && (
                <button
                  type="button"
                  onClick={() => {
                    setGoal('');
                    onReset();
                  }}
                  disabled={isExecuting}
                  className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Reset and start new session"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset / New Session</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="submit"
                disabled={isExecuting || !goal.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-sky-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <ArrowUp className="w-4 h-4 font-bold" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
