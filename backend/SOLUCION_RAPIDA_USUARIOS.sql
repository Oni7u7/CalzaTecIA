-- =====================================================
-- SOLUCIÓN RÁPIDA: Insertar usuarios base
-- Sistema ZAPATAVIVE / CalzaTecIA
-- =====================================================
-- 
-- INSTRUCCIONES:
-- 1. Ejecuta este script en el SQL Editor de Supabase
-- 2. Este script desactiva RLS temporalmente e inserta los usuarios
-- 3. Si los usuarios ya existen, se actualizarán
-- =====================================================

-- Paso 1: Desactivar RLS temporalmente en usuarios
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Paso 2: Asegurar que los roles existen
INSERT INTO roles (nombre, nivel, descripcion, permisos) VALUES
  ('administrador', 1, 'Administrador del sistema con acceso completo a todas las funcionalidades', '{"*": true, "usuarios": true, "tiendas": true, "productos": true, "ventas": true, "inventario": true, "reportes": true}'::jsonb),
  ('moderador', 2, 'Moderador con acceso solo para aprobar solicitudes de registro', '{"solicitudes": true, "aprobaciones": true}'::jsonb),
  ('vendedor', 3, 'Vendedor con acceso a ventas, inventario y productos de su tienda', '{"ventas": true, "inventario": true, "productos": true, "clientes": true}'::jsonb),
  ('cliente', 4, 'Cliente con acceso a catálogo de productos y compras', '{"productos": true, "compras": true, "perfil": true}'::jsonb)
ON CONFLICT (nombre) DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  permisos = EXCLUDED.permisos;

-- Paso 3: Insertar o actualizar usuarios base
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, fecha_ingreso) VALUES
  ('Administrador del Sistema', LOWER('admin@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'administrador'), true, NOW()),
  ('Moderador de Solicitudes', LOWER('moderador@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'moderador'), true, NOW()),
  ('Gerente de Tienda', LOWER('vendedor@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, NOW()),
  ('Asistente de Ventas', LOWER('cliente@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'cliente'), true, NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  rol_id = EXCLUDED.rol_id,
  activo = true,
  updated_at = NOW();

-- Paso 4: Verificar usuarios creados
SELECT '=== VERIFICACIÓN DE USUARIOS ===' as verificacion;
SELECT 
  u.email, 
  u.nombre, 
  r.nombre as rol, 
  u.activo,
  u.password_hash,
  u.rol_id
FROM usuarios u 
LEFT JOIN roles r ON u.rol_id = r.id 
WHERE u.email IN (
  LOWER('admin@calzatec.com'),
  LOWER('moderador@calzatec.com'),
  LOWER('vendedor@calzatec.com'),
  LOWER('cliente@calzatec.com')
)
ORDER BY r.nivel;

-- Paso 5: Verificar que los roles existen
SELECT '=== VERIFICACIÓN DE ROLES ===' as verificacion;
SELECT nombre, nivel, descripcion FROM roles ORDER BY nivel;

SELECT '✅ Script completado. Usuarios base insertados correctamente.' as resultado;

