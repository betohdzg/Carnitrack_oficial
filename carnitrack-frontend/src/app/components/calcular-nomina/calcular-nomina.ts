import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calcular-nomina',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './calcular-nomina.html',
  styleUrls: ['./calcular-nomina.css']
})
export class CalcularNominaComponent implements OnInit {

  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = true;

  empleados: any[] = [];
  nominasOficiales: any[] = [];

  // MODALES
  mostrarModalExito = false;
  mostrarModalConfirm = false;
  accionPendiente: 'guardar' | null = null;

  // Datos del formulario
  nomina = {
    empleado_id: 0,
    nombre: '',
    salario: 0,
    inicio: '',
    fin: '',
    calculada: false,
    sal_base: 0,
    total_hex: 0,
    monto_hex: 0,
    total_bonos: 0,
    total_descuentos: 0,  // ← AGREGA ESTO
    sal_total: 0
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.isGerente = this.authService.esGerente();
  }

  ngOnInit(): void {
    this.cargarEmpleados();
    this.cargarNominasOficiales();
  }

  cargarEmpleados() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/trabajadores').subscribe({
      next: (data) => {
        this.empleados = data.map(t => ({
          id: t.id_trb,
          nombre: t.nom_trb,
          salario: t.sal_base
        }));
        this.cdr.detectChanges(); // ← Crucial para que el <select> se llene al instante
      },
      error: () => alert('Error cargando empleados')
    });
  }

  cargarSalarioBase() {
    const emp = this.empleados.find(e => e.id === this.nomina.empleado_id);
    if (emp) {
      this.nomina.nombre = emp.nombre;
    }
  }

  calcularNominaAutomatica() {
    if (!this.nomina.empleado_id || !this.nomina.inicio || !this.nomina.fin) {
      return alert('Selecciona empleado y periodo completo');
    }

    this.http.post('http://127.0.0.1:8000/api/calcular-nomina', {
      id_trb: this.nomina.empleado_id,
      periodo_inicio: this.nomina.inicio,
      periodo_fin: this.nomina.fin
    }).subscribe({
      next: (res: any) => {
        this.nomina.calculada = true;
        this.nomina.sal_base = res.sal_base;
        this.nomina.total_hex = res.total_horas_extras;
        this.nomina.monto_hex = res.monto_horas_extras;
        this.nomina.total_bonos = res.total_bonos;
        this.nomina.total_descuentos = Number(res.total_descuentos || 0); // ← SEGURO
        this.nomina.sal_total = res.sal_total;
        this.cdr.detectChanges(); // ← Aparece el resultado al instante
      },
      error: () => alert('Error al calcular nómina')
    });
  }

  // MODALES
  abrirConfirmacionGuardar() {
    this.mostrarModalConfirm = true;
    this.accionPendiente = 'guardar';
  }

  confirmarAccion() {
    if (this.accionPendiente === 'guardar') {
      this.guardarNominaOficialReal();
    }
  }

  guardarNominaOficialReal() {
    this.http.post('http://127.0.0.1:8000/api/nominas-oficiales', {
      id_trb: this.nomina.empleado_id,
      periodo_ini: this.nomina.inicio,
      periodo_fin: this.nomina.fin,
      sal_base: this.nomina.sal_base,
      total_horas_extras: this.nomina.total_hex,
      total_bonos: this.nomina.total_bonos,
      total_descuentos: this.nomina.total_descuentos || 0,  // ← ENVÍA EL DESCUENTO
      sal_total: this.nomina.sal_total
    }).subscribe({
      next: () => {
        this.cerrarModalConfirm();     // ← Cierra confirmación
        this.mostrarModalExito = true;
        this.cdr.detectChanges(); // ← Modal de éxito aparece INMEDIATAMENTE
        this.cargarNominasOficiales();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar nómina oficial');
      }
    });
  }

  cargarNominasOficiales() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/nominas-oficiales').subscribe(data => {
      this.nominasOficiales = data.map(n => {
        const format = (d: string) => d ? d.split('T')[0].split('-').reverse().join('/') : '';
        return {
          ...n,
          periodo_inicio: n.periodo_ini ? format(n.periodo_ini) : '',
          periodo_fin: n.periodo_fin ? format(n.periodo_fin) : ''
        };
      });
      this.cdr.detectChanges();
    });
  }

  cerrarModalConfirm() {
    this.mostrarModalConfirm = false;
    this.accionPendiente = null;
  }

  cerrarModalExito() {
    this.mostrarModalExito = false;
    this.router.navigate(['/dashboard']); // ← Aquí sí te lleva al inicio
  }

  resetForm() {
    this.nomina = {
      empleado_id: 0,
      nombre: '',
      salario: 0,
      inicio: '',
      fin: '',
      calculada: false,
      sal_base: 0,
      total_hex: 0,
      monto_hex: 0,
      total_bonos: 0,
      total_descuentos: 0,     // ← RESETEADO
      sal_total: 0
    };
  }

  // Menú
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}