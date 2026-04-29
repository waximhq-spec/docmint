// Central invoice counter persisted in localStorage
export function getNextInvoiceNumber() {
  const current = parseInt(localStorage.getItem('invoiceCounter') || '0', 10);
  const next = current + 1;
  localStorage.setItem('invoiceCounter', String(next));
  return `INV-${String(next).padStart(3, '0')}`;
}

export function peekInvoiceNumber() {
  const current = parseInt(localStorage.getItem('invoiceCounter') || '0', 10);
  return `INV-${String(current + 1).padStart(3, '0')}`;
}

export function formatCurrency(amount, currency = 'INR') {
  const num = parseFloat(amount) || 0;
  
  // Custom handling for BHD which uses 3 decimal places
  if (currency === 'BHD') {
    return new Intl.NumberFormat('en-BH', {
      style: 'currency',
      currency: 'BHD',
      minimumFractionDigits: 3,
    }).format(num);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Utility to format currency and dates
