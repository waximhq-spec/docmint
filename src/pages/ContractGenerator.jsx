import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import { generateContract } from '../utils/generators';

const SERVICE_TYPES = [
  'Video Production',
  'Website Development',
  'Solar Installation',
  'Consulting',
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

  // Live preview effect
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
        
        {/* Left: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Legal Identity</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Your Name / Registered Company</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="Full Legal Name" />
              </div>
              <div className="form-group full">
                <label>Registered Address</label>
                <input value={provider.address} onChange={e => setProv('address', e.target.value)} placeholder="Business Address" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">2. Client Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Legal Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Individual or Rep" />
              </div>
              <div className="form-group">
                <label>Client Company</label>
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Entity Name" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">3. Contract Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Master Services Agreement" />
              </div>
              <div className="form-group">
                <label>Total Value (₹)</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group full">
                <label>Specific Scope Summary</label>
                <textarea 
                  rows={3} 
                  value={form.scopeOfWork} 
                  onChange={e => set('scopeOfWork', e.target.value)} 
                  placeholder="Summarize key deliverables..." 
                />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. 60 Days" />
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
                  <div className="toggle-label">Ownership Transfer</div>
                  <div className="toggle-desc">Rights transfer after full payment</div>
                </div>
                <Toggle checked={form.includeOwnership} onChange={v => set('includeOwnership', v)} />
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Late Payment Penalty</div>
                  <div className="toggle-desc">Include 5% weekly late fee clause</div>
                </div>
                <Toggle checked={form.includeLateFee} onChange={v => set('includeLateFee', v)} />
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">NDA Clause</div>
                  <div className="toggle-desc">Mutual confidentiality agreement</div>
                </div>
                <Toggle checked={form.includeNDA} onChange={v => set('includeNDA', v)} />
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Portfolio Rights</div>
                  <div className="toggle-desc">Allow use of work for marketing</div>
                </div>
                <Toggle checked={form.includePortfolio} onChange={v => set('includePortfolio', v)} />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateContract(form, provider))} style={{ width: '100%', height: 48 }}>
            Refresh Contract Preview
          </button>
        </div>

        {/* Right: Preview */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Legal Preview</div>
          {doc ? (
            <DocOutput type="Contract" html={doc.html} text={doc.text} />
          ) : (
            <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Fill client, title, and amount to see preview
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
