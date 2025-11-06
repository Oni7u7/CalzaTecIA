# Estructura de Base de Datos - CalzaTecIA

## 📊 Tablas y Relaciones para Supabase

Este documento contiene todas las tablas necesarias para el sistema CalzaTecIA con sus relaciones y campos.

---

## 🔐 1. Autenticación y Usuarios

### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol_id UUID REFERENCES roles(id),
  supervisor_id UUID REFERENCES usuarios(id),
  tienda_id UUID REFERENCES tiendas(id),
  activo BOOLEAN DEFAULT true,
  fecha_ingreso TIMESTAMP DEFAULT NOW(),
  ultimo_acceso TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX idx_usuarios_tienda_id ON usuarios(tienda_id);
CREATE INDEX idx_usuarios_supervisor_id ON usuarios(supervisor_id);
```

### Tabla: `roles`

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  nivel INTEGER NOT NULL,
  supervisor_rol_id UUID REFERENCES roles(id),
  descripcion TEXT,
  permisos JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_roles_nivel ON roles(nivel);
```

### Tabla: `permisos`

```sql
CREATE TABLE permisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  modulo VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permisos_modulo ON permisos(modulo);
```

### Tabla: `usuario_permisos`

```sql
CREATE TABLE usuario_permisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, permiso_id)
);

CREATE INDEX idx_usuario_permisos_usuario ON usuario_permisos(usuario_id);
CREATE INDEX idx_usuario_permisos_permiso ON usuario_permisos(permiso_id);
```

### Tabla: `sesiones`

```sql
CREATE TABLE sesiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  refresh_token TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  fecha_inicio TIMESTAMP DEFAULT NOW(),
  fecha_fin TIMESTAMP,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX idx_sesiones_token ON sesiones(token);
CREATE INDEX idx_sesiones_activa ON sesiones(activa);
```

---

## 🏪 2. Tiendas y CEDIS

### Tabla: `tiendas`

```sql
CREATE TABLE tiendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(255),
  horario TEXT,
  gerente_id UUID REFERENCES usuarios(id),
  estado VARCHAR(50) DEFAULT 'activa',
  fecha_apertura DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tiendas_codigo ON tiendas(codigo);
CREATE INDEX idx_tiendas_gerente ON tiendas(gerente_id);
CREATE INDEX idx_tiendas_estado ON tiendas(estado);
```

### Tabla: `tienda_personal`

```sql
CREATE TABLE tienda_personal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  fecha_fin TIMESTAMP,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tienda_id, usuario_id)
);

CREATE INDEX idx_tienda_personal_tienda ON tienda_personal(tienda_id);
CREATE INDEX idx_tienda_personal_usuario ON tienda_personal(usuario_id);
```

### Tabla: `cedis`

```sql
CREATE TABLE cedis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  direccion TEXT,
  telefono VARCHAR(20),
  tipo VARCHAR(50) NOT NULL, -- 'principal', 'regional', 'distribucion'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cedis_codigo ON cedis(codigo);
CREATE INDEX idx_cedis_tipo ON cedis(tipo);
```

---

## 📦 3. Productos e Inventario

### Tabla: `productos`

```sql
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_nombre ON productos USING gin(to_tsvector('spanish', nombre));
```

### Tabla: `inventario`

```sql
CREATE TABLE inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 0 NOT NULL,
  cantidad_minima INTEGER DEFAULT 0,
  cantidad_maxima INTEGER DEFAULT 0,
  ubicacion_fisica VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'disponible', -- 'disponible', 'reservado', 'dañado', 'devolucion'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(producto_id, tienda_id)
);

CREATE INDEX idx_inventario_producto ON inventario(producto_id);
CREATE INDEX idx_inventario_tienda ON inventario(tienda_id);
CREATE INDEX idx_inventario_estado ON inventario(estado);
CREATE INDEX idx_inventario_cantidad ON inventario(cantidad);
```

### Tabla: `movimientos_inventario`

