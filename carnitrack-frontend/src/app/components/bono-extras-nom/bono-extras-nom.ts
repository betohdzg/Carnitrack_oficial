import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-bonos-extras-nom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bono-extras-nom.html',
  styleUrls: ['./bono-extras-nom.css']
})
export class BonosExtrasNomComponent implements OnInit {
  hoy = new Date().toISOString().split('T')[0];
  menuActive = false; movimientosActive = false; nominaActive = false;
  isGerente = true;
  empleados: any[] = [];
  registros: any[] = [];
  mostrarModalExito = false;
  ultimaAccion: 'bono' | 'hex' | null = null;
  bono = { empleado_id: 0, monto: 0, motivo: '', fecha: this.hoy };
  hex = { empleado_id: 0, horas: 1, fecha: this.hoy };
  @ViewChild('successModal') successModal!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private cdr: ChangeDetectorRef 
  ) {
    this.isGerente = this.auth.esGerente();
  }

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/trabajadores').subscribe(d => {
      this.empleados = d.map(t => ({ id: t.id_trb, nombre: t.nom_trb }));
      this.cdr.detectChanges();
      this.cargarRegistros(); // Mueve aquí para asegurar que empleados estén cargados antes de registros
    });
  }

  cargarRegistros() {
    forkJoin({
      bonos: this.http.get<any[]>('http://127.0.0.1:8000/api/bonos'),
      extras: this.http.get<any[]>('http://127.0.0.1:8000/api/horas-extras')
    }).subscribe({
      next: ({ bonos, extras }) => {
        const b = bonos.map(x => ({
          id: x.id_bono, tipo: 'Bono', empleado_id: x.id_trb,
          empleado_nombre: this.getNombre(x.id_trb), descripcion: x.motivo,
          monto: x.monto, fecha: x.fecha_registro
        }));
        const e = extras.map(x => ({
          id: x.id_hex, tipo: 'Horas Extras', empleado_id: x.id_trb,
          empleado_nombre: this.getNombre(x.id_trb), descripcion: 'Horas extras trabajadas',
          horas: x.horas, fecha: x.fecha
        }));
        this.registros = [...b, ...e].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cdr.detectChanges(); // Asegura actualización después de cargar registros
      },
      error: () => {
        this.registros = [];
      }
    });
  }

  getNombre(id: number) {
    return this.empleados.find(e => e.id === id)?.nombre || 'Desconocido';
  }

  asignarBono() {
    if (!this.bono.empleado_id || this.bono.monto <= 0 || !this.bono.motivo || this.bono.motivo.trim() === '') {
      alert('Completa todos los campos, incluyendo un motivo válido');
      return;
    }
    this.http.post('http://127.0.0.1:8000/api/bonos', {
      id_trb: this.bono.empleado_id,
      monto: this.bono.monto,
      motivo: this.bono.motivo.trim(), // ← Asegura que no esté vacío
      fecha_registro: this.bono.fecha
    }).subscribe({
      next: () => {
        this.ultimaAccion = 'bono';
        this.mostrarModalExito = true;
        this.cdr.detectChanges(); // Fuerza detección de cambios para mostrar el modal inmediatamente
        this.resetBono();
        this.cargarRegistros();
      },
      error: (err) => {
        console.error('Error completo:', err);
        alert('Error al guardar bono. Revisa la consola.');
      }
    });
  }

  registrarHorasExtras() {
    if (!this.hex.empleado_id || this.hex.horas < 1) return alert('Completa los campos');
    this.http.post('http://127.0.0.1:8000/api/horas-extras', {
      id_trb: this.hex.empleado_id,
      horas: this.hex.horas,
      fecha: this.hex.fecha
    }).subscribe({
      next: () => {
        this.ultimaAccion = 'hex';
        this.mostrarModalExito = true;
        this.cdr.detectChanges(); // Fuerza detección de cambios para mostrar el modal inmediatamente
        this.resetHex();
        this.cargarRegistros();
      },
      error: (err) => {
        console.error('Error completo:', err);
        alert('Error al guardar horas extras. Revisa la consola.');
      }
    });
  }

  eliminarRegistro(id: number, tipo: string) {
    if (!confirm('¿Eliminar?')) return;
    const url = tipo === 'Bono' ? `bonos/${id}` : `horas-extras/${id}`;
    this.http.delete(`http://127.0.0.1:8000/api/${url}`).subscribe(() => this.cargarRegistros());
  }

  cerrarModal() {
    this.mostrarModalExito = false;
    this.ultimaAccion = null;
    this.router.navigate(['/dashboard']); 
  }

  resetBono() {
    this.bono = { empleado_id: 0, monto: 0, motivo: '', fecha: this.hoy };
  }

  resetHex() {
    this.hex = { empleado_id: 0, horas: 1, fecha: this.hoy };
  }

  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}