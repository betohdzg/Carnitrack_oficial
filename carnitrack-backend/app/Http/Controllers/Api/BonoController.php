<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bono;
use App\Models\Trabajador;
use Illuminate\Http\Request;

class BonoController extends Controller
{
   public function index()
{
    return Bono::leftJoin('trabajador', 'bonos.id_trb', '=', 'trabajador.id_trb')
               ->select('bonos.*', 'trabajador.nom_trb as nombre_trabajador')
               ->get();
}

// app/Http/Controllers/Api/BonoController.php
public function store(Request $request)
{
    // ACEPTA CUALQUIER NOMBRE QUE LE MANDES (empleado_id o id_trb)
    $id_trb = $request->id_trb ?? $request->empleado_id;

    if (!$id_trb) {
        return response()->json(['error' => 'id_trb o empleado_id es requerido'], 400);
    }

    $bono = Bono::create([
        'id_trb'         => $id_trb,
        'monto'          => $request->monto,
        'motivo'         => $request->motivo,
        'fecha_registro' => $request->fecha_registro ?? $request->fecha,
    ]);

    return response()->json($bono, 201);
}

    public function destroy($id)
    {
        Bono::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}