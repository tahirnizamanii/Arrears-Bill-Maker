import React from 'react';
import { EmployeeData, ArrearsSummary } from '../types';
import { formatCurrencyWithZero } from '../utils/numberToWords';
import { Calendar, Clock, DollarSign, Download, Printer, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface Props {
  employee: EmployeeData;
  summary: ArrearsSummary;
  onGeneratePDF: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  isGeneratingPDF: boolean;
}

export const AtAGlanceSummary: React.FC<Props> = ({
  employee,
  summary,
  onGeneratePDF,
  onExportExcel,
  onPrint,
  isGeneratingPDF,
}) => {
  const formatDateSimple = (dStr: string) => {
    if (!dStr) return '—';
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dStr;
  };

  return (
    <div className="bg-gradient-to-br from-cyan-700 via-teal-800 to-sky-900 text-white rounded-2xl p-5 shadow-xl border border-cyan-500/30 flex flex-col justify-between">
      <div>
        {/* Header Title */}
        <div className="text-center pb-3 border-b border-cyan-400/30 mb-4">
          <h2 className="text-xl font-black uppercase tracking-wider text-cyan-100">
            AT A GLANCE
          </h2>
          <span className="text-xs font-semibold text-cyan-200 uppercase tracking-widest">
            (Summary &amp; Key Figures)
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="space-y-2.5 text-xs font-semibold">
          {/* Joining Date */}
          <div className="flex items-center justify-between bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-400/20">
            <span className="text-cyan-200 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-cyan-300" /> Date of Joining:
            </span>
            <span className="font-mono font-bold text-sm text-white bg-cyan-900/60 px-3 py-1 rounded border border-cyan-400/30">
              {formatDateSimple(employee.appointmentDate)}
            </span>
          </div>

          {/* Arrear Upto Date */}
          <div className="flex items-center justify-between bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-400/20">
            <span className="text-cyan-200 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-cyan-300" /> Arrear made upto:
            </span>
            <span className="font-mono font-bold text-sm text-white bg-cyan-900/60 px-3 py-1 rounded border border-cyan-400/30">
              {formatDateSimple(employee.arrearUptoDate)}
            </span>
          </div>

          {/* Length of Arrears */}
          <div className="flex items-center justify-between bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-400/20">
            <span className="text-cyan-200 flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-amber-300" /> Total Length of Arrears:
            </span>
            <span className="font-bold text-xs text-amber-200 bg-amber-950/40 px-3 py-1 rounded border border-amber-400/30 text-right">
              {summary.totalLengthText}
            </span>
          </div>

          {/* Gross Amount */}
          <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg border border-white/20">
            <span className="text-white text-sm font-bold">Gross Amount:</span>
            <div className="text-right">
              <span className="text-xs text-cyan-200 mr-1.5">Rs.</span>
              <span className="font-mono font-black text-base text-white">
                {formatCurrencyWithZero(summary.grossAmount)}.00
              </span>
            </div>
          </div>

          {/* Total Deductions */}
          <div className="flex items-center justify-between bg-rose-950/50 p-2.5 rounded-lg border border-rose-400/30">
            <span className="text-rose-200 text-sm font-bold">Total Deductions:</span>
            <div className="text-right text-rose-300">
              <span className="text-xs mr-1.5">Rs.</span>
              <span className="font-mono font-black text-base">
                ({formatCurrencyWithZero(summary.totalDeductions)}.00)
              </span>
            </div>
          </div>

          {/* Net Payable Amount */}
          <div className="flex items-center justify-between bg-emerald-950/70 p-3 rounded-xl border-2 border-emerald-400 shadow-md">
            <span className="text-emerald-200 text-sm font-black uppercase tracking-wide">
              Net Payable Amount:
            </span>
            <div className="text-right text-emerald-300">
              <span className="text-xs mr-1.5">Rs.</span>
              <span className="font-mono font-black text-lg text-white">
                {formatCurrencyWithZero(summary.netPayableAmount)}.00
              </span>
            </div>
          </div>
        </div>

        {/* Amount in Words Box (Matches PDF Page 1 red text on light card) */}
        <div className="mt-3.5 bg-amber-50 text-red-700 p-3 rounded-xl border border-amber-300/80 text-center shadow-inner">
          <div className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-0.5">
            Amount In Words
          </div>
          <div className="font-serif font-bold text-xs md:text-sm leading-snug">
            {summary.amountInWords}
          </div>
        </div>
      </div>

      {/* Main Big CTA Button */}
      <div className="mt-5 space-y-2">
        <button
          id="btn-generate-pdf-main"
          onClick={onGeneratePDF}
          disabled={isGeneratingPDF}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-sm tracking-wide uppercase shadow-lg shadow-blue-950/40 border border-blue-400/40 flex items-center justify-center space-x-2 transition transform active:scale-95 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>{isGeneratingPDF ? 'Generating All Pages...' : 'Click Here to Generate PDF'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportExcel}
            className="py-2 px-3 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center justify-center transition"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-300" /> Excel Sheet
          </button>
          <button
            onClick={onPrint}
            className="py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-500/40 rounded-lg text-xs font-bold flex items-center justify-center transition"
          >
            <Printer className="w-4 h-4 mr-1 text-slate-300" /> Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};
