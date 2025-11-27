<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trabajador;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required',
            'contraseña' => 'required',
            'rol_elegido' => 'required|in:gerente,empleado'
        ]);

        // 1. Buscar usuario
        $trabajador = Trabajador::where('user_trb', $request->usuario)->first();

        // 2. Verificar usuario y contraseña (TEXTO PLANO)
        if (!$trabajador || $trabajador->psw_trb !== $request->contraseña) {
            return response()->json([
                'mensaje' => 'Usuario o contraseña incorrectos'
            ], 401);
        }

        // 3. Verificar rol
        if ($trabajador->rol !== $request->rol_elegido) {
            return response()->json([
                'mensaje' => 'Rol incorrecto para este usuario'
            ], 403);
        }

        // 4. Login exitoso
        return response()->json([
            'mensaje' => 'Login exitoso',
            'usuario' => [
                'id' => $trabajador->id_trb,
                'nombre' => $trabajador->nom_trb,
                'puesto' => $trabajador->puesto,
                'rol' => $trabajador->rol
            ]
        ]);
    }
}