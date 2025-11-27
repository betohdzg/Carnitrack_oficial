import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth';


@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.html',
  styleUrls: ['./mi-cuenta.css'],
  imports: [CommonModule, RouterLink],

 
})
export class MiCuentaComponent {
  showPassword = false;
  menuActive: boolean = false;
  movimientosActive: boolean = false;
  nominaActive: boolean = false;
  isGerente: boolean = false;
  constructor(private router: Router, private authService: AuthService) {
    this.isGerente = this.authService.esGerente();
  }
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

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
  
  // Simulación de usuario (luego vendrá del servicio/auth)
  user = {
    nombre: 'Roberto',
    correo: 'robertgrim008@gmail.com',
    contrasena: '12345678'
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

      logout() {
    this.authService.logout();
    alert('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}