'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Bot, User, X, Minimize2, Maximize2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Mensaje {
  id: string
  tipo: 'usuario' | 'bot'
  texto: string
  timestamp: Date
}

interface ChatbotData {
  bienvenida: string[]
  categorias: string[]
  tallas: string[]
  colores: string[]
  precios: string[]
  inventario: string[]
  envios: string[]
  pagos: string[]
  devoluciones: string[]
  pedidos: string[]
  contacto: string[]
  registro: string[]
  materiales: string[]
  despedida: string[]
  respuestas: {
    [key: string]: string
  }
}

const chatbotData: ChatbotData = {
  bienvenida: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', '¿me puedes ayudar?', 'ayuda', 'saludos', 'hi', 'hello'],
  categorias: ['zapatos', 'tenis', 'mujer', 'hombre', 'niño', 'niña', 'accesorios', 'categorías', 'categorias', 'tipos'],
  tallas: ['talla', 'tallas', 'número', 'numeros', 'medida', 'medidas', 'talla 26', 'talla 27', 'talla 28', 'talla 29', 'talla 30', 'talla 31', 'talla 32', 'talla 33', 'talla 34', 'talla 35', 'talla 36', 'talla 37', 'talla 38', 'talla 39', 'talla 40', 'talla 41', 'talla 42', 'talla 43', 'talla 44', 'talla 45'],
  colores: ['color', 'colores', 'negro', 'blanco', 'café', 'marron', 'gris', 'azul', 'rojo', 'verde', 'amarillo', 'rosa', 'beige'],
  precios: ['precio', 'precios', 'costo', 'costos', 'cuánto cuesta', 'cuanto cuesta', 'barato', 'caro', 'descuento', 'descuentos', 'promoción', 'promocion', 'oferta', 'ofertas'],
  inventario: ['inventario', 'stock', 'disponible', 'disponibilidad', 'hay', 'tienen', 'existencias'],
  envios: ['envío', 'envios', 'entrega', 'entregas', 'shipping', 'delivery', 'domicilio', 'envío gratis', 'envio gratis', 'tiempo de entrega'],
  pagos: ['pago', 'pagos', 'tarjeta', 'efectivo', 'transferencia', 'paypal', 'métodos de pago', 'metodos de pago', 'cómo pagar', 'como pagar'],
  devoluciones: ['devolución', 'devoluciones', 'reembolso', 'reembolsos', 'cambio', 'cambios', 'devolver', 'política de devolución', 'politica de devolucion'],
  pedidos: ['pedido', 'pedidos', 'orden', 'ordenes', 'comprar', 'compra', 'mi pedido', 'mis pedidos', 'estado del pedido', 'seguimiento'],
  contacto: ['contacto', 'contactar', 'teléfono', 'telefono', 'email', 'correo', 'dirección', 'direccion', 'ubicación', 'ubicacion', 'sucursal', 'sucursales'],
  registro: ['registro', 'registrarse', 'cuenta', 'crear cuenta', 'perfil', 'mi cuenta', 'mi perfil'],
  materiales: ['material', 'materiales', 'cuero', 'sintético', 'sintetico', 'tela', 'goma', 'plástico', 'plastico', 'qué material', 'que material'],
  despedida: ['adiós', 'adios', 'chao', 'chau', 'hasta luego', 'nos vemos', 'gracias', 'gracias por tu ayuda', 'bye', 'goodbye'],
  respuestas: {
    bienvenida: '¡Hola! 👋 Bienvenido(a) a CalzaTecIA. Puedo ayudarte a encontrar el calzado ideal para ti. ¿Qué te gustaría buscar?',
    categorias: 'Claro, aquí tienes nuestras categorías principales: 👞 Hombre, 👠 Mujer, 👟 Tenis, 🧒 Niños, 🎒 Accesorios. ¿Cuál te interesa?',
    tallas: 'Tenemos tallas desde la 26 hasta la 45. ¿Qué talla necesitas? Puedo ayudarte a encontrar productos disponibles en tu talla.',
    colores: 'Tenemos una amplia variedad de colores: negro, blanco, café, gris, azul, rojo, verde y más. ¿Qué color prefieres?',
    precios: 'Nuestros precios van desde $599 hasta $1,799 MXN. Además, tenemos descuentos especiales y promociones. ¿Te interesa algún rango de precio en particular?',
    inventario: 'Puedo ayudarte a verificar la disponibilidad de productos. ¿Qué producto específico te interesa?',
    envios: 'Ofrecemos envío gratuito en compras mayores a $1,000 MXN. El tiempo de entrega es de 3 a 5 días hábiles. ¿Necesitas más información?',
    pagos: 'Aceptamos: 💳 Tarjeta de crédito/débito, 💵 Efectivo, 🏦 Transferencia bancaria. Todos los pagos son seguros. ¿Qué método prefieres?',
    devoluciones: 'Tienes 30 días para devolver o cambiar productos nuevos sin usar. Solo necesitas el ticket de compra. ¿Necesitas ayuda con una devolución?',
    pedidos: 'Puedo ayudarte a rastrear tu pedido. ¿Tienes el número de pedido? También puedes revisar tus pedidos en tu perfil.',
    contacto: 'Puedes contactarnos al: 📞 Teléfono: 01-800-CALZATEC | 📧 Email: contacto@calzatec.com | 📍 Tenemos múltiples sucursales. ¿Qué información necesitas?',
    registro: 'Para crear una cuenta, ve a tu perfil y completa el formulario. Con una cuenta puedes: ver historial de pedidos, recibir descuentos exclusivos y más. ¿Necesitas ayuda con el registro?',
    materiales: 'Trabajamos con diversos materiales de alta calidad: cuero genuino, sintético, tela, goma y otros. ¿Qué material prefieres para tu calzado?',
    despedida: '¡Fue un placer ayudarte! 😊 Si tienes más preguntas, no dudes en preguntar. ¡Que tengas un excelente día!',
    default: 'Lo siento 😅, aún no entiendo esa consulta. ¿Podrías reformularla? Puedo ayudarte con: categorías, tallas, colores, precios, inventario, envíos, pagos, devoluciones y más.',
  },
}

