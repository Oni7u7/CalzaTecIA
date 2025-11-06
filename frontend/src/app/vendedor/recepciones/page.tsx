'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TablaEditable } from '@/components/entregables/TablaEditable'
import { Truck, Scan, CheckCircle2, Clock, Package } from 'lucide-react'

// Datos simulados
const proveedores = ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Proveedor D']

const recepcionesRecientes = [
  {
    id: 1,
    proveedor: 'Proveedor A',
    orden: 'ORD-001',
    fecha: '2025-01-15',
    productos: 25,
    estado: 'Completada',
    tiempo: '1.2 horas',
  },
  {
    id: 2,
    proveedor: 'Proveedor B',
    orden: 'ORD-002',
    fecha: '2025-01-14',
    productos: 18,
    estado: 'Completada',
    tiempo: '1.5 horas',
  },
  {
    id: 3,
    proveedor: 'Proveedor C',
    orden: 'ORD-003',
    fecha: '2025-01-13',
    productos: 32,
    estado: 'Completada',
    tiempo: '1.8 horas',
  },
]

interface ProductoRecepcion {
  sku: string
  producto: string
  cantidadEsperada: number
  cantidadRecibida: number
  estado: string
}

export default function RecepcionesPage() {
  const [productosEsperados, setProductosEsperados] = useState<ProductoRecepcion[]>([])
  const [productosEscaneados, setProductosEscaneados] = useState<ProductoRecepcion[]>([])
  const [skuEscaneo, setSkuEscaneo] = useState('')

  const escanearSKU = () => {
    if (!skuEscaneo) return

    // Simular escaneo
    const productoExistente = productosEscaneados.find((p) => p.sku === skuEscaneo)
    if (productoExistente) {
      setProductosEscaneados(
        productosEscaneados.map((p) =>
          p.sku === skuEscaneo
            ? { ...p, cantidadRecibida: p.cantidadRecibida + 1 }
            : p
        )
      )
    } else {
      const productoEsperado = productosEsperados.find((p) => p.sku === skuEscaneo)
      if (productoEsperado) {
        setProductosEscaneados([
          ...productosEscaneados,
          {
            ...productoEsperado,
            cantidadRecibida: 1,
            estado: productoEsperado.cantidadEsperada === 1 ? 'Completo' : 'Parcial',
          },
        ])
      } else {
        // Producto no esperado
        setProductosEscaneados([
          ...productosEscaneados,
          {
            sku: skuEscaneo,
            producto: 'Producto no esperado',
            cantidadEsperada: 0,
            cantidadRecibida: 1,
            estado: 'No esperado',
          },
        ])
      }
    }

    setSkuEscaneo('')
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Recepciones</h1>
        <p className="mt-2 font-semibold text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Gestiona las recepciones de mercancía</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de Nueva Recepción */}
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)' 
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ 
              color: 'var(--color-neutral-100)', 
              fontFamily: 'var(--font-family-roobert-pro)' 
            }}>
              <Truck className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
              Nueva Recepción
            </CardTitle>
            <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
              Registra una nueva recepción de mercancía
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: 'var(--color-neutral-300)' }}>Proveedor</Label>
              <Select>
                <SelectTrigger className="login-input">
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent style={{ 
                  background: 'var(--color-neutral-900)', 
                  border: '1px solid var(--color-neutral-800)' 
                }}>
                  {proveedores.map((proveedor) => (
                    <SelectItem key={proveedor} value={proveedor} style={{ color: 'var(--color-neutral-100)' }}>
                      {proveedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--color-neutral-300)' }}>Número de Orden</Label>
              <Input placeholder="ORD-XXX" className="login-input" />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--color-neutral-300)' }}>Fecha Programada</Label>
              <Input type="date" className="login-input" />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'var(--color-neutral-300)' }}>Productos Esperados</Label>
              <TablaEditable
                columnas={[
                  { key: 'sku', label: 'SKU', type: 'text' },
                  { key: 'producto', label: 'Producto', type: 'text' },
                  { key: 'cantidadEsperada', label: 'Cantidad Esperada', type: 'number' },
                ]}
                datos={productosEsperados}
                onDatosChange={(datos) => {
                  setProductosEsperados(
                    datos.map((d) => ({
                      sku: d.sku || '',
                      producto: d.producto || '',
                      cantidadEsperada: Number(d.cantidadEsperada) || 0,
                      cantidadRecibida: 0,
                      estado: '',
                    }))
                  )
                }}
                onAgregarFila={() => {
                  setProductosEsperados([
                    ...productosEsperados,
                    { sku: '', producto: '', cantidadEsperada: 0, cantidadRecibida: 0, estado: '' },
                  ])
                }}
                onEliminarFila={(index) => {
                  setProductosEsperados(productosEsperados.filter((_, i) => i !== index))
                }}
              />
            </div>
            <Button 
              className="w-full font-bold shadow-lg"
              style={{
                background: 'var(--gradient-secondary)',
                color: 'var(--color-neutral-925)',
                boxShadow: '0 4px 14px rgba(35, 247, 221, 0.3)'
              }}
            >
              Guardar Recepción Programada
            </Button>
          </CardContent>
        </Card>

        {/* Simulador de Escaneo */}
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)' 
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ 
              color: 'var(--color-neutral-100)', 
              fontFamily: 'var(--font-family-roobert-pro)' 
            }}>
              <Scan className="w-5 h-5" style={{ color: 'var(--color-teal-400)' }} />
              Simulador de Escaneo
            </CardTitle>
            <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
              Ingresa el SKU para simular el escaneo de código de barras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ingresa SKU..."
                value={skuEscaneo}
                onChange={(e) => setSkuEscaneo(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    escanearSKU()
                  }
                }}
                className="login-input flex-1"
              />
              <Button 
                onClick={escanearSKU} 
                className="flex items-center gap-2 font-bold shadow-lg"
                style={{
                  background: 'var(--gradient-secondary)',
                  color: 'var(--color-neutral-925)',
                  boxShadow: '0 4px 14px rgba(35, 247, 221, 0.3)'
                }}
              >
                <Scan className="w-4 h-4" />
                Escanear
              </Button>
            </div>

            {/* Lista de Productos Escaneados */}
            <div className="space-y-2">
              <Label style={{ color: 'var(--color-neutral-300)' }}>Productos Escaneados</Label>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {productosEscaneados.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'var(--color-neutral-400)' }}>
                    No hay productos escaneados aún
                  </div>
                ) : (
                  productosEscaneados.map((producto, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ 
                        background: 'var(--color-neutral-800)',
                        border: '1px solid var(--color-neutral-700)'
                      }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{producto.producto}</p>
                        <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>SKU: {producto.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>
                          {producto.cantidadRecibida} / {producto.cantidadEsperada || '?'}
                        </p>
                        <Badge
                          style={{
                            background: producto.estado === 'Completo'
                              ? 'rgba(0, 230, 118, 0.2)'
                              : producto.estado === 'Parcial'
                              ? 'rgba(35, 247, 221, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                            color: producto.estado === 'Completo'
                              ? 'var(--color-green)'
                              : producto.estado === 'Parcial'
                              ? 'var(--color-teal-400)'
                              : '#ef4444',
                            border: producto.estado === 'Completo'
                              ? '1px solid rgba(0, 230, 118, 0.3)'
                              : producto.estado === 'Parcial'
                              ? '1px solid rgba(35, 247, 221, 0.3)'
                              : '1px solid rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          {producto.estado}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-neutral-800)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>Tiempo promedio de recepción:</span>
                <span className="font-semibold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>1.5 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Recepciones */}
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
            Historial de Recepciones Recientes
          </CardTitle>
          <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
            Últimas recepciones completadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recepcionesRecientes.map((recepcion) => (
              <div
                key={recepcion.id}
                className="flex items-center justify-between p-4 rounded-lg transition-colors"
                style={{ 
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--gradient-secondary)' }}
                  >
                    <Truck className="w-6 h-6" style={{ color: 'var(--color-neutral-925)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{recepcion.proveedor}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>Orden: {recepcion.orden}</p>
                    <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>Fecha: {recepcion.fecha}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>{recepcion.productos} productos</p>
                    <p className="text-sm flex items-center gap-1" style={{ color: 'var(--color-neutral-300)' }}>
                      <Clock className="w-4 h-4" style={{ color: 'var(--color-teal-400)' }} />
                      {recepcion.tiempo}
                    </p>
                  </div>
                  <Badge style={{
                    background: 'rgba(0, 230, 118, 0.2)',
                    color: 'var(--color-green)',
                    border: '1px solid rgba(0, 230, 118, 0.3)'
                  }}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {recepcion.estado}
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
