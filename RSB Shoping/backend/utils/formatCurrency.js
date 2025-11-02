// Format amount from paise to INR with symbol
const formatToINR = (amountInPaise) => {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Convert INR to paise
const convertToPaise = (amountInINR) => {
  return Math.round(amountInINR * 100);
};

// Format amount to paise for Razorpay
const formatForRazorpay = (amountInPaise) => {
  return Math.round(amountInPaise);
};

// Calculate GST amount
const calculateGST = (amountInPaise, gstPercentage = 18) => {
  return Math.round((amountInPaise * gstPercentage) / 100);
};

module.exports = {
  formatToINR,
  convertToPaise,
  formatForRazorpay,
  calculateGST
};