```sql
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id),
  tienda_origen_id UUID REFERENCES tiendas(id),
  tienda_destino_id UUID REFERENCES tiendas(id),
  cantidad INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'transferencia', 'venta', 'compra', 'ajuste', 'devolucion', 'perdida'
  motivo TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP DEFAULT NOW(),
  referencia_id UUID, -- ID de venta, compra, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_tienda_origen ON movimientos_inventario(tienda_origen_id);
CREATE INDEX idx_movimientos_tienda_destino ON movimientos_inventario(tienda_destino_id);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);
```

### Tabla: `ajustes_inventario`

```sql
CREATE TABLE ajustes_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventario_id UUID REFERENCES inventario(id) ON DELETE CASCADE,
  cantidad_anterior INTEGER NOT NULL,
  cantidad_nueva INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  aprobado_por UUID REFERENCES usuarios(id),
  aprobado_fecha TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado'
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES usuarios(id)
);

CREATE INDEX idx_ajustes_inventario ON ajustes_inventario(inventario_id);
CREATE INDEX idx_ajustes_estado ON ajustes_inventario(estado);
```

---

## 💰 4. Ventas y POS

### Tabla: `ventas`

```sql
CREATE TABLE ventas (
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ventas_ticket ON ventas(ticket);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_vendedor ON ventas(vendedor_id);
CREATE INDEX idx_ventas_tienda ON ventas(tienda_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_estado ON ventas(estado);
```

### Tabla: `venta_items`

```sql
CREATE TABLE venta_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  talla VARCHAR(10),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_venta_items_venta ON venta_items(venta_id);
CREATE INDEX idx_venta_items_producto ON venta_items(producto_id);
```

### Tabla: `tickets`

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  contenido_json JSONB NOT NULL,
  formato VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'html', 'json'
  fecha_generacion TIMESTAMP DEFAULT NOW(),
  url_archivo TEXT
);

