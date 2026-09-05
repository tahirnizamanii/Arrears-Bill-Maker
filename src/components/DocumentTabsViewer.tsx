import React, { useState } from 'react';
import { EmployeeData, MonthlyBreakdown, ArrearsSummary } from '../types';
import { CoveringLetterPreview } from './CoveringLetterPreview';
import { AdjustmentBillPreview } from './AdjustmentBillPreview';
import { TR22ObversePreview } from './TR22ObversePreview';
import { MonthlySchedulePreview } from './MonthlySchedulePreview';
import { TR22ReversePreview } from './TR22ReversePreview';
import { ResponsiveA4Page } from './ResponsiveA4Page';
import { Download, Printer, ExternalLink, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Props {
  employee: EmployeeData;
  schedule: MonthlyBreakdown[];
  summary: ArrearsSummary;
  onGeneratePDF: () => void;
  onPrint: () => void;
  isGeneratingPDF: boolean;
}

export type DocumentTab = 'all' | 'covering' | 'adjustment' | 'tr22-obverse' | 'schedule' | 'tr22-reverse';

export const DocumentTabsViewer: React.FC<Props> = ({
  employee,
  schedule,
  summary,
  onGeneratePDF,
  onPrint,
  isGeneratingPDF,
}) => {
  const [activeTab, setActiveTab] = useState<DocumentTab>('all');
  // zoomScale: 0 = Auto Fit to width, 0.5 = 50%, 0.75 = 75%, 1 = 100%, 1.25 = 125%
  const [zoomScale, setZoomScale] = useState<number>(0);

  const tabs: { id: DocumentTab; label: string; number: string }[] = [
    { id: 'all', label: 'All 6 Pages (Official Dossier)', number: 'All' },
    { id: 'covering', label: 'Office Covering Letter', number: '01' },
    { id: 'adjustment', label: 'Adjustment Bill (DAO)', number: '02' },
    { id: 'tr22-obverse', label: 'Form T.R.22 (Obverse)', number: '03' },
    { id: 'schedule', label: 'Monthly Schedule (1-28)', number: '04' },
    { id: 'tr22-reverse', label: 'T.R.22 Reverse & Certs', number: '05' },
  ];

  const employeePrintUrl = `/employee-details-print.html?section=${encodeURIComponent(employee.costCenter || 'GA-III')}&costCentre=${encodeURIComponent(employee.ddoCode || 'HB0398')}&department=${encodeURIComponent('Education Department')}&personnelNo=${encodeURIComponent(employee.personnelId || '11139423')}&name=${encodeURIComponent(employee.name || 'MUHAMMAD OWAIS')}&fatherName=${encodeURIComponent(employee.fatherName || 'SHAMIM IQBAL')}&designation=${encodeURIComponent((employee.designation || 'PST') + ' (BPS-' + (employee.bps || '14') + ')')}&cnic=${encodeURIComponent(employee.cnic || '41303-7744530-3')}`;

  const handleZoomIn = () => {
    if (zoomScale === 0) {
      setZoomScale(1.0);
    } else {
      setZoomScale((prev) => Math.min(1.5, Number((prev + 0.15).toFixed(2))));
    }
  };

  const handleZoomOut = () => {
    if (zoomScale === 0) {
      setZoomScale(0.6);
    } else {
      setZoomScale((prev) => Math.max(0.4, Number((prev - 0.15).toFixed(2))));
    }
  };

  const handleToggleFit = () => {
    setZoomScale(zoomScale === 0 ? 1.0 : 0);
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-neutral-200 space-y-3">
        {/* Document Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                activeTab === tab.id ? 'bg-indigo-700 text-indigo-100' : 'bg-neutral-200 text-neutral-600'
              }`}>
                {tab.number}
              </span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Actions & Zoom Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-neutral-100">
          {/* Zoom & View Mode Controller (Ideal for mobile preview) */}
          <div className="flex items-center space-x-1 bg-neutral-100/90 p-1 rounded-xl w-fit self-start sm:self-auto">
            <button
              onClick={handleToggleFit}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center transition ${
                zoomScale === 0
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Automatically fit document to screen width"
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              <span>{zoomScale === 0 ? 'Fit Width' : '100%'}</span>
            </button>
            <div className="h-3.5 w-px bg-neutral-300" />
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-md text-neutral-600 hover:bg-white hover:text-neutral-900 transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 font-semibold text-neutral-600 min-w-[34px] text-center">
              {zoomScale === 0 ? 'Auto' : `${Math.round(zoomScale * 100)}%`}
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-md text-neutral-600 hover:bg-white hover:text-neutral-900 transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <a
              href={employeePrintUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center transition"
              title="Open standalone print-ready Employee Details form in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
              <span className="truncate">Employee Form</span>
            </a>
            <button
              onClick={onPrint}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span>Print</span>
            </button>
            <button
              onClick={onGeneratePDF}
              disabled={isGeneratingPDF}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition disabled:opacity-50 shadow-sm shadow-indigo-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span className="truncate">{isGeneratingPDF ? 'Generating...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Responsive Document Previews */}
      <div className="bg-neutral-200/80 p-3 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 sm:space-y-8">
        {(activeTab === 'all' || activeTab === 'covering') && (
          <ResponsiveA4Page pageTitle="Page 1 — Office Covering Letter" zoomScale={zoomScale}>
            <CoveringLetterPreview employee={employee} id="preview-covering-page" />
          </ResponsiveA4Page>
        )}

        {(activeTab === 'all' || activeTab === 'adjustment') && (
          <ResponsiveA4Page pageTitle="Page 2 — Adjustment Bill (District Accounts Office)" zoomScale={zoomScale}>
            <AdjustmentBillPreview employee={employee} summary={summary} id="preview-adjustment-page" />
          </ResponsiveA4Page>
        )}

        {(activeTab === 'all' || activeTab === 'tr22-obverse') && (
          <ResponsiveA4Page pageTitle="Page 3 — Form T.R.22 (Obverse)" zoomScale={zoomScale}>
            <TR22ObversePreview employee={employee} summary={summary} id="preview-tr22-obverse-page" />
          </ResponsiveA4Page>
        )}

        {(activeTab === 'all' || activeTab === 'schedule') && (
          <div className="space-y-6 sm:space-y-8">
            <ResponsiveA4Page pageTitle="Page 4 — Detailed Month-wise Pay Schedule (Columns 1 - 18)" zoomScale={zoomScale}>
              <MonthlySchedulePreview
                employee={employee}
                schedule={schedule}
                summary={summary}
                idPart1="preview-schedule-part1-page"
                renderPart="part1"
              />
            </ResponsiveA4Page>
            <ResponsiveA4Page pageTitle="Page 5 — Detailed Month-wise Pay Schedule (Columns 19 - 28)" zoomScale={zoomScale}>
              <MonthlySchedulePreview
                employee={employee}
                schedule={schedule}
                summary={summary}
                idPart2="preview-schedule-part2-page"
                renderPart="part2"
              />
            </ResponsiveA4Page>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'tr22-reverse') && (
          <ResponsiveA4Page pageTitle="Page 6 — Form T.R.22 (Reverse &amp; Statutory Certifications)" zoomScale={zoomScale}>
            <TR22ReversePreview employee={employee} summary={summary} id="preview-tr22-reverse-page" />
          </ResponsiveA4Page>
        )}
      </div>
    </div>
  );
};
