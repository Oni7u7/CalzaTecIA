# Backend - Sistema CalzaTecIA

## 📋 Descripción del Proyecto

Sistema de gestión integral para la cadena de tiendas "Calzando a México" desarrollado para el Logistics Hackathon 2025. Plataforma completa con inteligencia artificial para la gestión de inventario, ventas, capacitación y análisis de datos en tiempo real.

## 🎯 Objetivo del Backend

Implementar una API REST robusta y segura que soporte todas las funcionalidades del frontend, gestionando:

- Autenticación y autorización por roles (incluyendo nuevo rol "Comprador")
- Gestión de usuarios y permisos con jerarquía completa
- Control de inventario multi-tienda con alertas automáticas
- Sistema de ventas y POS completo con múltiples métodos de pago
- Gestión de devoluciones y reembolsos
- Sistema de capacitación y evaluación con seguimiento
- Reportes y KPIs en tiempo real (3 niveles: estratégico, táctico, operativo)
- **Chatbot inteligente con búsqueda de productos por keywords**
- Análisis con IA para predicciones y recomendaciones
- Trazabilidad y auditoría completa
- Gestión completa de productos con múltiples variantes (tallas, colores, materiales)

## 🏗️ Arquitectura Recomendada

### Stack Tecnológico Sugerido

**Opción 1: Node.js + Express + PostgreSQL**
- **Framework**: Express.js o Fastify
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT + bcrypt
- **Validación**: Zod o Joi
- **Documentación**: Swagger/OpenAPI

**Opción 2: Python + FastAPI + PostgreSQL**
- **Framework**: FastAPI
- **Base de datos**: PostgreSQL con SQLAlchemy
- **Autenticación**: JWT + passlib
- **Validación**: Pydantic
- **Documentación**: OpenAPI automática

**Opción 3: .NET + Entity Framework + SQL Server**
- **Framework**: ASP.NET Core
- **Base de datos**: SQL Server
- **Autenticación**: JWT + Identity
- **ORM**: Entity Framework Core

## 📊 Modelo de Datos

### Entidades Principales

#### 1. Usuarios y Roles
```sql
- usuarios (id, nombre, email, password_hash, rol_id, supervisor_id, tienda_id, activo, fecha_ingreso)
- roles (id, nombre, nivel, supervisor_id, permisos_json)
  -- Roles disponibles: Administrador, Director Nacional, Gerente Nacional, 
  -- Gerente Tienda, Supervisor Operaciones, Coordinador Piso, Encargado Bodega,
  -- Encargado Seguridad, Líder Ventas, Asistente Operativo, Comprador
- permisos (id, nombre, descripcion, modulo)
- usuario_permisos (usuario_id, permiso_id)
```

**Nuevo Rol: Comprador**
- Acceso a la tienda (visualizar productos, chat de asistencia, carrito y pedidos)
- No puede acceder a módulos administrativos
- Puede gestionar su perfil y pedidos

#### 2. Tiendas y CEDIS
```sql
- tiendas (id, nombre, ubicacion, direccion, telefono, horario, gerente_id, estado, fecha_apertura)
- tienda_personal (tienda_id, usuario_id, fecha_asignacion)
- cedis (id, nombre, ubicacion, tipo)
```

#### 3. Productos e Inventario
```sql
- productos (id, sku, nombre, categoria, subcategoria, descripcion, marca, precio, costo, 
            imagen_url, imagenes[], tallas_disponibles[], colores_disponibles[], 
            materiales[], especificaciones{}, activo)
- inventario (id, producto_id, tienda_id, cantidad, cantidad_minima, cantidad_maxima,
              ubicacion_fisica, estado)
- movimientos_inventario (id, producto_id, tienda_origen_id, tienda_destino_id, cantidad,
                         tipo, motivo, usuario_id, fecha, referencia_id)
- ajustes_inventario (id, inventario_id, cantidad_anterior, cantidad_nueva, motivo,
                     aprobado_por, aprobado_fecha, estado, created_by)
```

**Características de Productos:**
- Múltiples imágenes por producto
- Variantes: tallas (26-45), colores, materiales
- Categorías: Casual, Formal, Deportivo, Seguridad, Accesorios
- Búsqueda full-text en español
- Especificaciones técnicas (JSON)
- Precios y costos con decimales

