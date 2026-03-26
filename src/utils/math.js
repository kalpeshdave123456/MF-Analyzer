// Parse date from 'dd-mm-yyyy' to Date object
export const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split('-');
  return new Date(year, month - 1, day);
};

// Sort data descending (newest first, which mfapi.in generally does, but let's be safe)
export const sortDataDesc = (data) => {
  return [...data].sort((a, b) => parseDate(b.date) - parseDate(a.date));
};

// Get closest NAV on or before a target Date
export const getClosestNAV = (dataDesc, targetDate) => {
  for (let item of dataDesc) {
    if (parseDate(item.date) <= targetDate) {
      return parseFloat(item.nav);
    }
  }
  return null; // Date is too old
};

// Calculate CAGR
export const calculateCAGR = (startValue, endValue, years) => {
  if (!startValue || !endValue || startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};

// Calculate Returns for exact X years ago
export const calculateReturnsForPeriod = (dataDesc, years) => {
  if (!dataDesc || dataDesc.length === 0) return null;
  const latestData = dataDesc[0];
  const latestDate = parseDate(latestData.date);
  const latestNAV = parseFloat(latestData.nav);

  const targetDate = new Date(latestDate);
  targetDate.setFullYear(targetDate.getFullYear() - years);

  const pastNAV = getClosestNAV(dataDesc, targetDate);
  if (!pastNAV) return null;

  if (years < 1) {
    return ((latestNAV - pastNAV) / pastNAV) * 100;
  }
  return calculateCAGR(pastNAV, latestNAV, years);
};

// Calculate SIP Returns
export const calculateSIPCorpus = (dataDesc, years, monthlyAmount = 1000) => {
  if (!dataDesc || dataDesc.length === 0) return null;
  
  const latestDate = parseDate(dataDesc[0].date);
  let targetDate = new Date(latestDate);
  targetDate.setFullYear(targetDate.getFullYear() - years);

  let totalInvested = 0;
  let totalUnits = 0;

  let currentDate = new Date(targetDate);
  
  while (currentDate <= latestDate) {
    const nav = getClosestNAV(dataDesc, currentDate);
    if (nav) {
      totalUnits += monthlyAmount / nav;
      totalInvested += monthlyAmount;
    }
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const latestNAV = parseFloat(dataDesc[0].nav);
  const currentCorpus = totalUnits * latestNAV;
  const absoluteReturnPercent = totalInvested > 0 ? ((currentCorpus - totalInvested) / totalInvested) * 100 : 0;

  return { invested: totalInvested, corpus: currentCorpus, absoluteReturn: absoluteReturnPercent };
};

// Calculate Standard Deviation
const standardDeviation = (arr) => {
  const n = arr.length;
  if (n <= 1) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  return Math.sqrt(variance);
};

// Calculate Covariance
const covariance = (arr1, arr2) => {
  const n = Math.min(arr1.length, arr2.length);
  if (n <= 1) return 0;
  const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
  
  let cov = 0;
  for (let i = 0; i < n; i++) {
    cov += (arr1[i] - mean1) * (arr2[i] - mean2);
  }
  return cov / (n - 1);
};

// Calculate Risk Metrics
export const calculateRiskMetrics = (fundReturns, benchmarkReturns, riskFreeRate = 7) => {
  if (!fundReturns || fundReturns.length === 0 || !benchmarkReturns || benchmarkReturns.length === 0) {
    return { beta: null, alpha: null, sharpe: null };
  }

  const stdDevFund = standardDeviation(fundReturns); 
  const varianceBenchmark = Math.pow(standardDeviation(benchmarkReturns), 2);
  const covar = covariance(fundReturns, benchmarkReturns);

  const beta = varianceBenchmark > 0 ? covar / varianceBenchmark : 1;
  
  const fundMeanAnn = (fundReturns.reduce((a, b) => a + b, 0) / fundReturns.length) * 12;
  const bmMeanAnn = (benchmarkReturns.reduce((a, b) => a + b, 0) / benchmarkReturns.length) * 12;

  const alpha = (fundMeanAnn - riskFreeRate) - beta * (bmMeanAnn - riskFreeRate);
  const sharpe = stdDevFund > 0 ? (fundMeanAnn - riskFreeRate) / (stdDevFund * Math.sqrt(12)) : 0;

  return { beta, alpha, sharpe };
};
