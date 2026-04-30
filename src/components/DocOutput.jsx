import html2pdf from 'html2pdf.js';

export default function DocOutput({ type, html, text }) {
  const handleExportPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.5; max-width: 800px; margin: 0 auto; background: #fff;">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          h1, h2, h3 { color: #000; }
          p { margin-bottom: 1em; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #000; }
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
    // We copy the text version for convenience
    navigator.clipboard.writeText(text.replace(/<[^>]*>?/gm, ''));
  };

  return (
    <div className="doc-output fade-enter" style={{ background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="doc-toolbar" style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Document Preview
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={handleCopy} style={{ height: 32, padding: '0 12px', fontSize: 12 }}>
            Copy Text
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportPDF} style={{ height: 32, padding: '0 12px', fontSize: 12 }}>
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="doc-body" style={{ 
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        background: 'var(--bg-tertiary)',
        padding: '24px'
      }}>
        {/* Paper Container - Always White for correct PDF representation */}
        <div style={{ 
          background: '#fff', 
          color: '#1a1a1a',
          margin: '0 auto', 
          maxWidth: '800px', 
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          borderRadius: '4px',
          minHeight: '600px'
        }}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
