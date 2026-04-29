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
  revisions: '2',
};

export default function NewProject() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : DEFAULT_PROVIDER;
  });
  
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
  }, [provider]);

  useEffect(() => {
    if (form.clientName && form.projectTitle && form.totalPrice) {
      handleGenerate();
    }
  }, [form, provider]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setProv = (key, val) => setProvider(p => ({ ...p, [key]: val }));

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
            <div className="card-title">1. Your Identity & Currency</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Currency</label>
                <select value={provider.currency} onChange={e => setProv('currency', e.target.value)}>
                  <option value="INR">INR (₹)</option>
                  <option value="BHD">BHD (.د.ب)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Name / Agency</label>
                <input value={provider.name} onChange={e => setProv('name', e.target.value)} placeholder="Your Name" />
              </div>
              <div className="form-group full">
                <label>Smart Address Search</label>
                <LocationInput value={provider.address} onChange={val => setProv('address', val)} />
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
                <textarea rows={2} value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} placeholder="Main objective?" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">3. Pricing & Terms</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Budget</label>
                <input type="number" value={form.totalPrice} onChange={e => set('totalPrice', e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Advance %</label>
                <input type="number" value={form.advancePercent} onChange={e => set('advancePercent', e.target.value)} />
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
