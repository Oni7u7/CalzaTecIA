# 🤖 Configuración de IBM Watson Assistant (watsonx assistant)

## 📋 Requisitos Previos

1. **Cuenta de IBM Cloud** - [https://cloud.ibm.com](https://cloud.ibm.com)
2. **Watson Assistant Service** creado en IBM Cloud
3. **Assistant ID** de tu instancia de Watson Assistant
4. **API Key** o credenciales de servicio

---

## 🔧 Paso 1: Crear Servicio de Watson Assistant en IBM Cloud

1. Ve a [IBM Cloud Console](https://cloud.ibm.com)
2. Haz clic en **"Create resource"**
3. Busca **"Watson Assistant"**
4. Selecciona el plan (Lite es gratuito para empezar)
5. Crea el servicio

---

## 🔑 Paso 2: Obtener Credenciales

### Opción A: API Key (Recomendado)

1. En IBM Cloud Console, ve a tu servicio de Watson Assistant
2. Ve a **"Service credentials"**
3. Crea una nueva credencial o usa una existente
4. Copia el **API Key**

### Opción B: Username y Password

1. En las credenciales del servicio, también encontrarás:
   - **URL**: `https://api.us-south.assistant.watson.cloud.ibm.com`
   - **Username** y **Password** (si usas autenticación básica)

---

## 🆔 Paso 3: Obtener Assistant ID

1. Ve a tu servicio de Watson Assistant en IBM Cloud
2. Haz clic en **"Launch Watson Assistant"**
3. Crea un nuevo Assistant o selecciona uno existente
4. En la configuración del Assistant, encontrarás el **Assistant ID**
   - Formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## 📝 Paso 4: Configurar Variables de Entorno

Agrega estas variables a tu archivo `frontend/.env.local`:

```env
# IBM Watson Assistant
NEXT_PUBLIC_WATSON_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_WATSON_SERVICE_URL=https://api.us-south.assistant.watson.cloud.ibm.com
NEXT_PUBLIC_WATSON_ASSISTANT_ID=tu-assistant-id-aqui

# O si usas username/password:
# NEXT_PUBLIC_WATSON_USERNAME=tu-username
# NEXT_PUBLIC_WATSON_PASSWORD=tu-password
```

**Nota**: Ajusta la URL según tu región:
- `us-south`: Dallas
- `us-east`: Washington DC
- `eu-gb`: London
- `eu-de`: Frankfurt
- `jp-tok`: Tokyo
- `au-syd`: Sydney

---

## 🚀 Paso 5: Usar el Chatbot con Watson

### En tu componente de página:

```typescript
import { ChatbotWatson } from '@/components/cliente/ChatbotWatson'
import { WatsonConfig } from '@/lib/watson'

export default function ClientePage() {
  const watsonConfig: WatsonConfig = {
    apiKey: process.env.NEXT_PUBLIC_WATSON_API_KEY!,
    serviceUrl: process.env.NEXT_PUBLIC_WATSON_SERVICE_URL!,
    assistantId: process.env.NEXT_PUBLIC_WATSON_ASSISTANT_ID!,
  }

  const handleProductoClick = (producto: Producto) => {
    // Manejar clic en producto
    console.log('Producto seleccionado:', producto)
  }

  return (
    <div>
      {/* Tu contenido */}
      
      <ChatbotWatson 
        watsonConfig={watsonConfig}
        onProductoClick={handleProductoClick}
      />
    </div>
  )
}
```

---

## 🎯 Paso 6: Configurar Intenciones en Watson Assistant

Para que Watson pueda buscar productos, necesitas configurar intenciones en el Assistant:

### Intenciones Recomendadas:

1. **#buscar_producto**
   - Ejemplos: "buscar zapatos", "quiero ver tenis", "muéstrame calzado"

2. **#buscar_por_categoria**
   - Ejemplos: "zapatos formales", "tenis deportivos", "botas de seguridad"

3. **#buscar_por_talla**
   - Ejemplos: "talla 40", "zapatos talla 42", "calzado número 38"

4. **#buscar_por_color**
   - Ejemplos: "zapatos negros", "tenis blancos", "calzado café"

5. **#buscar_por_precio**
   - Ejemplos: "zapatos baratos", "menos de 1000 pesos", "productos económicos"

### Entidades Recomendadas:

1. **@categoria**: Casual, Formal, Deportivo, Seguridad
2. **@talla**: 26-45
3. **@color**: Negro, Blanco, Café, Gris, Azul, etc.
4. **@precio**: Números y rangos
5. **@producto**: Nombres de productos

---

## 🔍 Paso 7: Configurar Acciones en Watson (Opcional)

Puedes configurar acciones en Watson Assistant que llamen a tu backend para buscar productos. Sin embargo, el código actual busca directamente en Supabase desde el frontend.

---

## 🧪 Paso 8: Probar el Chatbot

1. Inicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la página del cliente
3. Haz clic en el botón del chatbot
4. Prueba mensajes como:
   - "Buscar zapatos negros"
   - "Quiero ver tenis talla 40"
   - "Muéstrame calzado formal"

---

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente el API Key
- Asegúrate de que la variable empieza con `NEXT_PUBLIC_`
- Reinicia el servidor después de agregar variables

### Error: "Assistant not found"
- Verifica que el Assistant ID es correcto
- Asegúrate de que el Assistant está activo en IBM Cloud

### Error: "Session expired"
- El código maneja automáticamente la expiración de sesiones
- Si persiste, verifica que las credenciales son correctas

### No encuentra productos
- Verifica que ejecutaste los scripts SQL en Supabase
- Verifica que hay productos en la base de datos
- Revisa la consola del navegador para errores

---

## 📚 Recursos

- [Documentación de Watson Assistant](https://cloud.ibm.com/docs/assistant)
- [Watson Assistant API Reference](https://cloud.ibm.com/apis/assistant)
- [Guía de Integración](https://cloud.ibm.com/docs/assistant?topic=assistant-api-overview)

---

## ✅ Checklist

- [ ] Servicio de Watson Assistant creado en IBM Cloud
- [ ] API Key obtenido
- [ ] Assistant ID obtenido
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Intenciones configuradas en Watson Assistant
- [ ] Entidades configuradas en Watson Assistant
- [ ] Chatbot probado y funcionando
- [ ] Búsqueda de productos funcionando

---

**¡Listo!** Ya puedes usar IBM Watson Assistant en tu chatbot. 🎉


