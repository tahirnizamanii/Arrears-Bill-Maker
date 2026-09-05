import React from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Calculator,
  Lock,
  ArrowUp,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { GovernmentEmblem } from './GovernmentEmblem';

interface FooterProps {
  onSelectTool?: (toolId: string) => void;
  onNavigateTab?: (tab: 'dashboard' | 'schedule' | 'documents' | 'checklist' | 'reviews') => void;
  onOpenAdminLogin?: () => void;
  isAdminAuthenticated?: boolean;
  onToggleAdminView?: () => void;
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTool,
  onNavigateTab,
  onOpenAdminLogin,
  isAdminAuthenticated,
  onToggleAdminView,
  onOpenFeedback,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 no-print">
      {/* Top Banner with Quick Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="flex items-center space-x-3 text-slate-300">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-white block">Official Finance Dept Rules</span>
                <span className="text-slate-400 text-[11px]">
                  Updated for BPS 2022–2025 pay scales &amp; statutory adhoc allowances.
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-300">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-white block">Full 6-Page TR-22 Bundle</span>
                <span className="text-slate-400 text-[11px]">
                  Includes Covering Letter, DAO Adjustment, TR-22 Obverse/Reverse, &amp; Schedule.
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-300">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-white block">100% Client-Side Privacy</span>
                <span className="text-slate-400 text-[11px]">
                  Employee CNIC, P#, and salary figures are processed locally on your device.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          
          {/* Col 1 & 2: Branding & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <button
              type="button"
              onClick={() => {
                if (onSelectTool) onSelectTool('arrears');
                if (onNavigateTab) onNavigateTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-3 text-left hover:opacity-95 transition group cursor-pointer focus:outline-none"
              title="Go to Home (Sindh Arrears Bill Maker)"
              aria-label="Sindh Arrears Bill Maker Home"
            >
              <div className="flex items-center justify-center shrink-0">
                <GovernmentEmblem className="w-10 h-10 group-hover:scale-105 transition-transform" size={40} white={true} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  Sindh Arrears Bill Maker
                </h3>
                <p className="text-[11px] text-slate-400">
                  School Education &amp; Literacy Department &bull; Govt of Sindh
                </p>
              </div>
            </button>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Designed for Primary School Teachers (PST), Junior Elementary School Teachers (JEST), Headmasters, and DDO clerks across all Sindh regions (Hyderabad, Karachi, Sukkur, Larkana, Mirpurkhas, Shaheed Benazirabad) to generate audit-ready arrears calculation sheets.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-medium">
                PST (BPS-14)
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-medium">
                JEST (BPS-14)
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-medium">
                ECT &bull; HST &bull; Clerks
              </span>
            </div>
          </div>

          {/* Col 3: Document Generator Modules */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Bill Documents
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('documents')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  TR-22 Arrear Bill Bundle
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('documents')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  DAO Adjustment Proforma
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('schedule')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Monthly Broken Schedule
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('checklist')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  DAO Submission Checklist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => (onOpenFeedback ? onOpenFeedback() : onNavigateTab && onNavigateTab('reviews'))}
                  className="hover:text-amber-300 transition flex items-center text-amber-400 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Teacher Feedback &amp; Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Additional Calculators */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Finance Tools
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('arrears')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Salary Arrears Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('gpf')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  GPF Interest &amp; Balance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('tax')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Income Tax Slabs Estimator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool && onSelectTool('pension')}
                  className="hover:text-emerald-400 transition flex items-center"
                >
                  <Calculator className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Pension &amp; Commutation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Reference Standards & Admin */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Treasury Standards
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center text-slate-400">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
                <span>Sindh TR Form 22 (Rules 223)</span>
              </li>
              <li className="flex items-center text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
                <span>Finance Dept Notifications</span>
              </li>
              <li className="flex items-center text-slate-400">
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-500 shrink-0" />
                <span>Audit &amp; DAO Verification</span>
              </li>
              {isAdminAuthenticated && onToggleAdminView ? (
                <li className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onToggleAdminView}
                    className="text-amber-400 hover:text-amber-300 transition flex items-center text-[11px] font-semibold"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Admin Rules Studio
                  </button>
                </li>
              ) : onOpenAdminLogin ? (
                <li className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onOpenAdminLogin}
                    className="text-slate-500 hover:text-slate-300 transition flex items-center text-[11px]"
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    Admin Login
                  </button>
                </li>
              ) : null}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Government of Sindh. School Education &amp; Literacy Department.</span>
            <span className="hidden md:inline text-slate-600">&bull;</span>
            <span className="hidden md:inline">Sindh Treasury Rules Form 22 Compliant</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500">Version 2.5 (2026 Edition)</span>
            <button
              onClick={scrollToTop}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 transition border border-slate-700"
              title="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
