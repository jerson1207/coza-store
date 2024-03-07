import { Controller } from "@hotwired/stimulus";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default class extends Controller {
  static values = { revenue: Array }

  connect() {
    this.renderChart();
  }

  renderChart() {
    
    const data = this.revenueValue.map((item) => item[1]/100.0)
    const labels = this.revenueValue.map((item) => item[0])
   
    const ctx = document.getElementById("revenueChart");

    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue $',
          data: data,
          borderWidth: 3,
          fill: true
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          xAxes: [{
            grid: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            grid: {
              color: "#d4f3ef",
              borderDash: [5, 5]
            }
          }]
        }
      }
    });
  }
}
