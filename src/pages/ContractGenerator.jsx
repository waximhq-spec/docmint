import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import LocationInput from '../components/LocationInput';
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
  currency: 'INR',
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

  // LISTEN for Global Settings changes from the Sidebar
  useEffect(() => {
    const syncSettings = () => {
      const saved = localStorage.getItem('docmint_provider');
      if (saved) setProvider(JSON.parse(saved));
    };
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  useEffect(() => {
    if (form.clientName && form.projectTitle && form.totalAmount) {
      setDoc(generateContract(form, provider));
    }
  }, [form, provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div className="card-title">Agreement Context</div>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Using global settings for <strong>{provider.name || 'Your Agency'}</strong> in <strong>{provider.currency}</strong>.</p>
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
            <div className="card-title">Project Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Type</label>
                <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Contract Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Master Service Agreement" />
              </div>
              <div className="form-group">
                <label>Total Value ({provider.currency})</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateContract(form, provider))} style={{ width: '100%', height: 48 }}>
            Refresh Contract Preview
          </button>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Legal Preview ({provider.currency})</div>
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
