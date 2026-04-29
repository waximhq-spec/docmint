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
  expenses: [],
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  type: 'Full Payment',
  status: 'Unpaid',
  gstEnabled: false,
  gstRate: 18,
  discount: '',
  advancePaid: '',
  advanceRequested: '',
  notes: 'Payment due within 7 days.\nLate payments incur a 5% fee after the due date.\nIncludes 2 rounds of revisions as agreed.',
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

  // Item Handlers
  const addItem = () => set('items', [...form.items, { desc: '', qty: 1, rate: '' }]);
  const removeItem = (i) => set('items', form.items.filter((_, idx) => idx !== i));
  const updateItem = (i, k, v) => {
    const newItems = [...form.items];
    newItems[i][k] = v;
    set('items', newItems);
  };

  // Expense Handlers
  const addExpense = () => set('expenses', [...form.expenses, { desc: '', amount: '' }]);
  const removeExpense = (i) => set('expenses', form.expenses.filter((_, idx) => idx !== i));
  const updateExpense = (i, k, v) => {
    const newEx = [...form.expenses];
    newEx[i][k] = v;
    set('expenses', newEx);
  };

  const calculateTotals = () => {
    const subItems = form.items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.rate) || 0), 0);
    const subEx = form.expenses.reduce((acc, exp) => acc + (parseFloat(exp.amount) || 0), 0);
    const subtotal = subItems + subEx;
    const discount = parseFloat(form.discount) || 0;
    const afterDiscount = subtotal - discount;
    const gst = form.gstEnabled ? (afterDiscount * form.gstRate) / 100 : 0;
    return { subtotal, discount, gst, total: afterDiscount + gst };
  };

  const totals = calculateTotals();

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
    getNextInvoiceNumber(); 
  };

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'start' }}>
        
        {/* Left: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Professional Identity</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Your Name / Agency Name</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="e.g. Acme Production House" />
              </div>
              <div className="form-group">
                <label>Bank Name</label>
                <input value={provider.bankName} onChange={e => setProv('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input value={provider.upiId} onChange={e => setProv('upiId', e.target.value)} placeholder="username@upi" />
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
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              3. Services & Deliverables
              <button className="btn btn-secondary" onClick={addItem} style={{ padding: '4px 12px', fontSize: 12 }}>+ Add Item</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 30px', gap: 10, alignItems: 'end' }}>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Service Description</label>
                    <input value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="e.g. Video Shoot" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Qty</label>
                    <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Rate</label>
                    <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} placeholder="₹" />
                  </div>
                  <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#c00', cursor: 'pointer', paddingBottom: 10 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              4. Reimbursable Expenses
              <button className="btn btn-secondary" onClick={addExpense} style={{ padding: '4px 12px', fontSize: 12 }}>+ Add Expense</button>
            </div>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>Add costs for travel, rental, talent, etc.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.expenses.map((exp, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 30px', gap: 10, alignItems: 'end' }}>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Expense Detail</label>
                    <input value={exp.desc} onChange={e => updateExpense(i, 'desc', e.target.value)} placeholder="e.g. Camera Rental" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: 11 }}>Amount</label>
                    <input type="number" value={exp.amount} onChange={e => updateExpense(i, 'amount', e.target.value)} placeholder="₹" />
                  </div>
                  <button onClick={() => removeExpense(i)} style={{ background: 'none', border: 'none', color: '#c00', cursor: 'pointer', paddingBottom: 10 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">5. Financials & Status</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Invoice Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option>Full Payment</option>
                  <option>Advance Invoice</option>
                  <option>Final Invoice</option>
                  <option>Milestone Invoice</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  <option>Unpaid</option>
                  <option>Partially Paid</option>
                  <option>Paid</option>
                  <option>Due</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount (₹)</label>
                <input type="number" value={form.discount} onChange={e => set('discount', e.target.value)} placeholder="0" />
              </div>
              {form.type !== 'Full Payment' && (
                <div className="form-group">
                  <label>{form.type === 'Final Invoice' ? 'Advance Already Paid' : 'Amount Requested'}</label>
                  <input type="number" value={form.type === 'Final Invoice' ? form.advancePaid : form.advanceRequested} onChange={e => set(form.type === 'Final Invoice' ? 'advancePaid' : 'advanceRequested', e.target.value)} placeholder="₹" />
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
            Generate Agency Invoice
          </button>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Invoice Summary</div>
          <div className="card" style={{ background: '#f9f9f9', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>Services Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#d93025' }}>
                <span>Discount</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            {form.gstEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>GST (18%)</span>
                <span>{formatCurrency(totals.gst)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 12 }}>
              <span>Total Bill</span>
              <span>{formatCurrency(totals.total)}</span>
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
