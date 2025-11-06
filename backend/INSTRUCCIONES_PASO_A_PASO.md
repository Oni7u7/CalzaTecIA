# 📋 Instrucciones Paso a Paso

## ⚠️ IMPORTANTE: Sigue estos pasos en orden

### Paso 1: Ejecutar Script SQL en Supabase

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Haz clic en **New Query**
5. Abre el archivo `backend/SETUP_SIMPLE.sql` desde tu proyecto
6. **Copia TODO el contenido** del archivo
7. Pégalo en el SQL Editor de Supabase
8. Haz clic en **Run** (o presiona `Ctrl+Enter` / `Cmd+Enter`)

### Paso 2: Verificar que se ejecutó correctamente

Deberías ver en los resultados:
- Un mensaje que dice "=== USUARIOS CREADOS ==="
- Una tabla con 3 usuarios (admin, vendedor, cliente)
- Un mensaje que dice "=== TABLA SOLICITUDES ==="
- Un mensaje que dice "Tabla solicitudes_registro creada correctamente"

### Paso 3: Probar el Login

1. Ve a tu aplicación: `http://localhost:3000/login`
2. Intenta iniciar sesión con:
   - Email: `cliente@calzatec.com`
   - Password: `1234`

Si funciona, deberías ser redirigido a `/cliente`

### Paso 4: Probar el Registro

1. Ve a: `http://localhost:3000/registro`
2. Completa el formulario:
   - Nombre: Tu nombre
   - Email: Tu email
   - Contraseña: Tu contraseña
   - Confirmar Contraseña: La misma contraseña
3. Haz clic en "Enviar Solicitud"

Deberías ver un mensaje de éxito que dice:
"En breve te aceptaremos la solicitud y podrás iniciar sesión."

## 🔍 Verificación Manual

Si quieres verificar manualmente que todo está bien, ejecuta estas consultas en el SQL Editor:

### Verificar usuarios:
```sql
SELECT email, nombre, activo, password_hash 
FROM usuarios 
WHERE email IN ('admin@calzatec.com', 'vendedor@calzatec.com', 'cliente@calzatec.com');
```

### Verificar tabla de solicitudes:
```sql
SELECT * FROM solicitudes_registro ORDER BY fecha_solicitud DESC LIMIT 5;
```

### Verificar RLS:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('usuarios', 'solicitudes_registro');
```

Ambas tablas deben mostrar `rowsecurity = false`

## 🐛 Si algo no funciona

### Error: "Could not find the table 'public.solicitudes_registro'"
- **Solución:** Ejecuta el script `SETUP_SIMPLE.sql` completo en Supabase

### Error: "row-level security policy"
- **Solución:** Ejecuta el script `SETUP_SIMPLE.sql` completo en Supabase (desactiva RLS)

### Error: "Credenciales inválidas" al iniciar sesión
- **Solución:** 
  1. Verifica que ejecutaste el script SQL
  2. Verifica que los usuarios existan con la consulta de verificación
  3. Verifica que `activo = true` y `password_hash = '1234'`

### Error: "Usuario no encontrado"
- **Solución:** 
  1. Ejecuta el script SQL de nuevo
  2. Verifica que el email sea exactamente: `cliente@calzatec.com` (sin espacios)

## 📞 Contacto

Si después de seguir estos pasos aún no funciona, verifica:
1. Que las variables de entorno de Supabase estén configuradas en `.env.local`
2. Que el proyecto de Supabase esté activo
3. Que tengas permisos para ejecutar SQL en Supabase


