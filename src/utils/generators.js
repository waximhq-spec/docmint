import { formatDate, formatCurrency } from '../utils/helpers';

const PROJECT_CONFIGS = {
  'Video Production': {
    scope: 'Phase 1: Pre-production (scripting, planning)\nPhase 2: Production (filming, direction)\nPhase 3: Post-production (editing, sound)',
    timeline: 'Week 1: Planning\nWeek 2: Shoot\nWeek 3: Editing',
    tone: 'Professional',
  },
  'Commercial / Ad Shoot': {
    scope: 'Phase 1: Concept & Storyboarding\nPhase 2: High-end Production Shoot\nPhase 3: Ad Editing & Color Grading',
    timeline: 'Week 1: Creative Approval\nWeek 2: Production\nWeek 3: Final Delivery',
    tone: 'Premium',
  },
  'Social Media Content': {
    scope: 'Phase 1: Content Planning & Hooks\nPhase 2: Batch Production\nPhase 3: Vertical Short-form Editing',
    timeline: 'Batch delivery within 7-10 days',
    tone: 'Fast',
  },
  'Brand Film': {
    scope: 'Phase 1: Brand Narrative & Strategy\nPhase 2: Cinematic Film Production\nPhase 3: Narrative Post-production',
    timeline: '4-6 Weeks for Narrative Excellence',
    tone: 'Premium',
  },
  'Event Coverage': {
    scope: 'Phase 1: On-site multi-cam coverage\nPhase 2: Event Highlight Editing\nPhase 3: Raw Footage Archive',
    timeline: 'Highlight Reel within 48 hours',
    tone: 'Professional',
  },
  'Photography': {
    scope: 'Phase 1: Shoot Session & Lighting\nPhase 2: Image Selection & Review\nPhase 3: Color Correction & Retouching',
    timeline: 'Delivery within 5 business days',
    tone: 'Premium',
  },
  'Post-Production / Editing': {
    scope: 'Phase 1: Footage Organization\nPhase 2: Assembly & Story Cut\nPhase 3: Grading, Sound & Mastering',
    timeline: 'Based on footage volume',
    tone: 'Professional',
  },
};

