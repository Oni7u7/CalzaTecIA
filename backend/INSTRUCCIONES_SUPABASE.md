# 📘 Instrucciones para Crear las Tablas en Supabase

## 🎯 Objetivo

Este documento te guiará paso a paso para crear todas las tablas necesarias para el frontend de ZAPATAVIVE en Supabase.

---

## 📋 Paso 1: Acceder a Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto (o crea uno nuevo si no tienes)

---

## 📋 Paso 2: Abrir el SQL Editor

1. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en el botón **"New query"** (Nueva consulta)

---

## 📋 Paso 3: Ejecutar el Script SQL

### Opción A: Copiar y Pegar el Script Completo

1. Abre el archivo `supabase_schema.sql` en este directorio
2. **Copia TODO el contenido** del archivo
3. **Pega** el contenido en el SQL Editor de Supabase
4. Haz clic en el botón **"Run"** (o presiona `Ctrl+Enter` / `Cmd+Enter`)

### Opción B: Ejecutar por Secciones

Si prefieres ejecutar por partes, puedes ejecutar cada sección del script:

1. **Primero**: Extensiones y tablas base (roles, tiendas, usuarios)
2. **Segundo**: Productos e inventario
3. **Tercero**: Ventas y POS
4. **Cuarto**: Devoluciones
5. **Quinto**: Proveedores y entregas
6. **Sexto**: Capacitación
7. **Séptimo**: Reportes y KPIs
8. **Octavo**: Auditoría y Chatbot

---

## 📋 Paso 3.5: Insertar Datos Iniciales (Opcional pero Recomendado)

Para facilitar las pruebas, puedes insertar datos iniciales:

1. Abre el archivo `supabase_seeds.sql` en este directorio
2. **Copia TODO el contenido** del archivo
3. **Pega** el contenido en el SQL Editor de Supabase
4. Haz clic en el botón **"Run"**

Este script insertará:
- ✅ Roles básicos (admin, gerente, vendedor, cliente)
- ✅ Usuarios de prueba (con contraseña: `1234`)
- ✅ Tiendas de ejemplo
- ✅ Productos de ejemplo (10 productos)
- ✅ Inventario inicial para cada tienda
- ✅ CEDIS y proveedores de ejemplo
- ✅ Competencias para capacitación

**Credenciales de prueba:**
- **Admin**: `admin@zapatavive.com` / `1234`
- **Gerente**: `gerente.centro@zapatavive.com` / `1234`
- **Vendedor**: `vendedor1@zapatavive.com` / `1234`
- **Cliente**: `cliente@zapatavive.com` / `1234`

⚠️ **IMPORTANTE**: Cambia estas contraseñas en producción.

---

## 📋 Paso 4: Verificar que las Tablas se Crearon

1. En el menú lateral, haz clic en **"Table Editor"**
2. Deberías ver todas las tablas listadas:
   - ✅ `roles`
   - ✅ `usuarios`
   - ✅ `tiendas`
   - ✅ `productos`
   - ✅ `inventario`
   - ✅ `ventas`
   - ✅ `venta_items`
   - ✅ `devoluciones`
   - ✅ `conversaciones_chatbot`
   - ✅ Y todas las demás...

---

## 📋 Paso 5: Configurar Row Level Security (RLS)

**IMPORTANTE**: Por seguridad, debes configurar RLS en todas las tablas.

### Para cada tabla:

1. Ve a **"Table Editor"**
2. Selecciona una tabla (ej: `usuarios`)
3. Haz clic en la pestaña **"Policies"** (Políticas)
4. Haz clic en **"Enable RLS"** si no está habilitado
5. Crea políticas según el rol del usuario

### Ejemplo de Políticas Básicas:

#### Para la tabla `usuarios`:

```sql
-- Los usuarios solo pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Los administradores pueden ver todo
CREATE POLICY "Admins can view all" ON usuarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND rol_id IN (SELECT id FROM roles WHERE nombre = 'admin')
    )
  );
```

#### Para la tabla `productos`:

```sql
-- Todos pueden ver productos activos
CREATE POLICY "Anyone can view active products" ON productos
  FOR SELECT USING (activo = true);

-- Solo admins pueden modificar
CREATE POLICY "Only admins can modify products" ON productos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid()
      AND rol_id IN (SELECT id FROM roles WHERE nombre = 'admin')
    )
  );
```

---

## 📋 Paso 6: Insertar Datos Iniciales

**Nota**: Si ya ejecutaste el script `supabase_seeds.sql` en el Paso 3.5, puedes saltar este paso.

Si prefieres insertar los datos manualmente o personalizarlos, puedes usar los siguientes ejemplos:

### 6.1 Crear Roles Básicos

Ejecuta este SQL en el SQL Editor:

