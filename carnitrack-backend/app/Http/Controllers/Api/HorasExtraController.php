<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HorasExtra;
use App\Models\Trabajador;
use Illuminate\Http\Request;
class HorasExtraController extends Controller
{
    public function index()
    {
        return HorasExtra::all(); // SIN with()
    }

public function store(Request $request)
{
    $id_trb = $request->id_trb ?? $request->empleado_id;

    if (!$id_trb) {
        return response()->json(['error' => 'Falta id_trb'], 400);
    }

    $hex = HorasExtra::create([
        'id_trb' => $id_trb,
        'horas'  => $request->horas,
        'fecha'  => $request->fecha,
    ]);

    return response()->json($hex, 201);
}

    public function destroy($id)
    {
        HorasExtra::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}