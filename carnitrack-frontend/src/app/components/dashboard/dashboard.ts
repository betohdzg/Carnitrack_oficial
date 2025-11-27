import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false; 
  isGerente: boolean = false;
  productos: any[] = []; // Ajusta según tu servicio de datos

  constructor(private router: Router, private authService: AuthService) {
    // Simulación de datos, reemplaza con tu servicio
    this.productos = [
      { nombre_producto: 'Producto 1', precio: 10.50, cantidad: 20, foto_url: 'url1' },
      { nombre_producto: 'Producto 2', precio: 15.00, cantidad: 5, foto_url: 'url2' },
      { nombre_producto: 'Producto 3', precio: 55.00, cantidad: 15, foto_url: 'ur3' },
    ];
  }

ngOnInit(): void {
    this.isGerente = this.authService.esGerente(); // AHORA SÍ FUNCIONA
  }

  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStockClass(cantidad: number): string {
    if (cantidad > 15) return 'stock-verde';
    if (cantidad >= 6 && cantidad <= 15) return 'stock-amarillo';
    return 'stock-rojo';
  }

}