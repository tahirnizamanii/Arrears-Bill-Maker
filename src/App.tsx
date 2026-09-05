import React, { useState, useMemo, useEffect } from 'react';
import { EmployeeData, ChecklistItem, MonthlyBreakdown, AdminConfig } from './types';
import { DEFAULT_EMPLOYEE_DATA, calculateArrears } from './utils/arrearsCalculator';
import { DEFAULT_ADMIN_CONFIG } from './utils/adminConfigDefaults';
import { exportArrearsToExcel } from './utils/excelExport';
import { generateFullArrearsPDF } from './utils/pdfExport';
import { Header } from './components/Header';
import { AtAGlanceSummary } from './components/AtAGlanceSummary';
import { DataInputForm } from './components/DataInputForm';
import { ArrearChecklist } from './components/ArrearChecklist';
import { InteractiveMonthlySchedule } from './components/InteractiveMonthlySchedule';
import { DocumentTabsViewer } from './components/DocumentTabsViewer';
import { CoveringLetterPreview } from './components/CoveringLetterPreview';
import { AdjustmentBillPreview } from './components/AdjustmentBillPreview';
import { TR22ObversePreview } from './components/TR22ObversePreview';
import { MonthlySchedulePreview } from './components/MonthlySchedulePreview';
import { TR22ReversePreview } from './components/TR22ReversePreview';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ToolsPortal } from './components/ToolsPortal';
import { PensionPapersGenerator } from './components/PensionPapersGenerator';
import { SalarySlipGenerator } from './components/SalarySlipGenerator';
import { DifferenceMakerCalculator } from './components/DifferenceMakerCalculator';
import { OfficialFormatsLibrary } from './components/OfficialFormatsLibrary';
import { FeedbackModal } from './components/FeedbackModal';
import { FeedbackWall } from './components/FeedbackWall';
import { Footer } from './components/Footer';
import { MissingFieldsModal } from './components/MissingFieldsModal';
import {
  getMissingFields,
  focusAndHighlightField,
  MissingFieldItem,
} from './utils/formValidation';
import {
  LayoutDashboard,
  FileText,
  Table,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
  Award,
  Sparkles,
  Calculator,
  Lock,
  Star,
  Check,
} from 'lucide-react';

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', title: 'Covering Letter (Signed by TEO / DEO)', completed: true, required: true },
  { id: '2', title: 'TR-22 Form (Obverse & Reverse with Code Numbers)', completed: true, required: true },
  { id: '3', title: 'Adjustment Form (District Accounts Office Format)', completed: true, required: true },
  { id: '4', title: 'Non-Payment Certificate (From DDO)', completed: false, required: true },
  { id: '5', title: 'Salary Slip / First Month Payslip', completed: false, required: true },
  { id: '6', title: 'First Appointment & Joining Letter', completed: true, required: true },
  { id: '7', title: 'Focal Person Authority Letter (if needed)', completed: false, required: false },
  { id: '8', title: 'Original Service Book Attested Copies', completed: false, required: true },
];

