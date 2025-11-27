<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SalidaProductoController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\TrabajadorController;
use App\Http\Controllers\Api\ReporteVentasController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Login
Route::post('/login', [LoginController::class, 'login']);
Route::get('/reporte-ventas', [ReporteVentasController::class, 'index']);

// CRUD Trabajadores
Route::apiResource('trabajadores', TrabajadorController::class);

/*
| CRUD COMPLETO DE PRODUCTOS (esto crea automáticamente):
| GET    /api/productos          → index()   ← ESTE ES EL QUE USA TU INVENTARIO
| POST   /api/productos          → store()
| GET    /api/productos/{id}     → show()
| PUT    /api/productos/{id}     → update()
| DELETE /api/productos/{id}     → destroy()
*/
Route::apiResource('productos', ProductoController::class);

/*
| RUTAS PARA SALIDAS DE PRODUCTO (ya NO chocan con el CRUD)
| Cambiamos el nombre para que no sobreescriban la ruta principal
*/
Route::get('/productos-disponibles', [SalidaProductoController::class, 'obtenerProductos']);           // ← para el formulario de salida
Route::post('/salida', [SalidaProductoController::class, 'registrarSalida']);
Route::get('/productos-mas-vendidos', [SalidaProductoController::class, 'obtenerProductosMasVendidos']);
Route::get('/ventas-productos', [SalidaProductoController::class, 'obtenerVentasProductos']);