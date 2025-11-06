'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, MessageSquare, TrendingUp, UserPlus } from 'lucide-react'
import { HistorialCapacitacion as HistorialType, obtenerHistorialCapacitacion } from '@/lib/capacitacionHelpers'
import { ESTRUCTURA_ORGANIZACIONAL } from '@/lib/orgData'
import { obtenerCompetenciasPorRol } from '@/lib/competencias'

interface HistorialCapacitacionProps {
  colaboradorId: number
}

export function HistorialCapacitacion({ colaboradorId }: HistorialCapacitacionProps) {
  const historial = obtenerHistorialCapacitacion(colaboradorId)
  const colaborador = ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.find((u) => u.id === colaboradorId)
  const competencias = colaborador ? obtenerCompetenciasPorRol(colaborador.rol) : []

  const obtenerIcono = (accion: string) => {
    switch (accion) {
      case 'iniciada':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'completada':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'comentario':
        return <MessageSquare className="w-4 h-4 text-purple-600" />
      case 'progreso':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />
      case 'asignada':
        return <UserPlus className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const obtenerBadge = (accion: string) => {
    switch (accion) {
      case 'iniciada':
        return <Badge className="bg-blue-100 text-blue-800">Iniciada</Badge>
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>
      case 'comentario':
        return <Badge className="bg-purple-100 text-purple-800">Comentario</Badge>
      case 'progreso':
        return <Badge className="bg-yellow-100 text-yellow-800">Progreso</Badge>
      case 'asignada':
        return <Badge className="bg-orange-100 text-orange-800">Asignada</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{accion}</Badge>
    }
  }

  const obtenerNombreCompetencia = (competenciaId: number): string => {
    const competencia = competencias.find((c) => c.id === competenciaId)
    return competencia?.nombre || `Competencia #${competenciaId}`
  }

  const obtenerNombreSupervisor = (supervisorId: number): string => {
    const supervisor = ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.find((u) => u.id === supervisorId)
    return supervisor?.nombre || 'Supervisor'
  }

  const historialOrdenado = [...historial].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Capacitación</CardTitle>
        <CardDescription>Registro de eventos y cambios en la capacitación</CardDescription>
      </CardHeader>
      <CardContent>
        {historialOrdenado.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay historial de capacitación registrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historialOrdenado.map((evento) => (
              <div
                key={evento.id}
                className="flex items-start gap-4 p-4 border-l-4 border-orange-500 bg-gray-50 rounded-lg"
              >
                <div className="mt-1">{obtenerIcono(evento.accion)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {obtenerNombreCompetencia(evento.competencia_id)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Por: {obtenerNombreSupervisor(evento.supervisor_id)}
                      </p>
                    </div>
                    {obtenerBadge(evento.accion)}
                  </div>
                  {evento.comentario && (
                    <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                      {evento.comentario}
                    </p>
                  )}
                  {evento.progreso_anterior !== undefined && evento.progreso_nuevo !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Progreso:</span>
                      <span className="line-through">{evento.progreso_anterior}%</span>
                      <span>→</span>
                      <span className="font-semibold text-green-600">{evento.progreso_nuevo}%</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(evento.fecha).toLocaleString('es-MX')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

