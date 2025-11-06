'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

interface ModalExitoProps {
  open: boolean
  onClose: () => void
  onNuevaVenta: () => void
  numeroTicket: string
  total: number
}

export function ModalExito({ open, onClose, onNuevaVenta, numeroTicket, total }: ModalExitoProps) {
  const fecha = new Date().toLocaleDateString('es-MX')
  const hora = new Date().toLocaleTimeString('es-MX')

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
          <div className="flex items-center justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ 
                background: 'var(--gradient-cliente)', 
                border: '2px solid var(--color-cliente-primary)' 
              }}
            >
              <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--cliente-text-primary)' }} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl" style={{ 
            color: 'var(--cliente-text-primary)', 
            fontFamily: 'var(--font-untitled-sans)' 
          }}>
            Compra Confirmada
          </DialogTitle>
          <DialogDescription className="text-center font-semibold" style={{ 
            color: 'var(--cliente-text-secondary)',
            fontFamily: 'var(--font-untitled-sans)'
          }}>
            La venta se ha registrado correctamente en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg space-y-2" style={{ 
            background: 'var(--gradient-cliente)', 
            border: '1px solid var(--cliente-border)',
            fontFamily: 'var(--font-untitled-sans)'
          }}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Número de Ticket:</span>
              <span className="text-lg font-bold font-mono" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>#{numeroTicket}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Total:</span>
              <span className="text-xl font-bold" style={{ 
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
              }}>Fecha:</span>
              <span className="text-sm font-bold" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>{fecha}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ 
                color: 'var(--cliente-text-secondary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>Hora:</span>
              <span className="text-sm font-bold" style={{ 
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>{hora}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="flex-1 font-bold shadow-lg"
            style={{ 
              background: 'var(--cliente-input)', 
              border: '1px solid var(--cliente-border)',
              color: 'var(--cliente-text-secondary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}
          >
            CONFIRMAR COMPRA
          </Button>
          <Button 
            onClick={onNuevaVenta} 
            className="flex-1 font-bold shadow-lg"
            style={{ 
              background: 'var(--gradient-cliente)', 
              color: 'var(--cliente-text-primary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}
          >
            COMPRAR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