export default function App() {
  // Admin Configuration State
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => {
    const saved = localStorage.getItem('iba_arrears_admin_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.fields)) {
          parsed.fields = parsed.fields.map((f: any) => {
            if (f.key === 'isTeachingAllowance') {
              return {
                ...f,
                label: 'Teaching / B.Ed Allowance (Rs. 1,000/mo)?',
                helpText: 'Professional Teaching / B.Ed qualification allowance of Rs. 1,000/month for PSTs/JESTs',
              };
            }
            if (typeof f.label === 'string' && (f.label.includes('1,500') || f.label.includes('1500'))) {
              return { ...f, label: f.label.replace(/1,?500/g, '1,000') };
            }
            return f;
          });
        }
        return parsed;
      } catch (e) {
        return DEFAULT_ADMIN_CONFIG;
      }
    }
    return DEFAULT_ADMIN_CONFIG;
  });

  // Admin Auth & View
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('iba_arrears_admin_authenticated') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);

  // Active Tool state: 'arrears' | 'gpf' | 'tax' | 'pension'
  const [activeTool, setActiveTool] = useState<string>('arrears');

  // Employee Data
  const [employee, setEmployee] = useState<EmployeeData>(() => {
    const saved = localStorage.getItem('iba_arrears_employee_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teachingAllowanceRate === 1500) {
          parsed.teachingAllowanceRate = 1000;
        }
        return { ...DEFAULT_EMPLOYEE_DATA, ...parsed };
      } catch (e) {
        return DEFAULT_EMPLOYEE_DATA;
      }
    }
    return DEFAULT_EMPLOYEE_DATA;
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('iba_arrears_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CHECKLIST;
      }
    }
    return INITIAL_CHECKLIST;
  });

  const [activeMainTab, setActiveMainTab] = useState<
    'dashboard' | 'schedule' | 'documents' | 'checklist' | 'reviews'
  >('dashboard');
  const [formStep, setFormStep] = useState<number>(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number; pageTitle?: string } | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Missing Fields Validation State
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);
  const [missingFieldsList, setMissingFieldsList] = useState<MissingFieldItem[]>([]);
  const [missingActionContext, setMissingActionContext] = useState<string>('Generate Bill Documents');

  const validateAndProceed = (actionName: string, onValid: () => void): boolean => {
    const missing = getMissingFields(employee, adminConfig);
    if (missing.length > 0) {
      setMissingFieldsList(missing);
      setMissingActionContext(actionName);
      setIsMissingModalOpen(true);
      return false;
    }
    onValid();
    return true;
  };

  const handleAttemptNavigateTab = (
    tab: 'dashboard' | 'schedule' | 'documents' | 'checklist' | 'reviews'
  ) => {
    if (tab === 'schedule' || tab === 'documents' || tab === 'checklist') {
      const ok = validateAndProceed(
        tab === 'documents'
          ? 'Generate 6-Page Official Bill'
          : tab === 'schedule'
          ? 'Generate Monthly Calculation Schedule'
          : 'Access Arrears Checklist',
        () => {
          setActiveMainTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      );
      if (!ok) return;
    } else {
      setActiveMainTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToField = (item: MissingFieldItem) => {
    setIsMissingModalOpen(false);
    setActiveMainTab('dashboard');
    setFormStep(item.step);
    focusAndHighlightField(item.fieldId);
  };

  const handleValidationFailed = (missing: MissingFieldItem[], stepNumber?: number) => {
    setMissingFieldsList(missing);
    setMissingActionContext(
      stepNumber ? `Proceed from Step ${stepNumber}` : 'Generate Official Bill'
    );
    setIsMissingModalOpen(true);
  };

  // Save admin config to local storage
  useEffect(() => {
    localStorage.setItem('iba_arrears_admin_config', JSON.stringify(adminConfig));
  }, [adminConfig]);

  // Sync employee to local storage
  useEffect(() => {
    localStorage.setItem('iba_arrears_employee_data', JSON.stringify(employee));
  }, [employee]);

  useEffect(() => {
    localStorage.setItem('iba_arrears_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Real-time calculation engine respecting dynamic admin configuration
  const { schedule, summary } = useMemo(() => {
    return calculateArrears(employee, adminConfig);
  }, [employee, adminConfig]);

  // Handlers
  const handleChecklistToggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleUpdateMonthOverride = (
    yearMonth: string,
    overrides: Partial<MonthlyBreakdown>
  ) => {
    setEmployee((prev) => ({
      ...prev,
      manualOverrides: {
        ...(prev.manualOverrides || {}),
        [yearMonth]: overrides,
      },
    }));
  };

  const handleResetMonthOverride = (yearMonth: string) => {
    setEmployee((prev) => {
      const nextOverrides = { ...(prev.manualOverrides || {}) };
      delete nextOverrides[yearMonth];
      return {
        ...prev,
        manualOverrides: nextOverrides,
      };
    });
  };

  const handleResetAllOverrides = () => {
    setEmployee((prev) => ({
      ...prev,
      manualOverrides: {},
    }));
  };

  const handleExportPDF = async () => {
    const ok = validateAndProceed('Download PDF Arrears Bill', async () => {
      try {
        setIsGeneratingPDF(true);
        const pageIds = [
          'export-covering-letter-page',
          'export-adjustment-bill-page',
          'export-tr22-obverse-page',
          'export-schedule-part1-page',
          'export-schedule-part2-page',
          'export-tr22-reverse-page',
        ];

        const cleanName = (employee.name || 'PST_JEST').replace(/[^a-zA-Z0-9]/g, '_');
        await generateFullArrearsPDF(
          pageIds,
          `Arrears_Bill_${cleanName}_${employee.appointmentDate}_to_${employee.arrearUptoDate}.pdf`,
          (progress) => {
            setPdfProgress(progress);
          }
        );

        // Trigger user feedback modal after generating the PDF
        setTimeout(() => {
          setIsFeedbackModalOpen(true);
        }, 600);
      } catch (err) {
        console.error('PDF Generation Error:', err);
        const fallbackToPrint = window.confirm(
          'Direct download encountered a rendering issue on this browser. Would you like to open the Print / Save as PDF view instead?'
        );
        if (fallbackToPrint) {
          handlePrint();
        }
      } finally {
        setIsGeneratingPDF(false);
        setPdfProgress(null);
      }
    });
    if (!ok) return;
  };

  const handleExportExcel = () => {
    validateAndProceed('Export Excel Arrears Schedule', () => {
      exportArrearsToExcel(employee, schedule, summary);
    });
  };

  const handlePrint = () => {
    validateAndProceed('Print Official Bill Documents', () => {
      setActiveMainTab('documents');
      setTimeout(() => {
        window.print();
      }, 150);
    });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminViewOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminViewOpen(false);
    localStorage.removeItem('iba_arrears_admin_authenticated');
  };

  const handleFeedbackSubmitted = (published: boolean) => {
    setFeedbackToast(
      published
        ? 'Thank you! Your feedback has been published on the Community Reviews wall.'
        : 'Thank you! Your feedback has been received privately.'
    );
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-neutral-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Application Header */}
      <Header
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
        onReset={() => setEmployee(DEFAULT_EMPLOYEE_DATA)}
        isGeneratingPDF={isGeneratingPDF}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onToggleAdminView={() => setIsAdminViewOpen(!isAdminViewOpen)}
        isAdminViewOpen={isAdminViewOpen}
        activeTool={activeTool}
        onSelectTool={(toolId) => {
          setActiveTool(toolId);
          setIsAdminViewOpen(false);
        }}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        storedPasswordHash={adminConfig.adminPasswordHash}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5 sm:space-y-6 overflow-x-hidden">
        
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 bg-emerald-700 rounded-full p-0.5" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setActiveMainTab('reviews')}
              className="underline text-emerald-100 hover:text-white ml-3"
            >
              View Reviews &rarr;
            </button>
          </div>
        )}

        {/* VIEW 1: ADMIN STUDIO */}
        {isAdminViewOpen && isAdminAuthenticated ? (
          <AdminDashboard
            config={adminConfig}
            onSaveConfig={(updated) => setAdminConfig(updated)}
            onLogout={handleAdminLogout}
          />
        ) : activeTool === 'salary-slip' ? (
          /* VIEW 2: SALARY SLIP GENERATOR */
          <SalarySlipGenerator
            employee={employee}
            adminConfig={adminConfig}
          />
        ) : activeTool === 'pension' ? (
          /* VIEW 2: PENSION PAPERS GENERATOR */
          <PensionPapersGenerator
            employee={employee}
          />
        ) : activeTool === 'difference' ? (
          /* VIEW 3: DIFFERENCE MAKER (DRAWN VS DUE) */
          <DifferenceMakerCalculator
            employee={employee}
          />
        ) : activeTool === 'formats' ? (
          /* VIEW 4: OFFICIAL FORMATS & COVERING LETTER GENERATOR */
          <OfficialFormatsLibrary
            employee={employee}
          />
        ) : activeTool !== 'arrears' ? (
          /* VIEW 5: UTILITY TOOLS PORTAL (GPF / TAX) */
          <ToolsPortal
            activeTool={activeTool}
            onSelectTool={(toolId) => {
              setActiveTool(toolId);
              if (toolId === 'arrears') {
                setActiveMainTab('dashboard');
              }
            }}
            onBackToArrears={() => {
              setActiveTool('arrears');
              setActiveMainTab('dashboard');
            }}
            adminConfig={adminConfig}
            employee={employee}
          />
        ) : (
          /* VIEW 6: MAIN ARREARS BILL MAKER */
          <>
            {/* Main Tabs Navigation */}
            <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl shadow-sm border border-neutral-200">
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => handleAttemptNavigateTab('dashboard')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 ${
                    activeMainTab === 'dashboard'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Input &amp; Overview</span>
                </button>

                <button
                  onClick={() => handleAttemptNavigateTab('schedule')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 ${
                    activeMainTab === 'schedule'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Schedule ({schedule.length}M)</span>
                </button>

                <button
                  onClick={() => handleAttemptNavigateTab('documents')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 ${
                    activeMainTab === 'documents'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Bill Documents (6 Pages)</span>
                </button>

                <button
                  onClick={() => handleAttemptNavigateTab('checklist')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 ${
                    activeMainTab === 'checklist'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Checklist</span>
                </button>

                <button
                  onClick={() => handleAttemptNavigateTab('reviews')}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shrink-0 ${
                    activeMainTab === 'reviews'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-extrabold'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
                  <span>Teacher Reviews</span>
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 text-xs font-semibold text-neutral-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-neutral-200 shadow-xs shrink-0">
                <span>Net Payable:</span>
                <span className="font-mono font-black text-sm text-emerald-700">
                  Rs. {summary.netPayableAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* TAB 1: DASHBOARD (VISITOR INPUT & LIVE PREVIEWS) */}
            {activeMainTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 Cols: Input Form */}
                <div className="lg:col-span-8 space-y-6">
                  <DataInputForm
                    employee={employee}
                    onChange={setEmployee}
                    adminConfig={adminConfig}
                    activeStep={formStep}
                    onStepChange={setFormStep}
                    onValidationFailed={handleValidationFailed}
                    onNavigateTab={handleAttemptNavigateTab}
                  />

                  {/* Monthly Quick Snapshot Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Live Monthly Calculation Schedule Preview
                        </h3>
                        <p className="text-xs text-slate-500">
                          Calculated automatically for {summary.totalMonths} months ({summary.totalLengthText})
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveMainTab('schedule')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
                      >
                        Inspect Full Table &rarr;
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b border-slate-200 text-slate-700">
                            <th className="py-2.5 px-3">Month</th>
                            <th className="py-2.5 px-2 text-right">Basic Pay</th>
                            <th className="py-2.5 px-2 text-right">Allowances</th>
                            <th className="py-2.5 px-2 text-right">Total Gross</th>
                            <th className="py-2.5 px-2 text-right">Deductions</th>
                            <th className="py-2.5 px-3 text-right text-emerald-800 font-bold">
                              Net Payable
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {schedule.slice(0, 6).map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-sans font-semibold text-slate-900">
                                {r.monthLabel}
                              </td>
                              <td className="py-2 px-2 text-right">
                                Rs. {r.basicPay.toLocaleString()}
                              </td>
                              <td className="py-2 px-2 text-right">
                                Rs. {(r.totalGross - r.basicPay).toLocaleString()}
                              </td>
                              <td className="py-2 px-2 text-right font-bold text-slate-900">
                                Rs. {r.totalGross.toLocaleString()}
                              </td>
                              <td className="py-2 px-2 text-right text-rose-600">
                                Rs. {r.totalDeduction.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-800 bg-emerald-50/40">
                                Rs. {r.netPayable.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          {schedule.length > 6 && (
                            <tr className="text-slate-500 italic bg-slate-50 font-sans text-center text-xs">
                              <td colSpan={6} className="py-2.5">
                                + {schedule.length - 6} more months in calculation schedule (Click &lsquo;Schedule&rsquo; tab above to view/edit all)
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: At A Glance Sidebar Card & Checklist */}
                <div className="lg:col-span-4 space-y-6">
                  <AtAGlanceSummary
                    employee={employee}
                    summary={summary}
                    onGeneratePDF={handleExportPDF}
                    onExportExcel={handleExportExcel}
                    onPrint={handlePrint}
                    isGeneratingPDF={isGeneratingPDF}
                  />

                  <ArrearChecklist
                    checklist={checklist}
                    onToggle={handleChecklistToggle}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: MONTHLY SCHEDULE */}
            {activeMainTab === 'schedule' && (
              <div className="space-y-6">
                <InteractiveMonthlySchedule
                  schedule={schedule}
                  employee={employee}
                  onUpdateMonthOverride={handleUpdateMonthOverride}
                  onResetMonthOverride={handleResetMonthOverride}
                  onResetAllOverrides={handleResetAllOverrides}
                />
              </div>
            )}

            {/* TAB 3: OFFICIAL DOCUMENTS PREVIEW */}
            {activeMainTab === 'documents' && (
              <div className="space-y-6">
                <DocumentTabsViewer
                  employee={employee}
                  schedule={schedule}
                  summary={summary}
                  onGeneratePDF={handleExportPDF}
                  onPrint={handlePrint}
                  isGeneratingPDF={isGeneratingPDF}
                />
              </div>
            )}

            {/* TAB 4: CHECKLIST */}
            {activeMainTab === 'checklist' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <ArrearChecklist
                  checklist={checklist}
                  onToggle={handleChecklistToggle}
                />
              </div>
            )}

            {/* TAB 5: TEACHER REVIEWS & FEEDBACK WALL */}
            {activeMainTab === 'reviews' && (
              <div className="space-y-6">
                <FeedbackWall
                  onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Official Government Footer */}
      <Footer
        onSelectTool={(tool) => {
          setActiveTool(tool);
          setIsAdminViewOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTab={(tab) => {
          setActiveTool('arrears');
          setIsAdminViewOpen(false);
          setActiveMainTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminAuthenticated={isAdminAuthenticated}
        onToggleAdminView={() => setIsAdminViewOpen(!isAdminViewOpen)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Dedicated DOM container for 1-click automated PDF generation and print */}
      <div
        id="pdf-render-zone"
        aria-hidden="true"
        className="no-print"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '820px',
          zIndex: -100,
          pointerEvents: 'none',
          opacity: 1,
          visibility: 'visible',
        }}
      >
        <CoveringLetterPreview employee={employee} id="export-covering-letter-page" />
        <AdjustmentBillPreview employee={employee} summary={summary} id="export-adjustment-bill-page" />
        <TR22ObversePreview employee={employee} summary={summary} id="export-tr22-obverse-page" />
        <MonthlySchedulePreview
          employee={employee}
          schedule={schedule}
          summary={summary}
          idPart1="export-schedule-part1-page"
          idPart2="export-schedule-part2-page"
        />
        <TR22ReversePreview employee={employee} summary={summary} id="export-tr22-reverse-page" />
      </div>

      {/* Progress Overlay when Generating PDF */}
      {isGeneratingPDF && pdfProgress && (
        <div className="fixed inset-0 z-[100000] bg-slate-950/90 flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <div className="w-7 h-7 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generating Official Arrears Dossier</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Compiling 6-page government package with high-resolution vector tables
              </p>
            </div>
            <div className="space-y-1.5 text-left bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Rendering Page {pdfProgress.current} of {pdfProgress.total}</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {Math.round((pdfProgress.current / pdfProgress.total) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${(pdfProgress.current / pdfProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate">
                {pdfProgress.pageTitle || 'Processing page...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Missing Required Fields Validation Modal */}
      <MissingFieldsModal
        isOpen={isMissingModalOpen}
        onClose={() => setIsMissingModalOpen(false)}
        missingFields={missingFieldsList}
        onGoToField={handleGoToField}
        actionTitle={missingActionContext}
      />

      {/* Teacher Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        employee={employee}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}
