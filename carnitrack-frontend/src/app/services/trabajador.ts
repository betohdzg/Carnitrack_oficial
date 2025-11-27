// src/app/services/trabajador.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// src/app/services/trabajador.service.ts
export interface Trabajador {
  id_trb?: number;     // NECESARIO al crear
  nom_trb: string;
  puesto: string;
  sal_base: number;
  user_trb: string;
  psw_trb: string;
  rol?: 'gerente' | 'empleado'; // opcional, no se guarda en BD
}

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'http://127.0.0.1:8000/api/trabajadores';

  constructor(private http: HttpClient) {}

  crear(trabajador: Trabajador): Observable<any> {
    const body = {
      nom_trb: trabajador.nom_trb,
      puesto: trabajador.puesto,
      sal_base: trabajador.sal_base,
      user_trb: trabajador.user_trb,
      psw_trb: trabajador.psw_trb
    };
    return this.http.post(this.apiUrl, body);
  }

  // PARA EDITAR Y ELIMINAR (más adelante)
  getAll(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl);
  }

  getById(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}