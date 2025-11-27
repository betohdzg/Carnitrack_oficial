<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Movimiento;


class SalidaProductoController extends Controller
{
    public function index()
    {
        return view('salida-producto');
    }

    // GET /api/productos
public function obtenerProductos()
{
    try {
        // FORZAR A QUE MUESTRE EL ERROR REAL
        \Log::info('Intentando cargar productos...');
        
        $productos = DB::table('productos')
            ->select('id', 'nombre', 'precio_kg')
            ->get();

        \Log::info('Productos cargados: ' . $productos->count());
        
        return response()->json($productos);

    } catch (\Exception $e) {
        // ESTA ES LA CLAVE: mostrar el error real
        \Log::error('ERROR EN obtenerProductos: ' . $e->getMessage());
        \Log::error('Línea: ' . $e->getLine() . ' | Archivo: ' . $e->getFile());
        \Log::error('Trace: ' . $e->getTraceAsString());

        return response()->json([
            'error' => 'Error al cargar productos',
            'message' => $e->getMessage(),
            'line' => $e->getLine()
        ], 500);
    }
}

    // POST /api/salida
    public function registrarSalida(Request $request)
    {
        Log::info('=== REGISTRO DE SALIDA ===', $request->all());

        $request->validate([
            'id_producto' => 'required|string',
            'cantidad' => 'required|numeric|min:0.01',
        ]);

        $id_o_nombre = $request->id_producto;
        $cantidad = $request->cantidad;

        try {
            DB::beginTransaction();

            $producto = DB::table('productos')
                ->where('id', $id_o_nombre)
                ->orWhere('nombre', 'ilike', "%{$id_o_nombre}%")
                ->first();

            if (!$producto) {
                return response()->json(['error' => 'Producto no encontrado'], 404);
            }

            if ($cantidad > $producto->stock_kg) {
                return response()->json(['error' => 'No hay suficiente stock'], 400);
            }

            $total = $cantidad * $producto->precio_kg;

          // DESPUÉS (funciona 100%):
$movimientoId = DB::table('movimientos')->insertGetId([
    'id_productos' => $producto->id,
    'tipo' => 'salida',
    'cantidad' => $cantidad,
    'total_movimiento' => $total,
    'fecha' => now(),
], 'id_movimiento'); // ← le decimos explícitamente cuál es la PK


            // CLAVE: DB::update() SIN ::numeric → Laravel maneja el tipo
            DB::update('UPDATE productos SET stock_kg = stock_kg - ? WHERE id = ?', [$cantidad, $producto->id]);

            $nuevoStock = $producto->stock_kg - $cantidad;

            if ($nuevoStock <= ($producto->minimo_kg ?? 5)) {
                Log::warning("STOCK BAJO: {$producto->nombre} → {$nuevoStock} kg");
            }

            DB::commit();

            return response()->json([
                'success' => 'Salida registrada correctamente',
                'producto' => $producto->nombre,
                'cantidad' => $cantidad,
                'total' => $total,
                'nuevo_stock' => $nuevoStock,
                'movimiento_id' => $movimientoId
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ERROR EN SALIDA: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function obtenerProductosMasVendidos()
    {
        try {
            $productos = DB::table('productos as p')
                ->leftJoin('movimientos as m', function($join) {
                    $join->on('p.id', '=', 'm.id_productos')
                         ->where('m.tipo', '=', 'salida');
                })
                ->select('p.id', 'p.nombre', 'p.precio_kg', 'p.stock_kg')
                ->selectRaw('COALESCE(SUM(m.cantidad), 0) as total_vendido')
                ->groupBy('p.id', 'p.nombre', 'p.precio_kg', 'p.stock_kg')
                ->orderByDesc('total_vendido')
                ->limit(4)
                ->get();

            return response()->json($productos);
        } catch (\Exception $e) {
            Log::error('Error productos vendidos: ' . $e->getMessage());
            return response()->json(['error' => 'Error al cargar'], 500);
        }
    }

    public function obtenerVentasProductos()
    {
        try {
            $ventas = DB::table('movimientos as m')
                ->join('productos as p', 'm.id_productos', '=', 'p.id')
                ->where('m.tipo', 'salida')
                ->select('p.nombre')
                ->selectRaw('SUM(m.cantidad) as total_vendido')
                ->groupBy('p.nombre')
                ->orderByDesc('total_vendido')
                ->get();

            return response()->json($ventas);
        } catch (\Exception $e) {
            Log::error('Error ventas: ' . $e->getMessage());
            return response()->json(['error' => 'Error al cargar'], 500);
        }
    }
}