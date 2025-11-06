'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Package } from 'lucide-react'

interface Producto {
  sku: string
  nombre: string
  categoria: string
  stockTotal: number
  valorTotal: number
  distribucion: { tienda: string; stock: number }[]
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado'
}

interface TablaInventarioGlobalProps {
  productos: Producto[]
  filtros?: {
    tienda?: string
    categoria?: string
    estado?: string
  }
  onProductClick?: (producto: Producto) => void
}

export function TablaInventarioGlobal({
  productos,
  filtros = {},
  onProductClick,
}: TablaInventarioGlobalProps) {
  const [productoExpandido, setProductoExpandido] = useState<string | null>(null)

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      !filtros.categoria || producto.categoria === filtros.categoria
    const coincideEstado = !filtros.estado || producto.estado === filtros.estado
    return coincideCategoria && coincideEstado
  })

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return 'bg-green-100 text-green-800'
      case 'Bajo Stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'Agotado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const obtenerMaximoStock = (distribucion: { tienda: string; stock: number }[]) => {
    return Math.max(...distribucion.map((d) => d.stock), 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Consolidados</CardTitle>
        <CardDescription>Lista de productos con distribución por tienda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"></th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Stock Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Valor Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Distribución por Tienda
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                const estaExpandido = productoExpandido === producto.sku
                const maxStock = obtenerMaximoStock(producto.distribucion)
                return (
                  <>
                    <tr
                      key={producto.sku}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        setProductoExpandido(estaExpandido ? null : producto.sku)
                      }
                    >
                      <td className="px-4 py-3">
                        {estaExpandido ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        {producto.sku}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-blue-100 text-blue-800">{producto.categoria}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {producto.stockTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ${producto.valorTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {producto.distribucion.map((dist, idx) => (
                            <div
                              key={idx}
                              className="bg-blue-500 rounded"
                              style={{
                                width: `${(dist.stock / maxStock) * 40}px`,
                                height: '20px',
                                minWidth: '4px',
                              }}
                              title={`${dist.tienda}: ${dist.stock}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={obtenerColorEstado(producto.estado)}>
                          {producto.estado}
                        </Badge>
                      </td>
                    </tr>
                    {estaExpandido && (
                      <tr>
                        <td colSpan={8} className="px-4 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Información del Producto
                                </p>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="text-gray-600">SKU:</span>{' '}
                                    <span className="font-medium">{producto.sku}</span>
                                  </p>
                                  <p>
                                    <span className="text-gray-600">Nombre:</span>{' '}
                                    <span className="font-medium">{producto.nombre}</span>
                                  </p>
                                  <p>
                                    <span className="text-gray-600">Categoría:</span>{' '}
                                    <span className="font-medium">{producto.categoria}</span>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Stock por Tienda
                                </p>
                                <div className="space-y-1">
                                  {producto.distribucion.map((dist, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-gray-600">{dist.tienda}:</span>
                                      <span className="font-medium">{dist.stock} unidades</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProductClick?.(producto)
                                }}
                              >
                                Solicitar Transferencia
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  alert('Ajuste de inventario global (simulado)')
                                }}
                              >
                                Ajuste de Inventario Global
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
          {productosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No se encontraron productos con los filtros aplicados</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



