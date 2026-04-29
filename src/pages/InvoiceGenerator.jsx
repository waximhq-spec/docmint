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
  projectName: '', // Still used as a general project title
  lineItems: [{ id: 1, description: '', quantity: 1, rate: '' }],
  totalAmount: 0,
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
  // Payment Details
  bankName: '',
  accNumber: '',
  ifscCode: '',
  holderName: '',
  upiId: '',
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
    // Pre-fill bank details from global settings if form fields are empty
    if (provider) {
      setForm(f => ({
        ...f,
        bankName: f.bankName || provider.bankName || '',
        accNumber: f.accNumber || provider.accNumber || '',
        ifscCode: f.ifscCode || provider.ifscCode || '',
        holderName: f.holderName || provider.name || '',
        upiId: f.upiId || provider.upiId || '',
      }));
    }
  }, [provider]);

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
    const total = form.lineItems.reduce((acc, item) => {
      const q = parseFloat(item.quantity) || 0;
      const r = parseFloat(item.rate) || 0;
      return acc + (q * r);
    }, 0);
    
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

  const isValid = () => {
    const hasItems = form.lineItems.length > 0 && form.lineItems.every(i => i.description && i.rate > 0);
    const hasClient = form.clientName.trim().length > 0;
    const hasBank = form.bankName.trim().length > 0 && 
                    form.accNumber.trim().length > 0 && 
                    form.ifscCode.trim().length > 0 && 
                    form.holderName.trim().length > 0;
    return hasItems && hasClient && hasBank;
  };

  const addLineItem = () => {
    set('lineItems', [...form.lineItems, { id: Date.now(), description: '', quantity: 1, rate: '' }]);
  };

  const removeLineItem = (id) => {
    if (form.lineItems.length > 1) {
      set('lineItems', form.lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id, field, value) => {
    set('lineItems', form.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

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
                <label>Client Name*</label>
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
                <label>Project Title / Brief*</label>
                <input 
                  value={form.projectName} 
                  onChange={e => set('projectName', e.target.value)} 
                  placeholder="e.g. Video Production for Acme Corp" 
                />
              </div>

              <div className="form-group full">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Services & Items*</span>
                  <button className="btn btn-ghost btn-sm" onClick={addLineItem} style={{ color: 'var(--primary)' }}>+ Add Item</button>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                  {form.lineItems.map((item, idx) => (
                    <div key={item.id} className="card" style={{ padding: 12, background: '#fcfcfc', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          <input 
                            value={item.description} 
                            onChange={e => updateLineItem(item.id, 'description', e.target.value)} 
                            placeholder="Service Name (e.g. Editing)"
                            style={{ background: '#fff' }}
                          />
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => removeLineItem(item.id)} style={{ color: '#ef4444' }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 80 }}>
                          <label style={{ fontSize: 9, marginBottom: 2 }}>Qty</label>
                          <input 
                            type="number" 
                            value={item.quantity} 
                            onChange={e => updateLineItem(item.id, 'quantity', e.target.value)} 
                            placeholder="1"
                            style={{ background: '#fff' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 9, marginBottom: 2 }}>Rate ({provider.currency})</label>
                          <input 
                            type="number" 
                            value={item.rate} 
                            onChange={e => updateLineItem(item.id, 'rate', e.target.value)} 
                            placeholder="0.00"
                            style={{ background: '#fff' }}
                          />
                        </div>
                        <div style={{ width: 100, textAlign: 'right' }}>
                          <label style={{ fontSize: 9, marginBottom: 2 }}>Total</label>
                          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>
                            {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), provider.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
            <div className="toggle-row" style={{ marginTop: 16 }}>
              <div className="toggle-info">
                <div className="toggle-label">Include Tax/GST</div>
              </div>
              <Toggle checked={form.gstEnabled} onChange={v => set('gstEnabled', v)} />
            </div>
          </div>
        </div>

          <div className="card">
            <div className="card-title">4. Payment Details (Bank / UPI)</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Bank Name*</label>
                <input value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div className="form-group">
                <label>Account Holder*</label>
                <input value={form.holderName} onChange={e => set('holderName', e.target.value)} placeholder="Name on account" />
              </div>
              <div className="form-group">
                <label>Account Number*</label>
                <input value={form.accNumber} onChange={e => set('accNumber', e.target.value)} placeholder="0000 0000 0000" />
              </div>
              <div className="form-group">
                <label>IFSC Code*</label>
                <input value={form.ifscCode} onChange={e => set('ifscCode', e.target.value)} placeholder="HDFC0001234" />
              </div>
              <div className="form-group full">
                <label>UPI ID (For QR Generation)</label>
                <input value={form.upiId} onChange={e => set('upiId', e.target.value)} placeholder="username@upi" />
                {form.upiId && provider.currency === 'INR' && (
                  <div style={{ fontSize: 10, color: '#10b981', marginTop: 4 }}>✨ UPI QR code will be generated automatically</div>
                )}
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleGenerate} 
            disabled={!isValid()}
            style={{ 
              width: '100%', 
              height: 48, 
              fontSize: 16,
              opacity: isValid() ? 1 : 0.5,
              cursor: isValid() ? 'pointer' : 'not-allowed'
            }}
          >
            {isValid() ? 'Generate Invoice' : 'Fill Required Fields (*)'}
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
