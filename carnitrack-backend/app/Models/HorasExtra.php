<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HorasExtra extends Model
{
    protected $table = 'horas_extras';
    protected $primaryKey = 'id_hex';
    public $timestamps = false;        // ← CAMBIO AQUÍ
    protected $fillable = ['id_trb', 'horas', 'fecha'];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'id_trb', 'id_trb');
    }
}