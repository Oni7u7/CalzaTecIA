# 🛍️ ZAPATAVIVE - Sistema de Gestión Retail con IA

**Sistema integral de gestión para la cadena de tiendas "Calzando a México"**

Desarrollado para el Logistics Hackathon 2025. Plataforma completa con inteligencia artificial para la gestión de inventario, ventas, capacitación y análisis de datos en tiempo real.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Documentación Adicional](#-documentación-adicional)
- [Contribución](#-contribución)

---

## ✨ Características Principales

### 🎯 Funcionalidades Core

- **🔐 Sistema de Autenticación Multi-Rol**
  - Administrador, Gerente, Vendedor, Cliente/Comprador
  - Control de acceso basado en roles (RBAC)
  - Gestión de permisos granular

- **🛒 Sistema POS Completo**
  - Carrito de compras funcional
  - Múltiples métodos de pago (efectivo, tarjeta, transferencia)
  - Cálculo automático de IVA (16%)
  - Generación de tickets de venta
  - Historial de compras por cliente

- **📦 Gestión de Inventario Multi-Tienda**
  - Control de inventario por tienda
  - Alertas de stock bajo
  - Transferencias entre tiendas
  - Ajustes de inventario con aprobación
  - Trazabilidad completa de movimientos

- **🤖 Chatbot Inteligente**
  - Búsqueda conversacional de productos
  - Reconocimiento de keywords (categoría, talla, color, precio)
  - Búsqueda full-text en español
  - Historial de conversaciones
  - Recomendaciones personalizadas

- **📊 KPIs y Reportes en Tiempo Real**
  - KPIs estratégicos, tácticos y operativos
  - Dashboard interactivo con gráficas
  - Reportes de ventas, inventario y desempeño
  - Análisis predictivo con IA

- **👥 Gestión de Usuarios y Capacitación**
  - Gestión completa de usuarios y roles
  - Sistema de capacitación con seguimiento
  - Evaluación de competencias
  - Historial de capacitación

- **🏪 Gestión Multi-Tienda**
  - Administración de múltiples tiendas
  - Control centralizado de inventario
  - Reportes consolidados
  - Gestión de CEDIS

- **🔄 Sistema de Devoluciones**
  - Solicitud de devoluciones
  - Aprobación por roles autorizados
  - Gestión de reembolsos
  - Trazabilidad completa

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **UI Library**: React 19
- **Estilos**: Tailwind CSS 4
- **Componentes**: Radix UI
- **Animaciones**: Framer Motion
- **Gráficas**: Recharts
- **Formularios**: React Hook Form + Zod
- **Base de Datos**: Supabase (PostgreSQL)

### Backend

- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **API**: REST API (Supabase)
- **Seguridad**: Row Level Security (RLS)

### Herramientas de Desarrollo

- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm

---

## 📁 Estructura del Proyecto

```
ZAPATAVIVE/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── app/             # Páginas y rutas
│   │   │   ├── admin/       # Panel administrador
│   │   │   ├── vendedor/   # Panel vendedor
│   │   │   ├── cliente/    # Panel cliente
│   │   │   ├── login/      # Autenticación
│   │   │   └── registro/   # Registro de usuarios
│   │   ├── components/      # Componentes React
│   │   │   ├── admin/      # Componentes admin
│   │   │   ├── vendedor/   # Componentes vendedor
│   │   │   ├── cliente/    # Componentes cliente
│   │   │   ├── ui/         # Componentes UI base
│   │   │   └── animations/ # Animaciones
│   │   ├── lib/            # Utilidades y helpers
│   │   │   └── supabase/   # Cliente Supabase
│   │   ├── hooks/          # Custom hooks
│   │   ├── contexts/       # React contexts
│   │   └── types/          # Tipos TypeScript
│   ├── public/             # Archivos estáticos
│   └── package.json        # Dependencias
│
└── backend/               # Scripts SQL y documentación
    ├── supabase_schema.sql # Esquema completo de BD
    ├── supabase_seeds.sql  # Datos iniciales
    ├── SETUP_COMPLETO.sql  # Script de configuración
    ├── tablas.md           # Documentación de tablas
    └── README.md           # Documentación backend
```

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Cuenta de Supabase** (gratuita)
- **Git** (opcional)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd ZAPATAVIVE
```

### 2. Instalar Dependencias del Frontend

```bash
cd frontend
npm install --legacy-peer-deps
```

> **Nota**: Se usa `--legacy-peer-deps` debido a conflictos de versiones con `react-joyride` y React 19.

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve al **SQL Editor** en tu proyecto de Supabase
3. Ejecuta el script `backend/SETUP_COMPLETO.sql`:
   - Copia todo el contenido del archivo
   - Pégalo en el SQL Editor
   - Haz clic en **Run** o presiona `Ctrl+Enter`

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la carpeta `frontend/`:

```bash
cd frontend
touch .env.local
```

Agrega las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Puedes encontrar estas credenciales en:
- Supabase Dashboard → Settings → API

---

## ⚙️ Configuración

### Configurar Base de Datos

1. **Ejecutar Scripts SQL**:
   - Ejecuta `backend/SETUP_COMPLETO.sql` en Supabase SQL Editor
   - Esto creará todas las tablas necesarias
   - Insertará usuarios de prueba

2. **Verificar Instalación**:
   ```sql
   SELECT email, nombre, activo FROM usuarios 
   WHERE email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');
   ```

### Usuarios de Prueba

Después de ejecutar el script SQL, puedes usar estas credenciales:

- **Administrador**: 
  - Email: `admin@calzatec.com`
  - Password: `1234`

- **Vendedor**: 
  - Email: `vendedor@calzatec.com`
  - Password: `1234`

- **Cliente**: 
  - Email: `cliente@calzatec.com`
  - Password: `1234`

---

## 🎮 Uso

### Iniciar el Servidor de Desarrollo

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación
npm run start        # Inicia servidor de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

### Navegación en la Aplicación

- **Login**: `/login` - Iniciar sesión
- **Registro**: `/registro` - Registro de nuevos usuarios
- **Panel Cliente**: `/cliente` - Catálogo y POS
- **Panel Vendedor**: `/vendedor` - Dashboard operativo
- **Panel Admin**: `/admin` - Dashboard administrativo

---

## 📊 Estado del Proyecto

### ✅ Completado

- **Frontend**: 95% completo
  - ✅ Todas las páginas implementadas
  - ✅ Componentes UI completos
  - ✅ Sistema de autenticación (localStorage)
  - ✅ Funcionalidades con datos mock
  - ✅ Diseño responsive
  - ✅ Dark mode
  - ✅ Animaciones y transiciones

- **Backend**: 30% completo
  - ✅ Esquema de base de datos completo
  - ✅ Scripts SQL listos
  - ✅ Documentación completa
  - ⚠️ Pendiente: Integración con Supabase

### ⚠️ En Progreso

- Integración frontend-backend con Supabase
- Conexión de datos reales
- Autenticación con Supabase Auth

### 🔜 Pendiente

- Tests automatizados
- Optimizaciones de performance
- Funcionalidades avanzadas de IA
- Búsqueda semántica con embeddings

---

## 📚 Documentación Adicional

### Documentación del Proyecto

- **Estado del Proyecto**: `ESTADO_PROYECTO.md` - Estado detallado del proyecto
- **Backend README**: `backend/README.md` - Especificación completa del backend
- **Tablas de BD**: `backend/tablas.md` - Esquema completo de base de datos

### Guías de Configuración

- **Configuración Supabase**: `backend/CONFIGURAR_SUPABASE.md`
- **Instrucciones Paso a Paso**: `backend/INSTRUCCIONES_PASO_A_PASO.md`
- **Configurar Credenciales**: `frontend/CONFIGURAR_CREDENCIALES.md`
- **Integración Supabase**: `frontend/INTEGRACION_SUPABASE.md`

### Scripts SQL Importantes

- **Setup Completo**: `backend/SETUP_COMPLETO.sql` - Script principal de configuración
- **Esquema Completo**: `backend/supabase_schema.sql` - Todas las tablas
- **Datos Iniciales**: `backend/supabase_seeds.sql` - Datos de prueba

---

## 🏗️ Arquitectura

### Frontend

El frontend está construido con **Next.js 16** usando el **App Router**, lo que permite:

- **Server Components**: Renderizado en el servidor para mejor performance
- **Client Components**: Interactividad en el cliente
- **Rutas Dinámicas**: Sistema de rutas flexible
- **API Routes**: Endpoints para integración

### Backend

El backend utiliza **Supabase** como BaaS (Backend as a Service):

- **PostgreSQL**: Base de datos relacional
- **Supabase Auth**: Autenticación y autorización
- **Row Level Security (RLS)**: Seguridad a nivel de fila
- **REST API**: API automática generada por Supabase
- **Realtime**: Actualizaciones en tiempo real

---

## 🔐 Seguridad

### Implementaciones de Seguridad

- **Autenticación**: JWT tokens con Supabase Auth
- **Autorización**: Control de acceso basado en roles (RBAC)
- **Row Level Security**: Políticas de seguridad en base de datos
- **Validación**: Validación de datos con Zod
- **Sanitización**: Protección contra XSS y SQL injection

---

## 🧪 Testing

### Pruebas Manuales

Actualmente el proyecto utiliza datos mock para pruebas. Para probar:

1. Inicia sesión con usuarios de prueba
2. Navega por las diferentes secciones
3. Prueba las funcionalidades principales

### Pruebas Automatizadas

⚠️ **Pendiente**: Implementar tests unitarios y de integración

---

## 🚀 Deployment

### Preparación para Producción

1. **Configurar Variables de Entorno**:
   - Actualizar `.env.local` con credenciales de producción
   - Configurar URLs de producción

2. **Construir la Aplicación**:
   ```bash
   npm run build
   ```

3. **Desplegar**:
   - **Vercel** (recomendado para Next.js)
   - **Netlify**
   - **AWS Amplify**
   - Otros servicios de hosting

### Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Scripts SQL ejecutados
- [ ] Build exitoso
- [ ] Tests pasando (cuando estén implementados)
- [ ] Documentación actualizada

---

## 🤝 Contribución

### Cómo Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar TypeScript para todo el código
- Seguir las convenciones de Next.js
- Comentar código complejo
- Mantener componentes pequeños y reutilizables

---

## 📝 Licencia

Este proyecto fue desarrollado para el **Logistics Hackathon 2025**.

---

## 👥 Autores

Desarrollado para la cadena de tiendas **"Calzando a México"**

---

## 🙏 Agradecimientos

- **Supabase** - Por la plataforma BaaS
- **Next.js Team** - Por el framework
- **Radix UI** - Por los componentes accesibles
- **Comunidad Open Source** - Por las herramientas utilizadas

---

## 📞 Soporte

Para dudas o problemas:

1. Revisa la documentación en `backend/` y `frontend/`
2. Consulta `ESTADO_PROYECTO.md` para el estado actual
3. Revisa los archivos de configuración y guías

---

## 🎯 Roadmap

### Corto Plazo
- [ ] Integración completa con Supabase
- [ ] Conexión de datos reales
- [ ] Autenticación con Supabase Auth
- [ ] Pruebas end-to-end

### Mediano Plazo
- [ ] Tests automatizados
- [ ] Optimizaciones de performance
- [ ] Funcionalidades avanzadas de IA
- [ ] Búsqueda semántica

### Largo Plazo
- [ ] Aplicación móvil
- [ ] Integración con servicios de pago
- [ ] Análisis predictivo avanzado
- [ ] Machine Learning para recomendaciones

---

**Última actualización**: Enero 2025

---

<div align="center">

**Hecho con ❤️ para Calzando a México**

</div>