export function Chatbot() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      tipo: 'bot',
      texto: '¡Hola! 👋',
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
  const animationFrameRef = useRef<number | null>(null)
  const lastPositionRef = useRef<{ x: number; y: number; time: number } | null>(null)

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  // Manejar animación de apertura
  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        setIsOpening(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpening])

  const buscarRespuesta = (texto: string): string => {
    const textoLower = texto.toLowerCase().trim()

    // Buscar coincidencias en las categorías
    for (const [categoria, palabras] of Object.entries(chatbotData)) {
      if (categoria === 'respuestas') continue
      if (Array.isArray(palabras)) {
        const coincide = palabras.some((palabra) => textoLower.includes(palabra))
        if (coincide && chatbotData.respuestas[categoria]) {
          return chatbotData.respuestas[categoria]
        }
      }
    }

    return chatbotData.respuestas.default
  }

  const enviarMensaje = () => {
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

    // Simular respuesta del bot después de un breve delay
    setTimeout(() => {
      const respuestaBot = buscarRespuesta(mensajeTexto)
      setIsTyping(false)
      const mensajeBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'bot',
        texto: respuestaBot,
        timestamp: new Date(),
      }
      setMensajes((prev) => [...prev, mensajeBot])
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  // Funcionalidad de arrastre con inercia
  const handleMouseDown = (e: React.MouseEvent) => {
    // Evitar arrastre si se hace clic en botones (excepto el botón principal cuando está cerrado)
    const target = e.target as HTMLElement
    if (isOpen && target.closest('button')) {
      return
    }
    // Si está cerrado y se hace clic en el botón, no arrastrar
    if (!isOpen && target.closest('button') && !target.closest('button[data-draggable]')) {
      return
    }
    
    const element = chatbotRef.current || (e.currentTarget as HTMLElement)
    if (element) {
      setIsDragging(true)
      setIsAnimating(false)
      const rect = element.getBoundingClientRect()
      const buttonSize = 64
      const margin = 24
      const isButtonMode = !isOpen
      const elementWidth = isButtonMode ? buttonSize : rect.width
      const elementHeight = isButtonMode ? buttonSize : rect.height
      
      const currentX = position?.x !== undefined 
        ? position.x 
        : (isButtonMode ? window.innerWidth - buttonSize - margin : window.innerWidth - elementWidth - 24)
      const currentY = position?.y !== undefined 
        ? position.y 
        : (isButtonMode ? window.innerHeight - buttonSize - margin : window.innerHeight - elementHeight - 24)
      
      setDragStart({
        x: e.clientX - currentX,
        y: e.clientY - currentY,
        time: Date.now(),
      })
      lastPositionRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
      e.preventDefault()
      e.stopPropagation()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && lastPositionRef.current) {
        const isButtonMode = !isOpen
        const buttonSize = 64
        const elementSize = isButtonMode ? buttonSize : (chatbotRef.current?.offsetWidth || 384)
        const elementHeight = isButtonMode ? buttonSize : (chatbotRef.current?.offsetHeight || 600)
        const margin = 24
        
        const currentX = position?.x !== undefined 
          ? position.x 
          : (isButtonMode ? window.innerWidth - elementSize - margin : window.innerWidth - elementSize - 24)
        const currentY = position?.y !== undefined 
          ? position.y 
          : (isButtonMode ? window.innerHeight - elementHeight - margin : window.innerHeight - elementHeight - 24)
        
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        
        // Calcular velocidad para inercia
        const timeDelta = Date.now() - lastPositionRef.current.time
        if (timeDelta > 0) {
          const velX = (e.clientX - lastPositionRef.current.x) / timeDelta
          const velY = (e.clientY - lastPositionRef.current.y) / timeDelta
          setVelocity({ x: velX * 10, y: velY * 10 }) // Multiplicar por 10 para más inercia
        }
        
        lastPositionRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
        
        // Limitar el movimiento dentro de la ventana (con márgenes para el botón)
        const minX = isButtonMode ? margin - elementSize + 20 : 0
        const maxX = isButtonMode ? window.innerWidth - margin - 20 : window.innerWidth - elementSize
        const minY = margin
        const maxY = window.innerHeight - elementHeight - margin
        
        setPosition({
          x: Math.max(minX, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      
      // Aplicar inercia si hay velocidad significativa
      if (Math.abs(velocity.x) > 0.5 || Math.abs(velocity.y) > 0.5) {
        setIsAnimating(true)
        animateWithInertia()
      }
    }

    const animateWithInertia = () => {
      const isButtonMode = !isOpen
      const buttonSize = 64
      const margin = 24
      const elementSize = isButtonMode ? buttonSize : (chatbotRef.current?.offsetWidth || 384)
      const elementHeight = isButtonMode ? buttonSize : (chatbotRef.current?.offsetHeight || 600)
      
      const friction = 0.95
      let currentVelX = velocity.x
      let currentVelY = velocity.y
      let currentPos = position || { 
        x: isButtonMode ? window.innerWidth - buttonSize - margin : window.innerWidth - elementSize - 24, 
        y: isButtonMode ? window.innerHeight - buttonSize - margin : window.innerHeight - elementHeight - 24 
      }
      
      const minX = isButtonMode ? margin - elementSize + 20 : 0
      const maxX = isButtonMode ? window.innerWidth - margin - 20 : window.innerWidth - elementSize
      const minY = margin
      const maxY = window.innerHeight - elementHeight - margin
      
      const animate = () => {
        if (Math.abs(currentVelX) < 0.1 && Math.abs(currentVelY) < 0.1) {
          setIsAnimating(false)
          setVelocity({ x: 0, y: 0 })
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
          return
        }
        
        let newX = currentPos.x + currentVelX
        let newY = currentPos.y + currentVelY
        
        // Rebotar en los bordes
        if (newX < minX || newX > maxX) {
          currentVelX *= -0.5
          newX = Math.max(minX, Math.min(newX, maxX))
        }
        if (newY < minY || newY > maxY) {
          currentVelY *= -0.5
          newY = Math.max(minY, Math.min(newY, maxY))
        }
        
        currentPos = { x: newX, y: newY }
        setPosition(currentPos)
        currentVelX *= friction
        currentVelY *= friction
        
        animationFrameRef.current = requestAnimationFrame(animate)
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    } else {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isDragging, dragStart, velocity, position])

  if (!isOpen) {
    // Calcular posición para el botón flotante en la orilla
    const getButtonPosition = () => {
      if (position) {
        // Asegurar que el botón no se salga de los bordes
        const buttonSize = 64
        const margin = 24
        const clampedX = Math.max(margin - buttonSize + 20, Math.min(position.x, window.innerWidth - margin - 20))
        const clampedY = Math.max(margin, Math.min(position.y, window.innerHeight - buttonSize - margin))
        
        return {
          left: `${clampedX}px`,
          top: `${clampedY}px`,
          right: 'auto',
          bottom: 'auto',
          transition: isAnimating || isClosing ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      }
      return {
        right: '24px',
        bottom: '24px',
        transition: isClosing ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
    
    // Estilo para animación de cierre hacia la orilla
    const getClosingButtonStyle = () => {
      if (isClosing && position && closeDirection) {
        const buttonSize = 64
        const margin = 24
        const finalX = closeDirection === 'left' 
          ? margin - buttonSize + 20
          : window.innerWidth - margin - 20
        
        const distanceX = finalX - position.x
        
        return {
          transform: `translateX(${distanceX}px)`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
      return {}
    }

    return (
      <div 
        className="fixed z-50"
        style={{
          ...getButtonPosition(),
          ...getClosingButtonStyle(),
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
          willChange: isDragging || isAnimating || isClosing ? 'transform' : 'auto',
          animation: !position && !isClosing ? 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <Button
          onClick={() => {
            setIsOpening(true)
            
            // Ajustar posición para que el chatbot abierto quede completamente visible
            const chatbotWidth = 384 // w-96 = 384px
            const chatbotHeight = 600 // altura aproximada
            const margin = 24
            const buttonSize = 64
            
            let newX: number
            let newY: number
            
            if (position) {
              const centerX = window.innerWidth / 2
              const isOnLeft = position.x < centerX
              
              // Mantener en el mismo lado (izquierda o derecha)
              if (isOnLeft) {
                // Si estaba en la izquierda, mantenerlo en la izquierda
                newX = margin
              } else {
                // Si estaba en la derecha, mantenerlo en la derecha
                newX = window.innerWidth - chatbotWidth - margin
              }
              
              // Ajustar Y para que quede centrado verticalmente respecto al botón y visible
              const centerYFromButton = position.y - (chatbotHeight / 2 - buttonSize / 2)
              newY = Math.max(margin, Math.min(
                centerYFromButton,
                window.innerHeight - chatbotHeight - margin
              ))
              
              // Si la posición ajustada se sale por arriba o abajo, centrarla verticalmente
              if (newY < margin) {
                newY = Math.max(margin, (window.innerHeight - chatbotHeight) / 2)
              }
              if (newY > window.innerHeight - chatbotHeight - margin) {
                newY = window.innerHeight - chatbotHeight - margin
              }
            } else {
              // Si no hay posición, usar posición predeterminada (esquina inferior derecha)
              newX = window.innerWidth - chatbotWidth - margin
              newY = window.innerHeight - chatbotHeight - margin
            }
            
            setPosition({ x: newX, y: newY })
            setIsOpen(true)
            
            setTimeout(() => {
              setIsOpening(false)
              inputRef.current?.focus()
            }, 500)
          }}
          className="h-16 w-16 rounded-full text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:rotate-12 group relative overflow-hidden"
          style={{ background: 'var(--gradient-cliente)' }}
          size="icon"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'var(--gradient-cliente-secondary)' }} />
          <Bot className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: 'var(--color-green)' }} />
        </Button>
      </div>
    )
  }

  // Calcular posición para el cierre animado hacia la orilla
  const getClosingStyle = () => {
    if (isClosing && chatbotRef.current && position !== null) {
      // Calcular posición final en la orilla (dejando solo 20px visible)
      const finalX = closeDirection === 'left' 
        ? -chatbotRef.current.offsetWidth + 20
        : window.innerWidth - 20
      
      const distanceX = finalX - position.x
      
      return {
        transform: `translateX(${distanceX}px)`,
        opacity: 0.3,
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out'
      }
    }
    return {}
  }

  // Calcular estilo de apertura
  const getOpeningStyle = () => {
    if (isOpening && !isClosing && chatbotRef.current) {
      // Estado inicial - se anima automáticamente al estado final
      return {
        transform: 'scale(0.8) translateY(20px)',
        opacity: 0,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out'
      }
    }
    if (!isOpening && !isClosing && isOpen) {
      // Estado final después de la animación de apertura
      return {
        transform: 'scale(1) translateY(0)',
        opacity: 1,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out'
      }
    }
    return {}
  }

  return (
    <div 
      ref={chatbotRef}
      className="fixed z-50 w-96 max-w-[calc(100vw-2rem)]"
      style={{
        ...(position ? {
          left: `${position.x}px`,
          top: `${position.y}px`,
          right: 'auto',
          bottom: 'auto'
        } : {
          right: '24px',
          bottom: '24px'
        }),
        ...(isClosing || isOpening ? {} : {
          transition: isAnimating ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }),
        ...getClosingStyle(),
        ...getOpeningStyle(),
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        willChange: isDragging || isAnimating || isClosing || isOpening ? 'transform' : 'auto'
      }}
    >
      <Card className="shadow-2xl overflow-hidden chatbot-card" style={{ 
        border: '1px solid var(--cliente-border)',
        backgroundColor: 'var(--cliente-card)',
        fontFamily: 'var(--font-untitled-sans)'
      }}>
        <CardHeader 
          className="text-white p-5 flex flex-row items-center justify-between relative overflow-hidden chatbot-header" 
          style={{ 
            background: 'var(--gradient-cliente)',
            cursor: 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white animate-pulse" style={{ backgroundColor: 'var(--color-green)' }} />
            </div>
            <div>
              <CardTitle className="text-lg font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-untitled-sans)' }}>
                Asistente CalzaTecIA
              </CardTitle>
              <p className="text-xs text-white/80 font-semibold" style={{ fontFamily: 'var(--font-untitled-sans)' }}>En línea</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
              onClick={() => {
                if (chatbotRef.current) {
                  const rect = chatbotRef.current.getBoundingClientRect()
                  const centerX = window.innerWidth / 2
                  const chatbotCenterX = rect.left + rect.width / 2
                  
                  // Determinar dirección según la posición (orilla más cercana)
                  const direction = chatbotCenterX < centerX ? 'left' : 'right'
                  setCloseDirection(direction)
                  setIsClosing(true)
                  
                  // Calcular posición final en la orilla para el botón circular (64px de ancho)
                  const buttonSize = 64
                  const margin = 24
                  const currentY = position?.y !== undefined 
                    ? Math.max(margin, Math.min(position.y, window.innerHeight - buttonSize - margin))
                    : Math.max(margin, Math.min(rect.top - window.scrollY, window.innerHeight - buttonSize - margin))
                  
                  const finalPosition = direction === 'left' 
                    ? { x: margin - buttonSize + 20, y: currentY } // Deja 20px visible a la izquierda
                    : { x: window.innerWidth - margin - 20, y: currentY } // Deja 20px visible a la derecha
                  
                  // Cerrar después de la animación
                  setTimeout(() => {
                    setPosition(finalPosition)
                    setIsOpen(false)
                    setIsClosing(false)
                    setCloseDirection(null)
                  }, 500)
                } else {
                  setIsOpen(false)
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        {!isMinimized && (
          <>
            <CardContent className="p-0">
              <div className="h-[450px] overflow-y-auto p-5 space-y-4 chatbot-messages" style={{ 
                backgroundColor: 'var(--cliente-card)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>
                {mensajes.map((mensaje, index) => (
                  <div
                    key={mensaje.id}
                    className={cn(
                      'flex gap-3 animate-fade-in-up chatbot-message',
                      mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {mensaje.tipo === 'bot' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 chatbot-avatar" style={{ 
                        background: 'var(--gradient-cliente)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-5 py-3 shadow-lg chatbot-bubble transition-all duration-300',
                        mensaje.tipo === 'usuario' ? 'chatbot-bubble-user' : 'chatbot-bubble-bot'
                      )}
                      style={mensaje.tipo === 'usuario' ? {
                        background: 'var(--gradient-cliente)',
                        color: 'var(--cliente-text-primary)'
                      } : {
                        backgroundColor: 'var(--cliente-900)',
                        color: 'var(--cliente-text-primary)',
                        border: '1px solid var(--cliente-border)'
                      }}
                    >
                      <p className="text-sm font-semibold leading-relaxed" style={{ fontFamily: 'var(--font-untitled-sans)' }}>
                        {mensaje.texto}
                      </p>
                      <p className="text-xs mt-2 font-medium" style={{ 
                        color: mensaje.tipo === 'usuario' ? 'rgba(255, 255, 255, 0.7)' : 'var(--cliente-text-secondary)',
                        fontFamily: 'var(--font-untitled-sans)'
                      }}>
                        {mensaje.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {mensaje.tipo === 'usuario' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 chatbot-avatar" style={{ 
                        background: 'var(--gradient-cliente-secondary)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start animate-fade-in-up chatbot-message">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 chatbot-avatar" style={{ 
                      background: 'var(--gradient-cliente)',
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="rounded-2xl px-5 py-3 shadow-lg chatbot-typing" style={{ 
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
              <div className="p-4 backdrop-blur-sm chatbot-input-area" style={{ 
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
                    className="flex-1 rounded-xl px-4 py-3 font-semibold transition-all duration-300 chatbot-input cliente-search-input"
                    style={{ fontFamily: 'var(--font-untitled-sans)' }}
                  />
                  <Button
                    onClick={enviarMensaje}
                    disabled={!inputMensaje.trim()}
                    className="rounded-xl px-5 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 chatbot-send-button"
                    style={{ 
                      background: 'var(--gradient-cliente)',
                      color: 'var(--cliente-text-primary)',
                      fontFamily: 'var(--font-untitled-sans)'
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

