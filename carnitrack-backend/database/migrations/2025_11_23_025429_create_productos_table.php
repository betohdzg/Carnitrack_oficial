<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->string('id', 30)->primary(); // ← CAR-RES-001
            $table->string('nombre', 255);
            $table->string('tipo_carne', 20); // res, pollo, pescado
            $table->decimal('precio_kg', 8, 2);
            $table->decimal('stock_kg', 8, 2);
            $table->date('fecha_entrada');
            $table->date('fecha_caducidad');
            $table->decimal('minimo_kg', 8, 2)->default(5.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};