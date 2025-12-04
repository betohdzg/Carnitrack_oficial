import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-descuentos-nom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './descuentos-nom.html',
  styleUrls: ['./descuentos-nom.css']
})
export class DescuentosNomComponent implements OnInit {
  hoy = new Date().toISOString().split('T')[0];
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = true;

  empleados: any[] = [];
  registros: any[] = [];
  mostrarModalExito = false;

  // Objeto del formulario
  descuento = {
    empleado_id: 0,
    monto: 0,
    motivo: '',
    fecha: this.hoy
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,        // ← CORREGIDO: auth, no authServe
    private cdr: ChangeDetectorRef
  ) {
    this.isGerente = this.auth.esGerente();
  }

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/trabajadores').subscribe({
      next: (data) => {
        this.empleados = data.map(t => ({ id: t.id_trb, nombre: t.nom_trb }));
        this.cdr.detectChanges();
        this.cargarRegistros(); // ← Cargamos después de tener empleados
      },
      error: () => alert('Error al cargar empleados')
    });
  }

  cargarRegistros() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/descuentos').subscribe({
      next: (data) => {
        this.registros = data.map(r => ({
          id: r.id_desc,
          tipo: 'Descuento',
          empleado_id: r.id_trb,
          empleado_nombre: this.getNombre(r.id_trb),
          descripcion: r.motivo,
          monto: r.monto,
          fecha: r.fecha_registro
        })).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cdr.detectChanges();
      },
      error: () => this.registros = []
    });
  }

  getNombre(id: number): string {
    return this.empleados.find(e => e.id === id)?.nombre || 'Desconocido';
  }

  asignarDescuento() {
    if (!this.descuento.empleado_id || this.descuento.monto <= 0 || !this.descuento.motivo.trim()) {
      alert('Completa todos los campos correctamente');
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/descuentos', {
      id_trb: this.descuento.empleado_id,
      monto: this.descuento.monto,
      motivo: this.descuento.motivo.trim(),
      fecha_registro: this.descuento.fecha
    }).subscribe({
      next: () => {
        this.mostrarModalExito = true;
        this.cdr.detectChanges();
        this.resetForm();
        this.cargarRegistros();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar descuento');
      }
    });
  }

  eliminarRegistro(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este descuento?')) return;
    this.http.delete(`http://127.0.0.1:8000/api/descuentos/${id}`).subscribe(() => {
      this.cargarRegistros();
    });
  }

  resetForm() {
    this.descuento = { empleado_id: 0, monto: 0, motivo: '', fecha: this.hoy };
  }

  cerrarModal() {
    this.mostrarModalExito = false;
    this.router.navigate(['/dashboard']);
  }

  // Menú
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { 
    this.auth.logout(); 
    this.router.navigate(['/login']); 
  }
}