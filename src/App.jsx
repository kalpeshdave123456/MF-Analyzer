import React, { useState } from 'react';
import Header from './components/layout/Header';
import SearchBar from './components/search/SearchBar';
import Dashboard from './components/comparison/Dashboard';
import { X } from 'lucide-react';
import './index.css';

function App() {
  const [selectedFunds, setSelectedFunds] = useState([]); // Array of { schemeCode, schemeName }

  const handleAddFund = (fund) => {
    if (selectedFunds.length >= 3) return;
    if (selectedFunds.find(f => f.schemeCode === fund.schemeCode)) return;
    setSelectedFunds([...selectedFunds, fund]);
  };

  const handleRemoveFund = (schemeCode) => {
    setSelectedFunds(selectedFunds.filter(f => f.schemeCode !== schemeCode));
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <section className="search-section">
          <h2 className="text-gradient">Compare Mutual Funds</h2>
          <p className="subtitle">Analyze performance, risk, and portfolio composition.</p>
          
          <div className="glass-panel search-panel">
            <SearchBar 
              onAddFund={handleAddFund} 
              disabled={selectedFunds.length >= 3} 
              selectedCount={selectedFunds.length}
            />
            
            {selectedFunds.length > 0 && (
              <div className="selected-funds-badges">
                {selectedFunds.map(fund => (
                  <div key={fund.schemeCode} className="fund-badge hover-lift">
                    <span className="fund-badge-text" title={fund.schemeName}>
                      {fund.schemeName.length > 35 ? fund.schemeName.substring(0, 35) + '...' : fund.schemeName}
                    </span>
                    <button className="remove-btn" onClick={() => handleRemoveFund(fund.schemeCode)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {selectedFunds.length > 0 ? (
          <section className="dashboard-grid">
            <Dashboard selectedFunds={selectedFunds} />
          </section>
        ) : (
          <div className="empty-state">
            <div className="glass-panel empty-panel">
              <p>Add up to 3 funds to begin analysis</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
