import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-reporte-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './reporte-ventas.html',
  styleUrls: ['./reporte-ventas.css']
})
export class ReporteVentasComponent {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;

  fechaInicio: string = '';
  fechaFin: string = '';
  tipoCarne: string = '';

  movimientos: any[] = [];
  hayDatos = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.isGerente = this.authService.esGerente();
  }

  generarReporte() {
    if (!this.fechaInicio && !this.fechaFin && !this.tipoCarne) {
      alert('Por favor selecciona al menos un filtro');
      return;
    }

    if ((this.fechaInicio || this.fechaFin) && (!this.fechaInicio || !this.fechaFin)) {
      alert('Debes seleccionar ambas fechas');
      return;
    }

    const params: any = {};
    if (this.fechaInicio) params.fecha_inicio = this.fechaInicio;
    if (this.fechaFin) params.fecha_fin = this.fechaFin;
    if (this.tipoCarne) params.tipo = this.tipoCarne;

this.http.get('http://127.0.0.1:8000/api/reporte-ventas', { params }).subscribe({      next: (data: any) => {
        this.movimientos = data;
        this.hayDatos = true;
      },
      error: () => alert('Error al cargar el reporte')
    });
  }

  descargarPDF() {
    if (!this.hayDatos) return;

    const params: any = {};
    if (this.fechaInicio) params.fecha_inicio = this.fechaInicio;
    if (this.fechaFin) params.fecha_fin = this.fechaFin;
    if (this.tipoCarne) params.tipo = this.tipoCarne;
    params.download = 'pdf';

window.open(`http://127.0.0.1:8000/api/reporte-ventas?${new URLSearchParams(params)}`, '_blank');  }

  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}