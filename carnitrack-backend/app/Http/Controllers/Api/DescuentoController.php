<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Descuento;
use Illuminate\Http\Request;

class DescuentoController extends Controller
{
    public function index()
    {
        return Descuento::with('trabajador')->get(); // ← Bonus: trae el nombre también
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_trb' => 'required|integer|exists:trabajador,id_trb', // ← AQUÍ ESTABA EL ERROR
            'monto' => 'required|numeric|min:0.01',
            'motivo' => 'required|string|max:255',
            'fecha_registro' => 'required|date',
        ]);

        $descuento = Descuento::create($validated);
        return response()->json($descuento, 201);
    }

    public function destroy($id)
    {
        $descuento = Descuento::findOrFail($id);
        $descuento->delete();
        return response()->json(null, 204);
    }
}