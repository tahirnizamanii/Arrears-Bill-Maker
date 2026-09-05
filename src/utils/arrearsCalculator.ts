import { EmployeeData, MonthlyBreakdown, ArrearsSummary, AdminConfig } from '../types';
import { numberToPakistaniRupeesWords } from './numberToWords';
import { DEFAULT_ADMIN_CONFIG } from './adminConfigDefaults';

export const DEFAULT_EMPLOYEE_DATA: EmployeeData = {
  name: 'QURAT UL AIN',
  fatherName: 'ABDUL GHANI',
  designation: 'PST',
  bps: 14,
  cnic: '41303-3962474-6',
  personnelId: '',
  region: 'Hyderabad_Region',
  district: 'Hyderabad',
  taluka: 'Hyderabad Rural',
  schoolName: 'GGHS APA SHAMS ABBASI SOCIETY HYD',
  semisCode: '403010306',
  ddoFirstLine: 'Taluka Education Officer',
  ddoSecondLine: 'Male Primary Hyderabad Rural',
  ddoCode: 'HB0379',
  costCenter: 'HB0379',
  appointmentDate: '2025-06-24',
  arrearUptoDate: '2026-07-31',
  isIncrementAdded: true,
  incrementAmount: 1740,
  incrementMonth: 12,
  incrementTiming: 'december',
  isJulyBudgetAutoUpdated: true,
  julyBudgetIncrementAmount: 0,
  autoCalculateAdhocFromBasic: true,
  isDisability: false,
  specialConveyanceRate: 2000,
  houseRentType: 'Urban',
  houseRentRateUrban: 3321,
  houseRentRateRural: 2253,
  isTeachingAllowance: false,
  teachingAllowanceRate: 1000,
  basicPayRate: 22530,
  conveyanceRate: 2856,
  medicalAllowanceRate: 1375,
  adhoc2017Rate: 0,
  adhoc2018Rate: 0,
  adhoc2019Rate: 0,
  adhoc2020Rate: 0,
  adhoc2021Rate: 0,
  adhoc2022Rate: 2277,
  adhoc2023Rate: 7885,
  adhoc2024Rate: 5632,
  adhoc2025Rate: 2703,
  adhoc2026Rate: 1894,
  diffAllowance2022Rate: 5237,
  diffAllowance2026Rate: 450,
  gpfRate: 3900,
  bfRate: 338,
  giRate: 464,
  customFieldValues: {},
  manualOverrides: {}
};

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Calculates human readable duration between two dates
 * e.g., "1 Years, 2 Months, 2 Days."
 */
