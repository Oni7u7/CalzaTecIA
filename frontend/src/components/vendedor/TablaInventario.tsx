'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, Search } from 'lucide-react'

interface Producto {
  sku: string
  producto: string
  categoria: string
  talla: string
  cantidad: number
  precio: number
  estado: 'Disponible' | 'Agotado'
}

interface TablaInventarioProps {
  productos: Producto[]
  onProductosChange?: (productos: Producto[]) => void
}

export function TablaInventario({ productos, onProductosChange }: TablaInventarioProps) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  const categorias = Array.from(new Set(productos.map((p) => p.categoria)))

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.producto.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = filtroCategoria === 'todas' || p.categoria === filtroCategoria
    const coincideEstado = filtroEstado === 'todos' || p.estado === filtroEstado

    return coincideBusqueda && coincideCategoria && coincideEstado
  })

  const productosStockBajo = productosFiltrados.filter((p) => p.cantidad < 5 && p.estado === 'Disponible')

  return (
    <Card style={{ 
      background: 'var(--color-neutral-900)', 
      border: '1px solid var(--color-neutral-800)' 
    }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ 
          color: 'var(--color-neutral-100)', 
          fontFamily: 'var(--font-family-roobert-pro)' 
        }}>
          <Package className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
          Inventario de Productos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 z-10 pointer-events-none" style={{ color: 'var(--color-teal-400)' }} />
            <Input
              placeholder="Buscar por SKU o nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 sm:pl-10 login-input text-sm sm:text-base"
            />
          </div>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-full sm:w-48 login-input text-sm sm:text-base">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)' 
            }}>
              <SelectItem value="todas" style={{ color: 'var(--color-neutral-100)' }}>Todas las categorías</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat} style={{ color: 'var(--color-neutral-100)' }}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-full sm:w-48 login-input text-sm sm:text-base">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)' 
            }}>
              <SelectItem value="todos" style={{ color: 'var(--color-neutral-100)' }}>Todos los estados</SelectItem>
              <SelectItem value="Disponible" style={{ color: 'var(--color-neutral-100)' }}>Disponible</SelectItem>
              <SelectItem value="Agotado" style={{ color: 'var(--color-neutral-100)' }}>Agotado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alertas de stock bajo */}
        {productosStockBajo.length > 0 && (
          <div 
            className="p-3 rounded-lg"
            style={{ 
              background: 'rgba(35, 247, 221, 0.1)',
              border: '1px solid rgba(35, 247, 221, 0.3)'
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--color-teal-400)' }}>
              ⚠️ {productosStockBajo.length} producto(s) con stock bajo (&lt;5 unidades)
            </p>
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr style={{ 
                  background: 'var(--color-neutral-800)',
                  borderBottom: '1px solid var(--color-neutral-700)'
                }}>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>SKU</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Producto</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden md:table-cell" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Categoría</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Talla</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Cantidad</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden lg:table-cell" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Precio</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ 
                    color: 'var(--color-neutral-100)', 
                    fontFamily: 'var(--font-family-roobert-pro)' 
                  }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto, index) => (
                  <tr
                    key={index}
                    className="transition-colors"
                    style={{ 
                      borderBottom: '1px solid var(--color-neutral-800)',
                      background: producto.cantidad < 5 
                        ? 'rgba(35, 247, 221, 0.05)' 
                        : 'var(--color-neutral-900)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-neutral-800)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = producto.cantidad < 5 
                        ? 'rgba(35, 247, 221, 0.05)' 
                        : 'var(--color-neutral-900)'
                    }}
                  >
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)' }}>{producto.sku}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.producto}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap hidden md:table-cell" style={{ color: 'var(--color-neutral-300)' }}>{producto.categoria}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--color-neutral-300)' }}>{producto.talla}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.cantidad}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap hidden lg:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>${producto.precio.toLocaleString()}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <Badge
                        className="font-bold text-xs whitespace-nowrap"
                        style={{
                          background: producto.estado === 'Disponible'
                            ? 'rgba(0, 230, 118, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                          color: producto.estado === 'Disponible'
                            ? 'var(--color-green)'
                            : '#ef4444',
                          border: producto.estado === 'Disponible'
                            ? '1px solid rgba(0, 230, 118, 0.3)'
                            : '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        {producto.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {productosFiltrados.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--color-neutral-400)' }}>
              No se encontraron productos con los filtros aplicados.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


