'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface BarraProgresoCapacitacionProps {
  progreso: number
  tamaño?: 'sm' | 'md' | 'lg'
  mostrarPorcentaje?: boolean
  className?: string
}

export function BarraProgresoCapacitacion({
  progreso,
  tamaño = 'md',
  mostrarPorcentaje = true,
  className,
}: BarraProgresoCapacitacionProps) {
  const altura = tamaño === 'sm' ? 'h-2' : tamaño === 'lg' ? 'h-4' : 'h-3'
  const color =
    progreso < 40
      ? 'bg-red-600'
      : progreso < 70
      ? 'bg-yellow-600'
      : 'bg-green-600'

  return (
    <div className={cn('space-y-2', className)}>
      {mostrarPorcentaje && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progreso</span>
          <span
            className={cn(
              'font-semibold',
              progreso < 40
                ? 'text-red-600'
                : progreso < 70
                ? 'text-yellow-600'
                : 'text-green-600'
            )}
          >
            {progreso}%
          </span>
        </div>
      )}
      <div className="relative">
        <Progress value={progreso} className={cn(altura, 'bg-gray-200')} />
        <div
          className={cn(
            'absolute top-0 left-0 h-full transition-all duration-500 rounded-full',
            color,
            altura
          )}
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  )
}



