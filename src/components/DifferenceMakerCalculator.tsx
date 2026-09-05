import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ArrowRight,
  Printer,
  Download,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Scale,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { EmployeeData } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';
import { exportSingleDocumentToPDF } from '../utils/pdfExport';

interface Props {
  employee: EmployeeData;
}

export const DifferenceMakerCalculator: React.FC<Props> = ({ employee }) => {
  // Pay Difference Configuration State
  const [differenceType, setDifferenceType] = useState<'scale_revision' | 'upgradation' | 'increment_fixation' | 'custom'>('scale_revision');
  const [startMonth, setStartMonth] = useState('2022-07');
  const [endMonth, setEndMonth] = useState('2024-06');
  
  // Drawn (Old / Already Drawn) Side
  const [drawnScale, setDrawnScale] = useState(14);
  const [drawnBasic, setDrawnBasic] = useState(22530);
  const [drawnHra, setDrawnHra] = useState(2253);
  const [drawnConveyance, setDrawnConveyance] = useState(2856);
  const [drawnMedical, setDrawnMedical] = useState(1375);
  const [drawnAdhoc, setDrawnAdhoc] = useState(8500);
  const [drawnDeductions, setDrawnDeductions] = useState(4702);

  // Due (New / Should Have Been Drawn) Side
  const [dueScale, setDueScale] = useState(14);
  const [dueBasic, setDueBasic] = useState(27720);
  const [dueHra, setDueHra] = useState(3321);
  const [dueConveyance, setDueConveyance] = useState(2856);
  const [dueMedical, setDueMedical] = useState(1375);
  const [dueAdhoc, setDueAdhoc] = useState(11500);
  const [dueDeductions, setDueDeductions] = useState(5120);

  const [reasonTitle, setReasonTitle] = useState('Arrears of Revised Pay Scales 2022 / Scale Fixation Difference');
  const [isCopied, setIsCopied] = useState(false);

  // Calculate monthly differences
  const monthlyGrossDrawn = drawnBasic + drawnHra + drawnConveyance + drawnMedical + drawnAdhoc;
  const monthlyNetDrawn = monthlyGrossDrawn - drawnDeductions;

  const monthlyGrossDue = dueBasic + dueHra + dueConveyance + dueMedical + dueAdhoc;
  const monthlyNetDue = monthlyGrossDue - dueDeductions;

  const diffBasicMonthly = dueBasic - drawnBasic;
  const diffHraMonthly = dueHra - drawnHra;
  const diffAdhocMonthly = dueAdhoc - drawnAdhoc;
  const diffGrossMonthly = monthlyGrossDue - monthlyGrossDrawn;
  const diffDeductionMonthly = dueDeductions - drawnDeductions;
  const diffNetMonthly = monthlyNetDue - monthlyNetDrawn;

  // Calculate duration between start and end month
  const durationMonths = useMemo(() => {
    try {
      const [sY, sM] = startMonth.split('-').map(Number);
      const [eY, eM] = endMonth.split('-').map(Number);
      const months = (eY - sY) * 12 + (eM - sM) + 1;
      return Math.max(1, months);
    } catch {
      return 12;
    }
  }, [startMonth, endMonth]);

  const totalGrossDifference = diffGrossMonthly * durationMonths;
  const totalDeductionDifference = diffDeductionMonthly * durationMonths;
  const totalNetPayableDifference = diffNetMonthly * durationMonths;

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      const cleanName = (employee.name || 'CivilServant').replace(/[^a-zA-Z0-9]/g, '_');
      await exportSingleDocumentToPDF(
        'difference-maker-official-document',
        `Sindh_Pay_Difference_Statement_${cleanName}.pdf`,
        setIsExportingPDF
      );
    } catch (err) {
      console.error('Difference PDF export failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Mobile-Optimized Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-600/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-md shrink-0 mt-0.5 sm:mt-0">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-bold text-base sm:text-lg lg:text-xl tracking-tight text-white">
                Sindh Pay Scale &amp; Arrears Difference Maker
              </h2>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                Drawn vs Due
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Side-by-side pay differential calculator for Scale Revisions (2017 vs 2022), Upgradations, and Annual Increment Fixations.
            </p>
          </div>
        </div>

        {/* Action Buttons - Clean Mobile Grid & Desktop Flex */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-950/40 transition cursor-pointer disabled:opacity-50"
            title="Download high-resolution official PDF"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{isExportingPDF ? 'Exporting PDF...' : 'Export as PDF'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Dual-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE: Differential Input Configurator */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Drawn vs Due Parameters
              </h3>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
              {durationMonths} Months Total
            </span>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Difference Case Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Difference Cause / Adjustment Type
              </label>
              <select
                value={differenceType}
                onChange={(e: any) => {
                  setDifferenceType(e.target.value);
                  if (e.target.value === 'scale_revision') {
                    setReasonTitle('Difference of Revised Pay Scales 2022 over 2017 Scale');
                    setDrawnBasic(22530);
                    setDueBasic(27720);
                  } else if (e.target.value === 'upgradation') {
                    setReasonTitle('Difference of Upgradation from BPS-09/11 to BPS-14');
                    setDrawnBasic(17200);
                    setDueBasic(22530);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
              >
                <option value="scale_revision">Revised Pay Scales (2017 vs 2022 Revisions)</option>
                <option value="upgradation">Post Upgradation (e.g. BPS-09 to BPS-14)</option>
                <option value="increment_fixation">Annual Increment Fixation Difference</option>
                <option value="custom">Custom Difference Claim</option>
              </select>
            </div>

            {/* Claim Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Claim Subject / Title
              </label>
              <input
                type="text"
                value={reasonTitle}
                onChange={(e) => setReasonTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
              />
            </div>

            {/* Period Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Start Period (From)
                </label>
                <input
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  End Period (Upto)
                </label>
                <input
                  type="month"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* SIDE BY SIDE INPUT COMPARISON */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* ALREADY DRAWN COLUMN */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-2.5">
                <span className="font-bold text-rose-900 block text-xs border-b border-rose-200 pb-1 flex items-center justify-between">
                  <span>Already Drawn</span>
                  <span className="text-[10px] bg-rose-200 px-1.5 py-0.2 rounded text-rose-950 font-normal">Old Rate</span>
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-rose-800">Basic Pay</label>
                  <input
                    type="number"
                    value={drawnBasic}
                    onChange={(e) => setDrawnBasic(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-rose-300 rounded-lg text-xs font-bold text-rose-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-rose-800">House Rent (HRA)</label>
                  <input
                    type="number"
                    value={drawnHra}
                    onChange={(e) => setDrawnHra(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-rose-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-rose-800">Adhoc Reliefs Total</label>
                  <input
                    type="number"
                    value={drawnAdhoc}
                    onChange={(e) => setDrawnAdhoc(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-rose-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-rose-800">Total Deductions</label>
                  <input
                    type="number"
                    value={drawnDeductions}
                    onChange={(e) => setDrawnDeductions(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-rose-300 rounded-lg text-xs text-rose-700 font-semibold"
                  />
                </div>

                <div className="pt-1 text-[11px] text-rose-900 font-bold border-t border-rose-200">
                  Monthly Net Drawn: Rs. {monthlyNetDrawn.toLocaleString()}
                </div>
              </div>

              {/* SHOULD BE DRAWN (DUE) COLUMN */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-2.5">
                <span className="font-bold text-emerald-900 block text-xs border-b border-emerald-200 pb-1 flex items-center justify-between">
                  <span>Pay Due</span>
                  <span className="text-[10px] bg-emerald-200 px-1.5 py-0.2 rounded text-emerald-950 font-normal">New Rate</span>
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800">Basic Pay</label>
                  <input
                    type="number"
                    value={dueBasic}
                    onChange={(e) => setDueBasic(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800">House Rent (HRA)</label>
                  <input
                    type="number"
                    value={dueHra}
                    onChange={(e) => setDueHra(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800">Adhoc Reliefs Total</label>
                  <input
                    type="number"
                    value={dueAdhoc}
                    onChange={(e) => setDueAdhoc(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800">Total Deductions</label>
                  <input
                    type="number"
                    value={dueDeductions}
                    onChange={(e) => setDueDeductions(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs text-emerald-700 font-semibold"
                  />
                </div>

                <div className="pt-1 text-[11px] text-emerald-900 font-bold border-t border-emerald-200">
                  Monthly Net Due: Rs. {monthlyNetDue.toLocaleString()}
                </div>
              </div>

            </div>

          </div>

          {/* Quick Summary Total Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 mt-3">
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
              Total Difference Summary
            </span>
            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-300">Monthly Net Difference:</span>
              <span className="font-bold text-teal-300 text-sm">
                + Rs. {diffNetMonthly.toLocaleString()} / mo
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-300">Total Net Arrears Claimable ({durationMonths} Mo):</span>
              <span className="font-extrabold text-emerald-400 text-base">
                Rs. {totalNetPayableDifference.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT PANE: Live Official Difference Sheet */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-white">
            <span className="font-semibold text-teal-300 flex items-center space-x-1.5 truncate mr-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Official Sindh Difference Statement (TR-22 Schedule Format)</span>
            </span>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg flex items-center space-x-1.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                title="Download this statement as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExportingPDF ? 'Exporting...' : 'Export as PDF'}</span>
              </button>
            </div>
          </div>

          <div
            id="difference-maker-official-document"
            className="bg-white border-2 border-slate-300 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 min-h-[640px] font-serif"
          >
            
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-4 space-y-1">
              <div className="flex justify-center mb-1">
                <GovernmentEmblem size={44} className="w-11 h-11" />
              </div>
              <h2 className="font-bold text-base md:text-lg uppercase text-slate-950 font-sans">
                Government of Sindh
              </h2>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-sans">
                School Education & Literacy Department &bull; Office of the DDO {employee.taluka}
              </p>
              <p className="text-[11px] font-bold text-teal-900 font-sans uppercase">
                STATEMENT OF PAY & ALLOWANCES DIFFERENCE (DRAWN VS DUE)
              </p>
            </div>

            {/* Employee Banner */}
            <div className="grid grid-cols-2 gap-2 text-xs font-sans border border-slate-300 p-2.5 rounded-lg bg-slate-50 mb-4">
              <div><strong>Name:</strong> {employee.name} (S/o {employee.fatherName})</div>
              <div><strong>Designation & BPS:</strong> {employee.designation} (BPS-{employee.bps})</div>
              <div><strong>Personnel SAP No:</strong> {employee.personnelId}</div>
              <div><strong>CNIC No:</strong> {employee.cnic}</div>
              <div><strong>School / SEMIS:</strong> {employee.schoolName} ({employee.semisCode})</div>
              <div><strong>Period Claimed:</strong> {startMonth} to {endMonth} ({durationMonths} Months)</div>
            </div>

            {/* Comparison Table */}
            <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-4">
              <thead>
                <tr className="bg-slate-100 text-slate-900">
                  <th className="border border-slate-400 p-2 text-left">Pay Element</th>
                  <th className="border border-slate-400 p-2 text-right">Already Drawn (PKR)</th>
                  <th className="border border-slate-400 p-2 text-right">Pay Due (PKR)</th>
                  <th className="border border-slate-400 p-2 text-right bg-teal-50">Monthly Difference (PKR)</th>
                  <th className="border border-slate-400 p-2 text-right bg-teal-100 font-bold">Total ({durationMonths} Mo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold">1. Basic Pay</td>
                  <td className="border border-slate-400 p-2 text-right">{drawnBasic.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right">{dueBasic.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-50 font-semibold text-teal-900">+{diffBasicMonthly.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-100 font-bold text-teal-950">{(diffBasicMonthly * durationMonths).toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-400 p-2 font-semibold">2. House Rent (HRA)</td>
                  <td className="border border-slate-400 p-2 text-right">{drawnHra.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right">{dueHra.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-50">+{diffHraMonthly.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-100 font-semibold">{(diffHraMonthly * durationMonths).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold">3. Conveyance & Medical</td>
                  <td className="border border-slate-400 p-2 text-right">{(drawnConveyance + drawnMedical).toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right">{(dueConveyance + dueMedical).toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-50">0</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-100">0</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-400 p-2 font-semibold">4. Ad-hoc Reliefs & Allowances</td>
                  <td className="border border-slate-400 p-2 text-right">{drawnAdhoc.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right">{dueAdhoc.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-50 font-semibold">+{diffAdhocMonthly.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-100 font-semibold">{(diffAdhocMonthly * durationMonths).toLocaleString()}</td>
                </tr>
                <tr className="font-bold bg-slate-200">
                  <td className="border border-slate-400 p-2">TOTAL GROSS PAY</td>
                  <td className="border border-slate-400 p-2 text-right">{monthlyGrossDrawn.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right">{monthlyGrossDue.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-100">+{diffGrossMonthly.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-teal-200 font-bold">{totalGrossDifference.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-rose-800 font-semibold">Less: Deductions (GPF/BF/GI)</td>
                  <td className="border border-slate-400 p-2 text-right text-rose-800">-{drawnDeductions.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right text-rose-800">-{dueDeductions.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-rose-50 text-rose-900">-{diffDeductionMonthly.toLocaleString()}</td>
                  <td className="border border-slate-400 p-2 text-right bg-rose-100 text-rose-950 font-bold">-{totalDeductionDifference.toLocaleString()}</td>
                </tr>
                <tr className="font-extrabold bg-teal-700 text-white text-xs">
                  <td className="border border-teal-800 p-2.5">NET PAYABLE ARREARS CLAIM</td>
                  <td className="border border-teal-800 p-2.5 text-right font-normal">{monthlyNetDrawn.toLocaleString()}</td>
                  <td className="border border-teal-800 p-2.5 text-right font-normal">{monthlyNetDue.toLocaleString()}</td>
                  <td className="border border-teal-800 p-2.5 text-right">+{diffNetMonthly.toLocaleString()} / mo</td>
                  <td className="border border-teal-800 p-2.5 text-right text-sm">Rs. {totalNetPayableDifference.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* DDO Certificate */}
            <div className="text-xs font-serif pt-3 space-y-1">
              <p className="font-bold">Certificate by DDO:</p>
              <p className="text-justify text-[11px] leading-relaxed text-slate-700">
                Certified that the above pay differential has been accurately computed based on original service book record, DAO payroll history, and relevant Govt of Sindh Finance Department notifications. No prior payment for this difference has been claimed or drawn.
              </p>
            </div>

            {/* Signature Blocks */}
            <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs font-sans">
              <div>
                <div className="font-bold border-t border-slate-700 pt-1">Signature of Teacher / Civil Servant</div>
                <span>{employee.name} (P# {employee.personnelId})</span>
              </div>
              <div>
                <div className="font-bold border-t border-slate-700 pt-1">Drawing & Disbursing Officer (DDO)</div>
                <span>{employee.ddoFirstLine}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
