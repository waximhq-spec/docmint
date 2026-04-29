import { useState } from 'react';
import DocOutput from '../components/DocOutput';
import { formatDate, agencyInfo } from '../utils/helpers';

const SERVICE_TYPES = [
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
  serviceType: 'Video Production',
  budget: '',
  timeline: '',
  notes: '',
};

export default function ProposalGenerator() {
  const [form, setForm] = useState(DEFAULT);
  const [doc, setDoc] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.budget.trim()) e.budget = 'Required';
    if (!form.timeline.trim()) e.timeline = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const agency = agencyInfo();

    const html = `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <div style="margin-bottom:40px;">
          <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:8px;">Project Proposal</div>
          <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px;">${form.serviceType} Services</h1>
          <p style="color:#555;font-size:14px;">Prepared for ${form.clientName}${form.companyName ? ' · ' + form.companyName : ''} · ${formatDate()}</p>
        </div>

        <div style="margin-bottom:28px;">
          <p style="font-size:15px;line-height:1.8;">Dear <strong>${form.clientName}</strong>,</p>
          <p style="margin-top:12px;line-height:1.8;color:#333;">We appreciate the opportunity to present this proposal for your ${form.serviceType.toLowerCase()} requirements. At ${agency.name}, we specialize in delivering premium, results-driven ${form.serviceType.toLowerCase()} solutions tailored to your specific goals and brand identity.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">What We Offer</h2>
          <p style="line-height:1.8;">Our ${form.serviceType.toLowerCase()} service includes end-to-end production from concept to final delivery. We work closely with our clients to ensure every detail aligns with their vision, brand identity, and business objectives. Our team brings years of experience, creative excellence, and technical expertise to every project.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Project Overview</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#555;width:40%;">Service Type</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;font-weight:500;">${form.serviceType}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#555;">Estimated Budget</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;font-weight:500;">${form.budget}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#555;">Estimated Timeline</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;font-weight:500;">${form.timeline}</td>
            </tr>
          </table>
        </div>

        ${form.notes ? `
        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Additional Notes</h2>
          <p style="line-height:1.8;white-space:pre-line;">${form.notes}</p>
        </div>` : ''}

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Why Choose Us</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13.5px;">— Premium quality with attention to every detail</li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13.5px;">— Transparent communication throughout the project</li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13.5px;">— On-time delivery with milestone tracking</li>
            <li style="padding:8px 0;font-size:13.5px;">— Dedicated support and revision rounds included</li>
          </ul>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;">
          <p style="line-height:1.8;color:#333;">We are excited about the potential of working together and confident we can deliver results that exceed your expectations. Please feel free to reach out with any questions.</p>
          <p style="margin-top:16px;line-height:1.8;">Warm regards,<br/><strong>${agency.name}</strong><br/>${agency.email} · ${agency.phone}</p>
        </div>
      </div>
    `;

    const text = `PROJECT PROPOSAL — ${form.serviceType}\n\nFor: ${form.clientName}\nBudget: ${form.budget}\nTimeline: ${form.timeline}`;
    setDoc({ html, text });
  };

  return (
    <div className="page-body fade-enter">
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
              placeholder="e.g. ₹50,000 – ₹80,000"
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
              placeholder="Any specific requirements, context, or customizations..."
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