#### 4. Ventas y POS
```sql
- ventas (id, ticket, fecha, hora, vendedor_id, tienda_id, cliente_id, subtotal, iva, 
         descuento, total, metodo_pago, estado, notas)
  -- Métodos de pago: efectivo, tarjeta_debito, tarjeta_credito, transferencia
  -- Estados: completada, cancelada, reembolsada
- venta_items (id, venta_id, producto_id, cantidad, precio_unitario, subtotal, talla, color)
- tickets (id, venta_id, contenido_json, fecha_generacion)
```

**Características del POS:**
- Cálculo automático de IVA (16%)
- Descuentos aplicables
- Múltiples métodos de pago
- Generación automática de tickets
- Historial completo de ventas por cliente
- Asociación de ventas con compradores

#### 5. Devoluciones
```sql
- devoluciones (id, venta_id, cliente_id, tipo, motivo, estado, solicitud_fecha, aprobacion_fecha, resuelto_fecha)
- devolucion_items (id, devolucion_id, producto_id, cantidad, estado_producto, foto_url)
- reembolsos (id, devolucion_id, monto, metodo, fecha_procesado, comprobante_url)
```

#### 6. Proveedores y Entregas
```sql
- proveedores (id, razon_social, rfc, contacto, telefono, email, condiciones, calificacion)
- entregas (id, proveedor_id, tienda_id, fecha_programada, fecha_recibida, estado, remision_numero)
- entrega_items (id, entrega_id, producto_id, cantidad_esperada, cantidad_recibida, diferencia, observaciones)
```

#### 7. Capacitación
```sql
- competencias (id, nombre, descripcion, rol_id, obligatoria, orden)
- capacitacion_usuarios (id, usuario_id, competencia_id, estado, progreso, fecha_inicio, fecha_completado)
- capacitacion_comentarios (id, capacitacion_id, supervisor_id, comentario, fecha)
- capacitacion_historial (id, capacitacion_id, accion, fecha, usuario_id, detalles_json)
```

#### 8. Reportes y KPIs
```sql
- kpis (id, nombre, nivel, formula, valor_actual, meta, unidad, frecuencia, fecha_calculo)
- kpi_historico (id, kpi_id, valor, fecha, tienda_id)
- reportes (id, tipo, parametros_json, fecha_generacion, usuario_id, archivo_url)
```

#### 9. Auditoría
```sql
- logs_auditoria (id, usuario_id, accion, modulo, detalles_json, ip_address, fecha)
- sesiones (id, usuario_id, token, ip_address, user_agent, fecha_inicio, fecha_fin, activa)
```

#### 10. Chatbot y IA
```sql
- conversaciones_chatbot (id, usuario_id, sesion_id, mensaje_usuario, mensaje_bot, 
                          categoria_reconocida, fecha)
- analisis_ia (id, tipo, datos_entrada{}, resultado{}, confianza, usuario_id, fecha)
  -- Tipos: 'prediccion_ventas', 'analisis_inventario', 'recomendaciones', 
  --        'analisis_sentimientos', 'prediccion_demanda', 'optimizacion_stock'
```

**Características de IA:**
- Conversaciones de chatbot con historial completo
- Análisis predictivos de ventas e inventario
- Recomendaciones de productos personalizadas
- Análisis de sentimientos en conversaciones
- Predicción de demanda por producto/tienda
- Optimización automática de stock
- Búsqueda semántica con embeddings (futuro)

## 🔐 Autenticación y Autorización

### Endpoints Requeridos

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### JWT Payload
```json
{
  "userId": 1,
  "email": "admin@calzando.com",
  "rol": "admin",
  "tiendaId": null,
  "permisos": ["*"],
  "exp": 1234567890
}
```

### Matriz de Permisos

