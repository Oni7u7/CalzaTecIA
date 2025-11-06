-- =====================================================
-- Script de Datos Iniciales (Seeds) para Supabase
-- Sistema ZAPATAVIVE / CalzaTecIA
-- =====================================================
-- 
-- INSTRUCCIONES:
-- 1. Ejecuta PRIMERO el script supabase_schema.sql
-- 2. Luego ejecuta este script para insertar datos iniciales
-- 3. Puedes modificar los datos según tus necesidades
-- =====================================================

-- =====================================================
-- 1. ROLES
-- =====================================================

-- Insertar roles básicos del sistema
INSERT INTO roles (nombre, nivel, descripcion, permisos) VALUES
  (
    'admin',
    1,
    'Administrador del sistema con acceso completo',
    '{"*": true}'::jsonb
  ),
  (
    'gerente_tienda',
    2,
    'Gerente de tienda con acceso a operaciones de su tienda',
    '{"ventas": true, "inventario": true, "reportes": true}'::jsonb
  ),
  (
    'vendedor',
    3,
    'Vendedor con acceso a ventas e inventario',
    '{"ventas": true, "inventario": true}'::jsonb
  ),
  (
    'cliente',
    4,
    'Cliente/Comprador con acceso a catálogo y compras',
    '{"productos": true, "compras": true}'::jsonb
  ),
  (
    'supervisor',
    2,
    'Supervisor de operaciones con acceso a múltiples tiendas',
    '{"ventas": true, "inventario": true, "reportes": true, "capacitacion": true}'::jsonb
  )
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- 2. PERMISOS
-- =====================================================

-- Insertar permisos básicos
INSERT INTO permisos (nombre, descripcion, modulo) VALUES
  ('ver_usuarios', 'Ver lista de usuarios', 'usuarios'),
  ('crear_usuarios', 'Crear nuevos usuarios', 'usuarios'),
  ('editar_usuarios', 'Editar usuarios existentes', 'usuarios'),
  ('eliminar_usuarios', 'Eliminar usuarios', 'usuarios'),
  ('ver_productos', 'Ver catálogo de productos', 'productos'),
  ('crear_productos', 'Crear nuevos productos', 'productos'),
  ('editar_productos', 'Editar productos existentes', 'productos'),
  ('eliminar_productos', 'Eliminar productos', 'productos'),
  ('ver_inventario', 'Ver inventario', 'inventario'),
  ('editar_inventario', 'Modificar inventario', 'inventario'),
  ('ver_ventas', 'Ver ventas', 'ventas'),
  ('crear_ventas', 'Registrar nuevas ventas', 'ventas'),
  ('ver_reportes', 'Ver reportes y KPIs', 'reportes'),
  ('generar_reportes', 'Generar nuevos reportes', 'reportes'),
  ('ver_capacitacion', 'Ver capacitaciones', 'capacitacion'),
  ('gestionar_capacitacion', 'Gestionar capacitaciones', 'capacitacion')
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- 3. TIENDAS
-- =====================================================

-- Insertar tiendas de ejemplo
INSERT INTO tiendas (nombre, codigo, ubicacion, direccion, telefono, email, horario, estado, fecha_apertura) VALUES
  (
    'Tienda Centro',
    'T001',
    'Ciudad de México',
    'Av. Reforma 123, Col. Centro, CDMX',
    '5551234567',
    'centro@zapatavive.com',
    'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00',
    'activa',
    '2020-01-15'
  ),
  (
    'Tienda Sur',
    'T002',
    'Ciudad de México',
    'Av. Insurgentes Sur 456, Col. Del Valle, CDMX',
    '5552345678',
    'sur@zapatavive.com',
    'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00',
    'activa',
    '2020-03-20'
  ),
  (
    'Tienda Norte',
    'T003',
    'Ciudad de México',
    'Av. Constituyentes 789, Col. Lomas, CDMX',
    '5553456789',
    'norte@zapatavive.com',
    'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00',
    'activa',
    '2020-06-10'
  ),
  (
    'Tienda Satélite',
    'T004',
    'Estado de México',
    'Plaza Satélite, Local 45, Naucalpan',
    '5554567890',
    'satelite@zapatavive.com',
    'Lunes a Domingo: 10:00 - 22:00',
    'activa',
    '2021-02-14'
  ),
  (
    'Tienda Santa Fe',
    'T005',
    'Ciudad de México',
    'Centro Santa Fe, Local 120, CDMX',
    '5555678901',
    'santafe@zapatavive.com',
    'Lunes a Domingo: 10:00 - 22:00',
    'activa',
    '2021-05-01'
  )
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- 4. USUARIOS
-- =====================================================

