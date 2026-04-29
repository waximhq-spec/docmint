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
    projectGoal = '',
    scopeOfWork = '',
    serviceType = 'Video Production',
    timeline = '',
    budget = '',
    revisions = '2',
    includeExclusions = false,
    tone = 'Premium',
  } = data;

  const config = PROJECT_CONFIGS[serviceType] || PROJECT_CONFIGS['Video Production'];
  const budgetNum = parseFloat(budget) || 0;
  const currency = provider.currency || 'INR';

  const toneText = config.tone === 'Fast' ? 'We are ready to move quickly' : config.tone === 'Premium' ? 'It is our privilege' : 'We are pleased';

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:40px;background:#fff;line-height:1.6;">
        <div style="margin-bottom:60px;border-bottom:1px solid #eee;padding-bottom:24px;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px;">Proposal For</div>
          <h1 style="font-size:28px;font-weight:900;letter-spacing:-0.5px;margin-bottom:4px;">${data.projectTitle}</h1>
          <p style="color:#555;font-size:14px;">Prepared for ${data.clientName} · ${formatDate()}</p>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">1. Introduction</h2>
          <p>Dear ${data.clientName},</p>
          <p style="margin-top:12px;">${toneText} to present this proposal for your upcoming <strong>${serviceType}</strong> project. Based on our preliminary discussions, we have outlined a strategy tailored to help <strong>${data.companyName || data.clientName}</strong> achieve its vision.</p>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">2. Project Understanding</h2>
          <p>The primary objective is <strong>${projectGoal || 'to deliver high-quality creative assets'}</strong>. We will execute a comprehensive strategy focused on ${serviceType.toLowerCase()} excellence.</p>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">3. Tailored Scope of Work</h2>
          <div style="font-size:14px;color:#333;">
            <div style="white-space:pre-line;line-height:1.8;">${config.scope}</div>
            ${scopeOfWork ? `<div style="margin-top:20px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;white-space:pre-line;"><strong>Specific Deliverables:</strong>\n${scopeOfWork}</div>` : ''}
          </div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">4. Timeline & Investment</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 0;">Estimated Timeline</td>
              <td style="padding:12px 0;text-align:right;font-weight:700;white-space:pre-line;">${timeline || config.timeline}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 0;">Revision Rounds</td>
              <td style="padding:12px 0;text-align:right;font-weight:700;">${revisions} Included</td>
            </tr>
            <tr>
              <td style="padding:16px 0;font-size:16px;"><strong>Total Project Investment</strong></td>
              <td style="padding:16px 0;text-align:right;font-size:18px;font-weight:900;">${formatCurrency(budgetNum, currency)}</td>
            </tr>
          </table>
        </div>

        ${includeExclusions ? `
        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">5. Exclusions</h2>
          <ul style="font-size:13px;color:#555;padding-left:18px;">
            <li>Third-party costs (location permits, props, talent fees).</li>
            <li>Additional revisions beyond the agreed ${revisions} rounds.</li>
          </ul>
        </div>` : ''}

        <div style="border-top:1px solid #eee;padding-top:40px;margin-top:60px;text-align:center;">
          <p style="font-size:15px;color:#333;margin-bottom:24px;">We look forward to moving forward upon your approval.</p>
          <div style="font-size:14px;font-weight:700;">${provider.name}</div>
          <div style="font-size:12px;color:#888;">${provider.email}</div>
        </div>
      </div>
    `,
    text: `PROPOSAL: ${data.projectTitle}\nProject Type: ${serviceType}`
  };
}

export function generateContract(data, provider) {
  const {
    serviceType = 'Video Production',
    scopeOfWork = '',
    timeline = '',
    totalAmount = '',
    advancePercent = '50',
    paymentMethod = 'Bank Transfer',
    includeOwnership = true,
    includeLateFee = true,
    includeNDA = false,
  } = data;

  const config = PROJECT_CONFIGS[serviceType] || PROJECT_CONFIGS['Video Production'];
  const total = parseFloat(totalAmount) || 0;
  const currency = provider.currency || 'INR';
  const advance = (total * parseFloat(advancePercent)) / 100;
  const balance = total - advance;

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:60px;background:#fff;line-height:1.7;font-size:13px;">
        <div style="text-align:center;margin-bottom:60px;">
          <h1 style="font-size:24px;font-weight:900;letter-spacing:-0.5px;text-transform:uppercase;margin-bottom:4px;">Service Agreement</h1>
          <p style="color:#888;font-size:12px;">Type: ${serviceType}</p>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">1. The Parties</h2>
          <p>This Agreement is entered into on <strong>${formatDate()}</strong> between <strong>${provider.name}</strong> ("Provider") and <strong>${data.clientName}</strong> ("Client").</p>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">2. Scope of Services</h2>
          <p>The Provider agrees to perform the following ${serviceType.toLowerCase()} services:</p>
          <div style="margin-top:12px;padding:16px;background:#f9f9f9;border-radius:4px;white-space:pre-line;line-height:1.6;">
            <strong>Core Scope:</strong>\n${config.scope}
            ${scopeOfWork ? `\n\n<strong>Project-Specific Details:</strong>\n${scopeOfWork}` : ''}
          </div>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">3. Compensation</h2>
          <p>Total Fee: <strong>${formatCurrency(total, currency)}</strong></p>
          <ul style="margin-top:8px;padding-left:20px;">
            <li>Advance Payment: ${formatCurrency(advance, currency)} (${advancePercent}%)</li>
            <li>Final Payment: ${formatCurrency(balance, currency)} (due upon completion)</li>
          </ul>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">4. Timeline</h2>
          <p>The estimated timeframe is <strong>${timeline || config.timeline}</strong> from the date of advance payment.</p>
        </div>

        ${includeOwnership ? `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">5. Intellectual Property</h2>
          <p>Rights transfer to the Client after full and final payment.</p>
        </div>` : ''}

        ${includeLateFee ? `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">6. Late Payment</h2>
          <p>A 5% weekly penalty applies to overdue balances.</p>
        </div>` : ''}

        <div style="margin-top:80px;display:flex;gap:60px;">
          <div style="flex:1;">
            <div style="height:60px;border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-weight:700;">${provider.name}</div>
          </div>
          <div style="flex:1;">
            <div style="height:60px;border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-weight:700;">${data.clientName}</div>
          </div>
        </div>
      </div>
    `,
    text: `CONTRACT: ${data.projectTitle}\nType: ${serviceType}`
  };
}

