import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import { generateProposal } from '../utils/generators';

const PROJECT_TYPES = [
  'Video Production',
  'Commercial / Ad Shoot',
  'Social Media Content',
  'Brand Film',
  'Event Coverage',
  'Photography',
  'Post-Production / Editing',
];

const TONES = ['Formal', 'Premium', 'Friendly'];

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
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
  revisions: '2',
  includeExclusions: true,
  includeAddons: false,
  tone: 'Premium',
};

export default function ProposalGenerator() {
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
    if (form.clientName && form.projectTitle) {
      setDoc(generateProposal(form, provider));
    }
  }, [form, provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setProv = (k, v) => setProvider(p => ({ ...p, [k]: v }));

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Your Info</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name / Company</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={provider.email} onChange={e => setProv('email', e.target.value)} placeholder="your@email.com" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">2. Client Details</div>
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
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Brand Film 2025" />
              </div>
              <div className="form-group full">
                <label>Project Goal</label>
                <textarea rows={2} value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} placeholder="Main objective?" />
              </div>
              <div className="form-group full">
                <label>Additional Scope Details (Optional)</label>
                <textarea rows={3} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="Any specific deliverables..." />
              </div>
              <div className="form-group">
                <label>Timeline (Optional Override)</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Leave blank for auto-calc" />
              </div>
              <div className="form-group">
                <label>Budget (₹)</label>
                <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">4. Advanced Options</div>
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Include Exclusions</div>
              </div>
              <Toggle checked={form.includeExclusions} onChange={v => set('includeExclusions', v)} />
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateProposal(form, provider))} style={{ width: '100%', height: 48 }}>
            Refresh Proposal Preview
          </button>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Live Proposal Preview</div>
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
