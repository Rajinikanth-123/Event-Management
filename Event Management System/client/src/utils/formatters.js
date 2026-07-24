export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

export const formatTime = (value) => value || '-';

export const formatSeats = (capacity, registered = 0) => Math.max(Number(capacity || 0) - Number(registered || 0), 0);