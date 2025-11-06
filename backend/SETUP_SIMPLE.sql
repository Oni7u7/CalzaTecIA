-- ============================================
-- SCRIPT SIMPLE DE CONFIGURACIÓN
-- Ejecuta este script COMPLETO en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Desactivar RLS en usuarios (temporalmente para desarrollo)
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;

-- PASO 2: Crear tabla de solicitudes de registro si no existe
-- Esta tabla se usará para las solicitudes de registro pendientes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'solicitudes_registro'
  ) THEN
    CREATE TABLE solicitudes_registro (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      estado VARCHAR(50) DEFAULT 'pendiente',
      aprobado_por UUID REFERENCES usuarios(id),
      fecha_solicitud TIMESTAMP DEFAULT NOW(),
      fecha_aprobacion TIMESTAMP,
      notas TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Desactivar RLS en solicitudes_registro
    ALTER TABLE solicitudes_registro DISABLE ROW LEVEL SECURITY;

    -- Crear índices
    CREATE INDEX idx_solicitudes_email ON solicitudes_registro(email);
    CREATE INDEX idx_solicitudes_estado ON solicitudes_registro(estado);
    
    RAISE NOTICE 'Tabla solicitudes_registro creada exitosamente';
  ELSE
    RAISE NOTICE 'Tabla solicitudes_registro ya existe';
  END IF;
END $$;

-- PASO 3: Eliminar usuarios existentes si los hay (opcional, para empezar limpio)
-- DELETE FROM usuarios WHERE email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');

-- PASO 4: Insertar usuarios base directamente
INSERT INTO usuarios (id, nombre, email, password_hash, activo, fecha_ingreso, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Administrador del Sistema', 'admin@calzatec.com', '1234', true, NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'Gerente de Tienda', 'vendedor@calzatec.com', '1234', true, NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'Asistente de Ventas', 'cliente@calzatec.com', '1234', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  activo = true,
  updated_at = NOW();

-- PASO 5: Verificar que todo se creó correctamente
SELECT 
  '=== USUARIOS CREADOS ===' as verificacion;

SELECT 
  email,
  nombre,
  activo,
  password_hash,
  fecha_ingreso
FROM usuarios
WHERE email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY email;

SELECT 
  '=== TABLA SOLICITUDES ===' as verificacion;

SELECT 
  'Tabla solicitudes_registro creada correctamente' as estado;

