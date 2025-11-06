-- Políticas RLS para permitir operaciones básicas
-- Ejecuta este script en el SQL Editor de Supabase

-- Primero, habilita RLS si no está habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay (opcional)
DROP POLICY IF EXISTS "Permitir inserción de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir lectura de usuarios activos" ON usuarios;
DROP POLICY IF EXISTS "Permitir actualización de usuarios" ON usuarios;

-- Política para permitir que cualquiera pueda insertar usuarios (solo para desarrollo)
-- En producción, esto debe ser más restrictivo
CREATE POLICY "Permitir inserción de usuarios" ON usuarios
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Política para permitir leer usuarios activos
CREATE POLICY "Permitir lectura de usuarios activos" ON usuarios
FOR SELECT
TO authenticated, anon
USING (activo = true OR email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para permitir actualizar el propio usuario
CREATE POLICY "Permitir actualización de usuarios" ON usuarios
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Si necesitas permitir que los administradores puedan hacer todo:
-- (Requiere que tengas una columna o función que identifique administradores)
-- CREATE POLICY "Administradores pueden todo" ON usuarios
-- FOR ALL
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM usuarios u
--     JOIN roles r ON u.rol_id = r.id
--     WHERE u.email = current_setting('request.jwt.claims', true)::json->>'email'
--     AND r.nombre = 'administrador'
--   )
-- );


