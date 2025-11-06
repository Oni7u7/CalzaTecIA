'use client'

import React, { useState, useEffect } from 'react'
import { useInventarioGlobal } from '@/hooks/useInventario'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, AlertTriangle, TrendingDown, Download, ChevronDown, ChevronRight } from 'lucide-react'

interface Producto {
  sku: string
  nombre: string
  categoria: string
  stockTotal: number
  valorTotal: number
  distribucion: { tienda: string; stock: number }[]
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado'
}

const productosSimulados: Producto[] = [
  {
    sku: 'ZAP-001',
    nombre: 'Bota Casual Negra',
    categoria: 'Casual',
    stockTotal: 245,
    valorTotal: 122500,
    distribucion: [
      { tienda: 'Centro', stock: 80 },
      { tienda: 'Sur', stock: 60 },
      { tienda: 'Norte', stock: 45 },
      { tienda: 'Satélite', stock: 40 },
      { tienda: 'Santa Fe', stock: 20 },
    ],
    estado: 'Disponible',
  },
  {
    sku: 'ZAP-002',
    nombre: 'Tenis Deportivo Blanco',
    categoria: 'Deportivo',
    stockTotal: 189,
    valorTotal: 94500,
    distribucion: [
      { tienda: 'Centro', stock: 50 },
      { tienda: 'Sur', stock: 45 },
      { tienda: 'Norte', stock: 40 },
      { tienda: 'Satélite', stock: 35 },
      { tienda: 'Santa Fe', stock: 19 },
    ],
    estado: 'Disponible',
  },
  {
    sku: 'ZAP-003',
    nombre: 'Zapato Formal Negro',
    categoria: 'Formal',
    stockTotal: 12,
    valorTotal: 18000,
    distribucion: [
      { tienda: 'Centro', stock: 5 },
      { tienda: 'Sur', stock: 4 },
      { tienda: 'Norte', stock: 2 },
      { tienda: 'Satélite', stock: 1 },
      { tienda: 'Santa Fe', stock: 0 },
    ],
    estado: 'Bajo Stock',
  },
]

