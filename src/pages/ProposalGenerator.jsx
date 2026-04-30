import { useState, useEffect, useCallback } from 'react';
import DocOutput from '../components/DocOutput';
import { generateProposal } from '../utils/generators';

// ─── ICONS (SVG) ───────────────────────────────────────────

const Icons = {
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  ),
  Social: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Web: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Design: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  Marketing: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8l-4.4 4.6c-.8.7-1.2 1.7-1.2 2.8v4" />
      <path d="m19 13 2 2" />
    </svg>
  ),
  Chevron: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
};

// ─── DATA MAPS ──────────────────────────────────────────────

const PROJECT_TYPES = [
  'Video Production',
  'Social Media Content',
  'Branding',
  'Website / Web Design',
  'Marketing / Ads',
  'Retainer',
  'Custom Project'
];

const PROJECT_GOALS = {
  'Video Production': ['Advertisement', 'Brand Film', 'Product Showcase', 'Event Coverage'],
  'Social Media Content': ['Instagram Growth', 'Content Batch', 'Reels Package'],
  'Branding': ['Brand Identity', 'Rebranding', 'Logo & Guidelines', 'Brand Strategy'],
  'Website / Web Design': ['Landing Page', 'Portfolio Website', 'Business Website', 'E-commerce'],
  'Marketing / Ads': ['Lead Generation', 'Awareness Campaign', 'Product Launch', 'Performance Marketing'],
  'Retainer': ['Monthly Content', 'Ongoing Marketing', 'Design Support', 'Ad Management'],
  'Custom Project': ['Custom Goal']
};

const SCOPE_LEVELS = ['Starter', 'Standard', 'Advanced', 'Custom'];

const DELIVERABLE_TYPES = [
  { name: 'Videos', icon: <Icons.Video /> },
  { name: 'Reels', icon: <Icons.Social /> },
  { name: 'Posts', icon: <Icons.Social /> },
  { name: 'Website', icon: <Icons.Web /> },
  { name: 'Branding Kit', icon: <Icons.Design /> },
  { name: 'Ads Setup', icon: <Icons.Marketing /> },
  { name: 'Custom Item', icon: <Icons.Chevron /> }
];

const RECOMMENDED_DELIVERABLES = {
  'Video Production': 'Videos',
  'Social Media Content': 'Reels',
  'Branding': 'Branding Kit',
  'Website / Web Design': 'Website',
  'Marketing / Ads': 'Ads Setup',
  'Retainer': 'Custom Item',
  'Custom Project': 'Custom Item'
};

const SCOPE_DESCRIPTIONS = {
  'Video Production': {
    'Starter': 'Essential production covering core filming and basic editing.',
    'Standard': 'Comprehensive production including pre-production planning and multi-camera shoot.',
    'Advanced': 'Premium cinematic production with full crew and advanced lighting/post.',
    'Custom': 'Tailored production scope based on specific requirements.'
  },
  'Social Media Content': {
    'Starter': 'Basic content creation for organic growth.',
    'Standard': 'Strategic content batching with professional editing.',
    'Advanced': 'High-volume content engine with custom graphics and premium assets.',
    'Custom': 'Tailored social media scope.'
  },
  'Branding': {
    'Starter': 'Core brand identity: logo, color palette, and typography.',
    'Standard': 'Comprehensive branding with full visual identity and guidelines.',
    'Advanced': 'Complete brand ecosystem including deep strategy and collateral.',
    'Custom': 'Tailored branding scope.'
  },
  'Website / Web Design': {
    'Starter': 'Clean, responsive single-page or essential multi-page website.',
    'Standard': 'Custom designed multi-page website with CMS and SEO.',
    'Advanced': 'Bespoke web platform with advanced functionality and premium UI/UX.',
    'Custom': 'Tailored web development scope.'
  },
  'Marketing / Ads': {
    'Starter': 'Core ad campaign setup and management.',
    'Standard': 'Multi-channel strategy, creative production, and optimization.',
    'Advanced': 'Full-funnel strategy, high-end creatives, and deep analytics.',
    'Custom': 'Tailored marketing scope.'
  },
  'Retainer': {
    'Starter': 'Essential monthly support and maintenance.',
    'Standard': 'Proactive partnership with dedicated creative hours.',
    'Advanced': 'Comprehensive agency-of-record partnership.',
    'Custom': 'Tailored retainer scope.'
  },
  'Custom Project': {
    'Starter': 'Essential customized services.',
    'Standard': 'Comprehensive customized services.',
    'Advanced': 'Premium customized services.',
    'Custom': 'Tailored scope.'
  }
};


