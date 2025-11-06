'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditorTexto } from './EditorTexto'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Fase {
  nombre: string
  descripcion: string
  duracion: string
  responsables: string
}

interface TimelineImplementacionProps {
  fases: Fase[]
  onFasesChange: (fases: Fase[]) => void
}

export function TimelineImplementacion({ fases, onFasesChange }: TimelineImplementacionProps) {
  const actualizarFase = (index: number, campo: string, valor: string) => {
    const nuevasFases = [...fases]
    nuevasFases[index] = {
      ...nuevasFases[index],
      [campo]: valor,
    }
    onFasesChange(nuevasFases)
  }

  const agregarFase = () => {
    onFasesChange([
      ...fases,
      {
        nombre: '',
        descripcion: '',
        duracion: '',
        responsables: '',
      },
    ])
  }

  const eliminarFase = (index: number) => {
    onFasesChange(fases.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Plan de Implementación</CardTitle>
          <Button onClick={agregarFase} variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar Fase
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fases.map((fase, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre de la Fase</Label>
                    <Input
                      value={fase.nombre}
                      onChange={(e) => actualizarFase(index, 'nombre', e.target.value)}
                      placeholder="Ej: Capacitación, Migración, etc."
                    />
                  </div>
                  <EditorTexto
                    label="Descripción"
                    value={fase.descripcion}
                    onChange={(valor) => actualizarFase(index, 'descripcion', valor)}
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duración</Label>
                      <Input
                        value={fase.duracion}
                        onChange={(e) => actualizarFase(index, 'duracion', e.target.value)}
                        placeholder="Ej: 2 semanas, 1 mes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Responsables</Label>
                      <Input
                        value={fase.responsables}
                        onChange={(e) => actualizarFase(index, 'responsables', e.target.value)}
                        placeholder="Ej: Equipo de TI, Gerentes"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => eliminarFase(index)}
                  className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {fases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay fases agregadas. Haz clic en "Agregar Fase" para comenzar.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



