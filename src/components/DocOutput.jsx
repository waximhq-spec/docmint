import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

export default function DocOutput({ type, html, text }) {
  const handleExportPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 20px; color: #1a1a1a; line-height: 1.5; max-width: 800px; margin: 0 auto;">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          h1, h2, h3 { margin-top: 1em; margin-bottom: 0.4em; color: #000; }
          p { margin-bottom: 0.8em; }
          ul, ol { margin-bottom: 0.8em; padding-left: 20px; }
          li { margin-bottom: 0.3em; }
          hr { border: 0; border-top: 1px solid #eee; margin: 15px 0; }
          strong { font-weight: 700; color: #000; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #000; }
          .invoice-brand { font-size: 20px; font-weight: 800; }
          .invoice-meta { text-align: right; }
          .invoice-number { font-size: 18px; font-weight: 700; }
          .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .invoice-table th { text-align: left; padding: 8px 12px; font-size: 10px; font-weight: 650; text-transform: uppercase; color: #888; background: #f7f7f7; border-bottom: 1px solid #e5e5e5; }
          .invoice-table td { padding: 10px 12px; border-bottom: 1px solid #e5e5e5; font-size: 12px; }
          .invoice-total-row { display: flex; justify-content: flex-end; margin-top: 15px; }
          .invoice-total-box { min-width: 200px; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
          .invoice-total-line { display: flex; justify-content: space-between; padding: 8px 14px; font-size: 12px; border-bottom: 1px solid #e5e5e5; }
          .invoice-total-line:last-child { border-bottom: none; font-weight: 700; background: #f7f7f7; }
        </style>
        ${html}
      </div>
    `;
    
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `${type}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="doc-output fade-enter">
      <div className="doc-toolbar">
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Preview
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={handleCopy}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportPDF}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export PDF
          </button>
        </div>
      </div>
      
      <div className="doc-body" style={{ 
        maxHeight: 'calc(100vh - 180px)',
        overflowY: 'auto'
      }}>
        <div className="rendered-content">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .rendered-content h1 { font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #000; letter-spacing: -0.01em; }
        .rendered-content h2 { font-size: 16px; font-weight: 600; margin-top: 32px; margin-bottom: 12px; color: #000; }
        .rendered-content h3 { font-size: 14px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; }
        .rendered-content p { margin-bottom: 12px; color: #374151; line-height: 1.6; }
        .rendered-content ul { margin-bottom: 16px; padding-left: 20px; }
        .rendered-content li { margin-bottom: 6px; color: #374151; }
        .rendered-content strong { font-weight: 600; color: #000; }
      `}} />
    </div>
  );
}
