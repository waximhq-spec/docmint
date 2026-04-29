import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
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
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  email: '',
  items: [{ desc: '', qty: 1, rate: '' }],
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  type: 'Full Payment',
  status: 'Unpaid',
  gstEnabled: false,
  gstRate: 18,
  advancePaid: '',
  advanceRequested: '',
  notes: 'Payment due within 7 days.\nNo refunds after delivery.',
};

export default function InvoiceGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  const [doc, setDoc] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
  }, [provider]);

  useEffect(() => {
    if (!form.invoiceNumber) {
      set('invoiceNumber', peekInvoiceNumber());
    }
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setProv = (k, v) => setProvider(p => ({ ...p, [k]: v }));

  const addItem = () => set('items', [...form.items, { desc: '', qty: 1, rate: '' }]);
  const removeItem = (i) => set('items', form.items.filter((_, idx) => idx !== i));
  const updateItem = (i, k, v) => {
    const newItems = [...form.items];
    newItems[i][k] = v;
    set('items', newItems);
  };

  const calculateSubtotal = () => form.items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.rate) || 0), 0);
  const subtotal = calculateSubtotal();
  const gstAmount = form.gstEnabled ? (subtotal * form.gstRate) / 100 : 0;
  const total = subtotal + gstAmount;

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!provider.name.trim()) e.providerName = 'Required';
    if (form.items.some(i => !i.desc.trim() || !i.rate)) e.items = 'Fill all item fields';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const result = generateInvoice(form, provider);
    setDoc(result);
    // Increment only on successful generation
    getNextInvoiceNumber(); 
  };

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* Left: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Provider & Payment Info */}
          <div className="card">
            <div className="card-title">1. Your Business & Payment Info</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Your Name / Agency Name</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="e.g. Acme Studio" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={provider.email} onChange={e => setProv('email', e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Bank Name</label>
                <input value={provider.bankName} onChange={e => setProv('bankName', e.target.value)} placeholder="HDFC, SBI, etc." />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input value={provider.accNumber} onChange={e => setProv('accNumber', e.target.value)} placeholder="0000 1111 2222" />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input value={provider.upiId} onChange={e => setProv('upiId', e.target.value)} placeholder="username@upi" />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="card">
            <div className="card-title">2. Client Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient Name" />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              3. Services / Line Items
              <button className="btn btn-secondary" onClick={addItem} style={{ padding: '4px 12px', fontSize: 12 }}>+ Add Item</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 30px', gap: 10, alignItems: 'end' }}>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Description</label>
                    <input value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Service name" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Qty</label>
                    <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Rate</label>
                    <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} placeholder="₹" />
                  </div>
                  {form.items.length > 1 && (
                    <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#c00', cursor: 'pointer', paddingBottom: 10 }}>×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Status */}
          <div className="card">
            <div className="card-title">4. Invoice Settings</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Invoice Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Full Payment</option>
                  <option>Advance Invoice</option>
                  <option>Final Invoice</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  <option>Unpaid</option>
                  <option>Partially Paid</option>
                  <option>Paid</option>
                  <option>Due</option>
                </select>
              </div>
              {form.type === 'Advance Invoice' && (
                <div className="form-group">
                  <label>Advance Amount Requested</label>
                  <input type="number" value={form.advanceRequested} onChange={e => set('advanceRequested', e.target.value)} placeholder="₹" />
                </div>
              )}
              {form.type === 'Final Invoice' && (
                <div className="form-group">
                  <label>Advance Already Paid</label>
                  <input type="number" value={form.advancePaid} onChange={e => set('advancePaid', e.target.value)} placeholder="₹" />
                </div>
              )}
            </div>

            <div className="toggle-row" style={{ marginTop: 20 }}>
              <div className="toggle-info">
                <div className="toggle-label">Include GST (18%)</div>
              </div>
              <Toggle checked={form.gstEnabled} onChange={v => set('gstEnabled', v)} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleGenerate} style={{ width: '100%', height: 48, fontSize: 16 }}>
            Generate Professional Invoice
          </button>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Invoice Preview</div>
          {doc ? (
            <DocOutput type="Invoice" html={doc.html} text={doc.text} />
          ) : (
            <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Fill details to see preview
            </div>
          )}
          
          <div className="card" style={{ marginTop: 24, background: '#f9f9f9' }}>
            <div className="card-title" style={{ fontSize: 13 }}>Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {form.gstEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>GST (18%)</span>
                <span>{formatCurrency(gstAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, borderTop: '1px solid #ddd', paddingTop: 8 }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
