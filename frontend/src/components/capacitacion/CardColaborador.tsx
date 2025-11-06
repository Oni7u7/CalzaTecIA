'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Usuario } from '@/lib/orgData'
import { BarraProgresoCapacitacion } from './BarraProgresoCapacitacion'
import { cn } from '@/lib/utils'

interface CardColaboradorProps {
  colaborador: Usuario
  progreso: number
  onClick: () => void
  className?: string
}

export function CardColaborador({ colaborador, progreso, onClick, className }: CardColaboradorProps) {
  const obtenerEstado = (progreso: number): 'riesgo' | 'progreso' | 'avanzado' => {
    if (progreso < 40) return 'riesgo'
    if (progreso < 70) return 'progreso'
    return 'avanzado'
  }

  const estado = obtenerEstado(progreso)

  const obtenerBadge = () => {
    switch (estado) {
      case 'riesgo':
        return (
          <Badge style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <AlertCircle className="w-3 h-3 mr-1" />
            En Riesgo
          </Badge>
        )
      case 'progreso':
        return (
          <Badge style={{
            background: 'rgba(35, 247, 221, 0.2)',
            color: 'var(--color-teal-400)',
            border: '1px solid rgba(35, 247, 221, 0.3)'
          }}>
            <TrendingUp className="w-3 h-3 mr-1" />
            En Progreso
          </Badge>
        )
      case 'avanzado':
        return (
          <Badge style={{
            background: 'rgba(0, 230, 118, 0.2)',
            color: 'var(--color-green)',
            border: '1px solid rgba(0, 230, 118, 0.3)'
          }}>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Avanzado
          </Badge>
        )
    }
  }

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-all duration-200 cursor-pointer',
        className
      )}
      style={{ 
        background: 'var(--color-neutral-900)', 
        border: '1px solid var(--color-neutral-800)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
      }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--gradient-secondary)' }}
              >
                <User className="w-8 h-8" style={{ color: 'var(--color-neutral-925)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{colaborador.nombre}</h3>
                <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>{colaborador.email}</p>
                <p className="text-xs capitalize mt-1" style={{ color: 'var(--color-neutral-400)' }}>
                  {colaborador.rol.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            {obtenerBadge()}
          </div>

          {/* Progreso */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--color-neutral-300)' }}>Progreso de Capacitación</span>
              <span
                className="font-bold"
                style={{
                  color: estado === 'riesgo'
                    ? '#ef4444'
                    : estado === 'progreso'
                    ? 'var(--color-teal-400)'
                    : 'var(--color-green)',
                  fontFamily: 'var(--font-family-roobert-pro)'
                }}
              >
                {progreso}%
              </span>
            </div>
            <BarraProgresoCapacitacion progreso={progreso} tamaño="md" mostrarPorcentaje={false} />
          </div>

          {/* Botón */}
          <Button 
            variant="outline" 
            className="w-full font-bold shadow-lg hover:shadow-xl transition-all"
            style={{
              background: 'var(--color-neutral-800)',
              border: '1px solid var(--color-neutral-700)',
              color: 'var(--color-neutral-100)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            Ver Perfil de Capacitación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
