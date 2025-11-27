import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth';
import { TrabajadorService, Trabajador } from '../../services/trabajador';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-crud-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './crud-empleados.html',
  styleUrls: ['./crud-empleados.css']
})
export class CrudEmpleadosComponent implements OnInit, AfterViewInit {
  menuActive = false;
  movimientosActive = false;
  nominaActive = false;
  isGerente = false;

  empleado: Trabajador = {
    id_trb: undefined,
    nom_trb: '',
    puesto: '',
    sal_base: 0,
    user_trb: '',
    psw_trb: '',
    rol: 'empleado'
  };

  esEdicion = false;

  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  @ViewChild('acceptButton') acceptButton!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private trabajadorService: TrabajadorService,
    private cdr: ChangeDetectorRef // ← INYECTAR
  ) {}

  ngOnInit(): void {
    this.isGerente = this.authService.esGerente();
    const editId = this.route.snapshot.queryParamMap.get('edit');
    if (editId) {
      this.esEdicion = true;
      this.cargarEmpleado(+editId);
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

  cargarEmpleado(id: number) {
    this.trabajadorService.getById(id).subscribe({
      next: (trab: Trabajador) => {
        this.empleado = {
          id_trb: trab.id_trb,
          nom_trb: trab.nom_trb,
          puesto: trab.puesto,
          sal_base: trab.sal_base,
          user_trb: trab.user_trb,
          psw_trb: '', // NO CARGAR CONTRASEÑA
          rol: 'empleado' // Asumimos que no se edita el rol aquí
        };
        this.cdr.detectChanges();
      },
      error: () => {
        alert('No se pudo cargar el empleado');
        this.router.navigate(['/cuentas-empleadoss']);
      }
    });
  }

  guardarEmpleado(event: Event) {
    event.preventDefault();

    if (!this.empleado.nom_trb || !this.empleado.puesto || !this.empleado.user_trb) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    if (this.empleado.sal_base <= 0) {
      alert('El salario debe ser mayor a 0');
      return;
    }

    // Si es edición y no hay contraseña, no la enviamos
    const data: any = {
      nom_trb: this.empleado.nom_trb,
      puesto: this.empleado.puesto,
      sal_base: this.empleado.sal_base,
      user_trb: this.empleado.user_trb
    };

    // Solo enviar contraseña si se escribió
    if (this.empleado.psw_trb && this.empleado.psw_trb.length >= 6) {
      data.psw_trb = this.empleado.psw_trb;
    } else if (!this.esEdicion) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const accion = this.esEdicion
      ? this.trabajadorService.update(this.empleado.id_trb!, data)
      : this.trabajadorService.crear(data);

    accion.subscribe({
      next: (res) => {
        this.mostrarModal();
        if (!this.esEdicion) {
          this.limpiarFormulario();
        }
        console.log(this.esEdicion ? 'Empleado actualizado:' : 'Empleado creado:', res);
      },
      error: (err) => {
        console.error('Error:', err);
        const msg = err.error?.errors 
          ? Object.values(err.error.errors).flat().join(', ')
          : 'Error al guardar el empleado';
        alert(msg);
      }
    });
  }

  volverALaLista() {
    this.router.navigate(['/cuentas-empleadoss']);
  }

  mostrarModal() {
    this.successModal.nativeElement.style.display = 'block';
  }

  limpiarFormulario() {
    this.empleado = {
      id_trb: undefined,
      nom_trb: '',
      puesto: '',
      sal_base: 0,
      user_trb: '',
      psw_trb: '',
      rol: 'empleado'
    };
    this.esEdicion = false;
  }

  // MENÚ
  toggleMenu() { this.menuActive = !this.menuActive; }
  toggleMovimientos() { this.movimientosActive = !this.movimientosActive; this.nominaActive = false; }
  toggleNomina() { this.nominaActive = !this.nominaActive; this.movimientosActive = false; }
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}