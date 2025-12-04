// src/app/components/monitoreo-temperatura/monitoreo-temperatura.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-monitoreo-temperatura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitoreo-temperatura.html',
  styleUrls: ['./monitoreo-temperatura.css']
})
export class MonitoreoTemperaturaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gaugeFill') gaugeFill!: ElementRef<HTMLDivElement>;

  currentTemp = 4.2;
  lastUpdate = 'Cargando...';
  maxTemp = '5.8';
  minTemp = '3.1';
  avgTemp = '4.3';

  chart: any;
  intervalId: any;

  ngOnInit() {
    this.startSimulation();
  }

  ngAfterViewInit() {
    this.initializeChart();
    this.updateDisplay(); // Primera actualización inmediata
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.chart) this.chart.destroy();
  }

  initializeChart() {
    const ctx = document.getElementById('tempChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.generateTimeLabels(12),
        datasets: [{
          label: 'Temperatura (°C)',
          data: this.generateInitialData(),
          borderColor: '#941C2F',
          backgroundColor: 'rgba(148, 28, 47, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#941C2F',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.parsed.y}°C`
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 10,
            title: { display: true, text: 'Temperatura (°C)', color: '#555' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            title: { display: true, text: 'Tiempo', color: '#555' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        },
        animation: {
          duration: 800
        }
      }
    });
  }

  generateTimeLabels(count: number): string[] {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 5 * 60000));
      labels.push(time.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
  }

  generateInitialData(): number[] {
    return Array(12).fill(0).map(() => +(3.5 + Math.random() * 1.8).toFixed(1));
  }

  simulateTemperature() {
    const variation = (Math.random() - 0.5) * 0.8;
    this.currentTemp = Math.max(2.5, Math.min(6.5, this.currentTemp + variation));
    this.currentTemp = Math.round(this.currentTemp * 10) / 10;
  }

  updateDisplay() {
    // Actualizar temperatura grande
    const tempElement = document.querySelector('.temp-value');
    if (tempElement) tempElement.textContent = `${this.currentTemp}°C`;

    // Actualizar gauge (el gradiente verde → amarillo → rojo)
    if (this.gaugeFill) {
      const percentage = Math.min(100, (this.currentTemp / 10) * 100);
      this.gaugeFill.nativeElement.style.width = `${percentage}%`;
    }

    // Actualizar hora real
    const now = new Date();
    this.lastUpdate = `Última actualización: ${now.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`;

    // Actualizar gráfico y estadísticas
    this.updateChart();
    this.updateStats();
  }

  updateChart() {
    if (!this.chart) return;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    this.chart.data.labels.push(timeLabel);
    this.chart.data.labels.shift();

    this.chart.data.datasets[0].data.push(this.currentTemp);
    this.chart.data.datasets[0].data.shift();

    this.chart.update('none');
  }

  updateStats() {
    if (!this.chart) return;

    const data = this.chart.data.datasets[0].data as number[];
    this.maxTemp = Math.max(...data).toFixed(1);
    this.minTemp = Math.min(...data).toFixed(1);
    this.avgTemp = (data.reduce((a: number, b: number) => a + b, 0) / data.length).toFixed(1);
  }

  startSimulation() {
    this.intervalId = setInterval(() => {
      this.simulateTemperature();
      this.updateDisplay();
    }, 3000);
  }
}