export function calculateLengthOfArrears(startDateStr: string, endDateStr: string): string {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return '0 Years, 0 Months, 0 Days.';
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate() + 1; // inclusive of start day

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} Years, ${months} Months, ${days} Days.`;
}

/**
 * Calculates monthly schedule and total bill respecting Admin configuration
 */
export function calculateArrears(
  data: EmployeeData,
  adminConfig: AdminConfig = DEFAULT_ADMIN_CONFIG
): {
  schedule: MonthlyBreakdown[];
  summary: ArrearsSummary;
} {
  const start = new Date(data.appointmentDate);
  const end = new Date(data.arrearUptoDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return {
      schedule: [],
      summary: createEmptySummary()
    };
  }

  const schedule: MonthlyBreakdown[] = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const endLimit = new Date(end.getFullYear(), end.getMonth(), 1);

  let rowIndex = 1;

  // Find scale grade from adminConfig
  const scaleGrade = adminConfig.payScales.find((p) => p.bps === data.bps) || adminConfig.payScales.find((p) => p.bps === 14);

  while (cur <= endLimit) {
    const year = cur.getFullYear();
    const month = cur.getMonth(); // 0 to 11
    const yearMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthLabel = `${MONTH_NAMES[month]} ${String(year).slice(2)}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Determine claimed days in this month
    let startDay = 1;
    let endDay = daysInMonth;

    if (year === start.getFullYear() && month === start.getMonth()) {
      startDay = start.getDate();
    }
    if (year === end.getFullYear() && month === end.getMonth()) {
      endDay = end.getDate();
    }

    const daysClaimed = Math.max(0, endDay - startDay + 1);
    const isPartial = daysClaimed < daysInMonth;
    const ratio = daysClaimed / daysInMonth;

    // Basic Pay calculation
    const isScale2026Active = year > 2026 || (year === 2026 && month >= 6); // Effective 1st July 2026
    const initialBasic2022 = (scaleGrade ? scaleGrade.initialBasicPay : 22530);
    const incAmount2022 = (scaleGrade ? scaleGrade.annualIncrement : 1740);
    const initialBasic2026 = 27060;
    const incAmount2026 = 2090;

    let basePay = initialBasic2022;
    const appliedEvents: string[] = [];

    // Count how many December annual increments were earned up to this month
    let earnedIncrements = 0;
    if (data.isIncrementAdded) {
      for (let y = start.getFullYear(); y <= year; y++) {
        // Under Sindh / Pakistan Civil Service Rules:
        // In the year of appointment, employee must have joined on or before 1st June to earn the Dec 1st increment.
        const joinedOnOrBeforeJune1 = start.getMonth() < 5 || (start.getMonth() === 5 && start.getDate() <= 1);
        const isEligibleInAppointmentYear = (y > start.getFullYear()) || joinedOnOrBeforeJune1;

        if (isEligibleInAppointmentYear) {
          // Increment takes effect on 1st December (month index 11)
          if (year > y || (year === y && month >= 11)) {
            earnedIncrements++;
            if (year === y && month === 11) {
              const currentInc = isScale2026Active ? incAmount2026 : incAmount2022;
              appliedEvents.push(`Annual Increment on Dec 1st (+Rs. ${currentInc})`);
            }
          }
        }
      }
    }

    if (isScale2026Active) {
      // 2026 Revised Pay Scale transition
      basePay = initialBasic2026 + earnedIncrements * incAmount2026;
      if (year === 2026 && month === 6) {
        appliedEvents.push('Budget 2026: Revised Pay Scale 2026 & Allowance Rationalization Applied');
      }
    } else {
      // 2022 Pay Scale
      basePay = initialBasic2022 + earnedIncrements * incAmount2022;
    }

    // July Fiscal Budget Announcements / Adhoc events
    if (month === 6) {
      if (year === 2022) appliedEvents.push('Budget 2022: Revised Pay Scale, Adhoc 15% & Diff 34.35% Applied');
      if (year === 2023) appliedEvents.push('Budget 2023: Adhoc Relief 35% Applied');
      if (year === 2024) appliedEvents.push('Budget 2024: Adhoc Relief 25% Applied');
      if (year === 2025) appliedEvents.push('Budget 2025: Adhoc Relief 12% Applied');
    }

    const houseRentBase = data.houseRentType === 'Urban' 
      ? (data.houseRentRateUrban || (scaleGrade ? scaleGrade.houseRentUrban : 3321))
      : (data.houseRentRateRural || (scaleGrade ? scaleGrade.houseRentRural : 2253));
    
    // Conveyance Allowance: Rs. 2,856 before July 2026, Rs. 4,284 from July 2026
    const conveyanceBase = isScale2026Active 
      ? (data.bps === 14 ? 4284 : (scaleGrade ? Math.round(scaleGrade.conveyanceAllowance * 1.5) : 4284))
      : (data.conveyanceRate || (scaleGrade ? scaleGrade.conveyanceAllowance : 2856));

    const medicalBase = data.medicalAllowanceRate || (scaleGrade ? scaleGrade.medicalAllowance : 1375);

    // Special Conveyance for disabled persons:
    // Before Jul-23: 2000, Jul-23 to Jun-25: 4000, Jul-25 to Jun-26: 6000, From Jul-26: 10000
    let specialConveyanceBase = 0;
    if (data.isDisability) {
      if (year < 2023 || (year === 2023 && month < 6)) {
        specialConveyanceBase = 2000;
      } else if (year < 2025 || (year === 2025 && month < 6)) {
        specialConveyanceBase = 4000;
      } else if (year === 2025 || (year === 2026 && month < 6)) {
        specialConveyanceBase = 6000;
      } else {
        specialConveyanceBase = 10000;
      }
    }

    const teachingAllowanceBase = data.isTeachingAllowance ? (data.teachingAllowanceRate || 1000) : 0;

    // Check dynamic adhoc rules from admin config / fiscal dates
    const isAfterJul2022 = year > 2022 || (year === 2022 && month >= 6);
    const isAfterJul2023 = year > 2023 || (year === 2023 && month >= 6);
    const isAfterJul2024 = year > 2024 || (year === 2024 && month >= 6);
    const isAfterJul2025 = year > 2025 || (year === 2025 && month >= 6);

    // Pre-2022 Adhocs: Active before July 2022
    const isPre2022Active = year < 2022 || (year === 2022 && month < 6);
    const adhoc2017Base = isPre2022Active ? (data.adhoc2017Rate || 2277) : 0;
    const adhoc2018Base = isPre2022Active ? (data.adhoc2018Rate || 1518) : 0;
    const adhoc2019Base = isPre2022Active ? (data.adhoc2019Rate || 2277) : 0;
    const adhoc2020Base = isPre2022Active ? (data.adhoc2020Rate || 1518) : 0;
    const adhoc2021Base = isPre2022Active ? (data.adhoc2021Rate || 3036) : 0;
    
    // Adhoc 2022 (15% on 2017 basic = 2,277) is active from Jul 2022 to Jun 2026; merged (0) in Jul 2026
    const adhoc2022Base = (isAfterJul2022 && !isScale2026Active) ? (data.adhoc2022Rate || 2277) : 0;
    
    // Differential Allowance 2022 (34.35% = 5,237) is active from Jul 2022 onwards
    const diff2022Base = isAfterJul2022 ? (data.diffAllowance2022Rate || 5237) : 0;

    // Adhoc 2023 (35% = 7,885) is active from Jul 2023 onwards
    const adhoc2023Base = isAfterJul2023 ? (data.adhoc2023Rate || 7885) : 0;

    // Adhoc 2024 (25% = 5,632) is active from Jul 2024 onwards
    const adhoc2024Base = isAfterJul2024 ? (data.adhoc2024Rate || 5632) : 0;

    // Adhoc 2025 (12% = 2,703) is active from Jul 2025 to Jun 2026; merged (0) in Jul 2026
    const adhoc2025Base = (isAfterJul2025 && !isScale2026Active) ? (data.adhoc2025Rate || 2703) : 0;

    // Adhoc 2026 (7% DRA on 2026 running basic: round(basePay * 0.07) -> 1,894 for 27,060, 2,040 for 29,150)
    const adhoc2026Base = isScale2026Active ? Math.round(basePay * 0.07) : 0;

    // Differential Allowance 2026 (2% DRA-26 = 450)
    const diff2026Base = isScale2026Active ? (data.diffAllowance2026Rate || 450) : 0;

    // Deductions:
    const gpfBase = data.gpfRate || (scaleGrade ? scaleGrade.gpfRate : 3900);
    // Benevolent Fund: Rs. 338 before July 2026, Rs. 406 from July 2026
    const bfBase = isScale2026Active ? 406 : (data.bfRate || (scaleGrade ? scaleGrade.bfRate : 338));
    const giBase = data.giRate || (scaleGrade ? scaleGrade.giRate : 464);

    // Custom allowances sum
    let customAllowancesSum = 0;
    if (adminConfig.customAllowances) {
      for (const ca of adminConfig.customAllowances) {
        if (ca.enabled) {
          if (ca.type === 'fixed') {
            customAllowancesSum += ca.value;
          } else if (ca.type === 'percent_basic') {
            customAllowancesSum += Math.round((basePay * ca.value) / 100);
          }
        }
      }
    }

    // Custom deductions sum
    let customDeductionsSum = 0;
    if (adminConfig.customDeductions) {
      for (const cd of adminConfig.customDeductions) {
        if (cd.enabled) {
          if (cd.type === 'fixed') {
            customDeductionsSum += cd.value;
          } else if (cd.type === 'percent_basic') {
            customDeductionsSum += Math.round((basePay * cd.value) / 100);
          }
        }
      }
    }

    // Default calculated values
    let calculatedRow: MonthlyBreakdown = {
      id: yearMonthStr,
      index: rowIndex,
      yearMonth: yearMonthStr,
      monthLabel,
      daysInMonth,
      daysClaimed,
      isPartial,
      basicPay: Math.round(basePay * ratio),
      houseRent: Math.round(houseRentBase * ratio),
      conveyance: Math.round(conveyanceBase * ratio),
      specialConveyance: Math.round(specialConveyanceBase * ratio),
      teachingAllowance: Math.round(teachingAllowanceBase * ratio),
      medicalAllowance: Math.round(medicalBase * ratio),
      adhoc2017: Math.round(adhoc2017Base * ratio),
      adhoc2018: Math.round(adhoc2018Base * ratio),
      adhoc2019: Math.round(adhoc2019Base * ratio),
      adhoc2020: Math.round(adhoc2020Base * ratio),
      adhoc2021: Math.round(adhoc2021Base * ratio),
      adhoc2022: Math.round(adhoc2022Base * ratio),
      adhoc2023: Math.round(adhoc2023Base * ratio),
      adhoc2024: Math.round(adhoc2024Base * ratio),
      adhoc2025: Math.round(adhoc2025Base * ratio),
      adhoc2026: Math.round(adhoc2026Base * ratio),
      diffAllowance2022: Math.round(diff2022Base * ratio),
      diffAllowance2026: Math.round(diff2026Base * ratio),
      customAllowancesSum: Math.round(customAllowancesSum * ratio),
      customDeductionsSum: Math.round(customDeductionsSum * ratio),
      totalGross: 0,
      gpf: Math.round(gpfBase * ratio),
      benevolentFund: Math.round(bfBase * ratio),
      groupInsurance: Math.round(giBase * ratio),
      totalDeduction: 0,
      netPayable: 0,
      isModified: false,
      unproratedBasicPay: basePay,
      appliedEvents: appliedEvents.length > 0 ? appliedEvents : undefined,
    };

    // Check if manual override exists for this month
    if (data.manualOverrides && data.manualOverrides[yearMonthStr]) {
      const override = data.manualOverrides[yearMonthStr];
      calculatedRow = {
        ...calculatedRow,
        ...override,
        isModified: true
      };
    }

    // Compute gross, deduction, net
    calculatedRow.totalGross =
      (calculatedRow.basicPay || 0) +
      (calculatedRow.houseRent || 0) +
      (calculatedRow.conveyance || 0) +
      (calculatedRow.specialConveyance || 0) +
      (calculatedRow.teachingAllowance || 0) +
      (calculatedRow.medicalAllowance || 0) +
      (calculatedRow.adhoc2017 || 0) +
      (calculatedRow.adhoc2018 || 0) +
      (calculatedRow.adhoc2019 || 0) +
      (calculatedRow.adhoc2020 || 0) +
      (calculatedRow.adhoc2021 || 0) +
      (calculatedRow.adhoc2022 || 0) +
      (calculatedRow.adhoc2023 || 0) +
      (calculatedRow.adhoc2024 || 0) +
      (calculatedRow.adhoc2025 || 0) +
      (calculatedRow.adhoc2026 || 0) +
      (calculatedRow.diffAllowance2022 || 0) +
      (calculatedRow.diffAllowance2026 || 0) +
      (calculatedRow.customAllowancesSum || 0);

    calculatedRow.totalDeduction =
      (calculatedRow.gpf || 0) +
      (calculatedRow.benevolentFund || 0) +
      (calculatedRow.groupInsurance || 0) +
      (calculatedRow.customDeductionsSum || 0);

    calculatedRow.netPayable = calculatedRow.totalGross - calculatedRow.totalDeduction;

    schedule.push(calculatedRow);
    rowIndex++;
    cur.setMonth(cur.getMonth() + 1);
  }

  // Summary calculation
  let totalBasicPay = 0;
  let totalHouseRent = 0;
  let totalConveyance = 0;
  let totalSpecialConveyance = 0;
  let totalTeachingAllowance = 0;
  let totalMedicalAllowance = 0;
  let totalAdhoc2017 = 0;
  let totalAdhoc2018 = 0;
  let totalAdhoc2019 = 0;
  let totalAdhoc2020 = 0;
  let totalAdhoc2021 = 0;
  let totalAdhoc2022 = 0;
  let totalAdhoc2023 = 0;
  let totalAdhoc2024 = 0;
  let totalAdhoc2025 = 0;
  let totalAdhoc2026 = 0;
  let totalDiffAllowance2022 = 0;
  let totalDiffAllowance2026 = 0;
  let totalCustomAllowances = 0;
  let totalCustomDeductions = 0;
  let totalGPF = 0;
  let totalBF = 0;
  let totalGI = 0;

  for (const row of schedule) {
    totalBasicPay += row.basicPay || 0;
    totalHouseRent += row.houseRent || 0;
    totalConveyance += row.conveyance || 0;
    totalSpecialConveyance += row.specialConveyance || 0;
    totalTeachingAllowance += row.teachingAllowance || 0;
    totalMedicalAllowance += row.medicalAllowance || 0;
    totalAdhoc2017 += row.adhoc2017 || 0;
    totalAdhoc2018 += row.adhoc2018 || 0;
    totalAdhoc2019 += row.adhoc2019 || 0;
    totalAdhoc2020 += row.adhoc2020 || 0;
    totalAdhoc2021 += row.adhoc2021 || 0;
    totalAdhoc2022 += row.adhoc2022 || 0;
    totalAdhoc2023 += row.adhoc2023 || 0;
    totalAdhoc2024 += row.adhoc2024 || 0;
    totalAdhoc2025 += row.adhoc2025 || 0;
    totalAdhoc2026 += row.adhoc2026 || 0;
    totalDiffAllowance2022 += row.diffAllowance2022 || 0;
    totalDiffAllowance2026 += row.diffAllowance2026 || 0;
    totalCustomAllowances += row.customAllowancesSum || 0;
    totalCustomDeductions += row.customDeductionsSum || 0;
    totalGPF += row.gpf || 0;
    totalBF += row.benevolentFund || 0;
    totalGI += row.groupInsurance || 0;
  }

  const totalRegularAllowances =
    totalHouseRent + totalConveyance + totalSpecialConveyance + totalMedicalAllowance + totalTeachingAllowance;

  const totalOtherAllowances =
    totalAdhoc2017 +
    totalAdhoc2018 +
    totalAdhoc2019 +
    totalAdhoc2020 +
    totalAdhoc2021 +
    totalAdhoc2022 +
    totalAdhoc2023 +
    totalAdhoc2024 +
    totalAdhoc2025 +
    totalAdhoc2026 +
    totalDiffAllowance2022 +
    totalDiffAllowance2026 +
    totalCustomAllowances;

  const grossAmount = totalBasicPay + totalRegularAllowances + totalOtherAllowances;
  const totalDeductions = totalGPF + totalBF + totalGI + totalCustomDeductions;
  const netPayableAmount = grossAmount - totalDeductions;

  const summary: ArrearsSummary = {
    totalLengthText: calculateLengthOfArrears(data.appointmentDate, data.arrearUptoDate),
    totalMonths: schedule.length,
    totalDays: schedule.reduce((acc, r) => acc + r.daysClaimed, 0),
    grossAmount,
    totalDeductions,
    netPayableAmount,
    amountInWords: numberToPakistaniRupeesWords(netPayableAmount),
    totalBasicPay,
    totalHouseRent,
    totalConveyance,
    totalSpecialConveyance,
    totalTeachingAllowance,
    totalMedicalAllowance,
    totalAdhoc2017,
    totalAdhoc2018,
    totalAdhoc2019,
    totalAdhoc2020,
    totalAdhoc2021,
    totalAdhoc2022,
    totalAdhoc2023,
    totalAdhoc2024,
    totalAdhoc2025,
    totalAdhoc2026,
    totalDiffAllowance2022,
    totalDiffAllowance2026,
    totalRegularAllowances,
    totalOtherAllowances,
    totalCustomAllowances,
    totalCustomDeductions,
    totalGPF,
    totalBF,
    totalGI,
  };

  return { schedule, summary };
}

function createEmptySummary(): ArrearsSummary {
  return {
    totalLengthText: '0 Years, 0 Months, 0 Days.',
    totalMonths: 0,
    totalDays: 0,
    grossAmount: 0,
    totalDeductions: 0,
    netPayableAmount: 0,
    amountInWords: 'Rupees Zero Only.',
    totalBasicPay: 0,
    totalHouseRent: 0,
    totalConveyance: 0,
    totalSpecialConveyance: 0,
    totalTeachingAllowance: 0,
    totalMedicalAllowance: 0,
    totalAdhoc2017: 0,
    totalAdhoc2018: 0,
    totalAdhoc2019: 0,
    totalAdhoc2020: 0,
    totalAdhoc2021: 0,
    totalAdhoc2022: 0,
    totalAdhoc2023: 0,
    totalAdhoc2024: 0,
    totalAdhoc2025: 0,
    totalAdhoc2026: 0,
    totalDiffAllowance2022: 0,
    totalDiffAllowance2026: 0,
    totalRegularAllowances: 0,
    totalOtherAllowances: 0,
    totalGPF: 0,
    totalBF: 0,
    totalGI: 0,
  };
}

export { REGIONS_DISTRICTS_MAP, TALUKAS_MAP } from './regionsData';
