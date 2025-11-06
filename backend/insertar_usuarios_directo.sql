-- Script para insertar usuarios directamente (sin depender de roles)
-- Ejecuta este script DESPUÉS de desactivar RLS o crear políticas permisivas
-- Ejecuta primero: backend/desactivar_rls_temporal.sql

-- Insertar usuarios directamente
-- Usuario Admin
INSERT INTO usuarios (id, nombre, email, password_hash, activo, fecha_ingreso, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Administrador del Sistema',
  'admin@calzatec.com',
  '1234',
  true,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  activo = EXCLUDED.activo,
  updated_at = NOW();

-- Usuario Vendedor
INSERT INTO usuarios (id, nombre, email, password_hash, activo, fecha_ingreso, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Gerente de Tienda',
  'vendedor@calzatec.com',
  '1234',
  true,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  activo = EXCLUDED.activo,
  updated_at = NOW();

-- Usuario Cliente
INSERT INTO usuarios (id, nombre, email, password_hash, activo, fecha_ingreso, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Asistente de Ventas',
  'cliente@calzatec.com',
  '1234',
  true,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  activo = EXCLUDED.activo,
  updated_at = NOW();

-- Verificar que se insertaron correctamente
SELECT 
  id,
  nombre,
  email,
  password_hash,
  activo,
  fecha_ingreso
FROM usuarios
WHERE email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY email;


