import { formatDate, formatCurrency } from '../utils/helpers';

export function generateProposal(data, provider) {
  const {
    projectGoal = '',
    scopeOfWork = '',
    serviceType = 'Video Production',
    timeline = '',
    budget = '',
    revisions = '2',
    includeExclusions = false,
    includeAddons = false,
    tone = 'Premium',
  } = data;

  const budgetNum = parseFloat(budget) || 0;

  // Structured Scope based on service type
  let structuredScopeHtml = '';
  if (serviceType === 'Video Production') {
    structuredScopeHtml = `
      <div style="margin-bottom:16px;"><strong>Phase 1: Pre-production</strong><br/>Concept development, scriptwriting, and planning.</div>
      <div style="margin-bottom:16px;"><strong>Phase 2: Production</strong><br/>On-site filming, equipment, and directing.</div>
      <div style="margin-bottom:16px;"><strong>Phase 3: Post-production</strong><br/>Editing, color grading, sound design, and final delivery.</div>
    `;
  } else if (serviceType === 'Website Development') {
    structuredScopeHtml = `
      <div style="margin-bottom:16px;"><strong>Phase 1: Design</strong><br/>UI/UX wireframes, visual design, and feedback cycles.</div>
      <div style="margin-bottom:16px;"><strong>Phase 2: Development</strong><br/>Frontend & backend coding, CMS integration.</div>
      <div style="margin-bottom:16px;"><strong>Phase 3: Deployment</strong><br/>Testing, bug fixes, and live launch.</div>
    `;
  } else {
    structuredScopeHtml = `
      <div style="margin-bottom:16px;"><strong>Phase 1: Assessment</strong><br/>Site survey and technical requirement gathering.</div>
      <div style="margin-bottom:16px;"><strong>Phase 2: Installation</strong><br/>Panel mounting, wiring, and inverter setup.</div>
      <div style="margin-bottom:16px;"><strong>Phase 3: Support</strong><br/>Connection to grid and post-install maintenance overview.</div>
    `;
  }

  const toneText = tone === 'Friendly' ? 'We are super excited' : tone === 'Premium' ? 'It is our privilege' : 'We are pleased';

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
          <p style="margin-top:12px;">${toneText} to present this proposal for your upcoming project. Based on our preliminary discussions, we have outlined a strategy tailored to help <strong>${data.companyName || data.clientName}</strong> achieve its vision.</p>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">2. Project Understanding</h2>
          <p>Based on your requirements, we understand that the primary objective is <strong>${projectGoal}</strong>. To achieve this, we will execute a comprehensive <strong>${serviceType}</strong> strategy focused on high-quality deliverables and measurable results.</p>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">3. Structured Scope of Work</h2>
          <div style="font-size:14px;color:#333;">
            ${structuredScopeHtml}
            <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;white-space:pre-line;"><strong>Specific Deliverables:</strong>\n${scopeOfWork}</div>
          </div>
        </div>

        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">4. Timeline & Investment</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 0;">Estimated Timeline</td>
              <td style="padding:12px 0;text-align:right;font-weight:700;">${timeline}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px 0;">Revision Rounds</td>
              <td style="padding:12px 0;text-align:right;font-weight:700;">${revisions} Included</td>
            </tr>
            <tr>
              <td style="padding:16px 0;font-size:16px;"><strong>Total Project Investment</strong></td>
              <td style="padding:16px 0;text-align:right;font-size:18px;font-weight:900;">${formatCurrency(budgetNum)}</td>
            </tr>
          </table>
        </div>

        ${includeExclusions ? `
        <div style="margin-bottom:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:16px;">5. Exclusions</h2>
          <ul style="font-size:13px;color:#555;padding-left:18px;">
            <li>Third-party software or license fees.</li>
            <li>Additional revision rounds beyond the agreed limit.</li>
            <li>Out-of-scope features or major concept pivots.</li>
          </ul>
        </div>` : ''}

        <div style="border-top:1px solid #eee;padding-top:40px;margin-top:60px;text-align:center;">
          <p style="font-size:15px;color:#333;margin-bottom:24px;">We’d be happy to move forward upon your approval.</p>
          <div style="font-size:14px;font-weight:700;">${provider.name}</div>
          <div style="font-size:12px;color:#888;">${provider.email}</div>
        </div>
      </div>
    `,
    text: `PROPOSAL: ${data.projectTitle}\nClient: ${data.clientName}\nBudget: ${formatCurrency(budgetNum)}`
  };
}

export function generateContract(data, provider) {
  const {
    serviceType = '',
    scopeOfWork = '',
    timeline = '',
    totalAmount = '',
    advancePercent = '50',
    paymentMethod = 'Bank Transfer',
    includeOwnership = true,
    includeLateFee = true,
    includeNDA = false,
    includeCancellation = true,
    includePortfolio = true,
  } = data;

  const total = parseFloat(totalAmount) || 0;
  const advance = (total * parseFloat(advancePercent)) / 100;
  const balance = total - advance;

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:60px;background:#fff;line-height:1.7;font-size:13px;">
        <div style="text-align:center;margin-bottom:60px;">
          <h1 style="font-size:24px;font-weight:900;letter-spacing:-0.5px;text-transform:uppercase;margin-bottom:4px;">Service Agreement</h1>
          <p style="color:#888;font-size:12px;">Agreement Ref: ${new Date().getFullYear()}/${Math.floor(Math.random()*9000)+1000}</p>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">1. The Parties</h2>
          <p>This Service Agreement ("Agreement") is entered into on <strong>${formatDate()}</strong> between:</p>
          <p style="margin-top:8px;"><strong>Service Provider:</strong> ${provider.name}, located at ${provider.address || 'Registered Address'} ("Provider")</p>
          <p><strong>Client:</strong> ${data.clientName}${data.companyName ? ', ' + data.companyName : ''} ("Client")</p>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">2. Scope of Services</h2>
          <p>The Provider agrees to perform the following services for the Client:</p>
          <div style="margin-top:12px;padding:16px;background:#f9f9f9;border-radius:4px;white-space:pre-line;"><strong>${data.projectTitle}</strong>\n${scopeOfWork}</div>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">3. Compensation & Payment</h2>
          <p>The Client agrees to pay the Provider a total fee of <strong>${formatCurrency(total)}</strong> for the services described above.</p>
          <ul style="margin-top:12px;padding-left:20px;">
            <li><strong>Advance Payment:</strong> ${formatCurrency(advance)} (${advancePercent}% due on signing)</li>
            <li><strong>Final Payment:</strong> ${formatCurrency(balance)} (due upon completion)</li>
            <li><strong>Method:</strong> Payment via ${paymentMethod}</li>
          </ul>
        </div>

        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">4. Timeline</h2>
          <p>The estimated timeframe for completion is <strong>${timeline}</strong>. Delays from the client side (e.g. failure to provide materials or feedback within 48 hours) may affect the final delivery date.</p>
        </div>

        ${includeOwnership ? `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">5. Intellectual Property</h2>
          <p>Upon receipt of full and final payment, all intellectual property rights for the work created under this agreement shall transfer to the Client. The Provider retains ownership until the balance is cleared in full.</p>
        </div>` : ''}

        ${includeNDA ? `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">6. Confidentiality (NDA)</h2>
          <p>Both parties agree to protect and keep confidential any sensitive business information, trade secrets, or proprietary data shared during the course of this project.</p>
        </div>` : ''}

        ${includeLateFee ? `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">7. Late Payment Terms</h2>
          <p>Payments not received within 7 days of the invoice date will incur a <strong>5% late fee</strong> for every 7-day period the balance remains outstanding.</p>
        </div>` : ''}

        ${includeCancellation ? `
        <div style="margin-bottom:32px;">
          <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">8. Cancellation Policy</h2>
          <p>If the Client cancels the project after signing, the advance payment is non-refundable. The Client shall also be liable for all work completed up to the date of cancellation.</p>
        </div>` : ''}

        <div style="margin-top:80px;display:flex;gap:60px;">
          <div style="flex:1;">
            <div style="height:60px;border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-weight:700;">${provider.name}</div>
            <div style="font-size:11px;color:#888;">Authorized Provider Signature</div>
          </div>
          <div style="flex:1;">
            <div style="height:60px;border-bottom:1px solid #111;margin-bottom:8px;"></div>
            <div style="font-weight:700;">${data.clientName}</div>
            <div style="font-size:11px;color:#888;">Authorized Client Signature</div>
          </div>
        </div>
      </div>
    `,
    text: `CONTRACT: ${data.projectTitle}\nClient: ${data.clientName}\nTotal: ${formatCurrency(total)}`
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
  if (provider.upiId && status !== 'Paid') {
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
                <td style="padding:16px 8px;font-size:14px;text-align:right;">${formatCurrency(item.rate)}</td>
                <td style="padding:16px 8px;font-size:14px;font-weight:700;text-align:right;">${formatCurrency(item.qty * item.rate)}</td>
              </tr>
            `).join('')}
            
            ${expenses.length > 0 ? `
              <tr>
                <td colspan="4" style="padding:24px 8px 8px 8px;font-size:10px;font-weight:800;text-transform:uppercase;color:#888;">Reimbursable Expenses</td>
              </tr>
              ${expenses.map(exp => `
                <tr style="border-bottom:1px solid #e5e5e5;">
                  <td colspan="3" style="padding:12px 8px;font-size:13px;">${exp.desc}</td>
                  <td style="padding:12px 8px;font-size:13px;font-weight:700;text-align:right;">${formatCurrency(exp.amount)}</td>
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
              <span>${formatCurrency(subtotal)}</span>
            </div>
            ${discountAmount > 0 ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#d93025;">
                <span>Discount</span>
                <span>-${formatCurrency(discountAmount)}</span>
              </div>
            ` : ''}
            ${gstEnabled ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
                <span>GST (${gstRate}%)</span>
                <span>${formatCurrency(gstAmount)}</span>
              </div>
            ` : ''}
            <div style="display:flex;justify-content:space-between;padding:12px 0;margin-top:8px;border-top:1px solid #e5e5e5;font-size:15px;font-weight:700;color:#111;">
              <span>Total</span>
              <span>${formatCurrency(total)}</span>
            </div>
            
            ${type !== 'Full Payment' ? `
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;color:#888;font-style:italic;">
                <span>${type === 'Final Invoice' ? 'Advance Paid' : 'Requested'}</span>
                <span>${formatCurrency(type === 'Final Invoice' ? advancePaid : amountDue)}</span>
              </div>
            ` : ''}

            <div style="display:flex;justify-content:space-between;padding:16px;margin-top:16px;background:#111;border-radius:8px;font-size:18px;font-weight:900;color:#fff;">
              <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;align-self:center;">Balance Due</span>
              <span>${formatCurrency(amountDue)}</span>
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
