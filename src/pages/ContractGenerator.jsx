import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import { generateContract } from '../utils/generators';

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
  address: '',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  projectTitle: '',
  totalPrice: '',
  timeline: '',
};

export default function ContractGenerator() {
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
    if (!form.projectTitle.trim()) e.projectTitle = 'Required';
    if (!form.totalPrice.trim()) e.totalPrice = 'Required';
    if (!provider.name.trim()) e.providerName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    
    const projectData = {
      ...form,
      projectType: 'Service',
      advancePercent: '50',
      scopeOfWork: 'As per discussion.',
      revisions: '2',
      includeOwnership: true,
      includeMaintenance: false,
    };

    const result = generateContract(projectData, provider);
    setDoc(result);
  };

  return (
    <div className="page-body fade-enter">
      {/* Provider Info */}
      <div className="card">
        <div className="card-title">Provided By</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cont-prov-name">Your Name / Company Name *</label>
            <input
              id="cont-prov-name"
              value={provider.name}
              onChange={e => setProv('name', e.target.value)}
              placeholder="e.g. Wasim Fayaz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cont-prov-email">Your Email</label>
            <input
              id="cont-prov-email"
              value={provider.email}
              onChange={e => setProv('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Contract Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cont-client">Client Name *</label>
            <input
              id="cont-client"
              value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              style={errors.clientName ? { borderColor: '#c00' } : {}}
            />
            {errors.clientName && <span style={{ color: '#c00', fontSize: 11 }}>{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cont-company">Company Name</label>
            <input
              id="cont-company"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="form-group full">
            <label htmlFor="cont-title">Project Title *</label>
            <input
              id="cont-title"
              value={form.projectTitle}
              onChange={e => set('projectTitle', e.target.value)}
              placeholder="e.g. Website Redesign"
              style={errors.projectTitle ? { borderColor: '#c00' } : {}}
            />
            {errors.projectTitle && <span style={{ color: '#c00', fontSize: 11 }}>{errors.projectTitle}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cont-price">Total Price (₹) *</label>
            <input
              id="cont-price"
              value={form.totalPrice}
              onChange={e => set('totalPrice', e.target.value)}
              placeholder="e.g. 50000"
              style={errors.totalPrice ? { borderColor: '#c00' } : {}}
            />
            {errors.totalPrice && <span style={{ color: '#c00', fontSize: 11 }}>{errors.totalPrice}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cont-timeline">Timeline *</label>
            <input
              id="cont-timeline"
              value={form.timeline}
              onChange={e => set('timeline', e.target.value)}
              placeholder="e.g. 1 month"
            />
          </div>
        </div>
        <div className="generate-row">
          <button className="btn btn-primary" onClick={handleGenerate} id="btn-generate-contract">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Generate Contract
          </button>
        </div>
      </div>

      {doc && (
        <div className="fade-enter" style={{ marginTop: 24 }}>
          <DocOutput type="Contract" html={doc.html} text={doc.text} />
        </div>
      )}
    </div>
  );
}
