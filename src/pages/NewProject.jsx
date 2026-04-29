import { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import DocOutput from '../components/DocOutput';
import {
  generateProposal,
  generateContract,
  generateInvoice,
} from '../utils/generators';
import { getNextInvoiceNumber, peekInvoiceNumber } from '../utils/helpers';

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
  bankName: '',
  accNumber: '',
  upiId: '',
};

const DEFAULT_FORM = {
  clientName: '',
  companyName: '',
  email: '',
  projectType: 'Video Production',
  projectTitle: '',
  projectGoal: '',
  scopeOfWork: '',
  timeline: '',
  totalPrice: '',
  advancePercent: '50',
  revisions: '2',
};

export default function NewProject() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  
  const [docs, setDocs] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
  }, [provider]);

  // Live preview effect
  useEffect(() => {
    if (form.clientName && form.projectTitle && form.totalPrice) {
      handleGenerate();
    }
  }, [form, provider]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setProv = (key, val) => setProvider(p => ({ ...p, [k]: val }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.projectTitle.trim()) e.projectTitle = 'Required';
    if (!form.totalPrice || isNaN(parseFloat(form.totalPrice))) e.totalPrice = 'Required';
    if (!provider.name.trim()) e.providerName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    // Note: We don't increment invoice numbers during live preview to avoid skipping numbers
    const advInvNum = peekInvoiceNumber();
    const finInvNum = `INV-${String(parseInt(advInvNum.split('-')[1]) + 1).padStart(3, '0')}`;
    
    // We repurpose the form to fit the generator structures
    const proposalData = { ...form, serviceType: form.projectType, budget: form.totalPrice, includeExclusions: true };
    const contractData = { ...form, serviceType: form.projectType, totalAmount: form.totalPrice };
    
    // Invoices need line items
    const invoiceItems = [{ desc: `${form.projectType}: ${form.projectTitle}`, qty: 1, rate: form.totalPrice }];
    
    setDocs({
      proposal: generateProposal(proposalData, provider),
      contract: generateContract(contractData, provider),
      advanceInvoice: generateInvoice({ 
        ...form, 
        items: invoiceItems, 
        type: 'Advance Invoice', 
        invoiceNumber: advInvNum,
        advanceRequested: (parseFloat(form.totalPrice) * parseFloat(form.advancePercent)) / 100 
      }, provider),
      finalInvoice: generateInvoice({ 
        ...form, 
        items: invoiceItems, 
        type: 'Final Invoice', 
        invoiceNumber: finInvNum,
        advancePaid: (parseFloat(form.totalPrice) * parseFloat(form.advancePercent)) / 100 
      }, provider),
    });
  };

  const finalizeDocs = () => {
    if (!validate()) return;
    handleGenerate();
    // In a real app, this is where we would save to a database
    alert('Documents finalized! You can now print or download them.');
  };

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 32, alignItems: 'start' }}>
        
        {/* Left: Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Your Identity</div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Registered Name</label>
                <input value={provider.name} onChange={e => setProvider(p => ({ ...p, name: e.target.value }))} placeholder="Your Full Name" />
              </div>
              <div className="form-group full">
                <label>Address</label>
                <input value={provider.address} onChange={e => setProvider(p => ({ ...p, address: e.target.value }))} placeholder="Business Address" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">2. Client & Project</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name</label>
                <input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Recipient Name" />
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select value={form.projectType} onChange={e => set('projectType', e.target.value)}>
                  {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label>Project Title</label>
                <input value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="e.g. Brand Film 2025" />
              </div>
              <div className="form-group full">
                <label>Project Goal</label>
                <textarea rows={2} value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} placeholder="What is the main objective?" />
              </div>
              <div className="form-group full">
                <label>Specific Scope (Optional)</label>
                <textarea rows={3} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="Custom deliverables..." />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">3. Pricing & Terms</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Budget (₹)</label>
                <input type="number" value={form.totalPrice} onChange={e => set('totalPrice', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Revisions</label>
                <input type="number" value={form.revisions} onChange={e => set('revisions', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="Leave blank for auto-calc" />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={finalizeDocs} style={{ width: '100%', height: 48, fontSize: 16 }}>
            Finalize All Documents
          </button>
        </div>

        {/* Right: Master Preview */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Master Project Preview</div>
          {docs ? (
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
                  label: '🧾 Advance Inv',
                  content: <DocOutput type="Invoice" html={docs.advanceInvoice.html} text={docs.advanceInvoice.text} />,
                },
                {
                  label: '🧾 Final Inv',
                  content: <DocOutput type="Invoice" html={docs.finalInvoice.html} text={docs.finalInvoice.text} />,
                },
              ]}
            />
          ) : (
            <div className="card" style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed', textAlign: 'center', padding: 40 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#444', marginBottom: 8 }}>Master Generator</p>
                <p style={{ fontSize: 13 }}>Fill the client name, project title, and budget to live-preview all project documents at once.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
