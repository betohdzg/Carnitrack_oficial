import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth';
import { TrabajadorService, Trabajador } from '../../services/trabajador';
import { ChangeDetectorRef } from '@angular/core';

interface TrabajadorTabla {
  id_trb: number;
  nom_trb: string;
  puesto: string;
  sal_base: string;
  user_trb: string;
   rol?: 'gerente' | 'empleado'; // opcional, no se guarda en BD

}

@Component({
  selector: 'app-cuentas-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cuenta-empleados.html',
  styleUrls: ['./cuenta-empleados.css']
})
export class CuentasEmpleadosComponent implements OnInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;

  rows: TrabajadorTabla[] = [];
  filteredEmpleados: TrabajadorTabla[] = [];
  searchQuery = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private trabajadorService: TrabajadorService,
    private cdr: ChangeDetectorRef // ← INYECTAR

  ) {}

  ngOnInit(): void {
    this.isGerente = this.authService.esGerente();
    this.cargarTrabajadores();
  }

cargarTrabajadores() {
  this.trabajadorService.getAll().subscribe({
    next: (data: Trabajador[]) => {
      this.rows = data.map(t => ({
        id_trb: t.id_trb ?? 0,  // ← CONVIERTE undefined → 0
        nom_trb: t.nom_trb || 'Sin nombre',
        puesto: t.puesto || 'Sin puesto',
        sal_base: `$${Number(t.sal_base).toFixed(2)}`,
        user_trb: t.user_trb || 'Sin usuario'
      }));
      this.filteredEmpleados = [...this.rows];
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al cargar trabajadores:', err);
      alert('Error de conexión con el servidor');
      // Datos de respaldo
      this.rows = [
        { id_trb: 0, nom_trb: 'Juan Pérez', puesto: 'Cajero', sal_base: '$8,500.00', user_trb: 'juan123' }
      ];
      this.filteredEmpleados = [...this.rows];
      this.cdr.detectChanges();

    }
  });
}

  filterTable() {
    const filter = this.searchQuery.toLowerCase().trim();
    if (!filter) {
      this.filteredEmpleados = [...this.rows];
      return;
    }
    this.filteredEmpleados = this.rows.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(filter)
      )
    );
  }

  editarEmpleado(id: number) {
    this.router.navigate(['/crud-empleados'], { queryParams: { edit: id } });
  }

eliminarEmpleado(id: number) {
  if (confirm('¿Estás seguro de eliminar este empleado?')) {
    this.trabajadorService.delete(id).subscribe({
      next: () => {
        this.rows = this.rows.filter(t => t.id_trb !== id);
        this.filteredEmpleados = this.filteredEmpleados.filter(t => t.id_trb !== id);
        alert('Empleado eliminado');
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al eliminar');
      }
    });
  }
}

  // MENÚ
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}