import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header = () => {
  return (
    <header className="app-header glass-panel">
      <div className="logo-container">
        <TrendingUp className="logo-icon" size={28} color="var(--accent-cyan)" />
        <h1 className="logo-text">MF<span className="text-gradient">Analyzer</span></h1>
      </div>
      <nav className="header-nav">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-link hover-lift">GitHub</a>
      </nav>
    </header>
  );
};

export default Header;
