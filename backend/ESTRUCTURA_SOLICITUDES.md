# 📋 Estructura de la Tabla: solicitudes_registro

## Descripción

Esta tabla almacena las solicitudes de registro de nuevos usuarios. Cuando alguien se registra en el sistema, se crea una solicitud con estado `pendiente`. Un administrador puede aprobar o rechazar la solicitud, y cuando se aprueba, se crea el usuario en la tabla `usuarios`.

## Estructura de la Tabla

```sql
CREATE TABLE solicitudes_registro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  aprobado_por UUID REFERENCES usuarios(id),
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único de la solicitud (clave primaria) |
| `nombre` | VARCHAR(255) | Nombre completo del solicitante |
| `email` | VARCHAR(255) | Email del solicitante (único, no puede repetirse) |
| `password_hash` | VARCHAR(255) | Hash de la contraseña del solicitante |
| `estado` | VARCHAR(50) | Estado de la solicitud: `pendiente`, `aprobada`, `rechazada` |
| `aprobado_por` | UUID | ID del usuario administrador que aprobó/rechazó (opcional) |
| `fecha_solicitud` | TIMESTAMP | Fecha y hora en que se creó la solicitud |
| `fecha_aprobacion` | TIMESTAMP | Fecha y hora en que se aprobó o rechazó (opcional) |
| `notas` | TEXT | Notas adicionales sobre la solicitud (opcional) |
| `created_at` | TIMESTAMP | Fecha de creación del registro |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## Índices

- `idx_solicitudes_email` - Índice en `email` para búsquedas rápidas
- `idx_solicitudes_estado` - Índice en `estado` para filtrar por estado
- `idx_solicitudes_fecha` - Índice en `fecha_solicitud` para ordenar por fecha

## Relaciones

- `aprobado_por` → `usuarios(id)` - Referencia al usuario que aprobó/rechazó

## Estados

- **pendiente**: La solicitud está esperando aprobación
- **aprobada**: La solicitud fue aprobada y el usuario fue creado
- **rechazada**: La solicitud fue rechazada

## Uso

### Crear una solicitud (desde el frontend)
```sql
INSERT INTO solicitudes_registro (nombre, email, password_hash, estado)
VALUES ('Juan Pérez', 'juan@example.com', '1234', 'pendiente');
```

### Aprobar una solicitud (desde el backend/admin)
```sql
-- 1. Crear el usuario
INSERT INTO usuarios (nombre, email, password_hash, activo)
SELECT nombre, email, password_hash, true
FROM solicitudes_registro
WHERE id = 'solicitud-id';

-- 2. Actualizar el estado de la solicitud
UPDATE solicitudes_registro
SET estado = 'aprobada',
    aprobado_por = 'admin-user-id',
    fecha_aprobacion = NOW()
WHERE id = 'solicitud-id';
```

### Rechazar una solicitud
```sql
UPDATE solicitudes_registro
SET estado = 'rechazada',
    aprobado_por = 'admin-user-id',
    fecha_aprobacion = NOW(),
    notas = 'Motivo del rechazo'
WHERE id = 'solicitud-id';
```

### Consultar solicitudes pendientes
```sql
SELECT 
  id,
  nombre,
  email,
  fecha_solicitud,
  estado
FROM solicitudes_registro
WHERE estado = 'pendiente'
ORDER BY fecha_solicitud DESC;
```

## Script SQL

Para crear la tabla, ejecuta el archivo `backend/tabla_solicitudes_registro.sql` en el SQL Editor de Supabase.


