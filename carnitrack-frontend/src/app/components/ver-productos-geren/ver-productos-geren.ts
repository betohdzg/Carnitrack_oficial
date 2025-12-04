import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';
import { ProductoService } from '../../services/producto';

interface ProductoTabla {
  id: string;  // ← CAMBIADO A STRING (tu ID es CAR-RES-001)
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

  // MODAL DE CONFIRMACIÓN
  mostrarModalConfirmarEliminar = false;
  productoAEliminar: string | null = null;

  rows: ProductoTabla[] = [];
  filteredRows: ProductoTabla[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isGerente = this.authService.esGerente();
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : [];

        this.rows = data.map((p: any) => ({
          id: p.id,
          tipo: this.capitalize(p.tipo_carne || 'Sin tipo'),
          nombre: p.nombre || 'Sin nombre',
          precio: `$${Number(p.precio_kg || 0).toFixed(2)}`,
          stock: `${Number(p.stock_kg || 0).toFixed(2)} kg`,
          estado: p.fecha_caducidad ? this.getEstado(p.fecha_caducidad) : 'Sin fecha',
          entrada: p.fecha_entrada ? this.formatDate(p.fecha_entrada) : 'Sin fecha',
          caducidad: p.fecha_caducidad ? this.formatDate(p.fecha_caducidad) : 'Sin fecha'
        }));

        this.filteredRows = [...this.rows];
        this.cdr.detectChanges();
      },
      error: () => alert('Error al cargar productos')
    });
  }

  // === MODAL DE ELIMINAR ===
  borrarProducto(id: string) {
    this.productoAEliminar = id;
    this.mostrarModalConfirmarEliminar = true;
    this.cdr.detectChanges();
  }

  cancelarEliminar() {
    this.mostrarModalConfirmarEliminar = false;
    this.productoAEliminar = null;
  }

  confirmarEliminar() {
    if (!this.productoAEliminar) return;

    this.productoService.eliminarProducto(this.productoAEliminar).subscribe({
      next: () => {
        this.mostrarModalConfirmarEliminar = false;
        this.productoAEliminar = null;
        this.cargarProductos(); // Recarga la lista (los eliminados desaparecen por soft delete)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al eliminar el producto');
        this.cancelarEliminar();
      }
    });
  }

  editarProducto(id: string) {
    this.router.navigate(['/entrada-productos'], { queryParams: { edit: id } });
  }

  // === FILTROS Y FORMATO ===
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

  // === MENÚ ===
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}