/**
 * Format amount from paise to INR with symbol
 * @param {number} amountInPaise Amount in paise
 * @returns {string} Formatted amount with ₹ symbol
 */
export const formatToINR = (amountInPaise) => {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

/**
 * Convert INR to paise
 * @param {number} amountInINR Amount in INR
 * @returns {number} Amount in paise
 */
export const convertToPaise = (amountInINR) => {
  return Math.round(amountInINR * 100);
};

/**
 * Convert paise to INR (decimal)
 * @param {number} amountInPaise Amount in paise
 * @returns {number} Amount in INR
 */
export const convertToINR = (amountInPaise) => {
  return amountInPaise / 100;
};