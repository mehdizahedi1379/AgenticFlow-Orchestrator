import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Search,
  Bot,
  CircuitBoard,
} from 'lucide-react';
import type { OrchestratorSession } from '../types/agent.ts';

export interface HistorySessionSummary {
  id: string;
  goal: string;
  createdAt: string;
  status: OrchestratorSession['status'];
  taskCount: number;
  completedTasks: number;
  sessionData: OrchestratorSession;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: HistorySessionSummary[];
  currentSessionId: string;
  onSelectSession: (session: OrchestratorSession) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) =>
    (s.goal || 'Untitled Session').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-[#0c1017] border-r border-[#1e293b] transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-72'
        }`}
      >
        {/* Top Header / Actions */}
        <div className="p-3 border-b border-[#1e293b] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs tracking-tight">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Conversation History</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {sessions.length}
              </span>
            </div>

            {/* Close Toggle Button */}
            <button
              onClick={onToggle}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Close Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button (DeepSeek Style) */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer group"
          >
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </button>

          {/* Search Filter if multiple sessions exist */}
          {sessions.length > 2 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-[#111827] border border-[#1e293b] text-slate-200 text-[11px] rounded-lg pl-8 pr-2 py-1.5 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4 text-slate-500">
              <Bot className="w-8 h-8 mb-2 text-slate-600" />
              <p className="text-xs">No conversations found</p>
              <p className="text-[10px] text-slate-600 mt-1">
                Send a mission or prompt to start an autonomous session
              </p>
            </div>
          ) : (
            filteredSessions.map((item) => {
              const isSelected = item.id === currentSessionId;
              const isEda =
                item.goal.toLowerCase().includes('altium') ||
                item.goal.toLowerCase().includes('proteus') ||
                item.goal.toLowerCase().includes('pcb') ||
                item.goal.toLowerCase().includes('drc');

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectSession(item.sessionData)}
                  className={`group relative flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-800/60 text-slate-100 shadow-sm'
                      : 'bg-[#101622]/60 hover:bg-[#151c2c] border-[#1e293b]/60 text-slate-300'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5 shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : item.status === 'failed' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : isEda ? (
                      <CircuitBoard className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    )}
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">
                      {item.goal || 'New Session'}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.createdAt}
                      </span>
                      {item.taskCount > 0 && (
                        <span>
                          {item.completedTasks}/{item.taskCount} steps
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0 cursor-pointer"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Footer */}
        {sessions.length > 0 && (
          <div className="p-2.5 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500">
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-400 transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All History</span>
            </button>
            <span className="font-mono text-[10px]">
              {sessions.length} chats
            </span>
          </div>
        )}
      </aside>
    </>
  );
};
