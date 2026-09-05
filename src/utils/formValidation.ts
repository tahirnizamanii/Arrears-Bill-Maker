import { EmployeeData, AdminConfig } from '../types';

export interface MissingFieldItem {
  key: string;
  label: string;
  step: number;
  stepTitle: string;
  fieldId: string;
  hint: string;
}

export function getMissingFields(
  employee: EmployeeData,
  adminConfig: AdminConfig
): MissingFieldItem[] {
  const missing: MissingFieldItem[] = [];

  const isEnabled = (key: string) => {
    const f = adminConfig?.fields?.find((field) => field.key === key);
    return f ? f.enabled : true;
  };

  const getLabel = (key: string, fallback: string) => {
    const f = adminConfig?.fields?.find((field) => field.key === key);
    return f?.label || fallback;
  };

  // STEP 1: Personal & Scale
  if (isEnabled('name') && (!employee.name || !employee.name.trim())) {
    missing.push({
      key: 'name',
      label: getLabel('name', 'Name of Employee'),
      step: 1,
      stepTitle: 'Step 1: Personal & Scale',
      fieldId: 'field-name',
      hint: 'Enter the official full employee name matching CNIC and Appointment Order',
    });
  }

  if (isEnabled('fatherName') && (!employee.fatherName || !employee.fatherName.trim())) {
    missing.push({
      key: 'fatherName',
      label: getLabel('fatherName', "Father's / Husband's Name"),
      step: 1,
      stepTitle: 'Step 1: Personal & Scale',
      fieldId: 'field-fatherName',
      hint: "Enter father's or husband's name as registered in NADRA records",
    });
  }

  if (isEnabled('designation') && (!employee.designation || !employee.designation.trim())) {
    missing.push({
      key: 'designation',
      label: getLabel('designation', 'Designation / Cadre'),
      step: 1,
      stepTitle: 'Step 1: Personal & Scale',
      fieldId: 'field-designation',
      hint: 'Select the teaching or administrative post (e.g. PST, JEST, HST)',
    });
  }

  if (isEnabled('bps') && (!employee.bps || Number(employee.bps) <= 0)) {
    missing.push({
      key: 'bps',
      label: getLabel('bps', 'BPS Scale Grade'),
      step: 1,
      stepTitle: 'Step 1: Personal & Scale',
      fieldId: 'field-bps',
      hint: 'Select the basic pay scale grade (e.g. BPS-14 for standard PST/JEST)',
    });
  }

  if (isEnabled('cnic') && (!employee.cnic || !employee.cnic.trim())) {
    missing.push({
      key: 'cnic',
      label: getLabel('cnic', 'CNIC Number'),
      step: 1,
      stepTitle: 'Step 1: Personal & Scale',
      fieldId: 'field-cnic',
      hint: 'Enter the 13-digit Computerized National ID Card (e.g. 41302-1803974-3)',
    });
  }

  if (isEnabled('personnelId') && (!employee.personnelId || !employee.personnelId.trim())) {
    missing.push({
      key: 'personnelId',
      label: getLabel('personnelId', 'Personnel ID (P# / SAP No)'),
      step: 1,
      stepTitle: 'Step 1: Personal & Scale',
      fieldId: 'field-personnelId',
      hint: 'Enter the 8-digit Sindh AG SAP Personnel number (e.g. 10823456)',
    });
  }

  // STEP 2: Posting & Institute Details
  if (isEnabled('region') && (!employee.region || !employee.region.trim())) {
    missing.push({
      key: 'region',
      label: getLabel('region', 'Region of Posting'),
      step: 2,
      stepTitle: 'Step 2: Posting & Institute',
      fieldId: 'field-region',
      hint: 'Select the administrative education region (e.g. Hyderabad, Karachi, Sukkur)',
    });
  }

  if (isEnabled('district') && (!employee.district || !employee.district.trim())) {
    missing.push({
      key: 'district',
      label: getLabel('district', 'District'),
      step: 2,
      stepTitle: 'Step 2: Posting & Institute',
      fieldId: 'field-district',
      hint: 'Select the official posting district',
    });
  }

  if (isEnabled('taluka') && (!employee.taluka || !employee.taluka.trim())) {
    missing.push({
      key: 'taluka',
      label: getLabel('taluka', 'Taluka / Tehsil'),
      step: 2,
      stepTitle: 'Step 2: Posting & Institute',
      fieldId: 'field-taluka',
      hint: 'Select the posting taluka or sub-district',
    });
  }

  if (isEnabled('schoolName') && (!employee.schoolName || !employee.schoolName.trim())) {
    missing.push({
      key: 'schoolName',
      label: getLabel('schoolName', 'School / Institute Name'),
      step: 2,
      stepTitle: 'Step 2: Posting & Institute',
      fieldId: 'field-schoolName',
      hint: 'Enter full official name of your Government school or office',
    });
  }

  if (isEnabled('semisCode') && (!employee.semisCode || !employee.semisCode.trim())) {
    missing.push({
      key: 'semisCode',
      label: getLabel('semisCode', 'SEMIS Census Code'),
      step: 2,
      stepTitle: 'Step 2: Posting & Institute',
      fieldId: 'field-semisCode',
      hint: 'Enter the unique 9-digit SEMIS institutional census code',
    });
  }

  // STEP 3: Arrear Timeline Period & Allowances
  if (isEnabled('appointmentDate') && (!employee.appointmentDate || !employee.appointmentDate.trim())) {
    missing.push({
      key: 'appointmentDate',
      label: getLabel('appointmentDate', 'Date of Joining / Appointment'),
      step: 3,
      stepTitle: 'Step 3: Timeline & Allowances',
      fieldId: 'field-appointmentDate',
      hint: 'Specify the start date of the pending arrear claim period',
    });
  }

  if (isEnabled('arrearUptoDate') && (!employee.arrearUptoDate || !employee.arrearUptoDate.trim())) {
    missing.push({
      key: 'arrearUptoDate',
      label: getLabel('arrearUptoDate', 'Arrear Required Upto (End Date)'),
      step: 3,
      stepTitle: 'Step 3: Timeline & Allowances',
      fieldId: 'field-arrearUptoDate',
      hint: 'Specify the final end date for the arrear calculation',
    });
  }

  // STEP 4: DDO & Treasury Codes
  if (isEnabled('ddoFirstLine') && (!employee.ddoFirstLine || !employee.ddoFirstLine.trim())) {
    missing.push({
      key: 'ddoFirstLine',
      label: getLabel('ddoFirstLine', 'DDO Office Title (Line 1)'),
      step: 4,
      stepTitle: 'Step 4: DDO & Treasury Codes',
      fieldId: 'field-ddoFirstLine',
      hint: 'Enter drawing & disbursing officer title (e.g. Taluka Education Officer)',
    });
  }

  if (isEnabled('ddoSecondLine') && (!employee.ddoSecondLine || !employee.ddoSecondLine.trim())) {
    missing.push({
      key: 'ddoSecondLine',
      label: getLabel('ddoSecondLine', 'DDO Office Jurisdiction (Line 2)'),
      step: 4,
      stepTitle: 'Step 4: DDO & Treasury Codes',
      fieldId: 'field-ddoSecondLine',
      hint: 'Enter departmental wing (e.g. Elementary, Secondary & Higher Secondary)',
    });
  }

  if (isEnabled('ddoCode') && (!employee.ddoCode || !employee.ddoCode.trim())) {
    missing.push({
      key: 'ddoCode',
      label: getLabel('ddoCode', 'DDO Code'),
      step: 4,
      stepTitle: 'Step 4: DDO & Treasury Codes',
      fieldId: 'field-ddoCode',
      hint: 'Enter the DAO registered Treasury DDO Code (e.g. HB-0123)',
    });
  }

  if (isEnabled('costCenter') && (!employee.costCenter || !employee.costCenter.trim())) {
    missing.push({
      key: 'costCenter',
      label: getLabel('costCenter', 'Cost Center / Section'),
      step: 4,
      stepTitle: 'Step 4: DDO & Treasury Codes',
      fieldId: 'field-costCenter',
      hint: 'Enter the SAP / PIFMS Cost Center identifier (e.g. GA-III)',
    });
  }

  // Check any custom fields that are required
  if (adminConfig?.fields) {
    adminConfig.fields
      .filter((f) => f.id.startsWith('custom_') && f.enabled && f.required)
      .forEach((cf) => {
        const val = employee.customFieldValues?.[cf.key];
        if (val === undefined || val === null || val === '') {
          missing.push({
            key: cf.key,
            label: cf.label,
            step: 4,
            stepTitle: 'Step 4: DDO & Treasury Codes',
            fieldId: `field-custom-${cf.key}`,
            hint: cf.helpText || 'Please complete this custom administrative field',
          });
        }
      });
  }

  return missing;
}

export function getMissingFieldsForStep(
  employee: EmployeeData,
  adminConfig: AdminConfig,
  step: number
): MissingFieldItem[] {
  return getMissingFields(employee, adminConfig).filter((m) => m.step === step);
}

export function focusAndHighlightField(fieldId: string) {
  // Give DOM a tick to render in case step or tab just changed
  setTimeout(() => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();

      // Apply prominent animated pulse ring
      el.classList.add('ring-4', 'ring-amber-500', 'border-amber-500', 'bg-amber-50');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-amber-500', 'border-amber-500', 'bg-amber-50');
      }, 3500);
    }
  }, 180);
}