export function generateProposal(data, provider) {
  const {
    projectTitle = '',
    clientName = '',
    companyName = '',
    projectOverview = '',
    scopeOfWork = '',
    deliverables = '',
    timeline = '',
    pricing = '',
    revisionPolicy = '',
    notes = '',
  } = data;

  const currency = provider.currency || 'INR';

  const fullText = `
# PROPOSAL: ${projectTitle}
**Prepared for:** ${clientName} ${companyName ? `(${companyName})` : ''}
**Date:** ${formatDate()}

---

## 1. Project Overview
${projectOverview || 'A comprehensive strategy tailored to help you achieve your vision.'}

---

## 2. Scope of Work
${scopeOfWork || 'Strategic execution of project requirements.'}

---

## 3. Deliverables
${deliverables || 'As discussed.'}

---

## 4. Timeline
${timeline || 'TBD'}

---

## 5. Pricing
${pricing || 'TBD'}

---

## 6. Revision Policy
${revisionPolicy || 'Standard revisions apply.'}

---

## 7. Notes / Exclusions
${notes || 'Standard terms and conditions apply.'}

---

We look forward to moving forward upon your approval.

**${provider.name}**
${provider.email}
  `.trim();

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:40px;background:#fff;line-height:1.6;">
        <div style="margin-bottom:60px;border-bottom:1px solid #eee;padding-bottom:24px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px;">Proposal For</div>
          <h1 style="font-size:28px;font-weight:900;letter-spacing:-0.5px;margin-bottom:4px;">${projectTitle}</h1>
          <p style="color:#555;font-size:14px;">Prepared for ${clientName} · ${formatDate()}</p>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">1. Project Overview</h2>
          <div style="white-space:pre-line;">${projectOverview || 'A comprehensive strategy tailored to help you achieve your vision.'}</div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">2. Scope of Work</h2>
          <div style="white-space:pre-line;">${scopeOfWork || 'Strategic execution of project requirements.'}</div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">3. Deliverables</h2>
          <div style="white-space:pre-line;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;">${deliverables || 'As discussed.'}</div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">4. Timeline</h2>
          <div style="white-space:pre-line;">${timeline || 'TBD'}</div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">5. Pricing</h2>
          <div style="white-space:pre-line;">${pricing || 'TBD'}</div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">6. Revision Policy</h2>
          <div style="white-space:pre-line;">${revisionPolicy || 'Standard revisions apply.'}</div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">7. Notes / Exclusions</h2>
          <div style="white-space:pre-line;font-size:13px;color:#555;">${notes || 'Standard terms and conditions apply.'}</div>
        </div>

        <div style="border-top:1px solid #eee;padding-top:40px;margin-top:60px;text-align:center;">
          <p style="font-size:15px;color:#333;margin-bottom:24px;">We look forward to moving forward upon your approval.</p>
          <div style="font-size:14px;font-weight:700;">${provider.name}</div>
          <div style="font-size:12px;color:#888;">${provider.email}</div>
        </div>
      </div>
    `,
    text: fullText
  };
}

export function generateContract(data, provider) {
  const {
    projectTitle = '',
    clientName = '',
    companyName = '',
    scopeOfWork = '',
    timeline = '',
    paymentTerms = '',
    intellectualProperty = '',
    cancellationPolicy = '',
  } = data;

  const fullText = `
# SERVICE AGREEMENT
**Title:** ${projectTitle || 'Service Agreement'}
**Date:** ${formatDate()}

---

## 1. The Parties
This Agreement is entered into between **${provider.name}** ("Provider") and **${clientName}** ${companyName ? `(${companyName})` : ''} ("Client").

---

## 2. Scope of Work
${scopeOfWork || 'Services as mutually agreed upon.'}

---

## 3. Timeline
${timeline || 'To be determined.'}

---

## 4. Payment Terms
${paymentTerms || 'Standard payment terms apply.'}

---

## 5. Intellectual Property
${intellectualProperty || 'Rights transfer to the Client after full and final payment.'}

---

## 6. Cancellation Policy
${cancellationPolicy || 'Standard cancellation terms apply.'}

---

**Signatures:**

Provider: ____________________ (${provider.name})
Client: ______________________ (${clientName})
  `.trim();

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:60px;background:#fff;line-height:1.7;font-size:13px;">
        <div style="text-align:center;margin-bottom:60px;">
          <h1 style="font-size:24px;font-weight:900;letter-spacing:-0.5px;text-transform:uppercase;margin-bottom:4px;">${projectTitle || 'Service Agreement'}</h1>
          <p style="color:#888;font-size:12px;">Date: ${formatDate()}</p>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">1. The Parties</h2>
          <p>This Agreement is entered into between <strong>${provider.name}</strong> ("Provider") and <strong>${clientName}</strong> ${companyName ? `(${companyName})` : ''} ("Client").</p>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">2. Scope of Work</h2>
          <div style="white-space:pre-line;line-height:1.6;">${scopeOfWork || 'Services as mutually agreed upon.'}</div>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">3. Timeline</h2>
          <div style="white-space:pre-line;">${timeline || 'To be determined.'}</div>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">4. Payment Terms</h2>
          <div style="white-space:pre-line;">${paymentTerms || 'Standard payment terms apply.'}</div>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">5. Intellectual Property</h2>
          <div style="white-space:pre-line;">${intellectualProperty || 'Rights transfer to the Client after full and final payment.'}</div>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">6. Cancellation Policy</h2>
          <div style="white-space:pre-line;">${cancellationPolicy || 'Standard cancellation terms apply.'}</div>
        </div>

        <div style="margin-top:80px;display:flex;gap:60px;">
          <div style="flex:1;">
            <div style="height:60px;border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-weight:700;">${provider.name}</div>
          </div>
          <div style="flex:1;">
            <div style="height:60px;border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-weight:700;">${clientName}</div>
          </div>
        </div>
      </div>
    `,
    text: fullText
  };
}

