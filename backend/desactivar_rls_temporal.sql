-- Script para desactivar RLS temporalmente (SOLO PARA DESARROLLO)
-- Ejecuta este script en el SQL Editor de Supabase

-- Desactivar RLS en la tabla usuarios temporalmente
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Verificar que se desactivó
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'usuarios';

-- IMPORTANTE: En producción, debes reactivar RLS y crear políticas apropiadas


