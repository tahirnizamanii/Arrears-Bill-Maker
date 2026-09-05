import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import { GovernmentEmblem } from './GovernmentEmblem';

interface HeaderProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onPrint?: () => void;
  onReset?: () => void;
  isGeneratingPDF?: boolean;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
  onToggleAdminView: () => void;
  isAdminViewOpen: boolean;
  activeTool: string;
  onSelectTool: (toolId: string) => void;
  onOpenFeedback?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdminAuthenticated,
  onOpenAdminLogin,
  onToggleAdminView,
  isAdminViewOpen,
  activeTool,
  onSelectTool,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tools = [
    { id: 'arrears', label: 'Arrears Bill (TR-22)' },
    { id: 'salary-slip', label: 'Salary Slip' },
    { id: 'difference', label: 'Difference Maker' },
    { id: 'pension', label: 'Pension Papers' },
    { id: 'formats', label: 'Formats & NOC' },
    { id: 'gpf', label: 'GPF & Tax' },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand & Emblem (Clickable to Home) */}
          <button
            type="button"
            onClick={() => {
              onSelectTool('arrears');
              if (isAdminViewOpen) {
                onToggleAdminView();
              }
            }}
            className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 text-left hover:opacity-95 transition group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1 -ml-1"
            title="Go to Home (Sindh Arrears Bill Maker)"
            aria-label="Sindh Arrears Bill Maker Home"
          >
            <div className="flex items-center justify-center shrink-0">
              <GovernmentEmblem className="w-9 h-9 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform" size={42} white={true} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs sm:text-base tracking-tight text-white truncate group-hover:text-emerald-300 transition-colors">
                  Sindh Arrears Bill Maker
                </span>
                <span className="hidden md:inline-block bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PST &amp; JEST
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate hidden xs:block">
                Govt of Sindh &bull; Education Dept
              </p>
            </div>
          </button>

          {/* Desktop Segmented Navigation Tools */}
          <nav className="hidden lg:flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 text-xs shrink-0">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition duration-150 cursor-pointer ${
                  activeTool === t.id && !isAdminViewOpen
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Desktop Admin Access: Admin Rules Studio ONLY visible when logged in */}
            <div className="hidden md:block">
              {isAdminAuthenticated ? (
                <button
                  onClick={onToggleAdminView}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition border cursor-pointer ${
                    isAdminViewOpen
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border-amber-500/30'
                  }`}
                  title="Admin Rules & Pay Scale Studio"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAdminViewOpen ? 'User Mode' : 'Admin Rules'}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition border border-slate-800 hover:border-slate-700 cursor-pointer"
                  title="Admin Login"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile All-In-One Menu Toggle Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700 md:hidden flex items-center justify-center transition"
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Slide-down Full Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Tools Switcher */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Tool / Calculator
            </div>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTool(t.id);
                    setShowMobileMenu(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition cursor-pointer ${
                    activeTool === t.id && !isAdminViewOpen
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Toggle in Mobile */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Administration:</span>
            {isAdminAuthenticated ? (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onToggleAdminView();
                }}
                className="text-amber-400 font-semibold flex items-center space-x-1.5 py-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminViewOpen ? 'Exit Admin Mode' : 'Admin Rules Studio'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenAdminLogin();
                }}
                className="text-slate-400 hover:text-white flex items-center space-x-1.5 py-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
