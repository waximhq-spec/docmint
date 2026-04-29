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
  serviceType: 'Video Production',
  projectTitle: '',
  projectGoal: '',
  scopeOfWork: '',
  timeline: '',
  budget: '',
  revisions: '',
  includeExclusions: true,
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

  const handleAIScope = async () => {
    if (!form.scopeOfWork.trim()) {
      // If empty, generate a draft based on context
      setLoadingAI('scope');
      const result = await generateWithAI(
        `Draft a professional scope of work for a ${form.serviceType} project titled "${form.projectTitle}". Use bullet points.`
      );
      set('scopeOfWork', result);
      setLoadingAI(null);
      return;
    }

    setLoadingAI('scope');
    const result = await generateWithAI(
      `Polish and expand the following scope of work for a professional creative agency proposal. 
      Keep the original meaning but make it sound more premium, clear, and structured with bullet points:

      "${form.scopeOfWork}"`
    );
    set('scopeOfWork', result);
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

  const handleImproveProposal = async () => {
    if (!doc?.text) return;
    setLoadingAI('improve');
    const result = await generateWithAI(
      `Rewrite this proposal in a more professional, premium, and client-ready tone.

Keep it concise and structured. Avoid generic wording:

${doc.text}`
    );
    set('projectGoal', result);
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
            <div className="card-title">Project Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Type</label>
                <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Project Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Brand Film 2025" />
              </div>
              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>Project Goal</label>
                  <AIButton label="Polish with AI" loading={loadingAI === 'projectGoal'} onClick={() => handleAIRewrite('projectGoal', form.projectGoal)} />
                </div>
                <textarea rows={2} value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} placeholder="Describe your main objective..." />
              </div>
              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>Scope of Work</label>
                  <AIButton label="Polish with AI" loading={loadingAI === 'scope'} onClick={handleAIScope} />
                </div>
                <textarea rows={7} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="List specific deliverables, or let AI generate a full scope..." />
              </div>
              <div className="form-group">
                <label>Budget ({provider.currency})</label>
                <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. 4 weeks" />
              </div>
              <div className="form-group">
                <label>Revision Rounds (Optional)</label>
                <input type="number" value={form.revisions} onChange={e => set('revisions', e.target.value)} placeholder="Leave blank to hide" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => setDoc(generateProposal(form, provider))} style={{ flex: 1, height: 48 }}>
              Refresh Preview
            </button>
            <button
              onClick={handleImproveProposal}
              disabled={loadingAI === 'improve' || !doc}
              style={{
                height: 48,
                padding: '0 20px',
                border: '2px solid #6366f1',
                borderRadius: 12,
                background: '#fff',
                color: '#6366f1',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {loadingAI === 'improve' ? '⏳ Improving...' : '✨ Improve Proposal'}
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
