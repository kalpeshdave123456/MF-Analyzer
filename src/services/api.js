const BASE_URL = 'https://api.mfapi.in/mf';

export const searchFunds = async (query) => {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Filter out Regular and IDCW/Dividend to default identically to the core Direct Growth choice
    return data.filter(fund => {
      const name = fund.schemeName.toUpperCase();
      const isDirect = name.includes('DIRECT') || name.includes('- DIR');
      const isRegular = name.includes('REGULAR') || name.includes('- REG');
      const isDividend = name.includes('IDCW') || name.includes('DIVIDEND') || name.includes('PAYOUT');
      
      return isDirect && !isRegular && !isDividend;
    });
  } catch (error) {
    console.error("Error searching funds:", error);
    return [];
  }
};

export const getFundData = async (schemeCode) => {
  try {
    const response = await fetch(`${BASE_URL}/${schemeCode}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fund data:", error);
    return null;
  }
};
