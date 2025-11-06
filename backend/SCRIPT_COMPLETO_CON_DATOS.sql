-- =====================================================
-- Script SQL COMPLETO: Borrar, Crear e Insertar Datos
-- Sistema ZAPATAVIVE / CalzaTecIA
-- =====================================================
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Abre el SQL Editor
-- 3. Copia y pega todo este script
-- 4. Ejecuta el script (botón "Run")
-- 
-- IMPORTANTE: Este script BORRARÁ todas las tablas y datos existentes
-- Luego creará todo desde cero con datos de ejemplo
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- PASO 1: ELIMINAR TODAS LAS TABLAS (en orden inverso)
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

-- =====================================================
-- PASO 2: CREAR TODAS LAS TABLAS
-- =====================================================

-- Tabla: roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  nivel INTEGER NOT NULL,
  supervisor_rol_id UUID REFERENCES roles(id),
  descripcion TEXT,
  permisos JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_roles_nivel ON roles(nivel);

-- Tabla: tiendas
CREATE TABLE tiendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(255),
  horario TEXT,
  gerente_id UUID,
  estado VARCHAR(50) DEFAULT 'activa' CHECK (estado IN ('activa', 'inactiva', 'mantenimiento', 'cerrada')),
  fecha_apertura DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_codigo_format CHECK (codigo ~* '^[A-Z0-9-]+$'),
  CONSTRAINT chk_nombre_length CHECK (char_length(nombre) >= 3),
  CONSTRAINT chk_email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_tiendas_codigo ON tiendas(codigo);
CREATE INDEX idx_tiendas_estado ON tiendas(estado);

-- Tabla: usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol_id UUID REFERENCES roles(id) NOT NULL,
  supervisor_id UUID REFERENCES usuarios(id),
  tienda_id UUID REFERENCES tiendas(id),
  activo BOOLEAN DEFAULT true,
  fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_password_length CHECK (char_length(password_hash) >= 4),
  CONSTRAINT chk_nombre_length CHECK (char_length(nombre) >= 3)
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX idx_usuarios_tienda_id ON usuarios(tienda_id);
CREATE INDEX idx_usuarios_supervisor_id ON usuarios(supervisor_id);

-- Agregar foreign key de gerente_id en tiendas
ALTER TABLE tiendas 
ADD CONSTRAINT fk_tiendas_gerente 
FOREIGN KEY (gerente_id) REFERENCES usuarios(id);

CREATE INDEX idx_tiendas_gerente ON tiendas(gerente_id);

-- Tabla: permisos
CREATE TABLE permisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  modulo VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_permisos_modulo ON permisos(modulo);

-- Tabla: usuario_permisos
CREATE TABLE usuario_permisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, permiso_id)
);

CREATE INDEX idx_usuario_permisos_usuario ON usuario_permisos(usuario_id);
CREATE INDEX idx_usuario_permisos_permiso ON usuario_permisos(permiso_id);

-- Tabla: sesiones
CREATE TABLE sesiones (
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

CREATE INDEX idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX idx_sesiones_token ON sesiones(token);
CREATE INDEX idx_sesiones_activa ON sesiones(activa);

-- Tabla: tienda_personal
CREATE TABLE tienda_personal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tienda_id, usuario_id)
);

CREATE INDEX idx_tienda_personal_tienda ON tienda_personal(tienda_id);
CREATE INDEX idx_tienda_personal_usuario ON tienda_personal(usuario_id);

-- Tabla: cedis
CREATE TABLE cedis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  direccion TEXT,
  telefono VARCHAR(20),
  tipo VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cedis_codigo ON cedis(codigo);
CREATE INDEX idx_cedis_tipo ON cedis(tipo);

-- Tabla: productos
CREATE TABLE productos (
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

CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_nombre_fts ON productos USING gin(to_tsvector('spanish', nombre));

-- Tabla: inventario
CREATE TABLE inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 0 NOT NULL,
  cantidad_minima INTEGER DEFAULT 0,
  cantidad_maxima INTEGER DEFAULT 0,
  ubicacion_fisica VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'disponible',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(producto_id, tienda_id)
);

CREATE INDEX idx_inventario_producto ON inventario(producto_id);
CREATE INDEX idx_inventario_tienda ON inventario(tienda_id);
CREATE INDEX idx_inventario_estado ON inventario(estado);
CREATE INDEX idx_inventario_cantidad ON inventario(cantidad);

-- Tabla: movimientos_inventario
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id),
  tienda_origen_id UUID REFERENCES tiendas(id),
  tienda_destino_id UUID REFERENCES tiendas(id),
  cantidad INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  motivo TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referencia_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_tienda_origen ON movimientos_inventario(tienda_origen_id);
CREATE INDEX idx_movimientos_tienda_destino ON movimientos_inventario(tienda_destino_id);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);

-- Tabla: ajustes_inventario
CREATE TABLE ajustes_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventario_id UUID REFERENCES inventario(id) ON DELETE CASCADE,
  cantidad_anterior INTEGER NOT NULL,
  cantidad_nueva INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  aprobado_por UUID REFERENCES usuarios(id),
  aprobado_fecha TIMESTAMP WITH TIME ZONE,
  estado VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES usuarios(id)
);

CREATE INDEX idx_ajustes_inventario ON ajustes_inventario(inventario_id);
CREATE INDEX idx_ajustes_estado ON ajustes_inventario(estado);

