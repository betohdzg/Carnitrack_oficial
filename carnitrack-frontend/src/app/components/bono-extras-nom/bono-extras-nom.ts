// src/app/components/bonos-extra/bonos-extra.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';

interface Empleado {
  id: number;
  nombre: string;
}

interface Bono {
  id?: number;
  empleado_id: number;
  empleado_nombre: string;
  monto: number;
  motivo: string;
  horas_extras: number;
  fecha_pago: string;
}

@Component({
  selector: 'app-bonos-extra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bono-extras-nom.html',
  styleUrls: ['./bono-extras-nom.css']
})
export class BonosExtrasNomComponent implements AfterViewInit {
  menuActive = false;
  movimientosActive = false;  // ← NUEVO
  nominaActive = false;  isGerente = false;

  empleados: Empleado[] = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María López' },
    { id: 3, nombre: 'Pedro Gómez' }
  ];

  bono = {
    empleado_id: 0,
    monto: 0,
    motivo: '',
    horas_extras: 0,
    fecha_pago: ''
  };

  bonos: Bono[] = [
    { empleado_id: 1, empleado_nombre: 'Juan Pérez', monto: 500, motivo: 'Productividad', horas_extras: 2, fecha_pago: '2025-10-31' },
    { empleado_id: 2, empleado_nombre: 'María López', monto: 300, motivo: 'Puntualidad', horas_extras: 1, fecha_pago: '2025-10-31' }
  ];

  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  @ViewChild('acceptButton') acceptButton!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isGerente = this.authService.esGerente();
  }

  ngAfterViewInit() {
    this.setupModalEvents();
  }

  setupModalEvents() {
    this.closeBtn.nativeElement.addEventListener('click', () => this.cerrarModal());
    this.acceptButton.nativeElement.addEventListener('click', () => this.cerrarModal());
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

// Submenús independientes
  toggleMovimientos() {
    this.movimientosActive = !this.movimientosActive;
    // Opcional: cerrar el otro
    this.nominaActive = false;
  }

  toggleNomina() {
    this.nominaActive = !this.nominaActive;
    // Opcional: cerrar el otro
    this.movimientosActive = false;
  }

  logout() {
    this.authService.logout();
    alert('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  asignarBono(event: Event) {
    event.preventDefault();

    if (!this.bono.empleado_id || this.bono.monto <= 0 || !this.bono.fecha_pago) {
      alert('Completa los campos obligatorios');
      return;
    }

    const empleado = this.empleados.find(e => e.id === this.bono.empleado_id);
    if (!empleado) return;

    const nuevoBono: Bono = {
      empleado_id: this.bono.empleado_id,
      empleado_nombre: empleado.nombre,
      monto: this.bono.monto,
      motivo: this.bono.motivo,
      horas_extras: this.bono.horas_extras,
      fecha_pago: this.bono.fecha_pago
    };

    this.bonos.push(nuevoBono);
    this.mostrarModal();
    this.limpiarFormulario();
  }

  eliminarBono(index: number) {
    if (confirm('¿Eliminar este bono?')) {
      this.bonos.splice(index, 1);
    }
  }

  generarReporte() {
    alert('Reporte generado (próximo paso)');
  }

  mostrarModal() {
    this.successModal.nativeElement.style.display = 'flex';
  }

  cerrarModal() {
    this.successModal.nativeElement.style.display = 'none';
  }

  limpiarFormulario() {
    this.bono = {
      empleado_id: 0,
      monto: 0,
      motivo: '',
      horas_extras: 0,
      fecha_pago: ''
    };
  }
}