| Ruta | Admin | Gerente Tienda | Supervisor | Vendedor | Comprador |
|------|-------|----------------|------------|----------|-----------|
| `/api/usuarios/*` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/tiendas/*` | ✅ | Ver propia | ❌ | ❌ | ❌ |
| `/api/inventario/*` | ✅ | Ver propia | Ver propia | Ver propia | ❌ |
| `/api/productos/*` | ✅ | Ver/Editar | Ver | Ver | Ver |
| `/api/ventas/*` | ✅ | Ver propias | Ver propias | Crear | Crear propias |
| `/api/chatbot/*` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/devoluciones/*` | ✅ | Aprobar | Iniciar | Iniciar | Solicitar |
| `/api/reportes/*` | ✅ | Ver propios | Ver propios | ❌ | ❌ |
| `/api/ia/*` | ✅ | Ver | Ver | ❌ | ❌ |

## 📡 Endpoints de la API

### Usuarios
```
GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
POST   /api/usuarios/:id/reset-password
```

### Tiendas
```
GET    /api/tiendas
GET    /api/tiendas/:id
POST   /api/tiendas
PUT    /api/tiendas/:id
GET    /api/tiendas/:id/personal
GET    /api/tiendas/:id/kpis
```

### Inventario
```
GET    /api/inventario
GET    /api/inventario/:tiendaId
GET    /api/inventario/producto/:productoId
POST   /api/inventario/ajuste
POST   /api/inventario/transferencia
GET    /api/inventario/alertas
GET    /api/inventario/movimientos
```

### Productos
```
GET    /api/productos
GET    /api/productos/:id
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id
GET    /api/productos/buscar?q=...
GET    /api/productos/categoria/:categoria
GET    /api/productos/filtros?categoria=...&talla=...&color=...&precio_min=...&precio_max=...
GET    /api/productos/disponibilidad/:id?tienda_id=...
```

**Filtros de Productos:**
- Búsqueda por SKU o nombre (full-text search)
- Filtro por categoría
- Filtro por talla
- Filtro por color
- Rango de precios
- Disponibilidad por tienda
- Stock disponible

### Ventas
```
GET    /api/ventas
GET    /api/ventas/:id
POST   /api/ventas
GET    /api/ventas/tienda/:tiendaId
GET    /api/ventas/vendedor/:vendedorId
GET    /api/ventas/reportes
```

### Devoluciones
```
GET    /api/devoluciones
GET    /api/devoluciones/:id
POST   /api/devoluciones/solicitar
PUT    /api/devoluciones/:id/aprobar
PUT    /api/devoluciones/:id/rechazar
POST   /api/devoluciones/:id/reembolso
GET    /api/devoluciones/cliente/:clienteId
```

### Proveedores y Entregas
```
GET    /api/proveedores
POST   /api/proveedores
GET    /api/entregas
POST   /api/entregas
PUT    /api/entregas/:id/recibir
GET    /api/entregas/programadas
```

### Capacitación
```
GET    /api/capacitacion/usuario/:userId
GET    /api/capacitacion/rol/:rolId
POST   /api/capacitacion/asignar
PUT    /api/capacitacion/:id/progreso
PUT    /api/capacitacion/:id/completar
POST   /api/capacitacion/:id/comentario
```

### Reportes y KPIs
```
GET    /api/kpis
GET    /api/kpis/:id/historico
GET    /api/reportes
POST   /api/reportes/generar
GET    /api/reportes/:id/descargar
```

### IA y Análisis
```
POST   /api/ia/analisis
POST   /api/ia/chat
GET    /api/ia/insights
GET    /api/ia/predicciones
POST   /api/ia/recomendaciones
GET    /api/ia/analisis-sentimientos
POST   /api/ia/prediccion-demanda
POST   /api/ia/optimizacion-stock
```

**Tipos de Análisis IA:**
- **Predicción de Ventas**: Análisis de tendencias y proyecciones
- **Análisis de Inventario**: Optimización de stock y alertas
- **Recomendaciones**: Productos sugeridos basados en historial
- **Análisis de Sentimientos**: Análisis de conversaciones y feedback
- **Predicción de Demanda**: Previsión de demanda por producto/tienda
- **Optimización de Stock**: Sugerencias de reorden y transferencias

### Chatbot Inteligente (Búsqueda de Productos)
```
POST   /api/chatbot/mensaje
POST   /api/chatbot/buscar-productos
POST   /api/chatbot/buscar-por-keywords
GET    /api/chatbot/historial/:usuarioId
GET    /api/chatbot/sesion/:sesionId
POST   /api/chatbot/iniciar-sesion
POST   /api/chatbot/cerrar-sesion
GET    /api/chatbot/estadisticas
```

**Características del Chatbot:**
- Reconocimiento de keywords (categoría, talla, color, precio, inventario, etc.)
- Búsqueda inteligente de productos con NLP
- Respuestas contextuales predefinidas y generadas
- Integración con base de datos de productos en tiempo real
- Historial de conversaciones por sesión y usuario
- Análisis de intención del usuario
- Soporte para múltiples casos de uso:
  - Búsqueda por categoría
  - Búsqueda específica (modelo, color, talla)
  - Preguntas sobre tallas, colores, precios
  - Consultas de inventario en tiempo real
  - Información de envíos y pagos
  - Devoluciones y pedidos
  - Contacto y registro
  - Materiales de productos
  - Recomendaciones personalizadas
  - Comparación de productos

## 🔒 Seguridad

### Implementar

1. **Autenticación**
   - JWT con refresh tokens
   - Password hashing (bcrypt, argon2)
   - Rate limiting en login
   - Límite de intentos fallidos

2. **Autorización**
   - Middleware de verificación de roles
   - Validación de permisos por endpoint
   - Filtrado automático por tienda del usuario

3. **Validación**
   - Validar todos los inputs
   - Sanitización de datos
   - Protección XSS
   - Protección CSRF

4. **Auditoría**
   - Log de todas las acciones críticas
   - IP tracking
   - User agent logging
   - Timestamps en todas las tablas

5. **Headers de Seguridad**
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Strict-Transport-Security: max-age=31536000
   ```

## 📦 Estructura de Carpetas Sugerida

```
backend/
├── src/
│   ├── config/          # Configuración (DB, JWT, etc.)
│   ├── controllers/     # Lógica de controladores
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Middlewares (auth, validación, etc.)
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   ├── validators/      # Validaciones
│   └── types/           # Tipos TypeScript (si aplica)
├── migrations/          # Migraciones de BD
├── seeds/              # Datos de prueba
├── tests/              # Tests
├── .env.example        # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## 🗄️ Variables de Entorno

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/calzando_db

# JWT
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email
SMTP_PASS=tu_password

# Storage (opcional)
STORAGE_TYPE=local
STORAGE_PATH=./uploads
```

## 🧪 Testing

### Tests Recomendados

1. **Unit Tests**
   - Lógica de servicios
   - Validadores
   - Utilidades

2. **Integration Tests**
   - Endpoints de API
   - Flujos completos
   - Autenticación y autorización

3. **E2E Tests**
   - Flujos críticos de negocio
   - Ventas completas
   - Devoluciones

## 📈 Performance

### Optimizaciones Recomendadas

1. **Base de Datos**
   - Índices en campos frecuentemente consultados
   - Queries optimizadas (evitar N+1)
   - Paginación en listados
   - Caché de consultas frecuentes

2. **API**
   - Rate limiting
   - Caché de respuestas
   - Compresión de respuestas
   - Lazy loading de relaciones

3. **Código**
   - Async/await correcto
   - Manejo de errores robusto
   - Logging estructurado

## 🚀 Deployment

### Checklist

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Seeds ejecutados (solo en desarrollo)
- [ ] Tests pasando
- [ ] Documentación actualizada
- [ ] Logs configurados
- [ ] Backup automático configurado
- [ ] Monitoreo configurado

## 🤖 Chatbot Inteligente y Sistema de IA

### Funcionalidad Implementada

El chatbot permite a los usuarios buscar productos mediante conversación natural. El backend debe implementar:

#### 1. Endpoints de Chatbot

**Iniciar Sesión de Chatbot:**
```json
POST /api/chatbot/iniciar-sesion
{
  "usuario_id": "uuid"
}

Response:
{
  "success": true,
  "data": {
    "sesion_id": "sesion-uuid",
    "mensaje_bienvenida": "¡Hola! 👋 Bienvenido(a) a CalzaTecIA..."
  }
}
```

**Enviar Mensaje:**
```json
POST /api/chatbot/mensaje
{
  "sesion_id": "sesion-uuid",
  "usuario_id": "uuid",
  "mensaje": "quiero zapatos negros talla 40"
}

Response:
{
  "success": true,
  "data": {
    "mensaje_bot": "Encontré 5 zapatos negros talla 40...",
    "categoria_reconocida": "busqueda_especifica",
    "productos": [
      {
        "id": "uuid",
        "sku": "SKU-001",
        "nombre": "Zapato Negro Talla 40",
        "precio": 899,
        "stock": 25,
        "imagen_url": "...",
        "tienda_disponible": true
      }
    ],
    "sugerencias": ["Ver más productos", "Filtrar por precio"],
    "intencion": "buscar_producto"
  }
}
```

**Búsqueda Avanzada por Keywords:**
```json
POST /api/chatbot/buscar-productos
{
  "mensaje": "quiero zapatos negros talla 40",
  "usuario_id": "uuid",
  "sesion_id": "sesion-uuid",
  "filtros": {
    "categoria": "Formal",
    "talla": "40",
    "color": "negro",
    "precio_min": 500,
    "precio_max": 2000
  }
}
```

**Historial de Conversaciones:**
```json
GET /api/chatbot/historial/:usuarioId?sesion_id=...&limit=50&offset=0

Response:
{
  "success": true,
  "data": {
    "conversaciones": [
      {
        "id": "uuid",
        "mensaje_usuario": "quiero zapatos negros",
        "mensaje_bot": "Encontré 5 zapatos...",
        "categoria_reconocida": "busqueda_especifica",
        "fecha": "2025-01-15T10:30:00Z"
      }
    ],
    "total": 150,
    "pagina": 1,
    "total_paginas": 3
  }
}
```

**Estadísticas del Chatbot:**
```json
GET /api/chatbot/estadisticas?usuario_id=...&fecha_inicio=...&fecha_fin=...

Response:
{
  "success": true,
  "data": {
    "total_conversaciones": 1250,
    "categorias_mas_usadas": {
      "busqueda_especifica": 450,
      "categorias": 320,
      "precios": 280
    },
    "productos_mas_buscados": [...],
    "satisfaccion_promedio": 4.5
  }
}
```

#### 2. Keywords Soportadas

**Categorías:**
- zapatos, tenis, mujer, hombre, niño, niña, accesorios, categorías, tipos

**Tallas:**
- talla, tallas, número, numeros, medida, medidas, talla 26-45

**Colores:**
- color, colores, negro, blanco, café, marrón, gris, azul, rojo, verde, amarillo, rosa, beige

**Precios:**
- precio, precios, costo, costos, cuánto cuesta, barato, caro, descuento, promoción, oferta

**Inventario:**
- inventario, stock, disponible, disponibilidad, hay, tienen, existencias

**Métodos de Pago:**
- pago, pagos, tarjeta, efectivo, transferencia, paypal, métodos de pago

**Envíos:**
- envío, envios, entrega, entregas, shipping, delivery, domicilio, envío gratis, tiempo de entrega

**Devoluciones:**
- devolución, devoluciones, reembolso, reembolsos, cambio, cambios, devolver, política de devolución

**Pedidos:**
- pedido, pedidos, orden, ordenes, comprar, compra, mi pedido, estado del pedido, seguimiento

**Materiales:**
- material, materiales, cuero, sintético, sintetico, tela, goma, plástico

#### 3. Análisis de IA

**Predicción de Ventas:**
```json
POST /api/ia/prediccion-ventas
{
  "tienda_id": "uuid",
  "periodo": "mensual",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-01-31"
}

Response:
{
  "success": true,
  "data": {
    "prediccion": 125000,
    "confianza": 0.85,
    "tendencia": "creciente",
    "factores": ["temporada", "promociones", "historial"]
  }
}
```

**Recomendaciones de Productos:**
```json
POST /api/ia/recomendaciones
{
  "usuario_id": "uuid",
  "producto_actual_id": "uuid",
  "limite": 5
}

Response:
{
  "success": true,
  "data": {
    "recomendaciones": [
      {
        "producto_id": "uuid",
        "sku": "SKU-002",
        "nombre": "Zapato Similar",
        "razon": "Otros usuarios también compraron",
        "score": 0.92
      }
    ]
  }
}
```

**Análisis de Sentimientos:**
```json
POST /api/ia/analisis-sentimientos
{
  "texto": "Me encantó el producto, muy buena calidad",
  "tipo": "feedback_producto"
}

Response:
{
  "success": true,
  "data": {
    "sentimiento": "positivo",
    "score": 0.95,
    "emociones": ["alegría", "satisfacción"]
  }
}
```

**Predicción de Demanda:**
```json
POST /api/ia/prediccion-demanda
{
  "producto_id": "uuid",
  "tienda_id": "uuid",
  "periodo": "30_dias"
}

Response:
{
  "success": true,
  "data": {
    "demanda_esperada": 150,
    "confianza": 0.88,
    "recomendacion": "reordenar",
    "cantidad_sugerida": 200
  }
}
```

**Optimización de Stock:**
```json
POST /api/ia/optimizacion-stock
{
  "tienda_id": "uuid",
  "categoria": "Deportivos"
}

Response:
{
  "success": true,
  "data": {
    "productos_optimizar": [
      {
        "producto_id": "uuid",
        "stock_actual": 5,
        "stock_optimo": 25,
        "accion": "reordenar",
        "urgencia": "alta"
      }
    ]
  }
}
```

#### 4. Tablas de Base de Datos para IA

**Tabla: `conversaciones_chatbot`**
- Almacena todas las conversaciones del chatbot
- Relación con usuarios para personalización
- Sesiones para agrupar conversaciones
- Categorías reconocidas para análisis

**Tabla: `analisis_ia`**
- Almacena todos los análisis de IA realizados
- Tipos: predicción_ventas, analisis_inventario, recomendaciones, etc.
- Datos de entrada y resultado en JSONB
- Nivel de confianza del análisis

**Tablas Adicionales Recomendadas:**
```sql
-- Recomendaciones de productos
- recomendaciones_productos (id, usuario_id, producto_id, score, razon, fecha)

-- Embeddings para búsqueda semántica (futuro)
- producto_embeddings (id, producto_id, embedding vector, modelo_version)

-- Análisis de sentimientos
- analisis_sentimientos (id, texto, tipo, sentimiento, score, usuario_id, fecha)

-- Predicciones de demanda
- predicciones_demanda (id, producto_id, tienda_id, demanda_esperada, confianza, periodo, fecha)
```

## 📝 Notas Importantes

1. **Compatibilidad con Frontend**
   - El frontend espera respuestas en formato JSON
   - Estructura de errores: `{ success: false, error: "mensaje" }`
   - Estructura de éxito: `{ success: true, data: {...} }`
   - Todos los endpoints deben retornar timestamps en formato ISO

2. **Datos de Demo**
   - El frontend tiene datos simulados en `mockData.ts`
   - Productos de ejemplo: 15 productos con diferentes categorías
   - Replicar estructura similar en backend
   - Generar datos de prueba realistas

3. **Integración con Frontend**
   - URL base: `http://localhost:3001/api`
   - CORS habilitado para `http://localhost:3000`
   - Headers: `Content-Type: application/json`
   - Autenticación: Bearer token en header `Authorization`

4. **Base de Datos**
   - Ver archivo `tablas.md` para todas las tablas y relaciones
   - Todas las tablas usan UUID como primary key
   - Timestamps automáticos con `created_at` y `updated_at`
   - Índices optimizados para búsquedas frecuentes
   - **Tablas de IA**: `conversaciones_chatbot`, `analisis_ia`
   - **Búsqueda Full-Text**: PostgreSQL `to_tsvector` para búsqueda en español
   - **JSONB**: Para campos flexibles (imágenes, especificaciones, datos de IA)
   - **Vector Search**: Preparado para embeddings (futuro con pgvector)

5. **Productos**
   - Búsqueda full-text en español (PostgreSQL `to_tsvector`)
   - Soporte para múltiples imágenes por producto
   - Variantes: tallas, colores, materiales almacenados en JSONB
   - Especificaciones técnicas en formato JSON

## 🎯 Prioridades de Implementación

### Fase 1: Base (Crítico) ⚠️
1. ✅ Autenticación y autorización (JWT)
2. ✅ Usuarios y roles (incluyendo rol "Comprador")
3. ✅ Productos con variantes (tallas, colores, materiales)
4. ✅ Inventario multi-tienda
5. ✅ Búsqueda full-text de productos

### Fase 2: Operaciones (Alto) 🔥
1. ✅ Ventas y POS completo
2. ✅ Chatbot inteligente con búsqueda por keywords
3. ✅ Sistema de carrito de compras
4. ✅ Múltiples métodos de pago
5. ⏳ Devoluciones básicas
6. ⏳ Reportes simples
7. ⏳ KPIs básicos

### Fase 3: Avanzado (Medio)
1. ⏳ Sistema de capacitación completo
2. ⏳ Devoluciones avanzadas
3. ⏳ Proveedores y entregas
4. ⏳ Análisis con IA (predicciones, recomendaciones)
5. ⏳ Integración de chatbot con IA real (OpenAI, Claude, etc.)
6. ⏳ Análisis de sentimientos en conversaciones
7. ⏳ Predicción de demanda por producto/tienda
8. ⏳ Optimización automática de stock con IA

### Fase 4: Optimización (Bajo)
1. ⏳ Caché avanzado de productos y búsquedas
2. ⏳ WebSockets para tiempo real (stock, notificaciones)
3. ⏳ Notificaciones push
4. ⏳ Optimizaciones de performance
5. ⏳ Búsqueda semántica con embeddings (vector search)
6. ⏳ Fine-tuning de modelos de IA
7. ⏳ A/B testing de recomendaciones
8. ⏳ Análisis predictivo avanzado con ML

## 📚 Documentación Adicional

- **Tablas y Relaciones**: Ver `tablas.md` para todas las tablas SQL con relaciones completas
- **Frontend**: Ver `frontend/README.md` para estructura del frontend
- **Integración**: Ver `frontend/INTEGRATION_GUIDE.md` para guía de integración

## 🔮 Funcionalidades Avanzadas de IA (Futuro)

### Integración con Modelos de IA

**Opciones Recomendadas:**
1. **OpenAI API** (GPT-4, GPT-3.5-turbo)
   - Para conversaciones naturales del chatbot
   - Análisis de sentimientos
   - Generación de respuestas contextuales

2. **Claude API** (Anthropic)
   - Alternativa a OpenAI
   - Buen rendimiento en español
   - Análisis de texto avanzado

3. **Modelos Propios** (TensorFlow, PyTorch)
   - Fine-tuning para recomendaciones
   - Predicción de demanda
   - Optimización de stock

4. **Vector Search** (pgvector, Pinecone)
   - Búsqueda semántica de productos
   - Embeddings de productos
   - Recomendaciones basadas en similitud

### Tablas Adicionales para IA Avanzada

```sql
-- Recomendaciones personalizadas
CREATE TABLE recomendaciones_productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  producto_id UUID REFERENCES productos(id),
  producto_recomendado_id UUID REFERENCES productos(id),
  score DECIMAL(5, 4) NOT NULL,
  razon TEXT,
  modelo_usado VARCHAR(100),
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Embeddings para búsqueda semántica
CREATE TABLE producto_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  embedding vector(1536), -- Ajustar según modelo
  modelo_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(producto_id, modelo_version)
);

-- Análisis de sentimientos
CREATE TABLE analisis_sentimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  texto TEXT NOT NULL,
  tipo VARCHAR(50), -- 'feedback_producto', 'conversacion_chatbot', 'comentario'
  sentimiento VARCHAR(20), -- 'positivo', 'negativo', 'neutral'
  score DECIMAL(3, 2) NOT NULL,
  emociones JSONB DEFAULT '[]',
  usuario_id UUID REFERENCES usuarios(id),
  producto_id UUID REFERENCES productos(id),
  fecha TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Predicciones de demanda
CREATE TABLE predicciones_demanda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id),
  tienda_id UUID REFERENCES tiendas(id),
  demanda_esperada INTEGER NOT NULL,
  confianza DECIMAL(5, 2) NOT NULL,
  periodo VARCHAR(50), -- '7_dias', '30_dias', '90_dias'
  factores JSONB DEFAULT '{}',
  fecha_prediccion TIMESTAMP DEFAULT NOW(),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Modelos de IA entrenados
CREATE TABLE modelos_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'recomendaciones', 'prediccion', 'clasificacion'
  version VARCHAR(20) NOT NULL,
  modelo_archivo TEXT, -- URL o path al modelo
  metricas JSONB DEFAULT '{}',
  estado VARCHAR(20) DEFAULT 'entrenando', -- 'entrenando', 'activo', 'deprecado'
  fecha_entrenamiento TIMESTAMP,
  fecha_activacion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Endpoints Adicionales de IA

```
# Recomendaciones
GET    /api/ia/recomendaciones/usuario/:usuarioId
GET    /api/ia/recomendaciones/producto/:productoId
POST   /api/ia/recomendaciones/entrenar

# Búsqueda Semántica
POST   /api/ia/busqueda-semantica
GET    /api/ia/productos-similares/:productoId

# Análisis de Sentimientos
POST   /api/ia/sentimientos/analizar
GET    /api/ia/sentimientos/producto/:productoId
GET    /api/ia/sentimientos/tienda/:tiendaId

# Predicciones
GET    /api/ia/predicciones/demanda/:productoId
GET    /api/ia/predicciones/ventas/:tiendaId
POST   /api/ia/predicciones/entrenar-modelo

# Modelos
GET    /api/ia/modelos
POST   /api/ia/modelos/activar/:modeloId
GET    /api/ia/modelos/:modeloId/metricas
```

### Variables de Entorno para IA

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Claude
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-opus-20240229

# Vector Database
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX_NAME=productos-embeddings

# Modelos Propios
ML_MODEL_PATH=./models
ML_MODEL_VERSION=v1.0.0
```

## 🎨 Características del Sistema

### Frontend Implementado

1. **Interfaz Cliente (Comprador)**
   - Catálogo de productos con filtros avanzados
   - Sistema POS con carrito de compras
   - Chatbot flotante con búsqueda inteligente
   - Búsqueda por SKU, nombre, categoría
   - Filtros por categoría, talla, color, precio
   - Múltiples métodos de pago
   - Historial de compras

2. **Panel Administrador**
   - Dashboard con KPIs en 3 niveles
   - Gestión completa de usuarios y roles
   - Inventario global multi-tienda
   - Análisis IA con predicciones
   - Sistema de capacitación
   - Auditoría y logs

3. **Panel Vendedor**
   - Dashboard operativo
   - Gestión de ventas
   - Control de inventario local
   - Supervisión de equipo

### Funcionalidades Especiales

- **Chatbot Inteligente**: Búsqueda conversacional de productos
- **Búsqueda Full-Text**: Búsqueda rápida en español
- **Diseño Responsive**: Optimizado para móviles y tablets
- **Dark Mode**: Soporte completo para modo oscuro
- **Animaciones**: Interfaz fluida con animaciones suaves

## 📞 Contacto

Para dudas sobre la integración con el frontend, consultar:
- Estructura de datos esperada en `frontend/src/types/index.ts`
- Servicios mock en `frontend/src/services/`
- Guía de integración en `frontend/INTEGRATION_GUIDE.md`
- Componentes del frontend en `frontend/src/components/`

## 📋 Checklist de Implementación Backend

### Autenticación ✅
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/refresh
- [ ] GET /api/auth/me
- [ ] JWT con refresh tokens

### Productos ✅
- [ ] GET /api/productos (con filtros)
- [ ] GET /api/productos/:id
- [ ] POST /api/productos
- [ ] PUT /api/productos/:id
- [ ] DELETE /api/productos/:id
- [ ] GET /api/productos/buscar?q=... (full-text)
- [ ] GET /api/productos/filtros (categoría, talla, color, precio)

### Chatbot 🤖
- [ ] POST /api/chatbot/iniciar-sesion
- [ ] POST /api/chatbot/mensaje
- [ ] POST /api/chatbot/buscar-productos
- [ ] POST /api/chatbot/buscar-por-keywords
- [ ] GET /api/chatbot/historial/:usuarioId
- [ ] GET /api/chatbot/sesion/:sesionId
- [ ] POST /api/chatbot/cerrar-sesion
- [ ] GET /api/chatbot/estadisticas
- [ ] Procesamiento de keywords y NLP
- [ ] Respuestas contextuales
- [ ] Integración con búsqueda de productos
- [ ] Almacenamiento de conversaciones
- [ ] Análisis de intención del usuario

### IA y Análisis 🤖
- [ ] POST /api/ia/analisis
- [ ] POST /api/ia/chat
- [ ] GET /api/ia/insights
- [ ] POST /api/ia/prediccion-ventas
- [ ] POST /api/ia/recomendaciones
- [ ] POST /api/ia/analisis-sentimientos
- [ ] POST /api/ia/prediccion-demanda
- [ ] POST /api/ia/optimizacion-stock
- [ ] Integración con modelos de IA (OpenAI, Claude, etc.)
- [ ] Almacenamiento de análisis en BD
- [ ] Caché de predicciones

### Ventas 💰
- [ ] POST /api/ventas
- [ ] GET /api/ventas/:id
- [ ] GET /api/ventas/cliente/:clienteId
- [ ] Generación de tickets
- [ ] Cálculo de IVA y descuentos

### Inventario 📦
- [ ] GET /api/inventario/:tiendaId
- [ ] GET /api/inventario/producto/:productoId
- [ ] POST /api/inventario/ajuste
- [ ] Alertas de stock bajo

---

**¡Éxito con el desarrollo del backend! 🚀**
