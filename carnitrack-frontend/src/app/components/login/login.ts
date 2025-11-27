import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login'; // ← Asegúrate del path

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ← FormsModule necesario
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  currentRole: 'gerente' | 'empleado' = 'empleado';
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  selectRole(role: 'gerente' | 'empleado') {
    this.currentRole = role;
  }

hacerLogin() {
  this.loginService.login(this.usuario, this.password, this.currentRole).subscribe({
    next: () => {
      this.router.navigate(['/dashboard']); // REDIRIGE
    },
    error: (err) => alert(err.error?.mensaje || 'Error')
  });


    console.log('Intentando login...', { usuario: this.usuario, rol: this.currentRole });

    this.loginService.login(this.usuario, this.password, this.currentRole).subscribe({
      next: (res) => {
        alert(`¡Bienvenido, ${res.usuario.nombre}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.error?.mensaje || 'Error en login';
        alert(msg);
      }
    });
  }
}