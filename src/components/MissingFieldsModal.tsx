import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  X,
  User,
  School,
  Calendar,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { MissingFieldItem } from '../utils/formValidation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  missingFields: MissingFieldItem[];
  onGoToField: (field: MissingFieldItem) => void;
  actionTitle?: string;
}

export const MissingFieldsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  missingFields,
  onGoToField,
  actionTitle = 'Generate Bill Documents',
}) => {
  if (!isOpen) return null;

  const firstMissing = missingFields[0];

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <User className="w-3.5 h-3.5 text-indigo-600" />;
      case 2:
        return <School className="w-3.5 h-3.5 text-emerald-600" />;
      case 3:
        return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
      case 4:
        return <Building className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="missing-fields-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-b border-rose-100 p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
            title="Close dialog"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] tracking-wide uppercase mb-1">
                Required Fields Mandatory
              </span>
              <h3
                id="missing-fields-title"
                className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
              >
                Incomplete Information &bull; Cannot {actionTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                All employee, institutional, and DDO treasury details must be filled so your official Sindh TR-22 and DAO adjustment schedule calculate authentic figures.
              </p>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-5 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs text-amber-900 font-medium flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span>
              <strong>{missingFields.length}</strong> required field{missingFields.length > 1 ? 's' : ''} left to complete:
            </span>
          </div>
          {firstMissing && (
            <button
              type="button"
              onClick={() => onGoToField(firstMissing)}
              className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-sm shrink-0"
            >
              <span>Jump to First Missing Field</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>

        {/* Scrollable Missing Fields List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2.5 divide-y divide-slate-100 max-h-[50vh]">
          {missingFields.map((item, idx) => (
            <div
              key={item.key}
              className={`pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 group`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {getStepIcon(item.step)}
                    <span>{item.stepTitle}</span>
                  </span>
                  <span className="text-rose-500 text-xs font-bold">* Required</span>
                </div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  {idx + 1}. {item.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-normal">
                  {item.hint}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onGoToField(item)}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs rounded-xl border border-indigo-200 hover:border-indigo-600 transition flex items-center justify-center space-x-1 shrink-0 self-start sm:self-center shadow-sm"
                title={`Open ${item.label} in form`}
              >
                <span>Fill This Field</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            Clicking any field opens it directly in the form
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition"
            >
              Dismiss
            </button>
            {firstMissing && (
              <button
                type="button"
                onClick={() => onGoToField(firstMissing)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                Start Filling
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
