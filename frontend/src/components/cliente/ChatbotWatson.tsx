'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createWatsonClient, WatsonConfig } from '@/lib/watson'
import { buscarProductos, formatearProductosParaChat, Producto } from '@/lib/productos'
import { ProductosChat } from './ProductosChat'

interface Mensaje {
  id: string
  tipo: 'usuario' | 'bot'
  texto: string
  timestamp: Date
  productos?: Producto[]
}

interface ChatbotWatsonProps {
  watsonConfig?: WatsonConfig
  onProductoClick?: (producto: Producto) => void
}

export function ChatbotWatson({ watsonConfig, onProductoClick }: ChatbotWatsonProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      tipo: 'bot',
      texto: '¡Hola! 👋 Soy tu asistente de CalzaTecIA con IBM Watson. Puedo ayudarte a encontrar el calzado perfecto para ti. ¿Qué estás buscando?',
      timestamp: new Date(),
    },
  ])
  const [inputMensaje, setInputMensaje] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, time: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [closeDirection, setCloseDirection] = useState<'left' | 'right' | null>(null)
  const [isOpening, setIsOpening] = useState(false)
  const mensajesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)
  const watsonClientRef = useRef<ReturnType<typeof createWatsonClient> | null>(null)

  // Inicializar Watson Assistant
  useEffect(() => {
    if (watsonConfig) {
      try {
        watsonClientRef.current = createWatsonClient(watsonConfig)
        watsonClientRef.current.createSession().catch(console.error)
      } catch (error) {
        console.error('Error al inicializar Watson Assistant:', error)
      }
    }
  }, [watsonConfig])

  // Limpiar sesión al desmontar
  useEffect(() => {
    return () => {
      if (watsonClientRef.current) {
        watsonClientRef.current.closeSession().catch(console.error)
      }
    }
  }, [])

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviarMensaje = async () => {
    if (!inputMensaje.trim()) return

    const mensajeTexto = inputMensaje.trim()
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      texto: mensajeTexto,
      timestamp: new Date(),
    }

    setMensajes((prev) => [...prev, mensajeUsuario])
    setInputMensaje('')
    setIsTyping(true)

    try {
      let respuestaTexto = ''
      let productosEncontrados: Producto[] = []

      // Si Watson está configurado, usarlo
      if (watsonClientRef.current) {
        try {
          const watsonResponse = await watsonClientRef.current.sendMessage(mensajeTexto)
          respuestaTexto = watsonClientRef.current.getResponseText(watsonResponse)

          // Verificar si hay intención de búsqueda de productos
          if (watsonClientRef.current.isProductSearchIntent(watsonResponse)) {
            const searchParams = watsonClientRef.current.extractProductSearchParams(watsonResponse)
            
            // Buscar productos en Supabase
            productosEncontrados = await buscarProductos({
              ...searchParams,
              nombre: searchParams.nombre || mensajeTexto,
              limite: 5
            })

            if (productosEncontrados.length > 0) {
              respuestaTexto = formatearProductosParaChat(productosEncontrados)
            } else {
              respuestaTexto = 'No encontré productos que coincidan con tu búsqueda. 😔\n\n¿Podrías ser más específico? Por ejemplo: "zapatos negros talla 40" o "tenis deportivos".'
            }
          }
        } catch (watsonError) {
          console.error('Error con Watson Assistant:', watsonError)
          // Fallback: buscar productos directamente
          productosEncontrados = await buscarProductos({
            nombre: mensajeTexto,
            limite: 5
          })
          
          if (productosEncontrados.length > 0) {
            respuestaTexto = formatearProductosParaChat(productosEncontrados)
          } else {
            respuestaTexto = 'Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo? Puedo ayudarte a buscar productos si me dices qué estás buscando.'
          }
        }
      } else {
        // Fallback: búsqueda directa sin Watson
        productosEncontrados = await buscarProductos({
          nombre: mensajeTexto,
          limite: 5
        })
        
        if (productosEncontrados.length > 0) {
          respuestaTexto = formatearProductosParaChat(productosEncontrados)
        } else {
          respuestaTexto = 'No encontré productos que coincidan con tu búsqueda. 😔\n\n¿Podrías ser más específico? Por ejemplo: "zapatos negros talla 40" o "tenis deportivos".'
        }
      }

      setIsTyping(false)
      const mensajeBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'bot',
        texto: respuestaTexto,
        timestamp: new Date(),
        productos: productosEncontrados.length > 0 ? productosEncontrados : undefined
      }
      setMensajes((prev) => [...prev, mensajeBot])
    } catch (error) {
      console.error('Error al procesar mensaje:', error)
      setIsTyping(false)
      const mensajeBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'bot',
        texto: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo. 😔',
        timestamp: new Date(),
      }
      setMensajes((prev) => [...prev, mensajeBot])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  // Funcionalidad de arrastre simplificada
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (isOpen && target.closest('button')) return
    if (!isOpen && target.closest('button') && !target.closest('button[data-draggable]')) return
    
    const element = chatbotRef.current || (e.currentTarget as HTMLElement)
    if (element) {
      setIsDragging(true)
      const rect = element.getBoundingClientRect()
      const buttonSize = 64
      const margin = 24
      const isButtonMode = !isOpen
      
      const currentX = position?.x ?? (isButtonMode ? window.innerWidth - buttonSize - margin : window.innerWidth - rect.width - 24)
      const currentY = position?.y ?? (isButtonMode ? window.innerHeight - buttonSize - margin : window.innerHeight - rect.height - 24)
      
      setDragStart({ x: e.clientX - currentX, y: e.clientY - currentY, time: Date.now() })
      e.preventDefault()
    }
  }

  if (!isOpen) {
    return (
      <div 
        className="fixed z-50"
        style={{
          right: '24px',
          bottom: '24px',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        <Button
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
          className="h-16 w-16 rounded-full text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:rotate-12 group relative overflow-hidden"
          style={{ background: 'var(--gradient-cliente)' }}
          size="icon"
        >
          <Bot className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: 'var(--color-green)' }} />
        </Button>
      </div>
    )
  }

  return (
    <div 
      ref={chatbotRef}
      className="fixed z-50 w-96 max-w-[calc(100vw-2rem)]"
      style={{
        ...(position ? { left: `${position.x}px`, top: `${position.y}px` } : { right: '24px', bottom: '24px' }),
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <Card className="shadow-2xl overflow-hidden" style={{ 
        border: '1px solid var(--cliente-border)',
        backgroundColor: 'var(--cliente-card)',
      }}>
        <CardHeader 
          className="text-white p-5 flex flex-row items-center justify-between relative overflow-hidden" 
          style={{ 
            background: 'var(--gradient-cliente)',
            cursor: 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: 'var(--color-green)' }} />
            </div>
            <div>
              <CardTitle className="text-lg font-extrabold tracking-tight">
                Asistente CalzaTecIA
              </CardTitle>
              <p className="text-xs text-white/80 font-semibold">Con IBM Watson Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        {!isMinimized && (
          <>
            <CardContent className="p-0">
              <div className="h-[450px] overflow-y-auto p-5 space-y-4" style={{ 
                backgroundColor: 'var(--cliente-card)',
              }}>
                {mensajes.map((mensaje) => (
                  <div
                    key={mensaje.id}
                    className={cn(
                      'flex gap-3',
                      mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {mensaje.tipo === 'bot' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2" style={{ 
                        background: 'var(--gradient-cliente)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 max-w-[80%]">
                      <div
                        className={cn(
                          'rounded-2xl px-5 py-3 shadow-lg',
                        )}
                        style={mensaje.tipo === 'usuario' ? {
                          background: 'var(--gradient-cliente)',
                          color: 'white'
                        } : {
                          backgroundColor: 'var(--cliente-900)',
                          color: 'var(--cliente-text-primary)',
                          border: '1px solid var(--cliente-border)'
                        }}
                      >
                        <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">
                          {mensaje.texto}
                        </p>
                        {mensaje.productos && mensaje.productos.length > 0 && (
                          <div className="mt-3">
                            <ProductosChat 
                              productos={mensaje.productos}
                              onProductoClick={onProductoClick}
                            />
                          </div>
                        )}
                        <p className="text-xs mt-2 font-medium opacity-70">
                          {mensaje.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    {mensaje.tipo === 'usuario' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2" style={{ 
                        background: 'var(--gradient-cliente-secondary)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2" style={{ 
                      background: 'var(--gradient-cliente)',
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="rounded-2xl px-5 py-3 shadow-lg" style={{ 
                      backgroundColor: 'var(--cliente-900)',
                      border: '1px solid var(--cliente-border)'
                    }}>
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ 
                          backgroundColor: 'var(--color-cliente-primary)',
                          animationDelay: '0s' 
                        }} />
                        <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ 
                          backgroundColor: 'var(--color-cliente-primary)',
                          animationDelay: '0.2s' 
                        }} />
                        <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ 
                          backgroundColor: 'var(--color-cliente-primary)',
                          animationDelay: '0.4s' 
                        }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={mensajesEndRef} />
              </div>
              <div className="p-4 backdrop-blur-sm" style={{ 
                borderTop: '1px solid var(--cliente-border)',
                backgroundColor: 'var(--cliente-card)'
              }}>
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    value={inputMensaje}
                    onChange={(e) => setInputMensaje(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 rounded-xl px-4 py-3 font-semibold"
                  />
                  <Button
                    onClick={enviarMensaje}
                    disabled={!inputMensaje.trim() || isTyping}
                    className="rounded-xl px-5 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    style={{ 
                      background: 'var(--gradient-cliente)',
                      color: 'white',
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
