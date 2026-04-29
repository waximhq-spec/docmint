import { useState } from 'react';
import DocOutput from '../components/DocOutput';
import Toggle from '../components/Toggle';
import { getNextInvoiceNumber, formatCurrency, formatDate, agencyInfo } from '../utils/helpers';

const DEFAULT = {
  clientName: '',
  companyName: '',
  serviceDesc: '',
  amount: '',
  gst: false,
};

export default function InvoiceGenerator() {
  const [form, setForm] = useState(DEFAULT);
  const [doc, setDoc] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.serviceDesc.trim()) e.serviceDesc = 'Required';
    if (!form.amount || isNaN(parseFloat(form.amount))) e.amount = 'Enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    const agency = agencyInfo();
    const invNum = getNextInvoiceNumber();
    const base = parseFloat(form.amount) || 0;
    const gstAmt = form.gst ? base * 0.18 : 0;
    const total = base + gstAmt;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const html = `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #111;">
          <div>
            <div style="font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px;">${agency.name}</div>
            <div style="font-size:13px;color:#888;">${agency.address}</div>
            <div style="font-size:13px;color:#888;">${agency.email} · ${agency.phone}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:4px;">Invoice</div>
            <div style="font-size:24px;font-weight:800;letter-spacing:-0.5px;">${invNum}</div>
            <div style="font-size:13px;color:#888;margin-top:4px;">Date: ${formatDate()}</div>
            <div style="font-size:13px;color:#888;">Due: ${formatDate(dueDate)}</div>
          </div>
        </div>

        <div style="margin-bottom:32px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:8px;">Bill To</div>
          <div style="font-size:15px;font-weight:700;">${form.clientName}</div>
          ${form.companyName ? `<div style="font-size:14px;color:#555;">${form.companyName}</div>` : ''}
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#f7f7f7;">
              <th style="text-align:left;padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;border-bottom:1px solid #e5e5e5;">Description</th>
              <th style="text-align:right;padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;border-bottom:1px solid #e5e5e5;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:16px;border-bottom:1px solid #e5e5e5;">
                <div style="font-weight:600;">${form.serviceDesc}</div>
              </td>
              <td style="padding:16px;border-bottom:1px solid #e5e5e5;text-align:right;">${formatCurrency(base)}</td>
            </tr>
            ${form.gst ? `
            <tr>
              <td style="padding:16px;border-bottom:1px solid #e5e5e5;color:#555;">GST (18%)</td>
              <td style="padding:16px;border-bottom:1px solid #e5e5e5;text-align:right;color:#555;">${formatCurrency(gstAmt)}</td>
            </tr>` : ''}
          </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-bottom:40px;">
          <div style="width:240px;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden;">
            <div style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e5e5e5;">
              <span style="font-size:13px;color:#555;">Subtotal</span>
              <span style="font-size:13px;">${formatCurrency(base)}</span>
            </div>
            ${form.gst ? `<div style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e5e5e5;">
              <span style="font-size:13px;color:#555;">GST (18%)</span>
              <span style="font-size:13px;">${formatCurrency(gstAmt)}</span>
            </div>` : ''}
            <div style="display:flex;justify-content:space-between;padding:14px 16px;background:#f7f7f7;">
              <span style="font-size:14px;font-weight:700;">Total Due</span>
              <span style="font-size:14px;font-weight:700;">${formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:20px;">
          <p style="font-size:13px;color:#888;line-height:1.7;">Thank you for your business. Please make payment within 7 days. For queries: ${agency.email}</p>
        </div>
      </div>
    `;

    const text = `INVOICE ${invNum}\n\nBill To: ${form.clientName}\nService: ${form.serviceDesc}\nSubtotal: ${formatCurrency(base)}${form.gst ? '\nGST 18%: ' + formatCurrency(gstAmt) : ''}\nTotal Due: ${formatCurrency(total)}\nDue: ${formatDate(dueDate)}`;

    setDoc({ html, text });
  };

  return (
    <div className="page-body fade-enter">
      <div className="card">
        <div className="card-title">Invoice Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="inv-clientName">Client Name *</label>
            <input
              id="inv-clientName"
              value={form.clientName}
              onChange={e => set('clientName', e.target.value)}
              placeholder="e.g. Rahul Verma"
              style={errors.clientName ? { borderColor: '#c00' } : {}}
            />
            {errors.clientName && <span style={{ color: '#c00', fontSize: 11 }}>{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="inv-company">Company Name</label>
            <input
              id="inv-company"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="form-group full">
            <label htmlFor="inv-service">Service Description *</label>
            <textarea
              id="inv-service"
              rows={2}
              value={form.serviceDesc}
              onChange={e => set('serviceDesc', e.target.value)}
              placeholder="e.g. Brand Film Production — March 2025"
              style={errors.serviceDesc ? { borderColor: '#c00' } : {}}
            />
            {errors.serviceDesc && <span style={{ color: '#c00', fontSize: 11 }}>{errors.serviceDesc}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="inv-amount">Amount (₹) *</label>
            <input
              id="inv-amount"
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="e.g. 50000"
              style={errors.amount ? { borderColor: '#c00' } : {}}
            />
            {errors.amount && <span style={{ color: '#c00', fontSize: 11 }}>{errors.amount}</span>}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-label">Include GST (18%)</div>
              <div className="toggle-desc">Adds 18% GST to the invoice total</div>
            </div>
            <Toggle id="inv-gst" checked={form.gst} onChange={v => set('gst', v)} />
          </div>
        </div>

        <div className="generate-row">
          <button className="btn btn-primary" onClick={handleGenerate} id="btn-generate-invoice">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="14" height="14" x="3" y="3" rx="2"/>
              <path d="M7 12h10M7 8h10M7 16h6"/>
            </svg>
            Generate Invoice
          </button>
        </div>
      </div>

      {doc && (
        <div className="fade-enter" style={{ marginTop: 24 }}>
          <DocOutput type="Invoice" html={doc.html} text={doc.text} />
        </div>
      )}
    </div>
  );
}
