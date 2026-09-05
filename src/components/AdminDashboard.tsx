import React, { useState } from 'react';
import {
  AdminConfig,
  FormFieldConfig,
  PayScaleGrade,
  AdhocReliefRule,
  CustomAllowance,
  CustomDeduction,
} from '../types';
import {
  ShieldCheck,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Download,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Building,
  DollarSign,
  Layers,
  FolderTree,
  FileCode,
  Sparkles,
  Save,
  CheckCircle2,
  Globe,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { DEFAULT_ADMIN_CONFIG } from '../utils/adminConfigDefaults';

interface Props {
  config: AdminConfig;
  onSaveConfig: (updated: AdminConfig) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ config, onSaveConfig, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'fields' | 'scales' | 'adhocs' | 'custom' | 'ddo' | 'system'
  >('fields');

  const [currentConfig, setCurrentConfig] = useState<AdminConfig>(config);
  const [saveToast, setSaveToast] = useState(false);

  // New field modal / state
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState<Partial<FormFieldConfig>>({
    label: '',
    category: 'personal',
    placeholder: '',
    type: 'text',
    enabled: true,
    required: false,
    helpText: '',
  });

  // New Adhoc Relief state
  const [isAddingAdhoc, setIsAddingAdhoc] = useState(false);
  const [newAdhoc, setNewAdhoc] = useState<Partial<AdhocReliefRule>>({
    name: 'Adhoc Relief 2027 (10%)',
    shortCode: 'adhoc2027',
    percentage: 10,
    calculationBase: 'runningBasic',
    effectiveFrom: '2027-07',
    fixedMonthlyAmount: 2253,
    enabled: true,
    notes: 'Sindh Govt Finance Dept 2027 Revision',
  });

  // New Custom Allowance state
  const [isAddingCustomAllowance, setIsAddingCustomAllowance] = useState(false);
  const [newCustomAllowance, setNewCustomAllowance] = useState<Partial<CustomAllowance>>({
    name: 'Hard Area Allowance',
    code: 'HAA-01',
    type: 'fixed',
    value: 3000,
    enabled: true,
    isTaxable: false,
  });

  // New Custom Deduction state
  const [isAddingCustomDeduction, setIsAddingCustomDeduction] = useState(false);
  const [newCustomDeduction, setNewCustomDeduction] = useState<Partial<CustomDeduction>>({
    name: 'Teacher Welfare Fund',
    code: 'TWF-01',
    type: 'fixed',
    value: 500,
    enabled: true,
  });

  // Password change
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleSaveAll = () => {
    onSaveConfig(currentConfig);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all admin configuration to factory default Sindh Govt standards?')) {
      setCurrentConfig(DEFAULT_ADMIN_CONFIG);
      onSaveConfig(DEFAULT_ADMIN_CONFIG);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // Field toggles
  const handleToggleField = (id: string) => {
    const updatedFields = currentConfig.fields.map((f) =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    );
    const updated = { ...currentConfig, fields: updatedFields };
    setCurrentConfig(updated);
    onSaveConfig(updated);
  };

  const handleToggleFieldRequired = (id: string) => {
    const updatedFields = currentConfig.fields.map((f) =>
      f.id === id ? { ...f, required: !f.required } : f
    );
    const updated = { ...currentConfig, fields: updatedFields };
    setCurrentConfig(updated);
    onSaveConfig(updated);
  };

  const handleUpdateFieldLabel = (id: string, label: string) => {
    const updatedFields = currentConfig.fields.map((f) =>
      f.id === id ? { ...f, label } : f
    );
    const updated = { ...currentConfig, fields: updatedFields };
    setCurrentConfig(updated);
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newField.label) return;

    const id = `custom_${Date.now()}`;
    const fieldKey = `custom_${newField.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const created: FormFieldConfig = {
      id,
      key: fieldKey,
      label: newField.label,
      category: newField.category || 'personal',
      placeholder: newField.placeholder || '',
      type: newField.type || 'text',
      enabled: true,
      required: !!newField.required,
      order: currentConfig.fields.length + 1,
      helpText: newField.helpText || '',
    };

    const updated = {
      ...currentConfig,
      fields: [...currentConfig.fields, created],
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
    setIsAddingField(false);
    setNewField({
      label: '',
      category: 'personal',
      placeholder: '',
      type: 'text',
      enabled: true,
      required: false,
    });
  };

  const handleDeleteField = (id: string) => {
    if (window.confirm('Delete this field?')) {
      const updated = {
        ...currentConfig,
        fields: currentConfig.fields.filter((f) => f.id !== id),
      };
      setCurrentConfig(updated);
      onSaveConfig(updated);
    }
  };

  // Pay scale grade edit
  const handleUpdatePayScale = (bps: number, field: keyof PayScaleGrade, val: number) => {
    const updatedScales = currentConfig.payScales.map((p) =>
      p.bps === bps ? { ...p, [field]: val } : p
    );
    const updated = { ...currentConfig, payScales: updatedScales };
    setCurrentConfig(updated);
  };

  // Adhoc Relief rule toggle & edit
  const handleToggleAdhoc = (id: string) => {
    const updatedAdhocs = currentConfig.adhocRules.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    const updated = { ...currentConfig, adhocRules: updatedAdhocs };
    setCurrentConfig(updated);
    onSaveConfig(updated);
  };

  const handleUpdateAdhoc = (id: string, field: keyof AdhocReliefRule, val: any) => {
    const updatedAdhocs = currentConfig.adhocRules.map((a) =>
      a.id === id ? { ...a, [field]: val } : a
    );
    const updated = { ...currentConfig, adhocRules: updatedAdhocs };
    setCurrentConfig(updated);
  };

  const handleAddAdhocRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdhoc.name) return;
    const id = `adhoc_${Date.now()}`;
    const rule: AdhocReliefRule = {
      id,
      year: newAdhoc.year || 2027,
      name: newAdhoc.name,
      shortCode: newAdhoc.shortCode || `adhoc_${Date.now()}`,
      percentage: Number(newAdhoc.percentage) || 10,
      calculationBase: newAdhoc.calculationBase || 'runningBasic',
      effectiveFrom: newAdhoc.effectiveFrom || '2027-07',
      fixedMonthlyAmount: Number(newAdhoc.fixedMonthlyAmount) || 0,
      enabled: true,
      notes: newAdhoc.notes || '',
    };
    const updated = {
      ...currentConfig,
      adhocRules: [...currentConfig.adhocRules, rule],
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
    setIsAddingAdhoc(false);
  };

  const handleDeleteAdhoc = (id: string) => {
    const updated = {
      ...currentConfig,
      adhocRules: currentConfig.adhocRules.filter((a) => a.id !== id),
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
  };

  // Custom Allowance Add/Delete
  const handleAddCustomAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomAllowance.name) return;
    const allowance: CustomAllowance = {
      id: `ca_${Date.now()}`,
      name: newCustomAllowance.name,
      code: newCustomAllowance.code || 'CA-01',
      type: newCustomAllowance.type || 'fixed',
      value: Number(newCustomAllowance.value) || 0,
      enabled: true,
      isTaxable: !!newCustomAllowance.isTaxable,
    };
    const updated = {
      ...currentConfig,
      customAllowances: [...(currentConfig.customAllowances || []), allowance],
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
    setIsAddingCustomAllowance(false);
  };

  const handleDeleteCustomAllowance = (id: string) => {
    const updated = {
      ...currentConfig,
      customAllowances: currentConfig.customAllowances.filter((a) => a.id !== id),
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
  };

  // Custom Deduction Add/Delete
  const handleAddCustomDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomDeduction.name) return;
    const deduction: CustomDeduction = {
      id: `cd_${Date.now()}`,
      name: newCustomDeduction.name,
      code: newCustomDeduction.code || 'CD-01',
      type: newCustomDeduction.type || 'fixed',
      value: Number(newCustomDeduction.value) || 0,
      enabled: true,
    };
    const updated = {
      ...currentConfig,
      customDeductions: [...(currentConfig.customDeductions || []), deduction],
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
    setIsAddingCustomDeduction(false);
  };

  const handleDeleteCustomDeduction = (id: string) => {
    const updated = {
      ...currentConfig,
      customDeductions: currentConfig.customDeductions.filter((d) => d.id !== id),
    };
    setCurrentConfig(updated);
    onSaveConfig(updated);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    const updated = { ...currentConfig, adminPasswordHash: newPassword.trim() };
    setCurrentConfig(updated);
    onSaveConfig(updated);
    setPasswordChanged(true);
    setNewPassword('');
    setTimeout(() => setPasswordChanged(false), 3000);
  };

  const handleExportConfigJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(currentConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `arrears_admin_config_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportConfigJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.fields && json.payScales) {
          setCurrentConfig(json);
          onSaveConfig(json);
          alert('Admin configuration imported successfully!');
        } else {
          alert('Invalid admin config file structure.');
        }
      } catch (err) {
        alert('Failed to parse config JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-700 space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Admin Control &amp; Formula Studio
              </h2>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                Full Master Access
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Customize input form fields, adjust Sindh pay scale formulas, configure adhoc reliefs, and manage calculation rules for public visitors.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/30 flex items-center space-x-1.5 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Exit Admin Mode</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveToast && (
        <div className="bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 text-xs px-4 py-3 rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>All system configurations and calculation formulas updated live!</span>
          </div>
          <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300 font-mono">
            SYNCED
          </span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'fields', label: '1. Form Fields (Add/Remove/Hide)', icon: Sliders },
          { id: 'scales', label: '2. Pay Scales & Base Rates (BPS 9-18)', icon: DollarSign },
          { id: 'adhocs', label: '3. Adhoc Reliefs & Rules (2017–2026+)', icon: Layers },
          { id: 'custom', label: '4. Custom Allowances & Deductions', icon: Sparkles },
          { id: 'ddo', label: '5. DDO & Districts Master', icon: Building },
          { id: 'system', label: '6. Cloudflare / Astro Deploy & Backup', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FORM FIELDS MANAGER */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-indigo-400" />
                Input Form Fields Customizer (Total: {currentConfig.fields.length} Fields)
              </h3>
              <p className="text-xs text-slate-400">
                Enable or disable fields shown to visitors, modify titles, and add custom fields.
              </p>
            </div>
            <button
              onClick={() => setIsAddingField(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Field</span>
            </button>
          </div>

          {/* Add Field Modal Form */}
          {isAddingField && (
            <form
              onSubmit={handleAddCustomField}
              className="bg-slate-800 p-4 rounded-2xl border-2 border-indigo-500/50 space-y-3 text-xs"
            >
              <div className="font-bold text-indigo-300 flex items-center justify-between">
                <span>Create New Custom Parameter Field</span>
                <button
                  type="button"
                  onClick={() => setIsAddingField(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Field Label / Title</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="e.g. Seniority Serial #"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Field Category</label>
                  <select
                    value={newField.category}
                    onChange={(e) =>
                      setNewField({ ...newField, category: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="personal">Personal Info</option>
                    <option value="posting">School &amp; Posting</option>
                    <option value="period">Dates &amp; Period</option>
                    <option value="rates">Allowances &amp; Rates</option>
                    <option value="ddo">DDO &amp; Section</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Input Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="text">Text Input</option>
                    <option value="number">Numeric Value</option>
                    <option value="date">Date Picker</option>
                    <option value="boolean">Yes / No Switch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={newField.placeholder}
                    onChange={(e) =>
                      setNewField({ ...newField, placeholder: e.target.value })
                    }
                    placeholder="e.g. Enter seniority"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                    className="rounded text-indigo-500"
                  />
                  <span>Mark as strictly required field</span>
                </label>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Save Field
                </button>
              </div>
            </form>
          )}

          {/* Fields List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentConfig.fields.map((field, idx) => (
              <div
                key={field.id}
                className={`p-3.5 rounded-2xl border transition ${
                  field.enabled
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {field.category}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleToggleFieldRequired(field.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                        field.required
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-700 text-slate-400 border-slate-600'
                      }`}
                      title="Toggle required status"
                    >
                      {field.required ? 'Required' : 'Optional'}
                    </button>
                    <button
                      onClick={() => handleToggleField(field.id)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                        field.enabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {field.enabled ? 'ACTIVE' : 'HIDDEN'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleUpdateFieldLabel(field.id, e.target.value)}
                    className="w-full px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded font-semibold text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                    <span>Key: {field.key}</span>
                    <span className="text-indigo-400 font-sans font-bold capitalize">
                      [{field.type}]
                    </span>
                  </div>
                </div>

                {field.id.startsWith('custom_') && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex justify-end">
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete Field
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PAY SCALES MATRIX (BPS 9 TO 18) */}
      {activeTab === 'scales' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-indigo-400" />
                Sindh Government Pay Scales 2022/2026 Allowance Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Update base figures for any BPS grade. Calculations for visitors automatically adapt when they pick their BPS.
              </p>
            </div>
            <button
              onClick={handleSaveAll}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Save Matrix</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-700 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-800 text-slate-300 font-bold border-b border-slate-700">
                <tr className="divide-x divide-slate-700">
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-2 text-right">Initial Basic</th>
                  <th className="py-2.5 px-2 text-right">Increment</th>
                  <th className="py-2.5 px-2 text-right">House Rent (Urban)</th>
                  <th className="py-2.5 px-2 text-right">House Rent (Rural)</th>
                  <th className="py-2.5 px-2 text-right">Conveyance</th>
                  <th className="py-2.5 px-2 text-right">Medical</th>
                  <th className="py-2.5 px-2 text-right">GPF Rate</th>
                  <th className="py-2.5 px-2 text-right">BF Rate</th>
                  <th className="py-2.5 px-2 text-right">GI Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {currentConfig.payScales.map((scale) => (
                  <tr key={scale.bps} className="hover:bg-slate-800/40 divide-x divide-slate-800">
                    <td className="py-2 px-3 font-sans font-bold text-white bg-slate-800/60">
                      {scale.name}
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.initialBasicPay}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'initialBasicPay',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-emerald-400 font-bold"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.annualIncrement}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'annualIncrement',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-200"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.houseRentUrban}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'houseRentUrban',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-200"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.houseRentRural}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'houseRentRural',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-200"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.conveyanceAllowance}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'conveyanceAllowance',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-200"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.medicalAllowance}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'medicalAllowance',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-200"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.gpfRate}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'gpfRate',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-amber-300 font-bold"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.bfRate}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'bfRate',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-14 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-300"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={scale.giRate}
                        onChange={(e) =>
                          handleUpdatePayScale(
                            scale.bps,
                            'giRate',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-14 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-slate-300"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADHOC RELIEFS & RULES */}
      {activeTab === 'adhocs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center">
                <Layers className="w-4 h-4 mr-2 text-indigo-400" />
                Adhoc Relief Allowances &amp; Chronological Applicability Rules
              </h3>
              <p className="text-xs text-slate-400">
                Control Adhoc Relief percentages, effective cut-off dates, and add upcoming adhoc revisions.
              </p>
            </div>
            <button
              onClick={() => setIsAddingAdhoc(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Adhoc Relief</span>
            </button>
          </div>

          {/* Add Adhoc Modal Form */}
          {isAddingAdhoc && (
            <form
              onSubmit={handleAddAdhocRule}
              className="bg-slate-800 p-4 rounded-2xl border-2 border-indigo-500/50 space-y-3 text-xs"
            >
              <div className="font-bold text-indigo-300 flex items-center justify-between">
                <span>Configure Future / Custom Adhoc Relief Allowance</span>
                <button
                  type="button"
                  onClick={() => setIsAddingAdhoc(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Adhoc Name</label>
                  <input
                    type="text"
                    value={newAdhoc.name}
                    onChange={(e) => setNewAdhoc({ ...newAdhoc, name: e.target.value })}
                    placeholder="e.g. Adhoc Relief 2027 (10%)"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAdhoc.percentage}
                    onChange={(e) =>
                      setNewAdhoc({ ...newAdhoc, percentage: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Effective From (YYYY-MM)</label>
                  <input
                    type="text"
                    value={newAdhoc.effectiveFrom}
                    onChange={(e) =>
                      setNewAdhoc({ ...newAdhoc, effectiveFrom: e.target.value })
                    }
                    placeholder="2027-07"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Fixed Monthly Amount (PKR)</label>
                  <input
                    type="number"
                    value={newAdhoc.fixedMonthlyAmount}
                    onChange={(e) =>
                      setNewAdhoc({
                        ...newAdhoc,
                        fixedMonthlyAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Add Adhoc Rule
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentConfig.adhocRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-2xl border transition ${
                  rule.enabled
                    ? 'bg-slate-800/90 border-slate-700'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{rule.name}</span>
                    <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      From {rule.effectiveFrom}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleAdhoc(rule.id)}
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                      rule.enabled
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">
                      Percentage (% of Basic)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={rule.percentage}
                      onChange={(e) =>
                        handleUpdateAdhoc(
                          rule.id,
                          'percentage',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">
                      Base Monthly Rate (PKR)
                    </label>
                    <input
                      type="number"
                      value={rule.fixedMonthlyAmount || 0}
                      onChange={(e) =>
                        handleUpdateAdhoc(
                          rule.id,
                          'fixedMonthlyAmount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>
                </div>

                {rule.notes && (
                  <p className="text-[10px] text-slate-400 mt-2 italic">{rule.notes}</p>
                )}

                {rule.id.startsWith('adhoc_') && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex justify-end">
                    <button
                      onClick={() => handleDeleteAdhoc(rule.id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete Custom Rule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM ALLOWANCES & DEDUCTIONS BUILDER */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Custom Allowances */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" />
                  Custom Additional Allowances (Adds to Gross Salary)
                </h4>
                <p className="text-[11px] text-slate-400">
                  e.g. Hard Area Allowance, Qualification Allowance, Executive Allowance, Computer Allowance
                </p>
              </div>
              <button
                onClick={() => setIsAddingCustomAllowance(true)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Allowance</span>
              </button>
            </div>

            {isAddingCustomAllowance && (
              <form
                onSubmit={handleAddCustomAllowance}
                className="bg-slate-800 p-3 rounded-xl border border-indigo-500/50 space-y-2 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-0.5">Allowance Name</label>
                    <input
                      type="text"
                      value={newCustomAllowance.name}
                      onChange={(e) =>
                        setNewCustomAllowance({
                          ...newCustomAllowance,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Hard Area Allowance"
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-0.5">Allowance Code</label>
                    <input
                      type="text"
                      value={newCustomAllowance.code}
                      onChange={(e) =>
                        setNewCustomAllowance({
                          ...newCustomAllowance,
                          code: e.target.value,
                        })
                      }
                      placeholder="e.g. HAA-01"
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-0.5">Monthly Amount (PKR)</label>
                    <input
                      type="number"
                      value={newCustomAllowance.value}
                      onChange={(e) =>
                        setNewCustomAllowance({
                          ...newCustomAllowance,
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomAllowance(false)}
                    className="px-2.5 py-1 text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 text-white rounded font-bold"
                  >
                    Add to System
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(currentConfig.customAllowances || []).map((ca) => (
                <div
                  key={ca.id}
                  className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{ca.name}</div>
                    <div className="text-[11px] font-mono text-emerald-400">
                      + Rs. {ca.value.toLocaleString()} / mo ({ca.code})
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomAllowance(ca.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {(currentConfig.customAllowances || []).length === 0 && (
                <div className="col-span-full p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  No extra custom allowances active. Standard Sindh Government allowances apply.
                </div>
              )}
            </div>
          </div>

          {/* Custom Deductions */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                  <FolderTree className="w-4 h-4 mr-1.5 text-rose-400" />
                  Custom Deductions (Adds to Monthly Deductions)
                </h4>
                <p className="text-[11px] text-slate-400">
                  e.g. Teacher Welfare Fund, Union Fund, Special Relief Contribution
                </p>
              </div>
              <button
                onClick={() => setIsAddingCustomDeduction(true)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Deduction</span>
              </button>
            </div>

            {isAddingCustomDeduction && (
              <form
                onSubmit={handleAddCustomDeduction}
                className="bg-slate-800 p-3 rounded-xl border border-indigo-500/50 space-y-2 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-0.5">Deduction Name</label>
                    <input
                      type="text"
                      value={newCustomDeduction.name}
                      onChange={(e) =>
                        setNewCustomDeduction({
                          ...newCustomDeduction,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. Welfare Fund"
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-0.5">Deduction Code</label>
                    <input
                      type="text"
                      value={newCustomDeduction.code}
                      onChange={(e) =>
                        setNewCustomDeduction({
                          ...newCustomDeduction,
                          code: e.target.value,
                        })
                      }
                      placeholder="e.g. WF-01"
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-0.5">Monthly Amount (PKR)</label>
                    <input
                      type="number"
                      value={newCustomDeduction.value}
                      onChange={(e) =>
                        setNewCustomDeduction({
                          ...newCustomDeduction,
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomDeduction(false)}
                    className="px-2.5 py-1 text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-rose-600 text-white rounded font-bold"
                  >
                    Add Deduction
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(currentConfig.customDeductions || []).map((cd) => (
                <div
                  key={cd.id}
                  className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{cd.name}</div>
                    <div className="text-[11px] font-mono text-rose-400">
                      - Rs. {cd.value.toLocaleString()} / mo ({cd.code})
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomDeduction(cd.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DDO & DISTRICTS MASTER */}
      {activeTab === 'ddo' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center">
              <Building className="w-4 h-4 mr-2 text-indigo-400" />
              Master DDO Profiles &amp; District Directory
            </h3>
            <p className="text-xs text-slate-400">
              Preset DDO codes, Section names, and Cost Centers for quick auto-fill across all Sindh districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {currentConfig.ddoMasters.map((ddo, i) => (
              <div
                key={i}
                className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 font-mono text-sm">
                    {ddo.code}
                  </span>
                  <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                    Cost Center: {ddo.costCenter}
                  </span>
                </div>
                <div className="font-semibold text-white">{ddo.firstLine}</div>
                <div className="text-slate-400 text-[11px]">{ddo.secondLine}</div>
                <div className="text-[10px] text-amber-400">District: {ddo.district}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FREE CLOUDFLARE PAGES / ASTRO DEPLOYMENT & BACKUP */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Cloudflare Pages / Astro Deployment Guide */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span>How to Host this Project on Cloudflare Pages (100% Free Forever)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              This entire application is written in clean, dependency-pure React/TypeScript with zero external server dependencies needed for calculations or PDF rendering. You can host it on <strong>Cloudflare Pages</strong> or convert to <strong>Astro</strong> with zero cost:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-indigo-400 font-bold"># Step 1: Push code to your GitHub Repository</div>
              <div>git add . &amp;&amp; git commit -m &quot;Sindh Arrears Portal&quot; &amp;&amp; git push</div>
              <div className="text-indigo-400 font-bold mt-2"># Step 2: In Cloudflare Pages Dashboard</div>
              <div>Select &quot;Create Application&quot; &rarr; &quot;Pages&quot; &rarr; Connect GitHub</div>
              <div className="text-indigo-400 font-bold mt-2"># Step 3: Build Settings</div>
              <div>Build command: <span className="text-emerald-400 font-bold">npm run build</span></div>
              <div>Output directory: <span className="text-emerald-400 font-bold">dist</span></div>
            </div>
          </div>

          {/* Backup & Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup / Restore */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center">
                <Download className="w-4 h-4 mr-1.5 text-emerald-400" />
                Backup &amp; Restore Admin Configuration
              </h4>
              <p className="text-slate-400 text-[11px]">
                Export all field setups, allowance matrix rates, and DDO masters to a JSON file to transfer between devices.
              </p>
              <div className="flex space-x-2 pt-1">
                <button
                  onClick={handleExportConfigJSON}
                  className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl font-bold flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.json)</span>
                </button>
                <label className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportConfigJSON}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <button
                  onClick={handleResetToDefaults}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Everything to Factory Default Rates
                </button>
              </div>
            </div>

            {/* Change Admin Password */}
            <form
              onSubmit={handleChangePassword}
              className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs"
            >
              <h4 className="font-bold text-white flex items-center">
                <Lock className="w-4 h-4 mr-1.5 text-amber-400" />
                Change Master Admin Password
              </h4>
              <p className="text-slate-400 text-[11px]">
                Update the master password required to access the admin studio and modify departmental pay scale rules.
              </p>
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new master password"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition"
              >
                Update Admin Password
              </button>
              {passwordChanged && (
                <div className="text-emerald-400 font-bold text-center text-xs">
                  Password successfully updated!
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
