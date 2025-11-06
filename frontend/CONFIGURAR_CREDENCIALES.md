# 🔑 Configurar Credenciales de Supabase

## 📋 Pasos Rápidos

Ya tienes el **Project URL** y **API Key** de Supabase. Sigue estos pasos:

---

## ✅ Paso 1: Instalar Supabase

En la carpeta `frontend`, ejecuta:

```bash
npm install @supabase/supabase-js
```

---

## ✅ Paso 2: Crear Archivo de Variables de Entorno

1. En la carpeta `frontend`, crea un archivo llamado `.env.local`
2. Agrega tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_PROJECT_URL_AQUI
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_API_KEY_AQUI
```

**Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTI5NjgwMCwiZXhwIjoxOTYwODcyODAwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

---

## ✅ Paso 3: Reiniciar el Servidor

Después de crear `.env.local`, **reinicia** tu servidor:

```bash
# Detén el servidor (Ctrl+C)
# Luego inícialo de nuevo
npm run dev
```

---

## 🧪 Paso 4: Probar que Funciona

Puedes probar que funciona creando un componente de prueba o usando la consola del navegador:

```typescript
import { supabase } from '@/lib/supabase'

// Probar obtener productos
const { data, error } = await supabase
  .from('productos')
  .select('*')
  .limit(5)

console.log('Productos:', data)
```

---

## 📝 Estructura del Archivo .env.local

Tu archivo `.env.local` debe verse así:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Importante:**
- ✅ El archivo debe llamarse exactamente `.env.local` (con el punto al inicio)
- ✅ Debe estar en la carpeta `frontend` (no en `backend`)
- ✅ NO subas este archivo a Git (ya está en `.gitignore`)
- ✅ Usa `NEXT_PUBLIC_` al inicio de las variables (necesario para Next.js)

---

## 🔍 Dónde Encontrar tus Credenciales

Si necesitas ver tus credenciales de nuevo:

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión
3. Selecciona tu proyecto
4. Ve a **Settings** → **API**
5. Ahí encontrarás:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: `eyJhbGc...`

---

## ✅ Verificación

Después de configurar, verifica que:

- [ ] El archivo `.env.local` existe en `frontend/`
- [ ] Tiene `NEXT_PUBLIC_SUPABASE_URL` con tu Project URL
- [ ] Tiene `NEXT_PUBLIC_SUPABASE_ANON_KEY` con tu API Key
- [ ] Reiniciaste el servidor de desarrollo
- [ ] No hay errores en la consola

---

## 🐛 Problemas Comunes

### Error: "Faltan las variables de entorno"

**Solución:**
- Verifica que el archivo se llama `.env.local` (con punto al inicio)
- Verifica que está en la carpeta `frontend`
- Reinicia el servidor completamente

### Error: "Invalid API key"

**Solución:**
- Verifica que copiaste correctamente el API Key
- Asegúrate de no tener espacios extra
- Usa el **anon/public key**, no el service_role key

### Las variables no se cargan

**Solución:**
- Reinicia el servidor de desarrollo
- Verifica que las variables empiezan con `NEXT_PUBLIC_`
- Verifica que no hay errores de sintaxis en `.env.local`

---

**¡Listo!** Ya puedes usar Supabase en tu frontend. 🎉


