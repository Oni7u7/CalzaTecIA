# 🚀 Instrucciones Rápidas para Configurar Supabase

## ⚡ Solución Rápida (3 pasos)

### Paso 1: Desactivar RLS Temporalmente

Ejecuta en el **SQL Editor** de Supabase:

```sql
-- Desactivar RLS en usuarios
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
```

### Paso 2: Crear Usuarios Base

Ejecuta en el **SQL Editor** de Supabase:

```sql
-- Insertar usuarios directamente
INSERT INTO usuarios (id, nombre, email, password_hash, activo, fecha_ingreso, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Administrador del Sistema', 'admin@calzatec.com', '1234', true, NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'Gerente de Tienda', 'vendedor@calzatec.com', '1234', true, NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'Asistente de Ventas', 'cliente@calzatec.com', '1234', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  activo = EXCLUDED.activo,
  updated_at = NOW();
```

### Paso 3: Crear Tabla de Solicitudes

Ejecuta en el **SQL Editor** de Supabase:

```sql
-- Crear tabla de solicitudes de registro
CREATE TABLE IF NOT EXISTS solicitudes_registro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Desactivar RLS en solicitudes
ALTER TABLE solicitudes_registro DISABLE ROW LEVEL SECURITY;
```

## ✅ Verificar

Ejecuta esta consulta para verificar que los usuarios existan:

```sql
SELECT email, nombre, activo, password_hash 
FROM usuarios 
WHERE email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');
```

## 🔐 Credenciales de Prueba

- **Admin:** `admin@calzatec.com` / `1234`
- **Vendedor:** `vendedor@calzatec.com` / `1234`
- **Cliente:** `cliente@calzatec.com` / `1234`

## 📝 Notas

- Todos los nuevos registros se crearán como **clientes** por defecto
- Las solicitudes de registro se guardan en `solicitudes_registro` con estado `pendiente`
- Un administrador debe aprobar las solicitudes manualmente desde la base de datos


