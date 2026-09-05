import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calculator,
  Award,
  Layers,
} from 'lucide-react';
import { EmployeeData } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';
import { generateFullPensionPDF, PDFExportProgress } from '../utils/pdfExport';

interface Props {
  employee: EmployeeData;
}

// Govt of Sindh Finance Department Official Age Rate Commutation Table (Extract)
const SINDH_COMMUTATION_AGE_RATES: Record<number, number> = {
  50: 17.50,
  51: 16.92,
  52: 16.34,
  53: 15.77,
  54: 15.20,
  55: 14.64,
  56: 14.08,
  57: 13.53,
  58: 12.99,
  59: 12.45,
  60: 11.92,
  61: 11.40,
  62: 10.89,
  63: 10.38,
  64: 9.89,
  65: 9.40,
};

type SubDocType = 'all' | 'calc_sheet' | 'form1' | 'sanction' | 'lpr';

export const PensionPapersGenerator: React.FC<Props> = ({ employee }) => {
  // Pension Specific State
  const [dateOfBirth, setDateOfBirth] = useState('1966-07-15');
  const [dateOfRetirement, setDateOfRetirement] = useState('2026-07-14');
  const [retirementType, setRetirementType] = useState<'Superannuation (60 Years)' | 'Voluntary (25 Years Service)' | 'Invalid / Medical' | 'Family Pension'>('Superannuation (60 Years)');
  const [lastBasicPay, setLastBasicPay] = useState<number>(employee.basicPayRate || 68450);
  const [qualifyingYears, setQualifyingYears] = useState<number>(30);
  const [qualifyingMonths, setQualifyingMonths] = useState<number>(0);
  const [commutationPercentage, setCommutationPercentage] = useState<number>(35); // standard 35%
  const [ageNextBirthday, setAgeNextBirthday] = useState<number>(61);
  const [lprDaysEncashment, setLprDaysEncashment] = useState<number>(365); // standard 365 days
  const [nomineeName, setNomineeName] = useState('Mst. Fatima Bibi');
  const [nomineeRelation, setNomineeRelation] = useState('Wife / Widow');
  const [nomineeCnic, setNomineeCnic] = useState('41302-9876543-2');
  const [bankAccountNo, setBankAccountNo] = useState('01234567890123 (NBP Main Branch)');
  const [activeSubDoc, setActiveSubDoc] = useState<SubDocType>('all');
  const [isCopied, setIsCopied] = useState(false);

  // PDF Export Multi-Page State
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<PDFExportProgress | null>(null);

  // Calculations
  const ageRate = SINDH_COMMUTATION_AGE_RATES[ageNextBirthday] || 11.40;
  
  // Gross Pension Formula: [Qualifying Service Years (Max 30) * Last Basic Pay * 7] / 300
  const effectiveYears = Math.min(30, qualifyingYears + qualifyingMonths / 12);
  const grossPension = Math.round((effectiveYears * lastBasicPay * 7) / 300);
  
  // Commutation (35%)
  const commutedPensionPortion = Math.round((grossPension * commutationPercentage) / 100);
  const lumpSumCommutation = Math.round(commutedPensionPortion * ageRate * 12);
  
  // Net Monthly Pension (65% of Gross Pension)
  const netMonthlyPension = grossPension - commutedPensionPortion;
  
  // Medical Allowance for Pensioners (25% for BPS 1-15, 20% for BPS 16-22)
  const medicalAllowancePercent = employee.bps <= 15 ? 0.25 : 0.20;
  const pensionerMedicalAllowance = Math.round(netMonthlyPension * medicalAllowancePercent);
  
  // Ad-hoc increases on pension (estimated combined ~30% net relief)
  const adhocPensionRelief = Math.round(netMonthlyPension * 0.30);
  const totalMonthlyPensionPayable = netMonthlyPension + pensionerMedicalAllowance + adhocPensionRelief;

  // LPR 365 Days Encashment Amount
  const lprEncashmentAmount = Math.round((lastBasicPay * lprDaysEncashment) / 30);

  const handlePrint = () => {
    window.print();
  };

  /**
   * Downloads all 4 official pension papers into a single consolidated PDF dossier,
   * exactly like the TR-22 Arrears Bill multi-page generator.
   */
  const handleExportFullPensionPDF = async () => {
    try {
      await generateFullPensionPDF({
        employeeName: employee.name || 'Pensioner',
        pageElementIds: [
          'pension-dossier-page-1',
          'pension-dossier-page-2',
          'pension-dossier-page-3',
          'pension-dossier-page-4',
        ],
        onProgress: (progress) => {
          if (progress) {
            setIsGeneratingPDF(true);
            setPdfProgress(progress);
          } else {
            setIsGeneratingPDF(false);
            setPdfProgress(null);
          }
        },
      });
    } catch (err) {
      console.error('Pension complete dossier PDF export failed:', err);
      setIsGeneratingPDF(false);
      setPdfProgress(null);
    }
  };

  // ---------------- PAGE 1: COMMUTATION CALCULATION SHEET ----------------
  const renderCalcSheetPage = (elementId?: string) => (
    <div
      id={elementId}
      className="bg-white border-2 border-slate-300 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 min-h-[680px] font-serif relative"
    >
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-5 space-y-1">
        <div className="flex justify-center mb-1">
          <GovernmentEmblem size={48} className="w-12 h-12" />
        </div>
        <h2 className="font-bold text-base md:text-lg tracking-tight uppercase text-slate-950 font-sans">
          Government of Sindh
        </h2>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-sans">
          School Education & Literacy Department &bull; District Accounts Office {employee.district?.replace('_', ' ') || 'Sindh'}
        </p>
        <p className="text-[11px] font-bold text-purple-900 font-sans uppercase">
          OFFICIAL PENSION & 35% COMMUTATION CALCULATION PROFORMA (PAGE 1 OF 4)
        </p>
      </div>

      <div className="space-y-4 text-xs leading-relaxed font-sans">
        <table className="w-full border-collapse border border-slate-400 text-xs mb-4">
          <tbody>
            <tr className="bg-slate-100">
              <td className="border border-slate-400 p-2 font-bold w-1/3">1. Name of Civil Servant:</td>
              <td className="border border-slate-400 p-2 font-semibold">{employee.name} (S/o {employee.fatherName})</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">2. Designation & BPS Scale:</td>
              <td className="border border-slate-400 p-2">{employee.designation} (BPS-{employee.bps})</td>
            </tr>
            <tr className="bg-slate-100">
              <td className="border border-slate-400 p-2 font-bold">3. CNIC & SAP Personnel No:</td>
              <td className="border border-slate-400 p-2">{employee.cnic} &bull; P# {employee.personnelId}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">4. School & SEMIS Code:</td>
              <td className="border border-slate-400 p-2">{employee.schoolName} (SEMIS: {employee.semisCode})</td>
            </tr>
            <tr className="bg-slate-100">
              <td className="border border-slate-400 p-2 font-bold">5. Dates of Service:</td>
              <td className="border border-slate-400 p-2">
                DOB: <strong>{dateOfBirth}</strong> | Joining: <strong>{employee.appointmentDate}</strong> | Retirement: <strong>{dateOfRetirement}</strong>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">6. Qualifying Service Admitted:</td>
              <td className="border border-slate-400 p-2 font-bold text-indigo-900">
                {effectiveYears} Years ({qualifyingYears} Years, {qualifyingMonths} Months)
              </td>
            </tr>
          </tbody>
        </table>

        <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-800 border-b border-slate-200 pb-1">
            Mathematical Calculation as per Sindh Pension Rules
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>A. Last Basic Pay Drawn:</span>
                <span className="font-bold">Rs. {lastBasicPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>B. Gross Pension Formula:</span>
                <span className="font-bold font-mono">[{effectiveYears} × {lastBasicPay} × 7] / 300</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1 text-emerald-800 font-bold">
                <span>C. Gross Monthly Pension:</span>
                <span>Rs. {grossPension.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>D. 35% Commuted Portion:</span>
                <span className="font-bold">Rs. {commutedPensionPortion.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>E. Age Next Birthday Rate:</span>
                <span className="font-bold font-mono">{ageRate} (Age: {ageNextBirthday})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1 text-purple-900 font-bold">
                <span>F. Lump-Sum Commutation:</span>
                <span>Rs. {lumpSumCommutation.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-purple-950 space-y-1 mt-2">
            <div className="flex justify-between font-bold text-xs">
              <span>Total Lump-Sum 35% Commutation Payable by DAO:</span>
              <span className="text-sm">Rs. {lumpSumCommutation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-xs pt-1 border-t border-purple-200">
              <span>Net Monthly Pension Payable (65% + Medical + Ad-hoc):</span>
              <span className="text-sm text-emerald-800">Rs. {totalMonthlyPensionPayable.toLocaleString()} / mo</span>
            </div>
          </div>
        </div>

        <div className="pt-8 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-800 font-sans">
          <div>
            <div className="border-t border-slate-500 pt-1 font-bold">Prepared By / Assistant</div>
            <span>DDO Office {employee.taluka}</span>
          </div>
          <div>
            <div className="border-t border-slate-500 pt-1 font-bold">Verified by DDO</div>
            <span>{employee.ddoFirstLine}</span>
          </div>
          <div>
            <div className="border-t border-slate-500 pt-1 font-bold">District Accounts Officer</div>
            <span>DAO {employee.district?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------- PAGE 2: FORM 1 (25-POINT APPLICATION) ----------------
  const renderForm1Page = (elementId?: string) => (
    <div
      id={elementId}
      className="bg-white border-2 border-slate-300 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 min-h-[680px] font-serif relative"
    >
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-5 space-y-1">
        <div className="flex justify-center mb-1">
          <GovernmentEmblem size={48} className="w-12 h-12" />
        </div>
        <h2 className="font-bold text-base md:text-lg tracking-tight uppercase text-slate-950 font-sans">
          Government of Sindh
        </h2>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-sans">
          School Education & Literacy Department &bull; District Accounts Office {employee.district?.replace('_', ' ') || 'Sindh'}
        </p>
        <p className="text-[11px] font-bold text-purple-900 font-sans uppercase">
          FORM 1: APPLICATION FOR PENSION / COMMUTATION (PART I - IV) (PAGE 2 OF 4)
        </p>
      </div>

      <div className="space-y-3 text-xs leading-relaxed font-sans">
        <p className="text-[11px] text-slate-600 italic text-center">
          Part I - To be completed by the Retiring Civil Servant
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 border border-slate-300 p-3 rounded-lg">
          <div><strong>1. Name of Applicant:</strong> {employee.name}</div>
          <div><strong>2. Father's Name:</strong> {employee.fatherName}</div>
          <div><strong>3. Post & BPS:</strong> {employee.designation} (BPS-{employee.bps})</div>
          <div><strong>4. Personnel SAP No:</strong> {employee.personnelId}</div>
          <div><strong>5. CNIC Number:</strong> {employee.cnic}</div>
          <div><strong>6. Permanent Address:</strong> Taluka {employee.taluka}, District {employee.district?.replace('_', ' ')}</div>
          <div><strong>7. Date of Birth:</strong> {dateOfBirth}</div>
          <div><strong>8. Date of Joining:</strong> {employee.appointmentDate}</div>
          <div><strong>9. Date of Retirement:</strong> {dateOfRetirement}</div>
          <div><strong>10. Total Length of Service:</strong> {qualifyingYears} Years</div>
          <div><strong>11. Option for Commutation:</strong> {commutationPercentage}% Commutation</div>
          <div><strong>12. Bank Name & Account:</strong> {bankAccountNo}</div>
          <div><strong>13. Nominee Name:</strong> {nomineeName} ({nomineeRelation})</div>
          <div><strong>14. Nominee CNIC:</strong> {nomineeCnic}</div>
        </div>

        <div className="pt-4 text-xs font-serif space-y-2">
          <p>
            I hereby declare that I have verified the above particulars and request that my pension and 35% commutation case may kindly be processed for payment through the District Accounts Office.
          </p>
          <div className="flex justify-between pt-6">
            <div>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
            <div className="text-right">
              <div className="font-bold border-t border-slate-500 pt-1">Signature of Retiring Civil Servant</div>
              <span>{employee.name}</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-300">
          <div className="font-bold text-xs uppercase text-slate-800 mb-2">Part II - Verification by Head of Office / DDO</div>
          <p className="text-[11px] text-slate-700 italic">
            Certified that the service of Mr./Ms. {employee.name} has been thoroughly verified from the original Service Book and no departmental inquiry or audit recovery is pending against him/her.
          </p>
          <div className="flex justify-between pt-6 font-sans text-xs">
            <div>Official Stamp</div>
            <div className="text-right">
              <div className="font-bold border-t border-slate-500 pt-1">Drawing & Disbursing Officer (DDO)</div>
              <span>{employee.ddoFirstLine}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------- PAGE 3: PENSION SANCTION ORDER ----------------
  const renderSanctionPage = (elementId?: string) => (
    <div
      id={elementId}
      className="bg-white border-2 border-slate-300 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 min-h-[680px] font-serif relative"
    >
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-5 space-y-1">
        <div className="flex justify-center mb-1">
          <GovernmentEmblem size={48} className="w-12 h-12" />
        </div>
        <h2 className="font-bold text-base md:text-lg tracking-tight uppercase text-slate-950 font-sans">
          Government of Sindh
        </h2>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-sans">
          School Education & Literacy Department &bull; Office of the District Education Officer {employee.district?.replace('_', ' ') || 'Sindh'}
        </p>
        <p className="text-[11px] font-bold text-purple-900 font-sans uppercase">
          PENSION & 35% COMMUTATION FORMAL SANCTION ORDER (PAGE 3 OF 4)
        </p>
      </div>

      <div className="space-y-4 text-xs leading-relaxed font-serif">
        <div className="flex justify-between text-xs font-sans">
          <span>No. DEO/SELD/ESTT/PEN-2026/09</span>
          <span>Dated: {new Date().toLocaleDateString('en-GB')}</span>
        </div>

        <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide">
          OFFICE ORDER / PENSION SANCTION
        </div>

        <p className="text-justify indent-6">
          Sanction is hereby accorded under Rule 3.5 of the Sindh Civil Servants (Pension) Rules to the grant of <strong>{retirementType}</strong> in respect of <strong>Mr./Ms. {employee.name}</strong>, {employee.designation} (BPS-{employee.bps}), School {employee.schoolName}, Personnel No. {employee.personnelId}, CNIC No. {employee.cnic}, with effect from <strong>{dateOfRetirement}</strong>.
        </p>

        <p className="text-justify indent-6">
          The pension and 35% commutation are sanctioned based on <strong>{qualifyingYears} Years</strong> qualifying service and last basic pay of <strong>Rs. {lastBasicPay.toLocaleString()}</strong>, as verified by the DDO and authenticated in the Service Book.
        </p>

        <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg font-sans text-xs space-y-1">
          <div className="font-bold border-b border-slate-200 pb-1">Sanction Summary:</div>
          <div className="flex justify-between">
            <span>Gross Monthly Pension Sanctioned:</span>
            <strong>Rs. {grossPension.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between">
            <span>35% Lump-Sum Commutation Sanctioned:</span>
            <strong>Rs. {lumpSumCommutation.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between">
            <span>Net Monthly Pension Payable:</span>
            <strong>Rs. {totalMonthlyPensionPayable.toLocaleString()}</strong>
          </div>
        </div>

        <p className="text-justify indent-6">
          The expenditure involved is debitable under Major Head "SC21124 (124) - Administration of Secondary Education" under District Accounts Office {employee.district?.replace('_', ' ')}.
        </p>

        <div className="pt-10 flex justify-end font-sans">
          <div className="text-center w-64">
            <div className="border-t border-slate-800 pt-1 font-bold">DISTRICT EDUCATION OFFICER</div>
            <div className="text-slate-600 text-[11px]">Elementary, Secondary & Higher Secondary</div>
            <div className="text-slate-600 text-[11px]">{employee.district?.replace('_', ' ')}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 text-[10px] font-sans text-slate-600 space-y-0.5">
          <div className="font-bold">Copy forwarded for information and necessary action to:</div>
          <div>1. The Accountant General Sindh / District Accounts Officer, {employee.district?.replace('_', ' ')}.</div>
          <div>2. The Taluka Education Officer (TEO), {employee.taluka}.</div>
          <div>3. The Head Master / DDO concerned.</div>
          <div>4. The Official concerned.</div>
        </div>
      </div>
    </div>
  );

  // ---------------- PAGE 4: LPR ENCASHMENT PROFORMA ----------------
  const renderLprPage = (elementId?: string) => (
    <div
      id={elementId}
      className="bg-white border-2 border-slate-300 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 min-h-[680px] font-serif relative"
    >
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-5 space-y-1">
        <div className="flex justify-center mb-1">
          <GovernmentEmblem size={48} className="w-12 h-12" />
        </div>
        <h2 className="font-bold text-base md:text-lg tracking-tight uppercase text-slate-950 font-sans">
          Government of Sindh
        </h2>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-sans">
          School Education & Literacy Department &bull; District Accounts Office {employee.district?.replace('_', ' ') || 'Sindh'}
        </p>
        <p className="text-[11px] font-bold text-purple-900 font-sans uppercase">
          BILL FOR ENCASHMENT OF L.P.R (365 DAYS PROFORMA) (PAGE 4 OF 4)
        </p>
      </div>

      <div className="space-y-4 text-xs leading-relaxed font-serif">
        <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide">
          BILL FOR ENCASHMENT OF L.P.R (365 DAYS)
        </div>

        <p className="text-justify indent-6">
          Certified that <strong>Mr./Ms. {employee.name}</strong>, {employee.designation} (BPS-{employee.bps}), has applied for 365 days encashment of Leave Preparatory to Retirement (LPR) in lieu of 365 days leave on full pay as admissible under the Sindh Revised Leave Rules 1986.
        </p>

        <table className="w-full border-collapse border border-slate-400 text-xs font-sans my-4">
          <tbody>
            <tr className="bg-slate-100 font-bold">
              <td className="border border-slate-400 p-2">Item Description</td>
              <td className="border border-slate-400 p-2 text-right">Amount (PKR)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Last Basic Pay per month</td>
              <td className="border border-slate-400 p-2 text-right font-semibold">Rs. {lastBasicPay.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Total Encashment Days Admissible</td>
              <td className="border border-slate-400 p-2 text-right font-semibold">{lprDaysEncashment} Days</td>
            </tr>
            <tr className="bg-emerald-50 text-emerald-950 font-bold">
              <td className="border border-slate-400 p-2">Total LPR Encashment Amount Claimed</td>
              <td className="border border-slate-400 p-2 text-right text-sm">Rs. {lprEncashmentAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-justify indent-6 text-[11px] italic">
          It is certified that the applicant has at least {lprDaysEncashment} days leave on full pay at his/her credit in the Leave Account, and that he/she will not resume duty during the period of LPR.
        </p>

        <div className="pt-8 flex justify-between font-sans text-xs">
          <div>
            <div className="font-bold border-t border-slate-600 pt-1">Signature of Claimant</div>
            <span>{employee.name}</span>
          </div>
          <div className="text-right">
            <div className="font-bold border-t border-slate-600 pt-1">Drawing & Disbursing Officer (DDO)</div>
            <span>{employee.ddoFirstLine}</span>
          </div>
        </div>

        <div className="pt-8 text-center font-sans text-xs">
          <div className="inline-block border-t border-slate-600 pt-1 px-8 font-bold">
            Passed for Payment by District Accounts Office {employee.district?.replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Mobile-Optimized Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-md shrink-0 mt-0.5 sm:mt-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-bold text-base sm:text-lg lg:text-xl tracking-tight text-white">
                Sindh Civil Servants Pension Papers &amp; 35% Commutation Hub
              </h2>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Complete 4-Page Dossier
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Live editor and multi-page generator for official Form 1 (25-Points), 35% Commutation Sheet, Sanction Order, and LPR Encashment.
            </p>
          </div>
        </div>

        {/* Action Buttons - Clean Mobile Grid & Desktop Flex */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
          {/* Main Action: Download All Pension Papers */}
          <button
            onClick={handleExportFullPensionPDF}
            disabled={isGeneratingPDF}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-950/40 transition cursor-pointer disabled:opacity-50"
            title="Download all 4 official pension pages into a single consolidated PDF dossier"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">{isGeneratingPDF ? 'Generating...' : 'Download Dossier (PDF)'}</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Dual-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Form Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Pension Calculation & Parameters
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
              Live Auto-Calculate
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Retirement Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Type of Retirement
              </label>
              <select
                value={retirementType}
                onChange={(e) => setRetirementType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Superannuation (60 Years)">Superannuation (Age 60 Years)</option>
                <option value="Voluntary (25 Years Service)">Voluntary Retirement (25 Years Service)</option>
                <option value="Invalid / Medical">Invalid / Medical Board Retirement</option>
                <option value="Family Pension">Family Pension (Death in Service)</option>
              </select>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Retirement</label>
                <input
                  type="date"
                  value={dateOfRetirement}
                  onChange={(e) => setDateOfRetirement(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Pay & Service Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Last Basic Pay (PKR)</label>
                <input
                  type="number"
                  value={lastBasicPay}
                  onChange={(e) => setLastBasicPay(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualifying Service (Yrs)</label>
                <input
                  type="number"
                  value={qualifyingYears}
                  min={10}
                  max={35}
                  onChange={(e) => setQualifyingYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium font-mono"
                />
              </div>
            </div>

            {/* Commutation & Age Rate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commutation %</label>
                <select
                  value={commutationPercentage}
                  onChange={(e) => setCommutationPercentage(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                >
                  <option value={35}>35% (Govt of Sindh Rule)</option>
                  <option value={25}>25% (Optional)</option>
                  <option value={0}>0% (Full Monthly Pension)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age Next Birthday</label>
                <input
                  type="number"
                  value={ageNextBirthday}
                  min={50}
                  max={65}
                  onChange={(e) => setAgeNextBirthday(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Official Rate: <strong>{ageRate}</strong>
                </span>
              </div>
            </div>

            {/* Nominee & Bank Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Form 1 & Banking Proforma Particulars</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominee Name</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Relation</label>
                  <input
                    type="text"
                    value={nomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominee CNIC</label>
                <input
                  type="text"
                  value={nomineeCnic}
                  onChange={(e) => setNomineeCnic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Branch & Account No</label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* LPR Encashment Days */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1">
                LPR Encashment Admissible (Days)
              </label>
              <input
                type="number"
                value={lprDaysEncashment}
                max={365}
                onChange={(e) => setLprDaysEncashment(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium font-mono"
              />
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-purple-400 font-bold">
              Instant Entitlement Summary
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Gross Monthly:</span>
                <span className="font-bold text-white text-sm">Rs. {grossPension.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">35% Lump-Sum:</span>
                <span className="font-bold text-purple-300 text-sm">Rs. {lumpSumCommutation.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">65% Monthly Pension:</span>
                <span className="font-bold text-white text-sm">Rs. {netMonthlyPension.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Net Monthly:</span>
                <span className="font-bold text-amber-300 text-sm">Rs. {totalMonthlyPensionPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Form / A4 Preview Panel */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Sub-document Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 gap-2">
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveSubDoc('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                  activeSubDoc === 'all'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All 4 Pages (Dossier)</span>
              </button>

              <button
                onClick={() => setActiveSubDoc('calc_sheet')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeSubDoc === 'calc_sheet'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                1. Commutation
              </button>

              <button
                onClick={() => setActiveSubDoc('form1')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeSubDoc === 'form1'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                2. Form 1
              </button>

              <button
                onClick={() => setActiveSubDoc('sanction')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeSubDoc === 'sanction'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                3. Sanction
              </button>

              <button
                onClick={() => setActiveSubDoc('lpr')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeSubDoc === 'lpr'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                4. LPR
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleExportFullPensionPDF}
                disabled={isGeneratingPDF}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg flex items-center space-x-1.5 text-xs font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                title="Download all 4 pages into one official PDF file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPDF ? 'Generating...' : 'Download All Pages (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT VIEWER: Single or All 4 Pages */}
          {activeSubDoc === 'all' ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg flex justify-between items-center">
                  <span>Page 1 of 4: Pension &amp; 35% Commutation Calculation Proforma</span>
                  <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-md">Official DAO Sheet</span>
                </div>
                {renderCalcSheetPage('preview-pension-page-1')}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg flex justify-between items-center">
                  <span>Page 2 of 4: Form 1 - Application for Pension / Commutation (Part I - IV)</span>
                  <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-md">Civil Servant Application</span>
                </div>
                {renderForm1Page('preview-pension-page-2')}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg flex justify-between items-center">
                  <span>Page 3 of 4: Office of DEO - Formal Pension Sanction Order</span>
                  <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-md">Departmental Sanction</span>
                </div>
                {renderSanctionPage('preview-pension-page-3')}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg flex justify-between items-center">
                  <span>Page 4 of 4: Bill for Encashment of L.P.R. (365 Days Proforma)</span>
                  <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-md">Leave Encashment</span>
                </div>
                {renderLprPage('preview-pension-page-4')}
              </div>
            </div>
          ) : (
            <div>
              {activeSubDoc === 'calc_sheet' && renderCalcSheetPage('preview-pension-page-1')}
              {activeSubDoc === 'form1' && renderForm1Page('preview-pension-page-2')}
              {activeSubDoc === 'sanction' && renderSanctionPage('preview-pension-page-3')}
              {activeSubDoc === 'lpr' && renderLprPage('preview-pension-page-4')}
            </div>
          )}

        </div>

      </div>

      {/* Hidden Off-screen Staging Container with canonical IDs for generateFullPensionPDF */}
      <div
        id="pension-staging-container"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '794px',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: -9999,
        }}
        aria-hidden="true"
      >
        {renderCalcSheetPage('pension-dossier-page-1')}
        {renderForm1Page('pension-dossier-page-2')}
        {renderSanctionPage('pension-dossier-page-3')}
        {renderLprPage('pension-dossier-page-4')}
      </div>

      {/* Full-Screen PDF Generation Modal with Real-time Progress Feedback */}
      {isGeneratingPDF && pdfProgress && (
        <div className="fixed inset-0 z-[100000] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <div className="w-7 h-7 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div>
              <h3 className="text-base font-bold text-white">
                Generating Complete Pension Dossier
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Compiling 4 official Sindh Government pension proformas into one PDF
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Rendering Page {pdfProgress.current} of {pdfProgress.total}</span>
                <span className="text-purple-400 font-mono font-bold">
                  {Math.round((pdfProgress.current / pdfProgress.total) * 100)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${(pdfProgress.current / pdfProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate pt-1">
                {pdfProgress.pageTitle || 'Processing document...'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
