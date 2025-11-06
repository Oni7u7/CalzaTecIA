'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, TrendingUp, Target, CheckCircle2 } from 'lucide-react'

// Datos simulados
const ventasDia = [
  { fecha: '2025-01-15', hora: '09:30', total: 1250, vendedor: 'Juan Pérez', metodo: 'Efectivo' },
  { fecha: '2025-01-15', hora: '10:15', total: 890, vendedor: 'María García', metodo: 'Tarjeta' },
  { fecha: '2025-01-15', hora: '11:00', total: 2100, vendedor: 'Juan Pérez', metodo: 'Tarjeta' },
  { fecha: '2025-01-15', hora: '12:30', total: 750, vendedor: 'Carlos López', metodo: 'Efectivo' },
  { fecha: '2025-01-15', hora: '14:20', total: 1590, vendedor: 'María García', metodo: 'Tarjeta' },
]

const ventasSemana = [
  { fecha: 'Lun 13', total: 45000 },
  { fecha: 'Mar 14', total: 52000 },
  { fecha: 'Mié 15', total: 48000 },
  { fecha: 'Jue 16', total: 55000 },
  { fecha: 'Vie 17', total: 60000 },
  { fecha: 'Sáb 18', total: 72000 },
  { fecha: 'Dom 19', total: 68000 },
]

const topProductos = [
  { producto: 'Zapatos Deportivos Running', cantidad: 45, ventas: 58455 },
  { producto: 'Botas de Seguridad Industrial', cantidad: 32, ventas: 28768 },
  { producto: 'Zapatos Formales Oxford', cantidad: 28, ventas: 44772 },
  { producto: 'Tenis Deportivos', cantidad: 25, ventas: 27475 },
  { producto: 'Sandalias Casuales', cantidad: 22, ventas: 13178 },
]

const metaVentas = 60000
const ventasActuales = 45230

