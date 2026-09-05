import React, { useState } from 'react';
import {
  Calculator,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Award,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
  Download,
} from 'lucide-react';
import { AdminConfig, EmployeeData } from '../types';
import { exportSingleDocumentToPDF } from '../utils/pdfExport';

interface Props {
  onSelectTool?: (toolId: string) => void;
  activeTool: string;
  adminConfig?: AdminConfig;
  onBackToArrears?: () => void;
  employee?: EmployeeData;
}

export const ToolsPortal: React.FC<Props> = ({
  onSelectTool,
  activeTool,
  adminConfig,
  onBackToArrears,
  employee,
}) => {
  // Mini interactive states for the auxiliary tools
  // GPF Calculator state
  const [gpfBps, setGpfBps] = useState(14);
  const [gpfYears, setGpfYears] = useState(5);
  const [gpfMonthlyDeposit, setGpfMonthlyDeposit] = useState(3900);
  const [gpfInterestRate, setGpfInterestRate] = useState(13.5); // Sindh Govt 13.5%

  // Tax Calculator state
  const [taxMonthlyGross, setTaxMonthlyGross] = useState(65000);

  const [isExportingGPF, setIsExportingGPF] = useState(false);
  const [isExportingTax, setIsExportingTax] = useState(false);

  const handleExportGPF = async () => {
    try {
      const cleanName = (employee?.name || 'Employee').replace(/[^a-zA-Z0-9]/g, '_');
      await exportSingleDocumentToPDF(
        'gpf-calculator-statement-card',
        `Sindh_GPF_Statement_${cleanName}.pdf`,
        setIsExportingGPF
      );
    } catch (err) {
      console.error('GPF PDF export failed:', err);
    }
  };

  const handleExportTax = async () => {
    try {
      const cleanName = (employee?.name || 'Employee').replace(/[^a-zA-Z0-9]/g, '_');
      await exportSingleDocumentToPDF(
        'tax-calculator-statement-card',
        `Sindh_Salary_Tax_Statement_${cleanName}.pdf`,
        setIsExportingTax
      );
    } catch (err) {
      console.error('Tax PDF export failed:', err);
    }
  };

  // Pension Calculator state
  const [pensionLastBasic, setPensionLastBasic] = useState(48500);
  const [pensionServiceYears, setPensionServiceYears] = useState(25);
  const [pensionAge, setPensionAge] = useState(60);

  // GPF Calculation logic
  const calculateGPF = () => {
    let totalContribution = 0;
    let totalBalance = 0;
    const monthlyRate = gpfInterestRate / 100 / 12;

    for (let m = 1; m <= gpfYears * 12; m++) {
      totalContribution += gpfMonthlyDeposit;
      totalBalance = (totalBalance + gpfMonthlyDeposit) * (1 + monthlyRate);
    }
    const totalProfit = Math.max(0, totalBalance - totalContribution);
    return {
      totalContribution: Math.round(totalContribution),
      totalProfit: Math.round(totalProfit),
      totalBalance: Math.round(totalBalance),
    };
  };

  // Tax Calculation logic (FBR Slabs 2024-2026)
  const calculateTax = () => {
    const annualGross = taxMonthlyGross * 12;
    let annualTax = 0;

    if (annualGross <= 600000) {
      annualTax = 0;
    } else if (annualGross <= 1200000) {
      annualTax = (annualGross - 600000) * 0.05;
    } else if (annualGross <= 2200000) {
      annualTax = 30000 + (annualGross - 1200000) * 0.15;
    } else if (annualGross <= 3200000) {
      annualTax = 180000 + (annualGross - 2200000) * 0.25;
    } else {
      annualTax = 430000 + (annualGross - 3200000) * 0.35;
    }

    return {
      annualGross,
      annualTax: Math.round(annualTax),
      monthlyTax: Math.round(annualTax / 12),
      effectiveRate: ((annualTax / annualGross) * 100).toFixed(1),
    };
  };

  // Pension Calculation logic (Sindh Govt Pension Rules)
  const calculatePension = () => {
    const qualifyingService = Math.min(30, Math.max(10, pensionServiceYears));
    const grossPension = (pensionLastBasic * qualifyingService * 7) / 300;
    const commutationShare = grossPension * 0.35; // 35% commutation
    const netMonthlyPension = grossPension * 0.65; // 65% monthly net pension
    // Commutation rate table lookup (Approx ~ 12.37 for age 60)
    const commutationFactor = 12.3719;
    const lumpSumCommutation = commutationShare * 12 * commutationFactor;

    return {
      grossPension: Math.round(grossPension),
      lumpSumCommutation: Math.round(lumpSumCommutation),
      netMonthlyPension: Math.round(netMonthlyPension),
    };
  };

  const gpfResult = calculateGPF();
  const taxResult = calculateTax();
  const pensionResult = calculatePension();

  return (
    <div className="space-y-6">
      {/* Tools Selector Header - Mobile-Optimized Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
              Sindh Education Department Financial Suite
            </span>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white mt-1.5">
              Sindh Government Teachers &amp; Civil Servants Tools Hub
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Select any calculator or switch back to the Arrears Bill Generator.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 shrink-0 pt-2 sm:pt-0 border-t border-slate-800 sm:border-t-0">
            {[
              { id: 'arrears', name: 'Arrears Bill', icon: FileText, activeClass: 'bg-emerald-600 text-white' },
              { id: 'salary-slip', name: 'Salary Slip', icon: FileText, activeClass: 'bg-teal-600 text-white' },
              { id: 'gpf', name: 'GPF Interest', icon: TrendingUp, activeClass: 'bg-blue-600 text-white' },
              { id: 'tax', name: 'Salary Tax', icon: Percent, activeClass: 'bg-amber-600 text-white' },
              { id: 'pension', name: 'Pension', icon: Award, activeClass: 'bg-purple-600 text-white' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (onSelectTool) {
                      onSelectTool(t.id);
                    } else if (t.id === 'arrears' && onBackToArrears) {
                      onBackToArrears();
                    }
                  }}
                  className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border cursor-pointer ${
                    isSelected
                      ? `${t.activeClass} border-white/20 shadow-md`
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AUXILIARY TOOL 1: GPF CALCULATOR */}
      {activeTool === 'gpf' && (
        <div id="gpf-calculator-statement-card" className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Sindh GPF (General Provident Fund) Balance &amp; Interest Calculator
                </h3>
                <p className="text-xs text-slate-500">
                  Calculates compound interest and total accumulated fund based on official Sindh Government rates.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportGPF}
              disabled={isExportingGPF}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-900/30 transition cursor-pointer self-end sm:self-auto disabled:opacity-50"
              title="Export GPF Calculation Statement as PDF"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingGPF ? 'Exporting...' : 'Export as PDF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Contribution Parameters
              </h4>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Monthly GPF Subscription (PKR)
                </label>
                <input
                  type="number"
                  value={gpfMonthlyDeposit}
                  onChange={(e) => setGpfMonthlyDeposit(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500">Standard BPS-14 rate: Rs. 3,900 / mo</span>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Service / Accumulation Period (Years)
                </label>
                <input
                  type="number"
                  value={gpfYears}
                  onChange={(e) => setGpfYears(Number(e.target.value) || 1)}
                  min={1}
                  max={40}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Annual Interest / Profit Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={gpfInterestRate}
                  onChange={(e) => setGpfInterestRate(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
                <span className="text-[10px] text-blue-600 font-medium">Sindh Finance notification: 13.5%</span>
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Principal Subscription
                </span>
                <div className="text-xl font-bold font-mono text-white">
                  Rs. {gpfResult.totalContribution.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400">Total salary deducted over {gpfYears} years</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-blue-300 uppercase font-semibold">
                  Accumulated Profit
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  Rs. {gpfResult.totalProfit.toLocaleString()}
                </div>
                <p className="text-[10px] text-blue-200">Compound interest earned</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">
                  Total Final Balance
                </span>
                <div className="text-xl font-bold font-mono text-white">
                  Rs. {gpfResult.totalBalance.toLocaleString()}
                </div>
                <p className="text-[10px] text-emerald-200">Available on retirement / advance</p>
              </div>

              <div className="col-span-full bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900 flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>GPF Advance Rules:</strong> Non-refundable advance is permitted after attaining 50 years of age or completing 15 years of service. Refundable advance is recoverable in up to 36 equal monthly installments.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUXILIARY TOOL 2: SALARY & ARREARS INCOME TAX ESTIMATOR */}
      {activeTool === 'tax' && (
        <div id="tax-calculator-statement-card" className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  FBR &amp; Sindh Salary Income Tax Estimator (FY 2024–2026 Slabs)
                </h3>
                <p className="text-xs text-slate-500">
                  Calculate monthly payroll tax deductions and tax liability on lump sum arrears payments.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportTax}
              disabled={isExportingTax}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-900/30 transition cursor-pointer self-end sm:self-auto disabled:opacity-50"
              title="Export Tax Calculation Statement as PDF"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingTax ? 'Exporting...' : 'Export as PDF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Monthly Income
              </h4>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Monthly Gross Salary (PKR)
                </label>
                <input
                  type="number"
                  value={taxMonthlyGross}
                  onChange={(e) => setTaxMonthlyGross(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500">Standard PST initial: ~Rs. 60,000 / mo</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-[11px] space-y-1">
                <div><strong>Annual Taxable:</strong> Rs. {taxResult.annualGross.toLocaleString()}</div>
                <div><strong>Effective Tax Rate:</strong> {taxResult.effectiveRate}%</div>
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Monthly Tax Deduction
                </span>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  Rs. {taxResult.monthlyTax.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400">Deducted from monthly payroll</p>
              </div>

              <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-indigo-300 uppercase font-semibold">
                  Annual Tax Liability
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  Rs. {taxResult.annualTax.toLocaleString()}
                </div>
                <p className="text-[10px] text-indigo-200">For tax year ending June 30th</p>
              </div>

              <div className="col-span-full border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-slate-800">FBR Income Tax Slabs for Salaried Individuals:</div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                  <li>Up to Rs. 600,000 / year: <strong>0% Tax</strong> (Tax Exempt)</li>
                  <li>Rs. 600,001 to Rs. 1,200,000: <strong>5% of amount exceeding Rs. 600,000</strong></li>
                  <li>Rs. 1,200,001 to Rs. 2,200,000: <strong>Rs. 30,000 + 15% exceeding Rs. 1.2M</strong></li>
                  <li>Rs. 2,200,001 to Rs. 3,200,000: <strong>Rs. 180,000 + 25% exceeding Rs. 2.2M</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUXILIARY TOOL 3: PENSION & COMMUTATION ESTIMATOR */}
      {activeTool === 'pension' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6 animate-in fade-in">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sindh Civil Servants Pension &amp; 35% Commutation Lump Sum Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Estimates pension entitlement upon superannuation (60 years) or voluntary retirement (25 years service).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Retirement Parameters
              </h4>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Last Drawn Basic Pay (PKR)
                </label>
                <input
                  type="number"
                  value={pensionLastBasic}
                  onChange={(e) => setPensionLastBasic(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Qualifying Service (Years)
                </label>
                <input
                  type="number"
                  value={pensionServiceYears}
                  onChange={(e) => setPensionServiceYears(Number(e.target.value) || 10)}
                  min={10}
                  max={30}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500">Capped at 30 years maximum</span>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Retirement Age (Years)
                </label>
                <input
                  type="number"
                  value={pensionAge}
                  onChange={(e) => setPensionAge(Number(e.target.value) || 60)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Gross Pension (100%)
                </span>
                <div className="text-xl font-bold font-mono text-white">
                  Rs. {pensionResult.grossPension.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400">Total monthly baseline entitlement</p>
              </div>

              <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-purple-300 uppercase font-semibold">
                  35% Commutation Cash
                </span>
                <div className="text-xl font-bold font-mono text-amber-300">
                  Rs. {pensionResult.lumpSumCommutation.toLocaleString()}
                </div>
                <p className="text-[10px] text-purple-200">Tax-free lump sum at retirement</p>
              </div>

              <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">
                  Net Monthly Pension (65%)
                </span>
                <div className="text-xl font-bold font-mono text-white">
                  Rs. {pensionResult.netMonthlyPension.toLocaleString()}
                </div>
                <p className="text-[10px] text-emerald-200">Payable monthly for life</p>
              </div>

              <div className="col-span-full bg-purple-50 border border-purple-200 p-4 rounded-2xl text-xs text-purple-900">
                <strong>Formula Reference:</strong> Gross Pension = (Last Basic Pay &times; Qualifying Service &times; 7) / 300. Commutation = 35% &times; 12 &times; Commutation Factor.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
