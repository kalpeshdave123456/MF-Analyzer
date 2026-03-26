export const getMockFundDetails = (schemeCode, schemeName = "Selected Fund") => {
  const codeHash = schemeCode ? schemeCode.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 100;

  // Compute a highly realistic Direct Plan expense ratio between 0.4 - 1.2%
  const expenseRatio = (0.4 + (codeHash % 8) * 0.1).toFixed(2);

  const holdingsPool = [
    { name: "HDFC Bank Ltd.", allocation: 8.5, sector: "Financial Services" },
    { name: "Reliance Industries Ltd.", allocation: 7.2, sector: "Energy" },
    { name: "ICICI Bank Ltd.", allocation: 6.1, sector: "Financial Services" },
    { name: "Infosys Ltd.", allocation: 5.4, sector: "IT" },
    { name: "ITC Ltd.", allocation: 4.8, sector: "FMCG" },
    { name: "Larsen & Toubro Ltd.", allocation: 4.1, sector: "Construction" },
    { name: "TCS Ltd.", allocation: 3.9, sector: "IT" },
    { name: "Axis Bank Ltd.", allocation: 3.2, sector: "Financial Services" },
    { name: "Bharti Airtel Ltd.", allocation: 2.8, sector: "Telecommunication" },
    { name: "State Bank of India", allocation: 2.5, sector: "Financial Services" },
  ];

  const numHoldings = 5 + (codeHash % 3);
  const startIndex = codeHash % (holdingsPool.length - numHoldings);
  const holdings = holdingsPool.slice(startIndex, startIndex + numHoldings).map((h) => ({
    ...h,
    allocation: +(h.allocation + (codeHash % 2 === 0 ? 0.5 : -0.5)).toFixed(2)
  }));

  holdings.sort((a, b) => b.allocation - a.allocation);

  const valueResearchStars = 3 + (codeHash % 3);
  const moneyControlStars = 3 + ((codeHash + 1) % 3); 

  return {
    schemeCode,
    schemeName,
    expenseRatio: expenseRatio + "%",
    ratings: {
      valueResearch: valueResearchStars,
      moneyControl: moneyControlStars
    },
    topHoldings: holdings,
    sectorAllocation: {
      "Financial Services": +(25 + (codeHash % 10)).toFixed(2),
      "IT": +(12 + (codeHash % 5)).toFixed(2),
      "Energy": +(8 + (codeHash % 4)).toFixed(2),
      "FMCG": +(6 + (codeHash % 3)).toFixed(2),
      "Others": +(49 - (codeHash % 10) - (codeHash % 5) - (codeHash % 4) - (codeHash % 3)).toFixed(2)
    }
  };
};

export const getHoldingsOverlap = (fundsData) => {
  if (!fundsData || fundsData.length < 2) return [];

  const holdingsMap = {};
  
  fundsData.forEach(fund => {
    fund.topHoldings.forEach(h => {
      if (!holdingsMap[h.name]) {
        holdingsMap[h.name] = { fundsPresent: 0, totalAllocation: 0, details: [] };
      }
      holdingsMap[h.name].fundsPresent += 1;
      holdingsMap[h.name].totalAllocation += h.allocation;
      holdingsMap[h.name].details.push({ fundName: fund.schemeName, allocation: h.allocation });
    });
  });

  return Object.keys(holdingsMap)
    .filter(name => holdingsMap[name].fundsPresent > 1)
    .map(name => ({
      name,
      ...holdingsMap[name]
    }))
    .sort((a, b) => b.totalAllocation - a.totalAllocation);
};
