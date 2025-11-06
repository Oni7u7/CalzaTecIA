'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Save, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Usuario } from '@/lib/orgData'
import { Competencia } from '@/lib/competencias'
import { EstadoCapacitacion, calcularProgresoGeneral } from '@/lib/capacitacionHelpers'
import { ChecklistCompetencias } from './ChecklistCompetencias'
import { HistorialCapacitacion } from './HistorialCapacitacion'
import { FormAsignarCapacitacion } from './FormAsignarCapacitacion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ModalGestionCapacitacionProps {
  open: boolean
  onClose: () => void
  colaborador: Usuario
  competencias: Competencia[]
  estadoCapacitacion: Record<number, EstadoCapacitacion>
  supervisorId: number
  onSave: (
    colaboradorId: number,
    competenciaId: number,
    actualizacion: Partial<EstadoCapacitacion>
  ) => void
}

export function ModalGestionCapacitacion({
  open,
  onClose,
  colaborador,
  competencias,
  estadoCapacitacion,
  supervisorId,
  onSave,
}: ModalGestionCapacitacionProps) {
  const [mostrarAsignar, setMostrarAsignar] = useState(false)
  const progresoGeneral = calcularProgresoGeneral(competencias, estadoCapacitacion)

  const handleActualizarCompetencia = (
    competenciaId: number,
    actualizacion: Partial<EstadoCapacitacion>
  ) => {
    onSave(colaborador.id, competenciaId, actualizacion)
  }

  const handleAsignarCapacitacion = (
    competenciaId: number,
    fecha: string,
    prioritaria: boolean,
    comentario: string
  ) => {
    const estadoActual = estadoCapacitacion[competenciaId] || {
      competencia_id: competenciaId,
      estado: 'pendiente' as const,
      progreso: 0,
      comentarios: [],
    }

    const nuevosComentarios = comentario
      ? [...estadoActual.comentarios, comentario]
      : estadoActual.comentarios

    handleActualizarCompetencia(competenciaId, {
      estado: 'en_proceso',
      progreso: 0,
      fecha_inicio: fecha || new Date().toISOString(),
      prioritaria,
      comentarios: nuevosComentarios,
    })
    setMostrarAsignar(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Perfil de Capacitación</DialogTitle>
          <DialogDescription>
            Gestión de capacitación para {colaborador.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Información del Colaborador */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{colaborador.nombre}</h3>
                <p className="text-sm text-gray-600">{colaborador.email}</p>
                <p className="text-xs text-gray-500 capitalize mt-1">
                  {colaborador.rol.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progreso General</p>
                <p className="text-2xl font-bold text-green-600">{progresoGeneral}%</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="competencias" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="competencias">Competencias</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="asignar">Asignar Nueva</TabsTrigger>
            </TabsList>

            <TabsContent value="competencias" className="mt-6">
              <ChecklistCompetencias
                competencias={competencias}
                estadoCapacitacion={estadoCapacitacion}
                esEditable={true}
                onUpdate={handleActualizarCompetencia}
                mostrarComentarios={true}
              />
            </TabsContent>

            <TabsContent value="historial" className="mt-6">
              <HistorialCapacitacion colaboradorId={colaborador.id} />
            </TabsContent>

            <TabsContent value="asignar" className="mt-6">
              <FormAsignarCapacitacion
                colaborador={colaborador}
                competenciasDisponibles={competencias.filter(
                  (c) => !estadoCapacitacion[c.id] || estadoCapacitacion[c.id].estado === 'pendiente'
                )}
                onAsignar={handleAsignarCapacitacion}
              />
            </TabsContent>
          </Tabs>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

