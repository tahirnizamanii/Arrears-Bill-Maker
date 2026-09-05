import React, { useState, useMemo, useEffect } from 'react';
import { EmployeeData, AdminConfig } from '../types';
import { exportSingleDocumentToPDF } from '../utils/pdfExport';
import { GovernmentEmblem } from './GovernmentEmblem';
import {
  FileText,
  Download,
  Printer,
  Sliders,
  CheckCircle2,
  Building,
  User,
  CreditCard,
  PlusCircle,
  Trash2,
  Sparkles,
  GraduationCap,
  MapPin,
  Landmark,
  Calendar,
  Layers,
} from 'lucide-react';

interface Props {
  employee: EmployeeData;
  adminConfig?: AdminConfig;
}

interface LoanItem {
  id: string;
  loanCode: string;
  description: string;
  principalAmount: number;
  monthlyDeduction: number;
  balance: number;
}

type TeachingQualification = 'bed' | 'ptc' | 'none' | 'custom';

export const SalarySlipGenerator: React.FC<Props> = ({ employee, adminConfig }) => {
  // --- STATE CONTROLS ---

  // Pay Scale & Stage parameters
  const [bpsGrade, setBpsGrade] = useState<number>(employee.bps === 16 ? 16 : 14);
  const [payStage, setPayStage] = useState<number>(0);
  const [scaleYear, setScaleYear] = useState<'2026' | '2022'>('2026');
  const [slipMonth, setSlipMonth] = useState<string>('August 2026');
  const [districtOffice, setDistrictOffice] = useState<string>(
    employee.district ? `District Accounts Office ${employee.district}` : 'District Accounts Office Hyderabad'
  );

  // House Rent & Professional Allowance
  const [houseRentType, setHouseRentType] = useState<'Urban' | 'Rural'>(
    employee.houseRentType || 'Urban'
  );
  const [teachingQualification, setTeachingQualification] = useState<TeachingQualification>('none');
  const [customTeachingAmount, setCustomTeachingAmount] = useState<number>(1000);
  const [isSpecialConveyance, setIsSpecialConveyance] = useState<boolean>(employee.isDisability || false);

  // Differential & Adhoc Overrides
  const [customDiffAllowance, setCustomDiffAllowance] = useState<number>(5237);
  const [customDiff2026, setCustomDiff2026] = useState<number>(590);
  const [includeAdhoc2026, setIncludeAdhoc2026] = useState<boolean>(true);

  // Employee Personal Information
  const [empName, setEmpName] = useState<string>(employee.name || 'FAIZA .');
  const [fatherName, setFatherName] = useState<string>(employee.fatherName || '');
  const [relationType, setRelationType] = useState<string>('');
  const [personnelNo, setPersonnelNo] = useState<string>(employee.personnelId || '11142184');
  const [cnic, setCnic] = useState<string>(employee.cnic || '4130414128076');
  const [ntn, setNtn] = useState<string>('');
  const [dob, setDob] = useState<string>(employee.dob || '07.03.1988');
  const [entryService, setEntryService] = useState<string>(employee.appointmentDate || '01.06.2025');
  const [lengthOfService, setLengthOfService] = useState<string>('01 Years 02 Months 003 Days');

  // Employment & Department Details
  const [employmentCategory, setEmploymentCategory] = useState<string>('Active Permanent');
  const [designation, setDesignation] = useState<string>(
    employee.designation === 'PST' ? 'PRIMARY SCHOOL TEACHER' : employee.designation || 'PRIMARY SCHOOL TEACHER'
  );
  const [departmentName, setDepartmentName] = useState<string>('00000006-Min. Of Education');
  const [ddoCodeFull, setDdoCodeFull] = useState<string>(
    employee.ddoCode ? `${employee.ddoCode}-TEO HYDERABAD TALUKA (F) P` : 'HB0380-TEO HYDERABAD TALUKA (F) P'
  );
  const [payrollSection, setPayrollSection] = useState<string>('003');
  const [gpfSection, setGpfSection] = useState<string>('001');
  const [cashCenter, setCashCenter] = useState<string>('');
  const [gpfAcNo, setGpfAcNo] = useState<string>('11142184');
  const [gpfInterestApplied, setGpfInterestApplied] = useState<string>('GPF Interest applied');
  const [gpfBalance, setGpfBalance] = useState<number>(3900);
  const [vendorNumber, setVendorNumber] = useState<string>('-');

  // Bank & Leaves
  const [accountNumber, setAccountNumber] = useState<string>(employee.bankAccount || '1256182601790801');
  const [bankDetails, setBankDetails] = useState<string>(
    employee.bankName
      ? `${employee.bankName}, ${employee.bankBranch || 'BRANCH'}`
      : 'BANK AL HABIB LIMITED THANDI SARAK BRANCH'
  );
  const [leavesOpening, setLeavesOpening] = useState<string>('');
  const [leavesAvailed, setLeavesAvailed] = useState<string>('');
  const [leavesEarned, setLeavesEarned] = useState<string>('');
  const [leavesBalance, setLeavesBalance] = useState<string>('');

  // Address & Contact Information
  const [permanentAddress, setPermanentAddress] = useState<string>('');
  const [city, setCity] = useState<string>(employee.district || 'HYDERABAD');
  const [domicile, setDomicile] = useState<string>('SN - Sindh');
  const [housingStatus, setHousingStatus] = useState<string>('No Official');
  const [tempAddress, setTempAddress] = useState<string>('');
  const [tempCity, setTempCity] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Loans & Advances
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [showAddLoan, setShowAddLoan] = useState<boolean>(false);
  const [newLoanType, setNewLoanType] = useState<string>('GPF Advance');
  const [newLoanPrincipal, setNewLoanPrincipal] = useState<number>(50000);
  const [newLoanDeduction, setNewLoanDeduction] = useState<number>(2500);
  const [newLoanBalance, setNewLoanBalance] = useState<number>(37500);

  // Income Tax Box
  const [taxPayable, setTaxPayable] = useState<number>(298.00);
  const [taxRecovered, setTaxRecovered] = useState<number>(30.00);
  const [taxExempted, setTaxExempted] = useState<number>(0);
  const [taxRecoverable, setTaxRecoverable] = useState<number>(268.00);

  // PDF Export & Mobile Preview View State
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [previewViewMode, setPreviewViewMode] = useState<'a4' | 'fit'>('a4');

  // Synchronize dynamic defaults when BPS changes
  useEffect(() => {
    if (bpsGrade === 16) {
      setCustomDiffAllowance(12258);
      setCustomDiff2026(1330);
      setGpfBalance(596675);
      setTaxPayable(72337.81);
      setTaxRecovered(9044.00);
      setTaxExempted(18083.51);
      setTaxRecoverable(45210.30);
    } else {
      setCustomDiffAllowance(5237);
      setCustomDiff2026(payStage === 0 ? 590 : 485);
      setGpfBalance(payStage === 0 ? 3900 : 101400);
      setTaxPayable(payStage === 0 ? 298.00 : 1301.36);
      setTaxRecovered(payStage === 0 ? 30.00 : 164.00);
      setTaxExempted(payStage === 0 ? 0 : 324.56);
      setTaxRecoverable(payStage === 0 ? 268.00 : 812.80);
    }
  }, [bpsGrade, payStage]);

  // Basic Pay matrix for 2026 vs 2022 (BPS-14 & BPS-16 only)
  const payScaleMatrix = useMemo(() => {
    if (scaleYear === '2026') {
      if (bpsGrade === 16) return { initial: 33720, increment: 2720, maxStages: 30 };
      return { initial: 27060, increment: 2090, maxStages: 30 }; // BPS-14
    } else {
      if (bpsGrade === 16) return { initial: 28070, increment: 2260, maxStages: 30 };
      return { initial: 22530, increment: 1740, maxStages: 30 }; // BPS-14
    }
  }, [bpsGrade, scaleYear]);

  // Basic Pay calculated by stage
  const basicPay = useMemo(() => {
    return payScaleMatrix.initial + payStage * payScaleMatrix.increment;
  }, [payScaleMatrix, payStage]);

  // Teaching Allowance amount
  const teachingAllowanceAmount = useMemo(() => {
    if (teachingQualification === 'bed') return 1000;
    if (teachingQualification === 'ptc') return 500;
    if (teachingQualification === 'custom') return customTeachingAmount;
    return 0;
  }, [teachingQualification, customTeachingAmount]);

  // Allowances & Deductions calculation
  const calculation = useMemo(() => {
    // 1. House Rent (1001)
    const hra = bpsGrade === 16
      ? (houseRentType === 'Urban' ? 4091 : 2807)
      : (houseRentType === 'Urban' ? 3321 : 2253);

    // 2. Conveyance Allowance (1210)
    let conveyance = bpsGrade === 16 ? 7500 : 4284;
    if (isSpecialConveyance) {
      conveyance += 2000;
    }

    // 3. Medical Allowance (1300)
    const medical = bpsGrade === 16 ? 1500 : 1375;

    // 4. Differential Allowance (2349 for 01-15, 2350 for 16-22)
    const isDiff16 = bpsGrade === 16;
    const diffWageCode = isDiff16 ? '2350' : '2349';
    const diffWageName = isDiff16 ? 'Differential Allw (16-22)' : 'Differential Allw (01-15)';
    const diffAllw = customDiffAllowance;

    // 5. Adhoc Relief 2023 35% (2378)
    const adhoc2023 = bpsGrade === 16
      ? (payStage >= 17 ? 20898 : Math.round((28070 + payStage * 2260) * 0.35))
      : 7885;

    // 6. Adhoc Relief 2024 25% (2393)
    const adhoc2024 = bpsGrade === 16
      ? (payStage >= 17 ? 16622 : Math.round((28070 + payStage * 2260) * 0.25))
      : (payStage === 0 ? 6765 : (scaleYear === '2026' ? Math.round(basicPay * 0.25) : 6067));

    // 7. Adhoc Relief 2026 (7%) (2456)
    const adhoc2026 = includeAdhoc2026 ? (bpsGrade === 14 && payStage === 0 ? 1894 : Math.round(basicPay * 0.07)) : 0;

    // 8. Differential Allow - 2026 (2459)
    const diff2026 = includeAdhoc2026 ? (bpsGrade === 14 && payStage === 0 && customDiff2026 === 485 ? 590 : customDiff2026) : 0;

    // Allowances List (Left Column / Right Column paired)
    const leftAllowances = [
      { code: '0001', name: 'Basic Pay', amount: basicPay },
      { code: '1210', name: 'Convey Allowance 2005', amount: conveyance },
      ...(teachingAllowanceAmount > 0
        ? [{ code: '1838', name: 'Teaching Allowance(2005)', amount: teachingAllowanceAmount }]
        : []),
      { code: '2378', name: 'Adhoc Relief All 2023 35%', amount: adhoc2023 },
      ...(adhoc2026 > 0 ? [{ code: '2456', name: 'Adhoc Relief 2026 (7%)', amount: adhoc2026 }] : []),
    ];

    const rightAllowances = [
      { code: '1001', name: `House Rent Allowance ${houseRentType === 'Urban' ? '45%' : 'Rural'}`, amount: hra },
      { code: '1300', name: 'Medical Allowance', amount: medical },
      ...(diffAllw > 0 ? [{ code: diffWageCode, name: diffWageName, amount: diffAllw }] : []),
      { code: '2393', name: 'Adhoc Relief All 2024 25%', amount: adhoc2024 },
      ...(diff2026 > 0 ? [{ code: '2459', name: 'Differential Allow - 2026', amount: diff2026 }] : []),
    ];

    // Align length of left and right tables
    const maxRows = Math.max(leftAllowances.length, rightAllowances.length);
    const alignedAllowancesRows: { left?: typeof leftAllowances[0]; right?: typeof rightAllowances[0] }[] = [];
    for (let i = 0; i < maxRows; i++) {
      alignedAllowancesRows.push({
        left: leftAllowances[i],
        right: rightAllowances[i],
      });
    }

    const allAllowances = [...leftAllowances, ...rightAllowances];
    const grossPay = allAllowances.reduce((acc, curr) => acc + curr.amount, 0);

    // Deductions: General (BPS-14 vs BPS-16)
    const gpfCode = bpsGrade === 16 ? '3016' : '3014';
    const gpf = bpsGrade === 16 ? 4960 : 3900;
    const bf = bpsGrade === 16 ? (payStage >= 15 ? 1199 : 650) : (payStage === 0 ? 406 : 437);
    const gi = bpsGrade === 16 ? 697 : 464;
    const incomeTax = bpsGrade === 16 ? (payStage >= 15 ? 4522 : 850) : (payStage === 0 ? 30 : 82);

    const leftDeductions = [
      { code: gpfCode, name: 'GPF Subscription', amount: gpf },
      { code: '3508', name: 'Group Insurance Sindh', amount: gi },
    ];

    const rightDeductions = [
      { code: '3506', name: 'BenevolentFund sind6-19', amount: bf },
      { code: '3609', name: 'Income Tax', amount: incomeTax },
    ];

    const maxDedRows = Math.max(leftDeductions.length, rightDeductions.length);
    const alignedDeductionsRows: { left?: typeof leftDeductions[0]; right?: typeof rightDeductions[0] }[] = [];
    for (let i = 0; i < maxDedRows; i++) {
      alignedDeductionsRows.push({
        left: leftDeductions[i],
        right: rightDeductions[i],
      });
    }

    const allDeductions = [...leftDeductions, ...rightDeductions];
    const totalGeneralDeductions = allDeductions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalLoanDeductions = loans.reduce((acc, curr) => acc + curr.monthlyDeduction, 0);
    const totalDeductions = totalGeneralDeductions + totalLoanDeductions;
    const netPay = grossPay - totalDeductions;

    return {
      alignedAllowancesRows,
      grossPay,
      alignedDeductionsRows,
      totalGeneralDeductions,
      totalLoanDeductions,
      totalDeductions,
      netPay,
    };
  }, [
    basicPay,
    bpsGrade,
    houseRentType,
    teachingAllowanceAmount,
    isSpecialConveyance,
    customDiffAllowance,
    customDiff2026,
    includeAdhoc2026,
    payStage,
    loans,
  ]);

  const handleAddLoan = () => {
    if (newLoanDeduction <= 0) return;
    const newLoan: LoanItem = {
      id: `loan_${Date.now()}`,
      loanCode: `0${loans.length + 1}`,
      description: newLoanType,
      principalAmount: newLoanPrincipal,
      monthlyDeduction: newLoanDeduction,
      balance: newLoanBalance,
    };
    setLoans([...loans, newLoan]);
    setShowAddLoan(false);
  };

  const handleRemoveLoan = (id: string) => {
    setLoans(loans.filter((l) => l.id !== id));
  };

  const handleExportPDF = async () => {
    try {
      const cleanName = (empName || 'Employee').replace(/[^a-zA-Z0-9]/g, '_');
      await exportSingleDocumentToPDF(
        'official-salary-slip-document',
        `Sindh_Govt_Salary_Slip_BPS${bpsGrade}_${cleanName}_${slipMonth}.pdf`,
        setIsExportingPDF
      );
    } catch (err) {
      console.error('Salary slip PDF export failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Hero Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white border border-slate-700 shadow-xl no-print">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
                Government of Sindh &bull; Computerized SAP Payroll
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 whitespace-nowrap">
                District Accounts Office Official Salary Statement
              </span>
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white mt-1.5 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Monthly Salary Statement (Official AG / DAO Format)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Exact replica of Sindh District Accounts Office computerized pay slip with live pay stages, BPS-14/16 scales, B.Ed / PTC allowances, and official banking particulars.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-slate-800 sm:border-t-0">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center transition shadow-md shadow-emerald-950/30 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-1.5 shrink-0" />
              <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Editor & Right Exact Authentic Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PARAMETER EDITOR & CONTROLS */}
        <div className="lg:col-span-5 space-y-4 no-print">
          {/* Card 1: Pay Stage & Allowances Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Pay Scale &amp; Stage Adjustments</span>
              </h3>
              <span className="text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Basic Pay: Rs. {basicPay.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  BPS Grade
                </label>
                <select
                  value={bpsGrade}
                  onChange={(e) => setBpsGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white transition"
                >
                  <option value={14}>BPS-14 (Primary School Teacher / JEST)</option>
                  <option value={16}>BPS-16 (High School Teacher / Senior PST)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pay Scale Framework
                </label>
                <select
                  value={scaleYear}
                  onChange={(e) => setScaleYear(e.target.value as '2026' | '2022')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white transition"
                >
                  <option value="2026">BPS For - 2026 (Revised)</option>
                  <option value="2022">BPS For - 2022 Scale</option>
                </select>
              </div>
            </div>

            {/* Pay Stage Interactive Stepper & Slider */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Pay Stage (Increments Earned)
                </label>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setPayStage(Math.max(0, payStage - 1))}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-md min-w-[32px] text-center">
                    Stage {payStage}
                  </span>
                  <button
                    onClick={() => setPayStage(Math.min(payScaleMatrix.maxStages, payStage + 1))}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={30}
                value={payStage}
                onChange={(e) => setPayStage(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Stage 0 (Rs. {payScaleMatrix.initial.toLocaleString()})</span>
                <span>Stage 1 (Rs. {(payScaleMatrix.initial + payScaleMatrix.increment).toLocaleString()})</span>
                <span>Stage 17 (Rs. {(payScaleMatrix.initial + 17 * payScaleMatrix.increment).toLocaleString()})</span>
              </div>
            </div>

            {/* Teaching Qualification Allowance Section */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Teaching Allowance 1838</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +Rs. {teachingAllowanceAmount.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTeachingQualification('bed')}
                  className={`py-1.5 px-2 rounded-lg font-bold border transition text-center cursor-pointer ${
                    teachingQualification === 'bed'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  B.Ed / M.Ed (1,000)
                </button>
                <button
                  type="button"
                  onClick={() => setTeachingQualification('ptc')}
                  className={`py-1.5 px-2 rounded-lg font-bold border transition text-center cursor-pointer ${
                    teachingQualification === 'ptc'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  PTC / CT (500)
                </button>
                <button
                  type="button"
                  onClick={() => setTeachingQualification('none')}
                  className={`py-1.5 px-2 rounded-lg font-bold border transition text-center cursor-pointer ${
                    teachingQualification === 'none'
                      ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  None (0)
                </button>
              </div>
            </div>

            {/* House Rent & Adhoc 2026 */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">House Rent Allowance (1001)</span>
                  <span className="text-[10px] text-slate-500">
                    {houseRentType === 'Urban'
                      ? (bpsGrade === 16 ? 'Urban 45% (Rs. 4,091)' : 'Urban 45% (Rs. 3,321)')
                      : (bpsGrade === 16 ? 'Rural 30% (Rs. 2,807)' : 'Rural 30% (Rs. 2,253)')}
                  </span>
                </div>
                <div className="flex rounded-lg border border-slate-300 p-0.5 bg-white">
                  <button
                    type="button"
                    onClick={() => setHouseRentType('Urban')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      houseRentType === 'Urban' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Urban (45%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHouseRentType('Rural')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      houseRentType === 'Rural' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Rural (30%)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">2026 Adhoc Relief 7% (2456) &amp; Diff</span>
                  <span className="text-[10px] text-slate-500">
                    {bpsGrade === 16 ? '7% on Basic (Rs. 5,597) + Diff Rs. 1,330' : '7% on Basic (Rs. 2,040) + Diff Rs. 485'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAdhoc2026}
                    onChange={(e) => setIncludeAdhoc2026(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Personal & Official Particulars */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Official Employee Information</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-0.5">District Accounts Office Header</label>
                <input
                  type="text"
                  value={districtOffice}
                  onChange={(e) => setDistrictOffice(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Employee Name</label>
                <input
                  type="text"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Father / Husband Name</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Personnel Number</label>
                <input
                  type="text"
                  value={personnelNo}
                  onChange={(e) => setPersonnelNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">CNIC Number</label>
                <input
                  type="text"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Date of Birth</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Entry into Govt. Service</label>
                <input
                  type="text"
                  value={entryService}
                  onChange={(e) => setEntryService(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-0.5">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-0.5">DDO Code &amp; Office</label>
                <input
                  type="text"
                  value={ddoCodeFull}
                  onChange={(e) => setDdoCodeFull(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Salary Month</label>
                <input
                  type="text"
                  value={slipMonth}
                  onChange={(e) => setSlipMonth(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-0.5">GPF Balance (Rs.)</label>
                <input
                  type="number"
                  value={gpfBalance}
                  onChange={(e) => setGpfBalance(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Bank & Account Details */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>Bank &amp; Payment Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Bank Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5">Bank &amp; Branch Details</label>
                <input
                  type="text"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Loans & Advances Deductions */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Loans &amp; Advances Deductions</span>
              </h3>
              <button
                onClick={() => setShowAddLoan(!showAddLoan)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{showAddLoan ? 'Cancel' : 'Add Loan'}</span>
              </button>
            </div>

            {showAddLoan && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Loan Description</label>
                    <select
                      value={newLoanType}
                      onChange={(e) => setNewLoanType(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                    >
                      <option value="GPF Advance">GPF Advance</option>
                      <option value="Computer Loan">Computer Loan</option>
                      <option value="House Building Advance">House Building Advance</option>
                      <option value="Motorcycle Advance">Motorcycle Advance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Monthly Deduction (Rs.)</label>
                    <input
                      type="number"
                      value={newLoanDeduction}
                      onChange={(e) => setNewLoanDeduction(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Principal (Rs.)</label>
                    <input
                      type="number"
                      value={newLoanPrincipal}
                      onChange={(e) => setNewLoanPrincipal(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Balance (Rs.)</label>
                    <input
                      type="number"
                      value={newLoanBalance}
                      onChange={(e) => setNewLoanBalance(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddLoan}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Save Loan to Slip
                </button>
              </div>
            )}

            {loans.length > 0 ? (
              <div className="space-y-1.5">
                {loans.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{l.description}</span>
                      <span className="text-[10px] text-slate-500 block">
                        Bal: Rs. {l.balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-rose-600">
                        -Rs. {l.monthlyDeduction.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemoveLoan(l.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                No active loans. Click &quot;Add Loan&quot; if this employee has an ongoing GPF or computer advance.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EXACT AUTHENTIC OFFICIAL SINDH SALARY STATEMENT */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs text-white no-print">
            <span className="font-semibold text-emerald-400 flex items-center space-x-1.5 truncate">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">District Accounts Office Computerized Payslip</span>
            </span>

            <div className="flex items-center space-x-2 shrink-0">
              <div className="sm:hidden flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewViewMode('a4')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    previewViewMode === 'a4' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  100% A4
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewMode('fit')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    previewViewMode === 'fit' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Fit Screen
                </button>
              </div>

              <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                {slipMonth} &bull; BPS-{bpsGrade} &bull; Stage {payStage}
              </span>
            </div>
          </div>

          {/* Mobile swipe indicator banner */}
          <div className="sm:hidden bg-slate-800/60 border border-slate-700/80 rounded-lg px-3 py-1.5 text-[11px] text-slate-300 flex items-center justify-between no-print">
            <span>Official Sheet Preview</span>
            <span className="text-[10px] text-amber-300 font-medium">
              {previewViewMode === 'a4' ? '← Swipe horizontally to view full slip →' : 'Scaled to fit mobile screen'}
            </span>
          </div>

          {/* DOCUMENT PREVIEW CONTAINER - RESPONSIVE HORIZONTAL SCROLL & EXACT A4 SIZING */}
          <div className="w-full overflow-x-auto bg-slate-900/40 p-2 sm:p-4 rounded-2xl border border-slate-700/60 shadow-inner flex justify-start lg:justify-center">
            <div
              id="official-salary-slip-document"
              className={`bg-white text-black p-5 sm:p-7 md:p-8 shadow-2xl border border-slate-300 shrink-0 rounded-none print:shadow-none print:border-none print:p-0 print:w-full transition-transform origin-top-left ${
                previewViewMode === 'fit' ? 'w-full min-w-0 sm:w-[780px] sm:min-w-[780px]' : 'w-[780px] min-w-[780px]'
              }`}
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                color: '#000000',
                lineHeight: '1.3',
              }}
            >
              {/* 1. TOP HEADER SECTION */}
              <div className="relative mb-3 pb-0.5 border-b border-black">
                {/* Emblem at top right matching document */}
                <div className="absolute right-0 top-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center pointer-events-none">
                  <GovernmentEmblem className="w-full h-full object-contain" />
                </div>

                {/* Centered Government Headings */}
                <div className="text-center pr-14 pl-2 sm:pr-16 sm:pl-4">
                  <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-black" style={{ fontFamily: "'Times New Roman', serif" }}>
                    Government of Sindh
                  </h1>
                  <h2 className="text-xs sm:text-sm font-bold text-black mt-0.5">
                    {districtOffice}
                  </h2>
                  <h3 className="text-xs font-bold text-black mt-0.5">
                    Monthly Salary Statement ({slipMonth})
                  </h3>
                </div>
              </div>

              {/* 2. PERSONAL INFORMATION BLOCK */}
              <div className="text-[11px] leading-tight mb-2.5 text-black">
                <div className="font-bold text-black mb-1">
                  Personal Information of Mr/Ms <span className="font-black">{empName}</span> {relationType} <span className="font-black">{fatherName}</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                  <div>
                    <span className="font-bold">Personnel Number: </span>
                    <span className="font-mono">{personnelNo}</span>
                  </div>
                  <div>
                    <span className="font-bold">CNIC: </span>
                    <span className="font-mono">{cnic}</span>
                  </div>
                  <div>
                    <span className="font-bold">NTN: </span>
                    <span className="font-mono">{ntn}</span>
                  </div>
                  <div>
                    <span className="font-bold">Date of Birth: </span>
                    <span>{dob}</span>
                  </div>
                  <div>
                    <span className="font-bold">Entry into Service: </span>
                    <span>{entryService}</span>
                  </div>
                  <div>
                    <span className="font-bold">Length of Service: </span>
                    <span>{lengthOfService}</span>
                  </div>
                </div>
              </div>

              {/* 3. EMPLOYMENT CATEGORY & POSTING DETAILS */}
              <div className="text-[11px] leading-tight space-y-0.5 mb-2.5 text-black">
                <div>
                  <span className="font-bold">Employment Category: </span>{employmentCategory}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">Designation: </span>{designation}
                  </div>
                  <div>
                    <span>{departmentName}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold">DDO Code: </span>{ddoCodeFull}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">Payroll Section: </span>{payrollSection}
                  </div>
                  <div>
                    <span className="font-bold">GPF Section: </span>{gpfSection}
                  </div>
                  <div>
                    <span className="font-bold">Cash Center: </span>{cashCenter}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">GPF A/C No: </span>
                    <span className="font-mono">{gpfAcNo}</span>
                  </div>
                  <div>
                    <span>{gpfInterestApplied}</span>
                  </div>
                  <div>
                    <span className="font-bold">GPF Balance: </span>
                    <span className="font-mono">{gpfBalance.toLocaleString()}.00 (provisional)</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold">Vendor Number: </span>
                  <span className="font-mono">{vendorNumber}</span>
                </div>
              </div>

              {/* 4. PAY AND ALLOWANCES LINE */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-black mb-1">
                <div>
                  <span className="font-black">Pay and Allowances:</span>
                </div>
                <div>
                  <span>Pay scale: </span>BPS For - {scaleYear}
                </div>
                <div>
                  <span>Pay Scale Type: </span>Civil
                </div>
                <div>
                  <span>BPS: </span>{bpsGrade}
                </div>
                <div>
                  <span>Pay Stage: </span>{payStage}
                </div>
              </div>

              {/* 5. BOXED TABLE: PAY AND ALLOWANCES (2 Columns Layout) */}
              <table className="w-full border-collapse border border-black text-[10.5px] mb-2.5 font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <thead>
                  <tr className="border-b border-black font-bold">
                    <th className="border-r border-black py-0.5 px-2 text-center w-[35%]">Wage type</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[15%]">Amount</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[35%]">Wage type</th>
                    <th className="py-0.5 px-2 text-center w-[15%]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.alignedAllowancesRows.map((row, idx) => (
                    <tr key={`allw_${idx}`} className="border-b border-black/40">
                      {/* Left Column */}
                      <td className="border-r border-black py-0.5 px-2 text-left">
                        {row.left ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{row.left.code}</span>
                            <span>{row.left.name}</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="border-r border-black py-0.5 px-2 text-right font-mono">
                        {row.left ? `${row.left.amount.toLocaleString()}.00` : ''}
                      </td>

                      {/* Right Column */}
                      <td className="border-r border-black py-0.5 px-2 text-left">
                        {row.right ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{row.right.code}</span>
                            <span>{row.right.name}</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="py-0.5 px-2 text-right font-mono">
                        {row.right ? `${row.right.amount.toLocaleString()}.00` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 6. DEDUCTIONS - GENERAL HEADING & TABLE */}
              <div className="font-bold text-black text-[11px] mb-0.5">
                Deductions - General
              </div>
              <table className="w-full border-collapse border border-black text-[10.5px] mb-2.5 font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <thead>
                  <tr className="border-b border-black font-bold">
                    <th className="border-r border-black py-0.5 px-2 text-center w-[35%]">Wage type</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[15%]">Amount</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[35%]">Wage type</th>
                    <th className="py-0.5 px-2 text-center w-[15%]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.alignedDeductionsRows.map((row, idx) => (
                    <tr key={`ded_${idx}`} className="border-b border-black/40">
                      <td className="border-r border-black py-0.5 px-2 text-left">
                        {row.left ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{row.left.code}</span>
                            <span>{row.left.name}</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="border-r border-black py-0.5 px-2 text-right font-mono">
                        {row.left ? `-${row.left.amount.toLocaleString()}.00` : ''}
                      </td>

                      <td className="border-r border-black py-0.5 px-2 text-left">
                        {row.right ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{row.right.code}</span>
                            <span>{row.right.name}</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="py-0.5 px-2 text-right font-mono">
                        {row.right ? `-${row.right.amount.toLocaleString()}.00` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 7. DEDUCTIONS - LOANS AND ADVANCES */}
              <div className="font-bold text-black text-[11px] mb-0.5">
                Deductions - Loans and Advances
              </div>
              <table className="w-full border-collapse border border-black text-[10.5px] mb-2.5 font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <thead>
                  <tr className="border-b border-black font-bold">
                    <th className="border-r border-black py-0.5 px-2 text-center w-[10%]">Loan</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[40%]">Description</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[18%]">Principal amount</th>
                    <th className="border-r border-black py-0.5 px-2 text-center w-[16%]">Deduction</th>
                    <th className="py-0.5 px-2 text-center w-[16%]">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.length > 0 ? (
                    loans.map((l, idx) => (
                      <tr key={l.id} className="border-b border-black/40">
                        <td className="border-r border-black py-0.5 px-2 text-center font-mono">{l.loanCode || `0${idx + 1}`}</td>
                        <td className="border-r border-black py-0.5 px-2 text-left">{l.description}</td>
                        <td className="border-r border-black py-0.5 px-2 text-right font-mono">{l.principalAmount.toLocaleString()}.00</td>
                        <td className="border-r border-black py-0.5 px-2 text-right font-mono">-{l.monthlyDeduction.toLocaleString()}.00</td>
                        <td className="py-0.5 px-2 text-right font-mono">{l.balance.toLocaleString()}.00</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="h-4">
                      <td className="border-r border-black py-0.5 px-2"></td>
                      <td className="border-r border-black py-0.5 px-2"></td>
                      <td className="border-r border-black py-0.5 px-2"></td>
                      <td className="border-r border-black py-0.5 px-2"></td>
                      <td className="py-0.5 px-2"></td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* 8. DEDUCTIONS - INCOME TAX STATUS LINE */}
              <div className="font-bold text-black text-[11px] mb-0.5">
                Deductions - Income Tax
              </div>
              <div className="flex flex-wrap items-center justify-between text-[10.5px] text-black mb-2">
                <div>
                  <span className="font-bold">Payable: </span>
                  <span className="font-mono">{taxPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="font-bold">Recovered till {slipMonth.slice(0, 3).toUpperCase()}-2026: </span>
                  <span className="font-mono">{taxRecovered.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="font-bold">Exempted: </span>
                  <span className="font-mono">{taxExempted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="font-bold">Recoverable: </span>
                  <span className="font-mono">{taxRecoverable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* 9. GROSS PAY, DEDUCTIONS & NET PAY LINE */}
              <div className="flex flex-wrap items-center justify-between text-[11.5px] font-bold text-black mb-2 py-1 border-y border-black">
                <div>
                  <span>Gross Pay (Rs.): </span>
                  <span className="font-mono font-bold ml-1">{calculation.grossPay.toLocaleString()}.00</span>
                </div>
                <div>
                  <span>Deductions (Rs.): </span>
                  <span className="font-mono font-bold ml-1">-{calculation.totalDeductions.toLocaleString()}.00</span>
                </div>
                <div>
                  <span>Net Pay (Rs.): </span>
                  <span className="font-mono font-bold ml-1">{calculation.netPay.toLocaleString()}.00</span>
                </div>
              </div>

              {/* 10. PAYEE & BANK DETAILS */}
              <div className="text-[11px] leading-tight space-y-0.5 mb-2 text-black">
                <div>
                  <span className="font-bold">Payee Name: </span>{empName}
                </div>
                <div>
                  <span className="font-bold">Account Number: </span><span className="font-mono">{accountNumber}</span>
                </div>
                <div>
                  <span className="font-bold">Bank Details: </span>{bankDetails}
                </div>
              </div>

              {/* 11. LEAVES STATUS */}
              <div className="flex flex-wrap items-center text-[11px] text-black mb-2 space-x-6 sm:space-x-8">
                <div className="font-bold">Leaves:</div>
                <div>
                  <span className="font-bold">Opening Balance: </span>{leavesOpening}
                </div>
                <div>
                  <span className="font-bold">Availed: </span>{leavesAvailed}
                </div>
                <div>
                  <span className="font-bold">Earned: </span>{leavesEarned}
                </div>
                <div>
                  <span className="font-bold">Balance: </span>{leavesBalance}
                </div>
              </div>

              {/* 12. ADDRESS & DOMICILE DETAILS */}
              <div className="border-t border-black pt-1.5 text-[10.5px] leading-tight space-y-0.5 mb-3 text-black">
                <div>
                  <span className="font-bold">Permanent Address: </span>{permanentAddress}
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <span className="font-bold">City: </span>{city}
                  </div>
                  <div>
                    <span className="font-bold">Domicile: </span>{domicile}
                  </div>
                  <div>
                    <span className="font-bold">Housing Status: </span>{housingStatus}
                  </div>
                </div>
                <div>
                  <span className="font-bold">Temp. Address: </span>{tempAddress}
                </div>
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <span className="font-bold">City: </span>{tempCity}
                  </div>
                  <div>
                    <span className="font-bold">Email: </span>{email}
                  </div>
                </div>
              </div>

              {/* 13. OFFICIAL FOOTER APPM & DISCLAIMER */}
              <div className="text-[9px] italic text-black/90 space-y-0.5 pt-1" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <div>System generated document in accordance with APPM 4.6.12.9(10041825/24.08.2026/v3.0)</div>
                <div>* All amounts are in Pak Rupees</div>
                <div>* Errors &amp; omissions excepted (SERVICES/04.09.2026/10:04:38)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
