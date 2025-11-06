'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface KPICardProps {
  titulo: string
  valorActual: number | string
  meta: number | string
  tendencia?: number
  unidad?: string
  estado: 'verde' | 'amarillo' | 'rojo'
  descripcion?: string
  icono?: React.ReactNode
  grafica?: React.ReactNode
}

export function KPICard({
  titulo,
  valorActual,
  meta,
  tendencia,
  unidad = '',
  estado,
  descripcion,
  icono,
  grafica,
}: KPICardProps) {
  const obtenerColorEstado = () => {
    switch (estado) {
      case 'verde':
        return { background: 'var(--color-neutral-900)', border: '1px solid var(--color-green)' }
      case 'amarillo':
        return { background: 'var(--color-neutral-900)', border: '1px solid var(--color-teal-300)' }
      case 'rojo':
        return { background: 'var(--color-neutral-900)', border: '1px solid #ef4444' }
      default:
        return { background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }
    }
  }

  const obtenerColorTexto = () => {
    switch (estado) {
      case 'verde':
        return 'var(--color-green)'
      case 'amarillo':
        return 'var(--color-teal-300)'
      case 'rojo':
        return '#ef4444'
      default:
        return 'var(--color-neutral-300)'
    }
  }

  const obtenerIconoTendencia = () => {
    if (tendencia === undefined) return <Minus className="w-4 h-4" style={{ color: 'var(--color-neutral-400)' }} />
    if (tendencia > 0) return <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-green)' }} />
    if (tendencia < 0) return <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />
    return <Minus className="w-4 h-4" style={{ color: 'var(--color-neutral-400)' }} />
  }

  const obtenerIconoEstado = () => {
    switch (estado) {
      case 'verde':
        return <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
      case 'amarillo':
        return <Clock className="w-5 h-5" style={{ color: 'var(--color-teal-300)' }} />
      case 'rojo':
        return <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
      default:
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-neutral-400)' }} />
    }
  }

  const calcularProgreso = () => {
    if (typeof valorActual === 'number' && typeof meta === 'number') {
      return Math.min((valorActual / meta) * 100, 100)
    }
    return 0
  }

  const progreso = calcularProgreso()

  const estadoStyles = obtenerColorEstado()
  const textoColor = obtenerColorTexto()

  return (
    <Card className="border-2" style={estadoStyles}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {icono}
              <CardTitle className="text-lg" style={{ color: 'var(--color-neutral-100)' }}>{titulo}</CardTitle>
            </div>
            {descripcion && <CardDescription style={{ color: 'var(--color-neutral-300)' }}>{descripcion}</CardDescription>}
          </div>
          {obtenerIconoEstado()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                {typeof valorActual === 'number'
                  ? valorActual.toLocaleString()
                  : valorActual}
                {unidad && <span className="text-lg ml-1" style={{ color: 'var(--color-neutral-300)' }}>{unidad}</span>}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-400)' }}>
                Meta: {typeof meta === 'number' ? meta.toLocaleString() : meta}
                {unidad && <span className="ml-1">{unidad}</span>}
              </p>
            </div>
            {tendencia !== undefined && (
              <div className="flex items-center gap-1" style={{ color: textoColor }}>
                {obtenerIconoTendencia()}
                <span className="text-sm font-medium">
                  {tendencia > 0 ? '+' : ''}
                  {tendencia.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {progreso > 0 && (
            <div className="space-y-1">
              <Progress value={progreso} className="h-2" />
              <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                {progreso.toFixed(0)}% de la meta alcanzada
              </p>
            </div>
          )}
        </div>
        {grafica && <div className="pt-4 border-t" style={{ borderColor: 'var(--color-neutral-800)' }}>{grafica}</div>}
      </CardContent>
    </Card>
  )
}


