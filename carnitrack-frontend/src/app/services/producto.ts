import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id_producto?: number;
  nombre: string;
  tipo_carne: 'res' | 'pollo' | 'pescado';
  precio_kg: number;
  stock_kg: number;
  fecha_entrada: string;
  fecha_caducidad: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/api/productos';

  constructor(private http: HttpClient) { }

  // Obtener todos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Guardar (crear o actualizar)
// En ProductoService
guardarProducto(producto: any, esEdicion: boolean = false): Observable<any> {
  const payload = {
    id: producto.id_producto,
    nombre: producto.nombre,
    tipo_carne: producto.tipo_carne,
    precio_kg: producto.precio_kg,
    stock_kg: producto.stock_kg,
    fecha_entrada: producto.fecha_entrada,
    fecha_caducidad: producto.fecha_caducidad
  };

  if (esEdicion) {
    return this.http.put(`${this.apiUrl}/${payload.id}`, payload);
  } else {
    return this.http.post(this.apiUrl, payload);
  }
}
// AÑADE ESTE MÉTODO
getProductoById(id: string): Observable<Producto> {
  return this.http.get<Producto>(`${this.apiUrl}/${id}`);
}
  // Eliminar
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}