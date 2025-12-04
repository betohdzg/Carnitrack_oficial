import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Nomina {
  id_nom?: number;
  id_trb: number;
  period_pay: string;
  sal_base: number;
  hrs_ext: number;
  bonos: number;
  sal_total: number;
  trabajador?: { nom_trb: string };
}

@Injectable({ providedIn: 'root' })
export class NominaService {
  private api = 'http://127.0.0.1:8000/api/nominas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Nomina[]> {
    return this.http.get<Nomina[]>(this.api);
  }

  crear(nomina: any): Observable<any> {
    return this.http.post(this.api, nomina);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}