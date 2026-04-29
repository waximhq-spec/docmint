import { useState } from 'react';
import DocOutput from '../components/DocOutput';
import { formatDate, agencyInfo } from '../utils/helpers';

const PROJECT_TYPES = [
  'Video Production',
  'Website Development',
  'Solar Installation',
  'Branding & Design',
  'Social Media Management',
  'Photography',
  'Other',
];

const DEFAULT = {
  clientName: '',
  companyName: '',
  projectType: 'Video Production',
  paymentTerms: '50% advance, 50% on delivery',
  revisions: '2',
  deliverables: '',
  timeline: '',
};

export default function ContractGenerator() {
  const [form, setForm] = useState(DEFAULT);
  const [doc, setDoc] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.deliverables.trim()) e.deliverables = 'Required';
    if (!form.timeline.trim()) e.timeline = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const agency = agencyInfo();

    const html = `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:36px;padding-bottom:28px;border-bottom:2px solid #111;">
          <h1 style="font-size:22px;font-weight:800;letter-spacing:-0.3px;margin-bottom:4px;">SERVICE AGREEMENT</h1>
          <p style="font-size:13px;color:#888;">Dated: ${formatDate()}</p>
        </div>

        <div style="margin-bottom:28px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">1. Parties</h2>
          <p style="line-height:1.8;">This Agreement is made between:</p>
          <ul style="list-style:none;margin-top:12px;padding:0;">
            <li style="padding:10px 0;border-bottom:1px solid #e5e5e5;"><strong>Service Provider:</strong> ${agency.name}, ${agency.address}</li>
            <li style="padding:10px 0;"><strong>Client:</strong> ${form.clientName}${form.companyName ? ', ' + form.companyName : ''}</li>
          </ul>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">2. Scope of Work</h2>
          <p style="line-height:1.8;"><strong>Project Type:</strong> ${form.projectType}</p>
          <p style="margin-top:10px;line-height:1.8;white-space:pre-line;">${form.deliverables}</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">3. Payment Terms</h2>
          <p style="line-height:1.8;">${form.paymentTerms}. Work will not commence until the advance payment is received. All payments are non-refundable once work has begun, unless otherwise specified.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">4. Delivery Timeline</h2>
          <p style="line-height:1.8;">Estimated project timeline: <strong>${form.timeline}</strong>, starting from the date of advance payment and receipt of all required materials. Delays due to late feedback from the Client will extend the timeline accordingly.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">5. Revisions Policy</h2>
          <p style="line-height:1.8;">This agreement includes <strong>${form.revisions} round(s) of revisions</strong>. Each revision round must be submitted as a single, consolidated list. Revisions are limited to the original scope. Additional revision rounds will be billed separately.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">6. Intellectual Property</h2>
          <p style="line-height:1.8;">All final deliverables will be owned by the Client upon receipt of full payment. Intermediate files and working assets remain the property of ${agency.name} unless otherwise agreed. ${agency.name} reserves the right to display completed work in its portfolio.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">7. Cancellation</h2>
          <p style="line-height:1.8;">Either party may terminate this Agreement with 7 days written notice. In the event of cancellation by the Client after work has commenced, the advance is non-refundable. The Agency will invoice for all work completed up to the cancellation date.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">8. Confidentiality</h2>
          <p style="line-height:1.8;">Both parties agree to keep all project-related information, pricing, and communications confidential and not disclose them to any third party without prior written consent.</p>
        </div>

        <div style="border-top:2px solid #111;padding-top:32px;margin-top:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:24px;">Signatures</h2>
          <div style="display:flex;gap:40px;">
            <div style="flex:1;">
              <p style="font-size:13px;color:#555;margin-bottom:40px;">For & On Behalf of ${agency.name}</p>
              <div style="border-top:1px solid #111;padding-top:8px;">
                <p style="font-size:12px;color:#888;">Authorized Signature</p>
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${agency.name}</p>
                <p style="font-size:12px;color:#888;">Date: _______________</p>
              </div>
            </div>
            <div style="flex:1;">
              <p style="font-size:13px;color:#555;margin-bottom:40px;">Client</p>
              <div style="border-top:1px solid #111;padding-top:8px;">
                <p style="font-size:12px;color:#888;">Authorized Signature</p>
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${form.clientName}</p>
                <p style="font-size:12px;color:#888;">Date: _______________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const text = `SERVICE AGREEMENT\n\nParties: ${agency.name} & ${form.clientName}\nProject Type: ${form.projectType}\nPayment: ${form.paymentTerms}\nTimeline: ${form.timeline}\nRevisions: ${form.revisions}`;
    setDoc({ html, text });
  };

  return (
    <div className="page-body fade-enter">
      <div className="card">
        <div className="card-title">Contract Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="ct-client">Client Name *</label>
            <input
              id="ct-client"
              value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="e.g. Rohan Kapoor"
              style={errors.clientName ? { borderColor: '#c00' } : {}}
            />
            {errors.clientName && <span style={{ color: '#c00', fontSize: 11 }}>{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="ct-company">Company Name</label>
            <input
              id="ct-company"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ct-type">Project Type</label>
            <select id="ct-type" value={form.projectType} onChange={e => set('projectType', e.target.value)}>
              {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ct-timeline">Timeline *</label>
            <input
              id="ct-timeline"
              value={form.timeline}
              onChange={e => set('timeline', e.target.value)}
              placeholder="e.g. 4 weeks"
              style={errors.timeline ? { borderColor: '#c00' } : {}}
            />
            {errors.timeline && <span style={{ color: '#c00', fontSize: 11 }}>{errors.timeline}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="ct-payment">Payment Terms</label>
            <input
              id="ct-payment"
              value={form.paymentTerms}
              onChange={e => set('paymentTerms', e.target.value)}
              placeholder="e.g. 50% advance, 50% on delivery"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ct-revisions">Number of Revisions</label>
            <input
              id="ct-revisions"
              type="number"
              min="0"
              value={form.revisions}
              onChange={e => set('revisions', e.target.value)}
            />
          </div>
          <div className="form-group full">
            <label htmlFor="ct-deliverables">Scope / Deliverables *</label>
            <textarea
              id="ct-deliverables"
              rows={4}
              value={form.deliverables}
              onChange={e => set('deliverables', e.target.value)}
              placeholder="List the deliverables and scope clearly..."
              style={errors.deliverables ? { borderColor: '#c00' } : {}}
            />
            {errors.deliverables && <span style={{ color: '#c00', fontSize: 11 }}>{errors.deliverables}</span>}
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
