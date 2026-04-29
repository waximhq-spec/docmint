const NAV = [
  {
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        ),
      },
      {
        id: 'new-project',
        label: 'New Project',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Generators',
    items: [
      {
        id: 'invoice',
        label: 'Invoice Generator',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M7 8h10M7 12h10M7 16h6"/>
          </svg>
        ),
      },
      {
        id: 'proposal',
        label: 'Proposal Generator',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        ),
      },
      {
        id: 'contract',
        label: 'Contract Generator',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        ),
      },
    ],
  },
];

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', desc: 'Overview of your agency document activity' },
  'new-project': { title: 'New Project', desc: 'Generate a complete document set for a new project' },
  invoice: { title: 'Invoice Generator', desc: 'Create a standalone professional invoice' },
  proposal: { title: 'Proposal Generator', desc: 'Draft a ready-to-send project proposal' },
  contract: { title: 'Contract Generator', desc: 'Generate a clean service agreement' },
};

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Agency Docs</h1>
        <span>Document Generator</span>
      </div>

      {NAV.map(section => (
        <div key={section.label}>
          <div className="sidebar-section-label">{section.label}</div>
          <nav className="sidebar-nav">
            {section.items.map(item => (
              <button
                key={item.id}
                className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                id={`nav-${item.id}`}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '24px 20px 0', borderTop: '1px solid var(--border)', marginInline: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          <strong style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: 2 }}>Creative Agency</strong>
          All documents generated locally. No data sent to any server.
        </div>
      </div>
    </aside>
  );
}

export { PAGE_TITLES };
