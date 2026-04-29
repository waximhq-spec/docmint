import { PAGE_TITLES } from '../components/Sidebar';

export default function Dashboard({ onNavigate }) {
  const cards = [
    { id: 'invoice', ...PAGE_TITLES['invoice'], icon: '🧾' },
    { id: 'proposal', ...PAGE_TITLES['proposal'], icon: '📜', ai: true },
    { id: 'contract', ...PAGE_TITLES['contract'], icon: '📝', ai: true },
  ];

  return (
    <div className="page-body fade-enter">
      <div className="dashboard-grid">
        <div style={{ gridColumn: '1 / -1', marginBottom: 24 }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-tertiary)', marginBottom: 12 }}>Quick Actions</h2>
          <div style={{ height: 1, background: 'var(--border)', width: '100%' }} />
        </div>
        
        {cards.map(card => (
          <div key={card.id} className="card action-card" onClick={() => onNavigate(card.id)} style={{ cursor: 'pointer', position: 'relative' }}>
            {card.ai && (
              <div style={{ position: 'absolute', top: 12, right: 12, background: '#f0f0ff', color: '#6366f1', fontSize: 9, fontWeight: 800, padding: '4px 8px', borderRadius: 20, border: '1px solid #e0e0ff' }}>
                ✨ AI POWERED
              </div>
            )}
            <div className="card-icon" style={{ fontSize: 32, marginBottom: 16 }}>{card.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{card.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 60, padding: 40, background: '#f9f9f9', borderRadius: 24, textAlign: 'center', border: '1px dashed #ddd' }}>
        <div style={{ fontSize: 24, marginBottom: 12 }}>✨</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Meet your Creative Assistant</h3>
        <p style={{ fontSize: 14, color: '#666', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          Look for the sparkle icons inside the generators. Your AI assistant can help you write professional Scopes of Work, refine your project goals, and draft legal clauses in seconds.
        </p>
      </div>
    </div>
  );
}
