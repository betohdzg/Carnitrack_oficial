// src/app/components/calcular-nomina/calcular-nomina.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';

interface Empleado {
  id: number;
  nombre: string;
  salario: number;
}

interface Nomina {
  id: number;
  empleado_id: number;
  empleado_nombre: string;
  periodo_pago: string;
  salario_base: number;
  horas_extras: number;
  bonos: number;
  salario_total: number;
}

@Component({
  selector: 'app-calcular-nomina',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './calcular-nomina.html',
  styleUrls: ['./calcular-nomina.css']
})
export class CalcularNominaComponent implements AfterViewInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;

  empleados: Empleado[] = [
    { id: 1, nombre: 'Juan Pérez', salario: 5000 },
    { id: 2, nombre: 'María López', salario: 6000 }
  ];

  nomina: Nomina = {
    id: 0,
    empleado_id: 0,
    empleado_nombre: '',
    periodo_pago: '',
    salario_base: 0,
    horas_extras: 0,
    bonos: 0,
    salario_total: 0
  };

  nominas: Nomina[] = [
    { id: 1, empleado_id: 1, empleado_nombre: 'Juan Pérez', periodo_pago: '2025-10-31', salario_base: 5000, horas_extras: 10, bonos: 500, salario_total: 5500 },
    { id: 2, empleado_id: 2, empleado_nombre: 'María López', periodo_pago: '2025-10-31', salario_base: 6000, horas_extras: 5, bonos: 300, salario_total: 6300 }
  ];

  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  @ViewChild('acceptButton') acceptButton!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isGerente = this.authService.esGerente();
    this.generarIdNomina();
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

  toggleMovimientos() {
    this.movimientosActive = !this.movimientosActive;
    this.nominaActive = false;
  }

  toggleNomina() {
    this.nominaActive = !this.nominaActive;
    this.movimientosActive = false;
  }

  logout() {
    this.authService.logout();
    alert('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  generarIdNomina() {
    this.nomina.id = this.nominas.length > 0 ? Math.max(...this.nominas.map(n => n.id)) + 1 : 1;
  }

  cargarEmpleado() {
    const emp = this.empleados.find(e => e.id === this.nomina.empleado_id);
    if (emp) {
      this.nomina.empleado_nombre = emp.nombre;
      this.nomina.salario_base = emp.salario;
      this.calcularTotal();
    }
  }

  calcularTotal() {
    const pagoHorasExtras = this.nomina.horas_extras * (this.nomina.salario_base / 160); // 160 horas/mes
    this.nomina.salario_total = this.nomina.salario_base + pagoHorasExtras + this.nomina.bonos;
  }

  calcularNomina() {
    if (!this.nomina.empleado_id || !this.nomina.periodo_pago) {
      alert('Seleccione empleado y fecha');
      return;
    }
    this.calcularTotal();
    alert('Nómina calculada: $' + this.nomina.salario_total.toFixed(2));
  }

  guardarNomina() {
    if (!this.nomina.empleado_id || !this.nomina.periodo_pago || this.nomina.salario_total === 0) {
      alert('Complete todos los campos y calcule la nómina');
      return;
    }

    const nuevaNomina: Nomina = { ...this.nomina };
    this.nominas.push(nuevaNomina);
    this.mostrarModal();
    this.limpiarFormulario();
    this.generarIdNomina();
  }

  mostrarModal() {
    this.successModal.nativeElement.style.display = 'flex';
  }

  cerrarModal() {
    this.successModal.nativeElement.style.display = 'none';
  }

  limpiarFormulario() {
    this.nomina = {
      id: this.nomina.id + 1,
      empleado_id: 0,
      empleado_nombre: '',
      periodo_pago: '',
      salario_base: 0,
      horas_extras: 0,
      bonos: 0,
      salario_total: 0
    };
  }
}