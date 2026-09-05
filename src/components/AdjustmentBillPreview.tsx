import React from 'react';
import { EmployeeData, ArrearsSummary } from '../types';
import { formatCurrency } from '../utils/numberToWords';
import { GovernmentEmblem } from './GovernmentEmblem';

interface Props {
  employee: EmployeeData;
  summary: ArrearsSummary;
  id?: string;
}

export const AdjustmentBillPreview: React.FC<Props> = ({ employee, summary, id = 'adjustment-bill-page' }) => {
  const formatDateSimple = (dStr: string) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  const periodString = `W.E.F.${formatDateSimple(employee.appointmentDate)} TO ${formatDateSimple(employee.arrearUptoDate)}`;

  return (
    <div
      id={id}
      className="bg-white text-black p-6 sm:p-8 max-w-[794px] mx-auto font-sans text-xs relative"
      style={{ minHeight: '1123px', height: '1123px', width: '794px', boxSizing: 'border-box', position: 'relative' }}
    >
      <div>
        {/* Top Header */}
        <div className="relative mb-3 pb-1">
          {/* Left Official Govt of Sindh Coat of Arms */}
          <div className="absolute left-1 top-0">
            <GovernmentEmblem size={58} mono={true} />
          </div>

          {/* Centered District Accounts Office Title Banner */}
          <div className="text-center pt-0.5">
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-black">
              OFFICE OF THE
            </div>
            <div className="bg-black text-white font-extrabold text-sm tracking-wider px-7 py-0.5 inline-block uppercase my-0.5">
              DISTRICT ACCOUNTS OFFICER
            </div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-black">
              {employee.district?.toUpperCase() || 'HYDERABAD'}
            </div>
          </div>

          {/* Right Non-Gazetted Indicator */}
          <div className="text-right text-[10px] font-extrabold tracking-wider -mt-3">
            (NON-GAZATTED)
          </div>
        </div>

        {/* Bill Period Bar */}
        <div className="text-center font-extrabold text-xs border-2 border-black py-1 uppercase tracking-wide bg-neutral-200 mb-3 shadow-none">
          ADJUSTMENT BILL FOR THE MONTH {periodString}
        </div>

        {/* Employee & DAO Meta Info (Clean, No Empty Placeholder Boxes) */}
        <div className="mb-3 text-black">
          <table className="w-full border-collapse border border-black text-[11px] table-fixed">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[24%]" />
              <col className="w-[24%]" />
              <col className="w-[24%]" />
            </colgroup>
            <tbody>
              {/* Row 1: Token No | Date | Section | Cost Centre */}
              <tr>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Token No.:</span>
                  <span className="font-mono text-neutral-800 ml-2">________</span>
                </td>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Date:</span>
                  <span className="font-mono text-neutral-800 ml-2">________</span>
                </td>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Section:</span>
                  <span className="font-bold font-mono text-black ml-2">{employee.costCenter || 'GA-III'}</span>
                </td>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Cost Centre:</span>
                  <span className="font-bold font-mono text-black ml-2">{employee.ddoCode || 'HB0398'}</span>
                </td>
              </tr>

              {/* Row 2: Department (spans 2) | Designation (spans 2) */}
              <tr>
                <td colSpan={2} className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Department:</span>
                  <span className="font-bold text-black ml-2">Education Department</span>
                </td>
                <td colSpan={2} className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Designation:</span>
                  <span className="font-bold text-black ml-2">
                    {employee.designation || 'PST'} (BPS-{employee.bps || '14'})
                  </span>
                </td>
              </tr>

              {/* Row 3: Personnel No | Name | S/o | CNIC */}
              <tr>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Personnel No.:</span>
                  <span className="font-bold font-mono text-black ml-2">
                    {employee.personnelId || '11139423'}
                  </span>
                </td>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">Name:</span>
                  <span className="font-bold uppercase text-black ml-2">
                    {employee.name || 'MUHAMMAD OWAIS'}
                  </span>
                </td>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">S/o:</span>
                  <span className="font-bold uppercase text-black ml-2">
                    {employee.fatherName || 'SHAMIM IQBAL'}
                  </span>
                </td>
                <td className="border border-black p-1.5 align-middle">
                  <span className="font-semibold text-[10.5px]">CNIC:</span>
                  <span className="font-bold font-mono text-black ml-2">
                    {employee.cnic || '41303-7744530-3'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      {/* Main Adjustment Items Table */}
      <div className="border border-black mb-2">
        <table className="w-full text-left border-collapse text-[10.5px]">
          <thead>
            <tr className="bg-neutral-100 font-bold border-b border-black text-center">
              <th className="border-r border-black py-0.5 px-2 w-28">Adjustment</th>
              <th className="border-r border-black py-0.5 px-3 text-left">Description</th>
              <th className="py-0.5 px-3 w-32 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black font-medium">
            {summary.totalBasicPay > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5801</td>
                <td className="border-r border-black py-0.5 px-3">Adj Basic Pay</td>
                <td className="py-0.5 px-3 text-right font-mono font-bold">{formatCurrency(summary.totalBasicPay)}</td>
              </tr>
            )}
            {summary.totalHouseRent > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5002</td>
                <td className="border-r border-black py-0.5 px-3">Adj House Rent</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalHouseRent)}</td>
              </tr>
            )}
            {summary.totalConveyance > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5011</td>
                <td className="border-r border-black py-0.5 px-3">Adj Conveyance Allowance</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalConveyance)}</td>
              </tr>
            )}
            {summary.totalMedicalAllowance > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5012</td>
                <td className="border-r border-black py-0.5 px-3">Adj Medical Allowance</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalMedicalAllowance)}</td>
              </tr>
            )}
            {summary.totalAdhoc2017 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">5990</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2017</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2017)}</td>
              </tr>
            )}
            {summary.totalAdhoc2018 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">5322</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2018</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2018)}</td>
              </tr>
            )}
            {summary.totalAdhoc2019 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">5336</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2019</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2019)}</td>
              </tr>
            )}
            {summary.totalAdhoc2020 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">5130</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2020</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2020)}</td>
              </tr>
            )}
            {summary.totalAdhoc2021 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">5151</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2021</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2021)}</td>
              </tr>
            )}
            {summary.totalAdhoc2022 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5358</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2022 15%</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2022)}</td>
              </tr>
            )}
            {summary.totalDiffAllowance2022 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5359</td>
                <td className="border-r border-black py-0.5 px-3">Adj Differential Allowance (34.35% 2022)</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalDiffAllowance2022)}</td>
              </tr>
            )}
            {summary.totalAdhoc2023 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">2378</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2023 35%</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2023)}</td>
              </tr>
            )}
            {summary.totalAdhoc2024 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">2393</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2024 25%</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2024)}</td>
              </tr>
            )}
            {summary.totalAdhoc2025 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">5505</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2025 12%</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2025)}</td>
              </tr>
            )}
            {summary.totalAdhoc2026 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">&nbsp;</td>
                <td className="border-r border-black py-0.5 px-3">Adj Adhoc Relief 2026 7%</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalAdhoc2026)}</td>
              </tr>
            )}
            {summary.totalDiffAllowance2026 > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">&nbsp;</td>
                <td className="border-r border-black py-0.5 px-3">Adj Differential Allowance (2% 2026)</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalDiffAllowance2026)}</td>
              </tr>
            )}
            {summary.totalTeachingAllowance > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">6125</td>
                <td className="border-r border-black py-0.5 px-3">Adj Teaching Allowance</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalTeachingAllowance)}</td>
              </tr>
            )}
            {summary.totalSpecialConveyance > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-mono">-</td>
                <td className="border-r border-black py-0.5 px-3">Adj Special Conveyance Allowance for Disable persons</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalSpecialConveyance)}</td>
              </tr>
            )}

            {/* Total Gross Row */}
            <tr className="bg-neutral-100 font-bold border-t-2 border-b-2 border-black">
              <td className="border-r border-black py-0.5 px-2 text-center"></td>
              <td className="border-r border-black py-0.5 px-3 uppercase tracking-wider text-right pr-4 font-extrabold">
                Total Gross
              </td>
              <td className="py-0.5 px-3 text-right font-mono font-bold text-[11px]">
                {formatCurrency(summary.grossAmount)}
              </td>
            </tr>

            {/* Deductions Header */}
            {summary.totalDeductions > 0 && (
              <tr className="bg-orange-50/60 font-bold">
                <td className="border-r border-black py-0.5 px-2"></td>
                <td className="border-r border-black py-0.5 px-3 uppercase tracking-wider underline">
                  DEDUCTIONS
                </td>
                <td className="py-0.5 px-3"></td>
              </tr>
            )}

            {summary.totalBF > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">6001</td>
                <td className="border-r border-black py-0.5 px-3">Adj Benevolent Fund</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalBF)}</td>
              </tr>
            )}
            {summary.totalGI > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">6006</td>
                <td className="border-r border-black py-0.5 px-3">Adj Group Insurance</td>
                <td className="py-0.5 px-3 text-right font-mono">{formatCurrency(summary.totalGI)}</td>
              </tr>
            )}
            {summary.totalGPF > 0 && (
              <tr>
                <td className="border-r border-black py-0.5 px-2 text-center font-bold font-mono">6075</td>
                <td className="border-r border-black py-0.5 px-3 font-semibold">Adj G.P.Fund</td>
                <td className="py-0.5 px-3 text-right font-mono font-bold">{formatCurrency(summary.totalGPF)}</td>
              </tr>
            )}

            {/* Total Deductions Row */}
            <tr className="bg-neutral-100 font-bold border-t border-b border-black">
              <td className="border-r border-black py-0.5 px-2 text-center"></td>
              <td className="border-r border-black py-0.5 px-3 text-right pr-4 uppercase">
                Total Deduction <span className="font-normal font-sans">(—)</span>
              </td>
              <td className="py-0.5 px-3 text-right font-mono font-bold">
                {formatCurrency(summary.totalDeductions)}
              </td>
            </tr>

            {/* Net Payment Row */}
            <tr className="bg-neutral-100 font-extrabold border-t-2 border-black text-[11px]">
              <td className="border-r border-black py-1 px-2 text-center"></td>
              <td className="border-r border-black py-1 px-3 text-right pr-4 uppercase tracking-wider">
                Net Payment
              </td>
              <td className="py-1 px-3 text-right font-mono font-black text-[11.5px]">
                {formatCurrency(summary.netPayableAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* In Words */}
      <div className="text-center font-serif font-bold text-xs text-neutral-900 my-4 px-2 leading-relaxed">
        {summary.amountInWords}
      </div>

      {/* Signature Section */}
      <div className="mt-8 space-y-6">
        <div className="flex justify-start">
          <div className="text-left font-semibold text-[10.5px]">
            Signature of DDO
          </div>
        </div>

        <div className="grid grid-cols-3 text-center font-semibold text-[10.5px] pt-4">
          <div>
            Senior Auditor/Sub Accountant
          </div>
          <div>
            Accountant/AAO
          </div>
          <div>
            DAO/ADAO
          </div>
        </div>
      </div>
      </div>

      {/* Footer Page Number - Bottom Right */}
      <div
        className="absolute bottom-8 right-10 text-xs font-sans text-neutral-600 font-semibold text-right"
        style={{ position: 'absolute', bottom: '32px', right: '40px', textAlign: 'right' }}
      >
        Page 2 of 6
      </div>
    </div>
  );
};
