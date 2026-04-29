import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import { generateContract } from '../utils/generators';

const PROJECT_TYPES = [
  'Video Production',
  'Commercial / Ad Shoot',
  'Social Media Content',
  'Brand Film',
  'Event Coverage',
  'Photography',
  'Post-Production / Editing',
];

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
  address: '',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  projectTitle: '',
  serviceType: 'Video Production',
  scopeOfWork: '',
  timeline: '',
  totalAmount: '',
  advancePercent: '50',
  paymentMethod: 'Bank Transfer',
  includeOwnership: true,
  includeLateFee: true,
  includeNDA: false,
  includeCancellation: true,
  includePortfolio: true,
};

export default function ContractGenerator() {
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
    if (form.clientName && form.projectTitle && form.totalAmount) {
      setDoc(generateContract(form, provider));
    }
  }, [form, provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setProv = (k, v) => setProvider(p => ({ ...p, [k]: v }));

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Legal Identity</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Registered Name</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="Full Legal Name" />
              </div>
              <div className="form-group full">
                <label>Address</label>
                <input value={provider.address} onChange={e => setProv('address', e.target.value)} placeholder="Business Address" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">2. Client Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Legal Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient Name" />
              </div>
              <div className="form-group">
                <label>Client Company</label>
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Entity Name" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">3. Project Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Type</label>
                <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Project Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Master Services Agreement" />
              </div>
              <div className="form-group full">
                <label>Additional Scope (Optional)</label>
                <textarea rows={3} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="Add custom deliverables..." />
              </div>
              <div className="form-group">
                <label>Total Value (₹)</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">4. Legal Clauses</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Late Payment Penalty</div>
                </div>
                <Toggle checked={form.includeLateFee} onChange={v => set('includeLateFee', v)} />
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">NDA Clause</div>
                </div>
                <Toggle checked={form.includeNDA} onChange={v => set('includeNDA', v)} />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateContract(form, provider))} style={{ width: '100%', height: 48 }}>
            Refresh Contract Preview
          </button>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Legal Preview</div>
          {doc ? (
            <DocOutput type="Contract" html={doc.html} text={doc.text} />
          ) : (
            <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Fill details to see preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
