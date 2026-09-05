import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Send,
  BookOpen,
  Shield,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { EmployeeData } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';
import { exportSingleDocumentToPDF } from '../utils/pdfExport';

interface Props {
  employee: EmployeeData;
}

export const OfficialFormatsLibrary: React.FC<Props> = ({ employee }) => {
  const [selectedFormat, setSelectedFormat] = useState<
    'covering_letter' | 'noc' | 'leave_proforma' | 'joining_report' | 'transfer_request'
  >('covering_letter');

  // Covering Letter state
  const [coveringPreset, setCoveringPreset] = useState<'arrears' | 'promotion' | 'increment' | 'general'>('arrears');
  const [letterRefNo, setLetterRefNo] = useState('DDO/SELD/ARREARS/2026/89');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [recipientOffice, setRecipientOffice] = useState('District Accounts Officer, District ' + (employee.district?.replace('_', ' ') || 'Sindh'));
  const [letterSubject, setLetterSubject] = useState('SUBMISSION OF SALARY ARREARS BILL (TR-22) FOR PAYMENT');
  const [letterBody, setLetterBody] = useState('');
  const [copyForwardedTo, setCopyForwardedTo] = useState(
    `1. The Director School Education (ES&HS), ${employee.region || 'Hyderabad'}.
2. The District Education Officer (ES&HS), ${employee.district?.replace('_', ' ') || 'District'}.
3. The Taluka Education Officer (TEO), Taluka ${employee.taluka || 'Taluka'}.
4. Office copy.`
  );

  // Dynamic Generator for Covering Letter
  const generateCoveringLetterBody = (preset: 'arrears' | 'promotion' | 'increment' | 'general') => {
    const empName = employee.name || 'Civil Servant';
    const empDesig = employee.designation || 'Teacher';
    const empBps = employee.bps || 14;
    const school = employee.schoolName || 'Government School';
    const semis = employee.semisCode || 'SEMIS';
    const pId = employee.personnelId || 'P#';
    const dist = employee.district?.replace('_', ' ') || 'Sindh';

    switch (preset) {
      case 'arrears':
        return `With utmost respect, I have the honour to submit herewith the Salary Arrears Bill (TR-22) along with itemized monthly schedule and non-payment certificate in respect of Mr./Ms. ${empName}, ${empDesig} (BPS-${empBps}), posted at ${school}, SEMIS Code ${semis}, Personnel SAP No. ${pId}.

The arrears pertains to the period from ${employee.appointmentDate || 'Joining Date'} to ${employee.arrearUptoDate || 'Arrear Upto Date'}. All necessary documentation including attested appointment order, first joining report, verification from competent authority, and non-payment certificate have been checked and verified in accordance with the rules.

It is therefore requested that the attached arrears bill may kindly be passed and pre-audited for payment through SAP payroll system.`;

      case 'promotion':
        return `With reference to the notification regarding upgradation / promotion of teachers to higher grade, I have the honour to forward herewith the pay fixation papers and service record in respect of Mr./Ms. ${empName}, ${empDesig} (BPS-${empBps}), Personnel SAP No. ${pId}, posted at ${school}, District ${dist}.

All requisite credentials, original service book entries, and DDO verification certificates are enclosed for necessary verification and fixation of revised pay scale in the SAP system.

It is requested that the case may kindly be processed for early endorsement and revised pay entry.`;

      case 'increment':
        return `I have the honour to submit the annual increment and pay restoration claim in respect of Mr./Ms. ${empName}, ${empDesig} (BPS-${empBps}), Personnel SAP No. ${pId}, posted at ${school}, District ${dist}.

The official has completed required qualifying service during the evaluation period. Relevant documents and service book verification have been authenticated by the competent authority.

Kindly acknowledge and adjust the entitlement accordingly in the District payroll.`;

      case 'general':
      default:
        return `With utmost respect, I have the honour to submit herewith the official case papers regarding administrative and service matters of Mr./Ms. ${empName}, ${empDesig} (BPS-${empBps}), Personnel SAP No. ${pId}, posted at ${school}, District ${dist}.

All supportive documents are attached for your kind perusal and favorable consideration as per Sindh Civil Service Rules.`;
    }
  };

  // NOC State & Dynamic Generator
  type NocType = 'International Passport' | 'Higher Education (M.Phil / PhD / B.Ed)' | 'Competitive Exam (SPSC / FPSC)' | 'Departmental NOC / General';
  const [nocPurpose, setNocPurpose] = useState<NocType>('International Passport');
  const [nocBody, setNocBody] = useState('');

  const generateNocBody = (purpose: NocType) => {
    const empName = employee.name || 'Civil Servant';
    const father = employee.fatherName || 'Father';
    const empDesig = employee.designation || 'Teacher';
    const empBps = employee.bps || 14;
    const school = employee.schoolName || 'Government School';
    const dist = employee.district?.replace('_', ' ') || 'Sindh';

    switch (purpose) {
      case 'International Passport':
        return `Certified that Mr./Ms. ${empName}, S/o ${father}, is a permanent and regular employee of the School Education & Literacy Department, Government of Sindh, holding the post of ${empDesig} (BPS-${empBps}) at ${school}, District ${dist}.

This department has No Objection to his/her applying for the issuance / renewal of Machine Readable Passport (MRP) / National Travel Documents to visit abroad during sanctioned leave or vacations.

It is further certified that no departmental inquiry, anti-corruption investigation, or audit recovery is pending against the said employee.`;

      case 'Higher Education (M.Phil / PhD / B.Ed)':
        return `Certified that Mr./Ms. ${empName}, S/o ${father}, is a permanent and regular employee of the School Education & Literacy Department, Government of Sindh, holding the post of ${empDesig} (BPS-${empBps}) at ${school}, District ${dist}.

This department has No Objection to his/her securing admission and pursuing Higher Studies / Degree Program (B.Ed / M.Ed / M.Phil / PhD) in a recognized University on evening / weekend or self-financed basis without affecting official government school teaching duties.

It is further certified that no disciplinary proceeding or adverse remarks exist in the employee's official service record.`;

      case 'Competitive Exam (SPSC / FPSC)':
        return `Certified that Mr./Ms. ${empName}, S/o ${father}, is a permanent and regular employee of the School Education & Literacy Department, Government of Sindh, holding the post of ${empDesig} (BPS-${empBps}) at ${school}, District ${dist}.

This department has No Objection to his/her applying and appearing in the Competitive Examination / Direct Recruitment Selection conducted by the Sindh Public Service Commission (SPSC) / Federal Public Service Commission (FPSC) through proper departmental channel.

If selected, the applicant will be relieved from this department in accordance with the Sindh Civil Servants Act and Rules.`;

      case 'Departmental NOC / General':
      default:
        return `Certified that Mr./Ms. ${empName}, S/o ${father}, is a regular civil servant of School Education & Literacy Department, Govt of Sindh, serving as ${empDesig} (BPS-${empBps}) at ${school}, District ${dist}.

This department has No Objection to the subject case / request in accordance with the prevailing government rules and administrative policies.

It is certified that the employee holds satisfactory performance record and no audit objection or inquiry is pending.`;
    }
  };

  // Leave Proforma State & Dynamic Generator
  type LeaveType = 'Earned Leave (Full Pay)' | 'Casual Leave' | 'Ex-Pakistan Leave' | 'Medical Leave (LND)';
  const [leaveType, setLeaveType] = useState<LeaveType>('Earned Leave (Full Pay)');
  const [leaveDays, setLeaveDays] = useState(15);
  const [leaveFrom, setLeaveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('Urgent domestic affairs and family obligations.');

  const generateLeaveReason = (type: LeaveType) => {
    switch (type) {
      case 'Earned Leave (Full Pay)':
        return 'Urgent domestic affairs and unavoidable family obligations requiring temporary leave from duty.';
      case 'Casual Leave':
        return 'Urgent private personal work at hometown.';
      case 'Ex-Pakistan Leave':
        return 'Proceeding to Kingdom of Saudi Arabia for performing Umrah / Pilgrimage on private expenses.';
      case 'Medical Leave (LND)':
        return 'Medical treatment and doctor-advised rest as certified by the Government Medical Officer (Medical Certificate enclosed).';
      default:
        return 'Domestic affairs and family commitments.';
    }
  };

  // Joining Report State & Dynamic Generator
  type JoiningOccasion = 'New Appointment' | 'Transfer / Posting' | 'Return from Sanctioned Leave';
  const [joiningCause, setJoiningCause] = useState<JoiningOccasion>('New Appointment');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [joiningTime, setJoiningTime] = useState<'Forenoon (F.N)' | 'Afternoon (A.N)'>('Forenoon (F.N)');
  const [joiningBody, setJoiningBody] = useState('');

  const generateJoiningBody = (occasion: JoiningOccasion, jDate: string, jTime: string) => {
    const empName = employee.name || 'Civil Servant';
    const father = employee.fatherName || 'Father';
    const empDesig = employee.designation || 'Teacher';
    const empBps = employee.bps || 14;
    const school = employee.schoolName || 'Government School';

    switch (occasion) {
      case 'New Appointment':
        return `With reference to the first appointment order issued by the competent authority, I, ${empName}, S/o ${father}, hereby submit my formal joining report for duty on this day ${jDate} in the ${jTime} as ${empDesig} (BPS-${empBps}) at ${school}.

It is respectfully requested that my joining report may kindly be accepted and transmitted to the District Accounts Office for regular disbursement of salary through SAP payroll.`;

      case 'Transfer / Posting':
        return `In compliance with the transfer and posting order issued by the competent authority, I, ${empName}, S/o ${father}, have relinquished charge from previous station and hereby submit my formal joining report at ${school} on this day ${jDate} in the ${jTime} as ${empDesig} (BPS-${empBps}).

It is requested that my joining report may kindly be countersigned and submitted for LPC and payroll transfer.`;

      case 'Return from Sanctioned Leave':
      default:
        return `In pursuance of the sanctioned leave order, I, ${empName}, S/o ${father}, hereby report back for duty on expiry of leave on this day ${jDate} in the ${jTime} at ${school}.

It is requested that my resumption of duty may kindly be recorded in the official attendance register and service book.`;
    }
  };

  // Transfer Request State & Dynamic Generator
  type TransferGround = 'Spouse Policy (Wedlock)' | 'Mutual Transfer' | 'Medical / Hardship' | 'Administrative';
  const [transferGround, setTransferGround] = useState<TransferGround>('Spouse Policy (Wedlock)');
  const [targetSchool, setTargetSchool] = useState('Govt Boys/Girls High School, City Campus');
  const [transferJustification, setTransferJustification] = useState('');

  const generateTransferJustification = (ground: TransferGround, target: string) => {
    const empDesig = employee.designation || 'Teacher';
    const empBps = employee.bps || 14;
    const school = employee.schoolName || 'Current School';
    const dist = employee.district?.replace('_', ' ') || 'District';

    switch (ground) {
      case 'Spouse Policy (Wedlock)':
        return `Most respectfully, it is submitted that I am currently serving as ${empDesig} (BPS-${empBps}) at ${school}. Under the Govt of Sindh Wedlock / Compassionate Transfer Policy, my spouse is posted in ${dist}. I request to be posted at ${target} to maintain family integrity and ensure dedicated academic performance.`;

      case 'Mutual Transfer':
        return `Most respectfully, it is submitted that I am currently serving as ${empDesig} (BPS-${empBps}) at ${school}. I have mutually agreed with a matching grade colleague for bilateral transfer. I request to be posted at ${target} in the best public interest without dislocation of academic activities.`;

      case 'Medical / Hardship':
        return `Most respectfully, it is submitted that I am currently serving as ${empDesig} (BPS-${empBps}) at ${school}. On severe medical / compassionate grounds supported by medical certificates, I request to be posted at ${target} for accessible treatment and continuous duty.`;

      case 'Administrative':
      default:
        return `Most respectfully, it is submitted that I am currently serving as ${empDesig} (BPS-${empBps}) at ${school}. In accordance with departmental requirement and rationalization policy, I request posting adjustment at ${target}.`;
    }
  };

  // Initialize and auto-sync dynamic text when employee data changes or on first render
  useEffect(() => {
    setLetterBody(generateCoveringLetterBody(coveringPreset));
  }, [employee, coveringPreset]);

  useEffect(() => {
    setNocBody(generateNocBody(nocPurpose));
  }, [employee, nocPurpose]);

  useEffect(() => {
    setJoiningBody(generateJoiningBody(joiningCause, joiningDate, joiningTime));
  }, [employee, joiningCause, joiningDate, joiningTime]);

  useEffect(() => {
    setTransferJustification(generateTransferJustification(transferGround, targetSchool));
  }, [employee, transferGround, targetSchool]);

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      const cleanName = (employee.name || 'Official').replace(/[^a-zA-Z0-9]/g, '_');
      await exportSingleDocumentToPDF(
        'official-formats-document-view',
        `Sindh_${selectedFormat.toUpperCase()}_${cleanName}.pdf`,
        setIsExportingPDF
      );
    } catch (err) {
      console.error('Formats PDF export failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Mobile-Optimized Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-5">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-sm shrink-0 mt-0.5 sm:mt-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-bold text-base sm:text-lg lg:text-xl tracking-tight text-white">
                Official Sindh Formats &amp; Covering Letter Generator
              </h2>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Civil Service Rules
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Dual-pane live editor for No Objection Certificates (NOC), Leave Proformas, Joining Reports, and Official Covering Letters.
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
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Format Selection Bar */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setSelectedFormat('covering_letter')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${
            selectedFormat === 'covering_letter'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>1. Official Covering Letter</span>
        </button>

        <button
          onClick={() => setSelectedFormat('noc')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${
            selectedFormat === 'noc'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>2. No Objection Certificate (NOC)</span>
        </button>

        <button
          onClick={() => setSelectedFormat('leave_proforma')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${
            selectedFormat === 'leave_proforma'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>3. Leave Application Proforma</span>
        </button>

        <button
          onClick={() => setSelectedFormat('joining_report')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${
            selectedFormat === 'joining_report'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>4. Formal Joining Report</span>
        </button>

        <button
          onClick={() => setSelectedFormat('transfer_request')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${
            selectedFormat === 'transfer_request'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span>5. Transfer Application</span>
        </button>
      </div>

      {/* DUAL PANE EDITOR & LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Dynamic Parameters Form Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              {selectedFormat === 'covering_letter' && 'Official Covering Letter Parameters'}
              {selectedFormat === 'noc' && 'NOC Parameters & Dynamic Body'}
              {selectedFormat === 'leave_proforma' && 'Leave Proforma Details'}
              {selectedFormat === 'joining_report' && 'Joining Report Parameters'}
              {selectedFormat === 'transfer_request' && 'Transfer Application Details'}
            </h3>

            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              Live Synchronized
            </span>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* FORMAT 1: COVERING LETTER */}
            {selectedFormat === 'covering_letter' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Letter Purpose / Preset</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'arrears', label: 'Arrears Bill (TR-22)' },
                      { id: 'promotion', label: 'Promotion / Upgradation' },
                      { id: 'increment', label: 'Annual Increment' },
                      { id: 'general', label: 'General Matters' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const presetKey = p.id as any;
                          setCoveringPreset(presetKey);
                          if (presetKey === 'arrears') setLetterSubject('SUBMISSION OF SALARY ARREARS BILL (TR-22) FOR PAYMENT');
                          else if (presetKey === 'promotion') setLetterSubject('SUBMISSION OF PAPERS FOR PAY FIXATION ON UPGRADATION');
                          else if (presetKey === 'increment') setLetterSubject('FORWARDING OF ANNUAL INCREMENT & PAY RESTORATION CASE');
                          else setLetterSubject('OFFICIAL CORRESPONDENCE REGARDING SERVICE MATTERS');
                          setLetterBody(generateCoveringLetterBody(presetKey));
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer text-left truncate ${
                          coveringPreset === p.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dispatch / Letter No.</label>
                    <input
                      type="text"
                      value={letterRefNo}
                      onChange={(e) => setLetterRefNo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dated</label>
                    <input
                      type="date"
                      value={letterDate}
                      onChange={(e) => setLetterDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">To (Recipient Designation &amp; Office)</label>
                  <input
                    type="text"
                    value={recipientOffice}
                    onChange={(e) => setRecipientOffice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={letterSubject}
                    onChange={(e) => setLetterSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Letter Body Text <span className="text-slate-400 font-normal">(Live Dynamic &amp; Editable)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setLetterBody(generateCoveringLetterBody(coveringPreset))}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
                      title="Reset body text from current employee parameters"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Body</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-normal leading-relaxed text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Copy Forwarded For Information To (C.C)</label>
                  <textarea
                    rows={3}
                    value={copyForwardedTo}
                    onChange={(e) => setCopyForwardedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 text-xs font-mono"
                  />
                </div>
              </>
            )}

            {/* FORMAT 2: NOC */}
            {selectedFormat === 'noc' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purpose of NOC (Updates Body Automatically)</label>
                  <select
                    value={nocPurpose}
                    onChange={(e) => {
                      const newPurpose = e.target.value as NocType;
                      setNocPurpose(newPurpose);
                      // Dynamic update of the body text based on selected NOC type!
                      setNocBody(generateNocBody(newPurpose));
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white"
                  >
                    <option value="International Passport">1. Issuance / Renewal of International Passport (MRP)</option>
                    <option value="Higher Education (M.Phil / PhD / B.Ed)">2. Permission for Higher Studies (B.Ed / M.Phil / PhD)</option>
                    <option value="Competitive Exam (SPSC / FPSC)">3. Appearing in SPSC / FPSC Competitive Exam</option>
                    <option value="Departmental NOC / General">4. General Departmental No Objection Certificate</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      NOC Certification Body Text <span className="text-slate-400 font-normal">(Dynamic &amp; Editable)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setNocBody(generateNocBody(nocPurpose))}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
                      title="Reset text to default template for this NOC type"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Text</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={nocBody}
                    onChange={(e) => setNocBody(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900 font-normal leading-relaxed text-xs"
                    placeholder="Body text will automatically update when you change NOC Purpose..."
                  />
                </div>
              </>
            )}

            {/* FORMAT 3: LEAVE PROFORMA */}
            {selectedFormat === 'leave_proforma' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nature of Leave</label>
                  <select
                    value={leaveType}
                    onChange={(e) => {
                      const newType = e.target.value as LeaveType;
                      setLeaveType(newType);
                      setLeaveReason(generateLeaveReason(newType));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="Earned Leave (Full Pay)">Earned Leave on Full Pay (Rule 5)</option>
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Ex-Pakistan Leave">Ex-Pakistan Leave (Umrah / Pilgrimage / Visit)</option>
                    <option value="Medical Leave (LND)">Leave on Medical Ground (LND)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Number of Days</label>
                    <input
                      type="number"
                      value={leaveDays}
                      onChange={(e) => setLeaveDays(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Effective From</label>
                    <input
                      type="date"
                      value={leaveFrom}
                      onChange={(e) => setLeaveFrom(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Specific Reason for Leave <span className="text-slate-400 font-normal">(Dynamic)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setLeaveReason(generateLeaveReason(leaveType))}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </>
            )}

            {/* FORMAT 4: JOINING REPORT */}
            {selectedFormat === 'joining_report' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Joining Occasion (Updates Text)</label>
                  <select
                    value={joiningCause}
                    onChange={(e) => {
                      const newOccasion = e.target.value as JoiningOccasion;
                      setJoiningCause(newOccasion);
                      setJoiningBody(generateJoiningBody(newOccasion, joiningDate, joiningTime));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="New Appointment">First Appointment / Fresh Recruitment (IBA PST/JEST)</option>
                    <option value="Transfer / Posting">Post Transfer / Mutual Posting</option>
                    <option value="Return from Sanctioned Leave">Resumption After Sanctioned Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => {
                        setJoiningDate(e.target.value);
                        setJoiningBody(generateJoiningBody(joiningCause, e.target.value, joiningTime));
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Session Timing</label>
                    <select
                      value={joiningTime}
                      onChange={(e) => {
                        const newTime = e.target.value as any;
                        setJoiningTime(newTime);
                        setJoiningBody(generateJoiningBody(joiningCause, joiningDate, newTime));
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      <option value="Forenoon (F.N)">Forenoon (F.N)</option>
                      <option value="Afternoon (A.N)">Afternoon (A.N)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Report Statement <span className="text-slate-400 font-normal">(Dynamic &amp; Editable)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setJoiningBody(generateJoiningBody(joiningCause, joiningDate, joiningTime))}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={joiningBody}
                    onChange={(e) => setJoiningBody(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs leading-relaxed"
                  />
                </div>
              </>
            )}

            {/* FORMAT 5: TRANSFER REQUEST */}
            {selectedFormat === 'transfer_request' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transfer Ground Policy (Updates Justification)</label>
                  <select
                    value={transferGround}
                    onChange={(e) => {
                      const newGround = e.target.value as TransferGround;
                      setTransferGround(newGround);
                      setTransferJustification(generateTransferJustification(newGround, targetSchool));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="Spouse Policy (Wedlock)">Spouse Policy (Wedlock Case)</option>
                    <option value="Mutual Transfer">Mutual Transfer with Matching Grade Teacher</option>
                    <option value="Medical / Hardship">Medical Ground / Severe Hardship</option>
                    <option value="Administrative">Administrative Re-Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target School Requested</label>
                  <input
                    type="text"
                    value={targetSchool}
                    onChange={(e) => {
                      setTargetSchool(e.target.value);
                      setTransferJustification(generateTransferJustification(transferGround, e.target.value));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Detailed Justification <span className="text-slate-400 font-normal">(Dynamic &amp; Editable)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setTransferJustification(generateTransferJustification(transferGround, targetSchool))}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={transferJustification}
                    onChange={(e) => setTransferJustification(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed text-xs"
                  />
                </div>
              </>
            )}

          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Sindh Civil Servants Compliance Tip:</span>
            <span>All official applications should be routed through the proper channel (Headmaster &bull; TEO &bull; DEO) with certified copies of appointment and service book.</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Official Sindh Government Document */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-white">
            <span className="font-semibold text-blue-300 flex items-center space-x-1.5 truncate mr-2">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">Official Government Format (A4 Standard Print View)</span>
            </span>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg flex items-center space-x-1.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                title="Download this document as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExportingPDF ? 'Exporting...' : 'Export as PDF'}</span>
              </button>
            </div>
          </div>

          <div
            id="official-formats-document-view"
            className="bg-white border-2 border-slate-300 rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 min-h-[640px] font-serif"
          >
            
            {/* Official Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-5 space-y-1">
              <div className="flex justify-center mb-1">
                <GovernmentEmblem size={44} className="w-11 h-11" />
              </div>
              <h2 className="font-bold text-base md:text-lg uppercase text-slate-950 font-sans tracking-tight">
                Government of Sindh
              </h2>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide font-sans">
                School Education & Literacy Department &bull; Office of the {employee.ddoFirstLine || 'DDO'}
              </p>
              <p className="text-[11px] font-bold text-blue-900 font-sans uppercase">
                Taluka {employee.taluka || 'Taluka'}, District {employee.district?.replace('_', ' ') || 'Sindh'}
              </p>
            </div>

            {/* PREVIEW: 1. COVERING LETTER */}
            {selectedFormat === 'covering_letter' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex justify-between font-sans text-xs">
                  <div><strong>No.</strong> {letterRefNo}</div>
                  <div><strong>Dated:</strong> {new Date(letterDate).toLocaleDateString('en-GB')}</div>
                </div>

                <div className="font-sans text-xs pt-2">
                  <div><strong>To,</strong></div>
                  <div className="pl-4 font-semibold text-slate-900">{recipientOffice}</div>
                </div>

                <div className="pt-2">
                  <div className="font-bold font-sans text-xs uppercase underline tracking-wide">
                    SUBJECT: {letterSubject}
                  </div>
                </div>

                <div className="pt-2 font-serif text-justify indent-6 space-y-3">
                  <p className="whitespace-pre-wrap">{letterBody}</p>
                </div>

                <div className="pt-10 flex justify-end font-sans">
                  <div className="text-center w-64">
                    <div className="border-t border-slate-800 pt-1 font-bold">Drawing &amp; Disbursing Officer (DDO)</div>
                    <div className="text-slate-600 text-[11px]">{employee.ddoFirstLine}</div>
                    <div className="text-slate-600 text-[11px]">Taluka {employee.taluka}, Dist. {employee.district?.replace('_', ' ')}</div>
                  </div>
                </div>

                {copyForwardedTo && (
                  <div className="pt-6 border-t border-slate-200 font-sans text-[11px] space-y-1">
                    <div className="font-bold">A copy is forwarded for kind information &amp; necessary action to:</div>
                    <div className="whitespace-pre-wrap text-slate-700 pl-2 font-mono text-[10px]">{copyForwardedTo}</div>
                  </div>
                )}
              </div>
            )}

            {/* PREVIEW: 2. NOC */}
            {selectedFormat === 'noc' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex justify-between font-sans text-xs">
                  <div><strong>No.</strong> SELD/ESTT/NOC/{new Date().getFullYear()}/042</div>
                  <div><strong>Dated:</strong> {new Date().toLocaleDateString('en-GB')}</div>
                </div>

                <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide pt-2">
                  NO OBJECTION CERTIFICATE (NOC)
                </div>

                <div className="pt-3 font-serif text-justify indent-6 space-y-3">
                  <p className="whitespace-pre-wrap">{nocBody}</p>
                </div>

                <table className="w-full border-collapse border border-slate-400 text-xs font-sans my-4">
                  <tbody>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-400 p-2 font-bold w-1/3">Name of Officer/Teacher:</td>
                      <td className="border border-slate-400 p-2 font-semibold">{employee.name || '—'}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 font-bold">Designation &amp; BPS:</td>
                      <td className="border border-slate-400 p-2">{employee.designation || 'Teacher'} (BPS-{employee.bps || '14'})</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-400 p-2 font-bold">CNIC Number:</td>
                      <td className="border border-slate-400 p-2">{employee.cnic || '—'}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 font-bold">Personnel SAP ID:</td>
                      <td className="border border-slate-400 p-2 font-mono">{employee.personnelId || '—'}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="border border-slate-400 p-2 font-bold">School Posting:</td>
                      <td className="border border-slate-400 p-2">{employee.schoolName || '—'}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-12 flex justify-end font-sans">
                  <div className="text-center w-64">
                    <div className="border-t border-slate-800 pt-1 font-bold">COMPETENT AUTHORITY / DDO</div>
                    <div className="text-slate-600 text-[11px]">{employee.ddoFirstLine}</div>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: 3. LEAVE PROFORMA */}
            {selectedFormat === 'leave_proforma' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide">
                  APPLICATION PROFORMA FOR LEAVE (SINDH REVISED LEAVE RULES 1986)
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border border-slate-300 p-3 rounded-lg font-sans text-xs">
                  <div><strong>1. Applicant Name:</strong> {employee.name || '—'}</div>
                  <div><strong>2. Father's Name:</strong> {employee.fatherName || '—'}</div>
                  <div><strong>3. Designation &amp; BPS:</strong> {employee.designation || 'Teacher'} (BPS-{employee.bps || '14'})</div>
                  <div><strong>4. SAP Personnel No:</strong> {employee.personnelId || '—'}</div>
                  <div><strong>5. Nature of Leave:</strong> {leaveType}</div>
                  <div><strong>6. Period of Leave:</strong> {leaveDays} Days (From {leaveFrom})</div>
                  <div className="col-span-2"><strong>7. Purpose / Reason:</strong> {leaveReason}</div>
                  <div className="col-span-2"><strong>8. School / Station:</strong> {employee.schoolName || '—'}, Taluka {employee.taluka || '—'}</div>
                </div>

                <p className="text-justify font-serif pt-2">
                  I undertake that on expiry of the leave, I will report for duty immediately at my place of posting.
                </p>

                <div className="pt-8 flex justify-between font-sans text-xs">
                  <div>
                    <div className="font-bold border-t border-slate-700 pt-1">Signature of Applicant</div>
                    <span>{employee.name || 'Employee'}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold border-t border-slate-700 pt-1">Sanctioned By (TEO / DEO)</div>
                    <span>SE&amp;LD {employee.district?.replace('_', ' ') || 'Sindh'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: 4. JOINING REPORT */}
            {selectedFormat === 'joining_report' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide">
                  FORMAL JOINING REPORT
                </div>

                <div className="font-sans text-xs pt-2">
                  <div><strong>To,</strong></div>
                  <div className="pl-4 font-semibold text-slate-900">The Headmaster / Taluka Education Officer (TEO),</div>
                  <div className="pl-4 text-slate-700">{employee.schoolName || 'School'}, Taluka {employee.taluka || 'Taluka'}.</div>
                </div>

                <div className="pt-2 font-bold font-sans text-xs uppercase underline">
                  SUBJECT: JOINING REPORT AS {employee.designation?.toUpperCase() || 'TEACHER'} (BPS-{employee.bps || '14'})
                </div>

                <div className="pt-2 font-serif text-justify indent-6 space-y-3">
                  <p className="whitespace-pre-wrap">{joiningBody}</p>
                </div>

                <div className="pt-10 flex justify-between font-sans text-xs">
                  <div>
                    <div className="font-bold border-t border-slate-700 pt-1">Signature of Teacher</div>
                    <span>{employee.name || 'Employee'} (CNIC: {employee.cnic || '—'})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold border-t border-slate-700 pt-1">Counter-Signed by Headmaster / DDO</div>
                    <span>{employee.schoolName || 'School'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW: 5. TRANSFER REQUEST */}
            {selectedFormat === 'transfer_request' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="text-center font-bold font-sans text-sm underline uppercase tracking-wide">
                  APPLICATION FOR TRANSFER / POSTING ON {transferGround.toUpperCase()}
                </div>

                <div className="font-sans text-xs pt-2">
                  <div><strong>To,</strong></div>
                  <div className="pl-4 font-semibold text-slate-900">The District Education Officer (ES&amp;HS),</div>
                  <div className="pl-4 text-slate-700">{employee.district?.replace('_', ' ') || 'District'}.</div>
                </div>

                <div className="pt-2 font-bold font-sans text-xs uppercase underline">
                  SUBJECT: REQUEST FOR TRANSFER / POSTING ON {transferGround.toUpperCase()}
                </div>

                <div className="font-serif text-justify indent-6 pt-2 space-y-3">
                  <p className="whitespace-pre-wrap">{transferJustification}</p>
                </div>

                <div className="pt-10 flex justify-between font-sans text-xs">
                  <div>
                    <div className="font-bold border-t border-slate-700 pt-1">Signature of Applicant</div>
                    <span>{employee.name || 'Employee'} ({employee.designation || 'Teacher'}, BPS-{employee.bps || '14'})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold border-t border-slate-700 pt-1">Forwarded by DDO with Recommendation</div>
                    <span>{employee.ddoFirstLine || 'DDO'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
