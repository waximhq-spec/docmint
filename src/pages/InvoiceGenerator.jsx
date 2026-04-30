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
      <div className="mobile-view-tabs">
        <button className={`mobile-view-tab ${mobileTab === 'edit' ? 'active' : ''}`} onClick={() => setMobileTab('edit')}>Editor</button>
        <button className={`mobile-view-tab ${mobileTab === 'preview' ? 'active' : ''}`} onClick={() => setMobileTab('preview')}>Preview</button>
      </div>

      <div className="page-body">
        <div className="two-col-layout">
          <div className="form-col" style={{ display: mobileTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', gap: 20 }}>
          
          <div className="card">
            <div className="card-title">Identity & Currency</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Billing Currency</label>
                <select value={provider.currency} onChange={e => setProv('currency', e.target.value)}>
                  <option value="INR">INR (₹)</option>
                  <option value="BHD">BHD (.د.ب)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Agency Name</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="Agency name" />
              </div>
              <div className="form-group">
                <label>Office Address</label>
                <LocationInput 
                  value={provider.address} 
                  onChange={val => setProv('address', val)} 
                  placeholder="Global office address..." 
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Client Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name*</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="client@agency.com" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Line Items & Financials</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Title*</label>
                <input value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="e.g. Brand Identity Design" />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label>Services</label>
                  <button className="btn btn-outline btn-sm" onClick={addLineItem}>+ Add Item</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {form.lineItems.map((item) => (
                    <div key={item.id} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <input 
                            value={item.description} 
                            onChange={e => updateLineItem(item.id, 'description', e.target.value)} 
                            placeholder="Description"
                          />
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => removeLineItem(item.id)} style={{ color: 'var(--text-secondary)' }}>✕</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px', gap: 12, alignItems: 'center' }}>
                        <div>
                          <label style={{ fontSize: 10 }}>Qty</label>
                          <input type="number" value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10 }}>Rate ({provider.currency})</label>
                          <input type="number" value={item.rate} onChange={e => updateLineItem(item.id, 'rate', e.target.value)} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <label style={{ fontSize: 10 }}>Total</label>
                          <div style={{ fontWeight: 600 }}>{formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), provider.currency)}</div>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12 }}>
                  <div className="form-group">
                    <label>{form.type === 'Final Invoice' ? 'Advance %' : 'Advance %'}</label>
                    <input type="number" value={form.advancePercent} onChange={e => { set('advancePercent', e.target.value); set('manualAdvance', ''); }} />
                  </div>
                  <div className="form-group">
                    <label>Manual Amount</label>
                    <input type="number" value={form.manualAdvance} onChange={e => set('manualAdvance', e.target.value)} placeholder="0.00" />
                  </div>
                </div>
              )}

              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Enable Tax / GST</div>
                </div>
                <Toggle checked={form.gstEnabled} onChange={v => set('gstEnabled', v)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Payment Settlement</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Bank Name*</label>
                <input value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div className="form-group">
                <label>Account Holder*</label>
                <input value={form.holderName} onChange={e => set('holderName', e.target.value)} placeholder="Beneficiary name" />
              </div>
              <div className="form-group">
                <label>Account Number*</label>
                <input value={form.accNumber} onChange={e => set('accNumber', e.target.value)} placeholder="000000000000" />
              </div>
              <div className="form-group">
                <label>IFSC / Swift Code*</label>
                <input value={form.ifscCode} onChange={e => set('ifscCode', e.target.value)} placeholder="IFSC/SWIFT" />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input value={form.upiId} onChange={e => set('upiId', e.target.value)} placeholder="username@upi" />
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleGenerate} 
            disabled={!isValid()}
            style={{ width: '100%', height: 44 }}
          >
            {isValid() ? 'Generate Document' : 'Complete Required Fields'}
          </button>
          </div>

          <div className="preview-panel" style={{ display: mobileTab === 'preview' ? 'block' : 'none' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'var(--text-tertiary)', marginBottom: 8, display: 'block' }}>Settlement Summary</label>
              <div className="card" style={{ background: 'var(--bg-secondary)', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Project Total</span>
                  <span style={{ fontWeight: 500 }}>{formatCurrency(totals.grandTotal, provider.currency)}</span>
                </div>
                {form.type !== 'Full Invoice' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Balance Outstanding</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(totals.remaining, provider.currency)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <span>{form.type === 'Advance Invoice' ? 'Advance Due' : form.type === 'Final Invoice' ? 'Final Balance' : 'Amount Due'}</span>
                  <span>{formatCurrency(totals.dueNow, provider.currency)}</span>
                </div>
              </div>
            </div>

            {doc ? (
              <DocOutput type="Invoice" html={doc.html} text={doc.text} />
            ) : (
              <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', borderStyle: 'dashed' }}>
                Generate to see document preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
