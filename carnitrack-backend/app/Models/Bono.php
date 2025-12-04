<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bono extends Model
{
    protected $primaryKey = 'id_bono';
    public $timestamps = true;
    protected $fillable = ['id_trb', 'monto', 'motivo', 'fecha_registro'];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'id_trb', 'id_trb');
    }
}