'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react'
import { Competencia } from '@/lib/competencias'
import { EstadoCapacitacion, calcularProgresoGeneral } from '@/lib/capacitacionHelpers'
import { BarraProgresoCapacitacion } from './BarraProgresoCapacitacion'

interface ChecklistCompetenciasProps {
  competencias: Competencia[]
  estadoCapacitacion: Record<number, EstadoCapacitacion>
  esEditable: boolean
  onUpdate?: (competenciaId: number, estado: Partial<EstadoCapacitacion>) => void
  mostrarComentarios?: boolean
}

export function ChecklistCompetencias({
  competencias,
  estadoCapacitacion,
  esEditable,
  onUpdate,
  mostrarComentarios = false,
}: ChecklistCompetenciasProps) {
  const progresoGeneral = calcularProgresoGeneral(competencias, estadoCapacitacion)

  const obtenerIcono = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
      case 'en_proceso':
        return <Clock className="w-5 h-5" style={{ color: 'var(--color-teal-400)' }} />
      default:
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-neutral-400)' }} />
    }
  }

  const obtenerBadge = (estado: string, progreso?: number) => {
    switch (estado) {
      case 'completada':
        return (
          <Badge style={{ 
            background: 'rgba(0, 230, 118, 0.2)',
            color: 'var(--color-green)',
            border: '1px solid rgba(0, 230, 118, 0.3)'
          }}>
            Completada
          </Badge>
        )
      case 'en_proceso':
        return (
          <Badge style={{ 
            background: 'rgba(35, 247, 221, 0.2)',
            color: 'var(--color-teal-400)',
            border: '1px solid rgba(35, 247, 221, 0.3)'
          }}>
            En proceso - {progreso}%
          </Badge>
        )
      default:
        return (
          <Badge style={{ 
            background: 'rgba(148, 163, 184, 0.2)',
            color: 'var(--color-neutral-300)',
            border: '1px solid rgba(148, 163, 184, 0.3)'
          }}>
            Pendiente
          </Badge>
        )
    }
  }

  const handleCheckboxChange = (competenciaId: number, checked: boolean) => {
    if (!onUpdate) return

    const estadoActual = estadoCapacitacion[competenciaId] || {
      competencia_id: competenciaId,
      estado: 'pendiente' as const,
      progreso: 0,
      comentarios: [],
    }

    if (checked) {
      onUpdate(competenciaId, {
        estado: 'completada',
        progreso: 100,
        fecha_completado: new Date().toISOString(),
        comentarios: estadoActual.comentarios,
      })
    } else {
      onUpdate(competenciaId, {
        estado: 'pendiente',
        progreso: 0,
        comentarios: estadoActual.comentarios,
      })
    }
  }

  return (
    <Card style={{ 
      background: 'var(--color-neutral-900)', 
      border: '1px solid var(--color-neutral-800)' 
    }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle style={{ 
              color: 'var(--color-neutral-100)', 
              fontFamily: 'var(--font-family-roobert-pro)' 
            }}>
              Plan de Capacitación
            </CardTitle>
            <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
              Competencias requeridas para tu rol
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>Progreso General</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>{progresoGeneral}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <BarraProgresoCapacitacion progreso={progresoGeneral} tamaño="lg" mostrarPorcentaje={false} />
        <div className="space-y-3">
          {competencias.map((competencia) => {
            const estado = estadoCapacitacion[competencia.id] || {
              competencia_id: competencia.id,
              estado: 'pendiente' as const,
              progreso: 0,
              comentarios: [],
            }

            return (
              <div
                key={competencia.id}
                className="flex items-start gap-4 p-4 rounded-lg transition-colors"
                style={{ 
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)'
                }}
              >
                {esEditable && (
                  <Checkbox
                    checked={estado.estado === 'completada'}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(competencia.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3">
                    {obtenerIcono(estado.estado)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{competencia.nombre}</span>
                        {competencia.obligatoria && (
                          <span className="text-xs" style={{ color: '#ef4444' }}>*</span>
                        )}
                        {obtenerBadge(estado.estado, estado.progreso)}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-300)' }}>{competencia.descripcion}</p>
                    </div>
                  </div>

                  {estado.estado === 'en_proceso' && (
                    <div className="ml-8">
                      <BarraProgresoCapacitacion
                        progreso={estado.progreso}
                        tamaño="sm"
                        mostrarPorcentaje={true}
                      />
                    </div>
                  )}

                  {mostrarComentarios && estado.comentarios.length > 0 && (
                    <div className="ml-8 space-y-1">
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-neutral-300)' }}>
                        <MessageSquare className="w-4 h-4" style={{ color: 'var(--color-teal-400)' }} />
                        <span className="font-medium">Comentarios del supervisor:</span>
                      </div>
                      {estado.comentarios.map((comentario, index) => (
                        <div
                          key={index}
                          className="p-2 rounded text-sm border-l-2"
                          style={{ 
                            background: 'var(--color-neutral-800)',
                            color: 'var(--color-neutral-200)',
                            borderColor: 'var(--color-teal-400)'
                          }}
                        >
                          {comentario}
                        </div>
                      ))}
                    </div>
                  )}

                  {estado.estado === 'en_proceso' && !esEditable && (
                    <div className="ml-8 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Lógica para solicitar aprobación
                          alert(`Solicitando aprobación para: ${competencia.nombre}`)
                        }}
                        style={{
                          background: 'var(--color-neutral-800)',
                          border: '1px solid var(--color-neutral-700)',
                          color: 'var(--color-neutral-100)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        Solicitar Aprobación
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