-- Tabla: ventas
CREATE TABLE ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket VARCHAR(50) UNIQUE NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  vendedor_id UUID REFERENCES usuarios(id),
  tienda_id UUID REFERENCES tiendas(id),
  cliente_id UUID REFERENCES usuarios(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  estado VARCHAR(50) DEFAULT 'completada',
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ventas_ticket ON ventas(ticket);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_vendedor ON ventas(vendedor_id);
CREATE INDEX idx_ventas_tienda ON ventas(tienda_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_estado ON ventas(estado);

-- Tabla: venta_items
CREATE TABLE venta_items (
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

CREATE INDEX idx_venta_items_venta ON venta_items(venta_id);
CREATE INDEX idx_venta_items_producto ON venta_items(producto_id);

-- Tabla: tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  contenido_json JSONB NOT NULL,
  formato VARCHAR(50) DEFAULT 'pdf',
  fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  url_archivo TEXT
);

CREATE INDEX idx_tickets_venta ON tickets(venta_id);

-- Tabla: devoluciones
CREATE TABLE devoluciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id),
  cliente_id UUID REFERENCES usuarios(id),
  tipo VARCHAR(50) NOT NULL,
  motivo TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'solicitada',
  solicitud_fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprobacion_fecha TIMESTAMP WITH TIME ZONE,
  aprobado_por UUID REFERENCES usuarios(id),
  resuelto_fecha TIMESTAMP WITH TIME ZONE,
  resuelto_por UUID REFERENCES usuarios(id),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_devoluciones_venta ON devoluciones(venta_id);
CREATE INDEX idx_devoluciones_cliente ON devoluciones(cliente_id);
CREATE INDEX idx_devoluciones_estado ON devoluciones(estado);

-- Tabla: devolucion_items
CREATE TABLE devolucion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucion_id UUID REFERENCES devoluciones(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  venta_item_id UUID REFERENCES venta_items(id),
  cantidad INTEGER NOT NULL,
  estado_producto VARCHAR(50) NOT NULL,
  foto_url TEXT,
  motivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_devolucion_items_devolucion ON devolucion_items(devolucion_id);
CREATE INDEX idx_devolucion_items_producto ON devolucion_items(producto_id);

-- Tabla: reembolsos
CREATE TABLE reembolsos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucion_id UUID REFERENCES devoluciones(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  metodo VARCHAR(50) NOT NULL,
  fecha_procesado TIMESTAMP WITH TIME ZONE,
  procesado_por UUID REFERENCES usuarios(id),
  comprobante_url TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reembolsos_devolucion ON reembolsos(devolucion_id);

-- Tabla: proveedores
CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social VARCHAR(255) NOT NULL,
  rfc VARCHAR(20) UNIQUE,
  contacto VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(255),
  direccion TEXT,
  condiciones TEXT,
  calificacion DECIMAL(3, 2) DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_proveedores_rfc ON proveedores(rfc);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);

-- Tabla: entregas
CREATE TABLE entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id UUID REFERENCES proveedores(id),
  tienda_id UUID REFERENCES tiendas(id),
  cedis_id UUID REFERENCES cedis(id),
  fecha_programada DATE NOT NULL,
  fecha_recibida DATE,
  estado VARCHAR(50) DEFAULT 'programada',
  remision_numero VARCHAR(100),
  recibido_por UUID REFERENCES usuarios(id),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_entregas_proveedor ON entregas(proveedor_id);
CREATE INDEX idx_entregas_tienda ON entregas(tienda_id);
CREATE INDEX idx_entregas_estado ON entregas(estado);
CREATE INDEX idx_entregas_fecha_programada ON entregas(fecha_programada);

-- Tabla: entrega_items
CREATE TABLE entrega_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id UUID REFERENCES entregas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad_esperada INTEGER NOT NULL,
  cantidad_recibida INTEGER DEFAULT 0,
  diferencia INTEGER GENERATED ALWAYS AS (cantidad_recibida - cantidad_esperada) STORED,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_entrega_items_entrega ON entrega_items(entrega_id);
CREATE INDEX idx_entrega_items_producto ON entrega_items(producto_id);

-- Tabla: competencias
CREATE TABLE competencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  rol_id UUID REFERENCES roles(id),
  obligatoria BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_competencias_rol ON competencias(rol_id);
CREATE INDEX idx_competencias_obligatoria ON competencias(obligatoria);

-- Tabla: capacitacion_usuarios
CREATE TABLE capacitacion_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  competencia_id UUID REFERENCES competencias(id) ON DELETE CASCADE,
  estado VARCHAR(50) DEFAULT 'pendiente',
  progreso INTEGER DEFAULT 0,
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_completado TIMESTAMP WITH TIME ZONE,
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  aprobado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, competencia_id)
);

CREATE INDEX idx_capacitacion_usuario ON capacitacion_usuarios(usuario_id);
CREATE INDEX idx_capacitacion_competencia ON capacitacion_usuarios(competencia_id);
CREATE INDEX idx_capacitacion_estado ON capacitacion_usuarios(estado);

-- Tabla: capacitacion_comentarios
CREATE TABLE capacitacion_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES capacitacion_usuarios(id) ON DELETE CASCADE,
  supervisor_id UUID REFERENCES usuarios(id),
  comentario TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_capacitacion_comentarios_capacitacion ON capacitacion_comentarios(capacitacion_id);
CREATE INDEX idx_capacitacion_comentarios_supervisor ON capacitacion_comentarios(supervisor_id);

-- Tabla: capacitacion_historial
CREATE TABLE capacitacion_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES capacitacion_usuarios(id) ON DELETE CASCADE,
  accion VARCHAR(100) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  detalles_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_capacitacion_historial_capacitacion ON capacitacion_historial(capacitacion_id);
CREATE INDEX idx_capacitacion_historial_fecha ON capacitacion_historial(fecha);

-- Tabla: kpis
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  formula TEXT,
  valor_actual DECIMAL(15, 2),
  meta DECIMAL(15, 2),
  unidad VARCHAR(50),
  frecuencia VARCHAR(50),
  fecha_calculo TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kpis_nivel ON kpis(nivel);
CREATE INDEX idx_kpis_frecuencia ON kpis(frecuencia);