-- Nota: Los password_hash deben ser generados con bcrypt
-- Para pruebas, puedes usar: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy (password: "1234")
-- IMPORTANTE: Cambia estos hashes por unos reales en producción

-- Usuario Administrador
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo) VALUES
  (
    'Administrador del Sistema',
    'admin@zapatavive.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 1234
    (SELECT id FROM roles WHERE nombre = 'admin'),
    true
  )
ON CONFLICT (email) DO NOTHING;

-- Usuarios Gerentes
INSERT INTO usuarios (nombre, email, password_hash, rol_id, tienda_id, activo) VALUES
  (
    'Gerente Centro',
    'gerente.centro@zapatavive.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 1234
    (SELECT id FROM roles WHERE nombre = 'gerente_tienda'),
    (SELECT id FROM tiendas WHERE codigo = 'T001'),
    true
  ),
  (
    'Gerente Sur',
    'gerente.sur@zapatavive.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 1234
    (SELECT id FROM roles WHERE nombre = 'gerente_tienda'),
    (SELECT id FROM tiendas WHERE codigo = 'T002'),
    true
  )
ON CONFLICT (email) DO NOTHING;

-- Actualizar gerente_id en tiendas
UPDATE tiendas SET gerente_id = (SELECT id FROM usuarios WHERE email = 'gerente.centro@zapatavive.com') WHERE codigo = 'T001';
UPDATE tiendas SET gerente_id = (SELECT id FROM usuarios WHERE email = 'gerente.sur@zapatavive.com') WHERE codigo = 'T002';

-- Usuarios Vendedores
INSERT INTO usuarios (nombre, email, password_hash, rol_id, tienda_id, supervisor_id, activo) VALUES
  (
    'Vendedor 1',
    'vendedor1@zapatavive.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 1234
    (SELECT id FROM roles WHERE nombre = 'vendedor'),
    (SELECT id FROM tiendas WHERE codigo = 'T001'),
    (SELECT id FROM usuarios WHERE email = 'gerente.centro@zapatavive.com'),
    true
  ),
  (
    'Vendedor 2',
    'vendedor2@zapatavive.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 1234
    (SELECT id FROM roles WHERE nombre = 'vendedor'),
    (SELECT id FROM tiendas WHERE codigo = 'T001'),
    (SELECT id FROM usuarios WHERE email = 'gerente.centro@zapatavive.com'),
    true
  ),
  (
    'Cliente Demo',
    'cliente@zapatavive.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 1234
    (SELECT id FROM roles WHERE nombre = 'cliente'),
    NULL,
    NULL,
    true
  )
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 5. PRODUCTOS
-- =====================================================

