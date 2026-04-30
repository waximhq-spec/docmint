export default function Dashboard({ onNavigate }) {
  const tools = [
    { 
      id: 'invoice', 
      title: 'Invoice Generator', 
      desc: 'Create professional agency invoices with manual payment controls.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
    },
    { 
      id: 'proposal', 
      title: 'Proposal Builder', 
      desc: 'Generate structured project proposals with AI-assisted refinement.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    },
    { 
      id: 'contract', 
      title: 'Contract Draftsman', 
      desc: 'Draft legal agency contracts with modular section controls.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    }
  ];

  return (
    <div className="page-body fade-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>Agency Workspace</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Professional document suite for high-performance creative teams.</p>
      </div>

      <div className="quick-actions">
        {tools.map(tool => (
          <div key={tool.id} className="quick-action-card" onClick={() => onNavigate(tool.id)}>
            <div className="quick-action-icon">
              {tool.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div className="quick-action-title">{tool.title}</div>
              <div className="quick-action-desc">{tool.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, padding: 24, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Productivity Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>AI Refinement</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>Use the "Polish" tool inside builders to maintain a consistent professional tone across all client documents.</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Manual Controls</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>Our suite prioritizes manual input to ensure you maintain full creative control over your agency's contracts and proposals.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
