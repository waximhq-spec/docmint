import { useState, useEffect } from 'react';
import DocOutput from '../components/DocOutput';
import { generateProposal } from '../utils/generators';
import { generateWithAI } from '../utils/ai';

const SERVICE_TYPES = ['Video Editing', 'Video Shoot', 'Shoot + Editing'];
const PROJECT_TYPES = ['Advertisement', 'Social Media Content', 'Brand Film', 'Event'];
const QUALITY_TIERS = ['Basic', 'Standard', 'Premium'];
const DURATION_UNITS = ['days', 'weeks', 'months'];
const REVISION_OPTIONS = ['1', '2', '3', 'Unlimited'];

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  projectTitle: '',
  // Structured Inputs
  serviceType: 'Shoot + Editing',
  quantity: '3',
  projectType: 'Advertisement',
  qualityTier: 'Standard',
  totalPrice: '10000',
  advancePercent: '50',
  duration: '7',
  durationUnit: 'days',
  revisionLimit: '2',
  // Text Outputs (Auto-filled)
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
      {loading ? '⏳...' : `✨ ${label}`}
    </button>
  );
}

export default function ProposalGenerator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loadingAI, setLoadingAI] = useState(null);
  const [mobileTab, setMobileTab] = useState('edit');
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : { name: '', email: '', address: '', currency: 'INR' };
  });
  const [doc, setDoc] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: provider.currency || 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // AUTO-GENERATION LOGIC
  useEffect(() => {
    const qty = form.quantity || '0';
    const type = form.projectType || 'Project';
    const service = form.serviceType || 'Services';
    const tier = form.qualityTier || 'Standard';

    // 1. Scope
    const autoScope = `- ${qty} ${type.toLowerCase()} video(s)\n- Includes ${service.toLowerCase()}\n- ${tier} production quality`;
    
    // 2. Deliverables
    const autoDeliv = `- ${qty} final edited video(s)\n- Platform-ready formats`;

    // 3. Timeline
    const autoTimeline = `Project will be completed within ${form.duration} ${form.durationUnit} from project start.`;

    // 4. Pricing
    const total = parseFloat(form.totalPrice) || 0;
    const advP = parseFloat(form.advancePercent) || 0;
    const advAmt = (total * advP) / 100;
    const remAmt = total - advAmt;
    const autoPricing = `Total Project Amount: ${formatCurrency(total)}\nAdvance Required (${advP}%): ${formatCurrency(advAmt)}\nRemaining Balance: ${formatCurrency(remAmt)}`;

    // 5. Revisions
    const autoRev = `Includes up to ${form.revisionLimit} rounds of revisions.`;

    setForm(f => ({
      ...f,
      scopeOfWork: f.scopeOfWork || autoScope,
      deliverables: f.deliverables || autoDeliv,
      timeline: f.timeline || autoTimeline,
      pricing: f.pricing || autoPricing,
      revisionPolicy: f.revisionPolicy || autoRev,
    }));
  }, [form.serviceType, form.quantity, form.projectType, form.qualityTier, form.duration, form.durationUnit, form.totalPrice, form.advancePercent, form.revisionLimit]);

  useEffect(() => {
    if (form.clientName && form.projectTitle) {
      setDoc(generateProposal(form, provider));
    }
  }, [form, provider]);

  const handleAIPolish = async (field, text) => {
    if (!text.trim()) return;
    setLoadingAI(field);
    const result = await generateWithAI(
      `Polish this text for a professional agency proposal. Make it sound premium and clear. Return ONLY the polished text. No markdown, no expansion:\n\n"${text}"`
    );
    set(field, result);
    setLoadingAI(null);
  };

  return (
    <div className="fade-enter">
      <div className="mobile-view-tabs">
        <button className={`mobile-view-tab ${mobileTab === 'edit' ? 'active' : ''}`} onClick={() => setMobileTab('edit')}>✏️ Edit</button>
        <button className={`mobile-view-tab ${mobileTab === 'preview' ? 'active' : ''}`} onClick={() => setMobileTab('preview')}>👁 Preview</button>
      </div>
      <div className="page-body">
        <div className="two-col-layout">
          <div style={{ display: mobileTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
          {/* SECTION 0: CONTEXT */}
          <div className="card">
            <div className="card-title">1. Recipient Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient Name" />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Optional" />
              </div>
              <div className="form-group full">
                <label>Project Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Brand Film 2025" />
              </div>
            </div>
          </div>

          {/* SECTION 1: SERVICE CONFIGURATION */}
          <div className="card">
            <div className="card-title">2. Service Configuration</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Service Type</label>
                <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
                  {SERVICE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="1" />
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select value={form.projectType} onChange={e => set('projectType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quality Tier</label>
                <select value={form.qualityTier} onChange={e => set('qualityTier', e.target.value)}>
                  {QUALITY_TIERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2 & 3: SCOPE & DELIVERABLES */}
          <div className="card">
            <div className="card-title">3. Scope & Deliverables</div>
            <div className="form-group full" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ margin: 0 }}>Scope of Work</label>
                <AIButton label="Polish" loading={loadingAI === 'scopeOfWork'} onClick={() => handleAIPolish('scopeOfWork', form.scopeOfWork)} />
              </div>
              <textarea rows={3} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} />
            </div>
            <div className="form-group full">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ margin: 0 }}>Deliverables</label>
                <AIButton label="Polish" loading={loadingAI === 'deliverables'} onClick={() => handleAIPolish('deliverables', form.deliverables)} />
              </div>
              <textarea rows={2} value={form.deliverables} onChange={e => set('deliverables', e.target.value)} />
            </div>
          </div>

          {/* SECTION 4: TIMELINE & REVISIONS */}
          <div className="card">
            <div className="card-title">4. Timeline & Revisions</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Duration</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="number" style={{ flex: 1 }} value={form.duration} onChange={e => set('duration', e.target.value)} />
                  <select style={{ flex: 1 }} value={form.durationUnit} onChange={e => set('durationUnit', e.target.value)}>
                    {DURATION_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Revision Policy</label>
                <select value={form.revisionLimit} onChange={e => set('revisionLimit', e.target.value)}>
                  {REVISION_OPTIONS.map(o => <option key={o}>{o} Rounds</option>)}
                </select>
              </div>
            </div>
            <div className="form-group full" style={{ marginTop: 16 }}>
              <textarea rows={2} value={form.timeline} onChange={e => set('timeline', e.target.value)} />
            </div>
          </div>

          {/* SECTION 5: PRICING */}
          <div className="card">
            <div className="card-title">5. Pricing</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Price ({provider.currency})</label>
                <input type="number" value={form.totalPrice} onChange={e => set('totalPrice', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} placeholder="50" />
              </div>
            </div>
            <div className="form-group full" style={{ marginTop: 16 }}>
              <textarea rows={2} value={form.pricing} readOnly style={{ background: '#f5f5f5', color: '#666' }} />
              <div style={{ fontSize: 9, color: '#888', marginTop: 4 }}>Pricing text is auto-calculated based on inputs above.</div>
            </div>
          </div>

          {/* SECTION 6: NOTES */}
          <div className="card">
            <div className="card-title">6. Notes & Exclusions</div>
            <div className="form-group full">
              <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Add any special conditions or exclusions here..." />
              <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Keep this section brief. Detailed terms should be in the contract.</div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setDoc(generateProposal(form, provider))} style={{ marginTop: 8 }}>
            Finalize Proposal
          </button>
          </div>

          <div className="preview-panel" style={{ display: mobileTab === 'preview' ? 'block' : 'none' }}>
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
    </div>
  );
}
