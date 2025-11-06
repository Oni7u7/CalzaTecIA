-- Script simple para crear usuarios directamente
-- Ejecuta este script en el SQL Editor de Supabase

-- IMPORTANTE: Primero desactiva temporalmente RLS o crea políticas que permitan la inserción

-- Opción 1: Desactivar RLS temporalmente (solo para desarrollo)
-- ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Opción 2: Crear política que permita insertar usuarios (recomendado)
-- Esto permite que cualquiera pueda insertar usuarios (solo para desarrollo)
CREATE POLICY "Permitir inserción de usuarios" ON usuarios
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- También necesitamos una política para leer usuarios
CREATE POLICY "Permitir lectura de usuarios activos" ON usuarios
FOR SELECT
TO authenticated, anon
USING (activo = true);

-- Ahora insertar los usuarios directamente
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
  activo = EXCLUDED.activo;

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
  activo = EXCLUDED.activo;

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
  activo = EXCLUDED.activo;

-- Verificar que se insertaron correctamente
SELECT 
  id,
  nombre,
  email,
  activo,
  fecha_ingreso
FROM usuarios
WHERE email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY email;


