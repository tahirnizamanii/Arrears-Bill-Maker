import React, { useState } from 'react';
import { MonthlyBreakdown, EmployeeData } from '../types';
import { formatCurrency, formatCurrencyWithZero } from '../utils/numberToWords';
import { Table, Edit3, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  schedule: MonthlyBreakdown[];
  employee: EmployeeData;
  onUpdateMonthOverride: (yearMonth: string, overrides: Partial<MonthlyBreakdown>) => void;
  onResetMonthOverride: (yearMonth: string) => void;
  onResetAllOverrides: () => void;
}

export const InteractiveMonthlySchedule: React.FC<Props> = ({
  schedule,
  employee,
  onUpdateMonthOverride,
  onResetMonthOverride,
  onResetAllOverrides,
}) => {
  const [editingMonthId, setEditingMonthId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MonthlyBreakdown>>({});

  const hasAnyOverrides = Object.keys(employee.manualOverrides || {}).length > 0;

  const startEditing = (row: MonthlyBreakdown) => {
    setEditingMonthId(row.id);
    setEditForm({
      basicPay: row.basicPay,
      houseRent: row.houseRent,
      conveyance: row.conveyance,
      medicalAllowance: row.medicalAllowance,
      adhoc2022: row.adhoc2022,
      adhoc2023: row.adhoc2023,
      adhoc2024: row.adhoc2024,
      adhoc2025: row.adhoc2025,
      diffAllowance2022: row.diffAllowance2022,
      diffAllowance2026: row.diffAllowance2026,
      gpf: row.gpf,
      benevolentFund: row.benevolentFund,
      groupInsurance: row.groupInsurance,
    });
  };

  const saveEditing = (yearMonth: string) => {
    onUpdateMonthOverride(yearMonth, {
      ...editForm,
      isModified: true,
    });
    setEditingMonthId(null);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-200 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <h3 className="text-base font-bold text-neutral-900 flex items-center">
            <Table className="w-5 h-5 mr-2 text-indigo-600" />
            Live Month-by-Month Calculation Schedule
          </h3>
          <p className="text-xs text-neutral-500">
            Prorated daily calculations with automatic Adhoc Relief applicability. Click &lsquo;Edit Row&rsquo; to customize specific past drawn items.
          </p>
        </div>

        {hasAnyOverrides && (
          <button
            onClick={onResetAllOverrides}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center transition"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset All Manual Overrides
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-neutral-200 rounded-xl max-h-[500px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-neutral-100 sticky top-0 z-10 font-bold border-b border-neutral-300 text-neutral-700">
            <tr className="divide-x divide-neutral-200">
              <th className="py-2.5 px-2 text-center w-10">S.#</th>
              <th className="py-2.5 px-3 w-24">Month</th>
              <th className="py-2.5 px-2 text-center w-20">Days</th>
              <th className="py-2.5 px-2 text-right">Basic Pay</th>
              <th className="py-2.5 px-2 text-right">House Rent</th>
              <th className="py-2.5 px-2 text-right">Conveyance</th>
              <th className="py-2.5 px-2 text-right">Medical</th>
              <th className="py-2.5 px-2 text-right">Adhoc 22</th>
              <th className="py-2.5 px-2 text-right">Adhoc 23</th>
              <th className="py-2.5 px-2 text-right">Adhoc 24</th>
              <th className="py-2.5 px-2 text-right">Adhoc 25</th>
              <th className="py-2.5 px-2 text-right">Diff 22</th>
              <th className="py-2.5 px-2 text-right">DA-26</th>
              <th className="py-2.5 px-2 text-right font-black bg-neutral-200">Gross</th>
              <th className="py-2.5 px-2 text-right">GPF</th>
              <th className="py-2.5 px-2 text-right">BF</th>
              <th className="py-2.5 px-2 text-right">GI</th>
              <th className="py-2.5 px-2 text-right font-bold text-red-700 bg-red-50">Deductions</th>
              <th className="py-2.5 px-3 text-right font-black text-emerald-900 bg-emerald-50">Net Payable</th>
              <th className="py-2.5 px-2 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 font-mono text-[11px]">
            {schedule.map((row) => {
              const isEditing = editingMonthId === row.id;

              return (
                <tr
                  key={row.id}
                  className={`divide-x divide-neutral-200 transition ${
                    row.isModified
                      ? 'bg-amber-50/60 hover:bg-amber-100/50'
                      : row.isPartial
                      ? 'bg-blue-50/40 hover:bg-blue-100/40'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <td className="py-2 px-2 text-center font-sans">{row.index}</td>
                  <td className="py-2 px-2.5 font-sans font-bold flex flex-col items-start gap-0.5">
                    <div className="flex items-center justify-between w-full">
                      <span>{row.monthLabel}</span>
                      {row.isModified && (
                        <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-mono">
                          MOD
                        </span>
                      )}
                    </div>
                    {row.appliedEvents && row.appliedEvents.length > 0 && (
                      <div className="flex flex-wrap gap-0.5">
                        {row.appliedEvents.map((ev, i) => (
                          <span
                            key={i}
                            title={ev}
                            className={`text-[8.5px] px-1 py-0.2 rounded font-sans font-normal ${
                              ev.includes('Budget')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            }`}
                          >
                            {ev.includes('Budget') ? 'July Budget' : 'Dec Inc'}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center font-sans">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        row.isPartial
                          ? 'bg-blue-200 text-blue-900'
                          : 'text-neutral-600'
                      }`}
                    >
                      {row.daysClaimed}/{row.daysInMonth}
                    </span>
                  </td>

                  {/* If editing row */}
                  {isEditing ? (
                    <>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.basicPay ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, basicPay: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.houseRent ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, houseRent: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.conveyance ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, conveyance: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.medicalAllowance ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, medicalAllowance: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.adhoc2022 ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, adhoc2022: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.adhoc2023 ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, adhoc2023: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.adhoc2024 ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, adhoc2024: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.adhoc2025 ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, adhoc2025: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.diffAllowance2022 ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, diffAllowance2022: parseFloat(e.target.value) || 0 })}
                          className="w-16 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.diffAllowance2026 ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, diffAllowance2026: parseFloat(e.target.value) || 0 })}
                          className="w-14 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-bold bg-neutral-100">Live</td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.gpf ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, gpf: parseFloat(e.target.value) || 0 })}
                          className="w-14 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.benevolentFund ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, benevolentFund: parseFloat(e.target.value) || 0 })}
                          className="w-12 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={editForm.groupInsurance ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, groupInsurance: parseFloat(e.target.value) || 0 })}
                          className="w-12 p-1 border rounded text-right bg-white"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-red-700 bg-red-50">Live</td>
                      <td className="py-2 px-3 text-right font-black text-emerald-900 bg-emerald-50">Live</td>
                      <td className="py-1 px-1 text-center">
                        <button
                          onClick={() => saveEditing(row.yearMonth)}
                          className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-sans text-[10px] font-bold"
                          title="Save override"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.basicPay)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.houseRent)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.conveyance)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.medicalAllowance)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.adhoc2022)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.adhoc2023)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.adhoc2024)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.adhoc2025)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.diffAllowance2022)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.diffAllowance2026)}</td>
                      <td className="py-2 px-2 text-right font-bold bg-neutral-100">{formatCurrency(row.totalGross)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.gpf)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.benevolentFund)}</td>
                      <td className="py-2 px-2 text-right">{formatCurrency(row.groupInsurance)}</td>
                      <td className="py-2 px-2 text-right font-bold text-red-700 bg-red-50/60">{formatCurrency(row.totalDeduction)}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-900 bg-emerald-50/80">{formatCurrency(row.netPayable)}</td>
                      <td className="py-1 px-1 text-center font-sans">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => startEditing(row)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                            title="Edit this month"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {row.isModified && (
                            <button
                              onClick={() => onResetMonthOverride(row.yearMonth)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title="Reset to default formula"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
