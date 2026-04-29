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

        ${data.includeOwnership ? `
        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Ownership Rights</h2>
          <p style="line-height:1.8;color:#333;">Upon receipt of full payment, all intellectual property rights, including copyright, for the deliverables produced under this project will be transferred to ${data.clientName}. ${provider.name} retains the right to showcase the work in its portfolio unless otherwise agreed in writing.</p>
        </div>` : ''}

        ${data.includeMaintenance ? `
        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Post-Delivery Support</h2>
          <p style="line-height:1.8;color:#333;">We offer a 30-day post-delivery support period to address any minor adjustments or issues. Extended maintenance packages are available and can be discussed separately.</p>
        </div>` : ''}

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <p style="line-height:1.8;color:#333;">We look forward to the possibility of collaborating with you on this project. Please do not hesitate to reach out if you have any questions or require further information. We are ready to begin immediately upon your approval.</p>
          <p style="margin-top:16px;line-height:1.8;">Warm regards,<br/><strong>${provider.name}</strong><br/>${provider.email}${provider.phone ? ' · ' + provider.phone : ''}</p>
        </div>
      </div>
    `,
    text: `PROJECT PROPOSAL — ${data.projectTitle}\nPrepared for ${data.clientName} · ${formatDate()}\n\nDear ${data.clientName},\n\nThank you for considering ${provider.name} for your project...\n\nScope: ${data.scopeOfWork}\nTimeline: ${data.timeline}\nTotal: ${formatCurrency(data.totalPrice)}\nAdvance (${data.advancePercent}%): ${formatCurrency(advance)}\nBalance: ${formatCurrency(remaining)}`
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
          <p style="line-height:1.8;">This Service Agreement ("Agreement") is entered into as of <strong>${formatDate()}</strong>, between:</p>
          <ul style="list-style:none;margin-top:12px;padding:0;">
            <li style="padding:10px 0;border-bottom:1px solid #e5e5e5;"><strong>Service Provider:</strong> ${provider.name}, ${provider.address || ''}</li>
            <li style="padding:10px 0;"><strong>Client:</strong> ${data.clientName}${data.companyName ? ', ' + data.companyName : ''} ("Client")</li>
          </ul>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">2. Project & Scope of Work</h2>
          <p style="line-height:1.8;"><strong>Project Title:</strong> ${data.projectTitle}</p>
          <p style="line-height:1.8;"><strong>Project Type:</strong> ${data.projectType}</p>
          <p style="margin-top:10px;line-height:1.8;white-space:pre-line;">${data.scopeOfWork}</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">3. Payment Terms</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:8px 0;border-bottom:1px solid #e5e5e5;">Total Project Value: <strong>${formatCurrency(data.totalPrice)}</strong></li>
            <li style="padding:8px 0;border-bottom:1px solid #e5e5e5;">Advance Payment (${data.advancePercent}% — due before work begins): <strong>${formatCurrency(advance)}</strong></li>
            <li style="padding:8px 0;">Final Payment (${100 - parseFloat(data.advancePercent)}% — due upon delivery): <strong>${formatCurrency(remaining)}</strong></li>
          </ul>
          <p style="margin-top:12px;line-height:1.8;color:#555;font-size:13px;">Payment must be made via bank transfer or agreed payment method. Work will not commence until the advance payment is received in full.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">4. Timeline & Delivery</h2>
          <p style="line-height:1.8;">The estimated project timeline is <strong>${data.timeline}</strong> from the date of advance payment receipt and confirmation of all required materials from the Client. Delays caused by the Client's failure to provide timely feedback or materials will extend the delivery timeline accordingly.</p>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">5. Revisions Policy</h2>
          <p style="line-height:1.8;">This agreement includes <strong>${data.revisions} round(s) of revisions</strong>. Each revision round must be submitted as a consolidated list of changes. Additional revisions beyond this limit will be billed at an hourly rate to be agreed upon. Revisions are limited to modifications within the original scope; requests for new features or significant changes will be treated as additional work.</p>
        </div>

        ${data.includeOwnership ? `
        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">6. Intellectual Property & Ownership</h2>
          <p style="line-height:1.8;">Upon receipt of full and final payment, all intellectual property rights — including but not limited to copyright, design rights, and related rights — in all deliverables created under this Agreement shall be assigned to the Client. Until full payment is received, all rights remain with ${provider.name}. The Service Provider retains the right to display the work in its portfolio and marketing materials unless otherwise agreed in writing.</p>
        </div>` : ''}

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">${data.includeOwnership ? '7' : '6'}. Cancellation Clause</h2>
          <p style="line-height:1.8;">Either party may terminate this Agreement with 7 days written notice. In the event of cancellation by the Client after work has commenced, the advance payment is non-refundable. Payment for all work completed up to the date of cancellation will be due. In the event of cancellation by the Service Provider, a pro-rated refund of the advance will be issued based on work not yet completed.</p>
        </div>

        <div style="border-top:2px solid #111;padding-top:32px;margin-top:40px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:24px;">Signatures</h2>
          <div style="display:flex;gap:40px;">
            <div style="flex:1;">
              <p style="font-size:13px;color:#555;margin-bottom:40px;">For & On Behalf of ${provider.name}</p>
              <div style="border-top:1px solid #111;padding-top:8px;">
                <p style="font-size:12px;color:#888;">Authorized Signature</p>
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${provider.name}</p>
                <p style="font-size:12px;color:#888;">Date: _______________</p>
              </div>
            </div>
            <div style="flex:1;">
              <p style="font-size:13px;color:#555;margin-bottom:40px;">Client</p>
              <div style="border-top:1px solid #111;padding-top:8px;">
                <p style="font-size:12px;color:#888;">Authorized Signature</p>
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${data.clientName}</p>
                <p style="font-size:12px;color:#888;">Date: _______________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    text: `SERVICE AGREEMENT\n\nParties:\nProvider: ${provider.name}\nClient: ${data.clientName}\n\nProject: ${data.projectTitle}\nTotal: ${formatCurrency(data.totalPrice)}\nTimeline: ${data.timeline}`
  };
}

export function generateInvoice(data, provider) {
  const {
    items = [],
    invoiceNumber = 'INV-001',
    invoiceDate = new Date(),
    dueDate,
    type = 'Full Payment',
    status = 'Unpaid',
    gstEnabled = false,
    gstRate = 18,
    advancePaid = 0,
    notes = '',
  } = data;

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.qty) * parseFloat(item.rate) || 0), 0);
  const gstAmount = gstEnabled ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gstAmount;
  
  let amountDue = total;
  
  if (type === 'Advance Invoice') {
    amountDue = parseFloat(data.advanceRequested) || (total / 2);
  } else if (type === 'Final Invoice') {
    amountDue = total - parseFloat(advancePaid);
  }

  const statusColors = {
    'Paid': { bg: '#e6f4ea', text: '#1e8e3e' },
    'Partially Paid': { bg: '#fef7e0', text: '#b06000' },
    'Unpaid': { bg: '#fce8e6', text: '#d93025' },
    'Due': { bg: '#fce8e6', text: '#d93025' },
  };
  const sColor = statusColors[status] || statusColors['Unpaid'];

  // UPI QR Code logic
  let qrCodeHtml = '';
  if (provider.upiId) {
    const upiLink = `upi://pay?pa=${provider.upiId}&pn=${encodeURIComponent(provider.name)}&am=${amountDue}&cu=INR&tn=${encodeURIComponent('Invoice ' + invoiceNumber)}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`;
    qrCodeHtml = `
      <div style="text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:8px;">Scan to Pay (UPI)</div>
        <img src="${qrApiUrl}" width="120" height="120" style="border:1px solid #e5e5e5;padding:8px;border-radius:12px;background:#fff;" alt="UPI QR Code" />
        <div style="font-size:12px;font-weight:600;margin-top:6px;color:#111;">${provider.upiId}</div>
      </div>
    `;
  }

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;">
          <div>
            <h1 style="font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:8px;text-transform:uppercase;">Invoice</h1>
            <div style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;background:${sColor.bg};color:${sColor.text};">
              ${status}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:20px;font-weight:800;letter-spacing:-0.5px;">${invoiceNumber}</div>
            <div style="font-size:13px;color:#888;margin-top:4px;">Date: ${formatDate(new Date(invoiceDate))}</div>
            <div style="font-size:13px;color:#888;">Due: ${dueDate ? formatDate(new Date(dueDate)) : 'Upon Receipt'}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:48px;">
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">From</div>
            <div style="font-size:15px;font-weight:700;">${provider.name}</div>
            <div style="font-size:13px;color:#555;margin-top:4px;line-height:1.5;white-space:pre-line;">${provider.address || ''}</div>
            <div style="font-size:13px;color:#555;margin-top:4px;">${provider.email}</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Bill To</div>
            <div style="font-size:15px;font-weight:700;">${data.clientName}</div>
            <div style="font-size:13px;color:#555;margin-top:4px;line-height:1.5;">${data.companyName || ''}</div>
            <div style="font-size:13px;color:#555;margin-top:4px;">${data.email || ''}</div>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
          <thead>
            <tr style="border-bottom:2px solid #111;">
              <th style="text-align:left;padding:12px 8px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;">Description</th>
              <th style="text-align:center;padding:12px 8px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;width:60px;">Qty</th>
              <th style="text-align:right;padding:12px 8px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;width:120px;">Rate</th>
              <th style="text-align:right;padding:12px 8px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#888;width:120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom:1px solid #e5e5e5;">
                <td style="padding:16px 8px;font-size:14px;font-weight:500;">${item.desc}</td>
                <td style="padding:16px 8px;font-size:14px;text-align:center;">${item.qty}</td>
                <td style="padding:16px 8px;font-size:14px;text-align:right;">${formatCurrency(item.rate)}</td>
                <td style="padding:16px 8px;font-size:14px;font-weight:600;text-align:right;">${formatCurrency(item.qty * item.rate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;">
          <div style="width:150px;">
            ${qrCodeHtml}
          </div>
          <div style="width:280px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
              <span>Subtotal</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
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
              <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;color:#555;">
                <span>${type === 'Advance Invoice' ? 'Requested' : 'Advance Paid'}</span>
                <span>${formatCurrency(type === 'Advance Invoice' ? amountDue : advancePaid)}</span>
              </div>
            ` : ''}

            <div style="display:flex;justify-content:space-between;padding:16px 12px;margin-top:12px;background:#111;border-radius:8px;font-size:16px;font-weight:800;color:#fff;">
              <span>Amount Due</span>
              <span>${formatCurrency(amountDue)}</span>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;padding-top:32px;border-top:1px solid #e5e5e5;">
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Payment Details</div>
            ${provider.bankName ? `<div style="font-size:13px;margin-bottom:4px;"><strong>Bank:</strong> ${provider.bankName}</div>` : ''}
            ${provider.accNumber ? `<div style="font-size:13px;margin-bottom:4px;"><strong>A/C:</strong> ${provider.accNumber}</div>` : ''}
            ${provider.upiId ? `<div style="font-size:13px;margin-bottom:4px;"><strong>UPI ID:</strong> ${provider.upiId}</div>` : ''}
            ${provider.ifscCode ? `<div style="font-size:13px;"><strong>IFSC:</strong> ${provider.ifscCode}</div>` : ''}
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Notes & Terms</div>
            <div style="font-size:13px;color:#555;line-height:1.6;white-space:pre-line;">${notes || 'Payment due within 7 days.\nThank you for your business.'}</div>
          </div>
        </div>
      </div>
    `,
    text: `INVOICE ${invoiceNumber}\n\nStatus: ${status}\nTotal: ${formatCurrency(total)}\nAmount Due: ${formatCurrency(amountDue)}`
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
