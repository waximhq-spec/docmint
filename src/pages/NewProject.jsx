import { useState, useEffect } from 'react';
import Toggle from '../components/Toggle';
import Tabs from '../components/Tabs';
import DocOutput from '../components/DocOutput';
import {
  generateProposal,
  generateContract,
  generateInvoice,
  generateClientBrief,
} from '../utils/generators';
import { getNextInvoiceNumber } from '../utils/helpers';

const PROJECT_TYPES = ['Video Production', 'Website Development', 'Solar Installation'];

const DEFAULT_PROVIDER = {
  name: '',
  email: '',
  address: '',
  phone: '',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  email: '',
  projectType: 'Video Production',
  projectTitle: '',
  scopeOfWork: '',
  timeline: '',
  totalPrice: '',
  advancePercent: '50',
  revisions: '2',
  includeOwnership: true,
  includeMaintenance: false,
};

export default function NewProject() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [provider, setProvider] = useState(() => {
    // If the saved provider contains "Wasim", we force clear it to be blank
    const saved = localStorage.getItem('docmint_provider');
    if (saved && (saved.includes('Wasim') || saved.includes('Cinmach'))) {
      localStorage.removeItem('docmint_provider');
      return DEFAULT_PROVIDER;
    }
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  
  const [docs, setDocs] = useState(null);
  const [briefAnswers, setBriefAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
  }, [provider]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setProv = (key, val) => setProvider(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.projectTitle.trim()) e.projectTitle = 'Required';
    if (!form.scopeOfWork.trim()) e.scopeOfWork = 'Required';
    if (!form.timeline.trim()) e.timeline = 'Required';
    if (!form.totalPrice || isNaN(parseFloat(form.totalPrice))) e.totalPrice = 'Enter a valid amount';
    if (!provider.name.trim()) e.providerName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const advInvNum = getNextInvoiceNumber();
    const finInvNum = getNextInvoiceNumber();
    
    setDocs({
      proposal: generateProposal(form, provider),
      contract: generateContract(form, provider),
      advanceInvoice: generateInvoice(form, 'advance', advInvNum, provider),
      finalInvoice: generateInvoice(form, 'final', finInvNum, provider),
      briefFields: generateClientBrief(form),
    });
    setBriefAnswers({});
    setTimeout(() => {
      document.getElementById('doc-output-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const briefFields = generateClientBrief(form);

  const briefHtml = docs
    ? `<div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <h2 style="font-size:22px;font-weight:800;margin-bottom:6px;">Client Brief</h2>
        <p style="font-size:13px;color:#888;margin-bottom:32px;">${form.projectType} · ${form.projectTitle}</p>
        ${briefFields.map(f => `
          <div style="margin-bottom:20px;padding:16px;border:1px solid #e5e5e5;border-radius:10px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;margin-bottom:6px;">${f.label}</div>
            <div style="font-size:14px;color:#111;min-height:24px;">${briefAnswers[f.key] || '<span style="color:#aaa">Not filled</span>'}</div>
          </div>
        `).join('')}
      </div>`
    : '';

  const briefText = docs
    ? `CLIENT BRIEF — ${form.projectTitle}\n\n${briefFields.map(f => `${f.label}:\n${briefAnswers[f.key] || '—'}`).join('\n\n')}`
    : '';

  return (
    <div className="page-body fade-enter">

      {/* Provider Info */}
      <div className="card">
        <div className="card-title">Provided By (Your Identity)</div>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>This name will appear as the Service Provider on all generated documents.</p>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="np-prov-name">Your Name / Company Name *</label>
            <input
              id="np-prov-name"
              value={provider.name}
              onChange={e => setProv('name', e.target.value)}
              placeholder="e.g. Your Name or Agency Name"
              style={errors.providerName ? { borderColor: '#c00' } : {}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="np-prov-email">Your Email</label>
            <input
              id="np-prov-email"
              value={provider.email}
              onChange={e => setProv('email', e.target.value)}
              placeholder="name@email.com"
            />
          </div>
          <div className="form-group full">
            <label htmlFor="np-prov-address">Your Address / Location</label>
            <input
              id="np-prov-address"
              value={provider.address}
              onChange={e => setProv('address', e.target.value)}
              placeholder="e.g. City, Country"
            />
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="card">
        <div className="card-title">Client Info</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="np-clientName">Client Name *</label>
            <input
              id="np-clientName"
              value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="Enter client name"
              style={errors.clientName ? { borderColor: '#c00' } : {}}
            />
            {errors.clientName && <span style={{ color: '#c00', fontSize: 11 }}>{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="np-companyName">Company Name</label>
            <input
              id="np-companyName"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="form-group">
            <label htmlFor="np-email">Email (optional)</label>
            <input
              id="np-email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="client@email.com"
            />
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="card">
        <div className="card-title">Project Info</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="np-projectType">Project Type</label>
            <select id="np-projectType" value={form.projectType} onChange={e => set('projectType', e.target.value)}>
              {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="np-projectTitle">Project Title *</label>
            <input
              id="np-projectTitle"
              value={form.projectTitle}
              onChange={e => set('projectTitle', e.target.value)}
              placeholder="e.g. Website Redesign"
              style={errors.projectTitle ? { borderColor: '#c00' } : {}}
            />
            {errors.projectTitle && <span style={{ color: '#c00', fontSize: 11 }}>{errors.projectTitle}</span>}
          </div>
          <div className="form-group full">
            <label htmlFor="np-scope">Scope of Work *</label>
            <textarea
              id="np-scope"
              value={form.scopeOfWork}
              onChange={e => set('scopeOfWork', e.target.value)}
              placeholder="Describe deliverables in detail..."
              rows={4}
              style={errors.scopeOfWork ? { borderColor: '#c00' } : {}}
            />
            {errors.scopeOfWork && <span style={{ color: '#c00', fontSize: 11 }}>{errors.scopeOfWork}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="np-timeline">Timeline *</label>
            <input
              id="np-timeline"
              value={form.timeline}
              onChange={e => set('timeline', e.target.value)}
              placeholder="e.g. 2 weeks"
              style={errors.timeline ? { borderColor: '#c00' } : {}}
            />
            {errors.timeline && <span style={{ color: '#c00', fontSize: 11 }}>{errors.timeline}</span>}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="card">
        <div className="card-title">Pricing</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="np-totalPrice">Total Price (₹) *</label>
            <input
              id="np-totalPrice"
              type="number"
              value={form.totalPrice}
              onChange={e => set('totalPrice', e.target.value)}
              placeholder="Enter amount"
              style={errors.totalPrice ? { borderColor: '#c00' } : {}}
            />
            {errors.totalPrice && <span style={{ color: '#c00', fontSize: 11 }}>{errors.totalPrice}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="np-advance">Advance Percentage (%)</label>
            <input
              id="np-advance"
              type="number"
              min="1"
              max="100"
              value={form.advancePercent}
              onChange={e => set('advancePercent', e.target.value)}
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Extra Settings */}
      <div className="card">
        <div className="card-title">Extra Settings</div>
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <div className="form-group">
            <label htmlFor="np-revisions">Number of Revisions</label>
            <input
              id="np-revisions"
              type="number"
              min="0"
              value={form.revisions}
              onChange={e => set('revisions', e.target.value)}
              placeholder="2"
            />
          </div>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <div className="toggle-label">Ownership Rights Clause</div>
            <div className="toggle-desc">Include IP transfer clause in contract & proposal</div>
          </div>
          <Toggle
            id="toggle-ownership"
            checked={form.includeOwnership}
            onChange={v => set('includeOwnership', v)}
          />
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <div className="toggle-label">Maintenance / Support Offer</div>
            <div className="toggle-desc">Include 30-day post-delivery support clause</div>
          </div>
          <Toggle
            id="toggle-maintenance"
            checked={form.includeMaintenance}
            onChange={v => set('includeMaintenance', v)}
          />
        </div>
      </div>

      <div className="generate-row">
        <button className="btn btn-primary" onClick={handleGenerate} id="btn-generate-docs">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          Generate Documents
        </button>
      </div>

      {/* Output Tabs */}
      {docs && (
        <div id="doc-output-section">
          <Tabs
            tabs={[
              {
                label: '📄 Proposal',
                content: <DocOutput type="Proposal" html={docs.proposal.html} text={docs.proposal.text} />,
              },
              {
                label: '📝 Contract',
                content: <DocOutput type="Contract" html={docs.contract.html} text={docs.contract.text} />,
              },
              {
                label: '🧾 Advance Invoice',
                content: <DocOutput type="Advance Invoice" html={docs.advanceInvoice.html} text={docs.advanceInvoice.text} />,
              },
              {
                label: '🧾 Final Invoice',
                content: <DocOutput type="Final Invoice" html={docs.finalInvoice.html} text={docs.finalInvoice.text} />,
              },
              {
                label: '📋 Client Brief',
                content: (
                  <div>
                    <div className="card" style={{ marginBottom: 20 }}>
                      <div className="card-title">Fill Client Brief — {form.projectType}</div>
                      <div className="brief-grid">
                        {docs.briefFields.map(f => (
                          <div className="form-group" key={f.key}>
                            <label htmlFor={`brief-${f.key}`}>{f.label}</label>
                            <textarea
                              id={`brief-${f.key}`}
                              rows={2}
                              value={briefAnswers[f.key] || ''}
                              onChange={e => setBriefAnswers(a => ({ ...a, [f.key]: e.target.value }))}
                              placeholder={f.placeholder}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <DocOutput
                      type="Client Brief"
                      html={briefHtml}
                      text={briefText}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