-- Insertar productos de ejemplo
INSERT INTO productos (sku, nombre, categoria, subcategoria, descripcion, marca, precio, costo, activo, tallas_disponibles, colores_disponibles, materiales, especificaciones) VALUES
  (
    'SKU-001',
    'Zapato Casual Negro',
    'Casual',
    'Zapatos',
    'Zapato casual cómodo ideal para uso diario. Material de cuero sintético de alta calidad.',
    'Zapatavive',
    899.00,
    500.00,
    true,
    '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Negro", "Blanco", "Café", "Gris"]'::jsonb,
    '["Cuero sintético", "Suela de goma"]'::jsonb,
    '{"peso": "800g", "origen": "México", "garantia": "6 meses"}'::jsonb
  ),
  (
    'SKU-002',
    'Zapato Formal Marrón',
    'Formal',
    'Zapatos',
    'Zapato formal elegante para ocasiones especiales. Cuero genuino italiano.',
    'Zapatavive Premium',
    1299.00,
    800.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44"]'::jsonb,
    '["Marrón", "Negro", "Azul marino"]'::jsonb,
    '["Cuero genuino", "Suela de cuero"]'::jsonb,
    '{"peso": "900g", "origen": "Italia", "garantia": "12 meses"}'::jsonb
  ),
  (
    'SKU-003',
    'Tenis Deportivo Running',
    'Deportivo',
    'Tenis',
    'Tenis deportivo para running con tecnología de amortiguación avanzada.',
    'Zapatavive Sport',
    1199.00,
    700.00,
    true,
    '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Blanco", "Negro", "Azul", "Rojo", "Verde"]'::jsonb,
    '["Malla transpirable", "Suela de EVA"]'::jsonb,
    '{"peso": "300g", "origen": "México", "garantia": "6 meses", "tecnologia": "Amortiguación Air"}'::jsonb
  ),
  (
    'SKU-004',
    'Bota de Seguridad',
    'Seguridad',
    'Botas',
    'Bota de seguridad industrial con puntera de acero y suela antideslizante.',
    'Zapatavive Safety',
    1499.00,
    900.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Negro", "Café"]'::jsonb,
    '["Cuero resistente", "Puntera de acero", "Suela antideslizante"]'::jsonb,
    '{"peso": "1200g", "origen": "México", "garantia": "12 meses", "certificacion": "NOM-113-STPS-2009"}'::jsonb
  ),
  (
    'SKU-005',
    'Zapato Casual Blanco',
    'Casual',
    'Zapatos',
    'Zapato casual blanco versátil para cualquier ocasión.',
    'Zapatavive',
    799.00,
    450.00,
    true,
    '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Blanco", "Beige"]'::jsonb,
    '["Cuero sintético", "Suela de goma"]'::jsonb,
    '{"peso": "750g", "origen": "México", "garantia": "6 meses"}'::jsonb
  ),
  (
    'SKU-006',
    'Mocasín Clásico',
    'Formal',
    'Mocasines',
    'Mocasín clásico elegante para oficina o eventos formales.',
    'Zapatavive Premium',
    1099.00,
    650.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44"]'::jsonb,
    '["Negro", "Marrón", "Azul marino"]'::jsonb,
    '["Cuero genuino", "Suela de cuero"]'::jsonb,
    '{"peso": "850g", "origen": "México", "garantia": "12 meses"}'::jsonb
  ),
  (
    'SKU-007',
    'Tenis Casual',
    'Casual',
    'Tenis',
    'Tenis casual cómodo para uso diario y caminatas.',
    'Zapatavive',
    999.00,
    600.00,
    true,
    '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Blanco", "Negro", "Gris", "Azul"]'::jsonb,
    '["Malla", "Suela de goma"]'::jsonb,
    '{"peso": "400g", "origen": "México", "garantia": "6 meses"}'::jsonb
  ),
  (
    'SKU-008',
    'Zapato Oxford Negro',
    'Formal',
    'Zapatos',
    'Zapato Oxford formal en color negro, ideal para trajes y eventos.',
    'Zapatavive Premium',
    1399.00,
    850.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44"]'::jsonb,
    '["Negro"]'::jsonb,
    '["Cuero genuino", "Suela de cuero"]'::jsonb,
    '{"peso": "950g", "origen": "Italia", "garantia": "12 meses"}'::jsonb
  ),
  (
    'SKU-009',
    'Bota de Trabajo',
    'Seguridad',
    'Botas',
    'Bota de trabajo resistente para uso industrial y construcción.',
    'Zapatavive Safety',
    1299.00,
    750.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Negro", "Café"]'::jsonb,
    '["Cuero resistente", "Suela antideslizante"]'::jsonb,
    '{"peso": "1100g", "origen": "México", "garantia": "12 meses"}'::jsonb
  ),
  (
    'SKU-010',
    'Zapato Deportivo Crossfit',
    'Deportivo',
    'Tenis',
    'Zapato deportivo especializado para crossfit y entrenamiento funcional.',
    'Zapatavive Sport',
    1349.00,
    800.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Negro", "Rojo", "Azul"]'::jsonb,
    '["Malla transpirable", "Suela de goma adherente"]'::jsonb,
    '{"peso": "350g", "origen": "México", "garantia": "6 meses", "tecnologia": "Estabilidad lateral"}'::jsonb
  )
ON CONFLICT (sku) DO NOTHING;

-- =====================================================
-- 6. INVENTARIO
-- =====================================================

-- Insertar inventario inicial para cada tienda
-- Nota: Esto asigna stock aleatorio a cada producto en cada tienda

