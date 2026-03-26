import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { getClosestNAV, parseDate } from '../../utils/math';

const COLORS = ['#00F0FF', '#7B2CBF', '#00CC66', '#FF3366'];

const ReturnsChart = ({ comparisonData }) => {
  const chartData = useMemo(() => {
    if (!comparisonData || comparisonData.length === 0) return [];

    const points = [];
    const today = new Date();
    const chartStartDate = new Date(2015, 0, 1);
    
    // Quarterly data points from 2015 to today
    const totalQuarters = (today.getFullYear() - 2015) * 4 + Math.floor(today.getMonth() / 3);

    for (let i = 0; i <= totalQuarters; i++) {
      const d = new Date(2015, i * 3, 1);
      if (d > today) break;

      const point = { 
        date: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      };
      
      let hasValidData = false;
      
      comparisonData.forEach(fund => {
        const history = fund.navData;
        if (!history || history.length === 0) return;
        
        // Find the absolute earliest NAV on or after 2015-01-01 to anchor the 1 Lakh investment!
        let earliestNav = null;
        for (let j = history.length - 1; j >= 0; j--) {
           const hd = parseDate(history[j].date);
           if (hd >= chartStartDate) {
             earliestNav = parseFloat(history[j].nav);
             break;
           }
        }
        
        if (!earliestNav) return;

        const currentItemNav = getClosestNAV(history, d);
        if (currentItemNav) {
          // Compute value based on exactly 1 Lakh starting base.
          point[fund.schemeName] = (100000 / earliestNav) * currentItemNav;
          hasValidData = true;
        }
      });
      
      if (hasValidData) {
        points.push(point);
      }
    }
    
    // Assure the absolute latest available timeframe is mathematically represented
    const latestPoint = { date: "Today" };
    let hasLatest = false;
    comparisonData.forEach(fund => {
      const history = fund.navData;
      if (!history || history.length === 0) return;
      let earliestNav = null;
      for (let j = history.length - 1; j >= 0; j--) {
         if (parseDate(history[j].date) >= chartStartDate) {
           earliestNav = parseFloat(history[j].nav);
           break;
         }
      }
      if (earliestNav && history[0]) {
        latestPoint[fund.schemeName] = (100000 / earliestNav) * parseFloat(history[0].nav);
        hasLatest = true;
      }
    });

    if (hasLatest) {
      points.push(latestPoint);
    }
    
    return points;
  }, [comparisonData]);

  if (chartData.length === 0) return null;

  return (
    <div className="chart-container glass-panel">
      <h3 className="chart-title">Growth of ₹1,00,000 Lumpsum (Invested Jan 2015)</h3>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} dy={10} />
            <YAxis 
              stroke="var(--text-secondary)" 
              tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`}
              domain={['dataMin - 50000', 'dataMax + 100000']}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-deep)', borderColor: 'var(--glass-border)', borderRadius: '12px', padding: '12px' }}
              itemStyle={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            {comparisonData.map((fund, idx) => (
              <Line 
                key={fund.schemeCode}
                type="monotone" 
                dataKey={fund.schemeName} 
                stroke={COLORS[idx % COLORS.length]} 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[idx % COLORS.length] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReturnsChart;
