import { useState } from 'react';
import Sidebar, { PAGE_TITLES } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import InvoiceGenerator from './pages/InvoiceGenerator';
import ProposalGenerator from './pages/ProposalGenerator';
import ContractGenerator from './pages/ContractGenerator';

function PageContent({ page, onNavigate }) {
  switch (page) {
    case 'dashboard':     return <Dashboard onNavigate={onNavigate} />;
    case 'invoice':       return <InvoiceGenerator />;
    case 'proposal':      return <ProposalGenerator />;
    case 'contract':      return <ContractGenerator />;
    default:              return <Dashboard onNavigate={onNavigate} />;
  }
}

export default function App() {
  const [page, setPage] = useState('dashboard');

  const navigate = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const { title, desc } = PAGE_TITLES[page] || PAGE_TITLES['dashboard'];

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={navigate} />
      <div className="main-content">
        <header className="page-header">
          <h2>{title}</h2>
          <p>{desc}</p>
        </header>
        <PageContent key={page} page={page} onNavigate={navigate} />
      </div>
    </div>
  );
}
