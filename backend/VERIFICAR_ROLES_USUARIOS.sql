-- ============================================
-- SCRIPT: Verificar Roles de Usuarios
-- Sistema ZAPATAVIVE / CalzaTecIA
-- ============================================
-- 
-- Este script verifica que los usuarios tengan los roles correctos asignados
-- ============================================

-- Verificar roles existentes
SELECT 
  '=== ROLES EXISTENTES ===' as verificacion;

SELECT 
  id,
  nombre,
  nivel,
  descripcion
FROM roles
ORDER BY nivel;

-- Verificar usuarios y sus roles
SELECT 
  '=== USUARIOS Y SUS ROLES ===' as verificacion;

SELECT 
  u.id,
  u.email,
  u.nombre,
  u.activo,
  u.rol_id,
  r.nombre as rol_nombre,
  r.nivel as rol_nivel,
  CASE 
    WHEN u.email = 'admin@calzatec.com' AND r.nombre = 'administrador' THEN '✅ CORRECTO'
    WHEN u.email = 'vendedor@calzatec.com' AND r.nombre = 'gerente_tienda' THEN '✅ CORRECTO'
    WHEN u.email = 'cliente@calzatec.com' AND r.nombre = 'asistente_operativo' THEN '✅ CORRECTO'
    ELSE '❌ INCORRECTO'
  END as estado
FROM usuarios u
LEFT JOIN roles r ON u.rol_id = r.id
WHERE u.email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY 
  CASE u.email
    WHEN 'admin@calzatec.com' THEN 1
    WHEN 'vendedor@calzatec.com' THEN 2
    WHEN 'cliente@calzatec.com' THEN 3
  END;

-- Verificar mapeo de roles a rutas esperadas
SELECT 
  '=== MAPEO DE ROLES A RUTAS ===' as verificacion;

SELECT 
  r.nombre as rol_bd,
  CASE 
    WHEN r.nombre = 'administrador' THEN '/admin'
    WHEN r.nombre = 'gerente_tienda' THEN '/vendedor'
    WHEN r.nombre = 'asistente_operativo' THEN '/cliente'
    ELSE '/cliente'
  END as ruta_esperada,
  u.email,
  u.nombre as usuario_nombre
FROM roles r
LEFT JOIN usuarios u ON u.rol_id = r.id
WHERE r.nombre IN ('administrador', 'gerente_tienda', 'asistente_operativo')
  AND u.email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com')
ORDER BY 
  CASE r.nombre
    WHEN 'administrador' THEN 1
    WHEN 'gerente_tienda' THEN 2
    WHEN 'asistente_operativo' THEN 3
  END;

-- ============================================
-- RESUMEN
-- ============================================
-- 
-- ✅ admin@calzatec.com → rol: administrador → ruta: /admin
-- ✅ vendedor@calzatec.com → rol: gerente_tienda → ruta: /vendedor
-- ✅ cliente@calzatec.com → rol: asistente_operativo → ruta: /cliente
-- 
-- ============================================


