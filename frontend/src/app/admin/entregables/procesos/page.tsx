'use client'

import { useState, useEffect } from 'react'
import { EditorTexto } from '@/components/entregables/EditorTexto'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Download, Workflow } from 'lucide-react'

const STORAGE_KEY = 'entregable_procesos'

interface ProcesosData {
  hallazgosOperativo: string
  causaRaiz: string
  recepcionTOBE: string
  surtidoTOBE: string
  ventasTOBE: string
  inventarioTOBE: string
  tecnologiaPropuesta: string
}

export default function ProcesosPage() {
  const [data, setData] = useState<ProcesosData>({
    hallazgosOperativo: '',
    causaRaiz: '',
    recepcionTOBE: '',
    surtidoTOBE: '',
    ventasTOBE: '',
    inventarioTOBE: '',
    tecnologiaPropuesta: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setData(JSON.parse(saved))
      }
    }
  }, [])

  const guardar = () => {
    setGuardando(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setTimeout(() => {
        setGuardando(false)
        setGuardado(true)
        setTimeout(() => setGuardado(false), 2000)
      }, 500)
    }
  }

  const descargarPDF = () => {
    alert('Descargando Diagramas TO-BE (PDF)...')
  }

  const actualizarCampo = (campo: keyof ProcesosData, valor: string) => {
    setData((prev) => ({ ...prev, [campo]: valor }))
  }

  const procesos = [
    { key: 'recepcionTOBE', label: 'Proceso 1: Recepción de Mercancía TO-BE' },
    { key: 'surtidoTOBE', label: 'Proceso 2: Surtido al Piso TO-BE' },
    { key: 'ventasTOBE', label: 'Proceso 3: Ventas TO-BE' },
    { key: 'inventarioTOBE', label: 'Proceso 4: Control de Inventario TO-BE' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-section-title">Problema 2: Procesos</h1>
        <p className="admin-section-subtitle">Optimización de procesos operativos</p>
      </div>

      {/* Sección de Análisis */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-blue-600" />
            Análisis de Procesos
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Identifica los principales hallazgos y causas raíz
          </p>
          <div className="space-y-4">
          <EditorTexto
            label="Principales hallazgos en el flujo operativo"
            value={data.hallazgosOperativo}
            onChange={(valor) => actualizarCampo('hallazgosOperativo', valor)}
            placeholder="Describe los principales hallazgos identificados en los procesos actuales..."
            rows={8}
          />
          <EditorTexto
            label="Causa raíz identificada"
            value={data.causaRaiz}
            onChange={(valor) => actualizarCampo('causaRaiz', valor)}
            placeholder="Identifica la causa raíz de los problemas encontrados..."
            rows={6}
          />
          </div>
        </div>
      </div>

      {/* Editor de Procesos Mejorados */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2">Procesos Mejorados (TO-BE)</h3>
          <p className="text-gray-700 font-semibold mb-4">
            Define los flujos mejorados para cada proceso crítico
          </p>
          <div className="space-y-6">
          {procesos.map((proceso) => (
            <div key={proceso.key} className="space-y-2">
              <EditorTexto
                label={proceso.label}
                value={data[proceso.key as keyof ProcesosData] as string}
                onChange={(valor) => actualizarCampo(proceso.key as keyof ProcesosData, valor)}
                placeholder={`Describe el flujo mejorado para ${proceso.label}...`}
                rows={6}
              />
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Sección de Tecnología */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2">Tecnología Propuesta</h3>
          <p className="text-gray-700 font-semibold mb-4">
            Define la tecnología que optimizará los procesos
          </p>
          <div>
          <EditorTexto
            label="Tecnología propuesta para optimizar procesos"
            value={data.tecnologiaPropuesta}
            onChange={(valor) => actualizarCampo('tecnologiaPropuesta', valor)}
            placeholder="Describe la tecnología propuesta y cómo optimizará los procesos..."
            rows={8}
          />
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={guardar}
          disabled={guardando}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {guardando ? 'Guardando...' : guardado ? 'Guardado ✓' : 'Guardar Cambios'}
        </Button>
        <Button
          onClick={descargarPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar Diagramas TO-BE (PDF)
        </Button>
      </div>
    </div>
  )
}


