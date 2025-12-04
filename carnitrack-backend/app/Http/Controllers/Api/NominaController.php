<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Nomina;
use App\Models\Trabajador;
use App\Models\HorasExtra;     
use App\Models\Bono;           
use App\Models\Descuento;      
use Illuminate\Http\Request;


class NominaController extends Controller
{
    public function index()
    {
        $nominas = Nomina::with('trabajador')->get();
        return response()->json($nominas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_trb' => 'required|exists:trabajador,id_trb',
            'period_pay' => 'required|date',
            'hrs_ext' => 'required|integer|min:0',
            'bonos' => 'required|numeric|min:0',
        ]);

        $trabajador = Trabajador::find($request->id_trb);
        $pagoHoraExtra = ($trabajador->sal_base / 160) * 2; // son las horas de los dias habiles
        $sal_total = $trabajador->sal_base + ($request->hrs_ext * $pagoHoraExtra) + $request->bonos;

        $nomina = Nomina::create([
            'id_trb' => $request->id_trb,
            'period_pay' => $request->period_pay,
            'sal_base' => $trabajador->sal_base,
            'hrs_ext' => $request->hrs_ext,
            'bonos' => $request->bonos,
            'sal_total' => $sal_total,
        ]);

        return response()->json($nomina->load('trabajador'), 201);
    }

    public function destroy($id)
    {
        $nomina = Nomina::findOrFail($id);
        $nomina->delete();
        return response()->json(['message' => 'Nómina eliminada']);
    }

public function calcularNominaQuincenal(Request $request)
{
    $validated = $request->validate([
        'id_trb' => 'required|integer|exists:trabajador,id_trb',
        'periodo_inicio' => 'required|date',
        'periodo_fin' => 'required|date|after:periodo_inicio',
    ]);

    $trabajador = Trabajador::findOrFail($validated['id_trb']);
    $sal_base = $trabajador->sal_base;

    $horasExtras = HorasExtra::where('id_trb', $validated['id_trb'])
        ->whereBetween('fecha', [$validated['periodo_inicio'], $validated['periodo_fin']])
        ->sum('horas');
    $montoHorasExtras = $horasExtras * ($sal_base / 160 * 1.5);

    $bonos = Bono::where('id_trb', $validated['id_trb'])
        ->whereBetween('fecha_registro', [$validated['periodo_inicio'], $validated['periodo_fin']])
        ->sum('monto');

    // NUEVO: Descuentos
    $descuentos = Descuento::where('id_trb', $validated['id_trb'])
        ->whereBetween('fecha_registro', [$validated['periodo_inicio'], $validated['periodo_fin']])
        ->sum('monto');

    $sal_total = $sal_base + $montoHorasExtras + $bonos - $descuentos; // ← RESTA LOS DESCUENTOS

    return response()->json([
        'sal_base' => $sal_base,
        'total_horas_extras' => $horasExtras,
        'monto_horas_extras' => $montoHorasExtras,
        'total_bonos' => $bonos,
        'total_descuentos' => $descuentos, // ← NUEVO, para mostrar en frontend
        'sal_total' => $sal_total
    ]);
}

public function guardarNominaOficial(Request $request)
{
    $request->validate([
        'id_trb' => 'required|exists:trabajador,id_trb',
        'periodo_ini' => 'required|date',
        'periodo_fin' => 'required|date',
        'sal_base' => 'required|numeric',
        'total_horas_extras' => 'required|integer',
        'total_bonos' => 'required|numeric',
        'total_descuentos' => 'required|numeric',  // ← NUEVO
        'sal_total' => 'required|numeric',
    ]);

    $nomina = Nomina::create([
        'id_trb' => $request->id_trb,
        'periodo_inicio' => $request->periodo_ini,
        'periodo_fin' => $request->periodo_fin,
        'sal_base' => $request->sal_base,
        'total_horas_extras' => $request->total_horas_extras,
        'total_bonos' => $request->total_bonos,
        'total_descuentos' => $request->total_descuentos ?? 0,  // ← GUARDA EL DESCUENTO
        'sal_total' => $request->sal_total,
    ]);

    return response()->json($nomina->load('trabajador'), 201);
}
}