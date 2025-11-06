'use client'

import { KPICard } from '@/components/vendedor/KPICard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Package, TrendingUp, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

// Datos simulados
const ventasSemana = [
  { dia: 'Lun', ventas: 45000 },
  { dia: 'Mar', ventas: 52000 },
  { dia: 'Mié', ventas: 48000 },
  { dia: 'Jue', ventas: 55000 },
  { dia: 'Vie', ventas: 60000 },
  { dia: 'Sáb', ventas: 72000 },
  { dia: 'Dom', ventas: 68000 },
]

const tareasPendientes = [
  { id: 1, tarea: 'Revisar inventario de productos con stock bajo', prioridad: 'alta', hora: '09:00' },
  { id: 2, tarea: 'Capacitar nuevo empleado en sistema de ventas', prioridad: 'media', hora: '11:00' },
  { id: 3, tarea: 'Revisar recepción de mercancía programada', prioridad: 'alta', hora: '14:00' },
  { id: 4, tarea: 'Revisar reporte de ventas del día anterior', prioridad: 'baja', hora: '16:00' },
]

const alertasInventario = [
  { producto: 'Zapatos Deportivos - Talla 42', cantidad: 3, sku: 'SKU-001' },
  { producto: 'Botas de Seguridad - Talla 40', cantidad: 2, sku: 'SKU-045' },
  { producto: 'Sandalias Casuales - Talla 38', cantidad: 4, sku: 'SKU-078' },
]

const maxVentas = Math.max(...ventasSemana.map((v) => v.ventas))

export default function VendedorDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
          Dashboard - Gerente de Tienda
        </h1>
        <p className="mt-2 sm:mt-3 font-bold text-base sm:text-lg" style={{ color: 'var(--color-neutral-300)' }}>
          Bienvenido al panel de control operativo
        </p>
      </div>

      {/* KPIs Operativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Ventas Hoy"
          valor="$45,230"
          cambio={{ porcentaje: 12, positivo: true }}
          icono={<ShoppingBag className="w-8 h-8" />}
        />
        <KPICard
          titulo="Inventario"
          valor="2,340"
          icono={<Package className="w-8 h-8" />}
        />
        <KPICard
          titulo="Rotación"
          valor="45 días"
          cambio={{ porcentaje: -5, positivo: false }}
          icono={<TrendingUp className="w-8 h-8" />}
        />
        <KPICard
          titulo="Exactitud"
          valor="94%"
          cambio={{ porcentaje: 3, positivo: true }}
          icono={<CheckCircle2 className="w-8 h-8" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Gráfica de Ventas */}
        <Card style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--color-neutral-100)' }}>Ventas de la Semana</CardTitle>
            <CardDescription style={{ color: 'var(--color-neutral-300)' }}>Comparativa de ventas diarias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ventasSemana.map((dia, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium" style={{ color: 'var(--color-neutral-300)' }}>{dia.dia}</span>
                    <span style={{ color: 'var(--color-neutral-100)' }}>${dia.ventas.toLocaleString()}</span>
                  </div>
                  <div className="w-full rounded-full h-3" style={{ background: 'var(--color-neutral-800)' }}>
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{ 
                        width: `${(dia.ventas / maxVentas) * 100}%`,
                        background: 'var(--gradient-secondary)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tareas Pendientes */}
        <Card style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--color-neutral-100)' }}>Tareas Pendientes del Día</CardTitle>
            <CardDescription style={{ color: 'var(--color-neutral-300)' }}>Lista de actividades programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tareasPendientes.map((tarea) => (
                <div
                  key={tarea.id}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                  style={{ 
                    border: '1px solid var(--color-neutral-800)',
                    background: 'var(--color-neutral-800)'
                  }}
                >
                  <Clock className="w-5 h-5 mt-0.5" style={{ color: 'var(--color-neutral-400)' }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--color-neutral-100)' }}>{tarea.tarea}</span>
                      <Badge
                        style={{
                          background: tarea.prioridad === 'alta' 
                            ? 'rgba(239, 68, 68, 0.2)' 
                            : tarea.prioridad === 'media'
                            ? 'rgba(35, 247, 221, 0.2)'
                            : 'rgba(0, 230, 118, 0.2)',
                          color: tarea.prioridad === 'alta'
                            ? '#ef4444'
                            : tarea.prioridad === 'media'
                            ? 'var(--color-teal-400)'
                            : 'var(--color-green)',
                          border: `1px solid ${tarea.prioridad === 'alta' ? 'rgba(239, 68, 68, 0.3)' : tarea.prioridad === 'media' ? 'rgba(35, 247, 221, 0.3)' : 'rgba(0, 230, 118, 0.3)'}`
                        }}
                      >
                        {tarea.prioridad}
                      </Badge>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>{tarea.hora}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Inventario */}
      <Card style={{ 
        background: 'var(--color-neutral-900)', 
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderLeft: '4px solid #ef4444'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#ef4444' }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
            Alertas de Inventario Bajo
          </CardTitle>
          <CardDescription style={{ color: 'var(--color-neutral-300)' }}>Productos con stock menor a 5 unidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertasInventario.map((alerta, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ 
                  background: 'var(--color-neutral-800)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-neutral-100)' }}>{alerta.producto}</p>
                  <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>SKU: {alerta.sku}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>Stock actual</p>
                    <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{alerta.cantidad}</p>
                  </div>
                  <Badge style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    Bajo
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
