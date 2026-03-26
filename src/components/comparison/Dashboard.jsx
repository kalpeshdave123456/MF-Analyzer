import React, { useEffect, useState } from 'react';
import { getFundData } from '../../services/api';
import { getMockFundDetails, getHoldingsOverlap } from '../../services/mockData';
import { getBenchmarkData } from '../../services/benchmarkData';
import { calculateReturnsForPeriod, calculateSIPCorpus, calculateRiskMetrics, sortDataDesc } from '../../utils/math';
import { Loader2 } from 'lucide-react';
import MetricCards from './MetricCards';
import ReturnsChart from '../charts/ReturnsChart';
import HoldingsTable from './HoldingsTable';

const Dashboard = ({ selectedFunds }) => {
  const [loading, setLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState([]);
  const [holdingsOverlap, setHoldingsOverlap] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      const promises = selectedFunds.map(async (fund) => {
        const apiData = await getFundData(fund.schemeCode);
        const navData = apiData?.data ? sortDataDesc(apiData.data) : [];
        const mockDetails = getMockFundDetails(fund.schemeCode, fund.schemeName);

        const returns = {
          '1Y': calculateReturnsForPeriod(navData, 1),
          '3Y': calculateReturnsForPeriod(navData, 3),
          '5Y': calculateReturnsForPeriod(navData, 5),
          '7Y': calculateReturnsForPeriod(navData, 7),
          '10Y': calculateReturnsForPeriod(navData, 10),
        };

        const sip5Y = calculateSIPCorpus(navData, 5, 10000); 
        
        const sampleFundReturns = [returns['1Y']/12 || 0, returns['3Y']/12 || 0, returns['5Y']/12 || 0];
        const risk = calculateRiskMetrics(sampleFundReturns, [1, 1, 1]);

        // Calculate verdict score
        const score = (returns['5Y'] || 0) * 0.4 + (risk.sharpe || 0) * 0.4 + (returns['3Y'] || 0) * 0.2;

        return {
          ...fund,
          navData,
          mockDetails,
          returns,
          sip5Y,
          risk,
          score
        };
      });

      const results = await Promise.all(promises);
      results.sort((a, b) => b.score - a.score);
      
      setComparisonData(results);
      setHoldingsOverlap(getHoldingsOverlap(results.map(r => r.mockDetails)));
      setLoading(false);
    };

    if (selectedFunds.length > 0) {
      fetchAllData();
    }
  }, [selectedFunds]);

  if (loading) {
    return (
      <div className="glass-panel" style={{minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
        <Loader2 className="search-spinner" size={40} color="var(--accent-cyan)" style={{position: 'static'}} />
        <p className="subtitle">Crunching {selectedFunds.length > 1 ? 'comparison' : ''} metrics and pulling historical data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="glass-panel dashboard-header hover-lift">
        <h3 className="text-gradient">Performance Overview</h3>
        {comparisonData.length > 0 && (
          <div className="verdict-banner">
            ⭐ <strong>Verdict:</strong> {comparisonData[0].schemeName} is ranked highest based on risk-adjusted momentum.
          </div>
        )}
      </div>
      
      <MetricCards data={comparisonData} />
      
      <ReturnsChart comparisonData={comparisonData} />

      <HoldingsTable overlapData={holdingsOverlap} />
    </div>
  );
};

export default Dashboard;
