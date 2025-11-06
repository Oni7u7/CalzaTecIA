-- Crear tabla de solicitudes de registro
-- Ejecuta este script en el SQL Editor de Supabase

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

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_solicitudes_email ON solicitudes_registro(email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_registro(estado);

-- Política RLS para permitir que cualquiera pueda insertar solicitudes
ALTER TABLE solicitudes_registro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción de solicitudes" ON solicitudes_registro
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Política para permitir leer solicitudes (solo para administradores en producción)
CREATE POLICY "Permitir lectura de solicitudes" ON solicitudes_registro
FOR SELECT
TO authenticated, anon
USING (true);


