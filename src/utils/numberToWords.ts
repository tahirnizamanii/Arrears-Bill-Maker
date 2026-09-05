/**
 * Converts a numeric amount into standard words format for Pakistani Government bills.
 * Example: 603081 -> "Rupees Six hundred and Three thousand and Eighty One Only."
 */
const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(num: number): string {
  if (num === 0) return '';
  
  let result = '';
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' and ';
  }
  
  if (num > 0) {
    if (num < 20) {
      result += ones[num];
    } else {
      result += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        result += ' ' + ones[num % 10];
      }
    }
  }
  
  return result;
}

export function numberToPakistaniRupeesWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero Only.';
  
  const isNegative = amount < 0;
  let integerPart = Math.floor(Math.abs(amount));
  
  if (integerPart === 0) return 'Rupees Zero Only.';

  let words = '';

  // Millions / Crores / Lakhs / Thousands handling:
  // In Pakistani bill convention (like the PDF: "Six hundred and Three thousand and Eighty One"):
  const billions = Math.floor(integerPart / 1000000000);
  integerPart %= 1000000000;

  const millions = Math.floor(integerPart / 1000000);
  integerPart %= 1000000;

  const thousands = Math.floor(integerPart / 1000);
  integerPart %= 1000;

  const remainder = integerPart;

  if (billions > 0) {
    words += convertBelowThousand(billions) + ' Billion ';
  }

  if (millions > 0) {
    words += convertBelowThousand(millions) + ' Million ';
  }

  if (thousands > 0) {
    words += convertBelowThousand(thousands) + ' thousand ';
  }

  if (remainder > 0) {
    if (words !== '' && !words.trim().endsWith('and')) {
      words += 'and ';
    }
    words += convertBelowThousand(remainder);
  }

  words = words.trim();
  // Capitalize properly
  words = words.replace(/\s+/g, ' ');

  const result = `Rupees ${words} Only.`;
  return isNegative ? `Minus ${result}` : result;
}

export function formatCurrency(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '-';
  if (num === 0) return '-';
  return num.toLocaleString('en-US');
}

export function formatCurrencyWithZero(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}
