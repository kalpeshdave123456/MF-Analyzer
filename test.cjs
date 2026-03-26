const https = require('https');

const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split('-');
  return new Date(year, month - 1, day);
};

const sortDataDesc = (data) => {
  return [...data].sort((a, b) => parseDate(b.date) - parseDate(a.date));
};

const getClosestNAV = (dataDesc, targetDate) => {
  for (let item of dataDesc) {
    if (parseDate(item.date) <= targetDate) {
      return parseFloat(item.nav);
    }
  }
  return null;
};

https.get('https://api.mfapi.in/mf/122639', (resp) => { 
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    const rawData = JSON.parse(data);
    const navData = sortDataDesc(rawData.data);
    
    console.log("Total entries:", navData.length);
    console.log("Latest Date:", navData[0].date, "NAV:", navData[0].nav);
    
    const latestDate = parseDate(navData[0].date);
    const targetDate = new Date(latestDate);
    targetDate.setFullYear(targetDate.getFullYear() - 1);
    
    console.log("Target Date for 1Y:", targetDate.toISOString());
    
    const pastNAV = getClosestNAV(navData, targetDate);
    
    console.log("Past NAV 1Y:", pastNAV);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
