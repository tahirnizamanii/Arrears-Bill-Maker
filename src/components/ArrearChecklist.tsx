import React from 'react';
import { ChecklistItem } from '../types';
import { CheckSquare, Square, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
}

export const ArrearChecklist: React.FC<Props> = ({ checklist, onToggle }) => {
  const completedCount = checklist.filter((c) => c.completed).length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
            Arrear Bill Submission Checklist
          </h3>
          <p className="text-xs text-neutral-500">
            Ensure all statutory documents are attested before submission to Accounts Office.
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
          {completedCount} / {checklist.length} Completed
        </span>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {checklist.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`flex items-start space-x-2.5 p-2.5 rounded-xl border transition cursor-pointer select-none ${
              item.completed
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                : 'bg-neutral-50/70 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <div className="mt-0.5">
              {item.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-neutral-400" />
              )}
            </div>
            <div>
              <span className="font-bold mr-1.5">{index + 1}.</span>
              <span className={item.completed ? 'line-through text-neutral-500' : ''}>
                {item.title}
              </span>
              {item.notes && (
                <span className="text-[10px] text-neutral-400 block">{item.notes}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions Box matching PDF Page 1 */}
      <div className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-950 space-y-1">
        <div className="font-bold flex items-center text-sky-900">
          <Info className="w-3.5 h-3.5 mr-1 text-sky-600" /> Official Processing Guide:
        </div>
        <p className="text-[11px] leading-relaxed text-sky-900">
          1. Fill your employee and date information carefully.
          2. Click <strong>Generate Complete PDF</strong> to download all 6 official pages.
          3. Print on standard A4 paper, obtain signatures and seals from your Drawing &amp; Disbursing Officer (TEO/DEO), attach appointment &amp; non-payment certificate, and submit to District Accounts Office.
        </p>
      </div>
    </div>
  );
};
