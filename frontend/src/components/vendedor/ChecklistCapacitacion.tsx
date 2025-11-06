'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Competencia {
  id: string
  nombre: string
  estado: 'completada' | 'en_proceso' | 'pendiente'
  progreso?: number
}

interface ChecklistCapacitacionProps {
  competencias: Competencia[]
  onCompetenciaChange?: (id: string, completada: boolean) => void
  readonly?: boolean
}

export function ChecklistCapacitacion({
  competencias,
  onCompetenciaChange,
  readonly = false,
}: ChecklistCapacitacionProps) {
  const completadas = competencias.filter((c) => c.estado === 'completada').length
  const progresoGeneral = Math.round((completadas / competencias.length) * 100)

  const obtenerIcono = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'en_proceso':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const obtenerBadge = (estado: string, progreso?: number) => {
    switch (estado) {
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>
      case 'en_proceso':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            En proceso - {progreso}%
          </Badge>
        )
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plan de Capacitación</CardTitle>
            <CardDescription>Competencias requeridas para tu rol</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progreso General</div>
            <div className="text-2xl font-bold text-green-600">{progresoGeneral}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progresoGeneral} className="h-2" />
        <div className="space-y-3">
          {competencias.map((competencia) => (
            <div
              key={competencia.id}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {!readonly && (
                <Checkbox
                  checked={competencia.estado === 'completada'}
                  onCheckedChange={(checked) => {
                    if (onCompetenciaChange) {
                      onCompetenciaChange(competencia.id, checked as boolean)
                    }
                  }}
                />
              )}
              <div className="flex-1 flex items-center gap-3">
                {obtenerIcono(competencia.estado)}
                <span className="font-medium text-gray-900">{competencia.nombre}</span>
              </div>
              {obtenerBadge(competencia.estado, competencia.progreso)}
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            Solicitar Aprobación
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}



