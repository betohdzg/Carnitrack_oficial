<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'nombre', 'tipo_carne', 'precio_kg', 'stock_kg',
        'fecha_entrada', 'fecha_caducidad', 'minimo_kg'
    ];

    protected $casts = [
        'precio_kg' => 'decimal:2',
        'stock_kg' => 'decimal:2',
        'fecha_entrada' => 'date',
        'fecha_caducidad' => 'date',
    ];

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'id_productos', 'id');
    }
}