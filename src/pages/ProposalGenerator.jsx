import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import LocationInput from '../components/LocationInput';
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

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
  address: '',
  currency: 'INR',
};

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
  tone: 'Premium',
};

export default function ProposalGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loadingAI, setLoadingAI] = useState(null); // 'scope' | 'goal' | 'rewrite'
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
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
    setLoadingAI('scope');
    const prompt = `Create a professional, highly detailed scope of work for a ${form.serviceType} project titled "${form.projectTitle}". 
    Project Goal: ${form.projectGoal}. 
    Budget: ${provider.currency} ${form.budget}. 
    Timeline: ${form.timeline}.
    Provide a list of deliverables and phases in professional agency language. Keep it concise but premium. No conversational text, just the scope.`;
    
    const result = await generateWithAI(prompt);
    set('scopeOfWork', result);
    setLoadingAI(null);
  };

  const handleAIRewrite = async (field, currentText) => {
    if (!currentText) return;
    setLoadingAI(field);
    const prompt = `Rewrite the following text for a professional agency proposal. Make it sound more premium, clear, and persuasive, but keep the original meaning:
    "${currentText}"`;
    
    const result = await generateWithAI(prompt);
    set(field, result);
    setLoadingAI(null);
  };

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div className="card-title">Project Context</div>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Using global settings for <strong>{provider.name || 'Your Agency'}</strong> in <strong>{provider.currency}</strong>.</p>
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
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: 10, height: 'auto' }}
                    onClick={() => handleAIRewrite('projectGoal', form.projectGoal)}
                    disabled={loadingAI === 'projectGoal'}
                  >
                    {loadingAI === 'projectGoal' ? '✨ Processing...' : '✨ Polish with AI'}
                  </button>
                </div>
                <textarea rows={2} value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} placeholder="Main objective?" />
              </div>

              <div className="form-group full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>Scope of Work</label>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: 10, height: 'auto' }}
                    onClick={handleAIScope}
                    disabled={loadingAI === 'scope'}
                  >
                    {loadingAI === 'scope' ? '✨ Drafting...' : '✨ Generate with AI'}
                  </button>
                </div>
                <textarea rows={6} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="List specific items or use AI to draft them..." />
              </div>

              <div className="form-group">
                <label>Budget ({provider.currency})</label>
                <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Timeline Override</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. 4 weeks" />
              </div>
              <div className="form-group">
                <label>Revision Rounds (Optional)</label>
                <input type="number" value={form.revisions} onChange={e => set('revisions', e.target.value)} placeholder="Leave blank to hide" />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateProposal(form, provider))} style={{ width: '100%', height: 48 }}>
            Refresh Preview
          </button>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Preview ({provider.currency})</div>
          {doc ? (
            <DocOutput type="Proposal" html={doc.html} text={doc.text} />
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
