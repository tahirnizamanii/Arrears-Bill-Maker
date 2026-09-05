import React from 'react';
import { EmployeeData } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';

interface Props {
  employee: EmployeeData;
  id?: string;
}

export const CoveringLetterPreview: React.FC<Props> = ({ employee, id = 'covering-letter-page' }) => {
  const curDate = new Date();
  const formattedMonthYear = `/${String(curDate.getMonth() + 1).padStart(2, '0')}/${curDate.getFullYear()}`;

  const ddoOffice = employee.ddoSecondLine
    ? `OFFICE OF THE ${employee.ddoFirstLine || 'HEAD MISTRESS'} ${employee.ddoSecondLine}`.toUpperCase()
    : `OFFICE OF THE ${employee.ddoFirstLine || 'HEAD MISTRESS'} GGLSS BAGH BHATTI ${employee.district || 'HYDERABAD'}`.toUpperCase();

  return (
    <div
      id={id}
      className="bg-white text-black p-10 sm:p-12 max-w-[794px] mx-auto font-sans text-sm relative"
      style={{ minHeight: '1123px', height: '1123px', width: '794px', boxSizing: 'border-box', position: 'relative' }}
    >
      <div>
        {/* Official Crest & Header */}
        <div className="flex flex-col items-center justify-center mb-4">
          <GovernmentEmblem size={56} mono={true} />
        </div>

        {/* Office Header */}
        <div className="text-center font-extrabold text-base sm:text-lg uppercase tracking-wider mb-6 leading-tight max-w-xl mx-auto">
          {ddoOffice}
        </div>

        {/* Reference No and Date */}
        <div className="flex justify-between items-center text-sm font-bold mb-8 border-b-2 border-black pb-2">
          <div className="flex items-center">
            <span>No.:</span>
            <span className="ml-3 font-mono tracking-widest text-neutral-800">
              ____________________
            </span>
          </div>
          <div className="flex items-center">
            <span>Dated:</span>
            <span className="ml-3 font-mono tracking-widest text-neutral-800">
              _______{formattedMonthYear}
            </span>
          </div>
        </div>

        {/* Recipient */}
        <div className="mt-8 mb-8 font-normal leading-relaxed text-sm">
          <div className="font-bold">To,</div>
          <div className="pl-6 font-bold text-base mt-1">The District Accounts Officer,</div>
          <div className="pl-6 font-semibold">{employee.district || 'Hyderabad'}</div>
        </div>

        {/* Subject */}
        <div className="mb-8 pl-6">
          <span className="font-extrabold text-sm underline uppercase tracking-wide">
            SUBJECT:-&nbsp;&nbsp;&nbsp;SUBMISSION OF ARREARS BILL
          </span>
        </div>

        {/* Letter Body */}
        <div className="pl-6 text-justify text-sm leading-relaxed mb-16">
          <p className="indent-8 leading-loose">
            Kindly find enclosed herewith the salary arrear bill on prescribed format alongwith relevant documents in respect of Mr.{' '}
            <span className="font-bold uppercase px-1">
              {employee.name || '________________________'}
            </span>{' '}
            S/o{' '}
            <span className="font-bold uppercase px-1">
              {employee.fatherName || '________________________'}
            </span>
            ,&nbsp;{employee.designation || 'PST'}&nbsp;Personnel No.:{' '}
            <span className="font-bold font-mono px-1">
              {employee.personnelId || '________'}
            </span>
            ,&nbsp;CNIC:&nbsp;
            <span className="font-bold font-mono px-1">
              {employee.cnic || '____________-_______-_'}
            </span>{' '}
            for further necessary action please.
          </p>
        </div>

        {/* Officer Signatory Box */}
        <div className="flex justify-end pr-8 mb-12">
          <div className="text-center font-bold text-sm uppercase leading-tight">
            <div className="mb-1">{employee.ddoFirstLine || 'TALUKA EDUCATION OFFICER'}</div>
            <div>{employee.ddoSecondLine || `${employee.schoolName || 'SCHOOL EDUCATION'} ${employee.district?.toUpperCase() || ''}`}</div>
          </div>
        </div>
      </div>

      {/* Footer Page Number - Bottom Right */}
      <div className="absolute bottom-8 right-10 text-xs font-sans text-neutral-600 font-semibold text-right">
        Page 1 of 6
      </div>
    </div>
  );
};
