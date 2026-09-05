import React from 'react';
import { EmployeeData, ArrearsSummary } from '../types';
import { formatCurrency } from '../utils/numberToWords';

interface Props {
  employee: EmployeeData;
  summary: ArrearsSummary;
  id?: string;
}

export const TR22ObversePreview: React.FC<Props> = ({ employee, summary, id = 'tr22-obverse-page' }) => {
  const formatDateSimple = (dStr: string) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  const schoolOrOffice = employee.schoolName
    ? employee.schoolName.toUpperCase()
    : employee.ddoSecondLine
    ? employee.ddoSecondLine.toUpperCase()
    : `GGLSS BAGH BHATTI ${employee.district?.toUpperCase() || 'HYDERABAD'}`;

  return (
    <div
      id={id}
      className="bg-white text-black p-4 sm:p-6 max-w-[794px] mx-auto font-sans text-[10px] leading-tight relative"
      style={{ minHeight: '1123px', height: '1123px', width: '794px', boxSizing: 'border-box', position: 'relative' }}
    >
      <div>
        {/* Title block */}
        <div className="text-center font-serif font-bold uppercase space-y-0.5 mb-2">
          <div className="text-sm tracking-wider">FORM T.R.22</div>
          <div className="text-[11px] font-sans font-semibold">(See Rule 265)</div>
          <div className="text-xs tracking-widest font-sans font-bold">OBVERSE</div>
          <div className="text-[10px] font-sans font-bold">
            DETAILED PAY BILL OF PERMANENT/TEMPORARY ESTABLISHMENT OF {schoolOrOffice}
          </div>
          <div className="text-[10px] font-bold text-neutral-900 border-b border-black pb-1">
            FOR THE MONTH OF W.E.F.&nbsp;{formatDateSimple(employee.appointmentDate).toUpperCase()} TO{' '}
            {formatDateSimple(employee.arrearUptoDate).toUpperCase()} DISTRICT {employee.district?.toUpperCase()}
          </div>
        </div>

        {/* Top Details Table: 3 columns */}
        <div className="border border-black grid grid-cols-12 divide-x divide-black mb-2 text-[9.5px]">
          {/* Cell 1: Employee Header */}
          <div className="col-span-5 p-1.5 font-sans text-center flex flex-col justify-center">
            <div className="font-extrabold uppercase text-[11px]">{employee.name || '________________________'}</div>
            <div className="font-bold">
              ({employee.designation || 'PST'}) BPS-{employee.bps || '14'} P# {employee.personnelId || '________'}
            </div>
            <div className="font-semibold italic text-[9px] mt-0.5">
              Arrears of Salary Bill from {formatDateSimple(employee.appointmentDate)} to {formatDateSimple(employee.arrearUptoDate)}
            </div>
          </div>

          {/* Cell 2: Functions */}
          <div className="col-span-4 p-1.5 divide-y divide-black text-[9px]">
            <div className="py-0.5 flex justify-between">
              <span className="font-bold">Major Function:</span>
              <span className="font-mono ml-2">&nbsp;</span>
            </div>
            <div className="py-0.5 flex justify-between font-mono font-bold">
              <span className="font-sans font-bold">Minor Function:</span>
              <span className="ml-2">{employee.ddoCode || '________'}</span>
            </div>
            <div className="py-0.5 flex justify-between">
              <span className="font-bold">Detailed Function:</span>
              <span className="font-mono ml-2">&nbsp;</span>
            </div>
          </div>

          {/* Cell 3: Voucher info */}
          <div className="col-span-3 p-1.5 divide-y divide-black text-[9px]">
            <div className="py-0.5"><span className="font-bold">Voucher No.:</span>&nbsp;</div>
            <div className="py-0.5"><span className="font-bold">List:</span>&nbsp;</div>
            <div className="py-0.5"><span className="font-bold">For:</span>&nbsp;____________</div>
          </div>
        </div>

      {/* Main Grid: Left Rules Column, Right Detailed Object Accounts Table */}
      <div className="grid grid-cols-12 border border-black mb-2">
        {/* Left marginal rule column */}
        <div className="col-span-3 border-r border-black p-1.5 text-[8px] leading-tight text-neutral-800 space-y-2 bg-neutral-50/40">
          <div>
            <span className="font-bold text-black">1.</span> in the remarks (24) should be recorded all unusual permeant events such as deaths retirements which find no palace is the increment certificates of absentee statements
          </div>
          <div>
            <span className="font-bold text-black">2.</span> When an increment clamed operates to carry a Government Servant over an efficiency bar it should be supported by declaration that the Government servant is question is to pass the bar
          </div>
          <div>
            <span className="font-bold text-black">3.</span> The names of Government servants holding posts substantively should be interred in order of seniority as measured by substantive pay draw and below those will be shown the posts left vacant and men officiating the vacancies
          </div>
          <div>
            <span className="font-bold text-black">4.</span> Officiating pay should be recorded in sanction of bill appropriate to that in which the duty pay of Government servant after transfer is recorded
          </div>
          <div>
            <span className="font-bold text-black">5.</span> in case where any fund deduction are included in the pay bill a separate schedule showing the particulars of deduction relating to each funds should accompany bill
          </div>
        </div>

        {/* Right accounts table */}
        <div className="col-span-9 text-[9px]">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="text-center font-bold bg-neutral-100 text-[8.5px]">
                <th className="border border-black p-1.5 text-left pl-2">
                  Object
                </th>
                <th className="border border-black p-1.5 w-20 text-center">
                  Old Code
                </th>
                <th className="border border-black p-1.5 w-20 text-center">
                  New Code
                </th>
                <th className="border border-black p-1.5 w-24 text-right pr-2">
                  Amount Rs.
                </th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {/* Basic Salary */}
              <tr>
                <td className="border border-black p-0.5 pl-1.5">Pay of Temporary Establishment</td>
                <td className="border border-black p-0.5 text-center font-mono">01201</td>
                <td className="border border-black p-0.5 text-center font-mono">A01151</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-bold">{formatCurrency(summary.totalBasicPay)}</td>
              </tr>
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Total Basic Salary</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-bold">{formatCurrency(summary.totalBasicPay)}</td>
              </tr>

              {/* Regular Allowances */}
              {summary.totalHouseRent > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">House Rent Allowance</td>
                  <td className="border border-black p-0.5 text-center font-mono">02200</td>
                  <td className="border border-black p-0.5 text-center font-mono">A01202</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalHouseRent)}</td>
                </tr>
              )}
              {summary.totalConveyance > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">Conveyance Allowance</td>
                  <td className="border border-black p-0.5 text-center font-mono">02300</td>
                  <td className="border border-black p-0.5 text-center font-mono">A01203</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalConveyance)}</td>
                </tr>
              )}
              {summary.totalSpecialConveyance > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">Special Conveyance for disable Person</td>
                  <td className="border border-black p-0.5 text-center font-mono"></td>
                  <td className="border border-black p-0.5 text-center font-mono"></td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalSpecialConveyance)}</td>
                </tr>
              )}
              {summary.totalMedicalAllowance > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">Medical Allowance</td>
                  <td className="border border-black p-0.5 text-center font-mono">02600</td>
                  <td className="border border-black p-0.5 text-center font-mono">A01206</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalMedicalAllowance)}</td>
                </tr>
              )}
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Total Regular Allowances</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-bold">{formatCurrency(summary.totalRegularAllowances)}</td>
              </tr>

              {/* Other Allowances - ONLY Active Allowances */}
              {summary.totalTeachingAllowance > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Teaching Allowance</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalTeachingAllowance)}</td>
                </tr>
              )}
              {summary.totalAdhoc2017 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2017 (15%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2017)}</td>
                </tr>
              )}
              {summary.totalAdhoc2018 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2018 (10%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2018)}</td>
                </tr>
              )}
              {summary.totalAdhoc2019 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2019 (15%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2019)}</td>
                </tr>
              )}
              {summary.totalAdhoc2020 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2020 (10%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2020)}</td>
                </tr>
              )}
              {summary.totalAdhoc2021 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2021 (20%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2021)}</td>
                </tr>
              )}
              {summary.totalAdhoc2022 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2022 (15%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2022)}</td>
                </tr>
              )}
              {summary.totalDiffAllowance2022 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Differential Allowance Adc 01-15</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalDiffAllowance2022)}</td>
                </tr>
              )}
              {summary.totalAdhoc2023 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2023 (35%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2023)}</td>
                </tr>
              )}
              {summary.totalAdhoc2024 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2024 (25%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2024)}</td>
                </tr>
              )}
              {summary.totalAdhoc2025 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2025 (12%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2025)}</td>
                </tr>
              )}
              {summary.totalAdhoc2026 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Adhoc 2026 (7%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalAdhoc2026)}</td>
                </tr>
              )}
              {summary.totalDiffAllowance2026 > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Differential Allowance 2026 (2%)</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalDiffAllowance2026)}</td>
                </tr>
              )}
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Total Other Allowances</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-bold">{formatCurrency(summary.totalOtherAllowances)}</td>
              </tr>

              {/* Grand Total */}
              <tr className="font-extrabold bg-neutral-200 text-[9.5px]">
                <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Grand Total Establishment Charges</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-black">{formatCurrency(summary.grossAmount)}</td>
              </tr>

              {/* Deductions - Active Only */}
              {summary.totalDeductions > 0 && (
                <tr className="font-bold bg-neutral-50">
                  <td className="border border-black p-0.5 pl-1.5" colSpan={4}>Deductions:</td>
                </tr>
              )}
              {summary.totalGPF > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">* General Provident Fund________</td>
                  <td className="border border-black p-0.5 text-center font-mono">1503000</td>
                  <td className="border border-black p-0.5 text-center font-mono">G06103</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalGPF)}</td>
                </tr>
              )}
              {summary.totalBF > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">*Benevolent Fund (Federal Govt)_</td>
                  <td className="border border-black p-0.5 text-center font-mono">3315001</td>
                  <td className="border border-black p-0.5 text-center font-mono">G06202</td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalBF)}</td>
                </tr>
              )}
              {summary.totalGI > 0 && (
                <tr>
                  <td className="border border-black p-0.5 pl-1.5">Postal Life / Group Insurance___</td>
                  <td className="border border-black p-0.5 text-center font-mono"></td>
                  <td className="border border-black p-0.5 text-center font-mono"></td>
                  <td className="border border-black p-0.5 text-right font-mono pr-1.5">{formatCurrency(summary.totalGI)}</td>
                </tr>
              )}
              <tr className="font-bold bg-neutral-100">
                <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Total Deduction_____________</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-bold">{formatCurrency(summary.totalDeductions)}</td>
              </tr>
              <tr className="font-extrabold bg-neutral-100 text-[9.5px]">
                <td className="border border-black p-0.5 pl-1.5" colSpan={3}>Net Total______________________</td>
                <td className="border border-black p-0.5 text-right font-mono pr-1.5 font-black">{formatCurrency(summary.netPayableAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* In Words Box */}
      <div className="text-center font-serif font-bold text-[10.5px] text-neutral-900 my-3 px-2">
        {summary.amountInWords}
      </div>

      {/* Footnote */}
      <div className="text-center text-[8.5px] italic text-neutral-700">
        *Code Number Applicable to Government Servant be inserted from Code given on reverse
      </div>
      </div>

      {/* Footer Page Number - Bottom Right */}
      <div
        className="absolute bottom-8 right-10 text-xs font-sans text-neutral-600 font-semibold text-right"
        style={{ position: 'absolute', bottom: '32px', right: '40px', textAlign: 'right' }}
      >
        Page 3 of 6
      </div>
    </div>
  );
};
