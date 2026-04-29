import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import { generateProposal } from '../utils/generators';

const SERVICE_TYPES = [
  'Video Production',
  'Website Development',
  'Solar Installation',
  'Branding & Design',
  'Social Media Management',
  'Photography',
  'Other',
];

const DEFAULT_PROVIDER = {
  name: 'Wasim Fayaz',
  email: 'wasim@example.com',
  address: 'Kashmir, India',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  serviceType: 'Video Production',
  budget: '',
  timeline: '',
  notes: '',
};

export default function ProposalGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  const [doc, setDoc] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
  }, [provider]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setProv = (k, v) => setProvider(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.budget.trim()) e.budget = 'Required';
    if (!form.timeline.trim()) e.timeline = 'Required';
    if (!provider.name.trim()) e.providerName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    
    const projectData = {
      projectTitle: `${form.serviceType} Services`,
      projectType: form.serviceType,
      clientName: form.clientName,
      companyName: form.companyName,
      totalPrice: form.budget.replace(/[^0-9]/g, ''), // Rough estimation for summary
      advancePercent: '50',
      timeline: form.timeline,
      scopeOfWork: form.notes || 'As discussed.',
      revisions: '2',
      includeOwnership: true,
      includeMaintenance: false,
    };

    const result = generateProposal(projectData, provider);
    setDoc(result);
  };

  return (
    <div className="page-body fade-enter">
      {/* Provider Info */}
      <div className="card">
        <div className="card-title">Provided By</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="prop-prov-name">Your Name / Company Name *</label>
            <input
              id="prop-prov-name"
              value={provider.name}
              onChange={e => setProv('name', e.target.value)}
              placeholder="e.g. Wasim Fayaz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="prop-prov-email">Your Email</label>
            <input
              id="prop-prov-email"
              value={provider.email}
              onChange={e => setProv('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Proposal Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="prop-client">Client Name *</label>
            <input
              id="prop-client"
              value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="e.g. Priya Singh"
              style={errors.clientName ? { borderColor: '#c00' } : {}}
            />
            {errors.clientName && <span style={{ color: '#c00', fontSize: 11 }}>{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="prop-company">Company Name</label>
            <input
              id="prop-company"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="form-group">
            <label htmlFor="prop-service">Service Type</label>
            <select id="prop-service" value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
              {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="prop-budget">Budget *</label>
            <input
              id="prop-budget"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              placeholder="e.g. ₹50,000"
              style={errors.budget ? { borderColor: '#c00' } : {}}
            />
            {errors.budget && <span style={{ color: '#c00', fontSize: 11 }}>{errors.budget}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="prop-timeline">Timeline *</label>
            <input
              id="prop-timeline"
              value={form.timeline}
              onChange={e => set('timeline', e.target.value)}
              placeholder="e.g. 3 weeks"
              style={errors.timeline ? { borderColor: '#c00' } : {}}
            />
            {errors.timeline && <span style={{ color: '#c00', fontSize: 11 }}>{errors.timeline}</span>}
          </div>
          <div className="form-group full">
            <label htmlFor="prop-notes">Additional Notes</label>
            <textarea
              id="prop-notes"
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any specific requirements..."
            />
          </div>
        </div>
        <div className="generate-row">
          <button className="btn btn-primary" onClick={handleGenerate} id="btn-generate-proposal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            Generate Proposal
          </button>
        </div>
      </div>

      {doc && (
        <div className="fade-enter" style={{ marginTop: 24 }}>
          <DocOutput type="Proposal" html={doc.html} text={doc.text} />
        </div>
      )}
    </div>
  );
}
