import React from 'react';
import { formatPercent, formatDecimal, formatCurrency } from '../../utils/formatters';

const MetricCards = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="metrics-container glass-panel">
      <div className="metrics-grid">
        <div className="metric-column header-column">
          <div className="metric-cell header-cell">Fund Name</div>
          <div className="metric-cell header-cell">Expense Ratio</div>
          <div className="metric-cell header-cell">1Y CAGR</div>
          <div className="metric-cell header-cell">3Y CAGR</div>
          <div className="metric-cell header-cell">5Y CAGR</div>
          <div className="metric-cell header-cell">7Y CAGR</div>
          <div className="metric-cell header-cell">10Y CAGR</div>
          <div className="metric-cell header-cell">Sharpe Ratio</div>
          <div className="metric-cell header-cell">Alpha</div>
          <div className="metric-cell header-cell">SIP (5Y - ₹10k/mo)</div>
          <div className="metric-cell header-cell">Proprietary Ratings</div>
          <div className="metric-cell header-cell">Fund Manager</div>
        </div>
        {data.map((fund) => (
          <div className="metric-column" key={fund.schemeCode}>
            <div className="metric-cell fund-title-cell" title={fund.schemeName}>
              {fund.schemeName.length > 25 ? fund.schemeName.substring(0, 25) + '...' : fund.schemeName}
            </div>
            <div className="metric-cell text-gradient" style={{fontWeight: 700}}>
              {fund.mockDetails?.expenseRatio}
            </div>
            <div className="metric-cell">{formatPercent(fund.returns['1Y'])}</div>
            <div className="metric-cell">{formatPercent(fund.returns['3Y'])}</div>
            <div className="metric-cell highlight-cell">{formatPercent(fund.returns['5Y'])}</div>
            <div className="metric-cell">{formatPercent(fund.returns['7Y'])}</div>
            <div className="metric-cell">{formatPercent(fund.returns['10Y'])}</div>
            <div className="metric-cell">{formatDecimal(fund.risk?.sharpe)}</div>
            <div className="metric-cell">{formatDecimal(fund.risk?.alpha)}</div>
            <div className="metric-cell text-gradient" style={{fontWeight: 600}}>
              {formatCurrency(fund.sip5Y?.corpus)}
            </div>
            <div className="metric-cell">
              <span style={{color: '#FFD700', marginRight: '8px'}}>VR: {'⭐'.repeat(fund.mockDetails?.ratings?.valueResearch)}</span>
              <span style={{color: '#00F0FF'}}>MC: {'⭐'.repeat(fund.mockDetails?.ratings?.moneyControl)}</span>
            </div>
            <div className="metric-cell manager-cell">
              <span className="manager-name" style={{color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem'}}>Not available in Free API</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricCards;
