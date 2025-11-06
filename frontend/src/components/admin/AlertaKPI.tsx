'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

interface AlertaKPIProps {
  kpi: {
    nombre: string
    valorActual: number
    meta: number
    estado?: 'verde' | 'amarillo' | 'rojo'
  }
  umbral?: {
    amarillo?: number // Porcentaje de desviación
    rojo?: number // Porcentaje de desviación
  }
  valorActual: number
}

export function AlertaKPI({ kpi, umbral = { amarillo: 10, rojo: 20 }, valorActual }: AlertaKPIProps) {
  const desviacion = ((valorActual - kpi.meta) / kpi.meta) * 100
  const desviacionAbsoluta = Math.abs(desviacion)

  const determinarEstado = (): 'verde' | 'amarillo' | 'rojo' => {
    if (kpi.estado) return kpi.estado

    if (desviacionAbsoluta >= umbral.rojo!) return 'rojo'
    if (desviacionAbsoluta >= umbral.amarillo!) return 'amarillo'
    return 'verde'
  }

  const estado = determinarEstado()

  const obtenerIcono = () => {
    switch (estado) {
      case 'verde':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'amarillo':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rojo':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const obtenerVariante = (): 'default' | 'destructive' => {
    return estado === 'rojo' ? 'destructive' : 'default'
  }

  const obtenerMensaje = () => {
    if (estado === 'verde') {
      return `El KPI "${kpi.nombre}" está dentro del rango esperado.`
    }

    if (estado === 'amarillo') {
      return `El KPI "${kpi.nombre}" tiene una desviación del ${desviacionAbsoluta.toFixed(1)}% respecto a la meta.`
    }

    return `El KPI "${kpi.nombre}" está fuera del rango crítico con una desviación del ${desviacionAbsoluta.toFixed(1)}% respecto a la meta.`
  }

  const obtenerColor = () => {
    switch (estado) {
      case 'verde':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'amarillo':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'rojo':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (estado === 'verde') {
    return null // No mostrar alerta si está en verde
  }

  return (
    <Alert className={obtenerColor()} variant={obtenerVariante()}>
      {obtenerIcono()}
      <AlertTitle className="font-semibold">
        {estado === 'rojo' ? 'Alerta Crítica' : 'Alerta de Atención'}
      </AlertTitle>
      <AlertDescription>
        {obtenerMensaje()}
        <div className="mt-2 text-sm">
          <p>
            Valor actual: <strong>{valorActual.toLocaleString()}</strong>
          </p>
          <p>
            Meta: <strong>{kpi.meta.toLocaleString()}</strong>
          </p>
          <p>
            Desviación: <strong>{desviacion > 0 ? '+' : ''}{desviacion.toFixed(1)}%</strong>
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}



