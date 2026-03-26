export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return `${value > 0 ? '+' : ''}${parseFloat(value).toFixed(2)}%`;
};

export const formatDecimal = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return parseFloat(value).toFixed(decimals);
};
