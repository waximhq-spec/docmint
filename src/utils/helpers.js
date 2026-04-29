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

export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
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

export function agencyInfo() {
  return {
    name: 'Creative Agency',
    address: 'New Delhi, India',
    email: 'hello@creativeagency.in',
    phone: '+91 98765 43210',
  };
}