export function generateInvoice(data, provider) {
  const {
    items = [],
    expenses = [],
    invoiceNumber = 'INV-001',
    invoiceDate = new Date(),
    dueDate,
    type = 'Full Payment',
    status = 'Unpaid',
    gstEnabled = false,
    gstRate = 18,
    discount = 0,
    advancePaid = 0,
    notes = '',
  } = data;

  const currency = provider.currency || 'INR';
  const subtotalItems = items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.rate) || 0), 0);
  const subtotalExpenses = expenses.reduce((acc, exp) => acc + (parseFloat(exp.amount) || 0), 0);
  const subtotal = subtotalItems + subtotalExpenses;
  
  const discountAmount = parseFloat(discount) || 0;
  const afterDiscount = subtotal - discountAmount;
  
  const gstAmount = gstEnabled ? (afterDiscount * gstRate) / 100 : 0;
  const total = afterDiscount + gstAmount;
  
  let amountDue = total;
  if (type === 'Advance Invoice' || type === 'Milestone Invoice') {
    amountDue = parseFloat(data.advanceRequested) || (total / 2);
  } else if (type === 'Final Invoice') {
    amountDue = total - parseFloat(advancePaid);
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

        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;position:relative;z-index:1;">
          <thead>
            <tr style="border-bottom:2px solid #111;">
              <th style="text-align:left;padding:12px 8px;font-size:10px;font-weight:700;text-transform:uppercase;color:#888;">Services</th>
              <th style="text-align:center;padding:12px 8px;font-size:10px;font-weight:700;text-transform:uppercase;color:#888;width:60px;">Qty</th>
              <th style="text-align:right;padding:12px 8px;font-size:10px;font-weight:700;text-transform:uppercase;color:#888;width:120px;">Rate</th>
              <th style="text-align:right;padding:12px 8px;font-size:10px;font-weight:700;text-transform:uppercase;color:#888;width:120px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom:1px solid #e5e5e5;">
                <td style="padding:16px 8px;font-size:14px;font-weight:500;">${item.desc}</td>
                <td style="padding:16px 8px;font-size:14px;text-align:center;">${item.qty}</td>
                <td style="padding:16px 8px;font-size:14px;text-align:right;">${formatCurrency(item.rate, currency)}</td>
                <td style="padding:16px 8px;font-size:14px;font-weight:700;text-align:right;">${formatCurrency(item.qty * item.rate, currency)}</td>
              </tr>
            `).join('')}
            
            ${expenses.length > 0 ? `
              <tr>
                <td colspan="4" style="padding:24px 8px 8px 8px;font-size:10px;font-weight:800;text-transform:uppercase;color:#888;">Reimbursable Expenses</td>
              </tr>
              ${expenses.map(exp => `
                <tr style="border-bottom:1px solid #e5e5e5;">
                  <td colspan="3" style="padding:12px 8px;font-size:13px;">${exp.desc}</td>
                  <td style="padding:12px 8px;font-size:13px;font-weight:700;text-align:right;">${formatCurrency(exp.amount, currency)}</td>
                </tr>
              `).join('')}
            ` : ''}
          </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;position:relative;z-index:1;">
          <div>
            ${qrCodeHtml}
          </div>
          <div style="width:280px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
              <span>Subtotal</span>
              <span>${formatCurrency(subtotal, currency)}</span>
            </div>
            ${discountAmount > 0 ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#d93025;">
                <span>Discount</span>
                <span>-${formatCurrency(discountAmount, currency)}</span>
              </div>
            ` : ''}
            ${gstEnabled ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
                <span>GST (${gstRate}%)</span>
                <span>${formatCurrency(gstAmount, currency)}</span>
              </div>
            ` : ''}
            <div style="display:flex;justify-content:space-between;padding:12px 0;margin-top:8px;border-top:1px solid #e5e5e5;font-size:15px;font-weight:700;color:#111;">
              <span>Total</span>
              <span>${formatCurrency(total, currency)}</span>
            </div>
            
            ${type !== 'Full Payment' ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#888;font-style:italic;">
                <span>${type === 'Final Invoice' ? 'Advance Paid' : 'Requested'}</span>
                <span>${formatCurrency(type === 'Final Invoice' ? advancePaid : amountDue, currency)}</span>
              </div>
            ` : ''}

            <div style="display:flex;justify-content:space-between;padding:16px;margin-top:16px;background:#111;border-radius:8px;font-size:18px;font-weight:900;color:#fff;">
              <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;align-self:center;">Balance Due</span>
              <span>${formatCurrency(amountDue, currency)}</span>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:40px;padding-top:40px;border-top:1px solid #e5e5e5;position:relative;z-index:1;">
          <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:12px;">Payment Info & Terms</div>
            <div style="font-size:13px;color:#333;margin-bottom:12px;line-height:1.6;">
              ${provider.bankName ? `<strong>Bank:</strong> ${provider.bankName} · ` : ''}
              ${provider.accNumber ? `<strong>A/C:</strong> ${provider.accNumber} · ` : ''}
              ${provider.ifscCode ? `<strong>IFSC:</strong> ${provider.ifscCode}` : ''}
              ${provider.upiId ? `<br/><strong>UPI ID:</strong> ${provider.upiId}` : ''}
            </div>
            <div style="font-size:12px;color:#777;line-height:1.6;white-space:pre-line;">${notes || 'Payment due within 7 days.\nLate payments incur a 5% fee after the due date.'}</div>
          </div>
          <div style="text-align:right;">
            <div style="margin-bottom:32px;">
              <div style="width:160px;height:60px;margin-left:auto;border-bottom:1px solid #111;"></div>
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;margin-top:8px;">Authorized Signature</div>
              <div style="font-size:12px;color:#888;">${provider.name}</div>
            </div>
          </div>
        </div>
      </div>
    `,
    text: `INVOICE ${invoiceNumber}`
  };
}

export function generateClientBrief(data) {
  const briefFields = {
    'Video Production': [
      { key: 'goal', label: 'Goal of the Video', placeholder: 'Brand awareness, product launch, tutorial...' },
      { key: 'references', label: 'References / Inspiration', placeholder: 'YouTube links, video styles, competitor examples...' },
      { key: 'platform', label: 'Target Platform', placeholder: 'YouTube, Instagram Reels, LinkedIn, Website...' },
      { key: 'tone', label: 'Tone & Style', placeholder: 'Cinematic, energetic, minimalist, documentary...' },
    ],
    'Website Development': [
      { key: 'pages', label: 'Number of Pages', placeholder: 'Home, About, Services, Contact...' },
      { key: 'design', label: 'Design Preference', placeholder: 'Minimal, bold, colorful, dark mode...' },
      { key: 'competitors', label: 'Competitor References', placeholder: 'Websites you like or want to beat...' },
      { key: 'features', label: 'Features Needed', placeholder: 'Contact form, CMS, e-commerce, animations...' },
    ],
    'Solar Installation': [
      { key: 'location', label: 'Installation Location', placeholder: 'City, state, roof access details...' },
      { key: 'usage', label: 'Monthly Electricity Usage', placeholder: 'Average monthly bill or kWh usage...' },
      { key: 'roofType', label: 'Roof Type', placeholder: 'Flat, sloped, concrete, tin, terrace...' },
      { key: 'budget', label: 'Estimated Budget', placeholder: 'Approximate budget or range...' },
    ],
  };

  return briefFields[data.projectType] || briefFields['Video Production'];
}