const TONE_CLOSINGS = {
  'Professional': (brand) => `We look forward to delivering exceptional results for your project.\n\n— ${brand}`,
  'Premium Agency': (brand) => `Thank you for considering ${brand}. We are committed to crafting work that exceeds expectations.\n\n— ${brand}`,
  'Friendly': (brand) => `Excited to work with you on this! Reach out with any questions.\n\n— ${brand}`,
  'Corporate': (brand) => `We appreciate the opportunity to submit this proposal. ${brand} remains committed to professional delivery.\n\n— ${brand}`,
};

const TONE_OPENERS = {
  'Professional': (brand, client) => `${brand} is pleased to present this proposal to ${client || 'your team'}.`,
  'Premium Agency': (brand, client) => `Thank you for choosing ${brand}. We have crafted this proposal specifically for ${client || 'your vision'}.`,
  'Friendly': (brand, client) => `Hey ${client || 'there'}! We're really excited about this project and put together everything you need to know right here.`,
  'Corporate': (brand, client) => `${brand} hereby presents the following proposal in response to the requirements outlined by ${client || 'your organization'}.`,
};

const DEFAULT_FORM = {
  brandName: '', preparedBy: '', brandTone: 'Professional',
  clientName: '', companyName: '', projectTitle: '',
  projectTypes: ['Video Production'], projectGoals: ['Advertisement'], scopeLevel: 'Standard',
  deliverablesList: [{ id: Date.now(), type: 'Videos', quantity: 1 }],
  duration: '2', durationUnit: 'weeks', revisions: '2',
  totalPrice: '', advancePercent: '50',
  notes: '',
};

// ─── COMPONENTS ──────────────────────────────────────────────

function Step({ number, title, active, onClick, children }) {
  return (
    <div className={`step-item ${active ? 'active' : ''}`}>
      <div className="step-header" onClick={onClick}>
        <div className="step-title">
          <div className="step-number">{number}</div>
          {title}
        </div>
        <Icons.Chevron />
      </div>
      <div className="step-content">
        {children}
      </div>
    </div>
  );
}

function ChipSelector({ options, value, onChange, isMulti }) {
  const handleClick = (opt) => {
    if (isMulti) {
      const current = Array.isArray(value) ? value : [value];
      if (current.includes(opt)) {
        if (current.length > 1) onChange(current.filter(i => i !== opt));
      } else {
        onChange([...current, opt]);
      }
    } else {
      onChange(opt);
    }
  };

  const isActive = (opt) => isMulti ? (Array.isArray(value) && value.includes(opt)) : (value === opt);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => handleClick(opt)} className={`chip-btn ${isActive(opt) ? 'active' : ''}`}>{opt}</button>
      ))}
    </div>
  );
}

// ─── BUILD ENGINE ────────────────────────────────────────────

function buildProposalData(form) {
  const currency = 'INR';
  const total = parseFloat(form.totalPrice) || 0;
  const advPct = parseFloat(form.advancePercent) || 50;
  const advance = (total * advPct) / 100;
  const balance = total - advance;

  const types = form.projectTypes;
  const goals = form.projectGoals;

  const opener = TONE_OPENERS[form.brandTone] || TONE_OPENERS['Professional'];
  const projectOverview = opener(form.brandName || 'Our Agency', form.clientName);

  const categories = {};
  form.deliverablesList.forEach(d => {
    if (!categories[d.type]) categories[d.type] = 0;
    categories[d.type] += d.quantity;
  });

  let delivHtml = '<div style="display:grid;gap:12px;">';
  Object.entries(categories).forEach(([type, qty]) => {
    delivHtml += `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f9f9f9;border-radius:8px;border:1px solid #eee;">
        <div>
          <div style="font-weight:700;font-size:14px;color:#111;">${qty} ${qty === 1 ? type.replace(/s$/, '') : type}</div>
          <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Deliverable Item</div>
        </div>
      </div>
    `;
  });
  delivHtml += '</div>';

  const scopeDescs = types.map(t => (SCOPE_DESCRIPTIONS[t] && SCOPE_DESCRIPTIONS[t][form.scopeLevel]) || 'Custom project scope.');
  const uniqueScopeDescs = Array.from(new Set(scopeDescs));
  const scopeText = uniqueScopeDescs.join(' ');

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const pricingHtml = `
    <div style="display:grid;gap:8px;max-width:300px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
        <span style="color:#666;">Total Investment</span>
        <span style="font-weight:800;color:#111;">${fmt(total)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
        <span style="color:#666;">Advance (${advPct}%)</span>
        <span style="font-weight:700;color:#111;">${fmt(advance)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;margin-top:4px;">
        <span style="font-weight:700;color:#111;">Remaining</span>
        <span style="font-weight:800;color:#000;">${fmt(balance)}</span>
      </div>
    </div>
  `;

  return {
    projectTitle: form.projectTitle,
    clientName: form.clientName,
    companyName: form.companyName,
    brandName: form.brandName,
    preparedBy: form.preparedBy,
    brandTone: form.brandTone,
    projectOverview,
    scopeOfWork: scopeText,
    deliverables: delivHtml,
    timeline: `${form.duration} ${form.durationUnit} from project kickoff`,
    revisionPolicy: `Includes ${form.revisions === 'Unlimited' ? 'unlimited' : form.revisions} rounds of revisions.`,
    pricing: pricingHtml,
    notes: form.notes,
    closingLine: (TONE_CLOSINGS[form.brandTone] || TONE_CLOSINGS['Professional'])(form.brandName || 'Our Agency'),
    projectType: types.join(', '),
    projectGoal: goals.join(', '),
    scopeLevel: form.scopeLevel,
  };
}

