export default function DownloadPDFButton({ getContent, filename = 'document.html' }) {
  const handleDownload = () => {
    const content = typeof getContent === 'function' ? getContent() : getContent;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${filename.replace('.html', '')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #111; background: #fff; padding: 48px; font-size: 14px; line-height: 1.7; }
    h1, h2 { letter-spacing: -0.5px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
${content}
</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  return (
    <button className="btn btn-outline btn-sm" onClick={handleDownload}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download PDF
    </button>
  );
}
