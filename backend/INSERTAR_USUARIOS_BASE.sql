-- =====================================================
-- Script para INSERTAR SOLO los usuarios base
-- Sistema ZAPATAVIVE / CalzaTecIA
-- =====================================================
-- 
-- INSTRUCCIONES:
-- 1. Ejecuta este script DESPUÉS de ejecutar el script principal
-- 2. Si los usuarios ya existen, se actualizarán
-- 3. Si no existen, se crearán
-- =====================================================

-- Asegurar que los roles existen primero
INSERT INTO roles (nombre, nivel, descripcion, permisos) VALUES
  ('administrador', 1, 'Administrador del sistema con acceso completo a todas las funcionalidades', '{"*": true, "usuarios": true, "tiendas": true, "productos": true, "ventas": true, "inventario": true, "reportes": true}'::jsonb),
  ('vendedor', 2, 'Vendedor con acceso a ventas, inventario y productos de su tienda', '{"ventas": true, "inventario": true, "productos": true, "clientes": true}'::jsonb),
  ('cliente', 3, 'Cliente con acceso a catálogo de productos y compras', '{"productos": true, "compras": true, "perfil": true}'::jsonb)
ON CONFLICT (nombre) DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  permisos = EXCLUDED.permisos;

-- Insertar o actualizar usuarios base
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, fecha_ingreso) VALUES
  ('Administrador del Sistema', LOWER('admin@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'administrador'), true, NOW()),
  ('Gerente de Tienda', LOWER('vendedor@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, NOW()),
  ('Asistente de Ventas', LOWER('cliente@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'cliente'), true, NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  rol_id = EXCLUDED.rol_id,
  activo = true,
  updated_at = NOW();

-- Verificar usuarios creados
SELECT '=== USUARIOS BASE CREADOS ===' as verificacion;
SELECT 
  u.email, 
  u.nombre, 
  r.nombre as rol, 
  u.activo,
  u.password_hash
FROM usuarios u 
LEFT JOIN roles r ON u.rol_id = r.id 
WHERE u.email IN (
  LOWER('admin@calzatec.com'),
  LOWER('vendedor@calzatec.com'),
  LOWER('cliente@calzatec.com')
)
ORDER BY r.nivel;

SELECT '✅ Usuarios base insertados correctamente' as resultado;
