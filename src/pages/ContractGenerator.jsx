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

function AIButton({ label, loading, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="btn btn-outline btn-sm"
      style={{
        padding: '2px 8px',
        fontSize: '10px',
        height: '24px',
        minHeight: 'unset',
        borderColor: 'var(--border)',
        color: 'var(--text-secondary)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
      }}
    >
      {loading ? '...' : label}
    </button>
  );
}

export default function ContractGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loadingAI, setLoadingAI] = useState(null);
  const [mobileTab, setMobileTab] = useState('edit');
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
    <div className="fade-enter">
      <div className="mobile-view-tabs">
        <button className={`mobile-view-tab ${mobileTab === 'edit' ? 'active' : ''}`} onClick={() => setMobileTab('edit')}>Editor</button>
        <button className={`mobile-view-tab ${mobileTab === 'preview' ? 'active' : ''}`} onClick={() => setMobileTab('preview')}>Preview</button>
      </div>

      <div className="page-body">
        <div className="two-col-layout">
          <div className="form-col" style={{ display: mobileTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', gap: 20 }}>
          
          <div className="card">
            <div className="card-title">Agreement Context</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient Legal Name" />
              </div>
              <div className="form-group">
                <label>Company Entity</label>
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Company Name" />
              </div>
              <div className="form-group full">
                <label>Contract Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Master Service Agreement" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Legal Provisions</div>
            <div className="form-grid">
              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label>1. Scope of Work</label>
                  <AIButton label="Polish" loading={loadingAI === 'scopeOfWork'} onClick={() => handleAIPolish('scopeOfWork', form.scopeOfWork)} />
                </div>
                <textarea rows={4} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="Services to be provided..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label>2. Timeline</label>
                  <AIButton label="Polish" loading={loadingAI === 'timeline'} onClick={() => handleAIPolish('timeline', form.timeline)} />
                </div>
                <textarea rows={2} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Delivery schedule..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label>3. Payment Terms</label>
                  <AIButton label="Polish" loading={loadingAI === 'paymentTerms'} onClick={() => handleAIPolish('paymentTerms', form.paymentTerms)} />
                </div>
                <textarea rows={3} value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)} placeholder="Fees and schedule..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label>4. Intellectual Property</label>
                  <AIButton label="Polish" loading={loadingAI === 'intellectualProperty'} onClick={() => handleAIPolish('intellectualProperty', form.intellectualProperty)} />
                </div>
                <textarea rows={3} value={form.intellectualProperty} onChange={e => set('intellectualProperty', e.target.value)} placeholder="Rights and ownership..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label>5. Cancellation</label>
                  <AIButton label="Polish" loading={loadingAI === 'cancellationPolicy'} onClick={() => handleAIPolish('cancellationPolicy', form.cancellationPolicy)} />
                </div>
                <textarea rows={3} value={form.cancellationPolicy} onChange={e => set('cancellationPolicy', e.target.value)} placeholder="Termination conditions..." />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateContract(form, provider))} style={{ width: '100%', height: 44 }}>
            Finalize Contract
          </button>
          </div>

          <div className="preview-panel" style={{ display: mobileTab === 'preview' ? 'block' : 'none' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'var(--text-tertiary)', marginBottom: 8, display: 'block' }}>Legal Document Preview</label>
            </div>
            {doc ? (
              <DocOutput type="Contract" html={doc.html} text={doc.text} />
            ) : (
              <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', borderStyle: 'dashed' }}>
                Fill details to generate document
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
