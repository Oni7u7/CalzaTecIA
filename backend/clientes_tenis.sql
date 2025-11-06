-- ============================================
-- SCRIPT: Insertar Tenis para Clientes
-- Sistema ZAPATAVIVE / CalzaTecIA
-- ============================================
-- 
-- Este script inserta productos (tenis) con inventario
-- para que aparezcan en el catálogo de clientes
-- ============================================

-- ============================================
-- PASO 1: Crear o actualizar productos (tenis)
-- ============================================

-- Tenis Deportivo Running
INSERT INTO productos (
  sku,
  nombre,
  categoria,
  subcategoria,
  descripcion,
  marca,
  precio,
  costo,
  activo,
  tallas_disponibles,
  colores_disponibles,
  materiales,
  especificaciones,
  created_at,
  updated_at
) VALUES (
  'SKU-TENIS-001',
  'Tenis Deportivo Running',
  'Deportivo',
  'Tenis',
  'Tenis deportivo para running con tecnología de amortiguación avanzada. Ideal para corredores y atletas.',
  'Zapatavive Sport',
  1199.00,
  700.00,
  true,
  '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
  '["Blanco", "Negro", "Azul", "Rojo", "Verde"]'::jsonb,
  '["Malla transpirable", "Suela de EVA"]'::jsonb,
  '{"peso": "300g", "origen": "México", "garantia": "6 meses", "tecnologia": "Amortiguación Air"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (sku) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  activo = true,
  tallas_disponibles = EXCLUDED.tallas_disponibles,
  colores_disponibles = EXCLUDED.colores_disponibles,
  updated_at = NOW();

-- Tenis Casual
INSERT INTO productos (
  sku,
  nombre,
  categoria,
  subcategoria,
  descripcion,
  marca,
  precio,
  costo,
  activo,
  tallas_disponibles,
  colores_disponibles,
  materiales,
  especificaciones,
  created_at,
  updated_at
) VALUES (
  'SKU-TENIS-002',
  'Tenis Casual',
  'Casual',
  'Tenis',
  'Tenis casual cómodo para uso diario y caminatas. Diseño moderno y versátil.',
  'Zapatavive',
  999.00,
  600.00,
  true,
  '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
  '["Blanco", "Negro", "Gris", "Azul"]'::jsonb,
  '["Malla", "Suela de goma"]'::jsonb,
  '{"peso": "400g", "origen": "México", "garantia": "6 meses"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (sku) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  activo = true,
  tallas_disponibles = EXCLUDED.tallas_disponibles,
  colores_disponibles = EXCLUDED.colores_disponibles,
  updated_at = NOW();

-- Tenis Deportivo Crossfit
INSERT INTO productos (
  sku,
  nombre,
  categoria,
  subcategoria,
  descripcion,
  marca,
  precio,
  costo,
  activo,
  tallas_disponibles,
  colores_disponibles,
  materiales,
  especificaciones,
  created_at,
  updated_at
) VALUES (
  'SKU-TENIS-003',
  'Tenis Deportivo Crossfit',
  'Deportivo',
  'Tenis',
  'Zapato deportivo especializado para crossfit y entrenamiento funcional. Máxima estabilidad y resistencia.',
  'Zapatavive Sport',
  1349.00,
  800.00,
  true,
  '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
  '["Negro", "Rojo", "Azul"]'::jsonb,
  '["Malla transpirable", "Suela de goma adherente"]'::jsonb,
  '{"peso": "350g", "origen": "México", "garantia": "6 meses", "tecnologia": "Estabilidad lateral"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (sku) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  activo = true,
  tallas_disponibles = EXCLUDED.tallas_disponibles,
  colores_disponibles = EXCLUDED.colores_disponibles,
  updated_at = NOW();

-- Tenis Running Premium
INSERT INTO productos (
  sku,
  nombre,
  categoria,
  subcategoria,
  descripcion,
  marca,
  precio,
  costo,
  activo,
  tallas_disponibles,
  colores_disponibles,
  materiales,
  especificaciones,
  created_at,
  updated_at
) VALUES (
  'SKU-TENIS-004',
  'Tenis Running Premium',
  'Deportivo',
  'Tenis',
  'Tenis running de alta gama con tecnología de última generación. Perfecto para maratonistas y corredores profesionales.',
  'Zapatavive Sport Premium',
  1599.00,
  950.00,
  true,
  '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
  '["Blanco", "Negro", "Azul marino", "Gris"]'::jsonb,
  '["Malla técnica", "Suela de carbono", "Plantilla ortopédica"]'::jsonb,
  '{"peso": "280g", "origen": "México", "garantia": "12 meses", "tecnologia": "Amortiguación Pro Max"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (sku) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  activo = true,
  tallas_disponibles = EXCLUDED.tallas_disponibles,
  colores_disponibles = EXCLUDED.colores_disponibles,
  updated_at = NOW();

-- Tenis Urbano
INSERT INTO productos (
  sku,
  nombre,
  categoria,
  subcategoria,
  descripcion,
  marca,
  precio,
  costo,
  activo,
  tallas_disponibles,
  colores_disponibles,
  materiales,
  especificaciones,
  created_at,
  updated_at
) VALUES (
  'SKU-TENIS-005',
  'Tenis Urbano',
  'Casual',
  'Tenis',
  'Tenis urbano con estilo moderno. Ideal para el día a día con máximo confort.',
  'Zapatavive Urban',
  899.00,
  550.00,
  true,
  '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
  '["Blanco", "Negro", "Beige", "Gris claro"]'::jsonb,
  '["Cuero sintético", "Suela de goma"]'::jsonb,
  '{"peso": "450g", "origen": "México", "garantia": "6 meses"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (sku) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  categoria = EXCLUDED.categoria,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  activo = true,
  tallas_disponibles = EXCLUDED.tallas_disponibles,
  colores_disponibles = EXCLUDED.colores_disponibles,
  updated_at = NOW();

-- ============================================
-- PASO 2: Crear tienda por defecto si no existe
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
-- PASO 3: Insertar inventario para los productos
-- ============================================

-- Obtener ID de la tienda principal
DO $$
DECLARE
  tienda_principal_id UUID;
  producto_record RECORD;
  stock_cantidad INTEGER;
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

  -- Para cada producto de tenis, insertar inventario
  FOR producto_record IN 
    SELECT id FROM productos 
    WHERE sku LIKE 'SKU-TENIS-%' AND activo = true
  LOOP
    -- Generar stock aleatorio entre 20 y 100
    stock_cantidad := floor(random() * 80 + 20)::INTEGER;
    
    -- Insertar o actualizar inventario
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
    )
    ON CONFLICT (producto_id, tienda_id) DO UPDATE SET
      cantidad = EXCLUDED.cantidad,
      estado = 'disponible',
      updated_at = NOW();
  END LOOP;
END $$;

-- ============================================
-- PASO 4: Verificar productos y inventario creados
-- ============================================

SELECT 
  '=== PRODUCTOS DE TENIS CREADOS ===' as verificacion;

SELECT 
  p.sku,
  p.nombre,
  p.categoria,
  p.precio,
  p.activo,
  COALESCE(SUM(i.cantidad), 0) as stock_total
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id AND i.estado = 'disponible'
WHERE p.sku LIKE 'SKU-TENIS-%'
GROUP BY p.id, p.sku, p.nombre, p.categoria, p.precio, p.activo
ORDER BY p.sku;

-- ============================================
-- PASO 5: Verificar inventario por tienda
-- ============================================

SELECT 
  '=== INVENTARIO POR TIENDA ===' as verificacion;

SELECT 
  t.nombre as tienda,
  p.sku,
  p.nombre as producto,
  i.cantidad,
  i.estado
FROM inventario i
JOIN productos p ON i.producto_id = p.id
JOIN tiendas t ON i.tienda_id = t.id
WHERE p.sku LIKE 'SKU-TENIS-%'
ORDER BY t.nombre, p.sku;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- 
-- ✅ Productos de tenis creados/actualizados
-- ✅ Inventario asignado a tienda principal
-- ✅ Productos activos y disponibles
-- 
-- Los productos ahora deberían aparecer en el catálogo de clientes
-- ============================================


