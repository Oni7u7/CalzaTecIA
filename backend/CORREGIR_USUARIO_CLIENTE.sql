-- ============================================
-- SCRIPT: Corregir Usuario Cliente
-- Sistema ZAPATAVIVE / CalzaTecIA
-- ============================================
-- 
-- Este script verifica y corrige el usuario cliente@calzatec.com
-- ============================================

-- Verificar si el usuario existe
SELECT 
  '=== VERIFICACIÓN DE USUARIO CLIENTE ===' as verificacion;

SELECT 
  id,
  email,
  nombre,
  password_hash,
  activo,
  rol_id,
  (SELECT nombre FROM roles WHERE id = usuarios.rol_id) as rol_nombre
FROM usuarios
WHERE email = 'cliente@calzatec.com';

-- Si no existe, crearlo
-- Si existe pero está inactivo, activarlo
-- Si existe pero no tiene rol, asignarle el rol correcto

-- Asegurar que el rol existe
INSERT INTO roles (nombre, nivel, descripcion, permisos) VALUES
  (
    'asistente_operativo',
    3,
    'Asistente de ventas con acceso a catálogo y compras',
    '{"productos": true, "compras": true}'::jsonb
  )
ON CONFLICT (nombre) DO UPDATE SET
  nivel = EXCLUDED.nivel,
  descripcion = EXCLUDED.descripcion,
  permisos = EXCLUDED.permisos;

-- Insertar o actualizar el usuario cliente
-- IMPORTANTE: El email debe estar en lowercase
INSERT INTO usuarios (
  nombre,
  email,
  password_hash,
  rol_id,
  activo,
  fecha_ingreso,
  created_at,
  updated_at
) VALUES (
  'Asistente de Ventas',
  LOWER('cliente@calzatec.com'), -- Asegurar lowercase
  '1234', -- Password en texto plano (solo para desarrollo)
  (SELECT id FROM roles WHERE nombre = 'asistente_operativo'),
  true,
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  rol_id = EXCLUDED.rol_id,
  activo = true,
  email = LOWER(EXCLUDED.email), -- Asegurar lowercase
  updated_at = NOW();

-- Verificar que se creó correctamente
SELECT 
  '=== USUARIO CLIENTE CORREGIDO ===' as verificacion;

SELECT 
  u.id,
  u.email,
  u.nombre,
  u.password_hash,
  u.activo,
  r.nombre as rol_nombre,
  r.nivel as rol_nivel,
  u.fecha_ingreso
FROM usuarios u
LEFT JOIN roles r ON u.rol_id = r.id
WHERE u.email = 'cliente@calzatec.com';

