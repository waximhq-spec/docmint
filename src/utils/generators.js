import { formatDate, formatCurrency } from '../utils/helpers';

export function generateProposal(data, provider) {
  const advance = (parseFloat(data.totalPrice) * parseFloat(data.advancePercent)) / 100;
  const remaining = parseFloat(data.totalPrice) - advance;

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <div style="margin-bottom:40px;">
          <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:8px;">Project Proposal</div>
          <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px;">${data.projectTitle}</h1>
          <p style="color:#555;font-size:14px;">Prepared for ${data.clientName} · ${formatDate()}</p>
        </div>

        <div style="margin-bottom:28px;">
          <p style="font-size:15px;line-height:1.8;">Dear <strong>${data.clientName}</strong>,</p>
          <p style="margin-top:12px;line-height:1.8;color:#333;">Thank you for considering <strong>${provider.name}</strong> for your project. We are excited about the opportunity to work with <strong>${data.companyName || data.clientName}</strong> and are confident that we can deliver exceptional results that align with your vision and goals.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Project Overview</h2>
          <p style="line-height:1.8;"><strong>Project Type:</strong> ${data.projectType}</p>
          <p style="line-height:1.8;"><strong>Estimated Timeline:</strong> ${data.timeline}</p>
          <p style="line-height:1.8;"><strong>Revisions Included:</strong> ${data.revisions} rounds</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Scope of Work</h2>
          <p style="line-height:1.8;white-space:pre-line;">${data.scopeOfWork}</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:16px;">Investment</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f7f7f7;">
              <td style="padding:12px 16px;font-size:13px;border-bottom:1px solid #e5e5e5;"><strong>Total Project Investment</strong></td>
              <td style="padding:12px 16px;font-size:13px;border-bottom:1px solid #e5e5e5;text-align:right;">${formatCurrency(data.totalPrice)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:13px;border-bottom:1px solid #e5e5e5;color:#555;">Advance Payment (${data.advancePercent}%)</td>
              <td style="padding:12px 16px;font-size:13px;border-bottom:1px solid #e5e5e5;text-align:right;color:#555;">${formatCurrency(advance)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:13px;color:#555;">Balance on Delivery (${100 - parseFloat(data.advancePercent)}%)</td>
              <td style="padding:12px 16px;font-size:13px;text-align:right;color:#555;">${formatCurrency(remaining)}</td>
            </tr>
          </table>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <p style="line-height:1.8;color:#333;">Warm regards,<br/><strong>${provider.name}</strong><br/>${provider.email}${provider.phone ? ' · ' + provider.phone : ''}</p>
        </div>
      </div>
    `,
    text: `PROJECT PROPOSAL — ${data.projectTitle}`
  };
}

export function generateContract(data, provider) {
  const advance = (parseFloat(data.totalPrice) * parseFloat(data.advancePercent)) / 100;
  const remaining = parseFloat(data.totalPrice) - advance;

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:36px;padding-bottom:28px;border-bottom:2px solid #111;">
          <h1 style="font-size:22px;font-weight:800;letter-spacing:-0.3px;margin-bottom:4px;">SERVICE AGREEMENT</h1>
          <p style="font-size:13px;color:#888;">Dated: ${formatDate()}</p>
        </div>

        <div style="margin-bottom:28px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">1. Parties</h2>
          <p style="line-height:1.8;">This Agreement is entered into between:</p>
          <ul style="list-style:none;margin-top:12px;padding:0;">
            <li style="padding:10px 0;border-bottom:1px solid #e5e5e5;"><strong>Provider:</strong> ${provider.name}, ${provider.address || ''}</li>
            <li style="padding:10px 0;"><strong>Client:</strong> ${data.clientName}${data.companyName ? ', ' + data.companyName : ''}</li>
          </ul>
        </div>

        <div style="border-top:2px solid #111;padding-top:32px;margin-top:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:24px;">Signatures</h2>
          <div style="display:flex;gap:40px;">
            <div style="flex:1;">
              <p style="font-size:13px;color:#555;margin-bottom:40px;">For ${provider.name}</p>
              <div style="border-top:1px solid #111;padding-top:8px;">
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${provider.name}</p>
              </div>
            </div>
            <div style="flex:1;">
              <p style="font-size:13px;color:#555;margin-bottom:40px;">Client</p>
              <div style="border-top:1px solid #111;padding-top:8px;">
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${data.clientName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    text: `SERVICE AGREEMENT — ${data.projectTitle}`
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
    milestoneName = '',
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

  // Watermark for Unpaid
  const watermarkHtml = status === 'Unpaid' || status === 'Due' ? `
    <div style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;font-weight:900;color:rgba(217,48,37,0.08);pointer-events:none;z-index:0;text-transform:uppercase;white-space:nowrap;letter-spacing:10px;">
      Pending Payment
    </div>
  ` : '';

  // UPI QR Code
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
              ${provider.upiId ? `<br/><strong>UPI:</strong> ${provider.upiId}` : ''}
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
    text: `INVOICE ${invoiceNumber} — ${status}`
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
