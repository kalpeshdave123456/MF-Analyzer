import React from 'react';
import { formatPercent } from '../../utils/formatters';

const HoldingsTable = ({ overlapData }) => {
  if (!overlapData || overlapData.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h3 className="chart-title" style={{ marginBottom: '0.5rem' }}>Common Component Holdings</h3>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Highlighting stocks present in more than one selected fund with high combined allocation.
      </p>

      <div className="table-wrapper" style={{ overflowX: 'auto', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Stock Name</th>
              <th style={{ padding: '1rem' }}>Funds Present</th>
              <th style={{ padding: '1rem' }}>Total Allocation</th>
              <th style={{ padding: '1rem' }}>Allocation Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {overlapData.map((stock, idx) => (
              <tr key={stock.name} className="hover-lift" style={{ borderBottom: idx === overlapData.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{stock.name}</td>
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ background: 'var(--bg-surface-hover)', color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {stock.fundsPresent} Funds
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1rem', color: 'var(--accent-green)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {formatPercent(stock.totalAllocation)}
                </td>
                <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {stock.details.map((d, i) => (
                    <div key={i}>
                      <span style={{color: 'var(--text-primary)'}}>{d.fundName.substring(0, 20)}...</span> : {formatPercent(d.allocation)}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
