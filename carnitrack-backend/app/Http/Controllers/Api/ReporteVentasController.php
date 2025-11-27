<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use PDF; // Instala: composer require barryvdh/laravel-dompdf

class ReporteVentasController extends Controller
{
    public function index(Request $request)
    {
        $fechaInicio = $request->get('fecha_inicio');
        $fechaFin = $request->get('fecha_fin');
        $tipo = $request->get('tipo');
        $download = $request->get('download') === 'pdf';

        $query = DB::table('movimientos as m')
            ->join('productos as p', 'm.id_productos', '=', 'p.id')
            ->where('m.tipo', 'salida')
            ->select(
                'm.id_movimiento',
                'p.nombre',
                'p.tipo_carne',
                'm.cantidad',
                'p.precio_kg',
                'm.total_movimiento',
                'm.fecha'
            );

        if ($fechaInicio && $fechaFin) {
            $query->whereBetween('m.fecha', [$fechaInicio, $fechaFin . ' 23:59:59']);
        }

        if ($tipo) {
            $query->where('p.tipo_carne', $tipo);
        }

        $movimientos = $query->orderBy('m.fecha', 'desc')->get();

        if ($download) {
            return $this->generarPDF($movimientos, $fechaInicio, $fechaFin);
        }

        return response()->json($movimientos);
    }

    private function generarPDF($movimientos, $inicio, $fin)
    {
        $pdf = PDF::loadView('pdf.ventas', [
            'movimientos' => $movimientos,
            'inicio' => $inicio ?: 'Todas',
            'fin' => $fin ?: 'Todas'
        ]);

        return $pdf->download('reporte_ventas_carnetrack.pdf');
    }
}