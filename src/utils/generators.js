import { formatDate, agencyInfo, formatCurrency } from '../utils/helpers';

export function generateProposal(data) {
  const agency = agencyInfo();
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
          <p style="margin-top:12px;line-height:1.8;color:#333;">Thank you for considering <strong>${agency.name}</strong> for your project. We are excited about the opportunity to work with <strong>${data.companyName || data.clientName}</strong> and are confident that we can deliver exceptional results that align with your vision and goals.</p>
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
          <p style="line-height:1.8;color:#333;">Upon receipt of full payment, all intellectual property rights, including copyright, for the deliverables produced under this project will be transferred to ${data.clientName}. ${agency.name} retains the right to showcase the work in its portfolio unless otherwise agreed in writing.</p>
        </div>` : ''}

        ${data.includeMaintenance ? `
        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">Post-Delivery Support</h2>
          <p style="line-height:1.8;color:#333;">We offer a 30-day post-delivery support period to address any minor adjustments or issues. Extended maintenance packages are available and can be discussed separately.</p>
        </div>` : ''}

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <p style="line-height:1.8;color:#333;">We look forward to the possibility of collaborating with you on this project. Please do not hesitate to reach out if you have any questions or require further information. We are ready to begin immediately upon your approval.</p>
          <p style="margin-top:16px;line-height:1.8;">Warm regards,<br/><strong>${agency.name}</strong><br/>${agency.email} · ${agency.phone}</p>
        </div>
      </div>
    `,
    text: `PROJECT PROPOSAL — ${data.projectTitle}\nPrepared for ${data.clientName} · ${formatDate()}\n\nDear ${data.clientName},\n\nThank you for considering ${agency.name} for your project...\n\nScope: ${data.scopeOfWork}\nTimeline: ${data.timeline}\nTotal: ${formatCurrency(data.totalPrice)}\nAdvance (${data.advancePercent}%): ${formatCurrency(advance)}\nBalance: ${formatCurrency(remaining)}`
  };
}

export function generateContract(data) {
  const agency = agencyInfo();
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
            <li style="padding:10px 0;border-bottom:1px solid #e5e5e5;"><strong>Service Provider:</strong> ${agency.name}, ${agency.address} ("Agency")</li>
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
          <p style="line-height:1.8;">Upon receipt of full and final payment, all intellectual property rights — including but not limited to copyright, design rights, and related rights — in all deliverables created under this Agreement shall be assigned to the Client. Until full payment is received, all rights remain with ${agency.name}. The Agency retains the right to display the work in its portfolio and marketing materials unless otherwise agreed in writing.</p>
        </div>` : ''}

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">${data.includeOwnership ? '7' : '6'}. Cancellation Clause</h2>
          <p style="line-height:1.8;">Either party may terminate this Agreement with 7 days written notice. In the event of cancellation by the Client after work has commenced, the advance payment is non-refundable. Payment for all work completed up to the date of cancellation will be due. In the event of cancellation by the Agency, a pro-rated refund of the advance will be issued based on work not yet completed.</p>
        </div>

        ${data.includeMaintenance ? `
        <div style="border-top:1px solid #e5e5e5;padding-top:24px;margin-bottom:24px;">
          <h2 style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:12px;">${data.includeOwnership ? '8' : '7'}. Post-Delivery Maintenance</h2>
          <p style="line-height:1.8;">The Agency will provide a 30-day post-delivery support period at no additional charge to address minor corrections. This does not include new features, redesign, or scope changes. Ongoing maintenance beyond this period is subject to a separate maintenance agreement.</p>
        </div>` : ''}

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
                <p style="font-size:13px;font-weight:600;margin-top:4px;">${data.clientName}</p>
                <p style="font-size:12px;color:#888;">Date: _______________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    text: `SERVICE AGREEMENT\n\nParties:\nAgency: ${agency.name}\nClient: ${data.clientName}\n\nProject: ${data.projectTitle}\nTotal: ${formatCurrency(data.totalPrice)}\nTimeline: ${data.timeline}`
  };
}

export function generateInvoice(data, type = 'advance', invoiceNumber) {
  const agency = agencyInfo();
  const total = parseFloat(data.totalPrice) || 0;
  const advancePercent = parseFloat(data.advancePercent) || 50;
  const advance = (total * advancePercent) / 100;
  const remaining = total - advance;
  const amount = type === 'advance' ? advance : remaining;
  const label = type === 'advance'
    ? `Advance Payment (${advancePercent}%)`
    : `Final Payment (${100 - advancePercent}%)`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  return {
    html: `
      <div style="font-family:Inter,sans-serif;color:#111;max-width:720px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #111;">
          <div>
            <div style="font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px;">${agency.name}</div>
            <div style="font-size:13px;color:#888;">${agency.address}</div>
            <div style="font-size:13px;color:#888;">${agency.email}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:4px;">${type === 'advance' ? 'Advance Invoice' : 'Final Invoice'}</div>
            <div style="font-size:24px;font-weight:800;letter-spacing:-0.5px;">${invoiceNumber}</div>
            <div style="font-size:13px;color:#888;margin-top:4px;">Date: ${formatDate()}</div>
            <div style="font-size:13px;color:#888;">Due: ${formatDate(dueDate)}</div>
          </div>
        </div>

        <div style="margin-bottom:32px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#888;margin-bottom:8px;">Bill To</div>
          <div style="font-size:15px;font-weight:700;">${data.clientName}</div>
          ${data.companyName ? `<div style="font-size:14px;color:#555;">${data.companyName}</div>` : ''}
          ${data.email ? `<div style="font-size:13px;color:#888;">${data.email}</div>` : ''}
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
                <div style="font-weight:600;">${data.projectTitle}</div>
                <div style="font-size:12px;color:#888;margin-top:3px;">${data.projectType} · ${label}</div>
              </td>
              <td style="padding:16px;border-bottom:1px solid #e5e5e5;text-align:right;">${formatCurrency(amount)}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-bottom:40px;">
          <div style="width:240px;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden;">
            <div style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e5e5e5;">
              <span style="font-size:13px;color:#555;">Project Total</span>
              <span style="font-size:13px;">${formatCurrency(total)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e5e5e5;">
              <span style="font-size:13px;color:#555;">${label}</span>
              <span style="font-size:13px;">${formatCurrency(amount)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:14px 16px;background:#f7f7f7;">
              <span style="font-size:14px;font-weight:700;">Amount Due</span>
              <span style="font-size:14px;font-weight:700;">${formatCurrency(amount)}</span>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e5e5e5;padding-top:24px;">
          <p style="font-size:13px;color:#888;line-height:1.7;">Thank you for your business. Please make payment within 7 days to avoid any delays. For payment details or queries, contact us at ${agency.email}.</p>
        </div>
      </div>
    `,
    text: `INVOICE ${invoiceNumber}\n\nBill To: ${data.clientName}\nService: ${data.projectTitle}\n${label}: ${formatCurrency(amount)}\n\nDue: ${formatDate(dueDate)}`
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
