import React from 'react';
import { X, Wrench, Shield, CheckCircle, Terminal, Cpu, Database, FileCode } from 'lucide-react';
import { AVAILABLE_TOOLS } from '../utils/tools.ts';

interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Windows OS Tool Suite & Function Calling Registry
              </h3>
              <p className="text-[11px] text-zinc-400">
                Simulated & local sandbox execution interfaces available to Gemini 3.8 Flash
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

        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {AVAILABLE_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-indigo-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{tool.name}</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  {tool.category}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">{tool.description}</p>

              <div className="mt-2 pt-1.5 border-t border-zinc-850">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">Parameters Schema:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {Object.entries(tool.parametersSchema).map(([paramName, schema]) => (
                    <div key={paramName} className="p-1 rounded bg-zinc-900 border border-zinc-800/80">
                      <span className="text-emerald-400 font-semibold">{paramName}</span>
                      <span className="text-zinc-500"> ({schema.type}{schema.required ? ', required' : ''}): </span>
                      <span className="text-zinc-400">{schema.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
