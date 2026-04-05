export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export const formatNumber = (value?: number): string => {
  if (value === undefined || value === null) return '0';
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
  return value.toString();
};
