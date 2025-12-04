// entrada-productos.component.ts → VERSIÓN FINAL DEFINITIVA

import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth';
import { ProductoService, Producto } from '../../services/producto';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './entrada-productos.html',
  styleUrls: ['./entrada-productos.css']
})
export class EntradaComponent implements OnInit {

  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;
  generandoId = false; // para mostrar un spinner si quieres

  // MODALES
  mostrarModalExito = false;
  mostrarModalConfirmarEliminar = false;
  productoAEliminar: string | null = null; // ID del producto a eliminar

  // Datos del formulario
producto: Producto = {
  id_producto: '',        // ← string vacío
  nombre: '',
  tipo_carne: 'res',
  precio_kg: 0,
  stock_kg: 0,
  fecha_entrada: '',
  fecha_caducidad: ''
};
  esEdicion = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {
    this.isGerente = this.authService.esGerente();
  }

  ngOnInit() {
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.esEdicion = true;
      this.cargarProductoParaEditar(editId);
    }
  }

onTipoCarneChange() {
  if (this.esEdicion) return;

  const tipo = this.producto.tipo_carne;
  if (!tipo) {
    this.producto.id_producto = '';
    return;
  }

  this.generandoId = true;
  this.productoService.getSiguienteId(tipo).subscribe({
    next: (res: any) => {
      this.producto.id_producto = res.id;
      this.generandoId = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error generando ID:', err);
      alert('No se pudo generar el ID automático. Verifica la conexión.');
      this.generandoId = false;
    }
  });
}

  cargarProductoParaEditar(id: string) {
    this.productoService.getProductoById(id).subscribe({
      next: (prod: any) => {
        this.producto = {
          id_producto: prod.id,
          nombre: prod.nombre,
          tipo_carne: prod.tipo_carne,
          precio_kg: prod.precio_kg,
          stock_kg: prod.stock_kg,
          fecha_entrada: this.formatearFechaParaInput(prod.fecha_entrada),
          fecha_caducidad: this.formatearFechaParaInput(prod.fecha_caducidad)
        };
        this.cdr.detectChanges();
      },
      error: () => {
        alert('No se pudo cargar el producto');
        this.router.navigate(['/ver-productos-geren']);
      }
    });
  }

  formatearFechaParaInput(fecha: string | null): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  }

volverALaLista() {
  const ruta = this.isGerente ? '/ver-productos-geren' : '/ver-productos-emple';
  this.router.navigate([ruta]);
}

  guardarProducto(event: Event) {
    event.preventDefault();

    if (!this.producto.nombre || !this.producto.tipo_carne || this.producto.precio_kg <= 0 || this.producto.stock_kg <= 0) {
      alert('Completa todos los campos obligatorios correctamente');
      return;
    }

    this.productoService.guardarProducto(this.producto, this.esEdicion).subscribe({
      next: () => {
        this.mostrarModalExito = true;
        this.cdr.detectChanges(); // Aparece al instante
        this.limpiarFormulario();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al guardar producto';
        alert(msg);
      }
    });
  }

  // === MODAL CONFIRMAR ELIMINAR ===
  abrirConfirmarEliminar(id: string) {
    this.productoAEliminar = id;
    this.mostrarModalConfirmarEliminar = true;
    this.cdr.detectChanges();
  }

  cancelarEliminar() {
    this.mostrarModalConfirmarEliminar = false;
    this.productoAEliminar = null;
  }




  // === MODAL ÉXITO ===
cerrarModalExito() {
  this.mostrarModalExito = false;
  const ruta = this.isGerente ? '/ver-productos-geren' : '/ver-productos-emple';
  this.router.navigate([ruta]);
}

  limpiarFormulario() {
    this.producto = {
      nombre: '',
      tipo_carne: 'res',
      precio_kg: 0,
      stock_kg: 0,
      fecha_entrada: '',
      fecha_caducidad: ''
    };
    this.esEdicion = false;
  }

  // Menú
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}