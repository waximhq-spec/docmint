import { useState, useEffect } from 'react';
import LocationInput from './LocationInput';

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
  dashboard: { title: 'Dashboard', desc: 'Overview of your agency activity' },
  invoice: { title: 'Invoice Generator', desc: 'Create a professional invoice' },
  proposal: { title: 'Proposal Generator', desc: 'Draft a ready-to-send proposal' },
  contract: { title: 'Contract Generator', desc: 'Generate a clean service agreement' },
};

export default function Sidebar({ activePage, onNavigate }) {
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : { name: '', email: '', address: '', currency: 'INR' };
  });

  useEffect(() => {
    localStorage.setItem('docmint_provider', JSON.stringify(provider));
    // Dispatch a storage event so other pages know to update
    window.dispatchEvent(new Event('storage'));
  }, [provider]);

  const update = (key, val) => setProvider(p => ({ ...p, [key]: val }));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>docmint</h1>
        <span>Agency Document Engine</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {NAV.map(section => (
          <div key={section.label} style={{ marginBottom: 20 }}>
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
      </div>

      <div className="sidebar-settings" style={{ padding: '20px 0', borderTop: '1px solid var(--border)', marginTop: 20 }}>
        <div className="sidebar-section-label" style={{ marginBottom: 12 }}>Global Settings</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 10px' }}>
          <div className="form-group">
            <label style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 800 }}>Agency Name</label>
            <input 
              style={{ padding: '6px 10px', fontSize: 12, background: '#f9f9f9' }}
              value={provider.name} 
              onChange={e => update('name', e.target.value)} 
              placeholder="Agency Name" 
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 800 }}>Global Currency</label>
            <select 
              style={{ padding: '6px 10px', fontSize: 12, background: '#f9f9f9' }}
              value={provider.currency} 
              onChange={e => update('currency', e.target.value)}
            >
              <option value="INR">INR (₹) - India</option>
              <option value="BHD">BHD (.د.ب) - Bahrain</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', fontWeight: 800 }}>Agency Address</label>
            <LocationInput 
              value={provider.address} 
              onChange={val => update('address', val)} 
              placeholder="Search global address..." 
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export { PAGE_TITLES };
