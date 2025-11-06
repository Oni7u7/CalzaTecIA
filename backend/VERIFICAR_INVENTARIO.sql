-- ============================================
-- SCRIPT: Verificar Inventario de Productos
-- Sistema ZAPATAVIVE / CalzaTecIA
-- ============================================
-- 
-- Este script verifica que los productos tengan inventario
-- Ejecuta este script después de AGREGAR_INVENTARIO_TODOS_PRODUCTOS.sql
-- ============================================

-- Verificar productos activos y su inventario
SELECT 
  '=== PRODUCTOS ACTIVOS CON INVENTARIO ===' as verificacion;

SELECT 
  p.sku,
  p.nombre,
  p.categoria,
  p.precio,
  COALESCE(SUM(i.cantidad), 0) as stock_total,
  COUNT(DISTINCT i.tienda_id) as num_tiendas,
  CASE 
    WHEN COALESCE(SUM(i.cantidad), 0) > 0 THEN 'CON STOCK'
    ELSE 'SIN STOCK'
  END as estado
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id AND i.estado = 'disponible'
WHERE p.activo = true
GROUP BY p.id, p.sku, p.nombre, p.categoria, p.precio
ORDER BY 
  CASE 
    WHEN COALESCE(SUM(i.cantidad), 0) > 0 THEN 0
    ELSE 1
  END,
  p.categoria,
  p.sku;

-- Verificar productos sin inventario
SELECT 
  '=== PRODUCTOS SIN INVENTARIO ===' as verificacion;

SELECT 
  p.sku,
  p.nombre,
  p.categoria,
  p.precio
FROM productos p
WHERE p.activo = true
AND NOT EXISTS (
  SELECT 1 FROM inventario i 
  WHERE i.producto_id = p.id 
  AND i.estado = 'disponible'
  AND i.cantidad > 0
)
ORDER BY p.categoria, p.sku;

-- Verificar inventario por tienda
SELECT 
  '=== INVENTARIO POR TIENDA ===' as verificacion;

SELECT 
  t.nombre as tienda,
  t.codigo,
  COUNT(DISTINCT i.producto_id) as productos_con_inventario,
  COALESCE(SUM(i.cantidad), 0) as stock_total
FROM tiendas t
LEFT JOIN inventario i ON t.id = i.tienda_id AND i.estado = 'disponible'
WHERE t.estado = 'activa'
GROUP BY t.id, t.nombre, t.codigo
ORDER BY t.codigo;

-- Resumen general
SELECT 
  '=== RESUMEN GENERAL ===' as verificacion;

SELECT 
  COUNT(DISTINCT p.id) as total_productos_activos,
  COUNT(DISTINCT CASE WHEN i.cantidad > 0 THEN p.id END) as productos_con_stock,
  COUNT(DISTINCT CASE WHEN COALESCE(SUM(i.cantidad), 0) = 0 THEN p.id END) as productos_sin_stock,
  COALESCE(SUM(i.cantidad), 0) as stock_total_global
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id AND i.estado = 'disponible'
WHERE p.activo = true
GROUP BY p.id;

-- Verificar algunos productos específicos
SELECT 
  '=== VERIFICACIÓN DE PRODUCTOS ESPECÍFICOS ===' as verificacion;

SELECT 
  p.sku,
  p.nombre,
  i.cantidad as stock,
  t.nombre as tienda,
  i.estado
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id
LEFT JOIN tiendas t ON i.tienda_id = t.id
WHERE p.sku IN ('SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005', 'SKU-006', 'SKU-007', 'SKU-008', 'SKU-009', 'SKU-010')
ORDER BY p.sku, t.nombre;

