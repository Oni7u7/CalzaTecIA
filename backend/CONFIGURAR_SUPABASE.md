# 🔧 Configurar Supabase en tu Proyecto

## 📋 Ya tienes:
- ✅ Project URL de Supabase
- ✅ API Key (anon/public key) de Supabase

## 🚀 Pasos para Configurar

### Paso 1: Instalar el Cliente de Supabase

En la carpeta `frontend`, ejecuta:

```bash
npm install @supabase/supabase-js
```

O si usas yarn:

```bash
yarn add @supabase/supabase-js
```

---

### Paso 2: Crear el Archivo de Variables de Entorno

1. En la carpeta `frontend`, crea un archivo llamado `.env.local`
2. Agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Importante:**
- Reemplaza `https://tu-proyecto.supabase.co` con tu **Project URL** real
- Reemplaza `tu-anon-key-aqui` con tu **API Key (anon/public)** real
- El prefijo `NEXT_PUBLIC_` es necesario para que Next.js exponga estas variables al cliente

---

### Paso 3: Verificar que el Cliente de Supabase Funciona

Ya he creado el archivo `frontend/src/lib/supabase.ts` que configura el cliente.

Para probar que funciona, puedes crear un componente de prueba o usar la consola del navegador:

```typescript
import { supabase } from '@/lib/supabase'

// Ejemplo: Obtener productos
const { data, error } = await supabase
  .from('productos')
  .select('*')
  .limit(5)

console.log('Productos:', data)
console.log('Error:', error)
```

---

### Paso 4: Reiniciar el Servidor de Desarrollo

Después de crear el archivo `.env.local`, **reinicia** tu servidor de desarrollo:

```bash
# Detén el servidor (Ctrl+C)
# Luego inícialo de nuevo
npm run dev
```

Next.js solo carga las variables de entorno al iniciar, así que necesitas reiniciar.

---

## 📝 Ejemplo de Uso

### Obtener Productos

```typescript
import { supabase } from '@/lib/supabase'

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) {
    console.error('Error al obtener productos:', error)
    return []
  }

  return data || []
}
```

### Autenticación con Supabase Auth

```typescript
import { supabase } from '@/lib/supabase'

// Iniciar sesión
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error al iniciar sesión:', error)
    return null
  }

  return data
}

// Cerrar sesión
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Obtener usuario actual
export async function getUsuarioActual() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

### Insertar un Producto

```typescript
import { supabase } from '@/lib/supabase'

export async function crearProducto(producto: {
  sku: string
  nombre: string
  categoria: string
  precio: number
  // ... otros campos
}) {
  const { data, error } = await supabase
    .from('productos')
    .insert([producto])
    .select()
    .single()

  if (error) {
    console.error('Error al crear producto:', error)
    return null
  }

  return data
}
```

---

## 🔒 Seguridad

### Variables de Entorno

- ✅ **NUNCA** subas el archivo `.env.local` a Git
- ✅ El archivo `.env.local` ya está en `.gitignore`
- ✅ Usa `NEXT_PUBLIC_` solo para variables que necesitas en el cliente
- ✅ Para variables del servidor (backend), NO uses `NEXT_PUBLIC_`

### API Keys

- ✅ **anon/public key**: Segura para usar en el frontend (está protegida por RLS)
- ❌ **service_role key**: NUNCA la uses en el frontend, solo en el backend

---

## 🐛 Solución de Problemas

### Error: "Faltan las variables de entorno"

**Solución:**
1. Verifica que el archivo `.env.local` existe en la carpeta `frontend`
2. Verifica que las variables empiezan con `NEXT_PUBLIC_`
3. Reinicia el servidor de desarrollo

### Error: "Invalid API key"

**Solución:**
1. Verifica que copiaste correctamente el API Key
2. Asegúrate de usar el **anon/public key**, no el service_role key
3. Verifica que no hay espacios extra al inicio o final

### Error: "relation does not exist"

**Solución:**
1. Verifica que ejecutaste el script `supabase_schema.sql` en Supabase
2. Verifica que las tablas existen en el Table Editor de Supabase
3. Verifica que el nombre de la tabla es correcto (case-sensitive)

### Las variables no se cargan

**Solución:**
1. Reinicia el servidor de desarrollo completamente
2. Verifica que el archivo se llama exactamente `.env.local` (con el punto al inicio)
3. Verifica que estás usando `process.env.NEXT_PUBLIC_...` en el código

---

## 📚 Recursos

- [Documentación de Supabase JS](https://supabase.com/docs/reference/javascript/introduction)
- [Guía de Variables de Entorno en Next.js](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## ✅ Checklist

- [ ] Instalé `@supabase/supabase-js`
- [ ] Creé el archivo `.env.local` con mis credenciales
- [ ] Agregué `NEXT_PUBLIC_SUPABASE_URL` con mi Project URL
- [ ] Agregué `NEXT_PUBLIC_SUPABASE_ANON_KEY` con mi API Key
- [ ] Reinicié el servidor de desarrollo
- [ ] Probé que el cliente de Supabase funciona

---

**¡Listo!** Ya puedes usar Supabase en tu frontend. 🎉


