'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, X } from 'lucide-react'

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

interface ModalConfirmacionProps {
  open: boolean
  onClose: () => void
  onConfirmar: () => void
  items: ItemCarrito[]
  total: number
  metodoPago: string
  loading?: boolean
}

export function ModalConfirmacion({
  open,
  onClose,
  onConfirmar,
  items,
  total,
  metodoPago,
  loading = false,
}: ModalConfirmacionProps) {
  const nombresMetodoPago: Record<string, string> = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta Débito',
    tarjeta_credito: 'Tarjeta Crédito',
    transferencia: 'Transferencia',
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md" 
        style={{ 
          backgroundColor: 'var(--cliente-card)', 
          border: '1px solid var(--cliente-border)',
          fontFamily: 'var(--font-untitled-sans)'
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ 
            color: 'var(--cliente-text-primary)', 
            fontFamily: 'var(--font-untitled-sans)' 
          }}>
            Confirmar Compra
          </DialogTitle>
          <DialogDescription style={{ 
            color: 'var(--cliente-text-secondary)',
            fontFamily: 'var(--font-untitled-sans)'
          }}>
            Revisa los detalles de la compra antes de confirmar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumen de Items */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center p-2 rounded"
                style={{ 
                  backgroundColor: 'var(--cliente-card)', 
                  border: '1px solid var(--cliente-border)',
                  fontFamily: 'var(--font-untitled-sans)'
                }}
              >
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ 
                    color: 'var(--cliente-text-primary)',
                    fontFamily: 'var(--font-untitled-sans)'
                  }}>{item.producto.nombre}</p>
                  <p className="text-xs font-semibold" style={{ 
                    color: 'var(--cliente-text-secondary)',
                    fontFamily: 'var(--font-untitled-sans)'
                  }}>
                    Cantidad: {item.cantidad} x ${item.producto.precio.toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-bold" style={{ 
                  color: 'var(--color-cliente-accent)',
                  fontFamily: 'var(--font-untitled-sans)'
                }}>${item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Total y Método de Pago */}
          <div className="pt-4 space-y-2 p-4 rounded-lg" style={{ 
            borderTop: '1px solid var(--cliente-border)', 
            background: 'var(--gradient-cliente)' 
          }}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Total a Pagar:</span>
              <span className="text-2xl font-bold" style={{ 
                color: 'var(--cliente-text-primary)', 
                fontFamily: 'var(--font-untitled-sans)' 
              }}>
                ${total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Método de Pago:</span>
              <span className="text-sm font-bold" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>
                {nombresMetodoPago[metodoPago] || metodoPago}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading} 
            className="font-semibold"
            style={{ 
              backgroundColor: 'var(--cliente-input)', 
              border: '1px solid var(--cliente-border)', 
              color: 'var(--cliente-text-secondary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={onConfirmar} 
            disabled={loading} 
            className="font-bold shadow-lg"
            style={{ 
              background: 'var(--gradient-cliente)', 
              color: 'var(--cliente-text-primary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                CONFIRMAR COMPRA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


