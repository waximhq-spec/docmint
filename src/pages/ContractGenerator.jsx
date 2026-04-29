import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import { generateContract } from '../utils/generators';
import { generateWithAI } from '../utils/ai';

const PROJECT_TYPES = [
  'Video Production',
  'Commercial / Ad Shoot',
  'Social Media Content',
  'Brand Film',
  'Event Coverage',
  'Photography',
  'Post-Production / Editing',
];

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
};

function AIButton({ label, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '3px 10px',
        fontSize: 10,
        fontWeight: 700,
        border: '1px solid #6366f1',
        borderRadius: 20,
        background: loading ? '#f0f0ff' : '#fff',
        color: '#6366f1',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        whiteSpace: 'nowrap',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? '⏳ Drafting...' : `✨ ${label}`}
    </button>
  );
}

export default function ContractGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loadingAI, setLoadingAI] = useState(null);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : { name: '', email: '', address: '', currency: 'INR' };
  });
  const [doc, setDoc] = useState(null);

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

  const handleAIDraft = async () => {
    setLoadingAI('scope');
    const result = await generateWithAI(
      `Create a clean and professional contract scope for a ${form.serviceType} project titled "${form.projectTitle}".

Total Value: ${provider.currency} ${form.totalAmount || 'TBD'}
Timeline: ${form.timeline || 'TBD'}

Include:
- Scope of work with clear deliverables
- Payment terms (${form.advancePercent}% advance, remainder on delivery)
- Revision limits
- Ownership rights
- Cancellation policy

Keep it clear, structured, and legally simple. Use bullet points. No generic filler text.`
    );
    set('scopeOfWork', result);
    setLoadingAI(null);
  };

  const handleAIRewrite = async (field, text) => {
    if (!text.trim()) return;
    setLoadingAI(field);
    const result = await generateWithAI(
      `Rewrite this in a more professional, legally clear tone for a service agreement. Return only the rewritten text:

"${text}"`
    );
    set(field, result);
    setLoadingAI(null);
  };

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div className="card-title" style={{ margin: 0 }}>Agreement Context</div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: '#f0f0ff', color: '#6366f1', border: '1px solid #e0e0ff' }}>✨ AI POWERED</span>
            </div>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
              Agency: <strong>{provider.name || 'Not set'}</strong> · Currency: <strong>{provider.currency}</strong>
            </p>
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
            <div className="card-title">Contract Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Type</label>
                <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Contract Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Brand Film Agreement" />
              </div>
              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>Service Scope & Terms</label>
                  <AIButton label="Draft with AI" loading={loadingAI === 'scope'} onClick={handleAIDraft} />
                </div>
                <textarea
                  rows={6}
                  value={form.scopeOfWork}
                  onChange={e => set('scopeOfWork', e.target.value)}
                  placeholder="Describe services, or let AI draft the full contract scope..."
                />
                {form.scopeOfWork && (
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
                    <AIButton label="Rewrite Professionally" loading={loadingAI === 'rewrite'} onClick={() => handleAIRewrite('scopeOfWork', form.scopeOfWork)} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Total Value ({provider.currency})</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. 3 weeks" />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateContract(form, provider))} style={{ width: '100%', height: 48 }}>
            Refresh Preview
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
