# Solución para Error de Row Level Security (RLS)

## 🔴 Problema

Al intentar registrarse, aparece el error:
```
new row violates row-level security policy for table "usuarios"
```

Esto significa que Supabase tiene Row Level Security (RLS) habilitado y no hay políticas que permitan insertar usuarios.

## ✅ Solución

### Paso 1: Crear Políticas RLS

Ejecuta el script `backend/politicas_rls.sql` en el SQL Editor de Supabase:

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `backend/politicas_rls.sql`
4. Ejecuta el script

Este script creará políticas que permiten:
- Insertar nuevos usuarios (para registro)
- Leer usuarios activos
- Actualizar usuarios

### Paso 2: Crear Usuarios de Prueba

Ejecuta el script `backend/crear_usuarios_simple.sql` en el SQL Editor:

1. Abre el **SQL Editor** de Supabase
2. Copia y pega el contenido de `backend/crear_usuarios_simple.sql`
3. Ejecuta el script

Este script creará los usuarios:
- `admin@calzatec.com` / `1234`
- `vendedor@calzatec.com` / `1234`
- `cliente@calzatec.com` / `1234`

### Paso 3: Verificar

Ejecuta esta consulta para verificar que los usuarios existan:

```sql
SELECT 
  id,
  nombre,
  email,
  activo,
  fecha_ingreso
FROM usuarios
WHERE email IN (
  'admin@calzatec.com',
  'vendedor@calzatec.com',
  'cliente@calzatec.com'
)
ORDER BY email;
```

## 🔒 Seguridad en Producción

**IMPORTANTE:** Las políticas creadas son muy permisivas y solo deben usarse en desarrollo.

Para producción, deberías:

1. **Restringir la inserción de usuarios**:
   - Solo permitir inserción desde funciones server-side
   - O requerir autenticación previa

2. **Usar Supabase Auth**:
   - Crear usuarios a través de `auth.users`
   - Sincronizar con la tabla `usuarios` usando triggers

3. **Políticas más restrictivas**:
   - Solo permitir lectura de usuarios activos
   - Solo permitir actualización del propio perfil
   - Requerir roles específicos para operaciones administrativas

## 🐛 Troubleshooting

### Si aún no puedes insertar usuarios:

1. Verifica que RLS esté habilitado:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'usuarios';
   ```

2. Verifica las políticas existentes:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'usuarios';
   ```

3. Si necesitas desactivar RLS temporalmente (solo para desarrollo):
   ```sql
   ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
   ```

### Si no puedes iniciar sesión:

1. Verifica que el usuario exista:
   ```sql
   SELECT * FROM usuarios WHERE email = 'cliente@calzatec.com';
   ```

2. Verifica que el usuario esté activo:
   ```sql
   SELECT email, activo FROM usuarios WHERE email = 'cliente@calzatec.com';
   ```

3. Verifica la contraseña (debe ser '1234' en texto plano por ahora):
   ```sql
   SELECT email, password_hash FROM usuarios WHERE email = 'cliente@calzatec.com';
   ```


