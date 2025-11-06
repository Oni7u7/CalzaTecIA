-- =====================================================
-- Script SQL CORREGIDO para crear todas las tablas en Supabase
-- Sistema ZAPATAVIVE / CalzaTecIA
-- =====================================================
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Abre el SQL Editor
-- 3. Copia y pega todo este script
-- 4. Ejecuta el script (botón "Run")
-- 
-- IMPORTANTE: Este script puede ejecutarse múltiples veces sin errores
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda full-text mejorada

-- =====================================================
-- 1. AUTENTICACIÓN Y USUARIOS
-- =====================================================

-- Tabla: roles (debe crearse primero porque otras tablas la referencian)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  nivel INTEGER NOT NULL,
  supervisor_rol_id UUID REFERENCES roles(id),
  descripcion TEXT,
  permisos JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roles_nivel ON roles(nivel);

-- Tabla: tiendas (debe crearse antes de usuarios)
CREATE TABLE IF NOT EXISTS tiendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(255),
  horario TEXT,
  gerente_id UUID, -- Se actualizará después de crear usuarios
  estado VARCHAR(50) DEFAULT 'activa',
  fecha_apertura DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tiendas_codigo ON tiendas(codigo);
CREATE INDEX IF NOT EXISTS idx_tiendas_estado ON tiendas(estado);

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol_id UUID REFERENCES roles(id),
  supervisor_id UUID REFERENCES usuarios(id),
  tienda_id UUID REFERENCES tiendas(id),
  activo BOOLEAN DEFAULT true,
  fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_tienda_id ON usuarios(tienda_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_supervisor_id ON usuarios(supervisor_id);

-- Agregar foreign key de gerente_id en tiendas después de crear usuarios
-- CORREGIDO: Verificar si el constraint ya existe antes de agregarlo
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_tiendas_gerente'
  ) THEN
    ALTER TABLE tiendas 
    ADD CONSTRAINT fk_tiendas_gerente 
    FOREIGN KEY (gerente_id) REFERENCES usuarios(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tiendas_gerente ON tiendas(gerente_id);

-- Tabla: permisos
CREATE TABLE IF NOT EXISTS permisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  modulo VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permisos_modulo ON permisos(modulo);

-- Tabla: usuario_permisos
CREATE TABLE IF NOT EXISTS usuario_permisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, permiso_id)
);

CREATE INDEX IF NOT EXISTS idx_usuario_permisos_usuario ON usuario_permisos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_permisos_permiso ON usuario_permisos(permiso_id);

-- Tabla: sesiones
CREATE TABLE IF NOT EXISTS sesiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  refresh_token TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_token ON sesiones(token);
CREATE INDEX IF NOT EXISTS idx_sesiones_activa ON sesiones(activa);

-- =====================================================
-- 2. TIENDAS Y CEDIS (tiendas ya creada arriba)
-- =====================================================

-- Tabla: tienda_personal
CREATE TABLE IF NOT EXISTS tienda_personal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tienda_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_tienda_personal_tienda ON tienda_personal(tienda_id);
CREATE INDEX IF NOT EXISTS idx_tienda_personal_usuario ON tienda_personal(usuario_id);

-- Tabla: cedis
CREATE TABLE IF NOT EXISTS cedis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  direccion TEXT,
  telefono VARCHAR(20),
  tipo VARCHAR(50) NOT NULL, -- 'principal', 'regional', 'distribucion'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cedis_codigo ON cedis(codigo);
CREATE INDEX IF NOT EXISTS idx_cedis_tipo ON cedis(tipo);

-- =====================================================
-- 3. PRODUCTOS E INVENTARIO
-- =====================================================

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  descripcion TEXT,
  marca VARCHAR(100),
  precio DECIMAL(10, 2) NOT NULL,
  costo DECIMAL(10, 2),
  imagen_url TEXT,
  imagenes JSONB DEFAULT '[]',
  tallas_disponibles JSONB DEFAULT '[]',
  colores_disponibles JSONB DEFAULT '[]',
  materiales JSONB DEFAULT '[]',
  especificaciones JSONB DEFAULT '{}',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
-- Índice full-text para búsqueda en español
CREATE INDEX IF NOT EXISTS idx_productos_nombre_fts ON productos USING gin(to_tsvector('spanish', nombre));

-- Tabla: inventario
CREATE TABLE IF NOT EXISTS inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 0 NOT NULL,
  cantidad_minima INTEGER DEFAULT 0,
  cantidad_maxima INTEGER DEFAULT 0,
  ubicacion_fisica VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'disponible', -- 'disponible', 'reservado', 'dañado', 'devolucion'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(producto_id, tienda_id)
);

CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_inventario_tienda ON inventario(tienda_id);
CREATE INDEX IF NOT EXISTS idx_inventario_estado ON inventario(estado);
CREATE INDEX IF NOT EXISTS idx_inventario_cantidad ON inventario(cantidad);

-- Tabla: movimientos_inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id),
  tienda_origen_id UUID REFERENCES tiendas(id),
  tienda_destino_id UUID REFERENCES tiendas(id),
  cantidad INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'transferencia', 'venta', 'compra', 'ajuste', 'devolucion', 'perdida'
  motivo TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referencia_id UUID, -- ID de venta, compra, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_tienda_origen ON movimientos_inventario(tienda_origen_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_tienda_destino ON movimientos_inventario(tienda_destino_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos_inventario(tipo);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_inventario(fecha);

-- Tabla: ajustes_inventario
CREATE TABLE IF NOT EXISTS ajustes_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventario_id UUID REFERENCES inventario(id) ON DELETE CASCADE,
  cantidad_anterior INTEGER NOT NULL,
  cantidad_nueva INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  aprobado_por UUID REFERENCES usuarios(id),
  aprobado_fecha TIMESTAMP WITH TIME ZONE,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_ajustes_inventario ON ajustes_inventario(inventario_id);
CREATE INDEX IF NOT EXISTS idx_ajustes_estado ON ajustes_inventario(estado);

-- =====================================================
-- 4. VENTAS Y POS
-- =====================================================

-- Tabla: ventas
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket VARCHAR(50) UNIQUE NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  vendedor_id UUID REFERENCES usuarios(id),
  tienda_id UUID REFERENCES tiendas(id),
  cliente_id UUID REFERENCES usuarios(id), -- Para compradores
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL, -- 'efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia'
  estado VARCHAR(50) DEFAULT 'completada', -- 'completada', 'cancelada', 'reembolsada'
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ventas_ticket ON ventas(ticket);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_vendedor ON ventas(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_ventas_tienda ON ventas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);

-- Tabla: venta_items
CREATE TABLE IF NOT EXISTS venta_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  talla VARCHAR(10),
  color VARCHAR(50),
  sku VARCHAR(100),
  nombre_producto VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venta_items_venta ON venta_items(venta_id);
CREATE INDEX IF NOT EXISTS idx_venta_items_producto ON venta_items(producto_id);

-- Tabla: tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  contenido_json JSONB NOT NULL,
  formato VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'html', 'json'
  fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  url_archivo TEXT
);

CREATE INDEX IF NOT EXISTS idx_tickets_venta ON tickets(venta_id);

-- =====================================================
-- 5. DEVOLUCIONES Y REEMBOLSOS
-- =====================================================

-- Tabla: devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id),
  cliente_id UUID REFERENCES usuarios(id),
  tipo VARCHAR(50) NOT NULL, -- 'devolucion', 'cambio', 'garantia'
  motivo TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'solicitada', -- 'solicitada', 'en_revision', 'aprobada', 'rechazada', 'completada'
  solicitud_fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprobacion_fecha TIMESTAMP WITH TIME ZONE,
  aprobado_por UUID REFERENCES usuarios(id),
  resuelto_fecha TIMESTAMP WITH TIME ZONE,
  resuelto_por UUID REFERENCES usuarios(id),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devoluciones_venta ON devoluciones(venta_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_cliente ON devoluciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_devoluciones_estado ON devoluciones(estado);

-- Tabla: devolucion_items
CREATE TABLE IF NOT EXISTS devolucion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucion_id UUID REFERENCES devoluciones(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  venta_item_id UUID REFERENCES venta_items(id),
  cantidad INTEGER NOT NULL,
  estado_producto VARCHAR(50) NOT NULL, -- 'nuevo', 'usado', 'dañado'
  foto_url TEXT,
  motivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devolucion_items_devolucion ON devolucion_items(devolucion_id);
CREATE INDEX IF NOT EXISTS idx_devolucion_items_producto ON devolucion_items(producto_id);

-- Tabla: reembolsos
CREATE TABLE IF NOT EXISTS reembolsos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucion_id UUID REFERENCES devoluciones(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  metodo VARCHAR(50) NOT NULL, -- 'efectivo', 'transferencia', 'tarjeta_original', 'nota_credito'
  fecha_procesado TIMESTAMP WITH TIME ZONE,
  procesado_por UUID REFERENCES usuarios(id),
  comprobante_url TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reembolsos_devolucion ON reembolsos(devolucion_id);

-- =====================================================
-- 6. PROVEEDORES Y ENTREGAS
-- =====================================================

-- Tabla: proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
  rfc VARCHAR(20) UNIQUE,
  contacto VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(255),
  direccion TEXT,
  condiciones TEXT,
  calificacion DECIMAL(3, 2) DEFAULT 0, -- 0.00 a 5.00
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proveedores_rfc ON proveedores(rfc);
CREATE INDEX IF NOT EXISTS idx_proveedores_activo ON proveedores(activo);

-- Tabla: entregas
CREATE TABLE IF NOT EXISTS entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID REFERENCES proveedores(id),
  tienda_id UUID REFERENCES tiendas(id),
  cedis_id UUID REFERENCES cedis(id),
  fecha_programada DATE NOT NULL,
  fecha_recibida DATE,
  estado VARCHAR(50) DEFAULT 'programada', -- 'programada', 'en_transito', 'recibida', 'incompleta', 'cancelada'
  remision_numero VARCHAR(100),
  recibido_por UUID REFERENCES usuarios(id),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entregas_proveedor ON entregas(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_entregas_tienda ON entregas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_entregas_estado ON entregas(estado);
CREATE INDEX IF NOT EXISTS idx_entregas_fecha_programada ON entregas(fecha_programada);

-- Tabla: entrega_items
CREATE TABLE IF NOT EXISTS entrega_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id UUID REFERENCES entregas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad_esperada INTEGER NOT NULL,
  cantidad_recibida INTEGER DEFAULT 0,
  diferencia INTEGER GENERATED ALWAYS AS (cantidad_recibida - cantidad_esperada) STORED,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entrega_items_entrega ON entrega_items(entrega_id);
CREATE INDEX IF NOT EXISTS idx_entrega_items_producto ON entrega_items(producto_id);

-- =====================================================
-- 7. CAPACITACIÓN
-- =====================================================

-- Tabla: competencias
CREATE TABLE IF NOT EXISTS competencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  rol_id UUID REFERENCES roles(id),
  obligatoria BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competencias_rol ON competencias(rol_id);
CREATE INDEX IF NOT EXISTS idx_competencias_obligatoria ON competencias(obligatoria);

-- Tabla: capacitacion_usuarios
CREATE TABLE IF NOT EXISTS capacitacion_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  competencia_id UUID REFERENCES competencias(id) ON DELETE CASCADE,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'en_progreso', 'completada', 'aprobada', 'rechazada'
  progreso INTEGER DEFAULT 0, -- 0 a 100
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_completado TIMESTAMP WITH TIME ZONE,
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  aprobado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, competencia_id)
);

CREATE INDEX IF NOT EXISTS idx_capacitacion_usuario ON capacitacion_usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_capacitacion_competencia ON capacitacion_usuarios(competencia_id);
CREATE INDEX IF NOT EXISTS idx_capacitacion_estado ON capacitacion_usuarios(estado);

-- Tabla: capacitacion_comentarios
CREATE TABLE IF NOT EXISTS capacitacion_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES capacitacion_usuarios(id) ON DELETE CASCADE,
  supervisor_id UUID REFERENCES usuarios(id),
  comentario TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_capacitacion_comentarios_capacitacion ON capacitacion_comentarios(capacitacion_id);
CREATE INDEX IF NOT EXISTS idx_capacitacion_comentarios_supervisor ON capacitacion_comentarios(supervisor_id);

-- Tabla: capacitacion_historial
CREATE TABLE IF NOT EXISTS capacitacion_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES capacitacion_usuarios(id) ON DELETE CASCADE,
  accion VARCHAR(100) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  detalles_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_capacitacion_historial_capacitacion ON capacitacion_historial(capacitacion_id);
CREATE INDEX IF NOT EXISTS idx_capacitacion_historial_fecha ON capacitacion_historial(fecha);

-- =====================================================
-- 8. REPORTES Y KPIs
-- =====================================================

-- Tabla: kpis
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  nivel VARCHAR(50) NOT NULL, -- 'estrategico', 'tactico', 'operativo'
  formula TEXT,
  valor_actual DECIMAL(15, 2),
  meta DECIMAL(15, 2),
  unidad VARCHAR(50),
  frecuencia VARCHAR(50), -- 'diaria', 'semanal', 'mensual', 'anual'
  fecha_calculo TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpis_nivel ON kpis(nivel);
CREATE INDEX IF NOT EXISTS idx_kpis_frecuencia ON kpis(frecuencia);

-- Tabla: kpi_historico
CREATE TABLE IF NOT EXISTS kpi_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  valor DECIMAL(15, 2) NOT NULL,
  fecha DATE NOT NULL,
  tienda_id UUID REFERENCES tiendas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kpi_historico_kpi ON kpi_historico(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_historico_fecha ON kpi_historico(fecha);
CREATE INDEX IF NOT EXISTS idx_kpi_historico_tienda ON kpi_historico(tienda_id);

-- Tabla: reportes
CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL,
  parametros_json JSONB DEFAULT '{}',
  fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  archivo_url TEXT,
  formato VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'excel', 'csv'
  estado VARCHAR(50) DEFAULT 'generado', -- 'generado', 'error', 'en_proceso'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reportes_tipo ON reportes(tipo);
CREATE INDEX IF NOT EXISTS idx_reportes_usuario ON reportes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes(fecha_generacion);

-- =====================================================
-- 9. AUDITORÍA
-- =====================================================

-- Tabla: logs_auditoria
CREATE TABLE IF NOT EXISTS logs_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  accion VARCHAR(255) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  detalles_json JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_auditoria_usuario ON logs_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_auditoria_accion ON logs_auditoria(accion);
CREATE INDEX IF NOT EXISTS idx_logs_auditoria_modulo ON logs_auditoria(modulo);
CREATE INDEX IF NOT EXISTS idx_logs_auditoria_fecha ON logs_auditoria(fecha);

-- =====================================================
-- 10. CHATBOT Y IA
-- =====================================================

-- Tabla: conversaciones_chatbot
CREATE TABLE IF NOT EXISTS conversaciones_chatbot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  sesion_id VARCHAR(100),
  mensaje_usuario TEXT NOT NULL,
  mensaje_bot TEXT NOT NULL,
  categoria_reconocida VARCHAR(100),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario ON conversaciones_chatbot(usuario_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_sesion ON conversaciones_chatbot(sesion_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_fecha ON conversaciones_chatbot(fecha);

-- Tabla: analisis_ia
CREATE TABLE IF NOT EXISTS analisis_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL, -- 'prediccion_ventas', 'analisis_inventario', 'recomendaciones'
  datos_entrada JSONB NOT NULL,
  resultado JSONB NOT NULL,
  confianza DECIMAL(5, 2), -- 0.00 a 1.00
  usuario_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analisis_ia_tipo ON analisis_ia(tipo);
CREATE INDEX IF NOT EXISTS idx_analisis_ia_usuario ON analisis_ia(usuario_id);
CREATE INDEX IF NOT EXISTS idx_analisis_ia_fecha ON analisis_ia(fecha);

-- =====================================================
-- 11. SOLICITUDES DE REGISTRO
-- =====================================================

-- Tabla: solicitudes_registro
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

CREATE INDEX IF NOT EXISTS idx_solicitudes_email ON solicitudes_registro(email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_registro(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes_registro(fecha_solicitud);

-- Desactivar RLS temporalmente (solo para desarrollo)
ALTER TABLE IF EXISTS solicitudes_registro DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS usuarios DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- TRIGGERS: Actualizar updated_at automáticamente
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at (solo si no existe)
DO $$ 
DECLARE
  tabla_nombre TEXT;
  trigger_nombre TEXT;
BEGIN
  FOR tabla_nombre, trigger_nombre IN 
    SELECT 'roles', 'update_roles_updated_at'
    UNION ALL SELECT 'tiendas', 'update_tiendas_updated_at'
    UNION ALL SELECT 'usuarios', 'update_usuarios_updated_at'
    UNION ALL SELECT 'cedis', 'update_cedis_updated_at'
    UNION ALL SELECT 'productos', 'update_productos_updated_at'
    UNION ALL SELECT 'inventario', 'update_inventario_updated_at'
    UNION ALL SELECT 'ventas', 'update_ventas_updated_at'
    UNION ALL SELECT 'devoluciones', 'update_devoluciones_updated_at'
    UNION ALL SELECT 'proveedores', 'update_proveedores_updated_at'
    UNION ALL SELECT 'entregas', 'update_entregas_updated_at'
    UNION ALL SELECT 'competencias', 'update_competencias_updated_at'
    UNION ALL SELECT 'capacitacion_usuarios', 'update_capacitacion_usuarios_updated_at'
    UNION ALL SELECT 'kpis', 'update_kpis_updated_at'
    UNION ALL SELECT 'solicitudes_registro', 'update_solicitudes_registro_updated_at'
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = trigger_nombre
    ) THEN
      EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', trigger_nombre, tabla_nombre);
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- 
-- ✅ Todas las tablas han sido creadas
-- ✅ Todos los índices han sido creados
-- ✅ Todos los triggers han sido configurados
-- ✅ El constraint fk_tiendas_gerente se crea solo si no existe
-- 
-- PRÓXIMOS PASOS:
-- 1. Ejecutar script de datos iniciales (seeds)
-- 2. Configurar Row Level Security (RLS) en Supabase Dashboard
-- 3. Crear políticas de seguridad por rol
-- 
-- =====================================================

