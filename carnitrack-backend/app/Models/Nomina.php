<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nomina extends Model
{
    protected $table = 'nomina';
    protected $primaryKey = 'id_nom';
    
    // ← AQUÍ ESTABA EL ERROR
    public $timestamps = false;  // ← CAMBIA A FALSE

protected $fillable = [
    'id_trb',
    'periodo_inicio',
    'periodo_fin',
    'sal_base',
    'total_horas_extras',
    'total_bonos',
    'total_descuentos',  // ← NUEVO
    'sal_total'
];

protected $casts = [
    'periodo_inicio' => 'date',
    'periodo_fin'    => 'date',
    'sal_base'       => 'decimal:2',
    'total_bonos'    => 'decimal:2',
    'total_descuentos' => 'decimal:2',  // ← NUEVO
    'sal_total'      => 'decimal:2',
];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'id_trb', 'id_trb');
    }
}