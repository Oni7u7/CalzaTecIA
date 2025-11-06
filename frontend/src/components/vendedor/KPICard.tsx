'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  titulo: string
  valor: string | number
  cambio?: {
    porcentaje: number
    positivo?: boolean
  }
  icono?: React.ReactNode
  className?: string
}

export function KPICard({ titulo, valor, cambio, icono, className }: KPICardProps) {
  return (
    <Card 
      className={cn('hover:shadow-xl transition-all hover:-translate-y-1', className)}
      style={{ 
        background: 'var(--color-neutral-900)',
        border: '1px solid var(--color-neutral-800)'
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: 'var(--color-neutral-400)' }}>
              {titulo}
            </p>
            <p className="text-4xl font-extrabold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
              {valor}
            </p>
            {cambio && (
              <div className="flex items-center gap-2 text-sm">
                {cambio.positivo !== false ? (
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
                ) : (
                  <TrendingDown className="w-5 h-5" style={{ color: '#ef4444' }} />
                )}
                <span
                  className="font-extrabold"
                  style={{ 
                    color: cambio.positivo !== false ? 'var(--color-green)' : '#ef4444'
                  }}
                >
                  {cambio.porcentaje > 0 ? '+' : ''}
                  {cambio.porcentaje}%
                </span>
              </div>
            )}
          </div>
          {icono && <div style={{ color: 'var(--color-green)' }}>{icono}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

