import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';
import { HttpClient } from '@angular/common/http';

interface Producto {
  id: string;
  nombre: string;
  precio_kg: number;
}

@Component({
  selector: 'app-salida-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './salida-producto.html',
  styleUrls: ['./salida-producto.css']
})
export class SalidaProductoComponent implements OnInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;

  productos: Producto[] = [];
  sugerencias: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  busqueda = '';
  cantidad = 0;
  precioTotal = '';

  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('warningModal') warningModal!: ElementRef;
  @ViewChild('successMessage') successMessage!: ElementRef;
  @ViewChild('warningMessage') warningMessage!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isGerente = this.authService.esGerente();
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/productos').subscribe({
      next: (data) => {
        console.log('Datos crudos de Laravel:', data);
        this.productos = data.map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio_kg: parseFloat(p.precio_kg)
        }));
        console.log('Productos mapeados:', this.productos);
      },
      error: (err) => {
        console.error('Error API:', err);
        alert('Error al cargar productos. Asegúrate de que Laravel esté corriendo.');
      }
    });
  }

  private busquedaTimeout: any;

  onBusqueda() {
    clearTimeout(this.busquedaTimeout);
    this.busquedaTimeout = setTimeout(() => {
      const texto = this.busqueda?.trim().toLowerCase() || '';
      if (!texto || this.productos.length === 0) {
        this.sugerencias = [];
        return;
      }

      this.sugerencias = this.productos
        .filter(p => 
          p.nombre.toLowerCase().includes(texto) || 
          p.id.toLowerCase().includes(texto)
        )
        .slice(0, 5);

      this.cdr.detectChanges();
    }, 100);
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
    this.busqueda = producto.nombre;
    this.sugerencias = [];
    this.calcularTotal();
  }

  onCantidad() {
    this.calcularTotal();
  }

  calcularTotal() {
    if (this.productoSeleccionado && this.cantidad > 0) {
      const total = this.productoSeleccionado.precio_kg * this.cantidad;
      this.precioTotal = `$${total.toFixed(2)}`;
    } else {
      this.precioTotal = '';
    }
  }

  // CONFIRMAR VENTA - CORREGIDO: usa 'id' y fuerza 2 decimales
  confirmarVenta() {
    if (!this.productoSeleccionado || this.cantidad <= 0) {
      this.mostrarModal('warning', 'Selecciona un producto y cantidad válida');
      return;
    }

    const payload = {
      id_producto: this.productoSeleccionado.id,  // ← CORREGIDO: usa 'id'
      cantidad: parseFloat(this.cantidad.toFixed(2))  // ← FORZAR 2 DECIMALES
    };

    console.log('ENVIANDO:', payload);

    this.http.post('http://127.0.0.1:8000/api/salida', payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.mostrarModal('success', res.success);
          this.limpiar();
          this.cargarProductos(); // Recargar stock actualizado
        }
      },
      error: (err) => {
        console.error('Error:', err);
        const msg = err.error?.error || 'Error al registrar salida';
        this.mostrarModal('warning', msg);
      }
    });
  }

  mostrarModal(tipo: 'success' | 'warning', mensaje: string) {
    const modal = tipo === 'success' ? this.successModal : this.warningModal;
    const texto = tipo === 'success' ? this.successMessage : this.warningMessage;
    if (texto?.nativeElement) texto.nativeElement.textContent = mensaje;
    modal.nativeElement.style.display = 'flex';
  }

  cerrarModal(tipo: 'success' | 'warning') {
    const modal = tipo === 'success' ? this.successModal : this.warningModal;
    modal.nativeElement.style.display =  'none';
  }

  limpiar() {
    this.busqueda = '';
    this.cantidad = 0;
    this.precioTotal = '';
    this.productoSeleccionado = null;
    this.sugerencias = [];
  }

  // Menú
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}