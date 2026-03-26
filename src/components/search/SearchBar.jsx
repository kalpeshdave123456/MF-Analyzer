import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { searchFunds } from '../../services/api';

const SearchBar = ({ onAddFund, disabled, selectedCount }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 3) {
        setLoading(true);
        const data = await searchFunds(query);
        setResults(data.slice(0, 10));
        setIsOpen(true);
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (fund) => {
    onAddFund(fund);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="search-container" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder={disabled ? "Maximum 3 funds selected" : "Search for a mutual fund... (e.g. Parag Parikh Flexi)"}
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(results.length > 0) setIsOpen(true); }}
          disabled={disabled}
        />
        {loading && <Loader2 className="search-spinner" size={20} color="var(--accent-cyan)" />}
      </div>
      
      {isOpen && results.length > 0 && (
        <ul className="search-dropdown glass-panel">
          {results.map((fund) => (
            <li key={fund.schemeCode} className="search-result-item hover-lift" onClick={() => handleSelect(fund)}>
              <span className="fund-name">{fund.schemeName}</span>
              <Plus className="add-icon" size={18} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
