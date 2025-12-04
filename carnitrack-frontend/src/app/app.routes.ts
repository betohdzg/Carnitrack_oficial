import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { VerProductosEmpComponent } from './components/ver-productos-emple/ver-productos-emple';
import { SalidaProductoComponent } from './components/salida-producto/salida-producto';
import { ReporteVentasComponent } from './components/reporte-ventas/reporte-ventas';
import { VerProductosGerenComponent } from './components/ver-productos-geren/ver-productos-geren';
import { EntradaComponent } from './components/entrada-productos/entrada-productos';
import { CuentasEmpleadosComponent } from './components/cuenta-empleados/cuenta-empleados';
import { CrudEmpleadosComponent } from './components/crud-empleados/crud-empleados';
import { BonosExtrasNomComponent } from './components/bono-extras-nom/bono-extras-nom';
import { CalcularNominaComponent } from './components/calcular-nomina/calcular-nomina';
import { DescuentosNomComponent } from './components/descuentos-nom/descuentos-nom';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección a login como primera prioridad
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ver-productos-emple', component: VerProductosEmpComponent },
  { path: 'salida-producto', component: SalidaProductoComponent },
  { path: 'reporte-ventas', component: ReporteVentasComponent },
  { path: 'ver-productos-geren', component: VerProductosGerenComponent },
  { path: 'entrada-productos', component: EntradaComponent },
  { path: 'cuentas-empleadoss', component: CuentasEmpleadosComponent },
  { path: 'crud-empleados', component: CrudEmpleadosComponent},
  { path: 'bono-extras-nom', component: BonosExtrasNomComponent},
  { path: 'calcular-nomina', component: CalcularNominaComponent},
  { path: 'descuentos-nom', component: DescuentosNomComponent},
  { path: '**', redirectTo: '/login' } // Ruta comodín para errores
];