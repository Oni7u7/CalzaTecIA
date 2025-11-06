'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { UserPlus, Calendar } from 'lucide-react'
import { Competencia } from '@/lib/competencias'
import { Usuario } from '@/lib/orgData'

interface FormAsignarCapacitacionProps {
  colaborador: Usuario
  competenciasDisponibles: Competencia[]
  onAsignar: (competenciaId: number, fecha: string, prioritaria: boolean, comentario: string) => void
  onCancelar?: () => void
}

export function FormAsignarCapacitacion({
  colaborador,
  competenciasDisponibles,
  onAsignar,
  onCancelar,
}: FormAsignarCapacitacionProps) {
  const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState<string>('')
  const [fechaProgramada, setFechaProgramada] = useState<string>('')
  const [prioritaria, setPrioritaria] = useState(false)
  const [comentario, setComentario] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!competenciaSeleccionada) return

    onAsignar(
      Number(competenciaSeleccionada),
      fechaProgramada,
      prioritaria,
      comentario
    )

    // Limpiar formulario
    setCompetenciaSeleccionada('')
    setFechaProgramada('')
    setPrioritaria(false)
    setComentario('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-orange-600" />
          Asignar Nueva Capacitación
        </CardTitle>
        <CardDescription>
          Asigna una nueva capacitación a {colaborador.nombre}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Competencia</Label>
            <Select value={competenciaSeleccionada} onValueChange={setCompetenciaSeleccionada}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una competencia" />
              </SelectTrigger>
              <SelectContent>
                {competenciasDisponibles.map((competencia) => (
                  <SelectItem key={competencia.id} value={competencia.id.toString()}>
                    {competencia.nombre}
                    {competencia.obligatoria && ' *'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha Programada
            </Label>
            <Input
              type="date"
              value={fechaProgramada}
              onChange={(e) => setFechaProgramada(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="prioritaria"
              checked={prioritaria}
              onCheckedChange={(checked) => setPrioritaria(checked as boolean)}
            />
            <Label
              htmlFor="prioritaria"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Marcar como prioritaria
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Comentario o Instrucciones</Label>
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Agrega comentarios o instrucciones para la capacitación..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Asignar Capacitación
            </Button>
            {onCancelar && (
              <Button type="button" variant="outline" onClick={onCancelar}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



