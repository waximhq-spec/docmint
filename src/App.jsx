import { useState, useEffect } from 'react';
import Sidebar, { PAGE_TITLES } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import InvoiceGenerator from './pages/InvoiceGenerator';
import ProposalGenerator from './pages/ProposalGenerator';
import ContractGenerator from './pages/ContractGenerator';

// Icons for mobile bottom nav
const NavIcons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  invoice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M7 8h10M7 12h10M7 16h6"/>
    </svg>
  ),
  proposal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  ),
  contract: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'contract', label: 'Contract' },
  { id: 'settings', label: 'Settings' },
];

function SettingsSheet({ onClose }) {
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('docmint_provider');
    return saved ? JSON.parse(saved) : { name: '', email: '', address: '', currency: 'INR' };
  });

  const update = (key, val) => {
    const updated = { ...provider, [key]: val };
    setProvider(updated);
    localStorage.setItem('docmint_provider', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-sheet" onClick={e => e.stopPropagation()}>
        <div className="settings-handle" />
        <div className="settings-title">Global Settings</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Agency Name</label>
            <input value={provider.name} onChange={e => update('name', e.target.value)} placeholder="Your agency name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={provider.email || ''} onChange={e => update('email', e.target.value)} placeholder="agency@email.com" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input value={provider.address || ''} onChange={e => update('address', e.target.value)} placeholder="City, Country" />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select value={provider.currency} onChange={e => update('currency', e.target.value)}>
              <option value="INR">INR (₹) – India</option>
              <option value="BHD">BHD (.د.ب) – Bahrain</option>
              <option value="USD">USD ($) – USA</option>
              <option value="EUR">EUR (€) – Europe</option>
              <option value="GBP">GBP (£) – UK</option>
              <option value="AED">AED (د.إ) – UAE</option>
            </select>
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input value={provider.bankName || ''} onChange={e => update('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input value={provider.accNumber || ''} onChange={e => update('accNumber', e.target.value)} placeholder="Account number" />
          </div>
          <div className="form-group">
            <label>IFSC / Swift Code</label>
            <input value={provider.ifscCode || ''} onChange={e => update('ifscCode', e.target.value)} placeholder="IFSC or SWIFT" />
          </div>
          <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 8 }}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}

function PageContent({ page, onNavigate }) {
  switch (page) {
    case 'dashboard':  return <Dashboard onNavigate={onNavigate} />;
    case 'invoice':    return <InvoiceGenerator />;
    case 'proposal':   return <ProposalGenerator />;
    case 'contract':   return <ContractGenerator />;
    default:           return <Dashboard onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('docmint_dark') === 'true');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('docmint_dark', darkMode);
  }, [darkMode]);

  const navigate = (newPage) => {
    if (newPage === 'settings') {
      setShowSettings(true);
      return;
    }
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const { title, desc } = PAGE_TITLES[page] || PAGE_TITLES['dashboard'];

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar activePage={page} onNavigate={navigate} />

      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div>
          <div className="mobile-header-logo">docmint</div>
          <div className="mobile-header-subtitle">{title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="theme-switch" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
            <div className="theme-switch-thumb" />
          </div>
          <button
            className="btn-ghost"
            onClick={() => setShowSettings(true)}
            style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          >
            <div style={{ width: 18, height: 18 }}>
              {NavIcons.settings}
            </div>
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="main-content">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>{title}</h2>
            <p>{desc}</p>
          </div>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{darkMode ? 'Dark' : 'Light'} Mode</span>
            <div className="theme-switch" onClick={() => setDarkMode(!darkMode)}>
              <div className="theme-switch-thumb" />
            </div>
          </div>
        </header>
        <PageContent key={page} page={page} onNavigate={navigate} />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`mobile-nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
            id={`mobile-nav-${item.id}`}
          >
            <div style={{ width: 20, height: 20 }}>
              {NavIcons[item.id]}
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings Sheet (mobile & desktop) */}
      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .desktop-only { display: none; }
        }
      `}} />
    </div>
  );
}
