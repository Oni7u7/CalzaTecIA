# ⚠️ IMPORTANTE: Lee esto primero

## 🚀 Solución Rápida - Ejecuta este script

**Ejecuta el archivo `backend/SETUP_COMPLETO.sql` en el SQL Editor de Supabase**

Este script hace todo automáticamente:
1. ✅ Desactiva RLS en la tabla usuarios
2. ✅ Crea la tabla de solicitudes_registro
3. ✅ Inserta los 3 usuarios base (admin, vendedor, cliente)
4. ✅ Verifica que todo se creó correctamente

## 📋 Pasos

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor**
3. Abre el archivo `backend/SETUP_COMPLETO.sql`
4. Copia TODO el contenido
5. Pégalo en el SQL Editor
6. Haz clic en **Run** o presiona `Ctrl+Enter`

## ✅ Después de ejecutar

Deberías poder:
- ✅ Iniciar sesión con `cliente@calzatec.com` / `1234`
- ✅ Iniciar sesión con `vendedor@calzatec.com` / `1234`
- ✅ Iniciar sesión con `admin@calzatec.com` / `1234`
- ✅ Registrarte y crear solicitudes de registro

## 🔐 Credenciales

- **Admin:** `admin@calzatec.com` / `1234`
- **Vendedor:** `vendedor@calzatec.com` / `1234`
- **Cliente:** `cliente@calzatec.com` / `1234`

## 📝 Notas

- Todos los nuevos registros se crearán como **clientes** por defecto
- Las solicitudes de registro se guardan en `solicitudes_registro` con estado `pendiente`
- Un administrador debe aprobar las solicitudes manualmente desde la base de datos

## 🐛 Si aún no funciona

1. Verifica que ejecutaste el script completo
2. Verifica que los usuarios existan:
   ```sql
   SELECT email, nombre, activo FROM usuarios 
   WHERE email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');
   ```
3. Verifica que RLS esté desactivado:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'usuarios';
   ```
   (Debe mostrar `rowsecurity = false`)


