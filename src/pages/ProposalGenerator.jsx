import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import { generateProposal } from '../utils/generators';
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
  projectOverview: '',
  scopeOfWork: '',
  deliverables: '',
  timeline: '',
  pricing: '',
  revisionPolicy: '',
  notes: '',
};

function AIButton({ label, loading, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
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
        transition: 'all 0.2s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? '⏳ Generating...' : `✨ ${label}`}
    </button>
  );
}

export default function ProposalGenerator() {
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
      setDoc(generateProposal(form, provider));
    }
  }, [form, provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAIPolish = async (field, text) => {
    if (!text.trim()) return;
    setLoadingAI(field);
    const result = await generateWithAI(
      `Polish this text for a professional agency proposal. Make it sound premium and clear. Return ONLY the polished text:\n\n"${text}"`
    );
    set(field, result);
    setLoadingAI(null);
  };

  const handleAIRewrite = async (field, text) => {
    if (!text.trim()) return;
    setLoadingAI(field);
    const result = await generateWithAI(
      `Rewrite this in a more professional, clear, and premium agency tone. Return only the rewritten text with no preamble:

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
              <div className="card-title" style={{ margin: 0 }}>Project Context</div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: '#f0f0ff', color: '#6366f1', border: '1px solid #e0e0ff' }}>✨ AI POWERED</span>
            </div>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
              Agency: <strong>{provider.name || 'Not set'}</strong> · Currency: <strong>{provider.currency}</strong>
            </p>
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

          <div className="card">
            <div className="card-title">Document Content</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Project Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Brand Film 2025" />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>1. Project Overview</label>
                  <AIButton label="Polish" loading={loadingAI === 'projectOverview'} onClick={() => handleAIPolish('projectOverview', form.projectOverview)} />
                </div>
                <textarea rows={3} value={form.projectOverview} onChange={e => set('projectOverview', e.target.value)} placeholder="High level summary of the project goals..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>2. Scope of Work</label>
                  <AIButton label="Polish" loading={loadingAI === 'scopeOfWork'} onClick={() => handleAIPolish('scopeOfWork', form.scopeOfWork)} />
                </div>
                <textarea rows={4} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="What exactly will you be doing?..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>3. Deliverables</label>
                  <AIButton label="Polish" loading={loadingAI === 'deliverables'} onClick={() => handleAIPolish('deliverables', form.deliverables)} />
                </div>
                <textarea rows={3} value={form.deliverables} onChange={e => set('deliverables', e.target.value)} placeholder="List of tangible assets to be delivered..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>4. Timeline</label>
                  <AIButton label="Polish" loading={loadingAI === 'timeline'} onClick={() => handleAIPolish('timeline', form.timeline)} />
                </div>
                <textarea rows={2} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Key phases and dates..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>5. Pricing</label>
                  <AIButton label="Polish" loading={loadingAI === 'pricing'} onClick={() => handleAIPolish('pricing', form.pricing)} />
                </div>
                <textarea rows={2} value={form.pricing} onChange={e => set('pricing', e.target.value)} placeholder="Total cost and payment milestones..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>6. Revision Policy</label>
                  <AIButton label="Polish" loading={loadingAI === 'revisionPolicy'} onClick={() => handleAIPolish('revisionPolicy', form.revisionPolicy)} />
                </div>
                <textarea rows={2} value={form.revisionPolicy} onChange={e => set('revisionPolicy', e.target.value)} placeholder="How many rounds of revisions are included?..." />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>7. Notes / Exclusions</label>
                  <AIButton label="Polish" loading={loadingAI === 'notes'} onClick={() => handleAIPolish('notes', form.notes)} />
                </div>
                <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything explicitly NOT included..." />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setDoc(generateProposal(form, provider))} style={{ flex: 1, height: 48 }}>
              Refresh Preview
            </button>

          </div>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Preview ({provider.currency})</div>
          {doc ? (
            <DocOutput type="Proposal" html={doc.html} text={doc.text} />
          ) : (
            <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Fill details to see live preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
