<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trabajador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class TrabajadorController extends Controller
{
    // LISTAR todos
    public function index()
    {
        $trabajadores = Trabajador::select('id_trb', 'nom_trb', 'puesto', 'sal_base', 'user_trb')
            ->get();
        return response()->json($trabajadores);
    }

    // GUARDAR nuevo
    public function store(Request $request)
    {
        $request->validate([
            'nom_trb' => 'required|string|max:100',
            'puesto' => 'required|string|max:20',
            'sal_base' => 'required|numeric|min:0',
            'user_trb' => 'required|string|max:18|unique:trabajador,user_trb',
            'psw_trb' => 'required|string|min:6'
        ]);

        $trabajador = Trabajador::create([
            'nom_trb' => $request->nom_trb,
            'puesto' => $request->puesto,
            'sal_base' => $request->sal_base,
            'user_trb' => $request->user_trb,
            'psw_trb' => $request->psw_trb // ¡Hasheado!
        ]);

        return response()->json([
            'message' => 'Trabajador creado',
            'data' => $trabajador->only(['id_trb', 'nom_trb', 'puesto', 'sal_base', 'user_trb'])
        ], 201);
    }

    // MOSTRAR uno
    public function show($id)
    {
        $trabajador = Trabajador::select('id_trb', 'nom_trb', 'puesto', 'sal_base', 'user_trb')
            ->findOrFail($id);
        return response()->json($trabajador);
    }

    // ACTUALIZAR
    public function update(Request $request, $id)
    {
        $trabajador = Trabajador::findOrFail($id);

        $request->validate([
            'nom_trb' => 'sometimes|required|string|max:100',
            'puesto' => 'sometimes|required|string|max:20',
            'sal_base' => 'sometimes|required|numeric|min:0',
            'user_trb' => [
                'sometimes',
                'required',
                'max:18',
                Rule::unique('trabajador', 'user_trb')->ignore($id, 'id_trb')
            ],
            'psw_trb' => 'sometimes|nullable|string|min:6'
        ]);

        $data = $request->only(['nom_trb', 'puesto', 'sal_base', 'user_trb']);
        if ($request->filled('psw_trb')) {
            $data['psw_trb'] = Hash::make($request->psw_trb);
        }

        $trabajador->update($data);

        return response()->json([
            'message' => 'Trabajador actualizado',
            'data' => $trabajador->only(['id_trb', 'nom_trb', 'puesto', 'sal_base', 'user_trb'])
        ]);
    }

    // ELIMINAR
    public function destroy($id)
    {
        $trabajador = Trabajador::findOrFail($id);
        $trabajador->delete();

        return response()->json(['message' => 'Trabajador eliminado']);
    }

    // NUEVO: Obtener los datos del usuario logueado
public function miCuenta()
{
    // auth()->user() ahora SÍ existe gracias al middleware
    $trabajador = auth()->user();

    if (!$trabajador) {
        return response()->json(['message' => 'No autenticado'], 401);
    }

    return response()->json([
        'nombre' => $trabajador->nom_trb,
        'correo' => $trabajador->user_trb,
        'rol'    => $trabajador->rol ?? 'empleado'
    ]);
}
}