-- ============================================
-- TABLA: solicitudes_registro
-- Descripción: Almacena las solicitudes de registro de nuevos usuarios
-- ============================================

-- Crear tabla de solicitudes de registro
CREATE TABLE IF NOT EXISTS solicitudes_registro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  aprobado_por UUID REFERENCES usuarios(id),
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_solicitudes_email ON solicitudes_registro(email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_registro(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes_registro(fecha_solicitud);

-- Desactivar RLS temporalmente (solo para desarrollo)
ALTER TABLE solicitudes_registro DISABLE ROW LEVEL SECURITY;

-- Comentarios en la tabla y columnas
COMMENT ON TABLE solicitudes_registro IS 'Tabla para almacenar solicitudes de registro de nuevos usuarios';
COMMENT ON COLUMN solicitudes_registro.id IS 'ID único de la solicitud';
COMMENT ON COLUMN solicitudes_registro.nombre IS 'Nombre completo del solicitante';
COMMENT ON COLUMN solicitudes_registro.email IS 'Email del solicitante (único)';
COMMENT ON COLUMN solicitudes_registro.password_hash IS 'Hash de la contraseña del solicitante';
COMMENT ON COLUMN solicitudes_registro.estado IS 'Estado de la solicitud: pendiente, aprobada, rechazada';
COMMENT ON COLUMN solicitudes_registro.aprobado_por IS 'ID del usuario administrador que aprobó/rechazó la solicitud';
COMMENT ON COLUMN solicitudes_registro.fecha_solicitud IS 'Fecha y hora en que se creó la solicitud';
COMMENT ON COLUMN solicitudes_registro.fecha_aprobacion IS 'Fecha y hora en que se aprobó o rechazó la solicitud';
COMMENT ON COLUMN solicitudes_registro.notas IS 'Notas adicionales sobre la solicitud';

-- Verificar que la tabla se creó correctamente
SELECT 
  'Tabla solicitudes_registro creada exitosamente' as mensaje,
  COUNT(*) as columnas
FROM information_schema.columns 
WHERE table_name = 'solicitudes_registro';

-- Mostrar estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'solicitudes_registro'
ORDER BY ordinal_position;


