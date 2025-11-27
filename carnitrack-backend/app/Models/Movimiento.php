<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// App\Models\Movimiento.php
class Movimiento extends Model
{
    protected $table = 'movimientos';
    protected $primaryKey = 'id_movimiento';
    public $timestamps = false;

    protected $fillable = [
        'id_productos',
        'tipo',
        'cantidad',
        'fecha',
        'total_movimiento'
    ];

    // RELACIÓN CORRECTA
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_productos', 'id'); // ← id_productos → productos.id
    }

}