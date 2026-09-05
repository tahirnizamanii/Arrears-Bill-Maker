import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onClick: () => void;
  isOpen?: boolean;
}

export const AIAssistantFloatingButton: React.FC<Props> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 no-print">
      <button
        type="button"
        onClick={onClick}
        className="group flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-full shadow-2xl border-2 border-purple-500/40 hover:border-purple-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-purple-500/10"
        title="Open Sindh Govt Administrative & Rules AI Assistant"
        aria-label="Open AI Assistant"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-900/50 group-hover:rotate-12 transition-transform">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </div>
        
        <div className="text-left pr-1">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-xs tracking-tight text-white group-hover:text-purple-200 transition-colors">
              Sindh AI Assistant
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              Online
            </span>
          </div>
          <p className="text-[10px] text-purple-200/80 font-normal hidden sm:block">
            Rules, Fixations &amp; Smart Drafting
          </p>
        </div>
      </button>
    </div>
  );
};