export default function InventarioGlobalPage() {
  const [productos] = useState<Producto[]>(productosSimulados)
  const [filtroTienda, setFiltroTienda] = useState<string>('todas')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [productoExpandido, setProductoExpandido] = useState<string | null>(null)
  const [modalReporte, setModalReporte] = useState(false)

  const totalInventario = productos.reduce((sum, p) => sum + p.stockTotal, 0)
  const valorTotal = productos.reduce((sum, p) => sum + p.valorTotal, 0)
  const productosBajoStock = productos.filter((p) => p.estado === 'Bajo Stock').length
  const mermaMes = 2.3

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = filtroCategoria === 'todas' || producto.categoria === filtroCategoria
    const coincideEstado = filtroEstado === 'todos' || producto.estado === filtroEstado
    return coincideCategoria && coincideEstado
  })

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return {
          background: 'rgba(0, 230, 118, 0.2)',
          color: 'var(--color-green)',
          border: '1px solid rgba(0, 230, 118, 0.3)'
        }
      case 'Bajo Stock':
        return {
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }
      case 'Agotado':
        return {
          background: 'rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }
      default:
        return {
          background: 'rgba(148, 163, 184, 0.2)',
          color: 'var(--color-neutral-300)',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }
    }
  }

  const obtenerMaximoStock = (distribucion: { tienda: string; stock: number }[]) => {
    return Math.max(...distribucion.map((d) => d.stock), 1)
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="admin-section-title text-xl sm:text-2xl lg:text-3xl">Inventario Global - Todas las Tiendas</h1>
          <p className="admin-section-subtitle text-sm sm:text-base">Consolidado de inventario de todas las sucursales</p>
        </div>
        <Dialog open={modalReporte} onOpenChange={setModalReporte}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Generar Reporte de Inventario</DialogTitle>
              <DialogDescription className="text-sm">
                Selecciona las opciones para generar el reporte
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Por Tienda</label>
                <Select>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Selecciona una tienda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las tiendas</SelectItem>
                    <SelectItem value="centro">Centro</SelectItem>
                    <SelectItem value="sur">Sur</SelectItem>
                    <SelectItem value="norte">Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Por Categoría</label>
                <Select>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="deportivo">Deportivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rango de Fechas</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" placeholder="Fecha inicio" className="text-sm sm:text-base" />
                  <Input type="date" placeholder="Fecha fin" className="text-sm sm:text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Formato</label>
                <Select>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  alert('Reporte generado exitosamente (simulado)')
                  setModalReporte(false)
                }}
                className="w-full text-sm sm:text-base"
              >
                Generar Reporte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={() => setModalReporte(true)} className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Generar Reporte</span>
          <span className="sm:hidden">Reporte</span>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Inventario Total</p>
              <p className="admin-stat-value">{totalInventario.toLocaleString()} unidades</p>
            </div>
            <Package className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Valor Total</p>
              <p className="admin-stat-value">
                ${(valorTotal / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingDown className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Productos Bajo Stock</p>
              <p className="admin-stat-value">{productosBajoStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8" style={{ color: 'var(--color-teal-300)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Merma del Mes</p>
              <p className="admin-stat-value">{mermaMes}%</p>
            </div>
            <TrendingDown className="w-8 h-8" style={{ color: '#ef4444' }} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="admin-stat-card">
        <div className="p-4 sm:p-6">
          <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Filtros Avanzados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Por Tienda</label>
              <Select value={filtroTienda} onValueChange={setFiltroTienda}>
                <SelectTrigger className="login-input">
                  <SelectValue placeholder="Todas las tiendas" />
                </SelectTrigger>
                <SelectContent style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
                  <SelectItem value="todas" style={{ color: 'var(--color-neutral-100)' }}>Todas las tiendas</SelectItem>
                  <SelectItem value="centro" style={{ color: 'var(--color-neutral-100)' }}>Centro</SelectItem>
                  <SelectItem value="sur" style={{ color: 'var(--color-neutral-100)' }}>Sur</SelectItem>
                  <SelectItem value="norte" style={{ color: 'var(--color-neutral-100)' }}>Norte</SelectItem>
                  <SelectItem value="satelite" style={{ color: 'var(--color-neutral-100)' }}>Satélite</SelectItem>
                  <SelectItem value="santafe" style={{ color: 'var(--color-neutral-100)' }}>Santa Fe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Por Categoría</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="login-input">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
                  <SelectItem value="todas" style={{ color: 'var(--color-neutral-100)' }}>Todas las categorías</SelectItem>
                  <SelectItem value="Casual" style={{ color: 'var(--color-neutral-100)' }}>Casual</SelectItem>
                  <SelectItem value="Formal" style={{ color: 'var(--color-neutral-100)' }}>Formal</SelectItem>
                  <SelectItem value="Deportivo" style={{ color: 'var(--color-neutral-100)' }}>Deportivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Por Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="login-input">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
                  <SelectItem value="todos" style={{ color: 'var(--color-neutral-100)' }}>Todos los estados</SelectItem>
                  <SelectItem value="Disponible" style={{ color: 'var(--color-neutral-100)' }}>Disponible</SelectItem>
                  <SelectItem value="Bajo Stock" style={{ color: 'var(--color-neutral-100)' }}>Bajo Stock</SelectItem>
                  <SelectItem value="Agotado" style={{ color: 'var(--color-neutral-100)' }}>Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Rango de Precio</label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Mín" className="flex-1 login-input" />
                <Input type="number" placeholder="Máx" className="flex-1 login-input" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="admin-stat-card">
        <div className="p-4 sm:p-6">
          <h3 className="font-bold text-lg sm:text-xl mb-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Productos Consolidados</h3>
          <p className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Lista de productos con distribución por tienda</p>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-neutral-800)', background: 'var(--color-neutral-800)' }}>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--color-neutral-300)' }}></th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>SKU</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Producto</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden md:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Categoría</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Stock Total</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden lg:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Valor Total</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden xl:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                      Distribución por Tienda
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Estado</th>
                  </tr>
                </thead>
              <tbody>
                {productosFiltrados.map((producto) => {
                  const estaExpandido = productoExpandido === producto.sku
                  const maxStock = obtenerMaximoStock(producto.distribucion)
                  return (
                    <React.Fragment key={producto.sku}>
                      <tr
                        className="border-b transition-colors cursor-pointer"
                        style={{ 
                          borderColor: 'var(--color-neutral-800)',
                          background: 'var(--color-neutral-900)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-neutral-800)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--color-neutral-900)'
                        }}
                        onClick={() =>
                          setProductoExpandido(estaExpandido ? null : producto.sku)
                        }
                      >
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {estaExpandido ? (
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--color-neutral-400)' }} />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--color-neutral-400)' }} />
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)' }}>{producto.sku}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.nombre}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                          <Badge className="font-bold text-xs whitespace-nowrap" style={{ background: 'rgba(35, 247, 221, 0.2)', color: 'var(--color-teal-400)', border: '1px solid rgba(35, 247, 221, 0.3)' }}>{producto.categoria}</Badge>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                          {producto.stockTotal.toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap hidden lg:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                          ${producto.valorTotal.toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 hidden xl:table-cell">
                          <div className="flex items-center gap-1">
                            {producto.distribucion.map((dist, idx) => (
                              <div
                                key={idx}
                                className="rounded"
                                style={{
                                  width: `${(dist.stock / maxStock) * 40}px`,
                                  height: '20px',
                                  minWidth: '4px',
                                  background: 'var(--gradient-secondary)'
                                }}
                                title={`${dist.tienda}: ${dist.stock}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <Badge className="font-bold" style={
                            producto.estado === 'Disponible'
                              ? { background: 'rgba(0, 230, 118, 0.2)', color: 'var(--color-green)', border: '1px solid rgba(0, 230, 118, 0.3)' }
                              : producto.estado === 'Bajo Stock'
                              ? { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }
                              : { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }
                          }>{producto.estado}</Badge>
                        </td>
                      </tr>
                      {estaExpandido && (
                        <tr>
                          <td colSpan={8} className="px-3 sm:px-4 py-3 sm:py-4" style={{ background: 'var(--color-neutral-800)' }}>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-neutral-300)' }}>
                                    Información del Producto
                                  </p>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <span style={{ color: 'var(--color-neutral-300)' }}>SKU:</span>{' '}
                                      <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.sku}</span>
                                    </p>
                                    <p>
                                      <span style={{ color: 'var(--color-neutral-300)' }}>Nombre:</span>{' '}
                                      <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.nombre}</span>
                                    </p>
                                    <p>
                                      <span style={{ color: 'var(--color-neutral-300)' }}>Categoría:</span>{' '}
                                      <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.categoria}</span>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-neutral-300)' }}>
                                    Stock por Tienda
                                  </p>
                                  <div className="space-y-1">
                                    {producto.distribucion.map((dist, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between text-sm"
                                      >
                                        <span style={{ color: 'var(--color-neutral-300)' }}>{dist.tienda}:</span>
                                        <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{dist.stock} unidades</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-neutral-700)' }}>
                                <Button variant="outline" size="sm">
                                  Solicitar Transferencia
                                </Button>
                                <Button variant="outline" size="sm">
                                  Ajuste de Inventario Global
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-teal-300)' }} />
            Alertas de Inventario
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(35, 247, 221, 0.1)', border: '1px solid rgba(35, 247, 221, 0.3)' }}>
              <p className="font-bold" style={{ color: 'var(--color-teal-400)', fontFamily: 'var(--font-family-roobert-pro)' }}>Productos Críticos</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-300)' }}>
                {productosBajoStock} productos con stock bajo o agotado
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p className="font-bold" style={{ color: '#ef4444', fontFamily: 'var(--font-family-roobert-pro)' }}>Productos Sin Movimiento</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-300)' }}>
                12 productos sin movimiento en los últimos 90 días
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p className="font-bold" style={{ color: '#ef4444', fontFamily: 'var(--font-family-roobert-pro)' }}>Sobre-Inventario Detectado</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-300)' }}>
                5 productos con exceso de inventario detectado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