```sql
-- Insertar roles básicos
INSERT INTO roles (nombre, nivel, descripcion) VALUES
  ('admin', 1, 'Administrador del sistema'),
  ('gerente_tienda', 2, 'Gerente de tienda'),
  ('vendedor', 3, 'Vendedor'),
  ('cliente', 4, 'Cliente/Comprador'),
  ('supervisor', 2, 'Supervisor de operaciones');
```

### 6.2 Crear Usuario Administrador

```sql
-- Crear usuario admin (cambia el password_hash por uno real)
-- Usa bcrypt para hashear la contraseña
INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo) VALUES
  (
    'Administrador',
    'admin@zapatavive.com',
    '$2a$10$TuHashAqui', -- Reemplaza con hash real de tu contraseña
    (SELECT id FROM roles WHERE nombre = 'admin'),
    true
  );
```

**Nota**: Para generar un hash de contraseña, puedes usar:
- [bcrypt-generator.com](https://bcrypt-generator.com/)
- O una función en tu backend

### 6.3 Crear Tiendas de Ejemplo

```sql
-- Crear tiendas de ejemplo
INSERT INTO tiendas (nombre, codigo, ubicacion, direccion, estado) VALUES
  ('Tienda Centro', 'T001', 'Ciudad de México', 'Av. Principal 123', 'activa'),
  ('Tienda Sur', 'T002', 'Ciudad de México', 'Av. Sur 456', 'activa'),
  ('Tienda Norte', 'T003', 'Ciudad de México', 'Av. Norte 789', 'activa');
```

### 6.4 Crear Productos de Ejemplo

```sql
-- Crear productos de ejemplo
INSERT INTO productos (sku, nombre, categoria, precio, costo, activo, tallas_disponibles, colores_disponibles) VALUES
  (
    'SKU-001',
    'Zapato Casual Negro',
    'Casual',
    899.00,
    500.00,
    true,
    '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Negro", "Blanco", "Café"]'::jsonb
  ),
  (
    'SKU-002',
    'Zapato Formal Marrón',
    'Formal',
    1299.00,
    800.00,
    true,
    '["38", "39", "40", "41", "42", "43", "44"]'::jsonb,
    '["Marrón", "Negro"]'::jsonb
  ),
  (
    'SKU-003',
    'Tenis Deportivo',
    'Deportivo',
    1199.00,
    700.00,
    true,
    '["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]'::jsonb,
    '["Blanco", "Negro", "Azul", "Rojo"]'::jsonb
  );
```

**Recomendación**: Usa el script `supabase_seeds.sql` que ya incluye todos estos datos y más.

---

## 📋 Paso 7: Obtener las Credenciales de Conexión

Para conectar tu backend o frontend a Supabase:

1. Ve a **"Settings"** (Configuración) en el menú lateral
2. Haz clic en **"API"**
3. Copia las siguientes credenciales:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon/public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (¡Mantén esto secreto!)

4. Ve a **"Database"** → **"Connection string"**
   - Copia la **Connection string** (URI de PostgreSQL)

---

## 📋 Paso 8: Configurar Variables de Entorno

Crea un archivo `.env` en tu backend con:

```env
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Base de Datos (Connection String)
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.tu-proyecto.supabase.co:5432/postgres
```

---

## ✅ Verificación Final

### Checklist:

- [ ] ✅ Todas las tablas creadas (verificar en Table Editor)
- [ ] ✅ Índices creados (verificar en SQL Editor con `\d tabla`)
- [ ] ✅ Triggers configurados (verificar con `SELECT * FROM pg_trigger`)
- [ ] ✅ RLS habilitado en todas las tablas
- [ ] ✅ Políticas de seguridad creadas
- [ ] ✅ Datos iniciales insertados (roles, usuarios, productos)
- [ ] ✅ Credenciales de conexión copiadas
- [ ] ✅ Variables de entorno configuradas

---

## 🐛 Solución de Problemas

### Error: "relation already exists"
- **Solución**: Las tablas ya existen. Puedes:
  - Eliminarlas primero: `DROP TABLE IF EXISTS nombre_tabla CASCADE;`
  - O usar `CREATE TABLE IF NOT EXISTS` (ya incluido en el script)

### Error: "permission denied"
- **Solución**: Asegúrate de estar usando el usuario correcto (postgres) o el service_role key

### Error: "foreign key constraint"
- **Solución**: Verifica que las tablas referenciadas existan antes de crear las que las referencian

### Las tablas no aparecen en Table Editor
- **Solución**: 
  1. Refresca la página
  2. Verifica que ejecutaste el script completo
  3. Revisa la consola del navegador por errores

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor de Supabase](https://supabase.com/docs/guides/database/tables)

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás:
- ✅ Todas las tablas creadas
- ✅ Estructura de base de datos lista
- ✅ Datos iniciales para probar
- ✅ Configuración lista para conectar tu backend

**Próximo paso**: Conectar tu backend Node.js/Express a Supabase usando las credenciales obtenidas.

