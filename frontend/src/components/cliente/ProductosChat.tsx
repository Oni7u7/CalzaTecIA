'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import { Producto } from '@/lib/productos'
import { cn } from '@/lib/utils'

interface ProductosChatProps {
  productos: Producto[]
  onProductoClick?: (producto: Producto) => void
  className?: string
}

export function ProductosChat({ productos, onProductoClick, className }: ProductosChatProps) {
  if (productos.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {productos.map((producto) => (
        <Card
          key={producto.id}
          className={cn(
            'cursor-pointer hover:shadow-lg transition-all duration-300',
            'chatbot-product-card'
          )}
          onClick={() => onProductoClick?.(producto)}
          style={{
            border: '1px solid var(--cliente-border)',
            backgroundColor: 'var(--cliente-card)'
          }}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Imagen/Icono */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--cliente-900)' }}>
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-8 h-8" style={{ color: 'var(--color-cliente-primary)' }} />
                )}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: 'var(--cliente-text-primary)' }}>
                  {producto.nombre}
                </h4>
                <p className="text-xs font-mono mb-2" style={{ color: 'var(--cliente-text-secondary)' }}>
                  SKU: {producto.sku}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="text-xs" style={{ 
                    backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                    color: 'var(--color-cliente-primary)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    {producto.categoria}
                  </Badge>
                  <span className="font-bold text-sm" style={{ color: 'var(--color-cliente-primary)' }}>
                    ${producto.precio.toFixed(2)} MXN
                  </span>
                </div>
                {producto.tallas_disponibles && producto.tallas_disponibles.length > 0 && (
                  <p className="text-xs mt-2" style={{ color: 'var(--cliente-text-secondary)' }}>
                    Tallas: {producto.tallas_disponibles.slice(0, 5).join(', ')}
                    {producto.tallas_disponibles.length > 5 && '...'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


