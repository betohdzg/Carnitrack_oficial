<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SalidaProductoController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\TrabajadorController;
use App\Http\Controllers\Api\ReporteVentasController;
use App\Http\Controllers\Api\NominaController;
use App\Http\Controllers\Api\BonoController;        
use App\Http\Controllers\Api\HorasExtraController;  
use App\Http\Controllers\Api\DescuentoController;

// Login
Route::post('/login', [LoginController::class, 'login']);

Route::get('/reporte-ventas', [ReporteVentasController::class, 'index']);

// CRUD Trabajadores
Route::get('/mi-cuenta', [TrabajadorController::class, 'miCuenta']);
Route::apiResource('trabajadores', TrabajadorController::class);

Route::get('/productos/siguiente-id', [ProductoController::class, 'siguienteId']);
Route::apiResource('productos', ProductoController::class);

// RUTAS CORRECTAS PARA BONOS Y HORAS EXTRAS
Route::get('/bonos', [BonoController::class, 'index']);
Route::post('/bonos', [BonoController::class, 'store']);
Route::delete('/bonos/{id}', [BonoController::class, 'destroy']);

Route::get('/horas-extras', [HorasExtraController::class, 'index']);
Route::post('/horas-extras', [HorasExtraController::class, 'store']);
Route::delete('/horas-extras/{id}', [HorasExtraController::class, 'destroy']);

//RUTAS DE DESCUENTO
Route::get('/descuentos', [DescuentoController::class, 'index']);
Route::post('/descuentos', [DescuentoController::class, 'store']);
Route::delete('/descuentos/{id}', [DescuentoController::class, 'destroy']);

// Nómina
Route::post('/calcular-nomina', [NominaController::class, 'calcularNominaQuincenal']); // ← CORREGIDO
Route::post('/nominas-oficiales', [NominaController::class, 'guardarNominaOficial']);     // ← CORREGIDO
Route::get('/nominas-oficiales', [NominaController::class, 'index']);
// Salidas
Route::get('/productos-disponibles', [SalidaProductoController::class, 'obtenerProductos']);     
Route::post('/salida', [SalidaProductoController::class, 'registrarSalida']);
Route::get('/productos-mas-vendidos', [SalidaProductoController::class, 'obtenerProductosMasVendidos']);
Route::get('/ventas-productos', [SalidaProductoController::class, 'obtenerVentasProductos']);