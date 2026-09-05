import React from 'react';
import { EmployeeData, MonthlyBreakdown, ArrearsSummary } from '../types';
import { formatCurrency } from '../utils/numberToWords';

interface Props {
  employee: EmployeeData;
  schedule: MonthlyBreakdown[];
  summary: ArrearsSummary;
  idPart1?: string;
  idPart2?: string;
  renderPart?: 'all' | 'part1' | 'part2';
}

export const MonthlySchedulePreview: React.FC<Props> = ({
  employee,
  schedule,
  summary,
  idPart1 = 'schedule-part1-page',
  idPart2 = 'schedule-part2-page',
  renderPart = 'all',
}) => {
  const formatDateSimple = (dStr: string) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
  };

  const totalDisplayRows = 30;

  return (
    <div className={renderPart === 'all' ? 'space-y-8' : ''}>
      {/* Schedule Part 1 (Columns 1 to 18) - Matching PDF Page 4 */}
      {(renderPart === 'all' || renderPart === 'part1') && (
        <div
          id={idPart1}
          className="bg-white text-black p-3 sm:p-4 max-w-[794px] mx-auto font-sans text-[8px] leading-none relative overflow-x-auto"
          style={{ minHeight: '1123px', height: '1123px', width: '794px', boxSizing: 'border-box', position: 'relative' }}
        >
        <div>
        <table className="w-full border-collapse border border-black text-center text-[7.5px]">
          <thead>
            {/* Header Row 1: Column Names */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[7.5px] leading-tight">
              <th className="p-0.5 w-5 rotate-0" style={{ verticalAlign: 'middle' }}>Serial Num of Posts</th>
              <th className="p-0.5 w-14" style={{ verticalAlign: 'middle' }}>
                Section of Establishment and Name of Incumbents
              </th>
              <th className="p-0.5 w-16" style={{ verticalAlign: 'middle' }}>
                Substantive Pay<br />(personal Pay Special Pay of officiating pay if should also be shown in this columns as a separate entry below substantive pay)
              </th>
              <th className="p-0.5 w-9" style={{ verticalAlign: 'middle' }}>House Rent Allowance</th>
              <th className="p-0.5 w-9" style={{ verticalAlign: 'middle' }}>Conveyance Allowance</th>
              <th className="p-0.5 w-10" style={{ verticalAlign: 'middle' }}>Special Conveyance Allowance for Disable persons</th>
              <th className="p-0.5 w-8" style={{ verticalAlign: 'middle' }}>Teaching Allowance</th>
              <th className="p-0.5 w-9" style={{ verticalAlign: 'middle' }}>Medical Allowance</th>
              <th className="p-0.5 w-7" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2017</th>
              <th className="p-0.5 w-7" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2018</th>
              <th className="p-0.5 w-7" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2019</th>
              <th className="p-0.5 w-7" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2020</th>
              <th className="p-0.5 w-7" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2021</th>
              <th className="p-0.5 w-8" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2022</th>
              <th className="p-0.5 w-9" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2023</th>
            </tr>

            {/* Header Row 2: Column Numbers */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[8px]">
              <th className="p-0.5">1</th>
              <th className="p-0.5">2</th>
              <th className="p-0.5">3</th>
              <th className="p-0.5">4</th>
              <th className="p-0.5">5</th>
              <th className="p-0.5">6</th>
              <th className="p-0.5">7</th>
              <th className="p-0.5">8</th>
              <th className="p-0.5">12</th>
              <th className="p-0.5">13</th>
              <th className="p-0.5">14</th>
              <th className="p-0.5">15</th>
              <th className="p-0.5">16</th>
              <th className="p-0.5">17</th>
              <th className="p-0.5">18</th>
            </tr>

            {/* Header Row 3: Currency */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[7.5px]">
              <th className="p-0.5"></th>
              <th className="p-0.5"></th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
            </tr>

            {/* Header Row 4: Abbreviations */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[8px]">
              <th className="p-0.5"></th>
              <th className="p-0.5"></th>
              <th className="p-0.5">PAY</th>
              <th className="p-0.5">HR</th>
              <th className="p-0.5">C.A</th>
              <th className="p-0.5">Sp. Con.</th>
              <th className="p-0.5">T.A</th>
              <th className="p-0.5">M.A</th>
              <th className="p-0.5">2017</th>
              <th className="p-0.5">2018</th>
              <th className="p-0.5">2019</th>
              <th className="p-0.5">2020</th>
              <th className="p-0.5">2021</th>
              <th className="p-0.5">2022</th>
              <th className="p-0.5">2023</th>
            </tr>

            {/* Spanning Employee Title Row */}
            <tr className="bg-white font-bold border-b border-black text-[8.5px]">
              <td colSpan={15} className="py-1 px-2 text-center uppercase tracking-wide">
                {employee.name || '________________________'} ({employee.designation}) BPS-{employee.bps} P# {employee.personnelId || '________'} Arrears Bill from {formatDateSimple(employee.appointmentDate)} to {formatDateSimple(employee.arrearUptoDate)}
              </td>
            </tr>
          </thead>

          <tbody className="divide-y divide-black font-sans text-[8px]">
            {Array.from({ length: totalDisplayRows }).map((_, idx) => {
              const row = schedule[idx];
              const rowNum = idx + 1;

              if (row) {
                return (
                  <tr key={`p1-${row.id}`} className="divide-x divide-black h-4.5">
                    <td className="p-0.5 text-center font-medium">{rowNum}</td>
                    <td className="p-0.5 text-left font-medium whitespace-nowrap pl-1">{row.monthLabel}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.basicPay)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.houseRent)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.conveyance)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.specialConveyance > 0 ? formatCurrency(row.specialConveyance) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.teachingAllowance > 0 ? formatCurrency(row.teachingAllowance) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.medicalAllowance)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2017 > 0 ? formatCurrency(row.adhoc2017) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2018 > 0 ? formatCurrency(row.adhoc2018) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2019 > 0 ? formatCurrency(row.adhoc2019) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2020 > 0 ? formatCurrency(row.adhoc2020) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2021 > 0 ? formatCurrency(row.adhoc2021) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2022 > 0 ? formatCurrency(row.adhoc2022) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2023 > 0 ? formatCurrency(row.adhoc2023) : '-'}</td>
                  </tr>
                );
              }

              // Blank numbered row up to 30
              return (
                <tr key={`p1-blank-${idx}`} className="divide-x divide-black h-4.5">
                  <td className="p-0.5 text-center font-medium">{rowNum}</td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-white font-bold border-t-2 border-b-2 border-black divide-x divide-black text-[8px]">
              <td className="p-1 text-center font-extrabold" colSpan={2}>TOTAL</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalBasicPay)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalHouseRent)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalConveyance)}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalSpecialConveyance > 0 ? formatCurrency(summary.totalSpecialConveyance) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalTeachingAllowance > 0 ? formatCurrency(summary.totalTeachingAllowance) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalMedicalAllowance)}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalAdhoc2017 > 0 ? formatCurrency(summary.totalAdhoc2017) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalAdhoc2018 > 0 ? formatCurrency(summary.totalAdhoc2018) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalAdhoc2019 > 0 ? formatCurrency(summary.totalAdhoc2019) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalAdhoc2020 > 0 ? formatCurrency(summary.totalAdhoc2020) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalAdhoc2021 > 0 ? formatCurrency(summary.totalAdhoc2021) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalAdhoc2022)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalAdhoc2023)}</td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Footer Page Number - Bottom Right */}
        <div
          className="absolute bottom-8 right-10 text-xs font-sans text-neutral-600 font-semibold text-right"
          style={{ position: 'absolute', bottom: '32px', right: '40px', textAlign: 'right' }}
        >
          Page 4 of 6
        </div>
      </div>
      )}

      {/* Schedule Part 2 (Columns 19 to 28) - Matching PDF Page 5 */}
      {(renderPart === 'all' || renderPart === 'part2') && (
        <div
          id={idPart2}
          className="bg-white text-black p-3 sm:p-4 max-w-[794px] mx-auto font-sans text-[8px] leading-none relative overflow-x-auto"
          style={{ minHeight: '1123px', height: '1123px', width: '794px', boxSizing: 'border-box', position: 'relative' }}
        >
        <div>
        <table className="w-full border-collapse border border-black text-center text-[7.5px]">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[7.5px] leading-tight">
              <th className="p-0.5 w-10" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2024</th>
              <th className="p-0.5 w-10" style={{ verticalAlign: 'middle' }}>Adhoc. Allowance 2025</th>
              <th className="p-0.5 w-11" style={{ verticalAlign: 'middle' }}>Differential Allowance</th>
              <th className="p-0.5 w-8" style={{ verticalAlign: 'middle' }}>&nbsp;</th>
              <th className="p-0.5 w-8" style={{ verticalAlign: 'middle' }}>&nbsp;</th>
              <th className="p-0.5 w-14 bg-[#e0f2fe]" style={{ verticalAlign: 'middle' }}>Grand Total</th>
              <th className="p-0.5 w-11" style={{ verticalAlign: 'middle' }}>General Provident Fund Contributory Provident Fund</th>
              <th className="p-0.5 w-9" style={{ verticalAlign: 'middle' }}>Benevolent Fund</th>
              <th className="p-0.5 w-9" style={{ verticalAlign: 'middle' }}>Group Life Insurance Fund</th>
              <th className="p-0.5 w-12 bg-[#ffedd5]" style={{ verticalAlign: 'middle' }}>Total Deduction</th>
              <th className="p-0.5 w-14 bg-[#dcfce7]" style={{ verticalAlign: 'middle' }}>Net Amount Payable</th>
              <th className="p-0.5 w-8" style={{ verticalAlign: 'middle' }}>Remarks</th>
            </tr>

            {/* Header Row 2: Col Numbers */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[8px]">
              <th className="p-0.5">19</th>
              <th className="p-0.5">20</th>
              <th className="p-0.5">21</th>
              <th className="p-0.5">&nbsp;</th>
              <th className="p-0.5">&nbsp;</th>
              <th className="p-0.5 bg-[#e0f2fe]">22</th>
              <th className="p-0.5">23</th>
              <th className="p-0.5">24</th>
              <th className="p-0.5">25</th>
              <th className="p-0.5 bg-[#ffedd5]">26</th>
              <th className="p-0.5 bg-[#dcfce7]">27</th>
              <th className="p-0.5">28</th>
            </tr>

            {/* Header Row 3: Currency */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[7.5px]">
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5">&nbsp;</th>
              <th className="p-0.5">&nbsp;</th>
              <th className="p-0.5 font-normal bg-[#e0f2fe]">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
              <th className="p-0.5 font-normal bg-[#ffedd5]">Rs</th>
              <th className="p-0.5 font-normal bg-[#dcfce7]">Rs</th>
              <th className="p-0.5 font-normal">Rs</th>
            </tr>

            {/* Header Row 4: Labels */}
            <tr className="bg-white font-bold border-b border-black divide-x divide-black text-[8px]">
              <th className="p-0.5">2024</th>
              <th className="p-0.5">2025</th>
              <th className="p-0.5">Diff:</th>
              <th className="p-0.5">2026</th>
              <th className="p-0.5">DA-26</th>
              <th className="p-0.5 bg-[#e0f2fe]">Total</th>
              <th className="p-0.5">GPF</th>
              <th className="p-0.5">BF</th>
              <th className="p-0.5">GI</th>
              <th className="p-0.5 bg-[#ffedd5]">Total Deduc</th>
              <th className="p-0.5 bg-[#dcfce7]">Grand Total</th>
              <th className="p-0.5">&nbsp;</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black font-sans text-[8px]">
            {Array.from({ length: totalDisplayRows }).map((_, idx) => {
              const row = schedule[idx];

              if (row) {
                return (
                  <tr key={`p2-${row.id}`} className="divide-x divide-black h-4.5">
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2024 > 0 ? formatCurrency(row.adhoc2024) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2025 > 0 ? formatCurrency(row.adhoc2025) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.diffAllowance2022 > 0 ? formatCurrency(row.diffAllowance2022) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.adhoc2026 > 0 ? formatCurrency(row.adhoc2026) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{row.diffAllowance2026 > 0 ? formatCurrency(row.diffAllowance2026) : '-'}</td>
                    <td className="p-0.5 text-right font-mono pr-1 font-bold bg-[#e0f2fe]">{formatCurrency(row.totalGross)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.gpf)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.benevolentFund)}</td>
                    <td className="p-0.5 text-right font-mono pr-1">{formatCurrency(row.groupInsurance)}</td>
                    <td className="p-0.5 text-right font-mono pr-1 font-bold bg-[#ffedd5]">{formatCurrency(row.totalDeduction)}</td>
                    <td className="p-0.5 text-right font-mono pr-1 font-bold bg-[#dcfce7]">{formatCurrency(row.netPayable)}</td>
                    <td className="p-0.5 text-center">&nbsp;</td>
                  </tr>
                );
              }

              // Blank row up to 30
              return (
                <tr key={`p2-blank-${idx}`} className="divide-x divide-black h-4.5">
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5 bg-[#e0f2fe]"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5"></td>
                  <td className="p-0.5 bg-[#ffedd5]"></td>
                  <td className="p-0.5 bg-[#dcfce7]"></td>
                  <td className="p-0.5"></td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-white font-bold border-t-2 border-b-2 border-black divide-x divide-black text-[8px]">
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalAdhoc2024)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalAdhoc2025)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalDiffAllowance2022)}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalAdhoc2026 > 0 ? formatCurrency(summary.totalAdhoc2026) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1">{summary.totalDiffAllowance2026 > 0 ? formatCurrency(summary.totalDiffAllowance2026) : '-'}</td>
              <td className="p-1 text-right font-mono pr-1 font-black bg-[#e0f2fe]">{formatCurrency(summary.grossAmount)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalGPF)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalBF)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold">{formatCurrency(summary.totalGI)}</td>
              <td className="p-1 text-right font-mono pr-1 font-bold bg-[#ffedd5]">{formatCurrency(summary.totalDeductions)}</td>
              <td className="p-1 text-right font-mono pr-1 font-black bg-[#dcfce7]">{formatCurrency(summary.netPayableAmount)}</td>
              <td className="p-1 text-center">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        {/* In Words */}
        <div className="text-center font-serif font-bold text-[9.5px] my-3 text-neutral-900">
          {summary.amountInWords}
        </div>

        {/* Certificate Box */}
        <div className="border border-black p-2.5 mt-3 mb-4 text-center">
          <div className="font-extrabold text-[10px] tracking-wider uppercase mb-1">
            CERTIFICATE
          </div>
          <div className="text-[9px] text-neutral-900">
            This is to certify that the amount claimed in this bill is valid and has neither been drawn nor paid before.
          </div>
        </div>
        </div>

        {/* Footer Page Number - Bottom Right */}
        <div
          className="absolute bottom-8 right-10 text-xs font-sans text-neutral-600 font-semibold text-right"
          style={{ position: 'absolute', bottom: '32px', right: '40px', textAlign: 'right' }}
        >
          Page 5 of 6
        </div>
      </div>
      )}
    </div>
  );
};
