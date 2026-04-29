import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import LocationInput from '../components/LocationInput';
import { getNextInvoiceNumber, peekInvoiceNumber, formatCurrency } from '../utils/helpers';
import { generateInvoice } from '../utils/generators';

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
  address: '',
  bankName: '',
  accNumber: '',
  ifscCode: '',
  upiId: '',
  currency: 'INR',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  email: '',
  projectName: '',
  totalAmount: '',
  advancePercent: '50',
  manualAdvance: '',
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  type: 'Full Payment Invoice',
  status: 'Unpaid',
  gstEnabled: false,
  gstRate: 18,
  notes: 'Payment due within 7 days.\nLate payments incur a 5% fee after the due date.',
};

export default function InvoiceGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
  }, [provider]);

  useEffect(() => {
    if (!form.invoiceNumber) {
      set('invoiceNumber', peekInvoiceNumber());
    }
  }, []);

  useEffect(() => {
    // Regenerate preview when form/provider changes
    if (form.clientName) {
      setDoc(generateInvoice(form, provider));
    }
  }, [form, provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setProv = (k, v) => setProvider(p => ({ ...p, [k]: v }));

  const calculateTotals = () => {
    const total = parseFloat(form.totalAmount) || 0;
    const gst = form.gstEnabled ? (total * form.gstRate) / 100 : 0;
    const grandTotal = total + gst;
    
    let advance = 0;
    if (form.manualAdvance) {
      advance = parseFloat(form.manualAdvance) || 0;
    } else {
      advance = (grandTotal * (parseFloat(form.advancePercent) || 0)) / 100;
    }
    
    const remaining = grandTotal - advance;

    let dueNow = grandTotal;
    if (form.type === 'Advance Invoice') dueNow = advance;
    if (form.type === 'Final Invoice (Remaining Balance)') dueNow = remaining;

    return { total, gst, grandTotal, advance, remaining, dueNow };
  };

  const totals = calculateTotals();

  const handleGenerate = () => {
    const result = generateInvoice(form, provider);
    setDoc(result);
    getNextInvoiceNumber(); 
  };

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Global Identity & Currency</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Billing Currency</label>
                <select value={provider.currency} onChange={e => setProv('currency', e.target.value)}>
                  <option value="INR">INR (₹) - India</option>
                  <option value="BHD">BHD (.د.ب) - Bahrain</option>
                </select>
              </div>
              <div className="form-group">
                <label>Agency Name</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="e.g. Acme Studio" />
              </div>
              <div className="form-group full">
                <label>Smart Address Search</label>
                <LocationInput 
                  value={provider.address} 
                  onChange={val => setProv('address', val)} 
                  placeholder="Type to find your global office address..." 
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">2. Client Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="client@email.com" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">3. Project & Financials</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Project Name</label>
                <input value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="e.g. Brand Identity Design" />
              </div>
              <div className="form-group">
                <label>Total Project Amount</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Invoice Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Full Payment Invoice</option>
                  <option>Advance Invoice</option>
                  <option>Final Invoice (Remaining Balance)</option>
                </select>
              </div>
              
              {form.type !== 'Full Payment Invoice' && (
                <>
                  <div className="form-group">
                    <label>Advance %</label>
                    <input type="number" value={form.advancePercent} onChange={e => { set('advancePercent', e.target.value); set('manualAdvance', ''); }} placeholder="50" />
                  </div>
                  <div className="form-group">
                    <label>OR Manual Advance Amount</label>
                    <input type="number" value={form.manualAdvance} onChange={e => set('manualAdvance', e.target.value)} placeholder="0.00" />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Payment Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  <option>Unpaid</option>
                  <option>Partially Paid</option>
                  <option>Paid</option>
                </select>
              </div>
            </div>
            <div className="toggle-row" style={{ marginTop: 16 }}>
              <div className="toggle-info">
                <div className="toggle-label">Include Tax/GST</div>
              </div>
              <Toggle checked={form.gstEnabled} onChange={v => set('gstEnabled', v)} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleGenerate} style={{ width: '100%', height: 48, fontSize: 16 }}>
            Generate Professional Invoice
          </button>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Summary ({provider.currency})</div>
          <div className="card" style={{ background: '#f9f9f9', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>Total Project Amount</span>
              <span>{formatCurrency(totals.grandTotal, provider.currency)}</span>
            </div>
            {form.type !== 'Full Payment Invoice' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Advance Paid/Req</span>
                  <span>{formatCurrency(totals.advance, provider.currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Remaining Due</span>
                  <span>{formatCurrency(totals.remaining, provider.currency)}</span>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 12, color: form.status === 'Paid' ? '#10b981' : '#ef4444' }}>
              <span>{form.type === 'Advance Invoice' ? 'Advance Due' : form.type === 'Final Invoice (Remaining Balance)' ? 'Final Due' : 'Total Due'}</span>
              <span>{formatCurrency(totals.dueNow, provider.currency)}</span>
            </div>
          </div>

          {doc ? (
            <DocOutput type="Invoice" html={doc.html} text={doc.text} />
          ) : (
            <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Preview will appear here
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
