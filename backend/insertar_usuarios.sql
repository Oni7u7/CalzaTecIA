-- Script para insertar usuarios de prueba en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Primero, asegúrate de que los roles existan
-- Si no existen, créalos primero desde supabase_seeds.sql

-- Insertar usuarios con contraseñas hasheadas
-- Nota: En producción, usa Supabase Auth para crear usuarios
-- Este script inserta directamente en la tabla usuarios

-- Función para hashear contraseñas (simplificado - en producción usar bcrypt)
-- Por ahora, insertamos las contraseñas sin hash (se debe implementar hash real)

-- Usuario Admin
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, fecha_ingreso)
SELECT 
  'Administrador del Sistema',
  'admin@calzatec.com',
  '1234', -- En producción, esto debe ser un hash bcrypt
  r.id,
  true,
  NOW()
FROM roles r
WHERE r.nombre = 'administrador'
ON CONFLICT (email) DO NOTHING;

-- Usuario Vendedor
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, fecha_ingreso)
SELECT 
  'Gerente de Tienda',
  'vendedor@calzatec.com',
  '1234', -- En producción, esto debe ser un hash bcrypt
  r.id,
  true,
  NOW()
FROM roles r
WHERE r.nombre = 'gerente_tienda'
ON CONFLICT (email) DO NOTHING;

-- Usuario Cliente
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, fecha_ingreso)
SELECT 
  'Asistente de Ventas',
  'cliente@calzatec.com',
  '1234', -- En producción, esto debe ser un hash bcrypt
  r.id,
  true,
  NOW()
FROM roles r
WHERE r.nombre = 'asistente_operativo'
ON CONFLICT (email) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT 
  u.id,
  u.nombre,
  u.email,
  r.nombre as rol,
  u.activo
FROM usuarios u
LEFT JOIN roles r ON u.rol_id = r.id
WHERE u.email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY u.email;


