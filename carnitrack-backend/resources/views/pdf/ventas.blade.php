<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans; }
        h1 { color: #9b2d30; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #9b2d30; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>CarneTrack - Reporte de Ventas</h1>
    <p><strong>Del:</strong> {{ $inicio }} <strong>al</strong> {{ $fin }}</p>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio/kg</th>
                <th>Total</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach($movimientos as $m)
            <tr>
                <td>{{ $m->id_movimiento }}</td>
                <td>{{ $m->nombre }}</td>
                <td>{{ $m->tipo_carne }}</td>
                <td>{{ $m->cantidad }}</td>
                <td>${{ number_format($m->precio_kg, 2) }}</td>
                <td>${{ number_format($m->total_movimiento, 2) }}</td>
                <td>{{ \Carbon\Carbon::parse($m->fecha)->format('d/m/Y H:i') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>