export function generateInvoice(data, provider) {
  const {
    projectName = '',
    totalAmount = '',
    advancePercent = '50',
    manualAdvance = '',
    invoiceNumber = 'INV-001',
    invoiceDate = new Date(),
    dueDate,
    type = 'Advance Invoice',
    status = 'Unpaid',
    gstEnabled = false,
    gstRate = 18,
    notes = '',
  } = data;

  const currency = provider.currency || 'INR';
  const total = parseFloat(totalAmount) || 0;
  const gstAmount = gstEnabled ? (total * gstRate) / 100 : 0;
  const grandTotal = total + gstAmount;

  let advance = 0;
  if (manualAdvance) {
    advance = parseFloat(manualAdvance) || 0;
  } else {
    advance = (grandTotal * (parseFloat(advancePercent) || 0)) / 100;
  }
  const remaining = grandTotal - advance;

  let amountDue = grandTotal;
  let typeLabel = 'Total Due';
  let descriptionLabel = 'Project Description';
  if (type === 'Advance Invoice') {
    amountDue = advance;
    typeLabel = 'Advance Due';
    descriptionLabel = 'Deliverables (To Be Provided)';
  } else if (type === 'Final Invoice') {
    amountDue = remaining;
    typeLabel = 'Final Balance Due';
    descriptionLabel = 'Services Rendered';
  }

  const statusColors = {
    'Paid': { bg: '#e6f4ea', text: '#1e8e3e', border: '#1e8e3e' },
    'Partially Paid': { bg: '#fef7e0', text: '#b06000', border: '#b06000' },
    'Unpaid': { bg: '#fce8e6', text: '#d93025', border: '#d93025' },
    'Due': { bg: '#fce8e6', text: '#d93025', border: '#d93025' },
  };
  const sColor = statusColors[status] || statusColors['Unpaid'];

  const watermarkHtml = status === 'Unpaid' || status === 'Due' ? `
    <div style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;font-weight:900;color:rgba(217,48,37,0.08);pointer-events:none;z-index:0;text-transform:uppercase;white-space:nowrap;letter-spacing:10px;">
      Pending Payment
    </div>
  ` : '';

  let qrCodeHtml = '';
  if (provider.upiId && status !== 'Paid' && currency === 'INR') {
    const upiLink = `upi://pay?pa=${provider.upiId}&pn=${encodeURIComponent(provider.name)}&am=${amountDue}&cu=INR&tn=${encodeURIComponent('Invoice ' + invoiceNumber)}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`;
    qrCodeHtml = `
      <div style="text-align:center;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:8px;">Scan to Pay</div>
        <img src="${qrApiUrl}" width="100" height="100" style="border:1px solid #e5e5e5;padding:6px;border-radius:10px;background:#fff;" alt="UPI QR Code" />
      </div>
    `;
  }

  const fullText = `
# INVOICE ${invoiceNumber}
**Date:** ${formatDate(new Date(invoiceDate))}
**Status:** ${status}
**Type:** ${type}

---

## From:
**${provider.name}**
${provider.address || ''}
${provider.email}

## Bill To:
**${data.clientName}**
${data.companyName || ''}
${data.email || ''}

---

## Details:
**${descriptionLabel}:**
${projectName || 'Services Rendered'}
**Total Project Amount:** ${formatCurrency(total, currency)}
${gstEnabled ? `**GST (${gstRate}%):** ${formatCurrency(gstAmount, currency)}` : ''}
**Grand Total:** ${formatCurrency(grandTotal, currency)}

---

## Financials:
${type !== 'Full Invoice' ? `- **${type === 'Advance Invoice' ? 'Advance Required' : 'Advance Paid'}:** ${formatCurrency(advance, currency)}\n- **Remaining Balance:** ${formatCurrency(remaining, currency)}` : ''}

### **${typeLabel}:** **${formatCurrency(amountDue, currency)}**

---

**Notes:**
${type === 'Advance Invoice' ? 'This is an advance invoice.\n' : ''}${type === 'Final Invoice' ? 'This is a final invoice.\n' : ''}${notes || 'Payment due within 7 days.'}
  `.trim();



  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:40px;position:relative;background:#fff;">
        ${watermarkHtml}
        
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:60px;position:relative;z-index:1;">
          <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px;">Invoice From</div>
            <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;margin-bottom:4px;">${provider.name}</div>
            <div style="font-size:13px;color:#555;line-height:1.5;">${provider.address || ''}</div>
            <div style="font-size:13px;color:#555;">${provider.email}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px;">Invoice Number</div>
            <div style="font-size:22px;font-weight:900;">${invoiceNumber}</div>
            <div style="margin-top:12px;display:inline-block;padding:4px 12px;border-radius:4px;font-size:10px;font-weight:800;text-transform:uppercase;background:${sColor.bg};color:${sColor.text};border:1px solid ${sColor.border};">
              ${status}
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:60px;position:relative;z-index:1;">
          <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:12px;">Bill To</div>
            <div style="font-size:16px;font-weight:700;">${data.clientName}</div>
            <div style="font-size:13px;color:#555;margin-top:4px;">${data.companyName || ''}</div>
            <div style="font-size:13px;color:#555;">${data.email || ''}</div>
          </div>
          <div style="text-align:right;">
            <div style="margin-bottom:12px;">
              <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:4px;">Issued Date</div>
              <div style="font-size:14px;font-weight:600;">${formatDate(new Date(invoiceDate))}</div>
            </div>
            <div>
              <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:4px;">Due Date</div>
              <div style="font-size:14px;font-weight:600;color:${status !== 'Paid' ? '#d93025' : '#111'};">${dueDate ? formatDate(new Date(dueDate)) : 'Upon Receipt'}</div>
            </div>
          </div>
        </div>

        <div style="background:#f9f9f9;padding:24px;border-radius:8px;margin-bottom:32px;position:relative;z-index:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;padding-bottom:16px;margin-bottom:16px;">
            <div>
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:4px;">${descriptionLabel}</div>
              <div style="font-size:14px;font-weight:600;white-space:pre-line;max-width:300px;line-height:1.4;">${projectName || 'Services Rendered'}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:4px;">Total Project Amount</div>
              <div style="font-size:16px;font-weight:700;">${formatCurrency(total, currency)}</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#888;margin-bottom:4px;">Invoice Type</div>
              <div style="font-size:14px;font-weight:500;">${type}</div>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;position:relative;z-index:1;">
          <div>
            ${qrCodeHtml}
          </div>
          <div style="width:320px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
              <span>Total Project Amount</span>
              <span>${formatCurrency(total, currency)}</span>
            </div>
            ${gstEnabled ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
                <span>GST (${gstRate}%)</span>
                <span>${formatCurrency(gstAmount, currency)}</span>
              </div>
            ` : ''}
            <div style="display:flex;justify-content:space-between;padding:12px 0;margin-top:8px;border-top:1px solid #e5e5e5;font-size:15px;font-weight:700;color:#111;">
              <span>Grand Total</span>
              <span>${formatCurrency(grandTotal, currency)}</span>
            </div>
            ${type !== 'Full Invoice' ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#888;font-style:italic;">
                <span>${type === 'Advance Invoice' ? 'Advance Required' : 'Advance Paid'}</span>
                <span>${formatCurrency(advance, currency)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#888;font-style:italic;">
                <span>Remaining Balance</span>
                <span>${formatCurrency(remaining, currency)}</span>
              </div>
            ` : ''}

            <div style="display:flex;justify-content:space-between;padding:16px;margin-top:16px;background:#111;border-radius:8px;font-size:18px;font-weight:900;color:#fff;">
              <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;align-self:center;">${typeLabel}</span>
              <span>${formatCurrency(amountDue, currency)}</span>
            </div>
            ${type === 'Advance Invoice' ? `
              <div style="font-size:10px;color:#666;margin-top:8px;text-align:right;line-height:1.4;">
                This represents the ${advancePercent}% advance required to commence work.<br/>
                The remaining <strong>${formatCurrency(remaining, currency)}</strong> will be due upon final delivery.
              </div>
            ` : ''}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:40px;padding-top:40px;border-top:1px solid #e5e5e5;position:relative;z-index:1;">
          <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:12px;">Payment Info & Terms</div>
            <div style="font-size:13px;color:#333;margin-bottom:12px;line-height:1.6;">
              ${provider.bankName ? `<strong>Bank:</strong> ${provider.bankName} · ` : ''}
              ${provider.accNumber ? `<strong>A/C:</strong> ${provider.accNumber} · ` : ''}
              ${provider.ifscCode ? `<strong>IFSC:</strong> ${provider.ifscCode}` : ''}
            </div>
            <div style="font-size:12px;color:#777;line-height:1.6;white-space:pre-line;">${type === 'Advance Invoice' ? '<strong>This is an advance invoice.</strong>\n' : ''}${type === 'Final Invoice' ? '<strong>This is a final invoice.</strong>\n' : ''}${notes || 'Payment due within 7 days.'}</div>
          </div>
        </div>
      </div>
    `,
    text: fullText
  };
}