DO $$
DECLARE
  producto_record RECORD;
  tienda_record RECORD;
  stock_cantidad INTEGER;
BEGIN
  -- Para cada producto
  FOR producto_record IN SELECT id FROM productos WHERE activo = true LOOP
    -- Para cada tienda
    FOR tienda_record IN SELECT id FROM tiendas WHERE estado = 'activa' LOOP
      -- Generar stock aleatorio entre 10 y 100
      stock_cantidad := floor(random() * 90 + 10)::INTEGER;
      
      -- Insertar inventario
      INSERT INTO inventario (producto_id, tienda_id, cantidad, cantidad_minima, cantidad_maxima, estado)
      VALUES (
        producto_record.id,
        tienda_record.id,
        stock_cantidad,
        10,
        200,
        'disponible'
      )
      ON CONFLICT (producto_id, tienda_id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- =====================================================
-- 7. CEDIS
-- =====================================================

-- Insertar CEDIS de ejemplo
INSERT INTO cedis (nombre, codigo, ubicacion, direccion, telefono, tipo) VALUES
  (
    'CEDIS Principal',
    'CEDIS-001',
    'Ciudad de México',
    'Av. Industrial 1000, Col. Industrial, CDMX',
    '5550000001',
    'principal'
  ),
  (
    'CEDIS Regional Norte',
    'CEDIS-002',
    'Estado de México',
    'Carretera México-Pachuca Km 25, Ecatepec',
    '5550000002',
    'regional'
  )
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- 8. PROVEEDORES
-- =====================================================

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (razon_social, rfc, contacto, telefono, email, direccion, condiciones, calificacion, activo) VALUES
  (
    'Calzado Mexicano S.A. de C.V.',
    'CME850101ABC',
    'Juan Pérez',
    '5551111111',
    'contacto@calzadomexicano.com',
    'Av. Industrial 500, Col. Industrial, CDMX',
    'Pago a 30 días, entrega en 15 días',
    4.5,
    true
  ),
  (
    'Zapatos Premium S.A.',
    'ZPR900202DEF',
    'María González',
    '5552222222',
    'ventas@zapatospremium.com',
    'Blvd. Industrial 200, Guadalajara, Jalisco',
    'Pago a 45 días, entrega en 20 días',
    4.8,
    true
  )
ON CONFLICT (rfc) DO NOTHING;

-- =====================================================
-- 9. COMPETENCIAS (Capacitación)
-- =====================================================

-- Insertar competencias básicas
INSERT INTO competencias (nombre, descripcion, rol_id, obligatoria, orden) VALUES
  (
    'Atención al Cliente',
    'Habilidades para brindar excelente servicio al cliente',
    (SELECT id FROM roles WHERE nombre = 'vendedor'),
    true,
    1
  ),
  (
    'Manejo de POS',
    'Uso correcto del sistema de punto de venta',
    (SELECT id FROM roles WHERE nombre = 'vendedor'),
    true,
    2
  ),
  (
    'Gestión de Inventario',
    'Conocimientos sobre control y gestión de inventario',
    (SELECT id FROM roles WHERE nombre = 'gerente_tienda'),
    true,
    1
  ),
  (
    'Liderazgo de Equipo',
    'Habilidades para liderar y motivar equipos de trabajo',
    (SELECT id FROM roles WHERE nombre = 'gerente_tienda'),
    true,
    2
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DEL SCRIPT DE SEEDS
-- =====================================================
-- 
-- ✅ Datos iniciales insertados:
-- ✅ Roles creados
-- ✅ Permisos creados
-- ✅ Tiendas creadas
-- ✅ Usuarios de ejemplo creados
-- ✅ Productos de ejemplo creados
-- ✅ Inventario inicial asignado
-- ✅ CEDIS creados
-- ✅ Proveedores creados
-- ✅ Competencias creadas
-- 
-- CREDENCIALES DE PRUEBA:
-- - Admin: admin@zapatavive.com / 1234
-- - Gerente: gerente.centro@zapatavive.com / 1234
-- - Vendedor: vendedor1@zapatavive.com / 1234
-- - Cliente: cliente@zapatavive.com / 1234
-- 
-- ⚠️ IMPORTANTE: Cambia las contraseñas en producción
-- =====================================================


