# 🚀 Recomendación de Backend para ZAPATAVIVE

## 📋 Resumen Ejecutivo

**Recomendación Principal:** Node.js + Express + PostgreSQL + Supabase

**Stack Tecnológico:**
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Autenticación:** Supabase Auth + JWT
- **Validación:** Zod
- **Documentación:** Swagger/OpenAPI

## 🎯 ¿Por qué esta stack?

### ✅ Ventajas

1. **Compatibilidad con Frontend**
   - TypeScript nativo
   - Mismo ecosistema (Node.js)
   - Fácil integración con Next.js

2. **Supabase ya está en el proyecto**
   - El archivo `tablas.md` menciona Supabase
   - Autenticación integrada
   - Row Level Security (RLS)
   - API REST automática
   - Realtime subscriptions

3. **Desarrollo Rápido**
   - Prisma para migraciones automáticas
   - TypeScript para type safety
   - Zod para validación de esquemas

4. **Escalabilidad**
   - PostgreSQL robusto
   - Supabase maneja infraestructura
   - Fácil migración a self-hosted

## 📦 Estructura del Proyecto Recomendada

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Configuración Prisma
│   │   ├── supabase.ts      # Cliente Supabase
│   │   └── env.ts           # Variables de entorno
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── productos.controller.ts
│   │   ├── ventas.controller.ts
│   │   ├── inventario.controller.ts
│   │   ├── chatbot.controller.ts
│   │   └── ...
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── productos.service.ts
│   │   ├── ventas.service.ts
│   │   ├── chatbot.service.ts
│   │   └── ...
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── productos.routes.ts
│   │   ├── ventas.routes.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts              # Configuración Express
├── prisma/
│   ├── schema.prisma       # Schema de base de datos
│   └── migrations/         # Migraciones
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuración Inicial

### 1. Package.json

```json
{
  "name": "zapatavive-backend",
  "version": "1.0.0",
  "description": "Backend API para ZAPATAVIVE",
  "main": "dist/app.js",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "lint": "eslint src"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "@supabase/supabase-js": "^2.38.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "zod": "^3.22.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/swagger-ui-express": "^4.1.6",
    "@types/swagger-jsdoc": "^6.0.4",
    "prisma": "^5.7.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0"
  }
}
```

### 2. Variables de Entorno (.env)

```env
# Servidor
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Base de Datos (Directa - opcional)
DATABASE_URL=postgresql://user:password@localhost:5432/zapatavive_db

# JWT
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Usar las tablas definidas en tablas.md
// Ejemplo de estructura:
model Usuario {
  id            String   @id @default(uuid())
  nombre        String
  email         String   @unique
  passwordHash  String   @map("password_hash")
  rolId         String?  @map("rol_id")
  supervisorId  String?  @map("supervisor_id")
  tiendaId      String?  @map("tienda_id")
  activo        Boolean  @default(true)
  fechaIngreso  DateTime @default(now()) @map("fecha_ingreso")
  ultimoAcceso  DateTime? @map("ultimo_acceso")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  rol           Rol?     @relation(fields: [rolId], references: [id])
  supervisor    Usuario? @relation("Supervisor", fields: [supervisorId], references: [id])
  supervisados  Usuario[] @relation("Supervisor")
  tienda        Tienda?  @relation(fields: [tiendaId], references: [id])
  
  @@index([email])
  @@index([rolId])
  @@index([tiendaId])
  @@index([supervisorId])
  @@map("usuarios")
}

// ... más modelos según tablas.md
```

## 🔌 Integración con Frontend

### Endpoints Principales

El frontend espera estos endpoints (según `backend/README.md`):

#### Autenticación
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

#### Productos
```
GET    /api/productos
GET    /api/productos/:id
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id
GET    /api/productos/buscar?q=...
GET    /api/productos/filtros?categoria=...&talla=...&color=...
```

#### Ventas
```
POST   /api/ventas
GET    /api/ventas/:id
GET    /api/ventas/cliente/:clienteId
```

#### Chatbot
```
POST   /api/chatbot/iniciar-sesion
POST   /api/chatbot/mensaje
POST   /api/chatbot/buscar-productos
GET    /api/chatbot/historial/:usuarioId
```

### Formato de Respuesta

El frontend espera respuestas en este formato:

**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error",
  "code": "ERROR_CODE"
}
```

## 🚀 Pasos de Implementación

### Fase 1: Setup Inicial (Día 1-2)

1. **Inicializar proyecto**
   ```bash
   npm init -y
   npm install express cors helmet dotenv
   npm install -D typescript @types/node @types/express tsx
   ```

2. **Configurar TypeScript**
   ```bash
   npx tsc --init
   ```

3. **Configurar Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

4. **Configurar Supabase**
   ```bash
   npm install @supabase/supabase-js
   ```

### Fase 2: Base de Datos (Día 3-4)

1. **Crear schema Prisma** basado en `tablas.md`
2. **Ejecutar migraciones**
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Generar Prisma Client**
   ```bash
   npx prisma generate
   ```

### Fase 3: Autenticación (Día 5-6)

1. Implementar endpoints de autenticación
2. Integrar Supabase Auth
3. Middleware de autenticación
4. JWT tokens

### Fase 4: Endpoints Core (Día 7-10)

1. Productos (CRUD + búsqueda)
2. Inventario
3. Ventas
4. Usuarios

### Fase 5: Funcionalidades Avanzadas (Día 11-15)

1. Chatbot con búsqueda de productos
2. KPIs y reportes
3. Devoluciones
4. Capacitación

## 🔄 Alternativas

### Opción 2: Node.js + Fastify + PostgreSQL

**Ventajas:**
- Más rápido que Express
- Mejor rendimiento
- TypeScript nativo

**Desventajas:**
- Menos recursos/ejemplos
- Comunidad más pequeña

### Opción 3: Python + FastAPI + PostgreSQL

**Ventajas:**
- Excelente para IA/ML
- Documentación automática
- Muy rápido

**Desventajas:**
- Diferente stack del frontend
- Más complejo para TypeScript

### Opción 4: Supabase Directo (Sin Backend Custom)

**Ventajas:**
- Más rápido de implementar
- Menos código
- Realtime automático

**Desventajas:**
- Menos control
- Lógica de negocio limitada
- Funciones serverless más complejas

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## ✅ Checklist de Implementación

- [ ] Setup inicial del proyecto
- [ ] Configuración de Prisma
- [ ] Conexión a Supabase
- [ ] Schema de base de datos
- [ ] Migraciones ejecutadas
- [ ] Autenticación implementada
- [ ] Endpoints de productos
- [ ] Endpoints de ventas
- [ ] Chatbot básico
- [ ] Validación con Zod
- [ ] Manejo de errores
- [ ] Logging configurado
- [ ] Tests básicos
- [ ] Documentación Swagger
- [ ] CORS configurado
- [ ] Rate limiting
- [ ] Variables de entorno

---

**Recomendación Final:** Usar **Node.js + Express + Prisma + Supabase** para máxima compatibilidad con el frontend y desarrollo rápido.


