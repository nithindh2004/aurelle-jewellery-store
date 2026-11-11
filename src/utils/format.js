const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** Formats a whole-rupee amount using Indian digit grouping, e.g. ₹1,24,500. */
export const formatINR = (amount) => inrFormatter.format(amount);
