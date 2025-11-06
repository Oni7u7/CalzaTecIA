-- Script para verificar que los usuarios existan en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Verificar usuarios existentes
SELECT 
  u.id,
  u.nombre,
  u.email,
  u.password_hash,
  u.activo,
  r.nombre as rol,
  u.fecha_ingreso
FROM usuarios u
LEFT JOIN roles r ON u.rol_id = r.id
WHERE u.email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY u.email;

-- Si no existen, ejecuta insertar_usuarios.sql primero

