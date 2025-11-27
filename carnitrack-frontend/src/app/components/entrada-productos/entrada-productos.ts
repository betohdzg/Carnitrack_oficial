import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
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
export class EntradaComponent implements OnInit, AfterViewInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false; 
  isGerente = false;

  // Datos del formulario
producto: Producto = {
  
    nombre: '',
    tipo_carne: 'res',
    precio_kg: 0,
    stock_kg: 0,
    fecha_entrada: '',
    fecha_caducidad: ''
  };

  esEdicion = false;

  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  @ViewChild('acceptButton') acceptButton!: ElementRef;

constructor(
  private router: Router,
  private route: ActivatedRoute,
  private authService: AuthService,
  private productoService: ProductoService,
  private cdr: ChangeDetectorRef // ← INYECTAR

) {}
  ngOnInit() {
    this.isGerente = this.authService.esGerente();
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.esEdicion = true;
      this.cargarProductoParaEditar(editId);
    }

  }
  ngAfterViewInit() {
    this.closeBtn.nativeElement.addEventListener('click', () => {
      this.successModal.nativeElement.style.display = 'none';
    });
    this.acceptButton.nativeElement.addEventListener('click', () => {
      this.successModal.nativeElement.style.display = 'none';
    });
  }
cargarProductoParaEditar(id: string) {  // ← Cambia a string
  this.productoService.getProductoById(id).subscribe({
    next: (prod: any) => {
      this.producto = {
        id_producto: prod.id,  // ← guardar en id_producto para el formulario
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
  // Asegura formato YYYY-MM-DD
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0]; // → "2025-04-15"
}
  volverALaLista() {
  this.router.navigate(['/ver-productos-geren']);
}

guardarProducto(event: Event) {
  event.preventDefault();

  if (!this.producto.id_producto || !this.producto.nombre || !this.producto.tipo_carne) {
    alert('Completa los campos obligatorios');
    return;
  }

  const productoParaEnviar: any = {
    id: this.producto.id_producto,  // ← SIEMPRE ENVÍA id
    nombre: this.producto.nombre,
    tipo_carne: this.producto.tipo_carne,
    precio_kg: this.producto.precio_kg,
    stock_kg: this.producto.stock_kg,
    fecha_entrada: this.producto.fecha_entrada,
    fecha_caducidad: this.producto.fecha_caducidad
  };

  this.productoService.guardarProducto(this.producto, this.esEdicion).subscribe({
    next: (res) => {
      console.log('Éxito:', res);
      this.mostrarModal();
      this.limpiarFormulario();
    },
    error: (err) => {
      console.error('Error completo:', err);
      const msg = err.error?.message || err.error?.error || 'Error desconocido';
      alert('Error al guardar: ' + msg);
    }
  });
}

  mostrarModal() {
    this.successModal.nativeElement.style.display = 'block';
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