// ─── MAIN COMPONENT ──────────────────────────────────────────

export default function ProposalGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [activeStep, setActiveStep] = useState(1);
  const [mobileTab, setMobileTab] = useState('edit');
  const [doc, setDoc] = useState(null);
  const [provider] = useState(() => {
    try { return JSON.parse(localStorage.getItem('docmint_provider') || '{}'); } catch { return {}; }
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleProjectTypeChange = (types) => {
    const allAvailableGoals = types.flatMap(t => PROJECT_GOALS[t] || []);
    const newSelectedGoals = form.projectGoals.filter(g => allAvailableGoals.includes(g));
    if (newSelectedGoals.length === 0 && allAvailableGoals.length > 0) newSelectedGoals.push(allAvailableGoals[0]);
    setForm(f => ({ ...f, projectTypes: types, projectGoals: newSelectedGoals }));
  };

  const addDeliverable = () => {
    const firstType = form.projectTypes[0] || 'Video Production';
    const defaultType = RECOMMENDED_DELIVERABLES[firstType] || 'Videos';
    setForm(f => ({ ...f, deliverablesList: [...f.deliverablesList, { id: Date.now(), type: defaultType, quantity: 1 }] }));
  };

  const updateDeliverable = (id, field, value) => {
    setForm(f => ({ ...f, deliverablesList: f.deliverablesList.map(d => d.id === id ? { ...d, [field]: value } : d) }));
  };

  const removeDeliverable = (id) => {
    setForm(f => ({ ...f, deliverablesList: f.deliverablesList.filter(d => d.id !== id) }));
  };

  const proposalData = buildProposalData(form);
  useEffect(() => {
    if (form.clientName && form.projectTitle) setDoc(generateProposal(proposalData, provider));
  }, [form, provider]);

  const availableGoals = Array.from(new Set(form.projectTypes.flatMap(t => PROJECT_GOALS[t] || ['Custom Goal'])));

  return (
    <div className="fade-enter">
      <div className="mobile-view-tabs">
        <button className={`mobile-view-tab ${mobileTab === 'edit' ? 'active' : ''}`} onClick={() => setMobileTab('edit')}>Editor</button>
        <button className={`mobile-view-tab ${mobileTab === 'preview' ? 'active' : ''}`} onClick={() => setMobileTab('preview')}>Preview</button>
      </div>

      <div className="page-body">
        <div className="two-col-layout" style={{ gap: 32 }}>

          {/* ── FORM COL ── */}
          <div className="form-col" style={{ display: mobileTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', gap: 20 }}>
            
            <div className="step-accordion">
              <Step number="1" title="Client & Identity" active={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="form-grid" style={{ marginBottom: 20 }}>
                  <div className="form-group">
                    <label>Brand Name</label>
                    <input value={form.brandName} onChange={e => set('brandName', e.target.value)} placeholder="e.g. Studio Noir" />
                  </div>
                  <div className="form-group">
                    <label>Prepared By</label>
                    <input value={form.preparedBy} onChange={e => set('preparedBy', e.target.value)} placeholder="Your name" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Client Name*</label>
                    <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient name" />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Optional" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Project Title*</label>
                    <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Q4 Ad Campaign" />
                  </div>
                </div>
              </Step>

              <Step number="2" title="Project Setup" active={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label>Project Type</label>
                  <ChipSelector isMulti options={PROJECT_TYPES} value={form.projectTypes} onChange={handleProjectTypeChange} />
                </div>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label>Goals</label>
                  <ChipSelector isMulti options={availableGoals} value={form.projectGoals} onChange={v => set('projectGoals', v)} />
                </div>
                <div className="form-group">
                  <label>Scope Level</label>
                  <ChipSelector options={SCOPE_LEVELS} value={form.scopeLevel} onChange={v => set('scopeLevel', v)} />
                </div>
              </Step>

              <Step number="3" title="Deliverables" active={activeStep === 3} onClick={() => setActiveStep(3)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {form.deliverablesList.map((deliv) => {
                    const icon = DELIVERABLE_TYPES.find(t => t.name === deliv.type)?.icon || <Icons.Chevron />;
                    return (
                      <div key={deliv.id} className="deliverable-card">
                        <div className="deliv-icon" style={{ color: 'var(--accent)' }}>{icon}</div>
                        <div className="deliv-info">
                          <select 
                            value={deliv.type} 
                            onChange={(e) => updateDeliverable(deliv.id, 'type', e.target.value)} 
                            style={{ 
                              width: '100%',
                              padding: '6px 12px',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              appearance: 'auto'
                            }}
                          >
                            {DELIVERABLE_TYPES.map(t => <option key={t.name}>{t.name}</option>)}
                          </select>
                        </div>
                        <div className="deliv-controls">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 6, padding: '2px 8px' }}>
                            <button onClick={() => updateDeliverable(deliv.id, 'quantity', Math.max(1, deliv.quantity - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px' }}>-</button>
                            <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{deliv.quantity}</span>
                            <button onClick={() => updateDeliverable(deliv.id, 'quantity', deliv.quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px' }}>+</button>
                          </div>
                          <div className="deliv-remove" onClick={() => removeDeliverable(deliv.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button className="btn btn-outline" onClick={addDeliverable} style={{ width: '100%', borderStyle: 'dashed' }}>+ Add Item</button>
                </div>
              </Step>

              <Step number="4" title="Timeline & Revisions" active={activeStep === 4} onClick={() => setActiveStep(4)}>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label>Duration</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} style={{ width: 80 }} />
                    <select value={form.durationUnit} onChange={e => set('durationUnit', e.target.value)} style={{ flex: 1 }}>
                      {['days', 'weeks', 'months'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Revisions</label>
                  <ChipSelector options={['1', '2', '3', 'Unlimited']} value={form.revisions} onChange={v => set('revisions', v)} />
                </div>
              </Step>

              <Step number="5" title="Investment" active={activeStep === 5} onClick={() => setActiveStep(5)}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Total Price (INR)</label>
                    <input type="number" value={form.totalPrice} onChange={e => set('totalPrice', e.target.value)} placeholder="e.g. 50000" />
                  </div>
                  <div className="form-group">
                    <label>Advance %</label>
                    <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
                  </div>
                </div>
              </Step>

              <Step number="6" title="Additional Notes" active={activeStep === 6} onClick={() => setActiveStep(6)}>
                <div className="form-group">
                  <label>Exclusions & Terms</label>
                  <textarea rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any specific terms..." />
                </div>
              </Step>
            </div>
            
            <button className="btn btn-primary" style={{ height: 48, borderRadius: 12 }} disabled={!form.clientName || !form.projectTitle} onClick={() => setDoc(generateProposal(proposalData, provider))}>Generate Proposal</button>
          </div>

          {/* ── PREVIEW COL ── */}
          <div className="preview-panel" style={{ display: mobileTab === 'preview' ? 'block' : 'none' }}>
            {doc ? <DocOutput type="Proposal" html={doc.html} text={doc.text} /> : (
              <div className="card" style={{ height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', borderStyle: 'dashed', borderRadius: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <div style={{ fontWeight: 600 }}>Fill required fields to preview</div>
              </div>
            )}

            <div className="card" style={{ marginTop: 24, borderRadius: 16 }}>
              <div className="card-title">Live Summary</div>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-label">Types</div>
                  <div className="summary-value">{form.projectTypes.join(', ')}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Deliverables</div>
                  <div className="summary-value">{form.deliverablesList.length} Items</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Timeline</div>
                  <div className="summary-value">{form.duration} {form.durationUnit}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Price</div>
                  <div className="summary-value">{form.totalPrice ? `₹${parseInt(form.totalPrice).toLocaleString()}` : '—'}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
