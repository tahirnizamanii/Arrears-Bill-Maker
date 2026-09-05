import React, { useState } from 'react';
import { EmployeeData, AdminConfig } from '../types';
import { REGIONS_DISTRICTS_MAP, TALUKAS_MAP } from '../utils/regionsData';
import {
  User,
  Building2,
  Calendar,
  DollarSign,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  MapPin,
  Briefcase,
  HelpCircle,
  Info,
  X,
  AlertTriangle,
} from 'lucide-react';
import { DEFAULT_ADMIN_CONFIG } from '../utils/adminConfigDefaults';
import {
  getMissingFields,
  getMissingFieldsForStep,
  MissingFieldItem,
} from '../utils/formValidation';

interface Props {
  employee: EmployeeData;
  onChange: (updated: EmployeeData) => void;
  adminConfig?: AdminConfig;
  onNavigateTab?: (tab: 'schedule' | 'documents' | 'checklist') => void;
  activeStep?: number;
  onStepChange?: (step: number) => void;
  onValidationFailed?: (missing: MissingFieldItem[], stepNumber?: number) => void;
}

const FieldTooltip: React.FC<{ content: string }> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle select-none">
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        title={content}
        className="inline-flex items-center justify-center p-0.5 text-slate-400 hover:text-indigo-600 active:text-indigo-700 rounded-full hover:bg-indigo-50 transition cursor-pointer"
        aria-label={`Audit guide: ${content}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </span>

      {isOpen && (
        <span
          role="tooltip"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute left-0 top-full mt-1.5 z-50 w-60 sm:w-72 p-2.5 text-[11px] font-normal leading-relaxed text-slate-100 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 text-left pointer-events-auto select-text normal-case tracking-normal block cursor-default"
        >
          <span className="flex items-start justify-between gap-1.5 mb-1">
            <span className="font-semibold text-indigo-300 text-[10px] tracking-wide uppercase flex items-center gap-1">
              <Info className="w-3 h-3 text-indigo-400 shrink-0" />
              Treasury &amp; Audit Guide
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
              title="Close guide"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
          <span className="text-slate-200 text-[11px] leading-relaxed block font-normal">
            {content}
          </span>
          <span className="absolute bottom-full left-2 border-4 border-transparent border-b-slate-900" />
        </span>
      )}
    </span>
  );
};

export const DataInputForm: React.FC<Props> = ({
  employee,
  onChange,
  adminConfig = DEFAULT_ADMIN_CONFIG,
  onNavigateTab,
  activeStep,
  onStepChange,
  onValidationFailed,
}) => {
  const [internalStep, setInternalStep] = useState<number>(1);
  const currentStep = activeStep !== undefined ? activeStep : internalStep;

  const setCurrentStep = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === 'function' ? updater(currentStep) : updater;
    if (onStepChange) {
      onStepChange(next);
    } else {
      setInternalStep(next);
    }
  };

  const [showAdvancedRates, setShowAdvancedRates] = useState(false);

  // Field config helper
  const getFieldConfig = (key: string) => {
    return adminConfig.fields.find((f) => f.key === key);
  };

  const isFieldEnabled = (key: string) => {
    const f = getFieldConfig(key);
    return f ? f.enabled : true;
  };

  const getFieldLabel = (key: string, fallback: string) => {
    const f = getFieldConfig(key);
    if (!f || !f.label) return fallback;
    let label = f.label;
    if (key === 'isTeachingAllowance') {
      return 'Teaching / B.Ed Allowance';
    }
    if (label.includes('1,500') || label.includes('1500')) {
      label = label.replace(/1,?500/g, '1,000');
    }
    return label;
  };

  const isFieldRequired = (key: string) => {
    const f = getFieldConfig(key);
    if (f && typeof f.required === 'boolean') {
      return f.required;
    }
    return [
      'name',
      'fatherName',
      'designation',
      'bps',
      'cnic',
      'personnelId',
      'region',
      'district',
      'taluka',
      'schoolName',
      'semisCode',
      'appointmentDate',
      'arrearUptoDate',
      'ddoFirstLine',
      'ddoSecondLine',
      'ddoCode',
      'costCenter',
    ].includes(key);
  };

  const allMissingFields = getMissingFields(employee, adminConfig);

  const handleFieldChange = (field: keyof EmployeeData, value: any) => {
    const updated = { ...employee, [field]: value };

    // Auto-update scale allowances when BPS changes
    if (field === 'bps') {
      const scaleGrade = adminConfig.payScales.find((p) => p.bps === value);
      if (scaleGrade) {
        updated.basicPayRate = scaleGrade.initialBasicPay;
        updated.incrementAmount = scaleGrade.annualIncrement;
        updated.houseRentRateUrban = scaleGrade.houseRentUrban;
        updated.houseRentRateRural = scaleGrade.houseRentRural;
        updated.conveyanceRate = scaleGrade.conveyanceAllowance;
        updated.medicalAllowanceRate = scaleGrade.medicalAllowance;
        updated.gpfRate = scaleGrade.gpfRate;
        updated.bfRate = scaleGrade.bfRate;
        updated.giRate = scaleGrade.giRate;
      }
    }

    // Auto-set standard teaching/B.Ed allowance rate if enabled
    if (field === 'isTeachingAllowance' && value) {
      if (!updated.teachingAllowanceRate || updated.teachingAllowanceRate === 1500) {
        updated.teachingAllowanceRate = 1000;
      }
    }

    // Auto-update districts when region changes
    if (field === 'region') {
      const regionMap = adminConfig.regionsDistricts || REGIONS_DISTRICTS_MAP;
      const districts = regionMap[value] || [];
      if (districts.length > 0 && !districts.includes(updated.district)) {
        updated.district = districts[0];
        const talukaMap = adminConfig.talukas || TALUKAS_MAP;
        const talukas = talukaMap[districts[0]] || [];
        updated.taluka = talukas[0] || '';
      }
    }

    // Auto-update talukas when district changes
    if (field === 'district') {
      const talukaMap = adminConfig.talukas || TALUKAS_MAP;
      const talukas = talukaMap[value] || [];
      if (talukas.length > 0 && !talukas.includes(updated.taluka)) {
        updated.taluka = talukas[0];
      }
    }

    onChange(updated);
  };

  const handleCustomFieldChange = (fieldKey: string, value: any) => {
    const updatedCustom = {
      ...(employee.customFieldValues || {}),
      [fieldKey]: value,
    };
    onChange({
      ...employee,
      customFieldValues: updatedCustom,
    });
  };

  const regionMap = adminConfig.regionsDistricts || REGIONS_DISTRICTS_MAP;
  const talukaMap = adminConfig.talukas || TALUKAS_MAP;

  const currentDistricts = regionMap[employee.region] || [
    'Hyderabad',
    'Matiari',
    'Jamshoro',
    'Tando Allahyar',
    'Badin',
    'Thatta',
    'Karachi Central',
    'Sukkur',
    'Larkana',
    'Mirpurkhas',
    'Shaheed Benazirabad',
  ];

  const currentTalukas = talukaMap[employee.district] || [
    'Hyderabad City',
    'Latifabad',
    'Qasimabad',
    'Hyderabad Rural',
    'Kotri',
    'Matiari',
    'Nawabshah',
    'Sukkur City',
  ];

  const customAdminFields = adminConfig.fields.filter(
    (f) => f.id.startsWith('custom_') && f.enabled
  );

  const steps = [
    {
      id: 1,
      title: 'Personal & Scale',
      subtitle: 'Name, CNIC, BPS Grade',
      icon: User,
    },
    {
      id: 2,
      title: 'School & Station',
      subtitle: 'Region, District, SEMIS',
      icon: MapPin,
    },
    {
      id: 3,
      title: 'Timeline & Allowances',
      subtitle: 'Appointment, Period & Rates',
      icon: Calendar,
    },
    {
      id: 4,
      title: 'DDO & Accounts Office',
      subtitle: 'DDO Code, Cost Center',
      icon: Briefcase,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Form Top Bar & Progress */}
      <div className="bg-slate-50/80 rounded-t-2xl border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <span>Arrears Bill Information Form</span>
              <span className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Step {currentStep} of {steps.length}
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              All required fields must be completed before generating the official Sindh TR-22 / DAO Arrears Bill.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {allMissingFields.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  if (onValidationFailed) {
                    onValidationFailed(allMissingFields);
                  }
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
                title="View missing required fields"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{allMissingFields.length} Required Field{allMissingFields.length > 1 ? 's' : ''} Missing</span>
              </button>
            ) : (
              <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Required Fields Filled</span>
              </div>
            )}
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200/60">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-2 p-2 sm:p-2.5 rounded-xl border text-left transition ${
                  isActive
                    ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 ring-1 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 hover:bg-emerald-50'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold truncate leading-tight">
                    {step.title}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 truncate hidden xs:block">
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Body: Active Step Content */}
      <div className="p-6">
        
        {/* STEP 1: Personal & Position Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                Step 1: Employee Credentials &amp; Pay Scale
              </h3>
              <p className="text-xs text-slate-500">
                Official personal name, father&rsquo;s name, national CNIC, and designation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* 1. Name */}
              {isFieldEnabled('name') && (
                <div>
                  <label htmlFor="field-name" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('name', 'Name of Employee')}</span>
                    {isFieldRequired('name') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Official full employee name as recorded on CNIC, appointment order, and Service Book." />
                  </label>
                  <input
                    id="field-name"
                    type="text"
                    value={employee.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Muhammad Ali Ansari"
                    title="Enter full employee name matching appointment and CNIC"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-900"
                  />
                </div>
              )}

              {/* 2. Father Name */}
              {isFieldEnabled('fatherName') && (
                <div>
                  <label htmlFor="field-fatherName" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('fatherName', 'Father Name (S/o, D/o)')}</span>
                    {isFieldRequired('fatherName') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Father's or husband's name as registered in NADRA CNIC and departmental records." />
                  </label>
                  <input
                    id="field-fatherName"
                    type="text"
                    value={employee.fatherName}
                    onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                    placeholder="e.g. Ghulam Muhammad"
                    title="Enter father's name or husband's name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  />
                </div>
              )}

              {/* 3. Designation & Scale */}
              {isFieldEnabled('designation') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="field-designation" className="block font-semibold text-slate-700 mb-1 flex items-center">
                      <span>Designation</span>
                      <span className="text-rose-500 ml-0.5">*</span>
                      <FieldTooltip content="Official post/cadre title (e.g. PST, JEST, HST) matching your DAO sanction order." />
                    </label>
                    <select
                      id="field-designation"
                      value={employee.designation}
                      onChange={(e) => handleFieldChange('designation', e.target.value)}
                      title="Select official teaching or administrative designation"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-900"
                    >
                      <option value="PST">PST (Primary Teacher)</option>
                      <option value="JEST">JEST (Jr. Elementary)</option>
                      <option value="ECT">ECT (Early Childhood)</option>
                      <option value="HST">HST (High School)</option>
                      <option value="SLT">SLT (Sindhi Lang)</option>
                      <option value="OT">OT (Oriental)</option>
                      <option value="AT">AT (Arabic)</option>
                      <option value="PET">PET (Physical Ed)</option>
                      <option value="Junior Clerk">Junior Clerk</option>
                      <option value="Senior Clerk">Senior Clerk</option>
                      <option value="Head Master">Head Master</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="field-bps" className="block font-semibold text-slate-700 mb-1 flex items-center">
                      <span>BPS Scale</span>
                      <span className="text-rose-500 ml-0.5">*</span>
                      <FieldTooltip content="Basic Pay Scale (BPS-09 to 18). Auto-loads standard basic pay, statutory allowances, and GPF rate." />
                    </label>
                    <select
                      id="field-bps"
                      value={employee.bps}
                      onChange={(e) => handleFieldChange('bps', parseInt(e.target.value) || 14)}
                      title="Select Basic Pay Scale grade"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-indigo-700"
                    >
                      {adminConfig.payScales.map((p) => (
                        <option key={p.bps} value={p.bps}>
                          BPS-{String(p.bps).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 4. CNIC # */}
              {isFieldEnabled('cnic') && (
                <div>
                  <label htmlFor="field-cnic" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('cnic', 'CNIC # (13 Digits)')}</span>
                    {isFieldRequired('cnic') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="13-digit Computerized National Identity Card number with hyphens (e.g. 41302-1803974-3) required by DAO." />
                  </label>
                  <input
                    id="field-cnic"
                    type="text"
                    value={employee.cnic}
                    onChange={(e) => handleFieldChange('cnic', e.target.value)}
                    placeholder="e.g. 41302-1803974-3"
                    title="13-digit National ID card number with dashes"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono font-semibold text-slate-900"
                  />
                </div>
              )}

              {/* 5. Personnel ID */}
              {isFieldEnabled('personnelId') && (
                <div>
                  <label htmlFor="field-personnelId" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('personnelId', 'Personnel ID (P# / SAP)')}</span>
                    {isFieldRequired('personnelId') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Unique 8-digit government SAP / PIFMS Personnel Number from your official computerized monthly pay slip." />
                  </label>
                  <input
                    id="field-personnelId"
                    type="text"
                    value={employee.personnelId}
                    onChange={(e) => handleFieldChange('personnelId', e.target.value)}
                    placeholder="e.g. 10823456"
                    title="Official 8-digit SAP / PIFMS Personnel Number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono font-bold text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: School & Posting Location */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center">
                <MapPin className="w-4 h-4 mr-1.5" />
                Step 2: School &amp; District Station
              </h3>
              <p className="text-xs text-slate-500">
                Specify the education region, district, taluka, and school SEMIS census code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Region */}
              {isFieldEnabled('region') && (
                <div>
                  <label htmlFor="field-region" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('region', 'Select Region')}</span>
                    {isFieldRequired('region') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="School Education & Literacy Department administrative division (e.g. Hyderabad, Karachi, Sukkur)." />
                  </label>
                  <select
                    id="field-region"
                    value={employee.region}
                    onChange={(e) => handleFieldChange('region', e.target.value)}
                    title="Select administrative division/region"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    <option value="Hyderabad_Region">Hyderabad Region</option>
                    <option value="Karachi_Region">Karachi Region</option>
                    <option value="Sukkur_Region">Sukkur Region</option>
                    <option value="Larkana_Region">Larkana Region</option>
                    <option value="Mirpurkhas_Region">Mirpurkhas Region</option>
                    <option value="Shaheed_Benazirabad_Region">Shaheed Benazirabad Region</option>
                  </select>
                </div>
              )}

              {/* District */}
              {isFieldEnabled('district') && (
                <div>
                  <label htmlFor="field-district" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('district', 'Select District')}</span>
                    {isFieldRequired('district') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="District of posting where the relevant District Accounts Office (DAO) processes claims." />
                  </label>
                  <select
                    id="field-district"
                    value={employee.district}
                    onChange={(e) => handleFieldChange('district', e.target.value)}
                    title="Select district where your school is posted"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Taluka */}
              {isFieldEnabled('taluka') && (
                <div>
                  <label htmlFor="field-taluka" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('taluka', 'Select Taluka / Tehsil')}</span>
                    {isFieldRequired('taluka') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Sub-district / Taluka jurisdiction where your school or educational unit is physically situated." />
                  </label>
                  <select
                    id="field-taluka"
                    value={employee.taluka}
                    onChange={(e) => handleFieldChange('taluka', e.target.value)}
                    title="Select Taluka / Tehsil"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    {currentTalukas.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* School Name */}
              {isFieldEnabled('schoolName') && (
                <div className="md:col-span-2">
                  <label htmlFor="field-schoolName" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('schoolName', 'School / Institute Name')}</span>
                    {isFieldRequired('schoolName') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Full institutional title of your posting (e.g. Govt. Boys Primary School Qasimabad, Hyderabad)." />
                  </label>
                  <input
                    id="field-schoolName"
                    type="text"
                    value={employee.schoolName}
                    onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                    placeholder="e.g. Govt. Boys Primary School Qasimabad Hyderabad"
                    title="Full official name of Government school or office"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  />
                </div>
              )}

              {/* SEMIS Code */}
              {isFieldEnabled('semisCode') && (
                <div>
                  <label htmlFor="field-semisCode" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('semisCode', 'SEMIS Census Code')}</span>
                    {isFieldRequired('semisCode') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Unique 9-digit Sindh Education Management Information System (SEMIS) code of the institution." />
                  </label>
                  <input
                    id="field-semisCode"
                    type="text"
                    value={employee.semisCode}
                    onChange={(e) => handleFieldChange('semisCode', e.target.value)}
                    placeholder="e.g. 403020123"
                    title="9-digit SEMIS institutional census code"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Timeline & Allowances */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                Step 3: Arrear Timeline Period &amp; Allowances
              </h3>
              <p className="text-xs text-slate-500">
                Define the claim start/end dates, annual increments, and allowance categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Date of Appointment */}
              {isFieldEnabled('appointmentDate') && (
                <div>
                  <label htmlFor="field-appointmentDate" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('appointmentDate', 'Date of Joining / Appointment')}</span>
                    <span className="text-rose-500 ml-0.5">*</span>
                    <FieldTooltip content="The exact date of joining duty or the start date of the pending arrear claim period." />
                  </label>
                  <input
                    id="field-appointmentDate"
                    type="date"
                    value={employee.appointmentDate}
                    onChange={(e) => handleFieldChange('appointmentDate', e.target.value)}
                    title="Joining date or starting month of arrear claim"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  />
                </div>
              )}

              {/* Arrear Required Upto */}
              {isFieldEnabled('arrearUptoDate') && (
                <div>
                  <label htmlFor="field-arrearUptoDate" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('arrearUptoDate', 'Arrear Required Upto (End Date)')}</span>
                    <span className="text-rose-500 ml-0.5">*</span>
                    <FieldTooltip content="Final month/date of the claim period. All months between appointment and this date are calculated." />
                  </label>
                  <input
                    id="field-arrearUptoDate"
                    type="date"
                    value={employee.arrearUptoDate}
                    onChange={(e) => handleFieldChange('arrearUptoDate', e.target.value)}
                    title="End date of the arrears claim period"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  />
                </div>
              )}

              {/* Add Increment */}
              {isFieldEnabled('isIncrementAdded') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('isIncrementAdded', 'Add Increment?')}</span>
                    <FieldTooltip content="Adds the annual increment on Dec 1st each year if appointed on or before 1st June per Sindh Civil Service Rules." />
                  </label>
                  <select
                    value={employee.isIncrementAdded ? 'Yes' : 'No'}
                    onChange={(e) => handleFieldChange('isIncrementAdded', e.target.value === 'Yes')}
                    title="Select whether annual increments on Dec 1st apply"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    <option value="Yes">Yes (Add Annual Increment)</option>
                    <option value="No">No (Initial Basic Pay Only)</option>
                  </select>
                </div>
              )}

              {/* Disability */}
              {isFieldEnabled('isDisability') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('isDisability', 'Disability')}</span>
                    <FieldTooltip content="Special Conveyance Allowance for differently-abled employees per Sindh Finance Dept notifications." />
                  </label>
                  <select
                    value={employee.isDisability ? 'Yes' : 'No'}
                    onChange={(e) => handleFieldChange('isDisability', e.target.value === 'Yes')}
                    title="Disability Special Conveyance Allowance"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Special Conveyance Allowance)</option>
                  </select>
                </div>
              )}

              {/* House Rent */}
              {isFieldEnabled('houseRentType') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('houseRentType', 'House Rent (Urban/Rural)')}</span>
                    <FieldTooltip content="45% for notified Urban big cities, or 30% for Rural/other stations." />
                  </label>
                  <select
                    value={employee.houseRentType}
                    onChange={(e) =>
                      handleFieldChange('houseRentType', e.target.value as 'Urban' | 'Rural')
                    }
                    title="Select Urban or Rural House Rent Allowance rate"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>
              )}

              {/* Teaching / B.Ed Allowance */}
              {isFieldEnabled('isTeachingAllowance') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('isTeachingAllowance', 'Teaching / B.Ed Allowance')}</span>
                    <FieldTooltip content="Govt of Sindh sanctioned B.Ed / Teaching qualification allowance of Rs. 1,000/month for PSTs/JESTs." />
                  </label>
                  <select
                    value={employee.isTeachingAllowance ? 'Yes' : 'No'}
                    onChange={(e) =>
                      handleFieldChange('isTeachingAllowance', e.target.value === 'Yes')
                    }
                    title="Teaching / B.Ed allowance (Rs. 1,000/month)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Rs. 1,000 / month)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Advanced Monthly Rates & Deductions Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvancedRates(!showAdvancedRates)}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 flex items-center transition"
              >
                <Sliders className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                {showAdvancedRates
                  ? 'Hide Scale Rates & Deductions'
                  : `Inspect & Customize Monthly Rates for BPS-${employee.bps}`}
                {showAdvancedRates ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-1.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                )}
              </button>

              {showAdvancedRates && (
                <div className="mt-3 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      BPS-{employee.bps} Monthly Allowance Rates &amp; Statutory Deductions (PKR)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Basic Pay</span>
                        <FieldTooltip content="Monthly base basic pay under Sindh Revised Pay Scales." />
                      </label>
                      <input
                        type="number"
                        value={employee.basicPayRate}
                        onChange={(e) =>
                          handleFieldChange('basicPayRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly base pay"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono font-bold text-slate-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>House Rent</span>
                        <FieldTooltip content="Monthly House Rent Allowance rate applicable for this scale." />
                      </label>
                      <input
                        type="number"
                        value={employee.houseRentRateUrban}
                        onChange={(e) =>
                          handleFieldChange('houseRentRateUrban', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly House Rent Allowance"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Conveyance</span>
                        <FieldTooltip content="Fixed monthly conveyance allowance sanctioned for this BPS grade." />
                      </label>
                      <input
                        type="number"
                        value={employee.conveyanceRate}
                        onChange={(e) =>
                          handleFieldChange('conveyanceRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly Conveyance Allowance"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Medical Allow.</span>
                        <FieldTooltip content="Statutory monthly medical allowance (Rs. 1,375 for BPS 01–15, Rs. 2,000 for BPS 16+)." />
                      </label>
                      <input
                        type="number"
                        value={employee.medicalAllowanceRate}
                        onChange={(e) =>
                          handleFieldChange('medicalAllowanceRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly Medical Allowance"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>B.Ed Allowance</span>
                        <FieldTooltip content="B.Ed / Teaching qualification allowance rate (Standard Rs. 1,000/month for PSTs/JESTs)." />
                      </label>
                      <input
                        type="number"
                        placeholder="1000"
                        value={employee.teachingAllowanceRate || 1000}
                        onChange={(e) =>
                          handleFieldChange('teachingAllowanceRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly B.Ed / Teaching Allowance (Rs. 1,000)"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>GPF (Monthly)</span>
                        <FieldTooltip content="General Provident Fund monthly subscription deducted per official Sindh Finance slabs." />
                      </label>
                      <input
                        type="number"
                        value={employee.gpfRate}
                        onChange={(e) =>
                          handleFieldChange('gpfRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly GPF Deduction"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono font-bold text-amber-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>BF (Benevolent)</span>
                        <FieldTooltip content="Provincial Benevolent Fund monthly deduction deducted from payroll." />
                      </label>
                      <input
                        type="number"
                        value={employee.bfRate}
                        onChange={(e) =>
                          handleFieldChange('bfRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly Benevolent Fund deduction"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>GI (Group Ins.)</span>
                        <FieldTooltip content="Group Insurance premium deducted monthly by District Accounts Office." />
                      </label>
                      <input
                        type="number"
                        value={employee.giRate}
                        onChange={(e) =>
                          handleFieldChange('giRate', parseFloat(e.target.value) || 0)
                        }
                        title="Monthly Group Insurance premium"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Adhoc 2022 (15%)</span>
                        <FieldTooltip content="Adhoc Relief Allowance 2022 calculated at 15% of basic pay." />
                      </label>
                      <input
                        type="number"
                        value={employee.adhoc2022Rate}
                        onChange={(e) =>
                          handleFieldChange('adhoc2022Rate', parseFloat(e.target.value) || 0)
                        }
                        title="Adhoc Relief Allowance 2022 (15%)"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Adhoc 2023 (35%)</span>
                        <FieldTooltip content="Adhoc Relief Allowance 2023 calculated at 35% of basic pay." />
                      </label>
                      <input
                        type="number"
                        value={employee.adhoc2023Rate}
                        onChange={(e) =>
                          handleFieldChange('adhoc2023Rate', parseFloat(e.target.value) || 0)
                        }
                        title="Adhoc Relief Allowance 2023 (35%)"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Adhoc 2024 (25%)</span>
                        <FieldTooltip content="Adhoc Relief Allowance 2024 calculated at 25% of basic pay." />
                      </label>
                      <input
                        type="number"
                        value={employee.adhoc2024Rate}
                        onChange={(e) =>
                          handleFieldChange('adhoc2024Rate', parseFloat(e.target.value) || 0)
                        }
                        title="Adhoc Relief Allowance 2024 (25%)"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Adhoc 2025 (12%)</span>
                        <FieldTooltip content="Notified Adhoc Relief Allowance 2025 rate for Sindh civil servants." />
                      </label>
                      <input
                        type="number"
                        value={employee.adhoc2025Rate}
                        onChange={(e) =>
                          handleFieldChange('adhoc2025Rate', parseFloat(e.target.value) || 0)
                        }
                        title="Adhoc Relief Allowance 2025"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-0.5 flex items-center">
                        <span>Adhoc 2026 (7%)</span>
                        <FieldTooltip content="Projected or notified Adhoc Relief Allowance 2026 rate." />
                      </label>
                      <input
                        type="number"
                        value={employee.adhoc2026Rate}
                        onChange={(e) =>
                          handleFieldChange('adhoc2026Rate', parseFloat(e.target.value) || 0)
                        }
                        title="Adhoc Relief Allowance 2026"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: DDO & Accounts Office */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5" />
                Step 4: Drawing &amp; Disbursing Officer (DDO) &amp; Accounts Formats
              </h3>
              <p className="text-xs text-slate-500">
                Official signature authority lines, DDO codes, and DAO cost centers for billing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* DDO First Line */}
              {isFieldEnabled('ddoFirstLine') && (
                <div>
                  <label htmlFor="field-ddoFirstLine" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('ddoFirstLine', 'Select DDO (First Line)')}</span>
                    {isFieldRequired('ddoFirstLine') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Official designation of the Drawing & Disbursing Officer (e.g. Taluka Education Officer Male/Female, DEO)." />
                  </label>
                  <input
                    id="field-ddoFirstLine"
                    type="text"
                    value={employee.ddoFirstLine}
                    onChange={(e) => handleFieldChange('ddoFirstLine', e.target.value)}
                    placeholder="e.g. Taluka Education Officer (Male)"
                    title="DDO designation (e.g. Taluka Education Officer)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  />
                </div>
              )}

              {/* DDO Second Line */}
              {isFieldEnabled('ddoSecondLine') && (
                <div>
                  <label htmlFor="field-ddoSecondLine" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>{getFieldLabel('ddoSecondLine', 'DDO (2nd / 3rd Line)')}</span>
                    {isFieldRequired('ddoSecondLine') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Departmental sub-office or division title (e.g. Primary, Elementary, Secondary & Higher Secondary Education)." />
                  </label>
                  <input
                    id="field-ddoSecondLine"
                    type="text"
                    value={employee.ddoSecondLine}
                    onChange={(e) => handleFieldChange('ddoSecondLine', e.target.value)}
                    placeholder="e.g. Elementary, Secondary & Higher Secondary"
                    title="Departmental wing or branch"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  />
                </div>
              )}

              {/* DDO Code */}
              {isFieldEnabled('ddoCode') && (
                <div>
                  <label htmlFor="field-ddoCode" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>DDO Code</span>
                    {isFieldRequired('ddoCode') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Official treasury DDO alphanumeric code (e.g. HB-0123) registered with the District Accounts Office." />
                  </label>
                  <input
                    id="field-ddoCode"
                    type="text"
                    value={employee.ddoCode}
                    onChange={(e) => handleFieldChange('ddoCode', e.target.value)}
                    placeholder="e.g. HB-0123"
                    title="Treasury DDO code registered with DAO"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono font-bold text-slate-900"
                  />
                </div>
              )}

              {/* Cost Center */}
              {isFieldEnabled('costCenter') && (
                <div>
                  <label htmlFor="field-costCenter" className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span>Cost Center</span>
                    {isFieldRequired('costCenter') && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="SAP / PIFMS Cost Center alphanumeric code (e.g. GA-III, HB0123) under Major Head 01201." />
                  </label>
                  <input
                    id="field-costCenter"
                    type="text"
                    value={employee.costCenter}
                    onChange={(e) => handleFieldChange('costCenter', e.target.value)}
                    placeholder="e.g. GA-III"
                    title="SAP / PIFMS Cost Center code"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-slate-900"
                  />
                </div>
              )}

              {/* Render Custom Fields dynamically added by Admin */}
              {customAdminFields.map((cf) => (
                <div key={cf.id}>
                  <label htmlFor={`field-custom-${cf.key}`} className="block font-semibold text-slate-700 mb-1 flex items-center">
                    <span className="text-emerald-600 font-bold mr-1">&bull;</span>
                    <span>{cf.label}</span>
                    {cf.required && <span className="text-rose-500 ml-0.5">*</span>}
                    <FieldTooltip content="Custom departmental parameter configured by district administrators." />
                  </label>
                  {cf.type === 'boolean' ? (
                    <select
                      id={`field-custom-${cf.key}`}
                      value={employee.customFieldValues?.[cf.key] ? 'Yes' : 'No'}
                      onChange={(e) =>
                        handleCustomFieldChange(cf.key, e.target.value === 'Yes')
                      }
                      title={cf.label}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  ) : cf.type === 'date' ? (
                    <input
                      id={`field-custom-${cf.key}`}
                      type="date"
                      value={employee.customFieldValues?.[cf.key] || ''}
                      onChange={(e) => handleCustomFieldChange(cf.key, e.target.value)}
                      title={cf.label}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    />
                  ) : cf.type === 'number' ? (
                    <input
                      id={`field-custom-${cf.key}`}
                      type="number"
                      value={employee.customFieldValues?.[cf.key] || ''}
                      onChange={(e) =>
                        handleCustomFieldChange(cf.key, parseFloat(e.target.value) || 0)
                      }
                      placeholder={cf.placeholder || ''}
                      title={cf.label}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    />
                  ) : (
                    <input
                      id={`field-custom-${cf.key}`}
                      type="text"
                      value={employee.customFieldValues?.[cf.key] || ''}
                      onChange={(e) => handleCustomFieldChange(cf.key, e.target.value)}
                      placeholder={cf.placeholder || ''}
                      title={cf.label}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 4 Review Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900">Ready to print or inspect bill documents?</span>
                <p className="text-slate-500 text-[11px]">
                  All claim fields are synchronized. You can preview the official 6-page bill bundle or examine the month-by-month table.
                </p>
              </div>
              {onNavigateTab && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const missing = getMissingFields(employee, adminConfig);
                      if (missing.length > 0) {
                        if (onValidationFailed) onValidationFailed(missing);
                        return;
                      }
                      onNavigateTab('schedule');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 rounded-xl font-semibold transition shadow-sm"
                  >
                    View Monthly Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const missing = getMissingFields(employee, adminConfig);
                      if (missing.length > 0) {
                        if (onValidationFailed) onValidationFailed(missing);
                        return;
                      }
                      onNavigateTab('documents');
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition shadow-sm"
                  >
                    View 6-Page Bill
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Step Navigation Bottom Bar */}
      <div className="bg-slate-50 rounded-b-2xl border-t border-slate-200 px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Previous Step</span>
          <span className="sm:hidden font-bold">Prev</span>
        </button>

        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === step.id
                  ? 'w-4 sm:w-6 bg-indigo-600'
                  : currentStep > step.id
                  ? 'w-2 sm:w-2.5 bg-emerald-500'
                  : 'w-2 sm:w-2.5 bg-slate-300'
              }`}
            />
          ))}
        </div>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={() => {
              const missingInStep = getMissingFieldsForStep(employee, adminConfig, currentStep);
              if (missingInStep.length > 0) {
                if (onValidationFailed) {
                  onValidationFailed(missingInStep, currentStep);
                }
                return;
              }
              setCurrentStep((prev) => Math.min(steps.length, prev + 1));
            }}
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center transition shadow-sm shrink-0"
          >
            <span className="hidden sm:inline">Next: {steps[currentStep].title}</span>
            <span className="sm:hidden">Next Step</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 sm:ml-1.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const missing = getMissingFields(employee, adminConfig);
              if (missing.length > 0) {
                if (onValidationFailed) {
                  onValidationFailed(missing);
                }
                return;
              }
              if (onNavigateTab) onNavigateTab('documents');
            }}
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center transition shadow-sm shrink-0"
          >
            <FileCheck className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Generate Official Bill</span>
            <span className="sm:hidden">View Bill</span>
          </button>
        )}
      </div>
    </div>
  );
};
