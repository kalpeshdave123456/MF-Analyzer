export const getBenchmarkData = (years = 10, currentVal = 22000, dailyGrowthRate = 0.00045) => {
  const today = new Date();
  const data = [];
  let val = currentVal;

  for (let i = 0; i < years * 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // skip weekends
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      data.push({
        date: `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`,
        nav: val.toFixed(2)
      });
      // Reverse growth with volatility
      val = val / (1 + (dailyGrowthRate + (Math.random() * 0.01 - 0.005))); 
    }
  }
  return data;
};
