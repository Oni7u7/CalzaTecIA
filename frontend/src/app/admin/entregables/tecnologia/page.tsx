'use client'

import { useState, useEffect } from 'react'
import { EditorTexto } from '@/components/entregables/EditorTexto'
import { TimelineImplementacion } from '@/components/entregables/TimelineImplementacion'
import { TablaEditable } from '@/components/entregables/TablaEditable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Download, Laptop, DollarSign, Brain } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const STORAGE_KEY = 'entregable_tecnologia'

interface Hardware {
  item: string
  cantidad: number
  costoUnitario: number
  costoTotal: number
}

interface Fase {
  nombre: string
  descripcion: string
  duracion: string
  responsables: string
}

interface TecnologiaData {
  sistemaGestion: string
  modulosFuncionales: string
  integracionesIA: string
  sistemaNotificaciones: string
  appMovil: string
  hardware: Hardware[]
  fases: Fase[]
  inversionInicial: number
  costosOperativosAnuales: number
  ahorrosProyectadosAnuales: number
  integracionHallazgos: string
  metricasExito: string
  comparativaASIS: string
}

export default function TecnologiaPage() {
  const [data, setData] = useState<TecnologiaData>({
    sistemaGestion: '',
    modulosFuncionales: '',
    integracionesIA: '',
    sistemaNotificaciones: '',
    appMovil: '',
    hardware: [],
    fases: [],
    inversionInicial: 0,
    costosOperativosAnuales: 0,
    ahorrosProyectadosAnuales: 0,
    integracionHallazgos: '',
    metricasExito: '',
    comparativaASIS: '',
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
    alert('Descargando Propuesta Completa (PDF)...')
  }

  const calcularCostoTotal = (): number => {
    return data.hardware.reduce((total, item) => {
      const costoTotal = item.cantidad * item.costoUnitario
      return total + costoTotal
    }, 0)
  }

  const calcularPayback = (): number => {
    if (data.ahorrosProyectadosAnuales === 0) return 0
    const payback = data.inversionInicial / data.ahorrosProyectadosAnuales
    return Math.round(payback * 10) / 10
  }

  const calcularNPV = (): number => {
    const tasa = 0.1 // 10% anual
    const años = 5
    let npv = -data.inversionInicial
    for (let i = 1; i <= años; i++) {
      const flujo = data.ahorrosProyectadosAnuales - data.costosOperativosAnuales
      npv += flujo / Math.pow(1 + tasa, i)
    }
    return Math.round(npv)
  }

  const actualizarHardware = (hardware: Hardware[]) => {
    setData((prev) => ({ ...prev, hardware }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-section-title">Problema 5: Propuesta Tecnológica</h1>
        <p className="admin-section-subtitle">Propuesta completa de tecnología y ROI</p>
      </div>

      {/* Software Propuesto */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <Laptop className="w-5 h-5 text-blue-600" />
            Software Propuesto
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Define el sistema de gestión integral propuesto
          </p>
          <div className="space-y-4">
          <EditorTexto
            label="Sistema de gestión integral (descripción)"
            value={data.sistemaGestion}
            onChange={(valor) => setData((prev) => ({ ...prev, sistemaGestion: valor }))}
            placeholder="Describe el sistema de gestión integral propuesto..."
            rows={6}
          />
          <EditorTexto
            label="Módulos funcionales"
            value={data.modulosFuncionales}
            onChange={(valor) => setData((prev) => ({ ...prev, modulosFuncionales: valor }))}
            placeholder="Lista los módulos funcionales del sistema..."
            rows={6}
          />
          <EditorTexto
            label="Integraciones de IA"
            value={data.integracionesIA}
            onChange={(valor) => setData((prev) => ({ ...prev, integracionesIA: valor }))}
            placeholder="Describe las integraciones de IA propuestas..."
            rows={6}
          />
          <EditorTexto
            label="Sistema de notificaciones"
            value={data.sistemaNotificaciones}
            onChange={(valor) => setData((prev) => ({ ...prev, sistemaNotificaciones: valor }))}
            placeholder="Describe el sistema de notificaciones..."
            rows={4}
          />
          <EditorTexto
            label="App móvil"
            value={data.appMovil}
            onChange={(valor) => setData((prev) => ({ ...prev, appMovil: valor }))}
            placeholder="Describe la aplicación móvil propuesta..."
            rows={4}
          />
          </div>
        </div>
      </div>

      {/* Hardware Necesario */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2">Hardware Necesario</h3>
          <p className="text-gray-700 font-semibold mb-4">
            Lista de equipos necesarios con costos
          </p>
          <div>
          <TablaEditable
            columnas={[
              { key: 'item', label: 'Item', type: 'text' },
              { key: 'cantidad', label: 'Cantidad', type: 'number' },
              { key: 'costoUnitario', label: 'Costo Unitario', type: 'number' },
              { key: 'costoTotal', label: 'Costo Total', type: 'number', editable: false },
            ]}
            datos={data.hardware.map((item) => ({
              ...item,
              costoTotal: item.cantidad * item.costoUnitario,
            }))}
            onDatosChange={(datos) => {
              const hardware = datos.map((d) => ({
                item: d.item || '',
                cantidad: Number(d.cantidad) || 0,
                costoUnitario: Number(d.costoUnitario) || 0,
                costoTotal: (Number(d.cantidad) || 0) * (Number(d.costoUnitario) || 0),
              }))
              actualizarHardware(hardware)
            }}
            onAgregarFila={() => {
              setData((prev) => ({
                ...prev,
                hardware: [
                  ...prev.hardware,
                  { item: '', cantidad: 0, costoUnitario: 0, costoTotal: 0 },
                ],
              }))
            }}
            onEliminarFila={(index) => {
              setData((prev) => ({
                ...prev,
                hardware: prev.hardware.filter((_, i) => i !== index),
              }))
            }}
          />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Hardware:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${calcularCostoTotal().toLocaleString()}
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Plan de Implementación */}
      <TimelineImplementacion
        fases={data.fases}
        onFasesChange={(fases) => setData((prev) => ({ ...prev, fases }))}
      />

      {/* Análisis de ROI */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Análisis de ROI
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Calcula el retorno de inversión y valor presente neto
          </p>
          <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Inversión Inicial</Label>
              <Input
                type="number"
                value={data.inversionInicial}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, inversionInicial: Number(e.target.value) || 0 }))
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Costos Operativos Anuales</Label>
              <Input
                type="number"
                value={data.costosOperativosAnuales}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    costosOperativosAnuales: Number(e.target.value) || 0,
                  }))
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Ahorros Proyectados Anuales</Label>
              <Input
                type="number"
                value={data.ahorrosProyectadosAnuales}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    ahorrosProyectadosAnuales: Number(e.target.value) || 0,
                  }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Payback Period</div>
              <div className="text-2xl font-bold text-blue-600">
                {calcularPayback()} años
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">NPV (5 años, 10%)</div>
              <div className="text-2xl font-bold text-green-600">
                ${calcularNPV().toLocaleString()}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Análisis de Información */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Análisis de Información
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Integración con hallazgos y comparativa AS-IS vs TO-BE
          </p>
          <div className="space-y-4">
          <EditorTexto
            label="Integración con hallazgos de problemas 1-4"
            value={data.integracionHallazgos}
            onChange={(valor) => setData((prev) => ({ ...prev, integracionHallazgos: valor }))}
            placeholder="Describe cómo esta propuesta tecnológica integra los hallazgos de los problemas anteriores..."
            rows={6}
          />
          <EditorTexto
            label="Métricas de éxito definidas"
            value={data.metricasExito}
            onChange={(valor) => setData((prev) => ({ ...prev, metricasExito: valor }))}
            placeholder="Define las métricas de éxito para medir el impacto de la implementación..."
            rows={6}
          />
          <EditorTexto
            label="Comparativa AS-IS vs TO-BE"
            value={data.comparativaASIS}
            onChange={(valor) => setData((prev) => ({ ...prev, comparativaASIS: valor }))}
            placeholder="Compara el estado actual (AS-IS) con el estado propuesto (TO-BE)..."
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
          {guardando ? 'Guardando...' : guardado ? 'Guardado ✓' : 'Guardar Propuesta'}
        </Button>
        <Button
          onClick={descargarPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar Propuesta Completa (PDF)
        </Button>
      </div>
    </div>
  )
}


