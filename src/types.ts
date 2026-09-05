export interface FormFieldConfig {
  id: string;
  key: string;
  label: string;
  category: 'personal' | 'posting' | 'period' | 'rates' | 'ddo';
  placeholder?: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: { label: string; value: any }[];
  enabled: boolean;
  required: boolean;
  order: number;
  helpText?: string;
}

export interface PayScaleGrade {
  bps: number;
  name: string; // e.g. "BPS-14"
  initialBasicPay: number;
  annualIncrement: number;
  maximumBasicPay: number;
  houseRentUrban: number;
  houseRentRural: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  gpfRate: number;
  bfRate: number;
  giRate: number;
}

export interface AdhocReliefRule {
  id: string;
  year: number;
  name: string; // e.g. "Adhoc Relief 2024 (25%)"
  shortCode: string; // e.g. "adhoc2024"
  percentage: number; // e.g. 25
  calculationBase: 'runningBasic' | 'initialBasic2022' | 'fixed';
  effectiveFrom: string; // YYYY-MM e.g. "2024-07"
  fixedMonthlyAmount?: number;
  enabled: boolean;
  notes?: string;
}

export interface CustomAllowance {
  id: string;
  name: string;
  code: string;
  type: 'fixed' | 'percent_basic';
  value: number; // amount in PKR or percent (e.g. 10)
  enabled: boolean;
  isTaxable: boolean;
}

export interface CustomDeduction {
  id: string;
  name: string;
  code: string;
  type: 'fixed' | 'percent_basic';
  value: number;
  enabled: boolean;
}

export interface AdminConfig {
  adminPasswordHash: string; // default stored hash or string for admin
  portalTitle: string;
  portalSubtitle: string;
  footerNotice: string;
  defaultAppointmentDate: string;
  defaultArrearUptoDate: string;
  fields: FormFieldConfig[];
  payScales: PayScaleGrade[];
  adhocRules: AdhocReliefRule[];
  customAllowances: CustomAllowance[];
  customDeductions: CustomDeduction[];
  regionsDistricts: Record<string, string[]>;
  talukas: Record<string, string[]>;
  ddoMasters: {
    code: string;
    firstLine: string;
    secondLine: string;
    costCenter: string;
    district: string;
  }[];
}

export interface EmployeeData {
  name: string;
  fatherName: string;
  designation: string;
  bps: number; // e.g. 14
  cnic: string;
  personnelId: string;
  region: string;
  district: string;
  taluka: string;
  schoolName: string;
  semisCode: string;
  ddoFirstLine: string;
  ddoSecondLine: string;
  ddoCode: string;
  costCenter: string;
  appointmentDate: string; // YYYY-MM-DD
  arrearUptoDate: string; // YYYY-MM-DD
  isIncrementAdded: boolean;
  incrementAmount: number; // e.g. 1740 for BPS-14
  incrementMonth: number; // usually 12 (December)
  incrementTiming?: 'december' | 'july' | 'both' | 'custom';
  isJulyBudgetAutoUpdated?: boolean; // auto-activate newly announced budget adhoc reliefs & revisions every July
  julyBudgetIncrementAmount?: number; // annual budget pay increase in July (e.g. scale revision increment or budget raise)
  autoCalculateAdhocFromBasic?: boolean; // dynamically recalculate 35%, 25%, 12%, 7% on running basic pay
  isDisability: boolean;
  specialConveyanceRate: number; // e.g. 2000
  houseRentType: 'Urban' | 'Rural';
  houseRentRateUrban: number; // e.g. 3321
  houseRentRateRural: number; // e.g. 2253
  isTeachingAllowance: boolean;
  teachingAllowanceRate: number; // e.g. 1000 (B.Ed / Teaching Allowance)
  basicPayRate: number; // e.g. 22530
  conveyanceRate: number; // e.g. 2856
  medicalAllowanceRate: number; // e.g. 1375
  // Adhoc Reliefs baseline monthly rates (for full month)
  adhoc2017Rate: number;
  adhoc2018Rate: number;
  adhoc2019Rate: number;
  adhoc2020Rate: number;
  adhoc2021Rate: number;
  adhoc2022Rate: number; // 15% -> 2277
  adhoc2023Rate: number; // 35% -> 7885
  adhoc2024Rate: number; // 25% -> 5632
  adhoc2025Rate: number; // 12% -> 2703 (from July 2025)
  adhoc2026Rate: number; // 7% -> e.g. 1577
  diffAllowance2022Rate: number; // 34.35% -> 5237
  diffAllowance2026Rate: number; // 2% -> 450
  // Monthly Deductions
  gpfRate: number; // 3900
  bfRate: number; // 338
  giRate: number; // 464
  // Custom Dynamic Fields Key-Value Store
  customFieldValues?: Record<string, any>;
  // Custom manual overrides per month (key = 'YYYY-MM')
  manualOverrides?: Record<string, Partial<MonthlyBreakdown>>;
}

export interface MonthlyBreakdown {
  id: string;
  index: number;
  yearMonth: string; // e.g. '2025-06'
  monthLabel: string; // e.g. 'Jun 25'
  daysInMonth: number;
  daysClaimed: number;
  isPartial: boolean;
  basicPay: number;
  houseRent: number;
  conveyance: number;
  specialConveyance: number;
  teachingAllowance: number;
  medicalAllowance: number;
  adhoc2017: number;
  adhoc2018: number;
  adhoc2019: number;
  adhoc2020: number;
  adhoc2021: number;
  adhoc2022: number;
  adhoc2023: number;
  adhoc2024: number;
  adhoc2025: number;
  adhoc2026: number;
  diffAllowance2022: number;
  diffAllowance2026: number;
  customAllowancesSum?: number;
  customDeductionsSum?: number;
  totalGross: number;
  gpf: number;
  benevolentFund: number;
  groupInsurance: number;
  totalDeduction: number;
  netPayable: number;
  isModified?: boolean;
  unproratedBasicPay?: number;
  appliedEvents?: string[];
}

export interface ArrearsSummary {
  totalLengthText: string;
  totalMonths: number;
  totalDays: number;
  grossAmount: number;
  totalDeductions: number;
  netPayableAmount: number;
  amountInWords: string;
  // Totals breakdown
  totalBasicPay: number;
  totalHouseRent: number;
  totalConveyance: number;
  totalSpecialConveyance: number;
  totalTeachingAllowance: number;
  totalMedicalAllowance: number;
  totalAdhoc2017: number;
  totalAdhoc2018: number;
  totalAdhoc2019: number;
  totalAdhoc2020: number;
  totalAdhoc2021: number;
  totalAdhoc2022: number;
  totalAdhoc2023: number;
  totalAdhoc2024: number;
  totalAdhoc2025: number;
  totalAdhoc2026: number;
  totalDiffAllowance2022: number;
  totalDiffAllowance2026: number;
  totalRegularAllowances: number;
  totalOtherAllowances: number;
  totalCustomAllowances?: number;
  totalCustomDeductions?: number;
  totalGPF: number;
  totalBF: number;
  totalGI: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  required: boolean;
  notes?: string;
}

export interface TeacherFeedback {
  id: string;
  name: string;
  designation: string;
  schoolAndDistrict: string;
  rating: number; // 1 to 5
  comments: string;
  tag: string; // e.g. "PST Arrears", "JEST Arrears", "TR-22 Bill"
  published: boolean; // true = publish publicly on community wall, false = private feedback
  createdAt: string;
}

export interface ToolItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  iconName: string;
  badge: string;
  category: 'Salary & Arrears' | 'Provident Fund' | 'Taxation' | 'Retirement';
}
