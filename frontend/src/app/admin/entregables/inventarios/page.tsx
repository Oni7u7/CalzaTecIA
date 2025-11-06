'use client'

import { useState, useEffect } from 'react'
import { CalculadoraCobertura } from '@/components/entregables/CalculadoraCobertura'
import { EditorTexto } from '@/components/entregables/EditorTexto'
import { TablaEditable } from '@/components/entregables/TablaEditable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Download, Package, TrendingUp } from 'lucide-react'

const STORAGE_KEY = 'entregable_inventarios'

interface Tienda {
  nombre: string
  inventario: number
  ventaDiaria: number
  diasCobertura: number
  estado: string
}

interface RotacionData {
  unidadNegocio: string
  ventasAnuales2023: number
  inventarioPromedio2023: number
  ventasAnuales2024: number
  inventarioPromedio2024: number
  rotacion2023: number
  rotacion2024: number
}

interface InventariosData {
  tiendas: Tienda[]
  rotacion2023_2024: RotacionData[]
  planAccion: string
  estrategiasExactitud: string
  politicaInventario: string
}

export default function InventariosPage() {
  const [data, setData] = useState<InventariosData>({
    tiendas: [
      { nombre: 'Tienda Centro', inventario: 0, ventaDiaria: 0, diasCobertura: 0, estado: 'Óptimo' },
    ],
    rotacion2023_2024: [],
    planAccion: '',
    estrategiasExactitud: '',
    politicaInventario: '',
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

  const descargarExcel = (tipo: string) => {
    alert(`Descargando ${tipo} (Excel)...`)
  }

  const descargarPDF = (tipo: string) => {
    alert(`Descargando ${tipo} (PDF)...`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-section-title">Problema 3: Inventarios</h1>
        <p className="admin-section-subtitle">Análisis de cobertura y rotación de inventarios</p>
      </div>

      {/* Calculadora de Días de Cobertura */}
      <CalculadoraCobertura
        tiendas={data.tiendas}
        onTiendasChange={(tiendas) => setData((prev) => ({ ...prev, tiendas }))}
      />

      {/* Análisis de Rotación */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Análisis de Rotación 2023-2024
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Calcula la rotación de inventario por unidad de negocio
          </p>
          <div>
          <TablaEditable
            columnas={[
              { key: 'unidadNegocio', label: 'Unidad de Negocio', type: 'text' },
              { key: 'ventasAnuales2023', label: 'Ventas Anuales 2023', type: 'number' },
              { key: 'inventarioPromedio2023', label: 'Inventario Promedio 2023', type: 'number' },
              { key: 'rotacion2023', label: 'Rotación 2023', type: 'number', editable: false },
              { key: 'ventasAnuales2024', label: 'Ventas Anuales 2024', type: 'number' },
              { key: 'inventarioPromedio2024', label: 'Inventario Promedio 2024', type: 'number' },
              { key: 'rotacion2024', label: 'Rotación 2024', type: 'number', editable: false },
            ]}
            datos={data.rotacion2023_2024.map((item) => ({
              ...item,
              rotacion2023: item.inventarioPromedio2023 > 0
                ? Math.round((item.ventasAnuales2023 / item.inventarioPromedio2023) * 10) / 10
                : 0,
              rotacion2024: item.inventarioPromedio2024 > 0
                ? Math.round((item.ventasAnuales2024 / item.inventarioPromedio2024) * 10) / 10
                : 0,
            }))}
            onDatosChange={(datos) => {
              const rotacion = datos.map((d) => ({
                unidadNegocio: d.unidadNegocio || '',
                ventasAnuales2023: Number(d.ventasAnuales2023) || 0,
                inventarioPromedio2023: Number(d.inventarioPromedio2023) || 0,
                ventasAnuales2024: Number(d.ventasAnuales2024) || 0,
                inventarioPromedio2024: Number(d.inventarioPromedio2024) || 0,
                rotacion2023: 0,
                rotacion2024: 0,
              }))
              setData((prev) => ({ ...prev, rotacion2023_2024: rotacion }))
            }}
            onAgregarFila={() => {
              setData((prev) => ({
                ...prev,
                rotacion2023_2024: [
                  ...prev.rotacion2023_2024,
                  {
                    unidadNegocio: '',
                    ventasAnuales2023: 0,
                    inventarioPromedio2023: 0,
                    ventasAnuales2024: 0,
                    inventarioPromedio2024: 0,
                    rotacion2023: 0,
                    rotacion2024: 0,
                  },
                ],
              }))
            }}
            onEliminarFila={(index) => {
              setData((prev) => ({
                ...prev,
                rotacion2023_2024: prev.rotacion2023_2024.filter((_, i) => i !== index),
              }))
            }}
          />
          </div>
        </div>
      </div>

      {/* Propuestas */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Propuestas y Estrategias
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Define las acciones y estrategias para mejorar el inventario
          </p>
          <div className="space-y-4">
          <EditorTexto
            label="Plan de acción para sobre-inventario y venta perdida"
            value={data.planAccion}
            onChange={(valor) => setData((prev) => ({ ...prev, planAccion: valor }))}
            placeholder="Describe el plan de acción propuesto..."
            rows={6}
          />
          <EditorTexto
            label="Estrategias para mejorar exactitud de inventario"
            value={data.estrategiasExactitud}
            onChange={(valor) => setData((prev) => ({ ...prev, estrategiasExactitud: valor }))}
            placeholder="Describe las estrategias propuestas..."
            rows={6}
          />
          <EditorTexto
            label="Política de inventario propuesta"
            value={data.politicaInventario}
            onChange={(valor) => setData((prev) => ({ ...prev, politicaInventario: valor }))}
            placeholder="Define la política de inventario propuesta..."
            rows={6}
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
        <div className="flex gap-2">
          <Button
            onClick={() => descargarExcel('Análisis de Cobertura')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Cobertura (Excel)
          </Button>
          <Button
            onClick={() => descargarPDF('Política de Inventario')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Política (PDF)
          </Button>
          <Button
            onClick={() => descargarExcel('Rotación 2023-2024')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Rotación (Excel)
          </Button>
        </div>
      </div>
    </div>
  )
}


