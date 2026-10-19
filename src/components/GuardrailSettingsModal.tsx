import React from 'react';
import { X, ShieldCheck, ShieldAlert, Sliders, Lock, AlertTriangle } from 'lucide-react';
import type { WindowsGuardrails } from '../types/agent.ts';

interface GuardrailSettingsModalProps {
  isOpen: boolean;
  guardrails: WindowsGuardrails;
  onUpdate: (updated: WindowsGuardrails) => void;
  onClose: () => void;
}

export const GuardrailSettingsModal: React.FC<GuardrailSettingsModalProps> = ({
  isOpen,
  guardrails,
  onUpdate,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Windows Security Guardrails & Safety Thresholds
              </h3>
              <p className="text-[11px] text-zinc-400">
                Configure user confirmation prompts and filesystem restrictions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs text-zinc-300">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
            <div>
              <span className="font-semibold text-zinc-100 block">Master Guardrail Protection</span>
              <span className="text-[11px] text-zinc-500">
                Enforce safety interceptors before executing local OS operations
              </span>
            </div>
            <input
              type="checkbox"
              checked={guardrails.enabled}
              onChange={(e) => onUpdate({ ...guardrails, enabled: e.target.checked })}
              className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
            />
          </div>

          {/* Sub-policies */}
          <div className={`space-y-3 ${!guardrails.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="flex items-center justify-between p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80 cursor-pointer">
              <div>
                <span className="font-medium text-zinc-200 block">
                  Require Confirmation for PowerShell & CMD Commands
                </span>
                <span className="text-[10px] text-zinc-500">
                  Prompts interactive confirmation dialog prior to running shell operations
                </span>
              </div>
              <input
                type="checkbox"
                checked={guardrails.requireApprovalForShell}
                onChange={(e) => onUpdate({ ...guardrails, requireApprovalForShell: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80 cursor-pointer">
              <div>
                <span className="font-medium text-zinc-200 block">
                  Protect Windows System Directories
                </span>
                <span className="text-[10px] text-zinc-500">
                  Intercepts write actions targeting C:\Windows, System32, or Program Files
                </span>
              </div>
              <input
                type="checkbox"
                checked={guardrails.requireApprovalForFileWrite}
                onChange={(e) => onUpdate({ ...guardrails, requireApprovalForFileWrite: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-zinc-950/60 border border-zinc-800/80 cursor-pointer">
              <div>
                <span className="font-medium text-zinc-200 block">
                  Allow PowerShell Script Execution (.ps1)
                </span>
                <span className="text-[10px] text-zinc-500">
                  Allows agent to execute generated PowerShell scripts with execution policy
                </span>
              </div>
              <input
                type="checkbox"
                checked={guardrails.allowPowershellScripting}
                onChange={(e) => onUpdate({ ...guardrails, allowPowershellScripting: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
            </label>
          </div>
        </div>

        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Apply Guardrails
          </button>
        </div>
      </div>
    </div>
  );
};