-- Tabla: kpi_historico
CREATE TABLE kpi_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  valor DECIMAL(15, 2) NOT NULL,
  fecha DATE NOT NULL,
  tienda_id UUID REFERENCES tiendas(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kpi_historico_kpi ON kpi_historico(kpi_id);
CREATE INDEX idx_kpi_historico_fecha ON kpi_historico(fecha);
CREATE INDEX idx_kpi_historico_tienda ON kpi_historico(tienda_id);

-- Tabla: reportes
CREATE TABLE reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL,
  parametros_json JSONB DEFAULT '{}',
  fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  archivo_url TEXT,
  formato VARCHAR(50) DEFAULT 'pdf',
  estado VARCHAR(50) DEFAULT 'generado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reportes_tipo ON reportes(tipo);
CREATE INDEX idx_reportes_usuario ON reportes(usuario_id);
CREATE INDEX idx_reportes_fecha ON reportes(fecha_generacion);

-- Tabla: logs_auditoria
CREATE TABLE logs_auditoria (
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

CREATE INDEX idx_logs_auditoria_usuario ON logs_auditoria(usuario_id);
CREATE INDEX idx_logs_auditoria_accion ON logs_auditoria(accion);
CREATE INDEX idx_logs_auditoria_modulo ON logs_auditoria(modulo);
CREATE INDEX idx_logs_auditoria_fecha ON logs_auditoria(fecha);

-- Tabla: conversaciones_chatbot
CREATE TABLE conversaciones_chatbot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  sesion_id VARCHAR(100),
  mensaje_usuario TEXT NOT NULL,
  mensaje_bot TEXT NOT NULL,
  categoria_reconocida VARCHAR(100),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversaciones_usuario ON conversaciones_chatbot(usuario_id);
CREATE INDEX idx_conversaciones_sesion ON conversaciones_chatbot(sesion_id);
CREATE INDEX idx_conversaciones_fecha ON conversaciones_chatbot(fecha);

-- Tabla: analisis_ia
CREATE TABLE analisis_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL,
  datos_entrada JSONB NOT NULL,
  resultado JSONB NOT NULL,
  confianza DECIMAL(5, 2),
  usuario_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analisis_ia_tipo ON analisis_ia(tipo);
CREATE INDEX idx_analisis_ia_usuario ON analisis_ia(usuario_id);
CREATE INDEX idx_analisis_ia_fecha ON analisis_ia(fecha);

-- Tabla: solicitudes_registro
CREATE TABLE solicitudes_registro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol_id UUID REFERENCES roles(id) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  aprobado_por UUID REFERENCES usuarios(id),
  fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_aprobacion TIMESTAMP WITH TIME ZONE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_password_length CHECK (char_length(password_hash) >= 4)
);

CREATE INDEX idx_solicitudes_email ON solicitudes_registro(email);
CREATE INDEX idx_solicitudes_estado ON solicitudes_registro(estado);
CREATE INDEX idx_solicitudes_fecha ON solicitudes_registro(fecha_solicitud);
CREATE INDEX idx_solicitudes_rol ON solicitudes_registro(rol_id);

-- Desactivar RLS temporalmente
ALTER TABLE solicitudes_registro DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 3: CREAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tiendas_updated_at BEFORE UPDATE ON tiendas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cedis_updated_at BEFORE UPDATE ON cedis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devoluciones_updated_at BEFORE UPDATE ON devoluciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entregas_updated_at BEFORE UPDATE ON entregas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competencias_updated_at BEFORE UPDATE ON competencias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_capacitacion_usuarios_updated_at BEFORE UPDATE ON capacitacion_usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON kpis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solicitudes_registro_updated_at BEFORE UPDATE ON solicitudes_registro
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIONES PARA REGISTRO Y GESTIÓN DE USUARIOS
-- =====================================================

-- Función para registrar un nuevo usuario (desde solicitud)
CREATE OR REPLACE FUNCTION registrar_usuario(
  p_nombre VARCHAR(255),
  p_email VARCHAR(255),
  p_password_hash VARCHAR(255),
  p_rol_id UUID,
  p_tienda_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_usuario_id UUID;
  v_rol_nombre VARCHAR(100);
BEGIN
  -- Validar que el email no exista
  IF EXISTS (SELECT 1 FROM usuarios WHERE LOWER(email) = LOWER(p_email)) THEN
    RAISE EXCEPTION 'El email % ya está registrado', p_email;
  END IF;

  -- Validar que el rol existe
  SELECT nombre INTO v_rol_nombre FROM roles WHERE id = p_rol_id;
  IF v_rol_nombre IS NULL THEN
    RAISE EXCEPTION 'El rol especificado no existe';
  END IF;

  -- Validar formato de email
  IF p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'El formato del email no es válido';
  END IF;

  -- Validar longitud de contraseña
  IF char_length(p_password_hash) < 4 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 4 caracteres';
  END IF;

  -- Validar longitud de nombre
  IF char_length(p_nombre) < 3 THEN
    RAISE EXCEPTION 'El nombre debe tener al menos 3 caracteres';
  END IF;

  -- Insertar usuario
  INSERT INTO usuarios (nombre, email, password_hash, rol_id, tienda_id, activo, fecha_ingreso)
  VALUES (p_nombre, LOWER(p_email), p_password_hash, p_rol_id, p_tienda_id, true, NOW())
  RETURNING id INTO v_usuario_id;

  -- Registrar en logs de auditoría
  INSERT INTO logs_auditoria (usuario_id, accion, modulo, detalles_json)
  VALUES (v_usuario_id, 'REGISTRO_USUARIO', 'usuarios', 
    jsonb_build_object('rol', v_rol_nombre, 'tienda_id', p_tienda_id));

  RETURN v_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- Función para crear solicitud de registro
CREATE OR REPLACE FUNCTION crear_solicitud_registro(
  p_nombre VARCHAR(255),
  p_email VARCHAR(255),
  p_password_hash VARCHAR(255),
  p_rol_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_solicitud_id UUID;
  v_rol_nombre VARCHAR(100);
BEGIN
  -- Validar que el email no exista en usuarios ni en solicitudes pendientes
  IF EXISTS (SELECT 1 FROM usuarios WHERE LOWER(email) = LOWER(p_email)) THEN
    RAISE EXCEPTION 'El email % ya está registrado', p_email;
  END IF;

  IF EXISTS (SELECT 1 FROM solicitudes_registro WHERE LOWER(email) = LOWER(p_email) AND estado = 'pendiente') THEN
    RAISE EXCEPTION 'Ya existe una solicitud pendiente para el email %', p_email;
  END IF;

  -- Validar que el rol existe
  SELECT nombre INTO v_rol_nombre FROM roles WHERE id = p_rol_id;
  IF v_rol_nombre IS NULL THEN
    RAISE EXCEPTION 'El rol especificado no existe';
  END IF;

  -- Validar formato de email
  IF p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'El formato del email no es válido';
  END IF;

  -- Validar longitud de contraseña
  IF char_length(p_password_hash) < 4 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 4 caracteres';
  END IF;

  -- Validar longitud de nombre
  IF char_length(p_nombre) < 3 THEN
    RAISE EXCEPTION 'El nombre debe tener al menos 3 caracteres';
  END IF;

  -- Insertar solicitud
  INSERT INTO solicitudes_registro (nombre, email, password_hash, rol_id, estado, fecha_solicitud)
  VALUES (p_nombre, LOWER(p_email), p_password_hash, p_rol_id, 'pendiente', NOW())
  RETURNING id INTO v_solicitud_id;

  RETURN v_solicitud_id;
END;
$$ LANGUAGE plpgsql;

-- Función para aprobar solicitud de registro
CREATE OR REPLACE FUNCTION aprobar_solicitud_registro(
  p_solicitud_id UUID,
  p_aprobado_por UUID,
  p_tienda_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_usuario_id UUID;
  v_solicitud RECORD;
BEGIN
  -- Obtener datos de la solicitud
  SELECT * INTO v_solicitud FROM solicitudes_registro WHERE id = p_solicitud_id;
  
  IF v_solicitud IS NULL THEN
    RAISE EXCEPTION 'La solicitud no existe';
  END IF;

  IF v_solicitud.estado != 'pendiente' THEN
    RAISE EXCEPTION 'La solicitud ya fue procesada';
  END IF;

  -- Validar que el aprobador existe
  IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_aprobado_por) THEN
    RAISE EXCEPTION 'El usuario aprobador no existe';
  END IF;

  -- Registrar usuario
  SELECT registrar_usuario(
    v_solicitud.nombre,
    v_solicitud.email,
    v_solicitud.password_hash,
    v_solicitud.rol_id,
    p_tienda_id
  ) INTO v_usuario_id;

  -- Actualizar solicitud
  UPDATE solicitudes_registro
  SET estado = 'aprobada',
      aprobado_por = p_aprobado_por,
      fecha_aprobacion = NOW()
  WHERE id = p_solicitud_id;

  RETURN v_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIONES CRUD PARA TIENDAS
-- =====================================================

-- Función para insertar tienda
CREATE OR REPLACE FUNCTION insertar_tienda(
  p_nombre VARCHAR(255),
  p_codigo VARCHAR(50),
  p_ubicacion VARCHAR(255) DEFAULT NULL,
  p_direccion TEXT DEFAULT NULL,
  p_telefono VARCHAR(20) DEFAULT NULL,
  p_email VARCHAR(255) DEFAULT NULL,
  p_horario TEXT DEFAULT NULL,
  p_estado VARCHAR(50) DEFAULT 'activa',
  p_fecha_apertura DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_tienda_id UUID;
BEGIN
  -- Validar que el código no exista
  IF EXISTS (SELECT 1 FROM tiendas WHERE codigo = UPPER(p_codigo)) THEN
    RAISE EXCEPTION 'El código de tienda % ya existe', p_codigo;
  END IF;

  -- Validar formato de código
  IF p_codigo !~* '^[A-Z0-9-]+$' THEN
    RAISE EXCEPTION 'El código debe contener solo letras mayúsculas, números y guiones';
  END IF;

  -- Validar longitud de nombre
  IF char_length(p_nombre) < 3 THEN
    RAISE EXCEPTION 'El nombre debe tener al menos 3 caracteres';
  END IF;

  -- Validar estado
  IF p_estado NOT IN ('activa', 'inactiva', 'mantenimiento', 'cerrada') THEN
    RAISE EXCEPTION 'El estado debe ser: activa, inactiva, mantenimiento o cerrada';
  END IF;

  -- Validar email si se proporciona
  IF p_email IS NOT NULL AND p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'El formato del email no es válido';
  END IF;

  -- Insertar tienda
  INSERT INTO tiendas (nombre, codigo, ubicacion, direccion, telefono, email, horario, estado, fecha_apertura)
  VALUES (p_nombre, UPPER(p_codigo), p_ubicacion, p_direccion, p_telefono, p_email, p_horario, p_estado, 
    COALESCE(p_fecha_apertura, CURRENT_DATE))
  RETURNING id INTO v_tienda_id;

  RETURN v_tienda_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar tienda
CREATE OR REPLACE FUNCTION actualizar_tienda(
  p_id UUID,
  p_nombre VARCHAR(255) DEFAULT NULL,
  p_ubicacion VARCHAR(255) DEFAULT NULL,
  p_direccion TEXT DEFAULT NULL,
  p_telefono VARCHAR(20) DEFAULT NULL,
  p_email VARCHAR(255) DEFAULT NULL,
  p_horario TEXT DEFAULT NULL,
  p_estado VARCHAR(50) DEFAULT NULL,
  p_gerente_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validar que la tienda existe
  IF NOT EXISTS (SELECT 1 FROM tiendas WHERE id = p_id) THEN
    RAISE EXCEPTION 'La tienda no existe';
  END IF;

  -- Validar email si se proporciona
  IF p_email IS NOT NULL AND p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'El formato del email no es válido';
  END IF;

  -- Validar estado si se proporciona
  IF p_estado IS NOT NULL AND p_estado NOT IN ('activa', 'inactiva', 'mantenimiento', 'cerrada') THEN
    RAISE EXCEPTION 'El estado debe ser: activa, inactiva, mantenimiento o cerrada';
  END IF;

  -- Validar gerente si se proporciona
  IF p_gerente_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_gerente_id) THEN
    RAISE EXCEPTION 'El gerente especificado no existe';
  END IF;

  -- Actualizar tienda
  UPDATE tiendas
  SET nombre = COALESCE(p_nombre, nombre),
      ubicacion = COALESCE(p_ubicacion, ubicacion),
      direccion = COALESCE(p_direccion, direccion),
      telefono = COALESCE(p_telefono, telefono),
      email = COALESCE(p_email, email),
      horario = COALESCE(p_horario, horario),
      estado = COALESCE(p_estado, estado),
      gerente_id = COALESCE(p_gerente_id, gerente_id),
      updated_at = NOW()
  WHERE id = p_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar tienda (soft delete)
CREATE OR REPLACE FUNCTION eliminar_tienda(p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validar que la tienda existe
  IF NOT EXISTS (SELECT 1 FROM tiendas WHERE id = p_id) THEN
    RAISE EXCEPTION 'La tienda no existe';
  END IF;

  -- Soft delete: cambiar estado a cerrada
  UPDATE tiendas
  SET estado = 'cerrada',
      updated_at = NOW()
  WHERE id = p_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 4: INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar roles (Administrador, Moderador, Vendedor, Cliente)
INSERT INTO roles (nombre, nivel, descripcion, permisos) VALUES
  ('administrador', 1, 'Administrador del sistema con acceso completo a todas las funcionalidades', '{"*": true, "usuarios": true, "tiendas": true, "productos": true, "ventas": true, "inventario": true, "reportes": true}'::jsonb),
  ('moderador', 2, 'Moderador con acceso solo para aprobar solicitudes de registro', '{"solicitudes": true, "aprobaciones": true}'::jsonb),
  ('vendedor', 3, 'Vendedor con acceso a ventas, inventario y productos de su tienda', '{"ventas": true, "inventario": true, "productos": true, "clientes": true}'::jsonb),
  ('cliente', 4, 'Cliente con acceso a catálogo de productos y compras', '{"productos": true, "compras": true, "perfil": true}'::jsonb)
ON CONFLICT (nombre) DO UPDATE SET
  descripcion = EXCLUDED.descripcion,
  permisos = EXCLUDED.permisos;

-- Insertar mínimo 15 tiendas con datos completos
INSERT INTO tiendas (nombre, codigo, ubicacion, direccion, telefono, email, horario, estado, fecha_apertura) VALUES
  ('Tienda Principal Centro', 'T001', 'Ciudad de México', 'Av. Principal 123, Col. Centro, CDMX', '5551234567', 't001@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2020-01-15'),
  ('Tienda Polanco', 'T002', 'Ciudad de México', 'Av. Presidente Masaryk 456, Polanco, CDMX', '5551234568', 't002@zapatavive.com', 'Lunes a Sábado: 10:00 - 22:00, Domingo: 11:00 - 21:00', 'activa', '2020-03-20'),
  ('Tienda Santa Fe', 'T003', 'Ciudad de México', 'Centro Comercial Santa Fe, Av. Vasco de Quiroga 3800, CDMX', '5551234569', 't003@zapatavive.com', 'Lunes a Domingo: 10:00 - 22:00', 'activa', '2020-05-10'),
  ('Tienda Insurgentes', 'T004', 'Ciudad de México', 'Av. Insurgentes Sur 1647, Col. San José Insurgentes, CDMX', '5551234570', 't004@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2020-07-15'),
  ('Tienda Coyoacán', 'T005', 'Ciudad de México', 'Av. Francisco Sosa 123, Coyoacán, CDMX', '5551234571', 't005@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2020-09-01'),
  ('Tienda Guadalajara Centro', 'T006', 'Guadalajara, Jalisco', 'Av. Juárez 456, Centro, Guadalajara', '3331234567', 't006@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2021-01-10'),
  ('Tienda Guadalajara Andares', 'T007', 'Guadalajara, Jalisco', 'Centro Comercial Andares, Blv. Puerta de Hierro 5000, Zapopan', '3331234568', 't007@zapatavive.com', 'Lunes a Domingo: 10:00 - 22:00', 'activa', '2021-03-15'),
  ('Tienda Monterrey San Pedro', 'T008', 'Monterrey, Nuevo León', 'Av. Revolución 1000, San Pedro Garza García', '8111234567', 't008@zapatavive.com', 'Lunes a Sábado: 10:00 - 22:00, Domingo: 11:00 - 21:00', 'activa', '2021-05-20'),
  ('Tienda Monterrey Centro', 'T009', 'Monterrey, Nuevo León', 'Av. Constitución 500, Centro, Monterrey', '8111234568', 't009@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2021-07-25'),
  ('Tienda Puebla Centro', 'T010', 'Puebla, Puebla', 'Av. Reforma 789, Centro, Puebla', '2221234567', 't010@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2021-09-30'),
  ('Tienda Querétaro', 'T011', 'Querétaro, Querétaro', 'Av. Constituyentes 200, Centro, Querétaro', '4421234567', 't011@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2022-01-15'),
  ('Tienda León', 'T012', 'León, Guanajuato', 'Blv. López Mateos 1500, Centro, León', '4771234567', 't012@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2022-03-20'),
  ('Tienda Tijuana', 'T013', 'Tijuana, Baja California', 'Av. Revolución 500, Zona Centro, Tijuana', '6641234567', 't013@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2022-05-25'),
  ('Tienda Cancún', 'T014', 'Cancún, Quintana Roo', 'Blv. Kukulcán Km 12.5, Zona Hotelera, Cancún', '9981234567', 't014@zapatavive.com', 'Lunes a Domingo: 10:00 - 22:00', 'activa', '2022-07-30'),
  ('Tienda Mérida', 'T015', 'Mérida, Yucatán', 'Av. Paseo de Montejo 500, Centro, Mérida', '9991234567', 't015@zapatavive.com', 'Lunes a Sábado: 9:00 - 21:00, Domingo: 10:00 - 20:00', 'activa', '2022-09-10')
ON CONFLICT (codigo) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  ubicacion = EXCLUDED.ubicacion,
  direccion = EXCLUDED.direccion,
  telefono = EXCLUDED.telefono,
  email = EXCLUDED.email,
  horario = EXCLUDED.horario,
  estado = EXCLUDED.estado;

-- Insertar usuarios base (Administrador, Moderador, Vendedor, Cliente)
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo, fecha_ingreso) VALUES
  ('Administrador del Sistema', LOWER('admin@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'administrador'), true, NOW()),
  ('Moderador de Solicitudes', LOWER('moderador@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'moderador'), true, NOW()),
  ('Gerente de Tienda', LOWER('vendedor@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, NOW()),
  ('Asistente de Ventas', LOWER('cliente@calzatec.com'), '1234', (SELECT id FROM roles WHERE nombre = 'cliente'), true, NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  rol_id = EXCLUDED.rol_id,
  activo = true,
  email = LOWER(EXCLUDED.email);

-- Asignar vendedor a tienda principal
UPDATE tiendas SET gerente_id = (SELECT id FROM usuarios WHERE email = LOWER('vendedor@calzatec.com')) WHERE codigo = 'T001';

-- Insertar más usuarios de ejemplo con diferentes roles
INSERT INTO usuarios (nombre, email, password_hash, rol_id, tienda_id, activo, fecha_ingreso) VALUES
  ('María González Vendedora', LOWER('maria.gonzalez@zapatavive.com'), '1234', (SELECT id FROM roles WHERE nombre = 'vendedor'), (SELECT id FROM tiendas WHERE codigo = 'T002'), true, NOW()),
  ('Juan Pérez Vendedor', LOWER('juan.perez@zapatavive.com'), '1234', (SELECT id FROM roles WHERE nombre = 'vendedor'), (SELECT id FROM tiendas WHERE codigo = 'T003'), true, NOW()),
  ('Ana Martínez Cliente', LOWER('ana.martinez@zapatavive.com'), '1234', (SELECT id FROM roles WHERE nombre = 'cliente'), NULL, true, NOW()),
  ('Carlos Rodríguez Cliente', LOWER('carlos.rodriguez@zapatavive.com'), '1234', (SELECT id FROM roles WHERE nombre = 'cliente'), NULL, true, NOW()),
  ('Laura Sánchez Vendedora', LOWER('laura.sanchez@zapatavive.com'), '1234', (SELECT id FROM roles WHERE nombre = 'vendedor'), (SELECT id FROM tiendas WHERE codigo = 'T004'), true, NOW()),
  ('Pedro López Cliente', LOWER('pedro.lopez@zapatavive.com'), '1234', (SELECT id FROM roles WHERE nombre = 'cliente'), NULL, true, NOW())
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  rol_id = EXCLUDED.rol_id,
  tienda_id = EXCLUDED.tienda_id,
  activo = true,
  email = LOWER(EXCLUDED.email);

-- Insertar productos
INSERT INTO productos (sku, nombre, categoria, subcategoria, descripcion, marca, precio, costo, activo, tallas_disponibles, colores_disponibles, materiales, especificaciones) VALUES
  ('SKU-001', 'Zapato Casual Negro', 'Casual', 'Zapatos', 'Zapato casual cómodo ideal para uso diario. Material de cuero sintético de alta calidad.', 'Zapatavive', 899.00, 500.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Negro", "Blanco", "Café", "Gris"]'::jsonb, '["Cuero sintético", "Suela de goma"]'::jsonb, '{"peso": "800g", "origen": "México", "garantia": "6 meses"}'::jsonb),
  ('SKU-002', 'Zapato Formal Marrón', 'Formal', 'Zapatos', 'Zapato formal elegante para ocasiones especiales. Cuero genuino italiano.', 'Zapatavive Premium', 1299.00, 800.00, true, '["38", "39", "40", "41", "42", "43", "44"]'::jsonb, '["Marrón", "Negro", "Azul marino"]'::jsonb, '["Cuero genuino", "Suela de cuero"]'::jsonb, '{"peso": "900g", "origen": "Italia", "garantia": "12 meses"}'::jsonb),
  ('SKU-003', 'Tenis Deportivo Running', 'Deportivo', 'Tenis', 'Tenis deportivo para running con tecnología de amortiguación avanzada.', 'Zapatavive Sport', 1199.00, 700.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Negro", "Azul", "Rojo", "Verde"]'::jsonb, '["Malla transpirable", "Suela de EVA"]'::jsonb, '{"peso": "300g", "origen": "México", "garantia": "6 meses", "tecnologia": "Amortiguación Air"}'::jsonb),
  ('SKU-004', 'Bota de Seguridad', 'Seguridad', 'Botas', 'Bota de seguridad industrial con puntera de acero y suela antideslizante.', 'Zapatavive Safety', 1499.00, 900.00, true, '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Negro", "Café"]'::jsonb, '["Cuero resistente", "Puntera de acero", "Suela antideslizante"]'::jsonb, '{"peso": "1200g", "origen": "México", "garantia": "12 meses", "certificacion": "NOM-113-STPS-2009"}'::jsonb),
  ('SKU-005', 'Zapato Casual Blanco', 'Casual', 'Zapatos', 'Zapato casual blanco versátil para cualquier ocasión.', 'Zapatavive', 799.00, 450.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Beige"]'::jsonb, '["Cuero sintético", "Suela de goma"]'::jsonb, '{"peso": "750g", "origen": "México", "garantia": "6 meses"}'::jsonb),
  ('SKU-006', 'Mocasín Clásico', 'Formal', 'Mocasines', 'Mocasín clásico elegante para oficina o eventos formales.', 'Zapatavive Premium', 1099.00, 650.00, true, '["38", "39", "40", "41", "42", "43", "44"]'::jsonb, '["Negro", "Marrón", "Azul marino"]'::jsonb, '["Cuero genuino", "Suela de cuero"]'::jsonb, '{"peso": "850g", "origen": "México", "garantia": "12 meses"}'::jsonb),
  ('SKU-007', 'Tenis Casual', 'Casual', 'Tenis', 'Tenis casual cómodo para uso diario y caminatas.', 'Zapatavive', 999.00, 600.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Negro", "Gris", "Azul"]'::jsonb, '["Malla", "Suela de goma"]'::jsonb, '{"peso": "400g", "origen": "México", "garantia": "6 meses"}'::jsonb),
  ('SKU-008', 'Zapato Oxford Negro', 'Formal', 'Zapatos', 'Zapato Oxford formal en color negro, ideal para trajes y eventos.', 'Zapatavive Premium', 1399.00, 850.00, true, '["38", "39", "40", "41", "42", "43", "44"]'::jsonb, '["Negro"]'::jsonb, '["Cuero genuino", "Suela de cuero"]'::jsonb, '{"peso": "950g", "origen": "Italia", "garantia": "12 meses"}'::jsonb),
  ('SKU-009', 'Bota de Trabajo', 'Seguridad', 'Botas', 'Bota de trabajo resistente para uso industrial y construcción.', 'Zapatavive Safety', 1299.00, 750.00, true, '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Negro", "Café"]'::jsonb, '["Cuero resistente", "Suela antideslizante"]'::jsonb, '{"peso": "1100g", "origen": "México", "garantia": "12 meses"}'::jsonb),
  ('SKU-010', 'Zapato Deportivo Crossfit', 'Deportivo', 'Tenis', 'Zapato deportivo especializado para crossfit y entrenamiento funcional.', 'Zapatavive Sport', 1349.00, 800.00, true, '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Negro", "Rojo", "Azul"]'::jsonb, '["Malla transpirable", "Suela de goma adherente"]'::jsonb, '{"peso": "350g", "origen": "México", "garantia": "6 meses", "tecnologia": "Estabilidad lateral"}'::jsonb),
  ('SKU-TENIS-001', 'Tenis Deportivo Running Premium', 'Deportivo', 'Tenis', 'Tenis deportivo para running con tecnología de amortiguación avanzada. Ideal para corredores y atletas.', 'Zapatavive Sport', 1199.00, 700.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Negro", "Azul", "Rojo", "Verde"]'::jsonb, '["Malla transpirable", "Suela de EVA"]'::jsonb, '{"peso": "300g", "origen": "México", "garantia": "6 meses", "tecnologia": "Amortiguación Air"}'::jsonb),
  ('SKU-TENIS-002', 'Tenis Casual Urbano', 'Casual', 'Tenis', 'Tenis casual cómodo para uso diario y caminatas. Diseño moderno y versátil.', 'Zapatavive', 999.00, 600.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Negro", "Gris", "Azul"]'::jsonb, '["Malla", "Suela de goma"]'::jsonb, '{"peso": "400g", "origen": "México", "garantia": "6 meses"}'::jsonb),
  ('SKU-TENIS-003', 'Tenis Deportivo Crossfit Pro', 'Deportivo', 'Tenis', 'Zapato deportivo especializado para crossfit y entrenamiento funcional. Máxima estabilidad y resistencia.', 'Zapatavive Sport', 1349.00, 800.00, true, '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Negro", "Rojo", "Azul"]'::jsonb, '["Malla transpirable", "Suela de goma adherente"]'::jsonb, '{"peso": "350g", "origen": "México", "garantia": "6 meses", "tecnologia": "Estabilidad lateral"}'::jsonb),
  ('SKU-TENIS-004', 'Tenis Running Premium', 'Deportivo', 'Tenis', 'Tenis running de alta gama con tecnología de última generación. Perfecto para maratonistas y corredores profesionales.', 'Zapatavive Sport Premium', 1599.00, 950.00, true, '["38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Negro", "Azul marino", "Gris"]'::jsonb, '["Malla técnica", "Suela de carbono", "Plantilla ortopédica"]'::jsonb, '{"peso": "280g", "origen": "México", "garantia": "12 meses", "tecnologia": "Amortiguación Pro Max"}'::jsonb),
  ('SKU-TENIS-005', 'Tenis Urbano Moderno', 'Casual', 'Tenis', 'Tenis urbano con estilo moderno. Ideal para el día a día con máximo confort.', 'Zapatavive Urban', 899.00, 550.00, true, '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb, '["Blanco", "Negro", "Beige", "Gris claro"]'::jsonb, '["Cuero sintético", "Suela de goma"]'::jsonb, '{"peso": "450g", "origen": "México", "garantia": "6 meses"}'::jsonb)
ON CONFLICT (sku) DO NOTHING;

-- Insertar inventario para TODOS los productos activos en TODAS las tiendas
DO $$
DECLARE
  tienda_record RECORD;
  producto_record RECORD;
  stock_cantidad INTEGER;
BEGIN
  -- Para cada tienda activa
  FOR tienda_record IN 
    SELECT id, codigo FROM tiendas WHERE estado = 'activa'
  LOOP
    -- Para cada producto activo
    FOR producto_record IN 
      SELECT id, sku, nombre FROM productos WHERE activo = true
    LOOP
      -- Generar stock aleatorio entre 20 y 100 unidades por tienda
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
        tienda_record.id,
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
  END LOOP;
END $$;

-- Insertar CEDIS
INSERT INTO cedis (nombre, codigo, ubicacion, direccion, telefono, tipo) VALUES
  ('CEDIS Principal', 'CEDIS-001', 'Ciudad de México', 'Av. Industrial 1000, Col. Industrial, CDMX', '5550000001', 'principal'),
  ('CEDIS Regional Norte', 'CEDIS-002', 'Estado de México', 'Carretera México-Pachuca Km 25, Ecatepec', '5550000002', 'regional')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar proveedores
INSERT INTO proveedores (razon_social, rfc, contacto, telefono, email, direccion, condiciones, calificacion, activo) VALUES
  ('Calzado Mexicano S.A. de C.V.', 'CME850101ABC', 'Juan Pérez', '5551111111', 'contacto@calzadomexicano.com', 'Av. Industrial 500, Col. Industrial, CDMX', 'Pago a 30 días, entrega en 15 días', 4.5, true),
  ('Zapatos Premium S.A.', 'ZPR900202DEF', 'María González', '5552222222', 'ventas@zapatospremium.com', 'Blvd. Industrial 200, Guadalajara, Jalisco', 'Pago a 45 días, entrega en 20 días', 4.8, true)
ON CONFLICT (rfc) DO NOTHING;

-- Insertar competencias
INSERT INTO competencias (nombre, descripcion, rol_id, obligatoria, orden) VALUES
  ('Atención al Cliente', 'Habilidades para brindar excelente servicio al cliente', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, 1),
  ('Manejo de POS', 'Uso correcto del sistema de punto de venta', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, 2),
  ('Gestión de Inventario', 'Conocimientos sobre control y gestión de inventario', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, 3),
  ('Técnicas de Venta', 'Habilidades para cerrar ventas y aumentar ingresos', (SELECT id FROM roles WHERE nombre = 'vendedor'), true, 4),
  ('Conocimiento de Productos', 'Conocimiento detallado del catálogo de productos', (SELECT id FROM roles WHERE nombre = 'cliente'), false, 1),
  ('Navegación en Catálogo', 'Habilidad para buscar y encontrar productos', (SELECT id FROM roles WHERE nombre = 'cliente'), false, 2)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCIONES PARA INSERTAR USUARIOS DE PRUEBA
-- =====================================================

-- Función para insertar usuario de prueba con rol específico
CREATE OR REPLACE FUNCTION insertar_usuario_prueba(
  p_nombre VARCHAR(255),
  p_email VARCHAR(255),
  p_rol_nombre VARCHAR(100),
  p_password_hash VARCHAR(255) DEFAULT '1234',
  p_tienda_codigo VARCHAR(50) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_usuario_id UUID;
  v_rol_id UUID;
  v_tienda_id UUID;
BEGIN
  -- Obtener ID del rol
  SELECT id INTO v_rol_id FROM roles WHERE nombre = p_rol_nombre;
  IF v_rol_id IS NULL THEN
    RAISE EXCEPTION 'El rol % no existe. Roles disponibles: administrador, vendedor, cliente', p_rol_nombre;
  END IF;

  -- Obtener ID de tienda si se proporciona
  IF p_tienda_codigo IS NOT NULL THEN
    SELECT id INTO v_tienda_id FROM tiendas WHERE codigo = UPPER(p_tienda_codigo);
    IF v_tienda_id IS NULL THEN
      RAISE EXCEPTION 'La tienda con código % no existe', p_tienda_codigo;
    END IF;
  END IF;

  -- Registrar usuario usando la función
  SELECT registrar_usuario(
    p_nombre,
    p_email,
    p_password_hash,
    v_rol_id,
    v_tienda_id
  ) INTO v_usuario_id;

  RETURN v_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EJEMPLOS DE USO DE FUNCIONES
-- =====================================================

-- Ejemplo 1: Crear solicitud de registro como cliente
-- SELECT crear_solicitud_registro(
--   'Nuevo Cliente',
--   'nuevo.cliente@zapatavive.com',
--   'password123',
--   (SELECT id FROM roles WHERE nombre = 'cliente')
-- );

-- Ejemplo 2: Crear solicitud de registro como vendedor
-- SELECT crear_solicitud_registro(
--   'Nuevo Vendedor',
--   'nuevo.vendedor@zapatavive.com',
--   'password123',
--   (SELECT id FROM roles WHERE nombre = 'vendedor')
-- );

-- Ejemplo 3: Aprobar solicitud de registro
-- SELECT aprobar_solicitud_registro(
--   'ID_DE_LA_SOLICITUD',
--   (SELECT id FROM usuarios WHERE email = 'admin@zapatavive.com'),
--   (SELECT id FROM tiendas WHERE codigo = 'T001')
-- );

-- Ejemplo 4: Insertar tienda usando función
-- SELECT insertar_tienda(
--   'Nueva Tienda',
--   'T016',
--   'Ciudad de México',
--   'Av. Nueva 123',
--   '5551234000',
--   't016@zapatavive.com',
--   'Lunes a Sábado: 9:00 - 21:00',
--   'activa',
--   CURRENT_DATE
-- );

-- Ejemplo 5: Insertar usuario de prueba
-- SELECT insertar_usuario_prueba(
--   'Usuario Prueba',
--   'prueba@zapatavive.com',
--   'cliente',
--   '1234',  -- password (opcional, por defecto '1234')
--   NULL     -- tienda_codigo (opcional)
-- );

-- =====================================================
-- PASO 5: VERIFICACIÓN FINAL
-- =====================================================

-- Verificar roles creados
SELECT '=== ROLES DISPONIBLES ===' as verificacion;
SELECT nombre, nivel, descripcion FROM roles ORDER BY nivel;

-- Verificar usuarios creados
SELECT '=== USUARIOS CREADOS ===' as verificacion;
SELECT u.email, u.nombre, r.nombre as rol, t.codigo as tienda, u.activo 
FROM usuarios u 
LEFT JOIN roles r ON u.rol_id = r.id 
LEFT JOIN tiendas t ON u.tienda_id = t.id
ORDER BY r.nivel, u.email;

-- Verificar tiendas creadas
SELECT '=== TIENDAS CREADAS ===' as verificacion;
SELECT codigo, nombre, ubicacion, estado, fecha_apertura 
FROM tiendas 
ORDER BY codigo;

-- Verificar productos con inventario
SELECT '=== PRODUCTOS CON INVENTARIO ===' as verificacion;
SELECT p.sku, p.nombre, p.categoria, p.precio, COALESCE(SUM(i.cantidad), 0) as stock_total
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id AND i.estado = 'disponible'
WHERE p.activo = true
GROUP BY p.id, p.sku, p.nombre, p.categoria, p.precio
ORDER BY p.sku;

-- Verificar resumen
SELECT '=== RESUMEN ===' as verificacion;
SELECT 
  (SELECT COUNT(*) FROM roles) as total_roles,
  (SELECT COUNT(*) FROM usuarios WHERE activo = true) as total_usuarios,
  (SELECT COUNT(*) FROM tiendas WHERE estado = 'activa') as total_tiendas_activas,
  (SELECT COUNT(*) FROM tiendas) as total_tiendas,
  (SELECT COUNT(*) FROM productos WHERE activo = true) as total_productos,
  (SELECT COUNT(*) FROM inventario WHERE estado = 'disponible' AND cantidad > 0) as productos_con_stock,
  (SELECT COALESCE(SUM(cantidad), 0) FROM inventario WHERE estado = 'disponible') as stock_total;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- 
-- Todas las tablas han sido creadas con validaciones CRUD
-- Todos los datos iniciales han sido insertados
-- Mínimo 15 tiendas creadas
-- Funciones para registro de usuarios con selección de rol
-- Funciones CRUD con validaciones para tiendas
-- 
-- CREDENCIALES DE ACCESO:
-- Admin: admin@calzatec.com / 1234
-- Moderador: moderador@calzatec.com / 1234
-- Vendedor: vendedor@calzatec.com / 1234
-- Cliente: cliente@calzatec.com / 1234
-- 
-- ROLES DISPONIBLES:
-- 1. administrador - Acceso completo al sistema
-- 2. moderador - Acceso solo para aprobar solicitudes de registro
-- 3. vendedor - Acceso a ventas, inventario y productos
-- 4. cliente - Acceso a catálogo y compras
-- 
-- FUNCIONES DISPONIBLES:
-- - crear_solicitud_registro(nombre, email, password, rol_id): Crear solicitud de registro
-- - aprobar_solicitud_registro(solicitud_id, aprobado_por, tienda_id): Aprobar solicitud
-- - registrar_usuario(nombre, email, password, rol_id, tienda_id): Registrar usuario directo
-- - insertar_usuario_prueba(nombre, email, password, rol_nombre, tienda_codigo): Insertar usuario de prueba
-- - insertar_tienda(...): Insertar tienda con validaciones
-- - actualizar_tienda(...): Actualizar tienda con validaciones
-- - eliminar_tienda(id): Eliminar tienda (soft delete)
-- 
-- VALIDACIONES IMPLEMENTADAS:
-- - Email único por usuario
-- - Formato de email válido
-- - Contraseña mínimo 4 caracteres
-- - Nombre mínimo 3 caracteres
-- - Un solo rol por usuario (obligatorio)
-- - Código de tienda único
-- - Formato de código de tienda válido
-- - Estado de tienda válido
-- =====================================================