CREATE INDEX idx_tickets_venta ON tickets(venta_id);
```

---

## 🔄 5. Devoluciones y Reembolsos

### Tabla: `devoluciones`

```sql
CREATE TABLE devoluciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venta_id UUID REFERENCES ventas(id),
  cliente_id UUID REFERENCES usuarios(id),
  tipo VARCHAR(50) NOT NULL, -- 'devolucion', 'cambio', 'garantia'
  motivo TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'solicitada', -- 'solicitada', 'en_revision', 'aprobada', 'rechazada', 'completada'
  solicitud_fecha TIMESTAMP DEFAULT NOW(),
  aprobacion_fecha TIMESTAMP,
  aprobado_por UUID REFERENCES usuarios(id),
  resuelto_fecha TIMESTAMP,
  resuelto_por UUID REFERENCES usuarios(id),
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_devoluciones_venta ON devoluciones(venta_id);
CREATE INDEX idx_devoluciones_cliente ON devoluciones(cliente_id);
CREATE INDEX idx_devoluciones_estado ON devoluciones(estado);
```

### Tabla: `devolucion_items`

```sql
CREATE TABLE devolucion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucion_id UUID REFERENCES devoluciones(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  venta_item_id UUID REFERENCES venta_items(id),
  cantidad INTEGER NOT NULL,
  estado_producto VARCHAR(50) NOT NULL, -- 'nuevo', 'usado', 'dañado'
  foto_url TEXT,
  motivo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_devolucion_items_devolucion ON devolucion_items(devolucion_id);
CREATE INDEX idx_devolucion_items_producto ON devolucion_items(producto_id);
```

### Tabla: `reembolsos`

```sql
CREATE TABLE reembolsos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devolucion_id UUID REFERENCES devoluciones(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  metodo VARCHAR(50) NOT NULL, -- 'efectivo', 'transferencia', 'tarjeta_original', 'nota_credito'
  fecha_procesado TIMESTAMP,
  procesado_por UUID REFERENCES usuarios(id),
  comprobante_url TEXT,
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reembolsos_devolucion ON reembolsos(devolucion_id);
```

---

## 🚚 6. Proveedores y Entregas

### Tabla: `proveedores`

```sql
CREATE TABLE proveedores (
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_proveedores_rfc ON proveedores(rfc);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);
```

### Tabla: `entregas`

```sql
CREATE TABLE entregas (
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_entregas_proveedor ON entregas(proveedor_id);
CREATE INDEX idx_entregas_tienda ON entregas(tienda_id);
CREATE INDEX idx_entregas_estado ON entregas(estado);
CREATE INDEX idx_entregas_fecha_programada ON entregas(fecha_programada);
```

### Tabla: `entrega_items`

```sql
CREATE TABLE entrega_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id UUID REFERENCES entregas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad_esperada INTEGER NOT NULL,
  cantidad_recibida INTEGER DEFAULT 0,
  diferencia INTEGER GENERATED ALWAYS AS (cantidad_recibida - cantidad_esperada) STORED,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_entrega_items_entrega ON entrega_items(entrega_id);
CREATE INDEX idx_entrega_items_producto ON entrega_items(producto_id);
```

---

## 📚 7. Capacitación

### Tabla: `competencias`

```sql
CREATE TABLE competencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  rol_id UUID REFERENCES roles(id),
  obligatoria BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_competencias_rol ON competencias(rol_id);
CREATE INDEX idx_competencias_obligatoria ON competencias(obligatoria);
```

### Tabla: `capacitacion_usuarios`

```sql
CREATE TABLE capacitacion_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  competencia_id UUID REFERENCES competencias(id) ON DELETE CASCADE,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'en_progreso', 'completada', 'aprobada', 'rechazada'
  progreso INTEGER DEFAULT 0, -- 0 a 100
  fecha_inicio TIMESTAMP,
  fecha_completado TIMESTAMP,
  fecha_aprobacion TIMESTAMP,
  aprobado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, competencia_id)
);

CREATE INDEX idx_capacitacion_usuario ON capacitacion_usuarios(usuario_id);
CREATE INDEX idx_capacitacion_competencia ON capacitacion_usuarios(competencia_id);
CREATE INDEX idx_capacitacion_estado ON capacitacion_usuarios(estado);
```

### Tabla: `capacitacion_comentarios`

```sql
CREATE TABLE capacitacion_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES capacitacion_usuarios(id) ON DELETE CASCADE,
  supervisor_id UUID REFERENCES usuarios(id),
  comentario TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_capacitacion_comentarios_capacitacion ON capacitacion_comentarios(capacitacion_id);
CREATE INDEX idx_capacitacion_comentarios_supervisor ON capacitacion_comentarios(supervisor_id);
```

### Tabla: `capacitacion_historial`

```sql
CREATE TABLE capacitacion_historial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES capacitacion_usuarios(id) ON DELETE CASCADE,
  accion VARCHAR(100) NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  detalles_json JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_capacitacion_historial_capacitacion ON capacitacion_historial(capacitacion_id);
CREATE INDEX idx_capacitacion_historial_fecha ON capacitacion_historial(fecha);
```

---

## 📊 8. Reportes y KPIs

### Tabla: `kpis`

```sql
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  nivel VARCHAR(50) NOT NULL, -- 'estrategico', 'tactico', 'operativo'
  formula TEXT,
  valor_actual DECIMAL(15, 2),
  meta DECIMAL(15, 2),
  unidad VARCHAR(50),
  frecuencia VARCHAR(50), -- 'diaria', 'semanal', 'mensual', 'anual'
  fecha_calculo TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kpis_nivel ON kpis(nivel);
CREATE INDEX idx_kpis_frecuencia ON kpis(frecuencia);
```

### Tabla: `kpi_historico`

```sql
CREATE TABLE kpi_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  valor DECIMAL(15, 2) NOT NULL,
  fecha DATE NOT NULL,
  tienda_id UUID REFERENCES tiendas(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kpi_historico_kpi ON kpi_historico(kpi_id);
CREATE INDEX idx_kpi_historico_fecha ON kpi_historico(fecha);
CREATE INDEX idx_kpi_historico_tienda ON kpi_historico(tienda_id);
```

### Tabla: `reportes`

```sql
CREATE TABLE reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL,
  parametros_json JSONB DEFAULT '{}',
  fecha_generacion TIMESTAMP DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  archivo_url TEXT,
  formato VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'excel', 'csv'
  estado VARCHAR(50) DEFAULT 'generado', -- 'generado', 'error', 'en_proceso'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reportes_tipo ON reportes(tipo);
CREATE INDEX idx_reportes_usuario ON reportes(usuario_id);
CREATE INDEX idx_reportes_fecha ON reportes(fecha_generacion);
```

---

## 🔍 9. Auditoría

### Tabla: `logs_auditoria`

```sql
CREATE TABLE logs_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  accion VARCHAR(255) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  detalles_json JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_auditoria_usuario ON logs_auditoria(usuario_id);
CREATE INDEX idx_logs_auditoria_accion ON logs_auditoria(accion);
CREATE INDEX idx_logs_auditoria_modulo ON logs_auditoria(modulo);
CREATE INDEX idx_logs_auditoria_fecha ON logs_auditoria(fecha);
```

---

## 🤖 10. Chatbot y IA

### Tabla: `conversaciones_chatbot`

```sql
CREATE TABLE conversaciones_chatbot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  sesion_id VARCHAR(100),
  mensaje_usuario TEXT NOT NULL,
  mensaje_bot TEXT NOT NULL,
  categoria_reconocida VARCHAR(100),
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversaciones_usuario ON conversaciones_chatbot(usuario_id);
CREATE INDEX idx_conversaciones_sesion ON conversaciones_chatbot(sesion_id);
CREATE INDEX idx_conversaciones_fecha ON conversaciones_chatbot(fecha);
```

### Tabla: `analisis_ia`

```sql
CREATE TABLE analisis_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(100) NOT NULL, -- 'prediccion_ventas', 'analisis_inventario', 'recomendaciones'
  datos_entrada JSONB NOT NULL,
  resultado JSONB NOT NULL,
  confianza DECIMAL(5, 2), -- 0.00 a 1.00
  usuario_id UUID REFERENCES usuarios(id),
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analisis_ia_tipo ON analisis_ia(tipo);
CREATE INDEX idx_analisis_ia_usuario ON analisis_ia(usuario_id);
CREATE INDEX idx_analisis_ia_fecha ON analisis_ia(fecha);
```

---

## 🔗 Relaciones Principales

```
usuarios
  ├── roles (rol_id)
  ├── usuarios (supervisor_id)
  ├── tiendas (tienda_id)
  └── ventas (vendedor_id, cliente_id)

tiendas
  ├── usuarios (gerente_id)
  ├── inventario (tienda_id)
  ├── ventas (tienda_id)
  └── entregas (tienda_id)

productos
  ├── inventario (producto_id)
  ├── venta_items (producto_id)
  └── entrega_items (producto_id)

ventas
  ├── usuarios (vendedor_id, cliente_id)
  ├── tiendas (tienda_id)
  ├── venta_items (venta_id)
  └── devoluciones (venta_id)

devoluciones
  ├── ventas (venta_id)
  ├── usuarios (cliente_id)
  ├── devolucion_items (devolucion_id)
  └── reembolsos (devolucion_id)
```

---

## 📝 Notas para Supabase

1. **UUIDs**: Todas las tablas usan UUID como ID principal para mejor distribución y seguridad.

2. **Índices**: Se han creado índices en campos frecuentemente consultados para optimizar las queries.

3. **JSONB**: Se usa JSONB para campos flexibles como permisos, imágenes, especificaciones, etc.

4. **Triggers**: Se recomienda crear triggers para:
   - Actualizar `updated_at` automáticamente
   - Calcular totales de ventas
   - Actualizar inventario al completar ventas
   - Generar logs de auditoría automáticamente

5. **Row Level Security (RLS)**: Se debe configurar RLS en todas las tablas para seguridad:
   - Usuarios solo pueden ver sus propios datos (excepto admins)
   - Vendedores solo ven ventas de su tienda
   - Compradores solo ven sus propios pedidos

6. **Foreign Keys**: Todas las relaciones tienen ON DELETE CASCADE o RESTRICT según corresponda.

---

## 🚀 Próximos Pasos

1. Crear las tablas en Supabase usando el SQL proporcionado
2. Configurar Row Level Security (RLS)
3. Crear funciones y triggers necesarios
4. Configurar índices de búsqueda full-text
5. Crear políticas de seguridad por rol
6. Configurar backups automáticos


