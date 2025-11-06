'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, TrendingUp, Target, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react'
import { obtenerVentas, Venta } from '@/lib/pos'

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [mounted, setMounted] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({
    ventasCount: 0,
    totalVendido: 0,
    ticketPromedio: 0
  })

  useEffect(() => {
    setMounted(true)
    const ventasGuardadas = obtenerVentas()
    setVentas(ventasGuardadas)
  }, [])

  // Calcular estadísticas del día
  const fechaHoy = new Date().toLocaleDateString('es-MX')
  const ventasHoy = ventas.filter((v) => v.fecha === fechaHoy)
  const totalVendido = ventasHoy.reduce((sum, v) => sum + v.total, 0)
  const ticketPromedio = ventasHoy.length > 0 ? Math.round(totalVendido / ventasHoy.length) : 0

  // Animación de números (count-up effect)
  useEffect(() => {
    if (!mounted) return

    const duration = 1500 // 1.5 segundos
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const targetValues = {
      ventasCount: ventasHoy.length,
      totalVendido: totalVendido,
      ticketPromedio: ticketPromedio
    }

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Easing function

      setAnimatedValues({
        ventasCount: Math.round(targetValues.ventasCount * easeOut),
        totalVendido: Math.round(targetValues.totalVendido * easeOut),
        ticketPromedio: Math.round(targetValues.ticketPromedio * easeOut)
      })

      if (currentStep >= steps) {
        setAnimatedValues(targetValues)
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [mounted, ventasHoy.length, totalVendido, ticketPromedio])

  const nombresMetodoPago: Record<string, string> = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta Débito',
    tarjeta_credito: 'Tarjeta Crédito',
    transferencia: 'Transferencia',
  }

  const getMetodoPagoColor = (metodo: string) => {
    const colors: Record<string, string> = {
      efectivo: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300',
      tarjeta_debito: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300',
      tarjeta_credito: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300',
      transferencia: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-300',
    }
    return colors[metodo] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300'
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #fcf7ee 0%, #f6e9cf 50%, #fcf7ee 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 15s ease infinite'
      }}
    >
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(210, 128, 46, 0.4) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(226, 182, 103, 0.4) 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        />
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header con animación */}
        <div 
          className="text-center space-y-3 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div 
              className="p-3 rounded-2xl shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #d2802e 0%, #e2b667 100%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold"
              style={{ 
                color: '#68301f',
                textShadow: '0 2px 10px rgba(210, 128, 46, 0.3)',
                fontFamily: 'var(--font-untitled-sans)'
              }}
            >
              Historial de Ventas
            </h1>
          </div>
          <p 
            className="text-base sm:text-lg font-semibold"
            style={{ color: '#7f3921' }}
          >
            Registro de todas las ventas realizadas
          </p>
        </div>

        {/* Estadísticas del Día con animaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Tarjeta 1: Ventas Realizadas */}
          <Card 
            className="border-2 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group"
            style={{ 
              borderColor: '#ecd29b',
              animation: 'fadeInUp 0.6s ease-out',
              animationDelay: '0.2s',
              animationFillMode: 'both'
            }}
          >
            {/* Efecto de brillo en hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(210, 128, 46, 0.1) 0%, transparent 50%)'
              }}
            />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p 
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: '#9b4722' }}
                  >
                    Ventas Realizadas
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl font-extrabold transition-all duration-300"
                    style={{ 
                      color: '#68301f',
                      fontFamily: 'var(--font-untitled-sans)',
                      textShadow: '0 2px 8px rgba(210, 128, 46, 0.2)'
                    }}
                  >
                    {animatedValues.ventasCount}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#9b4722' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoy</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #d2802e 0%, #e2b667 100%)',
                    boxShadow: '0 8px 24px rgba(210, 128, 46, 0.4)'
                  }}
                >
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta 2: Total Vendido */}
          <Card 
            className="border-2 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group"
            style={{ 
              borderColor: '#ecd29b',
              animation: 'fadeInUp 0.6s ease-out',
              animationDelay: '0.4s',
              animationFillMode: 'both'
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(210, 128, 46, 0.1) 0%, transparent 50%)'
              }}
            />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p 
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: '#9b4722' }}
                  >
                    Total Vendido
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl font-extrabold transition-all duration-300"
                    style={{ 
                      color: '#d2802e',
                      fontFamily: 'var(--font-untitled-sans)',
                      textShadow: '0 2px 8px rgba(210, 128, 46, 0.3)'
                    }}
                  >
                    ${animatedValues.totalVendido.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#9b4722' }}>
                    <TrendingUp className="w-4 h-4" />
                    <span>Acumulado</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #d2802e 0%, #e2b667 100%)',
                    boxShadow: '0 8px 24px rgba(210, 128, 46, 0.4)'
                  }}
                >
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta 3: Ticket Promedio */}
          <Card 
            className="border-2 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group"
            style={{ 
              borderColor: '#ecd29b',
              animation: 'fadeInUp 0.6s ease-out',
              animationDelay: '0.6s',
              animationFillMode: 'both'
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(210, 128, 46, 0.1) 0%, transparent 50%)'
              }}
            />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p 
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: '#9b4722' }}
                  >
                    Ticket Promedio
                  </p>
                  <p 
                    className="text-3xl sm:text-4xl font-extrabold transition-all duration-300"
                    style={{ 
                      color: '#d2802e',
                      fontFamily: 'var(--font-untitled-sans)',
                      textShadow: '0 2px 8px rgba(210, 128, 46, 0.3)'
                    }}
                  >
                    ${animatedValues.ticketPromedio.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#9b4722' }}>
                    <Target className="w-4 h-4" />
                    <span>Promedio</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #d2802e 0%, #e2b667 100%)',
                    boxShadow: '0 8px 24px rgba(210, 128, 46, 0.4)'
                  }}
                >
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Ventas con animaciones */}
        <Card 
          className="border-2 bg-white shadow-xl relative overflow-hidden"
          style={{ 
            borderColor: '#ecd29b',
            animation: 'fadeInUp 0.8s ease-out',
            animationDelay: '0.8s',
            animationFillMode: 'both'
          }}
        >
          <CardHeader 
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fcf7ee 0%, #f6e9cf 50%, #fcf7ee 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 10s ease infinite'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #d2802e 0%, #e2b667 100%)',
                  boxShadow: '0 4px 12px rgba(210, 128, 46, 0.3)'
                }}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle 
                  className="text-xl sm:text-2xl font-extrabold"
                  style={{ color: '#68301f' }}
                >
                  Ventas Realizadas
                </CardTitle>
                <CardDescription 
                  className="text-sm font-semibold"
                  style={{ color: '#7f3921' }}
                >
                  Historial completo de ventas procesadas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {ventas.length === 0 ? (
              <div 
                className="text-center py-16 px-4"
                style={{ color: '#9b4722' }}
              >
                <div 
                  className="inline-block p-6 rounded-3xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(210, 128, 46, 0.1) 0%, rgba(226, 182, 103, 0.1) 100%)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                >
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: '#e2b667' }} />
                </div>
                <p className="text-lg font-bold mb-2">No hay ventas registradas</p>
                <p className="text-sm font-semibold opacity-80">Las ventas procesadas aparecerán aquí</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr 
                      className="border-b-2"
                      style={{ 
                        borderColor: '#ecd29b',
                        background: 'linear-gradient(135deg, #fcf7ee 0%, #f6e9cf 100%)'
                      }}
                    >
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#68301f' }}>
                        Fecha
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#68301f' }}>
                        Hora
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#68301f' }}>
                        Ticket
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#68301f' }}>
                        Items
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#68301f' }}>
                        Total
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-extrabold uppercase tracking-wider" style={{ color: '#68301f' }}>
                        Método Pago
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((venta, index) => (
                      <tr
                        key={venta.id}
                        className="border-b transition-all duration-300 hover:shadow-lg group relative"
                        style={{
                          borderColor: '#f6e9cf',
                          background: 'transparent',
                          animation: 'fadeInUp 0.5s ease-out',
                          animationDelay: `${0.9 + index * 0.05}s`,
                          animationFillMode: 'both'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #fcf7ee 0%, #f6e9cf 100%)'
                          e.currentTarget.style.transform = 'scale(1.01)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        <td className="px-4 sm:px-6 py-4 text-sm font-bold" style={{ color: '#68301f' }}>
                          {venta.fecha}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold" style={{ color: '#7f3921' }}>
                          {venta.hora}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span 
                            className="inline-block px-3 py-1 rounded-lg font-mono font-extrabold text-sm"
                            style={{
                              background: 'linear-gradient(135deg, rgba(210, 128, 46, 0.1) 0%, rgba(226, 182, 103, 0.1) 100%)',
                              color: '#d2802e',
                              border: '1px solid rgba(210, 128, 46, 0.3)'
                            }}
                          >
                            #{venta.numeroTicket}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold" style={{ color: '#7f3921' }}>
                          <span className="inline-flex items-center gap-2">
                            <span>{venta.items.length}</span>
                            <span className="text-xs opacity-70">items</span>
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span 
                            className="text-lg font-extrabold inline-block"
                            style={{ 
                              color: '#d2802e',
                              textShadow: '0 1px 3px rgba(210, 128, 46, 0.2)'
                            }}
                          >
                            ${venta.total.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <Badge 
                            className={`${getMetodoPagoColor(venta.metodoPago)} border-2 font-bold px-3 py-1 shadow-sm transition-all duration-300 group-hover:scale-110`}
                          >
                            {nombresMetodoPago[venta.metodoPago] || venta.metodoPago}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estilos de animación inline */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}
