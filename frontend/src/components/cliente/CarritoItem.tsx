'use client'

import { Button } from '@/components/ui/button'
import { Minus, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

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

interface CarritoItemProps {
  item: ItemCarrito
  onIncrementar: (id: string) => void
  onDecrementar: (id: string) => void
  onEliminar: (id: string) => void
}

export function CarritoItem({ item, onIncrementar, onDecrementar, onEliminar }: CarritoItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden"
      style={{ 
        backgroundColor: isHovered ? 'rgba(99, 102, 241, 0.1)' : 'var(--cliente-card)', 
        border: '2px solid var(--cliente-border)',
        fontFamily: 'var(--font-untitled-sans)',
        boxShadow: isHovered ? '0 8px 24px rgba(99, 102, 241, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efecto de brillo en hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          filter: 'blur(10px)'
        }}
      />

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base mb-1 truncate transform group-hover:scale-105 transition-transform duration-300" style={{ 
              color: 'var(--cliente-text-primary)', 
              fontFamily: 'var(--font-untitled-sans)' 
            }}>
              {item.producto.nombre}
            </h4>
            <p className="text-xs font-mono font-semibold mb-2" style={{ color: 'var(--cliente-text-secondary)' }}>SKU: {item.producto.sku}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="text-xs font-bold px-2 py-1 transform group-hover:scale-110 transition-transform duration-300" style={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                color: 'var(--color-cliente-primary)', 
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>
                Talla {item.producto.talla}
              </Badge>
              <span className="text-sm font-bold transform group-hover:scale-110 transition-transform duration-300" style={{ 
                color: 'var(--color-cliente-accent)',
                fontFamily: 'var(--font-untitled-sans)'
              }}>
                ${item.producto.precio.toLocaleString()}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEliminar(item.id)}
            className="h-8 w-8 flex-shrink-0 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
            style={{ 
              color: '#ef4444', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Controles de cantidad mejorados */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDecrementar(item.id)}
              className="h-9 w-9 rounded-full transition-all duration-300 hover:scale-110 hover:bg-opacity-20"
              style={{ 
                backgroundColor: 'var(--cliente-input)', 
                border: '2px solid var(--cliente-border)', 
                color: 'var(--cliente-text-secondary)' 
              }}
              disabled={item.cantidad <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div 
              className="w-12 h-9 rounded-full flex items-center justify-center font-extrabold text-sm transform group-hover:scale-110 transition-transform duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--cliente-text-primary)',
                fontFamily: 'var(--font-untitled-sans)'
              }}
            >
              {item.cantidad}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onIncrementar(item.id)}
              className="h-9 w-9 rounded-full transition-all duration-300 hover:scale-110 hover:bg-opacity-20"
              style={{ 
                backgroundColor: 'var(--cliente-input)', 
                border: '2px solid var(--cliente-border)', 
                color: 'var(--cliente-text-secondary)' 
              }}
              disabled={item.cantidad >= item.producto.stock}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Subtotal mejorado */}
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-extrabold transform group-hover:scale-110 transition-transform duration-300" style={{ 
              background: 'linear-gradient(135deg, var(--color-cliente-primary) 0%, var(--color-cliente-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'var(--font-untitled-sans)'
            }}>
              ${item.subtotal.toLocaleString()}
            </p>
            <p className="text-xs font-semibold mt-1" style={{ 
              color: 'var(--cliente-text-secondary)',
              fontFamily: 'var(--font-untitled-sans)'
            }}>Subtotal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
