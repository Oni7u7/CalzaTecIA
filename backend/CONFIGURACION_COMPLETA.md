# 🚀 Configuración Completa Frontend y Backend

## 📋 Resumen

Este documento te guía para configurar completamente el frontend y backend para que funcionen correctamente con los 3 usuarios base.

## ✅ Pasos de Configuración

### 1️⃣ Ejecutar Script de Tablas (Backend)

1. Ve a tu proyecto en **Supabase Dashboard**
2. Abre el **SQL Editor**
3. Copia y pega todo el contenido de `SCRIPT_FINAL_COMPLETO.sql`
4. Ejecuta el script (botón "Run")
5. Verifica que no haya errores

**Este script:**
- ✅ Crea todas las tablas necesarias
- ✅ Corrige automáticamente la columna `numero_ticket` → `ticket`
- ✅ Crea índices y constraints
- ✅ Configura triggers
- ✅ Desactiva RLS temporalmente

### 2️⃣ Ejecutar Script de Usuarios (Backend)

1. En el mismo **SQL Editor** de Supabase
2. Copia y pega todo el contenido de `INSERTAR_USUARIOS_BASE.sql`
3. Ejecuta el script (botón "Run")
4. Verifica que los usuarios se crearon correctamente

**Este script:**
- ✅ Crea los roles: `administrador`, `gerente_tienda`, `asistente_operativo`
- ✅ Inserta los 3 usuarios base
- ✅ Muestra una tabla de verificación

### 3️⃣ Verificar Configuración del Frontend

El frontend ya está configurado correctamente:

- ✅ **Mapeo de roles** en `frontend/src/lib/auth.ts`:
  - `administrador` → `admin` → `/admin`
  - `gerente_tienda` → `vendedor` → `/vendedor`
  - `asistente_operativo` → `cliente` → `/cliente`

- ✅ **Rutas protegidas** con `ProtectedRoute`:
  - `/admin` requiere rol `admin`
  - `/vendedor` requiere rol `vendedor`
  - `/cliente` requiere rol `cliente`

- ✅ **Login** redirige automáticamente según el rol

## 🔐 Credenciales de Acceso

### 🔵 Administrador
```
Email: admin@calzatec.com
Password: 1234
Ruta: /admin
Acceso: Panel de administración completo
```

### 🟢 Vendedor (Gerente de Tienda)
```
Email: vendedor@calzatec.com
Password: 1234
Ruta: /vendedor
Acceso: Gestión de ventas e inventario
```

### 🟠 Cliente (Asistente de Ventas)
```
Email: cliente@calzatec.com
Password: 1234
Ruta: /cliente
Acceso: Catálogo de productos y compras
```

## 🧪 Pruebas

### Probar Login

1. Abre tu aplicación frontend
2. Ve a la página de login (`/login`)
3. Prueba cada una de las credenciales:

**Admin:**
- Email: `admin@calzatec.com`
- Password: `1234`
- Debe redirigir a: `/admin`

**Vendedor:**
- Email: `vendedor@calzatec.com`
- Password: `1234`
- Debe redirigir a: `/vendedor`

**Cliente:**
- Email: `cliente@calzatec.com`
- Password: `1234`
- Debe redirigir a: `/cliente`

## 🔧 Solución de Problemas

### Error: "Usuario no encontrado"
- ✅ Verifica que ejecutaste `INSERTAR_USUARIOS_BASE.sql`
- ✅ Verifica que los emails sean exactamente: `admin@calzatec.com`, `vendedor@calzatec.com`, `cliente@calzatec.com`
- ✅ Ejecuta esta consulta en Supabase para verificar:
```sql
SELECT email, nombre, activo FROM usuarios 
WHERE email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');
```

### Error: "Contraseña incorrecta"
- ✅ Verifica que la contraseña sea exactamente: `1234` (sin espacios)
- ✅ Verifica que el campo `password_hash` en la BD contenga `1234`
- ✅ Ejecuta esta consulta en Supabase:
```sql
SELECT email, password_hash FROM usuarios 
WHERE email = 'admin@calzatec.com';
```

### Error: "Rol no encontrado"
- ✅ Verifica que ejecutaste primero `SCRIPT_FINAL_COMPLETO.sql`
- ✅ Verifica que los roles se crearon:
```sql
SELECT nombre FROM roles 
WHERE nombre IN ('administrador', 'gerente_tienda', 'asistente_operativo');
```

### Usuario no redirige a la ruta correcta
- ✅ Verifica que el mapeo de roles en `frontend/src/lib/auth.ts` esté correcto
- ✅ Verifica que el rol en la BD coincida con el mapeo:
```sql
SELECT u.email, r.nombre as rol_nombre 
FROM usuarios u 
LEFT JOIN roles r ON u.rol_id = r.id 
WHERE u.email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');
```

### Error de conexión a Supabase
- ✅ Verifica que las variables de entorno estén configuradas en `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_api_key
```

## 📝 Archivos Creados

1. **`SCRIPT_FINAL_COMPLETO.sql`** - Script completo de tablas (corregido)
2. **`INSERTAR_USUARIOS_BASE.sql`** - Script para insertar usuarios base
3. **`INSTRUCCIONES_USUARIOS.md`** - Instrucciones detalladas
4. **`CONFIGURACION_COMPLETA.md`** - Este documento

## 🎉 ¡Listo!

Una vez completados estos pasos, deberías poder:

- ✅ Iniciar sesión con cualquiera de los 3 usuarios
- ✅ Acceder a las 3 diferentes ventanas (Admin, Vendedor, Cliente)
- ✅ Ver el contenido específico de cada rol
- ✅ Navegar entre las diferentes secciones

## 📌 Notas Importantes

- ⚠️ **Seguridad:** Las contraseñas están en texto plano (`1234`) solo para desarrollo. En producción, deben estar hasheadas.
- ⚠️ **RLS:** El script desactiva RLS temporalmente. En producción, configura las políticas de seguridad correctamente.
- ✅ **Idempotente:** Puedes ejecutar los scripts múltiples veces sin problemas.

## 🚀 Próximos Pasos

1. Configurar Row Level Security (RLS) en Supabase
2. Crear políticas de seguridad por rol
3. Implementar hash de contraseñas (bcrypt)
4. Agregar más usuarios según necesidad
5. Configurar variables de entorno para producción


