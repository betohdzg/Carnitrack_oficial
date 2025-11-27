import { Injectable } from '@angular/core';
import { LoginService } from '../app/services/login';
@Injectable({
  providedIn: 'root'  // Disponible en toda la app
})
export class AuthService {
  constructor(private loginService: LoginService) {}
  private currentRole: string | null = null;  // Almacena el rol ('gerente' o 'empleados')

  setRole(role: string) {
    this.currentRole = role;
    localStorage.setItem('role', role);  // Persiste en localStorage (simulado, borra al cerrar navegador)
  }

  getRole(): string | null {
    if (!this.currentRole) {
      this.currentRole = localStorage.getItem('role');  // Recupera si existe
    }
    return this.currentRole;
  }

esGerente(): boolean {
    return this.loginService.esGerente(); // DELEGAR
  }

  logout() {
    this.currentRole = null;
    localStorage.removeItem('role');
  }
}