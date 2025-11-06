'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProductoCard } from '@/components/cliente/ProductoCard'
import { ResumenCompra } from '@/components/cliente/ResumenCompra'
import { ModalConfirmacion } from '@/components/cliente/ModalConfirmacion'
import { ModalExito } from '@/components/cliente/ModalExito'
import { WatsonChatbot } from '@/components/cliente/WatsonChatbot'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, ShoppingCart, X, Sparkles, Zap, Star } from 'lucide-react'
import { ItemCarrito, calcularTotal, generarNumeroTicket, guardarVenta } from '@/lib/pos'
import { useProductos } from '@/hooks/useProductos'
import { ProductoConInventario } from '@/lib/productos'
import { crearVenta } from '@/lib/supabase/ventas'

interface Producto {
  id: string
  sku: string
  nombre: string
  categoria: string
  precio: number
  talla: string
  stock: number
}

export default function POSPage() {
  const { user } = useAuth()
  const { productos: productosBD, loading: loadingProductos } = useProductos({ 
    activo: true,
    limite: 50,
    autoFetch: true
  })

  // Convertir productos de BD al formato esperado
  const [productos, setProductos] = useState<Producto[]>([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  const [productoAgregado, setProductoAgregado] = useState<string>('')
  
  useEffect(() => {
    if (productosBD && productosBD.length > 0) {
      // Convertir productos de BD al formato del componente
      const productosConvertidos = productosBD.map((p: ProductoConInventario) => ({
        id: p.id,
        sku: p.sku,
        nombre: p.nombre,
        categoria: p.categoria,
        precio: Number(p.precio),
        talla: Array.isArray(p.tallas_disponibles) && p.tallas_disponibles.length > 0 
          ? p.tallas_disponibles[0] 
          : '40',
        stock: p.stock || 0
      }))
      setProductos(productosConvertidos)
    }
  }, [productosBD])
  
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [metodoPago, setMetodoPago] = useState('')
  const [descuento, setDescuento] = useState(0)
  const [modalConfirmacion, setModalConfirmacion] = useState(false)
  const [modalExito, setModalExito] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [numeroTicket, setNumeroTicket] = useState('')
  const [totalVenta, setTotalVenta] = useState(0)

  // Filtrar productos
  const filtrarProductos = (busqueda: string, categoria: string) => {
    let filtrados = productos

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      filtrados = filtrados.filter(
        (p) => p.sku.toLowerCase().includes(busquedaLower) || p.nombre.toLowerCase().includes(busquedaLower)
      )
    }

    if (categoria !== 'todas') {
      filtrados = filtrados.filter((p) => p.categoria === categoria)
    }

    setProductosFiltrados(filtrados)
  }

  // Actualizar filtros cuando cambian
  useEffect(() => {
    if (productos.length > 0) {
      filtrarProductos(busqueda, categoriaFiltro)
    }
  }, [busqueda, categoriaFiltro, productos])

  const handleBusquedaChange = (value: string) => {
    setBusqueda(value)
    filtrarProductos(value, categoriaFiltro)
  }

  const handleCategoriaChange = (value: string) => {
    setCategoriaFiltro(value)
    filtrarProductos(busqueda, value)
  }

  // Agregar al carrito con animación (sin abrir automáticamente)
  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find((item) => item.producto.id === producto.id)

    if (itemExistente) {
      // Incrementar cantidad si no excede el stock
      if (itemExistente.cantidad < producto.stock) {
        setCarrito(
          carrito.map((item) =>
            item.id === itemExistente.id
              ? {
                  ...item,
                  cantidad: item.cantidad + 1,
                  subtotal: (item.cantidad + 1) * item.producto.precio,
                }
              : item
          )
        )
        // Mostrar notificación sin abrir el carrito
        setProductoAgregado(producto.nombre)
        setMostrarNotificacion(true)
        setTimeout(() => setMostrarNotificacion(false), 3000)
      }
    } else {
      // Agregar nuevo item
      const nuevoItem: ItemCarrito = {
        id: `${producto.id}-${Date.now()}`,
        producto: {
          id: producto.id,
          sku: producto.sku,
          nombre: producto.nombre,
          precio: producto.precio,
          talla: producto.talla,
          stock: producto.stock,
        },
        cantidad: 1,
        subtotal: producto.precio,
      }
      setCarrito([...carrito, nuevoItem])
      // Mostrar notificación sin abrir el carrito automáticamente
      setProductoAgregado(producto.nombre)
      setMostrarNotificacion(true)
      setTimeout(() => setMostrarNotificacion(false), 3000)
    }
  }

  // Incrementar cantidad
  const incrementarCantidad = (id: string) => {
    setCarrito(
      carrito.map((item) => {
        if (item.id === id && item.cantidad < item.producto.stock) {
          const nuevaCantidad = item.cantidad + 1
          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.producto.precio,
          }
        }
        return item
      })
    )
  }

  // Decrementar cantidad
  const decrementarCantidad = (id: string) => {
    setCarrito(
      carrito.map((item) => {
        if (item.id === id && item.cantidad > 1) {
          const nuevaCantidad = item.cantidad - 1
          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.producto.precio,
          }
        }
        return item
      })
    )
  }

  // Eliminar del carrito
  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter((item) => item.id !== id))
  }

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([])
    setDescuento(0)
    setMetodoPago('')
  }

  // Procesar venta
  const procesarVenta = () => {
    if (carrito.length === 0 || !metodoPago) return
    const totales = calcularTotal(carrito, descuento)
    setTotalVenta(totales.total)
    setModalConfirmacion(true)
  }

  // Confirmar venta
  const confirmarVenta = async () => {
    setProcesando(true)
    const totales = calcularTotal(carrito, descuento)
    const ticket = generarNumeroTicket()

    // Simular procesamiento (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Guardar venta
    const venta = {
      id: `venta-${Date.now()}`,
      numeroTicket: ticket,
      fecha: new Date().toLocaleDateString('es-MX'),
      hora: new Date().toLocaleTimeString('es-MX'),
      items: carrito,
      subtotal: totales.subtotal,
      iva: totales.iva,
      descuento: totales.descuento,
      total: totales.total,
      metodoPago,
    }

    guardarVenta(venta)

    setNumeroTicket(ticket)
    setTotalVenta(totales.total)
    setModalConfirmacion(false)
    setModalExito(true)
    setProcesando(false)
    limpiarCarrito()
    setCarritoAbierto(false)
  }

  const nuevaVenta = () => {
    setModalExito(false)
    limpiarCarrito()
  }

  const totales = calcularTotal(carrito, descuento)
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <div className="min-h-screen cliente-page relative overflow-hidden" style={{ background: 'var(--cliente-background)' }}>
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 60%)
            `,
            animation: 'gradientPulse 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* Hero Section Mejorado */}
      <section className="cliente-hero relative z-10">
        <div className="cliente-main-container">
          <div className="text-center space-y-6 animate-fade-in relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                  backdropFilter: 'blur(10px)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              >
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--color-cliente-primary)' }} />
              </div>
              <h1 className="cliente-hero-title">
                Calzado de Calidad
                <br />
                <span style={{ fontSize: '0.85em', fontWeight: 900 }}>× Innovación</span>
              </h1>
              <div 
                className="p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
                  backdropFilter: 'blur(10px)',
                  animation: 'pulse 3s ease-in-out infinite 1.5s'
                }}
              >
                <Zap className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--color-cliente-accent)' }} />
              </div>
            </div>
            <p className="cliente-hero-subtitle animate-slide-in">
              Encuentra el calzado perfecto para cada ocasión
            </p>
            <p className="cliente-hero-description animate-fade-in-up">
              Explora nuestra amplia gama de productos: desde calzado casual hasta zapatos formales, 
              pasando por opciones deportivas y de seguridad. Calidad garantizada en cada paso.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <Star className="w-4 h-4" style={{ color: 'var(--color-cliente-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--cliente-text-primary)' }}>Calidad Premium</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--color-cliente-accent)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--cliente-text-primary)' }}>Envío Rápido</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--color-cliente-accent)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--cliente-text-primary)' }}>Garantía</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="cliente-main-container pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Barra de Búsqueda y Filtros Mejorada */}
          <div className="cliente-filters animate-fade-in mb-6 sm:mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 z-10 transition-all duration-300" style={{ color: 'var(--color-cliente-primary)' }} />
                <Input
                  placeholder="Buscar por SKU o nombre..."
                  value={busqueda}
                  onChange={(e) => handleBusquedaChange(e.target.value)}
                  className="cliente-search-input pl-9 sm:pl-10 text-sm sm:text-base transform transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 font-bold flex-shrink-0 transition-all duration-300 hover:rotate-90" style={{ color: 'var(--color-cliente-accent)' }} />
                <Select value={categoriaFiltro} onValueChange={handleCategoriaChange}>
                  <SelectTrigger className="w-full sm:w-48 cliente-search-input text-sm sm:text-base transform transition-all duration-300 hover:scale-[1.02]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: 'var(--cliente-card)', border: '1px solid var(--cliente-border)' }}>
                    <SelectItem value="todas" style={{ color: 'var(--cliente-text-primary)' }}>Todas las categorías</SelectItem>
                    <SelectItem value="Casual" style={{ color: 'var(--cliente-text-primary)' }}>Casual</SelectItem>
                    <SelectItem value="Formal" style={{ color: 'var(--cliente-text-primary)' }}>Formal</SelectItem>
                    <SelectItem value="Deportivo" style={{ color: 'var(--cliente-text-primary)' }}>Deportivo</SelectItem>
                    <SelectItem value="Seguridad" style={{ color: 'var(--cliente-text-primary)' }}>Seguridad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Grid de Productos Mejorado */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center lg:text-left" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)',
                textShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
              }}>
                Catálogo de Productos
              </h2>
              <Badge className="px-4 py-2 text-sm font-bold shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                color: 'var(--cliente-text-primary)',
                border: '1px solid rgba(99, 102, 241, 0.5)'
              }}>
                {productosFiltrados.length} productos
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {productosFiltrados.map((producto, index) => (
                <div
                  key={producto.id}
                  className="animate-fade-in transform transition-all duration-500 hover:scale-105"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductoCard
                    producto={producto}
                    onAgregar={agregarAlCarrito}
                  />
                </div>
              ))}
            </div>
            {productosFiltrados.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300" style={{ 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Search className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-cliente-primary)' }} />
                  <p className="text-xl font-bold mb-2" style={{ 
                    color: 'var(--cliente-text-primary)',
                    fontFamily: 'var(--font-untitled-sans)'
                  }}>
                    No se encontraron productos
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--cliente-text-secondary)' }}>
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón Flotante del Carrito - Separado del chatbot (más arriba) */}
      <div className="fixed z-50" style={{ bottom: '100px', right: '24px' }}>
        <Button
          onClick={() => setCarritoAbierto(!carritoAbierto)}
          className="relative h-16 w-16 rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-12"
          style={{
            background: 'linear-gradient(135deg, var(--color-cliente-primary) 0%, var(--color-cliente-accent) 100%)',
            boxShadow: '0 10px 40px rgba(99, 102, 241, 0.5)',
            animation: carrito.length > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
          }}
        >
          <ShoppingCart className="w-6 h-6" style={{ color: 'var(--cliente-text-primary)' }} />
          {totalItems > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-0 font-extrabold text-xs border-2"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                borderColor: 'var(--cliente-text-primary)',
                animation: 'bounce 1s ease-in-out infinite'
              }}
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Panel Lateral del Carrito */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] lg:w-[480px] z-40 transform transition-transform duration-500 ease-in-out ${
          carritoAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'var(--cliente-card)',
          borderLeft: '2px solid var(--cliente-border)',
          boxShadow: carritoAbierto ? '-10px 0 40px rgba(0, 0, 0, 0.5)' : 'none'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header del Carrito */}
          <div className="flex items-center justify-between p-6 border-b" style={{ 
            background: 'var(--gradient-cliente)',
            borderColor: 'var(--cliente-border)'
          }}>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" style={{ color: 'var(--cliente-text-primary)' }} />
              <h2 className="text-xl font-extrabold" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>
                Carrito de Compra
              </h2>
              {totalItems > 0 && (
                <Badge className="px-2 py-1 font-bold" style={{
                  background: 'rgba(23, 20, 26, 0.3)',
                  color: 'var(--cliente-text-primary)',
                  border: '1px solid var(--cliente-border)'
                }}>
                  {totalItems} items
                </Badge>
              )}
            </div>
            <Button
              onClick={() => setCarritoAbierto(false)}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-opacity-20 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-5 h-5" style={{ color: 'var(--cliente-text-primary)' }} />
            </Button>
          </div>

          {/* Contenido del Carrito */}
          <div className="flex-1 overflow-hidden">
            <ResumenCompra
              items={carrito}
              metodoPago={metodoPago}
              descuento={descuento}
              onMetodoPagoChange={setMetodoPago}
              onDescuentoChange={setDescuento}
              onLimpiarCarrito={limpiarCarrito}
              onProcesarVenta={procesarVenta}
              onIncrementar={incrementarCantidad}
              onDecrementar={decrementarCantidad}
              onEliminar={eliminarDelCarrito}
            />
          </div>
        </div>
      </div>

      {/* Overlay cuando el carrito está abierto - Más claro */}
      {carritoAbierto && (
        <div 
          className="fixed inset-0 z-30 transition-opacity duration-500"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setCarritoAbierto(false)}
        />
      )}

      {/* Notificación de Producto Agregado Mejorada */}
      {mostrarNotificacion && (
        <div 
          className="fixed top-20 right-6 z-50 animate-slide-in-right"
          style={{
            animation: 'slideInRight 0.5s ease-out'
          }}
        >
          <div 
            className="p-5 rounded-2xl shadow-2xl flex items-center gap-4 transform transition-all duration-500 hover:scale-105 border-2"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              minWidth: '320px',
              boxShadow: '0 10px 40px rgba(99, 102, 241, 0.5)'
            }}
          >
            <div 
              className="p-3 rounded-full animate-pulse"
              style={{ 
                background: 'rgba(255, 255, 255, 0.25)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <Sparkles className="w-6 h-6" style={{ color: '#ffffff' }} />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-base mb-1" style={{ color: '#ffffff' }}>
                ¡Producto agregado!
              </p>
              <p className="text-sm font-semibold opacity-90 mb-2" style={{ color: '#ffffff' }}>
                {productoAgregado}
              </p>
              <Button
                onClick={() => {
                  setCarritoAbierto(true)
                  setMostrarNotificacion(false)
                }}
                className="h-8 text-xs font-bold px-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff'
                }}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                Ver carrito ({totalItems} items)
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMostrarNotificacion(false)}
              className="h-8 w-8 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              <X className="w-4 h-4" style={{ color: '#ffffff' }} />
            </Button>
          </div>
        </div>
      )}

      {/* Modales */}
      <ModalConfirmacion
        open={modalConfirmacion}
        onClose={() => setModalConfirmacion(false)}
        onConfirmar={confirmarVenta}
        items={carrito}
        total={totales.total}
        metodoPago={metodoPago}
        loading={procesando}
      />

      <ModalExito
        open={modalExito}
        onClose={() => setModalExito(false)}
        onNuevaVenta={nuevaVenta}
        numeroTicket={numeroTicket}
        total={totalVenta}
      />

      {/* Chatbot con IBM Watson Assistant */}
      <WatsonChatbot />

      {/* Estilos de animación inline */}
      <style jsx>{`
        @keyframes gradientPulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  )
}
