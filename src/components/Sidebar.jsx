import { useState, useEffect } from 'react';
import LocationInput from './LocationInput';

const NAV = [
  {
    label: 'Workspace',
    items: [
      {
        id: 'dashboard',
        label: 'Home',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Documents',
    items: [
      {
        id: 'invoice',
        label: 'Invoices',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
          </svg>
        ),
      },
      {
        id: 'proposal',
        label: 'Proposals',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        ),
      },
      {
        id: 'contract',
        label: 'Contracts',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        ),
      },
    ],
  },
];

const PAGE_TITLES = {
  dashboard: { title: 'Agency Workspace', desc: 'Manage your client document pipeline.' },
  invoice: { title: 'Invoice Generator', desc: 'Generate professional billing documents.' },
  proposal: { title: 'Proposal Builder', desc: 'Draft structured project proposals.' },
  contract: { title: 'Contract Draftsman', desc: 'Create modular service agreements.' },
};

export default function Sidebar({ activePage, onNavigate }) {
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : { name: '', email: '', address: '', currency: 'INR' };
  });

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
    window.dispatchEvent(new Event('storage'));
  }, [provider]);

  const update = (key, val) => setProvider(p => ({ ...p, [key]: val }));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>docmint</h1>
        <span>Agency Suite</span>
      </div>

      <div className="sidebar-scroll">
        {NAV.map(section => (
          <div key={section.label} style={{ marginBottom: 12 }}>
            <div className="sidebar-section-label">
              {section.label}
            </div>
            <nav className="sidebar-nav">
              {section.items.map(item => (
                <button
                  key={item.id}
                  className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="sidebar-footer" style={{ padding: '16px 10px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <button 
          className="sidebar-item" 
          onClick={() => onNavigate('settings')}
        >
          <span className="icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </span>
          Settings
        </button>
      </div>
    </aside>
  );
}

export { PAGE_TITLES };
