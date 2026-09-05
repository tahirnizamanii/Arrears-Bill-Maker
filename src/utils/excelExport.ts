import * as XLSX from 'xlsx';
import { EmployeeData, MonthlyBreakdown, ArrearsSummary } from '../types';
import { formatCurrencyWithZero } from './numberToWords';

export function exportArrearsToExcel(
  employee: EmployeeData,
  schedule: MonthlyBreakdown[],
  summary: ArrearsSummary
) {
  const wb = XLSX.utils.book_new();

  // 1. Summary & Profile Sheet
  const profileData = [
    ['ARREARS BILL SUMMARY & EMPLOYEE PROFILE', ''],
    ['Generated Date:', new Date().toLocaleDateString('en-PK')],
    ['', ''],
    ['1. Name of Employee:', employee.name],
    ['2. Father Name / S/o:', employee.fatherName],
    ['3. Designation:', `${employee.designation} (BPS-${employee.bps})`],
    ['4. CNIC #:', employee.cnic],
    ['5. Personnel ID:', employee.personnelId],
    ['6. Region:', employee.region],
    ['7. District:', employee.district],
    ['8. Taluka / Tehsil:', employee.taluka],
    ['9. School Name:', employee.schoolName],
    ['10. SEMIS Code:', employee.semisCode],
    ['11. DDO First Line:', employee.ddoFirstLine],
    ['12. DDO Second Line:', employee.ddoSecondLine],
    ['13. DDO Code / Cost Center:', `${employee.ddoCode} / ${employee.costCenter}`],
    ['14. Date of Appointment:', employee.appointmentDate],
    ['15. Arrear Required Upto:', employee.arrearUptoDate],
    ['16. House Rent Type:', employee.houseRentType],
    ['17. Increment Added:', employee.isIncrementAdded ? 'Yes' : 'No'],
    ['18. Disability Status:', employee.isDisability ? 'Yes' : 'No'],
    ['19. Teaching Allowance:', employee.isTeachingAllowance ? 'Yes' : 'No'],
    ['', ''],
    ['AT A GLANCE (TOTALS)', ''],
    ['Total Length of Arrears:', summary.totalLengthText],
    ['Total Months Claimed:', summary.totalMonths],
    ['Total Days Claimed:', summary.totalDays],
    ['Gross Amount (Rs.):', summary.grossAmount],
    ['Total Deductions (Rs.):', summary.totalDeductions],
    ['Net Payable Amount (Rs.):', summary.netPayableAmount],
    ['Amount in Words:', summary.amountInWords],
  ];
  const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
  XLSX.utils.book_append_sheet(wb, wsProfile, 'At a Glance');

  // 2. Adjustment Bill Sheet
  const adjData = [
    ['OFFICE OF THE DISTRICT ACCOUNTS OFFICER ' + employee.district.toUpperCase(), '', ''],
    ['ADJUSTMENT BILL FOR THE MONTH W.E.F. ' + employee.appointmentDate + ' TO ' + employee.arrearUptoDate, '', ''],
    ['Token No: _______________', 'Date: ' + new Date().toLocaleDateString('en-GB'), 'Section: ' + employee.costCenter],
    ['Department: Education Department', 'Personnel No: ' + employee.personnelId, 'Name: ' + employee.name + ' S/o ' + employee.fatherName],
    ['Designation: ' + employee.designation + ' (BPS-' + employee.bps + ')', 'CNIC: ' + employee.cnic, ''],
    ['', '', ''],
    ['Adjustment Code', 'Description', 'Amount (Rs.)'],
    ['5801', 'Adj Basic Pay', summary.totalBasicPay],
    ['5002', 'Adj House Rent', summary.totalHouseRent],
    ['5011', 'Adj Conveyance Allowance', summary.totalConveyance],
    ['5012', 'Adj Medical Allowance', summary.totalMedicalAllowance],
    ['5310', 'Adj Adhoc Relief 2013', 0],
    ['5964', 'Adj Adhoc Relief 2015', 0],
    ['5975', 'Adj Adhoc Relief 2016', 0],
    ['5990', 'Adj Adhoc Relief 2017', summary.totalAdhoc2017],
    ['5322', 'Adj Adhoc Relief 2018', summary.totalAdhoc2018],
    ['5336', 'Adj Adhoc Relief 2019', summary.totalAdhoc2019],
    ['5130', 'Adj Adhoc Relief 2020', summary.totalAdhoc2020],
    ['5151', 'Adj Adhoc Relief 2021', summary.totalAdhoc2021],
    ['5358', 'Adj Adhoc Relief 2022 15%', summary.totalAdhoc2022],
    ['5359', 'Adj Differential Allowance (34.35% 2022)', summary.totalDiffAllowance2022],
    ['2378', 'Adj Adhoc Relief 2023 35%', summary.totalAdhoc2023],
    ['2393', 'Adj Adhoc Relief 2024 25%', summary.totalAdhoc2024],
    ['5505', 'Adj Adhoc Relief 2025 12%', summary.totalAdhoc2025],
    ['-', 'Adj Adhoc Relief 2026 7%', summary.totalAdhoc2026],
    ['-', 'Adj Differential Allowance (2% 2026)', summary.totalDiffAllowance2026],
    ['6125', 'Adj Teaching Allowance', summary.totalTeachingAllowance],
    ['-', 'Adj Special Conveyance Allowance for Disable persons', summary.totalSpecialConveyance],
    ['', 'TOTAL GROSS', summary.grossAmount],
    ['', 'DEDUCTIONS', ''],
    ['6001', 'Adj Benevolent Fund', summary.totalBF],
    ['6006', 'Adj Group Insurance', summary.totalGI],
    ['6075', 'Adj G.P.Fund', summary.totalGPF],
    ['', 'TOTAL DEDUCTIONS (-)', summary.totalDeductions],
    ['', 'NET PAYMENT', summary.netPayableAmount],
    ['', 'Amount In Words:', summary.amountInWords],
  ];
  const wsAdj = XLSX.utils.aoa_to_sheet(adjData);
  XLSX.utils.book_append_sheet(wb, wsAdj, 'Adjustment Bill');

  // 3. Detailed Monthly Schedule Sheet
  const scheduleHeader = [
    'S.#', 'Month', 'Days Claimed', 'PAY (Basic)', 'House Rent', 'Conveyance',
    'Sp. Conveyance', 'Teaching Allow.', 'Medical Allow.', 'Adhoc 2017', 'Adhoc 2018',
    'Adhoc 2019', 'Adhoc 2020', 'Adhoc 2021', 'Adhoc 2022', 'Adhoc 2023',
    'Adhoc 2024', 'Adhoc 2025', 'Diff Allow 2022', 'Adhoc 2026', 'DA 2026',
    'Gross Total', 'GPF', 'Benevolent Fund', 'Group Insurance', 'Total Deduction', 'Net Amount'
  ];

  const scheduleRows = schedule.map((row) => [
    row.index,
    row.monthLabel,
    `${row.daysClaimed}/${row.daysInMonth}`,
    row.basicPay,
    row.houseRent,
    row.conveyance,
    row.specialConveyance,
    row.teachingAllowance,
    row.medicalAllowance,
    row.adhoc2017,
    row.adhoc2018,
    row.adhoc2019,
    row.adhoc2020,
    row.adhoc2021,
    row.adhoc2022,
    row.adhoc2023,
    row.adhoc2024,
    row.adhoc2025,
    row.diffAllowance2022,
    row.adhoc2026,
    row.diffAllowance2026,
    row.totalGross,
    row.gpf,
    row.benevolentFund,
    row.groupInsurance,
    row.totalDeduction,
    row.netPayable
  ]);

  const scheduleTotalRow = [
    '',
    'TOTAL',
    summary.totalDays,
    summary.totalBasicPay,
    summary.totalHouseRent,
    summary.totalConveyance,
    summary.totalSpecialConveyance,
    summary.totalTeachingAllowance,
    summary.totalMedicalAllowance,
    summary.totalAdhoc2017,
    summary.totalAdhoc2018,
    summary.totalAdhoc2019,
    summary.totalAdhoc2020,
    summary.totalAdhoc2021,
    summary.totalAdhoc2022,
    summary.totalAdhoc2023,
    summary.totalAdhoc2024,
    summary.totalAdhoc2025,
    summary.totalDiffAllowance2022,
    summary.totalAdhoc2026,
    summary.totalDiffAllowance2026,
    summary.grossAmount,
    summary.totalGPF,
    summary.totalBF,
    summary.totalGI,
    summary.totalDeductions,
    summary.netPayableAmount
  ];

  const wsSchedule = XLSX.utils.aoa_to_sheet([
    [`MONTHLY ARREARS SCHEDULE: ${employee.name} (${employee.designation})`],
    [`Period: ${employee.appointmentDate} to ${employee.arrearUptoDate}`],
    [],
    scheduleHeader,
    ...scheduleRows,
    scheduleTotalRow
  ]);
  XLSX.utils.book_append_sheet(wb, wsSchedule, 'Monthly Schedule');

  // Trigger download
  const cleanName = (employee.name || 'Arrears_Bill').replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `Salary_Arrears_Bill_${cleanName}.xlsx`);
}
