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
  scopeOfWork: '',
  timeline: '',
  paymentTerms: '',
  intellectualProperty: '',
  cancellationPolicy: '',
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
    if (form.clientName && form.projectTitle) {
      setDoc(generateContract(form, provider));
    }
  }, [form, provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAIPolish = async (field, text) => {
    if (!text.trim()) return;
    setLoadingAI(field);
    const result = await generateWithAI(
      `Polish this text for a professional agency contract. Make it legally clear, concise, and professional. Return ONLY the polished text:\n\n"${text}"`
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
            <div className="card-title">Document Content</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Contract Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Service Agreement" />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>1. Scope of Work</label>
                  <AIButton label="Polish" loading={loadingAI === 'scopeOfWork'} onClick={() => handleAIPolish('scopeOfWork', form.scopeOfWork)} />
                </div>
                <textarea rows={4} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="Describe the services to be rendered..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>2. Timeline</label>
                  <AIButton label="Polish" loading={loadingAI === 'timeline'} onClick={() => handleAIPolish('timeline', form.timeline)} />
                </div>
                <textarea rows={2} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Timeframes and milestones..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>3. Payment Terms</label>
                  <AIButton label="Polish" loading={loadingAI === 'paymentTerms'} onClick={() => handleAIPolish('paymentTerms', form.paymentTerms)} />
                </div>
                <textarea rows={3} value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} placeholder="Fees, payment schedule, and late fees..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>4. Intellectual Property</label>
                  <AIButton label="Polish" loading={loadingAI === 'intellectualProperty'} onClick={() => handleAIPolish('intellectualProperty', form.intellectualProperty)} />
                </div>
                <textarea rows={3} value={form.intellectualProperty} onChange={e => set('intellectualProperty', e.target.value)} placeholder="Who owns what and when..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>5. Cancellation Policy</label>
                  <AIButton label="Polish" loading={loadingAI === 'cancellationPolicy'} onClick={() => handleAIPolish('cancellationPolicy', form.cancellationPolicy)} />
                </div>
                <textarea rows={3} value={form.cancellationPolicy} onChange={e => set('cancellationPolicy', e.target.value)} placeholder="What happens if the project is cancelled..." />
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
