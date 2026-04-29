export default function Dashboard({ onNavigate }) {
  const stats = [
    { number: '24', label: 'Documents Generated' },
    { number: '8', label: 'Active Projects' },
    { number: '₹3.2L', label: 'Invoiced This Month' },
    { number: '95%', label: 'Client Approval Rate' },
  ];

  const actions = [
    {
      icon: '📋',
      title: 'New Project',
      desc: 'Generate proposal, contract & invoices',
      page: 'new-project',
    },
    {
      icon: '🧾',
      title: 'Invoice Generator',
      desc: 'Create standalone professional invoices',
      page: 'invoice',
    },
    {
      icon: '📄',
      title: 'Proposal Generator',
      desc: 'Draft a ready-to-send proposal fast',
      page: 'proposal',
    },
    {
      icon: '📝',
      title: 'Contract Generator',
      desc: 'Generate a clean service agreement',
      page: 'contract',
    },
  ];

  return (
    <div className="page-body fade-enter">
      <div className="dashboard-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Quick Actions</div>
        <div className="quick-actions">
          {actions.map((a, i) => (
            <button
              key={i}
              className="quick-action-card"
              onClick={() => onNavigate(a.page)}
              style={{ cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div className="quick-action-icon">{a.icon}</div>
              <div className="quick-action-title">{a.title}</div>
              <div className="quick-action-desc">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">About This Tool</div>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Agency Docs is your all-in-one document generator built for professional agencies. 
          Generate proposals, contracts, invoices, and client briefs in seconds — 
          all formatted, ready to send, and downloadable as PDF.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 100, color: 'var(--text-tertiary)' }}>No API Required</span>
          <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 100, color: 'var(--text-tertiary)' }}>Works Offline</span>
          <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 100, color: 'var(--text-tertiary)' }}>PDF Export</span>
          <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 100, color: 'var(--text-tertiary)' }}>Copy to Clipboard</span>
        </div>
      </div>
    </div>
  );
}
