'use client'

import { useEffect } from 'react'

export function WatsonChatbot() {
  useEffect(() => {
    // Verificar si el script ya está cargado
    if ((window as any).watsonAssistantChatOptions) {
      return
    }

    // Configurar opciones de Watson Assistant
    ;(window as any).watsonAssistantChatOptions = {
      integrationID: "da68ebba-5ec3-4ed5-9294-8c0a938248d8", // The ID of this integration.
      region: "au-syd", // The region your integration is hosted in.
      serviceInstanceID: "20282cfe-c3a3-448a-b73c-bc7ab00b73bb", // The ID of your service instance.
      onLoad: async (instance: any) => { 
        await instance.render()
        
        console.log('Watson Assistant cargado correctamente')
        
        // Escuchar mensajes del usuario para buscar productos
        instance.on({ 
          type: 'receive', 
          handler: async (event: any) => {
            try {
              // Verificar si hay intención de búsqueda de productos
              const intents = event.output?.intents || []
              const productIntent = intents.find((intent: any) => 
                intent.intent?.toLowerCase().includes('buscar') ||
                intent.intent?.toLowerCase().includes('producto') ||
                intent.intent?.toLowerCase().includes('tenis') ||
                intent.intent?.toLowerCase().includes('zapato')
              )
              
              // También buscar en el texto del mensaje
              const inputText = event.input?.text?.toLowerCase() || ''
              const hasProductKeywords = 
                inputText.includes('tenis') ||
                inputText.includes('zapato') ||
                inputText.includes('calzado') ||
                inputText.includes('buscar') ||
                inputText.includes('quiero') ||
                inputText.includes('necesito') ||
                inputText.includes('talla') ||
                inputText.includes('color')
              
              if (productIntent || hasProductKeywords) {
                // Extraer entidades del mensaje
                const entities = event.output.entities || []
                const talla = entities.find((e: any) => 
                  e.entity === 'talla' || 
                  e.entity === 'numero' ||
                  e.entity === 'size'
                )?.value
                
                const color = entities.find((e: any) => 
                  e.entity === 'color' ||
                  e.entity === 'colores'
                )?.value
                
                const genero = entities.find((e: any) => 
                  e.entity === 'genero' ||
                  e.entity === 'sexo' ||
                  e.entity === 'gender'
                )?.value
                
                // Extraer precio del texto si existe
                const precioMatch = inputText.match(/(\d+)\s*(pesos|mxn|dolares|dollars)?/i)
                const precio = precioMatch ? parseFloat(precioMatch[1]) : undefined
                
                // Extraer nombre del producto del texto
                const nombre = inputText
                  .replace(/\b(talla|color|precio|para|quiero|necesito|buscar|tenis|zapatos|calzado)\b/gi, '')
                  .trim()
                
                // Llamar a la API de filtros
                const response = await fetch('/api/productos/filtros', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    talla,
                    color,
                    genero,
                    nombre: nombre || undefined,
                    precio_max: precio,
                    limite: 5
                  })
                })
                
                const data = await response.json()
                
                if (data.success && data.productos && data.productos.length > 0) {
                  // Formatear productos para mostrar en el chat
                  let mensajeProductos = '¡Encontré estos productos para ti:\n\n'
                  
                  data.productos.forEach((producto: any, index: number) => {
                    mensajeProductos += `${index + 1}. **${producto.nombre}**\n`
                    if (producto.marca) {
                      mensajeProductos += `   Marca: ${producto.marca}\n`
                    }
                    mensajeProductos += `   SKU: ${producto.sku}\n`
                    mensajeProductos += `   Precio: $${producto.precio.toLocaleString('es-MX')}\n`
                    if (producto.tallas_disponibles && producto.tallas_disponibles.length > 0) {
                      mensajeProductos += `   Tallas disponibles: ${producto.tallas_disponibles.join(', ')}\n`
                    }
                    if (producto.colores_disponibles && producto.colores_disponibles.length > 0) {
                      mensajeProductos += `   Colores: ${producto.colores_disponibles.join(', ')}\n`
                    }
                    mensajeProductos += '\n'
                  })
                  
                  mensajeProductos += '¿Te gustaría ver más detalles de alguno de estos productos?'
                  
                  // Enviar mensaje con productos usando el método correcto de Watson
                  instance.send({
                    type: 'message',
                    text: mensajeProductos
                  }).catch((err: any) => {
                    console.error('Error al enviar mensaje a Watson:', err)
                  })
                } else {
                  instance.send({
                    type: 'message',
                    text: 'No encontré productos que coincidan con tu búsqueda. 😔\n\n¿Podrías ser más específico? Por ejemplo: "tenis negros talla 26" o "zapatos para mujer".'
                  }).catch((err: any) => {
                    console.error('Error al enviar mensaje a Watson:', err)
                  })
                }
              }
            } catch (error) {
              console.error('Error al procesar mensaje de Watson:', error)
            }
          }
        })
      }
    }

    // Cargar script de Watson Assistant
    setTimeout(function() {
      // Verificar si el script ya existe
      const existingScript = document.querySelector('script[src*="WatsonAssistantChatEntry.js"]')
      if (existingScript) {
        return
      }

      const t = document.createElement('script')
      t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + 
              ((window as any).watsonAssistantChatOptions?.clientVersion || 'latest') + 
              "/WatsonAssistantChatEntry.js"
      t.async = true
      document.head.appendChild(t)
    }, 0)

    // Limpiar al desmontar
    return () => {
      // No removemos el script porque Watson lo necesita
      // Solo limpiamos referencias si es necesario
    }
  }, [])

  return null // Este componente no renderiza nada, solo carga el script
}

