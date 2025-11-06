'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Trash2, Percent } from 'lucide-react'
import { CarritoItem } from './CarritoItem'

interface ItemCarrito {
  id: string
  producto: {
    id: string
    sku: string
    nombre: string
    precio: number
    talla: string
    stock: number
  }
  cantidad: number
  subtotal: number
}

interface ResumenCompraProps {
  items: ItemCarrito[]
  metodoPago: string
  descuento: number
  onMetodoPagoChange: (metodo: string) => void
  onDescuentoChange: (descuento: number) => void
  onLimpiarCarrito: () => void
  onProcesarVenta: () => void
  onIncrementar: (id: string) => void
  onDecrementar: (id: string) => void
  onEliminar: (id: string) => void
}

export function ResumenCompra({
  items,
  metodoPago,
  descuento,
  onMetodoPagoChange,
  onDescuentoChange,
  onLimpiarCarrito,
  onProcesarVenta,
  onIncrementar,
  onDecrementar,
  onEliminar,
}: ResumenCompraProps) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const iva = subtotal * 0.16
  const descuentoAplicado = descuento
  const total = subtotal + iva - descuentoAplicado

  const puedeProcesar = items.length > 0 && metodoPago !== ''

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ 
      backgroundColor: 'var(--cliente-card)', 
      fontFamily: 'var(--font-untitled-sans)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header removido - ya está en el panel lateral */}

      <div className="flex-1 flex flex-col p-0 overflow-hidden" style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Lista de Items con Scroll Mejorado */}
        <div 
          className="overflow-y-auto overflow-x-hidden carrito-scroll flex-1 p-4" 
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: 'var(--color-cliente-primary) var(--cliente-card)',
            minHeight: 0,
            flex: '1 1 auto'
          }}
        >
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  border: '2px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                <ShoppingCart className="w-10 h-10" style={{ color: 'var(--cliente-text-tertiary)' }} />
              </div>
              <p className="font-bold text-lg mb-2" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>El carrito está vacío</p>
              <p className="text-sm font-semibold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Agrega productos desde el catálogo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in transform transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <CarritoItem
                    item={item}
                    onIncrementar={onIncrementar}
                    onDecrementar={onDecrementar}
                    onEliminar={onEliminar}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen de Compra - Fijo en la parte inferior */}
        <div 
          className="p-6 space-y-4 flex-shrink-0 border-t" 
          style={{ 
            borderColor: 'var(--cliente-border)', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            flexShrink: 0
          }}
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-bold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Subtotal:</span>
              <span className="font-extrabold" style={{ 
                color: 'var(--cliente-text-primary)', 
                fontFamily: 'var(--font-untitled-sans)' 
              }}>
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>IVA (16%):</span>
              <span className="font-extrabold" style={{ 
                color: 'var(--cliente-text-primary)', 
                fontFamily: 'var(--font-untitled-sans)' 
              }}>
                ${iva.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Descuento:</span>
              <span className="font-extrabold" style={{ 
                color: 'var(--color-cliente-accent)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>
                -${descuentoAplicado.toLocaleString()}
              </span>
            </div>
            <div className="pt-3 border-t rounded-lg p-3" style={{ 
              borderColor: 'var(--cliente-border)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '2px solid rgba(99, 102, 241, 0.3)'
            }}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-extrabold" style={{ 
                  color: 'var(--cliente-text-primary)', 
                  fontFamily: 'var(--font-untitled-sans)' 
                }}>
                  TOTAL:
                </span>
                <span className="text-3xl font-extrabold transform hover:scale-110 transition-transform duration-300" style={{ 
                  background: 'linear-gradient(135deg, var(--color-cliente-primary) 0%, var(--color-cliente-accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-untitled-sans)',
                  textShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                }}>
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase tracking-wide" style={{ 
              color: 'var(--cliente-text-secondary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}>
              Método de Pago
            </Label>
            <Select value={metodoPago} onValueChange={onMetodoPagoChange}>
              <SelectTrigger className="h-10 cliente-search-input">
                <SelectValue placeholder="Selecciona método de pago" />
              </SelectTrigger>
              <SelectContent style={{ 
                backgroundColor: 'var(--cliente-card)', 
                border: '1px solid var(--cliente-border)' 
              }}>
                <SelectItem value="efectivo" style={{ color: 'var(--cliente-text-primary)' }}>Efectivo</SelectItem>
                <SelectItem value="tarjeta_debito" style={{ color: 'var(--cliente-text-primary)' }}>Tarjeta Débito</SelectItem>
                <SelectItem value="tarjeta_credito" style={{ color: 'var(--cliente-text-primary)' }}>Tarjeta Crédito</SelectItem>
                <SelectItem value="transferencia" style={{ color: 'var(--cliente-text-primary)' }}>Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descuento */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide" style={{ 
              color: 'var(--cliente-text-secondary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}>
              <Percent className="w-4 h-4" style={{ color: 'var(--color-cliente-primary)' }} />
              Descuento (MXN)
            </Label>
            <Input
              type="number"
              value={descuento}
              onChange={(e) => onDescuentoChange(Number(e.target.value) || 0)}
              placeholder="0.00"
              min="0"
              className="h-10 cliente-search-input"
            />
          </div>

          {/* Botones de Acción */}
          <div className="space-y-2 pt-1">
            <Button
              onClick={onProcesarVenta}
              disabled={!puedeProcesar}
              className="w-full h-14 text-base font-extrabold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
              style={{ 
                background: puedeProcesar 
                  ? 'linear-gradient(135deg, var(--color-cliente-primary) 0%, var(--color-cliente-accent) 100%)'
                  : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-untitled-sans)',
                border: 'none',
                boxShadow: puedeProcesar 
                  ? '0 10px 30px rgba(99, 102, 241, 0.5)'
                  : '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              COMPRAR AHORA
            </Button>
            <Button
              onClick={onLimpiarCarrito}
              variant="outline"
              disabled={items.length === 0}
              className="w-full flex items-center justify-center gap-2 font-bold h-11 text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                border: '2px solid rgba(239, 68, 68, 0.3)', 
                color: '#ef4444',
                fontFamily: 'var(--font-untitled-sans)'
              }}
            >
              <Trash2 className="w-4 h-4" />
              LIMPIAR CARRITO
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

