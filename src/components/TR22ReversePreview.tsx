import React from 'react';
import { EmployeeData, ArrearsSummary } from '../types';
import { formatCurrency } from '../utils/numberToWords';

interface Props {
  employee: EmployeeData;
  summary: ArrearsSummary;
  id?: string;
}

export const TR22ReversePreview: React.FC<Props> = ({ employee, summary, id = 'tr22-reverse-page' }) => {
  return (
    <div
      id={id}
      className="bg-white text-black p-4 sm:p-5 max-w-[794px] mx-auto font-sans text-[8.5px] leading-tight relative"
      style={{ minHeight: '1123px', height: '1123px', width: '794px', boxSizing: 'border-box', position: 'relative' }}
    >
      <div>
      {/* 3-Column main section */}
      <div className="grid grid-cols-12 border border-black divide-x divide-black mb-2">
        {/* Left Column (Width: 4.5 cols) */}
        <div className="col-span-5 p-1.5 flex flex-col justify-between space-y-2">
          {/* Top Calculation Summary */}
          <div className="space-y-1 text-[9px] font-sans pb-2 border-b border-black">
            <div className="font-bold text-center text-[10px]">Total &#123;Column (11)&#125;</div>
            <div className="font-semibold text-neutral-900 leading-snug">
              Deducted undisbursed salary as detailed below Rs. {formatCurrency(summary.totalDeductions)}/-
            </div>
            <div className="font-bold text-neutral-900">Deduction &#123;Column(28)&#125;</div>
            <div className="font-bold text-neutral-900">
              Total Deduction Rs. {formatCurrency(summary.totalDeductions)}/-
            </div>
            <div className="font-bold text-[10px] text-neutral-950 pt-1">
              Net amount required for payment Rs. {formatCurrency(summary.netPayableAmount)}/-
            </div>
            <div className="font-serif font-bold text-[9px] text-neutral-800 pt-0.5 leading-snug">
              {summary.amountInWords}
            </div>
          </div>

          {/* Absentee Refunded Table */}
          <div className="pt-1">
            <div className="text-center font-bold uppercase text-[8.5px] mb-1">
              DETAILS OF PAY OF ABSENTEES REFUDED
            </div>
            <table className="w-full text-[7.5px] border-collapse border border-black text-center">
              <thead>
                <tr className="bg-neutral-50 font-bold border-b border-black divide-x divide-black">
                  <th className="p-0.5 w-16">Section of<br />Establishment</th>
                  <th className="p-0.5">Name of<br />incumbent</th>
                  <th className="p-0.5 w-12">Period</th>
                  <th className="p-0.5 w-16" colSpan={2}>Amount<br />Rs &nbsp; Ps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {Array.from({ length: 18 }).map((_, i) => (
                  <tr key={`abs-${i}`} className="h-4 divide-x divide-black">
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td className="w-10">&nbsp;</td>
                    <td className="w-6">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Column: 5 Statutory Certificates (Width: 4.5 cols) */}
        <div className="col-span-4 p-1.5 text-[7.5px] leading-tight space-y-1.5 text-justify">
          <p>
            <span className="font-bold">1.</span> received contents and certified that I have certified my self that all emoluments included in this bill drawn one month/two month/three months pervious to this date has been refunded by deduction from this bill have been disbursed to proper person and that their acquittances have been taken and field in my office with receipt stamp duty cancelled for every payment in excess of twenty Rupees
          </p>

          <p>
            <span className="font-bold">2.</span> certified that no person have been absent either on other duty or suspension or without leave (except on casual leave) during the month of_____
          </p>

          <p>
            <span className="font-bold">3.</span> Certified that no leave has been granted until by reference to applicant service book, leave accounts and leave rules applicable to him. I had satisfied my self that is was admissible and that all brands of leave and all period of suspension and other duty and other leaves which are required under the rule to be so recorded has been recorded in the service book and leave accounts under my attestation
          </p>

          <p>
            <span className="font-bold">4.</span> Certified that all appointments and subs tentive promotions and such of the officiation promotions as have to be entered in the service Book of the persons concerned under my attestation
          </p>

          <div className="space-y-0.5">
            <p>
              <span className="font-bold">5.</span> Certified each official for whom house rent allowance / conveyance allowance has been clamed in this bill
            </p>
            <p className="pl-1">
              (a). Has neither been provided with accommodation by the Government nor sharing and such accommodation with an other allotlee without necessary permission of the Estate Officer and is in occupation of rent free Govt. quarter .
            </p>
            <p className="pl-1">
              (b). His/Her/ wife /Husband is not in the service of the federal/provincial Government / Autonomous Body.
            </p>
            <p className="pl-1">
              (c). His/Her/Wife/Husband who is the service of the Federal/ Provincial Government / Autonomous Body is not in receipt of House rent allowance
            </p>
            <p className="pl-1">
              (d). Has not been residing within work premisses
            </p>
            <p className="pl-1">
              (e). is maintaining a motor cycle which is registered in his/her name or in the
            </p>
          </div>
        </div>

        {/* Right Column: Code Numbers (Width: 3 cols) */}
        <div className="col-span-3 p-1.5 text-[7.5px] leading-snug space-y-1">
          <div className="font-bold text-center border-b border-black pb-0.5 mb-1">
            Detail of Code Numbers
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>General Provident<br />Fund (Civil)</span>
              <span className="font-mono font-bold">G06103</span>
            </div>
            <div className="flex justify-between">
              <span>General Provident<br />Fund (Post Office)</span>
              <span className="font-mono font-bold">G06112</span>
            </div>
            <div className="flex justify-between">
              <span>General Provident<br />Fund (Railway)</span>
              <span className="font-mono font-bold">G06114</span>
            </div>
            <div className="flex justify-between">
              <span>General Provident<br />Fund (Defence)</span>
              <span className="font-mono font-bold">G06194</span>
            </div>
            <div className="flex justify-between">
              <span>General Provident<br />Fund (Telegraph &amp; Telephone)</span>
              <span className="font-mono font-bold">G06113</span>
            </div>
            <div className="flex justify-between pt-0.5 border-t border-neutral-300">
              <span>Federal Govt. Employee<br />Benevolent Fund (Civil)</span>
              <span className="font-mono font-bold">G06202</span>
            </div>
            <div className="flex justify-between">
              <span>Federal Govt. Employee<br />Benevolent Fund (Defence)</span>
              <span className="font-mono font-bold">G06203</span>
            </div>
            <div className="flex justify-between">
              <span>Federal Govt. Employee<br />Benevolent Fund (Post Office)</span>
              <span className="font-mono font-bold">G06205</span>
            </div>
            <div className="flex justify-between">
              <span>Railway Employees<br />Benevolent Fund</span>
              <span className="font-mono font-bold">G06213</span>
            </div>
            <div className="flex justify-between">
              <span>Federal Govt. Employee<br />Benevolent Fund (Telegraph &amp; Telephone)</span>
              <span className="font-mono font-bold">G06294</span>
            </div>
            <div className="flex justify-between pt-0.5 border-t border-neutral-300">
              <span>Objection Book Advance<br />(Civil)</span>
              <span className="font-mono font-bold">F02119</span>
            </div>
            <div className="flex justify-between">
              <span>Objection Book Advance<br />(Post Office)</span>
              <span className="font-mono font-bold">&nbsp;</span>
            </div>
            <div className="flex justify-between">
              <span>Objection Book Advance<br />(Defence)</span>
              <span className="font-mono font-bold">&nbsp;</span>
            </div>
            <div className="flex justify-between">
              <span>Objection Book Advance<br />(Railway)</span>
              <span className="font-mono font-bold">F02133</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Signatures & Audit Stamp Block (Matching Official Form T.R.22 Reference) */}
      <div className="border border-black text-[8.5px]">
        {/* Row 1: Station / Date & Drawing Officer Signature */}
        <div className="grid grid-cols-12 divide-x border-b border-black divide-black">
          <div className="col-span-6 p-1.5 space-y-0.5">
            <div>Station------------</div>
            <div>Date &nbsp;------------</div>
          </div>
          <div className="col-span-6 p-1.5 text-center flex flex-col justify-center space-y-0.5">
            <div className="font-bold text-[9px]">Signature</div>
            <div>Designation of the Drawing Officer</div>
          </div>
        </div>

        {/* Row 2: Split DAO & AG Office Audit Block */}
        <div className="grid grid-cols-12 divide-x divide-black">
          {/* Left Half: District Accounts Officer / Treasury Pay Order */}
          <div className="col-span-6 p-1.5 flex flex-col justify-between" style={{ minHeight: '135px' }}>
            <div className="space-y-0.5">
              <div className="font-semibold">Not Payable before</div>
              <div>Pay Rs;------------- Rupees-------------------------------------</div>
              <div>------------------------------------------------------------------------</div>
            </div>

            {/* Bottom 4 DAO Signatory Titles Stacked Vertically with Underlines */}
            <div className="space-y-1 pt-3 text-[8.5px]">
              <div>
                <span className="underline font-semibold">District Account Officer</span>
              </div>
              <div>
                <span className="underline font-semibold">Treasury Officer</span>
              </div>
              <div>
                <span className="underline font-semibold">Assistant Accounts Officer</span>
              </div>
              <div>
                <span className="underline font-semibold">Assistant Accountant General</span>
              </div>
            </div>
          </div>

          {/* Right Half: Accountant General Office Audit Block */}
          <div className="col-span-6 p-1.5 flex flex-col justify-between" style={{ minHeight: '135px' }}>
            <div className="space-y-0.5">
              <div className="font-bold">For use in Accountant General Office</div>
              <div>Objected Rs-------------------------------------</div>
              <div className="flex justify-between pt-1 font-semibold pr-6">
                <span>Auditor</span>
                <span>Superintendent</span>
              </div>
            </div>

            {/* Bottom AG Office Signatory lines */}
            <div className="text-right space-y-1 pt-3 text-[8.5px] pr-1">
              <div className="flex justify-end items-center space-x-1">
                <span className="inline-block border-b border-black w-28"></span>
                <span className="font-semibold underline">Assistant Accounts Officer</span>
              </div>
              <div className="font-semibold">
                Assistant Accountant General
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer Page Number - Bottom Right */}
      <div
        className="absolute bottom-8 right-10 text-xs font-sans text-neutral-600 font-semibold text-right"
        style={{ position: 'absolute', bottom: '32px', right: '40px', textAlign: 'right' }}
      >
        Page 6 of 6
      </div>
    </div>
  );
};
