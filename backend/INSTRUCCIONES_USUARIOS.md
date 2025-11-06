# 📋 Instrucciones para Configurar Usuarios Base

## 🎯 Objetivo

Configurar los 3 usuarios base del sistema para acceder a las diferentes ventanas (Admin, Vendedor, Cliente).

## 📝 Pasos a Seguir

### 1. Ejecutar Script de Tablas

Primero, ejecuta el script completo de tablas en Supabase:

1. Ve a tu proyecto en **Supabase Dashboard**
2. Abre el **SQL Editor**
3. Copia y pega todo el contenido de `SCRIPT_FINAL_COMPLETO.sql`
4. Ejecuta el script (botón "Run")
5. Verifica que no haya errores

### 2. Ejecutar Script de Usuarios

Luego, ejecuta el script de usuarios:

1. En el mismo **SQL Editor** de Supabase
2. Copia y pega todo el contenido de `INSERTAR_USUARIOS_BASE.sql`
3. Ejecuta el script (botón "Run")
4. Verifica que los usuarios se crearon correctamente

### 3. Verificar Usuarios Creados

El script mostrará una tabla con los usuarios creados. Deberías ver:

| Email | Nombre | Rol | Activo |
|-------|--------|-----|--------|
| admin@calzatec.com | Administrador del Sistema | administrador | true |
| vendedor@calzatec.com | Gerente de Tienda | gerente_tienda | true |
| cliente@calzatec.com | Asistente de Ventas | asistente_operativo | true |

## 🔐 Credenciales de Acceso

### 🔵 Administrador
- **Email:** `admin@calzatec.com`
- **Password:** `1234`
- **Ruta:** `/admin`
- **Acceso:** Panel de administración completo

### 🟢 Vendedor (Gerente de Tienda)
- **Email:** `vendedor@calzatec.com`
- **Password:** `1234`
- **Ruta:** `/vendedor`
- **Acceso:** Gestión de ventas e inventario

### 🟠 Cliente (Asistente de Ventas)
- **Email:** `cliente@calzatec.com`
- **Password:** `1234`
- **Ruta:** `/cliente`
- **Acceso:** Catálogo de productos y compras

## ✅ Verificación

1. Abre tu aplicación frontend
2. Ve a la página de login (`/login`)
3. Prueba cada una de las credenciales
4. Verifica que cada usuario sea redirigido a su ruta correspondiente:
   - Admin → `/admin`
   - Vendedor → `/vendedor`
   - Cliente → `/cliente`

## 🔧 Solución de Problemas

### Error: "Usuario no encontrado"
- Verifica que ejecutaste el script `INSERTAR_USUARIOS_BASE.sql`
- Verifica que los emails sean exactamente: `admin@calzatec.com`, `vendedor@calzatec.com`, `cliente@calzatec.com`

### Error: "Contraseña incorrecta"
- Verifica que la contraseña sea exactamente: `1234` (sin espacios)
- Verifica que el campo `password_hash` en la BD contenga `1234`

### Error: "Rol no encontrado"
- Verifica que ejecutaste primero el script `SCRIPT_FINAL_COMPLETO.sql`
- Verifica que los roles se crearon: `administrador`, `gerente_tienda`, `asistente_operativo`

### Usuario no redirige a la ruta correcta
- Verifica que el mapeo de roles en `frontend/src/lib/auth.ts` esté correcto
- Verifica que el rol en la BD coincida con el mapeo

## 📌 Notas Importantes

- ⚠️ **Seguridad:** Las contraseñas están en texto plano (`1234`) solo para desarrollo. En producción, deben estar hasheadas.
- ⚠️ **RLS:** El script desactiva RLS temporalmente. En producción, configura las políticas de seguridad correctamente.
- ✅ **Idempotente:** Puedes ejecutar el script múltiples veces sin problemas (usa `ON CONFLICT`).

## 🎉 ¡Listo!

Una vez completados estos pasos, deberías poder iniciar sesión con cualquiera de los 3 usuarios y acceder a sus respectivas ventanas.
