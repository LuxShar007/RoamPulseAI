/**
 * RoamPulse AI — Global Currency Formatting Utility
 * Converts base INR prices to selected currency format.
 */

const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0094 },
  AED: { symbol: 'AED ', rate: 0.044 },
  JPY: { symbol: '¥', rate: 1.85 }
};

export function formatPrice(amountInINR, currencyCode = 'INR') {
  if (amountInINR === undefined || amountInINR === null) return '';

  // Extract raw numeric value if a string like "₹1,400/night" or "1400" is passed
  let num = 0;
  if (typeof amountInINR === 'number') {
    num = amountInINR;
  } else {
    const cleaned = String(amountInINR).replace(/[^0-9.]/g, '');
    num = parseFloat(cleaned) || 0;
  }

  const config = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.INR;
  const converted = Math.round(num * config.rate);

  return `${config.symbol}${converted.toLocaleString()}`;
}
