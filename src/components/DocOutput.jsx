import ReactMarkdown from 'react-markdown';

export default function DocOutput({ type, html, text }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${type} - docmint</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              color: #1a1a1a;
              line-height: 1.6;
            }
            .doc-container { max-width: 800px; margin: 0 auto; }
            h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
            p { margin-bottom: 1em; }
            ul, ol { margin-bottom: 1em; padding-left: 20px; }
            li { margin-bottom: 0.5em; }
            hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="doc-container">
            ${html}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
          <button className="btn btn-secondary" onClick={handleCopy} style={{ padding: '6px 12px', fontSize: 11 }}>Copy Text</button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '6px 12px', fontSize: 11 }}>Export PDF</button>
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
