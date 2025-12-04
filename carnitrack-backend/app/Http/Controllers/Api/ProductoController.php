<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
public function index()
{
    // USA ELOQUENT, NO DB::table
    return response()->json(Producto::all());
}

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo_carne' => 'required|in:res,pollo,pescado',
            'precio_kg' => 'required|numeric|min:0',
            'stock_kg' => 'required|numeric|min:0',
            'fecha_entrada' => 'required|date',
            'fecha_caducidad' => 'required|date|after:fecha_entrada',
        ]);

        $producto = Producto::create($request->all());
        return response()->json($producto, 201);
    }

    public function show($id)
{
    $producto = Producto::find($id); // ← find() SÍ funciona si el modelo está bien
    return $producto 
        ? response()->json($producto) 
        : response()->json(['error' => 'No encontrado'], 404);
}
        //EDITAR PRODUCTO 
    public function update(Request $request, $id)
{
    $producto = Producto::find($id); // ← Usa find(), que respeta $primaryKey
    if (!$producto) {
        return response()->json(['error' => 'Producto no encontrado'], 404);
    }

    $request->validate([
        'nombre' => 'required|string|max:255',
        'tipo_carne' => 'required|in:res,pollo,pescado',
        'precio_kg' => 'required|numeric|min:0',
        'stock_kg' => 'required|numeric|min:0',
        'fecha_entrada' => 'required|date',
        'fecha_caducidad' => 'required|date|after:fecha_entrada',
    ]);

    $producto->update($request->all());
    return response()->json($producto);
}

public function destroy($id)
{
    $producto = Producto::find($id);
    
    if (!$producto) {
        return response()->json(['error' => 'No encontrado'], 404);
    }

    $producto->delete(); // ← ahora es soft delete

    return response()->json(['mensaje' => 'Producto eliminado correctamente']);
}

public function siguienteId(Request $request)
{
    $tipo = $request->query('tipo');

    $prefijo = match(strtolower($tipo)) {
        'res'     => 'CAR-RES-',
        'pollo'   => 'CAR-POLLO-',
        'pescado' => 'CAR-PESCADO-',
        default   => 'CAR-DES-',
    };

    // Incluye productos eliminados (soft deletes) para no reutilizar IDs
    $ultimo = Producto::withTrashed()
        ->where('id', 'LIKE', $prefijo . '%')
        ->orderBy('id', 'desc')
        ->first();

    $siguiente = 1;
    if ($ultimo) {
        $numero = (int) substr($ultimo->id, -3);
        $siguiente = $numero + 1;
    }

    $nuevoId = $prefijo . str_pad($siguiente, 3, '0', STR_PAD_LEFT);

    return response()->json(['id' => $nuevoId]);
}
}