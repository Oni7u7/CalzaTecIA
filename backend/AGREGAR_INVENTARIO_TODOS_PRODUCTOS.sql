-- ============================================
-- SCRIPT: Agregar Inventario a Todos los Productos
-- Sistema ZAPATAVIVE / CalzaTecIA
-- ============================================
-- 
-- Este script agrega inventario a TODOS los productos activos
-- para que aparezcan con stock en el catálogo de clientes
-- ============================================

-- ============================================
-- PASO 1: Crear tienda principal si no existe
-- ============================================

INSERT INTO tiendas (
  nombre,
  codigo,
  ubicacion,
  direccion,
  telefono,
  email,
  horario,
  estado,
  fecha_apertura,
  created_at,
  updated_at
) VALUES (
  'Tienda Principal',
  'T001',
  'Ciudad de México',
  'Av. Principal 123, Col. Centro, CDMX',
  '5551234567',
  'principal@zapatavive.com',
  'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00',
  'activa',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- PASO 2: Agregar inventario a TODOS los productos activos
-- ============================================

DO $$
DECLARE
  tienda_principal_id UUID;
  producto_record RECORD;
  stock_cantidad INTEGER;
  productos_sin_inventario INTEGER := 0;
  productos_con_inventario INTEGER := 0;
BEGIN
  -- Obtener ID de la tienda principal
  SELECT id INTO tienda_principal_id
  FROM tiendas
  WHERE codigo = 'T001'
  LIMIT 1;

  -- Si no hay tienda, crear una
  IF tienda_principal_id IS NULL THEN
    INSERT INTO tiendas (nombre, codigo, ubicacion, estado, created_at, updated_at)
    VALUES ('Tienda Principal', 'T001', 'Ciudad de México', 'activa', NOW(), NOW())
    RETURNING id INTO tienda_principal_id;
  END IF;

  RAISE NOTICE 'Tienda Principal ID: %', tienda_principal_id;

  -- Para cada producto activo, insertar o actualizar inventario
  FOR producto_record IN 
    SELECT id, sku, nombre, categoria FROM productos 
    WHERE activo = true
    ORDER BY sku
  LOOP
    -- Verificar si ya tiene inventario
    IF EXISTS (
      SELECT 1 FROM inventario 
      WHERE producto_id = producto_record.id 
      AND tienda_id = tienda_principal_id
    ) THEN
      -- Si ya tiene inventario, actualizar cantidad si es 0
      UPDATE inventario
      SET cantidad = CASE 
        WHEN cantidad = 0 THEN floor(random() * 80 + 20)::INTEGER
        ELSE cantidad
      END,
      estado = 'disponible',
      updated_at = NOW()
      WHERE producto_id = producto_record.id 
      AND tienda_id = tienda_principal_id;
      
      productos_con_inventario := productos_con_inventario + 1;
      RAISE NOTICE 'Inventario actualizado para: % (SKU: %)', producto_record.nombre, producto_record.sku;
    ELSE
      -- Si no tiene inventario, crear uno nuevo
      -- Generar stock aleatorio entre 20 y 100
      stock_cantidad := floor(random() * 80 + 20)::INTEGER;
      
      INSERT INTO inventario (
        producto_id,
        tienda_id,
        cantidad,
        cantidad_minima,
        cantidad_maxima,
        estado,
        created_at,
        updated_at
      ) VALUES (
        producto_record.id,
        tienda_principal_id,
        stock_cantidad,
        10,
        200,
        'disponible',
        NOW(),
        NOW()
      );
      
      productos_sin_inventario := productos_sin_inventario + 1;
      RAISE NOTICE 'Inventario creado para: % (SKU: %) - Stock: %', producto_record.nombre, producto_record.sku, stock_cantidad;
    END IF;
  END LOOP;

  RAISE NOTICE '=== RESUMEN ===';
  RAISE NOTICE 'Productos con inventario actualizado: %', productos_con_inventario;
  RAISE NOTICE 'Productos con inventario nuevo: %', productos_sin_inventario;
  RAISE NOTICE 'Total de productos procesados: %', productos_con_inventario + productos_sin_inventario;
END $$;

-- ============================================
-- PASO 3: Verificar productos y su inventario
-- ============================================

SELECT 
  '=== PRODUCTOS CON INVENTARIO ===' as verificacion;

SELECT 
  p.sku,
  p.nombre,
  p.categoria,
  p.precio,
  p.activo,
  COALESCE(SUM(i.cantidad), 0) as stock_total,
  COUNT(DISTINCT i.tienda_id) as num_tiendas
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id AND i.estado = 'disponible'
WHERE p.activo = true
GROUP BY p.id, p.sku, p.nombre, p.categoria, p.precio, p.activo
ORDER BY p.categoria, p.sku;

-- ============================================
-- PASO 4: Verificar productos sin inventario
-- ============================================

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

-- ============================================
-- PASO 5: Resumen de inventario por categoría
-- ============================================

SELECT 
  '=== RESUMEN POR CATEGORÍA ===' as verificacion;

SELECT 
  p.categoria,
  COUNT(DISTINCT p.id) as total_productos,
  COUNT(DISTINCT CASE WHEN i.cantidad > 0 THEN p.id END) as productos_con_stock,
  COALESCE(SUM(i.cantidad), 0) as stock_total,
  COALESCE(AVG(i.cantidad), 0)::INTEGER as stock_promedio
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id AND i.estado = 'disponible'
WHERE p.activo = true
GROUP BY p.categoria
ORDER BY p.categoria;

-- ============================================
-- PASO 6: Verificar inventario por tienda
-- ============================================

SELECT 
  '=== INVENTARIO POR TIENDA ===' as verificacion;

SELECT 
  t.nombre as tienda,
  t.codigo,
  COUNT(DISTINCT i.producto_id) as productos_con_inventario,
  COALESCE(SUM(i.cantidad), 0) as stock_total,
  COALESCE(AVG(i.cantidad), 0)::INTEGER as stock_promedio
FROM tiendas t
LEFT JOIN inventario i ON t.id = i.tienda_id AND i.estado = 'disponible'
WHERE t.estado = 'activa'
GROUP BY t.id, t.nombre, t.codigo
ORDER BY t.codigo;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- 
-- ✅ Inventario agregado a todos los productos activos
-- ✅ Stock asignado a tienda principal
-- ✅ Productos ahora deberían aparecer con stock en el catálogo
-- 
-- Los productos ahora deberían aparecer con stock disponible
-- en lugar de "AGOTADO" o "SIN STOCK"
-- ============================================


