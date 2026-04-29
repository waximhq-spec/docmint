import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

export default function DocOutput({ type, html, text }) {
  const handleExportPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; max-width: 800px; margin: 0 auto;">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; color: #000; }
          p { margin-bottom: 1em; }
          ul, ol { margin-bottom: 1em; padding-left: 20px; }
          li { margin-bottom: 0.5em; }
          hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
          strong { font-weight: 700; color: #000; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 28px; border-bottom: 2px solid #000; }
          .invoice-brand { font-size: 22px; font-weight: 800; }
          .invoice-meta { text-align: right; }
          .invoice-number { font-size: 20px; font-weight: 700; }
          .invoice-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          .invoice-table th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 650; text-transform: uppercase; color: #888; background: #f7f7f7; border-bottom: 1px solid #e5e5e5; }
          .invoice-table td { padding: 14px 14px; border-bottom: 1px solid #e5e5e5; font-size: 13.5px; }
          .invoice-total-row { display: flex; justify-content: flex-end; margin-top: 20px; }
          .invoice-total-box { min-width: 220px; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; }
          .invoice-total-line { display: flex; justify-content: space-between; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #e5e5e5; }
          .invoice-total-line:last-child { border-bottom: none; font-weight: 700; background: #f7f7f7; }
        </style>
        ${html}
      </div>
    `;
    
    const opt = {
      margin:       10,
      filename:     `${type}_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ 
        padding: '12px 20px', 
        background: '#fcfcfc', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Preview Mode</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleCopy}>Copy Text</button>
          <button className="btn btn-primary btn-sm" onClick={handleExportPDF}>Export PDF</button>
        </div>
      </div>
      
      <div className="doc-preview" style={{ 
        padding: '40px', 
        background: '#fff', 
        minHeight: '600px',
        maxHeight: '800px',
        overflowY: 'auto',
        color: '#333',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <div className="rendered-content">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .rendered-content h1 { font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #000; }
        .rendered-content h2 { font-size: 18px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; color: #000; }
        .rendered-content h3 { font-size: 15px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; }
        .rendered-content p { margin-bottom: 16px; }
        .rendered-content ul { margin-bottom: 16px; padding-left: 20px; }
        .rendered-content li { margin-bottom: 8px; }
        .rendered-content strong { font-weight: 700; color: #000; }
      `}} />
    </div>
  );
}
