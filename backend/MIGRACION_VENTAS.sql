-- ============================================
-- SCRIPT DE MIGRACIÓN: Corregir columna ticket en ventas
-- ============================================
-- 
-- Este script corrige la columna de ticket en la tabla ventas
-- Si la columna se llama "numero_ticket", la renombra a "ticket"
-- Si la columna ya se llama "ticket", no hace nada
-- ============================================

DO $$ 
BEGIN
  -- Verificar si existe la columna numero_ticket
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'ventas' 
    AND column_name = 'numero_ticket'
  ) THEN
    -- Renombrar numero_ticket a ticket
    ALTER TABLE ventas RENAME COLUMN numero_ticket TO ticket;
    RAISE NOTICE 'Columna numero_ticket renombrada a ticket';
  ELSIF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'ventas' 
    AND column_name = 'ticket'
  ) THEN
    RAISE NOTICE 'La columna ticket ya existe correctamente';
  ELSE
    RAISE NOTICE 'La tabla ventas no existe o no tiene columna de ticket';
  END IF;
END $$;

-- Verificar el resultado
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'ventas'
AND column_name IN ('ticket', 'numero_ticket')
ORDER BY column_name;


