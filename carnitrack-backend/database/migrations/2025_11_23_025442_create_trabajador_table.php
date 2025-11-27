<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trabajador', function (Blueprint $table) {
            $table->id('id_trb'); // INT(6) PK auto-incremental
            $table->string('nom_trb', 100);
            $table->string('puesto', 20);
            $table->decimal('sal_base', 10, 2);
            $table->string('user_trb', 18)->unique();
            $table->string('psw_trb'); // En producción: hashear con bcrypt
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trabajador');
    }
};