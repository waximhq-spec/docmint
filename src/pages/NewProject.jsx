import { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import DocOutput from '../components/DocOutput';
import LocationInput from '../components/LocationInput';
import {
  generateProposal,
  generateContract,
  generateInvoice,
} from '../utils/generators';
import { getNextInvoiceNumber, peekInvoiceNumber } from '../utils/helpers';
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
  email: '',
  projectType: 'Video Production',
  projectTitle: '',
  projectGoal: '',
  scopeOfWork: '',
  timeline: '',
  totalPrice: '',
  advancePercent: '50',
  revisions: '',
};

export default function NewProject() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loadingAI, setLoadingAI] = useState(null);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    const syncSettings = () => {
      const saved = localStorage.getItem('docmint_provider');
      if (saved) setProvider(JSON.parse(saved));
    };
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  useEffect(() => {
    if (form.clientName && form.projectTitle && form.totalPrice) {
      handleGenerate();
    }
  }, [form, provider]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleAIScope = async () => {
    setLoadingAI('scope');
    const prompt = `Draft a professional scope of work for a ${form.projectType} project titled "${form.projectTitle}". 
    Budget: ${provider.currency} ${form.totalPrice}. Goal: ${form.projectGoal}.
    Keep it in clear phases/bullet points suitable for an agency proposal.`;
    const result = await generateWithAI(prompt);
    set('scopeOfWork', result);
    setLoadingAI(null);
  };

  const handleAIRewrite = async (field, currentText) => {
    if (!currentText) return;
    setLoadingAI(field);
    const prompt = `Rewrite this for a professional agency document to be more premium and clear: "${currentText}"`;
    const result = await generateWithAI(prompt);
    set(field, result);
    setLoadingAI(null);
  };

  const handleGenerate = () => {
    const advInvNum = peekInvoiceNumber();
    const finInvNum = `INV-${String(parseInt(advInvNum.split('-')[1]) + 1).padStart(3, '0')}`;
    
    const proposalData = { ...form, serviceType: form.projectType, budget: form.totalPrice, includeExclusions: true };
    const contractData = { ...form, serviceType: form.projectType, totalAmount: form.totalPrice };
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

  return (
    <div className="page-body fade-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 32, alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="card">
            <div className="card-title">1. Global Settings</div>
            <p style={{ fontSize: 12, color: '#888' }}>
              <strong>{provider.name || 'Your Agency'}</strong> · {provider.currency} · {provider.address || 'Address not set'}
            </p>
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
                <textarea rows={2} value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} placeholder="What is the main objective?" />
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
                <textarea rows={4} value={form.scopeOfWork} onChange={e => set('scopeOfWork', e.target.value)} placeholder="List deliverables or use AI..." />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">3. Pricing & Terms</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Budget ({provider.currency})</label>
                <input type="number" value={form.totalPrice} onChange={e => set('totalPrice', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Revision Rounds</label>
                <input value={form.revisions} onChange={e => set('revisions', e.target.value)} placeholder="Optional" />
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleGenerate} style={{ width: '100%', height: 48 }}>
            Finalize All Documents
          </button>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Master Preview ({provider.currency})</div>
          {docs ? (
            <Tabs
              tabs={[
                { label: '📄 Proposal', content: <DocOutput type="Proposal" html={docs.proposal.html} text={docs.proposal.text} /> },
                { label: '📝 Contract', content: <DocOutput type="Contract" html={docs.contract.html} text={docs.contract.text} /> },
                { label: '🧾 Advance Inv', content: <DocOutput type="Invoice" html={docs.advanceInvoice.html} text={docs.advanceInvoice.text} /> },
                { label: '🧾 Final Inv', content: <DocOutput type="Invoice" html={docs.finalInvoice.html} text={docs.finalInvoice.text} /> },
              ]}
            />
          ) : (
            <div className="card" style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', borderStyle: 'dashed' }}>
              Fill details to see master preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
