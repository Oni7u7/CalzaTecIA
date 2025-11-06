-- ============================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN
-- Ejecuta este script completo en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Desactivar RLS temporalmente (solo para desarrollo)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- PASO 2: Crear tabla de solicitudes de registro
CREATE TABLE IF NOT EXISTS solicitudes_registro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  aprobado_por UUID REFERENCES usuarios(id),
  fecha_solicitud TIMESTAMP DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP,
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Desactivar RLS en solicitudes
ALTER TABLE solicitudes_registro DISABLE ROW LEVEL SECURITY;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_solicitudes_email ON solicitudes_registro(email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_registro(estado);

-- PASO 3: Insertar usuarios base directamente
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

-- PASO 4: Verificar que todo se creó correctamente
SELECT 
  'Usuarios creados:' as tipo,
  email,
  nombre,
  activo,
  password_hash
FROM usuarios
WHERE email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY email;

-- Verificar tabla de solicitudes
SELECT 
  'Tabla solicitudes_registro creada correctamente' as mensaje;


