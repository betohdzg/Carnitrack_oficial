import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';
import { ProductoService, Producto } from '../../services/producto';
import { ChangeDetectorRef } from '@angular/core';

interface ProductoTabla {
  id: number;
  tipo: string;
  nombre: string;
  precio: string;
  stock: string;
  estado: string;
  entrada: string;
  caducidad: string;
}

@Component({
  selector: 'app-ver-productos-geren',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ver-productos-geren.html',
  styleUrls: ['./ver-productos-geren.css']
})
export class VerProductosGerenComponent implements OnInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;

  rows: ProductoTabla[] = [];
  filteredRows: ProductoTabla[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef // ← INYECTAR
  ) {
  }

ngOnInit() {
  this.isGerente = this.authService.esGerente(); // ← MOVER AQUÍ
  this.cargarProductos();
}

cargarProductos() {
  this.productoService.getProductos().subscribe({
    next: (response: any) => {
      console.log('Respuesta completa:', response);

      const data = Array.isArray(response) ? response : [];

      this.rows = data.map((p: any) => {
        console.log('Producto recibido:', p);

        return {
          id: p.id,
          tipo: this.capitalize(p.tipo_carne || 'Sin tipo'),
          nombre: p.nombre || 'Sin nombre',
          precio: `$${Number(p.precio_kg || 0).toFixed(2)}`,
          stock: `${Number(p.stock_kg || 0).toFixed(2)} kg`,
          estado: p.fecha_caducidad ? this.getEstado(p.fecha_caducidad) : 'Sin fecha',
          entrada: p.fecha_entrada ? this.formatDate(p.fecha_entrada) : 'Sin fecha',
          caducidad: p.fecha_caducidad ? this.formatDate(p.fecha_caducidad) : 'Sin fecha'
        };
      });

      this.filteredRows = [...this.rows];
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Error al cargar productos');
    }
  });
}
  filterTable() {
    const filter = this.searchQuery.toLowerCase();
    this.filteredRows = this.rows.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(filter)
      )
    );
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  getEstado(fechaCaducidad: string): string {
    const hoy = new Date();
    const caducidad = new Date(fechaCaducidad);
    const diffDays = Math.ceil((caducidad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Caducado';
    if (diffDays <= 3) return 'Próximo a caducar';
    return 'Disponible';
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  editarProducto(id: number) {
    this.router.navigate(['/entrada-productos'], { queryParams: { edit: id } });
  }

  borrarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.rows = this.rows.filter(p => p.id !== id);
          this.filteredRows = this.filteredRows.filter(p => p.id !== id);
          alert('Producto eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

   // Menú
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }

}