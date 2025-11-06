-- =====================================================
-- PARTE 1: Extensiones y Eliminación de Tablas
-- Sistema ZAPATAVIVE / CalzaTecIA
-- =====================================================
-- 
-- INSTRUCCIONES:
-- 1. Ejecuta esta parte PRIMERO
-- 2. Espera a que termine completamente
-- 3. Luego ejecuta la parte 2
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ELIMINAR TODAS LAS TABLAS (en orden inverso)
-- =====================================================

-- Eliminar tablas que dependen de otras primero
DROP TABLE IF EXISTS solicitudes_registro CASCADE;
DROP TABLE IF EXISTS analisis_ia CASCADE;
DROP TABLE IF EXISTS conversaciones_chatbot CASCADE;
DROP TABLE IF EXISTS logs_auditoria CASCADE;
DROP TABLE IF EXISTS reportes CASCADE;
DROP TABLE IF EXISTS kpi_historico CASCADE;
DROP TABLE IF EXISTS kpis CASCADE;
DROP TABLE IF EXISTS capacitacion_historial CASCADE;
DROP TABLE IF EXISTS capacitacion_comentarios CASCADE;
DROP TABLE IF EXISTS capacitacion_usuarios CASCADE;
DROP TABLE IF EXISTS competencias CASCADE;
DROP TABLE IF EXISTS entrega_items CASCADE;
DROP TABLE IF EXISTS entregas CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS reembolsos CASCADE;
DROP TABLE IF EXISTS devolucion_items CASCADE;
DROP TABLE IF EXISTS devoluciones CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS venta_items CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS ajustes_inventario CASCADE;
DROP TABLE IF EXISTS movimientos_inventario CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS tienda_personal CASCADE;
DROP TABLE IF EXISTS cedis CASCADE;
DROP TABLE IF EXISTS tiendas CASCADE;
DROP TABLE IF EXISTS sesiones CASCADE;
DROP TABLE IF EXISTS usuario_permisos CASCADE;
DROP TABLE IF EXISTS permisos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Eliminar funciones y triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS registrar_usuario CASCADE;
DROP FUNCTION IF EXISTS crear_solicitud_registro CASCADE;
DROP FUNCTION IF EXISTS aprobar_solicitud_registro CASCADE;
DROP FUNCTION IF EXISTS insertar_tienda CASCADE;
DROP FUNCTION IF EXISTS actualizar_tienda CASCADE;
DROP FUNCTION IF EXISTS eliminar_tienda CASCADE;
DROP FUNCTION IF EXISTS insertar_usuario_prueba CASCADE;

SELECT '✅ Parte 1 completada: Extensiones habilitadas y tablas eliminadas' as resultado;

