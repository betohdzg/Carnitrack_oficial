import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Usuario {
  id: number;
  nombre: string;
  puesto: string;
  rol: 'gerente' | 'empleado';
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api';
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {
    const guardado = localStorage.getItem('usuario');
    if (guardado) {
      this.usuarioActual.next(JSON.parse(guardado));
    }
  }

// src/app/services/login.service.ts
login(usuario: string, contraseña: string, rol_elegido: string) {
  const body = { usuario, contraseña, rol_elegido };
  return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
    tap(res => {
      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      localStorage.setItem('rol', res.usuario.rol); // OK
    })
  );
}

esGerente(): boolean {
  const rol = localStorage.getItem('rol');
  return rol === 'gerente';
}

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioActual.next(null);
  }



  getUsuario(): Usuario | null {
    return this.usuarioActual.value;
  }
}