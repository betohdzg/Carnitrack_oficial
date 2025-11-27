<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trabajador extends Model
{
    protected $table = 'trabajador';
    protected $primaryKey = 'id_trb';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nom_trb',
        'puesto',
        'sal_base',
        'user_trb',
        'psw_trb',
        'rol'
    ];

    protected $hidden = [
        'psw_trb'
    ];

    // Relación 1 a N con nomina
    public function nominas(): HasMany
    {
        return $this->hasMany(Nomina::class, 'id_trb', 'id_trb');
    }
}