export default function VentasPage() {
  const maxVentas = Math.max(...ventasSemana.map((v) => v.total))
  const porcentajeMeta = Math.round((ventasActuales / metaVentas) * 100)

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Ventas</h1>
        <p className="mt-2 font-semibold text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Análisis y seguimiento de ventas</p>
      </div>

      {/* Resumen de Ventas */}
      <Tabs defaultValue="dia" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1 sm:gap-2" style={{ 
          background: 'var(--color-neutral-800)', 
          border: '1px solid var(--color-neutral-700)' 
        }}>
          <TabsTrigger 
            value="dia"
            className="font-semibold data-[state=active]:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}
          >
            Día
          </TabsTrigger>
          <TabsTrigger 
            value="semana"
            className="font-semibold data-[state=active]:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}
          >
            Semana
          </TabsTrigger>
          <TabsTrigger 
            value="mes"
            className="font-semibold data-[state=active]:shadow-lg transition-all text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}
          >
            Mes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dia" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Ventas del Día</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>$45,230</p>
                  </div>
                  <ShoppingCart className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
                </div>
              </CardContent>
            </Card>
            <Card style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Transacciones</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{ventasDia.length}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
                </div>
              </CardContent>
            </Card>
            <Card style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Ticket Promedio</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                      ${Math.round(ventasActuales / ventasDia.length).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="semana" className="mt-6">
          <Card style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader>
              <CardTitle style={{ 
                color: 'var(--color-neutral-100)', 
                fontFamily: 'var(--font-family-roobert-pro)' 
              }}>
                Ventas de la Semana
              </CardTitle>
              <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
                Comparativa de ventas diarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ventasSemana.map((dia, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium" style={{ color: 'var(--color-neutral-300)' }}>{dia.fecha}</span>
                      <span style={{ color: 'var(--color-neutral-100)' }}>${dia.total.toLocaleString()}</span>
                    </div>
                    <div className="w-full rounded-full h-3" style={{ background: 'var(--color-neutral-800)' }}>
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${(dia.total / maxVentas) * 100}%`,
                          background: 'var(--gradient-secondary)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes" className="mt-6">
          <Card style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader>
              <CardTitle style={{ 
                color: 'var(--color-neutral-100)', 
                fontFamily: 'var(--font-family-roobert-pro)' 
              }}>
                Ventas del Mes
              </CardTitle>
              <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
                Resumen mensual de ventas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-4xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>$1,250,000</p>
                <p className="mt-2 font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Enero 2025</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comparativa con Meta */}
      <Card style={{ 
        background: 'var(--color-neutral-900)', 
        border: '1px solid var(--color-neutral-800)' 
      }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ 
            color: 'var(--color-neutral-100)', 
            fontFamily: 'var(--font-family-roobert-pro)' 
          }}>
            <Target className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
            Comparativa con Meta
          </CardTitle>
          <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
            Progreso hacia la meta de ventas diaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--color-neutral-300)' }}>Meta: ${metaVentas.toLocaleString()}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-neutral-300)' }}>Actual: ${ventasActuales.toLocaleString()}</span>
            </div>
            <div className="w-full rounded-full h-4" style={{ background: 'var(--color-neutral-800)' }}>
              <div
                className="h-4 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(porcentajeMeta, 100)}%`,
                  background: porcentajeMeta >= 100 
                    ? 'var(--gradient-primary)' 
                    : porcentajeMeta >= 75 
                    ? 'var(--gradient-secondary)' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--color-neutral-300)' }}>{porcentajeMeta}% de la meta</span>
              <Badge
                style={{
                  background: porcentajeMeta >= 100
                    ? 'rgba(0, 230, 118, 0.2)'
                    : porcentajeMeta >= 75
                    ? 'rgba(35, 247, 221, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                  color: porcentajeMeta >= 100
                    ? 'var(--color-green)'
                    : porcentajeMeta >= 75
                    ? 'var(--color-teal-400)'
                    : '#ef4444',
                  border: porcentajeMeta >= 100
                    ? '1px solid rgba(0, 230, 118, 0.3)'
                    : porcentajeMeta >= 75
                    ? '1px solid rgba(35, 247, 221, 0.3)'
                    : '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                {porcentajeMeta >= 100 ? 'Meta Cumplida' : porcentajeMeta >= 75 ? 'En Proceso' : 'Bajo Meta'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Últimas Ventas */}
      <Card style={{ 
        background: 'var(--color-neutral-900)', 
        border: '1px solid var(--color-neutral-800)' 
      }}>
        <CardHeader>
          <CardTitle style={{ 
            color: 'var(--color-neutral-100)', 
            fontFamily: 'var(--font-family-roobert-pro)' 
          }}>
            Últimas Ventas del Día
          </CardTitle>
          <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
            Registro de transacciones recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ 
                  background: 'var(--color-neutral-800)',
                  borderBottom: '1px solid var(--color-neutral-700)'
                }}>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Hora</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Vendedor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Método</th>
                </tr>
              </thead>
              <tbody>
                {ventasDia.map((venta, index) => (
                  <tr
                    key={index}
                    className="transition-colors"
                    style={{ 
                      borderBottom: '1px solid var(--color-neutral-800)',
                      background: 'var(--color-neutral-900)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-neutral-800)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-neutral-900)'
                    }}
                  >
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-neutral-100)' }}>{venta.fecha}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-neutral-300)' }}>{venta.hora}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-neutral-100)' }}>
                      ${venta.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-neutral-300)' }}>{venta.vendedor}</td>
                    <td className="px-4 py-3">
                      <Badge style={{
                        background: 'rgba(35, 247, 221, 0.2)',
                        color: 'var(--color-teal-400)',
                        border: '1px solid rgba(35, 247, 221, 0.3)'
                      }}>
                        {venta.metodo}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Productos */}
      <Card style={{ 
        background: 'var(--color-neutral-900)', 
        border: '1px solid var(--color-neutral-800)' 
      }}>
        <CardHeader>
          <CardTitle style={{ 
            color: 'var(--color-neutral-100)', 
            fontFamily: 'var(--font-family-roobert-pro)' 
          }}>
            Top 5 Productos Más Vendidos
          </CardTitle>
          <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
            Productos con mayor volumen de ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProductos.map((producto, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg transition-colors"
                style={{ 
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ 
                      background: 'var(--gradient-secondary)',
                      color: 'var(--color-neutral-925)'
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.producto}</p>
                    <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>{producto.cantidad} unidades vendidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>${producto.ventas.toLocaleString()}</p>
                  <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>Total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
