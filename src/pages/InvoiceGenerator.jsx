import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import { getNextInvoiceNumber, formatCurrency, formatDate } from '../utils/helpers';
import { generateInvoice } from '../utils/generators';

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
  address: '',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  serviceDesc: '',
  amount: '',
  gst: false,
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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setProv = (k, v) => setProvider(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.serviceDesc.trim()) e.serviceDesc = 'Required';
    if (!form.amount || isNaN(parseFloat(form.amount))) e.amount = 'Enter a valid amount';
    if (!provider.name.trim()) e.providerName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const invNum = getNextInvoiceNumber();
    
    // We repurpose the project generator for standalone use
    const projectData = {
      projectTitle: form.serviceDesc,
      projectType: 'Service',
      clientName: form.clientName,
      companyName: form.companyName,
      totalPrice: form.amount,
      advancePercent: '100', // Standalone is usually 100%
      email: '',
    };

    const result = generateInvoice(projectData, 'advance', invNum, provider);
    setDoc(result);
  };

  return (
    <div className="page-body fade-enter">
      {/* Provider Info */}
      <div className="card">
        <div className="card-title">Provided By</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="inv-prov-name">Your Name / Company Name *</label>
            <input
              id="inv-prov-name"
              value={provider.name}
              onChange={e => setProv('name', e.target.value)}
              placeholder="e.g. Wasim Fayaz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inv-prov-email">Your Email</label>
            <input
              id="inv-prov-email"
              value={provider.email}
              onChange={e => setProv('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Invoice Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="inv-clientName">Client Name *</label>
            <input
              id="inv-clientName"
              value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="e.g. Rahul Verma"
              style={errors.clientName ? { borderColor: '#c00' } : {}}
            />
            {errors.clientName && <span style={{ color: '#c00', fontSize: 11 }}>{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="inv-company">Company Name</label>
            <input
              id="inv-company"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="form-group full">
            <label htmlFor="inv-service">Service Description *</label>
            <textarea
              id="inv-service"
              rows={2}
              value={form.serviceDesc}
              onChange={e => set('serviceDesc', e.target.value)}
              placeholder="e.g. Brand Film Production — March 2025"
              style={errors.serviceDesc ? { borderColor: '#c00' } : {}}
            />
            {errors.serviceDesc && <span style={{ color: '#c00', fontSize: 11 }}>{errors.serviceDesc}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="inv-amount">Amount (₹) *</label>
            <input
              id="inv-amount"
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="e.g. 50000"
              style={errors.amount ? { borderColor: '#c00' } : {}}
            />
            {errors.amount && <span style={{ color: '#c00', fontSize: 11 }}>{errors.amount}</span>}
          </div>
        </div>

        <div className="generate-row">
          <button className="btn btn-primary" onClick={handleGenerate} id="btn-generate-invoice">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="14" height="14" x="3" y="3" rx="2"/>
              <path d="M7 12h10M7 8h10M7 16h6"/>
            </svg>
            Generate Invoice
          </button>
        </div>
      </div>

      {doc && (
        <div className="fade-enter" style={{ marginTop: 24 }}>
          <DocOutput type="Invoice" html={doc.html} text={doc.text} />
        </div>
      )}
    </div>
  );
}
