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
  type: 'Advance Invoice',
  status: 'Unpaid',
  gstEnabled: false,
  gstRate: 18,
  notes: 'Payment due within 7 days.\nLate payments incur a 5% fee after the due date.',
};

export default function InvoiceGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [mobileTab, setMobileTab] = useState('edit');
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

  useEffect(() => {
    if (form.type === 'Advance Invoice' || form.type === 'Full Invoice') {
      setForm(f => ({ ...f, status: 'Unpaid' }));
    } else if (form.type === 'Final Invoice') {
      setForm(f => ({ ...f, status: 'Partially Paid' }));
    }
  }, [form.type]);

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
    if (form.type === 'Final Invoice') dueNow = remaining;

    return { total, gst, grandTotal, advance, remaining, dueNow };
  };

  const totals = calculateTotals();

  const handleGenerate = () => {
    const result = generateInvoice(form, provider);
    setDoc(result);
    getNextInvoiceNumber(); 
  };

  return (
    <div className="fade-enter">
      {/* Mobile Edit / Preview Tabs */}
      <div className="mobile-view-tabs">
        <button className={`mobile-view-tab ${mobileTab === 'edit' ? 'active' : ''}`} onClick={() => setMobileTab('edit')}>✏️ Edit</button>
        <button className={`mobile-view-tab ${mobileTab === 'preview' ? 'active' : ''}`} onClick={() => setMobileTab('preview')}>👁 Preview</button>
      </div>

      <div className="page-body">
        <div className="two-col-layout">
          {/* LEFT: Form inputs */}
          <div style={{ display: mobileTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', gap: 16 }} className="form-col">
          
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
                <label>
                  {form.type === 'Advance Invoice' ? 'Deliverables (To Be Provided)' :
                   form.type === 'Final Invoice' ? 'Services Rendered' :
                   'Project Description'}
                </label>
                <textarea 
                  rows={2}
                  value={form.projectName} 
                  onChange={e => set('projectName', e.target.value)} 
                  placeholder={
                    form.type === 'Advance Invoice' ? 'e.g. 3 advertisement video edits (15–60 sec), platform-ready formats' :
                    form.type === 'Final Invoice' ? 'e.g. 3 advertisement videos delivered and finalized' :
                    'e.g. Video production services for marketing campaign'
                  } 
                />
                <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Keep this section brief. Detailed scope should be in proposal/contract.</div>
              </div>
              <div className="form-group">
                <label>Total Project Amount</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Invoice Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Advance Invoice</option>
                  <option>Final Invoice</option>
                  <option>Full Invoice</option>
                </select>
              </div>
              
              {form.type !== 'Full Invoice' && (
                <>
                  <div className="form-group">
                    <label>{form.type === 'Final Invoice' ? 'Advance Paid %' : 'Advance %'}</label>
                    <input type="number" value={form.advancePercent} onChange={e => { set('advancePercent', e.target.value); set('manualAdvance', ''); }} placeholder="50" />
                  </div>
                  <div className="form-group">
                    <label>{form.type === 'Final Invoice' ? 'Manual Advance Paid' : 'OR Manual Advance Amount'}</label>
                    <input type="number" value={form.manualAdvance} onChange={e => set('manualAdvance', e.target.value)} placeholder="0.00" />
                  </div>
                </>
              )}

              <div className="form-group" style={{ opacity: 0.7 }}>
                <label>Payment Status</label>
                <select 
                  value={form.status} 
                  onChange={e => set('status', e.target.value)}
                  disabled
                >
                  <option>Unpaid</option>
                  <option>Partially Paid</option>
                </select>
                <div style={{ fontSize: 9, color: '#888', marginTop: 4 }}>Status is set automatically based on invoice type</div>
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
            Generate Invoice
          </button>
          </div>

          {/* RIGHT: Preview panel */}
          <div className="preview-panel" style={{ display: mobileTab === 'preview' ? 'block' : 'none' }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Summary ({provider.currency})</div>
          <div className="card" style={{ background: '#f9f9f9', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>Total Project Amount</span>
              <span>{formatCurrency(totals.grandTotal, provider.currency)}</span>
            </div>
            {form.type !== 'Full Invoice' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>{form.type === 'Advance Invoice' ? 'Advance Required' : 'Advance Paid'}</span>
                  <span>{formatCurrency(totals.advance, provider.currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>Remaining Balance</span>
                  <span>{formatCurrency(totals.remaining, provider.currency)}</span>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 12, color: form.status === 'Paid' ? '#10b981' : '#ef4444' }}>
              <span>{form.type === 'Advance Invoice' ? 'Advance Due' : form.type === 'Final Invoice' ? 'Final Due' : 'Total Due'}</span>
              <span>{formatCurrency(totals.dueNow, provider.currency)}</span>
            </div>
            {form.type === 'Advance Invoice' && (
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', textAlign: 'right', marginTop: 8, fontStyle: 'italic' }}>
                This is the {form.advancePercent}% advance to start work. The remaining {formatCurrency(totals.remaining, provider.currency)} is due later.
              </div>
            )}
          </div>

          {doc ? (
            <DocOutput type="Invoice" html={doc.html} text={doc.text} />
          ) : (
            <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Preview will appear here
            </div>
          )}
          </div>
        </div>{/* end two-col-layout */}
      </div>{/* end page-body */}
    </div>
  );
}
