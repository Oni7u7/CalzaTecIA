'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Producto {
  id: string
  sku: string
  nombre: string
  categoria: string
  precio: number
  talla: string
  stock: number
  imagen?: string
}

interface ProductoCardProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
  className?: string
}

export function ProductoCard({ producto, onAgregar, className }: ProductoCardProps) {
  const disponible = producto.stock > 0
  const stockClass = producto.stock === 0 ? 'out' : producto.stock <= 5 ? 'low' : ''
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        'cliente-product-card group relative overflow-hidden',
        !disponible && 'opacity-60',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efecto de brillo en hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          filter: 'blur(20px)'
        }}
      />

      <CardContent className="cliente-product-info relative z-10">
        <div className="space-y-4">
          {/* Imagen del Producto Mejorada */}
          <div className="cliente-product-image-container flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
            <div className="relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
              <Package className="w-24 h-24 sm:w-28 sm:h-28 transition-all duration-500 group-hover:scale-110" style={{ color: 'var(--color-cliente-primary)' }} />
            </div>
            {producto.stock <= 5 && (
              <div 
                className="cliente-product-badge absolute top-2 right-2 px-3 py-1 rounded-full font-bold text-xs shadow-lg animate-bounce"
                style={{
                  background: producto.stock === 0 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {producto.stock === 0 ? 'AGOTADO' : 'POCO STOCK'}
              </div>
            )}
            {disponible && (
              <div 
                className="absolute top-2 left-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: 'var(--color-cliente-primary)' }} />
              </div>
            )}
          </div>

          {/* Información del Producto Mejorada */}
          <div className="space-y-3">
            <div>
              <Badge 
                className="mb-2 text-xs font-bold px-2 py-1 transform group-hover:scale-110 transition-transform duration-300"
                style={{ 
                  backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                  color: 'var(--color-cliente-primary)', 
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontFamily: 'var(--font-untitled-sans)'
                }}
              >
                {producto.categoria}
              </Badge>
              <h3 className="cliente-product-name line-clamp-2 group-hover:text-cliente-primary transition-colors duration-300">{producto.nombre}</h3>
              <p className="text-xs font-mono font-semibold mt-1" style={{ color: 'var(--cliente-text-secondary)' }}>SKU: {producto.sku}</p>
            </div>

            <div className={cn("cliente-product-stock flex items-center gap-2", stockClass)}>
              <div 
                className="cliente-product-stock-dot w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: producto.stock === 0 
                    ? '#ef4444'
                    : producto.stock <= 5
                    ? '#f59e0b'
                    : '#10b981'
                }}
              />
              <span className="cliente-product-stock-text text-xs font-bold">
                {producto.stock === 0 ? 'Sin stock' : producto.stock <= 5 ? `Quedan ${producto.stock}` : 'En stock'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--cliente-border)' }}>
              <div>
                <p className="cliente-product-price text-2xl font-extrabold transform group-hover:scale-110 transition-transform duration-300">
                  ${producto.precio.toLocaleString()}
                </p>
                <Badge className="text-xs font-bold mt-1" style={{ 
                  backgroundColor: 'rgba(139, 92, 246, 0.2)', 
                  color: 'var(--color-cliente-accent)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  fontFamily: 'var(--font-untitled-sans)'
                }}>
                  Talla {producto.talla}
                </Badge>
              </div>
            </div>

            {/* Botón Agregar Mejorado */}
            <Button
              onClick={() => onAgregar(producto)}
              disabled={!disponible}
              className="cliente-product-button w-full h-12 text-sm font-extrabold shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: disponible 
                  ? 'linear-gradient(135deg, var(--color-cliente-primary) 0%, var(--color-cliente-accent) 100%)'
                  : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-untitled-sans)',
                border: 'none',
                boxShadow: disponible 
                  ? '0 8px 24px rgba(99, 102, 241, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              {disponible ? (
                <>
                  <Plus className="w-4 h-4 mr-2 transform group-hover:rotate-90 transition-transform duration-300" />
                  <span>AGREGAR AL CARRITO</span>
                  <Zap className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <span>SIN STOCK</span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Efecto de partículas en hover */}
      {isHovered && disponible && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'var(--color-cliente-primary)',
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animation: `sparkle ${1 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
        }
      `}</style>
    </Card>
  )
}
