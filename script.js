yaml-with-script.baseScript
document.addEventListener('DOMContentLoaded', () => {
    const companyList = document.getElementById('companyList');
    const ctx = document.getElementById('stockChart').getContext('2d');
    let stockChart;
  
    // Function to fetch and parse CSV data
    async function fetchCSVData() {
      const response = await fetch('dump.csv');
      const data = await response.text();
      const rows = data.split('\n').slice(1); // Skip header
      const companies = {};
  
      rows.forEach(row => {
        const [date, company, price] = row.split(',');
        if (!companies[company]) {
          companies[company] = [];
        }
        companies[company].push({ date, price: parseFloat(price) });
      });
  
      return companies;
    }
  
    // Function to create company list
    function createCompanyList(companies) {
      for (const company in companies) {
        const li = document.createElement('li');
        li.textContent = company;
        li.addEventListener('click', () => {
          renderChart(company, companies[company]);
        });
        companyList.appendChild(li);
      }
    }
  
    // Function to render chart
    function renderChart(company, data) {
      const labels = data.map(entry => entry.date);
      const prices = data.map(entry => entry.price);
  
      if (stockChart) {
        stockChart.destroy();
      }
  
      stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${company} Stock Price`,
            data: prices,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Price'
              }
            }
          }
        }
      });
    }
  
    // Initialize the app
    fetchCSVData().then(companies => {
      createCompanyList(companies);
    });
  });
  