'use client'

import { useState, useEffect } from 'react'
import { MatrizKPIs } from '@/components/entregables/MatrizKPIs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Save, Download, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const STORAGE_KEY = 'entregable_kpis'

interface KPI {
  nombre: string
  formula: string
  meta: string
  frecuencia: string
  responsable: string
}

interface KPIsData {
  estrategicos: KPI[]
  tacticos: KPI[]
  operativos: KPI[]
}

const kpisEstrategicosPrecargados: KPI[] = [
  { nombre: 'ROI', formula: '(Ganancia / Inversión) * 100', meta: '15%', frecuencia: 'Mensual', responsable: 'Director Nacional' },
  { nombre: 'Rotación Anual', formula: 'Ventas Anuales / Inventario Promedio', meta: '8', frecuencia: 'Anual', responsable: 'Gerente Nacional' },
  { nombre: 'Margen Bruto', formula: '(Ingresos - Costos) / Ingresos * 100', meta: '35%', frecuencia: 'Mensual', responsable: 'Gerente Nacional' },
  { nombre: 'Crecimiento Ventas', formula: '((Ventas Actual - Ventas Anterior) / Ventas Anterior) * 100', meta: '10%', frecuencia: 'Mensual', responsable: 'Director Nacional' },
]

const kpisTacticosPrecargados: KPI[] = [
  { nombre: 'Días Cobertura', formula: 'Inventario / Venta Diaria', meta: '45 días', frecuencia: 'Semanal', responsable: 'Gerente Tienda' },
  { nombre: 'Exactitud Inventario', formula: '(Inventario Real / Inventario Sistema) * 100', meta: '95%', frecuencia: 'Mensual', responsable: 'Almacenista' },
  { nombre: 'Fill Rate', formula: '(Productos Entregados / Productos Solicitados) * 100', meta: '98%', frecuencia: 'Semanal', responsable: 'Supervisor' },
  { nombre: 'Rotación Personal', formula: 'Empleados Salidos / Empleados Totales * 100', meta: '5%', frecuencia: 'Mensual', responsable: 'Gerente Tienda' },
]

const kpisOperativosPrecargados: KPI[] = [
  { nombre: 'Tiempo Recibo', formula: 'Tiempo Total Recepción / Cantidad Productos', meta: '2 min/producto', frecuencia: 'Diaria', responsable: 'Almacenista' },
  { nombre: 'Tiempo Surtido', formula: 'Tiempo Total Surtido / Cantidad Productos', meta: '1.5 min/producto', frecuencia: 'Diaria', responsable: 'Almacenista' },
  { nombre: 'Ventas/Hora', formula: 'Ventas Totales / Horas Trabajadas', meta: '$500/hora', frecuencia: 'Diaria', responsable: 'Vendedor' },
  { nombre: 'Tickets Promedio', formula: 'Ventas Totales / Cantidad Tickets', meta: '$250', frecuencia: 'Diaria', responsable: 'Cajero' },
]

export default function KPIsPage() {
  const [data, setData] = useState<KPIsData>({
    estrategicos: [],
    tacticos: [],
    operativos: [],
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
    alert('Descargando Matriz de KPIs (Excel/PDF)...')
  }

  // Datos simulados para el dashboard
  const datosSimulados = [
    { nombre: 'ROI', actual: 12.5, meta: 15, estado: 'warning' },
    { nombre: 'Rotación Anual', actual: 7.2, meta: 8, estado: 'warning' },
    { nombre: 'Margen Bruto', actual: 38.5, meta: 35, estado: 'success' },
    { nombre: 'Crecimiento Ventas', actual: 8.3, meta: 10, estado: 'warning' },
  ]

  const obtenerEstado = (actual: number, meta: number): 'success' | 'warning' | 'danger' => {
    const porcentaje = (actual / meta) * 100
    if (porcentaje >= 100) return 'success'
    if (porcentaje >= 80) return 'warning'
    return 'danger'
  }

  const obtenerIcono = (estado: string) => {
    switch (estado) {
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'danger':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      default:
        return <Minus className="w-5 h-5 text-yellow-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-section-title">Problema 4: KPIs</h1>
        <p className="admin-section-subtitle">Matriz de KPIs estratégicos, tácticos y operativos</p>
      </div>

      {/* Matriz de KPIs */}
      <Tabs defaultValue="estrategicos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estrategicos">Estratégicos</TabsTrigger>
          <TabsTrigger value="tacticos">Tácticos</TabsTrigger>
          <TabsTrigger value="operativos">Operativos</TabsTrigger>
        </TabsList>

        <TabsContent value="estrategicos" className="mt-6">
          <MatrizKPIs
            nivel="estrategicos"
            kpis={data.estrategicos.length === 0 ? kpisEstrategicosPrecargados : data.estrategicos}
            onKPIsChange={(kpis) => setData((prev) => ({ ...prev, estrategicos: kpis }))}
            kpisPrecargados={kpisEstrategicosPrecargados}
          />
        </TabsContent>

        <TabsContent value="tacticos" className="mt-6">
          <MatrizKPIs
            nivel="tacticos"
            kpis={data.tacticos.length === 0 ? kpisTacticosPrecargados : data.tacticos}
            onKPIsChange={(kpis) => setData((prev) => ({ ...prev, tacticos: kpis }))}
            kpisPrecargados={kpisTacticosPrecargados}
          />
        </TabsContent>

        <TabsContent value="operativos" className="mt-6">
          <MatrizKPIs
            nivel="operativos"
            kpis={data.operativos.length === 0 ? kpisOperativosPrecargados : data.operativos}
            onKPIsChange={(kpis) => setData((prev) => ({ ...prev, operativos: kpis }))}
            kpisPrecargados={kpisOperativosPrecargados}
          />
        </TabsContent>
      </Tabs>

      {/* Dashboard de Visualización */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Dashboard de KPIs
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Visualización de KPIs actuales vs metas (datos simulados)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datosSimulados.map((kpi, index) => {
              const estado = obtenerEstado(kpi.actual, kpi.meta)
              const porcentaje = Math.round((kpi.actual / kpi.meta) * 100)
              const colorEstado =
                estado === 'success'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : estado === 'warning'
                  ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                  : 'bg-red-100 border-red-300 text-red-800'

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${colorEstado}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-black">{kpi.nombre}</h3>
                    {obtenerIcono(estado)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">Actual:</span>
                      <span className="font-bold text-black">{kpi.actual}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-900">Meta:</span>
                      <span className="font-bold text-black">{kpi.meta}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          estado === 'success'
                            ? 'bg-green-600'
                            : estado === 'warning'
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-center font-bold text-gray-900">{porcentaje}% de la meta</div>
                  </div>
                </div>
              )
            })}
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
          {guardando ? 'Guardando...' : guardado ? 'Guardado ✓' : 'Guardar Matriz'}
        </Button>
        <Button
          onClick={descargarPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar Matriz de KPIs (Excel/PDF)
        </Button>
      </div>
    </div>
  )
}


