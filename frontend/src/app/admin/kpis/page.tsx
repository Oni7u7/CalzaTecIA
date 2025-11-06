'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KPICard } from '@/components/admin/KPICard'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  Target,
  AlertTriangle,
  Download,
  Settings,
  FileText,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react'
import { obtenerDatosUltimoMes, exportarDashboardPDF, exportarDashboardExcel, DashboardData } from '@/lib/export/dashboard'
import { calcularKPIsReales } from '@/lib/supabase/kpis'
import { supabase } from '@/lib/supabase'

export default function KPIsPage() {
  const [periodo, setPeriodo] = useState('mes')
  const [modalAlertas, setModalAlertas] = useState(false)
  const [modalExportar, setModalExportar] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [kpisReales, setKpisReales] = useState<any>(null)
  const [kpisOperativosReales, setKpisOperativosReales] = useState<any[]>([])

  // Cargar datos cuando cambie el período
  useEffect(() => {
    const cargarDatos = async () => {
      if (periodo === 'mes') {
        setCargandoDatos(true)
        try {
          const datos = await obtenerDatosUltimoMes()
          setDashboardData(datos)
          setKpisOperativosReales(datos.kpisOperativos)
          
          const kpis = await calcularKPIsReales()
          setKpisReales(kpis)
        } catch (error) {
          console.error('Error al cargar datos:', error)
        } finally {
          setCargandoDatos(false)
        }
      }
    }

    cargarDatos()
  }, [periodo])

  // Función para exportar dashboard
  const handleExportarDashboard = async (formato: 'pdf' | 'excel') => {
    if (!dashboardData) {
      // Cargar datos si no están disponibles
      setCargandoDatos(true)
      try {
        const datos = await obtenerDatosUltimoMes()
        setDashboardData(datos)
        
        if (formato === 'pdf') {
          await exportarDashboardPDF(datos)
        } else {
          await exportarDashboardExcel(datos)
        }
        setModalExportar(false)
      } catch (error) {
        console.error('Error al exportar:', error)
        alert('Error al exportar el dashboard. Por favor, intenta de nuevo.')
      } finally {
        setCargandoDatos(false)
      }
    } else {
      if (formato === 'pdf') {
        await exportarDashboardPDF(dashboardData)
      } else {
        await exportarDashboardExcel(dashboardData)
      }
      setModalExportar(false)
    }
  }

  // Datos simulados para KPIs Estratégicos
  const kpisEstrategicos = [
    {
      titulo: 'ROI (Return on Investment)',
      valorActual: 18.5,
      meta: 20,
      tendencia: 2.3,
      unidad: '%',
      estado: 'amarillo' as const,
      descripcion: 'Retorno sobre inversión consolidado',
      icono: <DollarSign className="w-5 h-5 text-blue-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[65, 70, 68, 72, 75, 78].map((valor, idx) => (
            <div
              key={idx}
              className="bg-blue-500 rounded-t"
              style={{ width: '20px', height: `${valor}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
    {
      titulo: 'Rotación de Inventario Anual',
      valorActual: 8.2,
      meta: 10,
      tendencia: 0.5,
      unidad: 'veces',
      estado: 'amarillo' as const,
      descripcion: 'Rotación promedio anual de inventario',
      icono: <Package className="w-5 h-5 text-purple-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[70, 72, 75, 78, 80, 82].map((valor, idx) => (
            <div
              key={idx}
              className="bg-purple-500 rounded-t"
              style={{ width: '20px', height: `${valor}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
    {
      titulo: 'Margen Bruto Consolidado',
      valorActual: 42,
      meta: 45,
      tendencia: 0,
      unidad: '%',
      estado: 'amarillo' as const,
      descripcion: 'Margen bruto promedio de todas las tiendas',
      icono: <BarChart3 className="w-5 h-5 text-green-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[85, 88, 87, 90, 92, 93].map((valor, idx) => (
            <div
              key={idx}
              className="bg-green-500 rounded-t"
              style={{ width: '20px', height: `${valor}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
    {
      titulo: 'Crecimiento en Ventas',
      valorActual: 12,
      meta: 15,
      tendencia: 3,
      unidad: '%',
      estado: 'verde' as const,
      descripcion: 'Crecimiento anual comparado con el año anterior',
      icono: <TrendingUp className="w-5 h-5 text-orange-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-2 p-2">
          {[
            { actual: 75, anterior: 70 },
            { actual: 78, anterior: 72 },
            { actual: 80, anterior: 75 },
            { actual: 82, anterior: 78 },
            { actual: 85, anterior: 80 },
            { actual: 88, anterior: 82 },
          ].map((dato, idx) => (
            <div key={idx} className="flex items-end gap-1">
              <div
                className="bg-gray-400 rounded-t"
                style={{ width: '12px', height: `${dato.anterior}%` }}
                title={`Anterior: ${dato.anterior}%`}
              />
              <div
                className="bg-orange-500 rounded-t"
                style={{ width: '12px', height: `${dato.actual}%` }}
                title={`Actual: ${dato.actual}%`}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      titulo: 'Rentabilidad por Tienda',
      valorActual: 125000,
      meta: 150000,
      tendencia: 5,
      unidad: '/mes',
      estado: 'amarillo' as const,
      descripcion: 'Promedio de rentabilidad mensual por tienda',
      icono: <Target className="w-5 h-5 text-indigo-600" />,
      grafica: (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Mejor: Santa Fe ($180,000)</span>
            <span className="text-gray-600">Peor: Norte ($85,000)</span>
          </div>
          <div className="h-20 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
            {['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe'].map((tienda, idx) => {
              const valores = [95, 85, 57, 110, 120]
              return (
                <div key={tienda} className="flex flex-col items-center gap-1">
                  <div
                    className="bg-indigo-500 rounded-t"
                    style={{ width: '24px', height: `${valores[idx]}%` }}
                    title={`${tienda}: ${valores[idx]}%`}
                  />
                  <span className="text-xs text-gray-600 rotate-90 whitespace-nowrap transform translate-x-1">
                    {tienda.substring(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ),
    },
    {
      titulo: 'Market Share',
      valorActual: 3.5,
      meta: 5,
      tendencia: 0.8,
      unidad: '%',
      estado: 'verde' as const,
      descripcion: 'Participación de mercado en el sector',
      icono: <BarChart3 className="w-5 h-5 text-teal-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[60, 65, 68, 70, 72, 75].map((valor, idx) => (
            <div
              key={idx}
              className="bg-teal-500 rounded-t"
              style={{ width: '20px', height: `${valor}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
  ]

  // Datos simulados para KPIs Tácticos
  const kpisTacticos = [
    {
      titulo: 'Días de Cobertura de Inventario',
      valorActual: 52,
      meta: '28-90',
      tendencia: -2,
      unidad: 'días',
      estado: 'verde' as const,
      descripcion: 'Promedio de días de cobertura de inventario',
      icono: <Package className="w-5 h-5 text-blue-600" />,
      grafica: (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Tiendas fuera de rango: 2 (28%)</span>
          </div>
          <div className="h-20 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
            {['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe'].map((tienda, idx) => {
              const valores = [45, 52, 38, 58, 62]
              return (
                <div key={tienda} className="flex flex-col items-center gap-1">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{ width: '24px', height: `${valores[idx]}%` }}
                    title={`${tienda}: ${valores[idx]} días`}
                  />
                  <span className="text-xs text-gray-600 rotate-90 whitespace-nowrap transform translate-x-1">
                    {tienda.substring(0, 3)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ),
    },
    {
      titulo: 'Exactitud de Inventario',
      valorActual: 94,
      meta: 98,
      tendencia: 3,
      unidad: '%',
      estado: 'amarillo' as const,
      descripcion: 'Precisión del inventario físico vs sistema',
      icono: <Target className="w-5 h-5 text-green-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[88, 90, 91, 92, 93, 94].map((valor, idx) => (
            <div
              key={idx}
              className="bg-green-500 rounded-t"
              style={{ width: '20px', height: `${valor}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
    {
      titulo: 'Fill Rate (Tasa de Surtido)',
      valorActual: 89,
      meta: 95,
      tendencia: 2,
      unidad: '%',
      estado: 'amarillo' as const,
      descripcion: 'Tasa de cumplimiento de pedidos',
      icono: <Package className="w-5 h-5 text-purple-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[85, 86, 87, 88, 89, 89].map((valor, idx) => (
            <div
              key={idx}
              className="bg-purple-500 rounded-t"
              style={{ width: '20px', height: `${valor}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
    {
      titulo: 'Rotación de Personal',
      valorActual: 18,
      meta: 15,
      tendencia: -2,
      unidad: '% anual',
      estado: 'rojo' as const,
      descripcion: 'Tasa de rotación de personal anual',
      icono: <AlertTriangle className="w-5 h-5 text-red-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[20, 19, 19, 18, 18, 18].map((valor, idx) => (
            <div
              key={idx}
              className="bg-red-500 rounded-t"
              style={{ width: '20px', height: `${valor * 5}%` }}
              title={`${valor}%`}
            />
          ))}
        </div>
      ),
    },
    {
      titulo: 'Productividad por Empleado',
      valorActual: 85000,
      meta: 100000,
      tendencia: 5,
      unidad: '/año',
      estado: 'amarillo' as const,
      descripcion: 'Ventas promedio por empleado al año',
      icono: <BarChart3 className="w-5 h-5 text-orange-600" />,
      grafica: (
        <div className="h-20 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe'].map((tienda, idx) => {
            const valores = [85, 80, 75, 90, 95]
            return (
              <div key={tienda} className="flex flex-col items-center gap-1">
                <div
                  className="bg-orange-500 rounded-t"
                  style={{ width: '24px', height: `${valores[idx]}%` }}
                  title={`${tienda}: ${valores[idx]}%`}
                />
                <span className="text-xs text-gray-600 rotate-90 whitespace-nowrap transform translate-x-1">
                  {tienda.substring(0, 3)}
                </span>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      titulo: 'Ticket Promedio',
      valorActual: 1245,
      meta: 1500,
      tendencia: 8,
      unidad: 'MXN',
      estado: 'amarillo' as const,
      descripcion: 'Ticket promedio de venta',
      icono: <DollarSign className="w-5 h-5 text-indigo-600" />,
      grafica: (
        <div className="h-24 bg-gray-100 rounded flex items-end justify-center gap-1 p-2">
          {[1150, 1180, 1200, 1220, 1235, 1245].map((valor, idx) => (
            <div
              key={idx}
              className="bg-indigo-500 rounded-t"
              style={{ width: '20px', height: `${(valor / 1500) * 100}%` }}
              title={`$${valor}`}
            />
          ))}
        </div>
      ),
    },
  ]

  // Usar datos reales si están disponibles, sino usar datos simulados
  const kpisOperativos = kpisOperativosReales.length > 0 ? kpisOperativosReales : [
    {
      tienda: 'Centro',
      tiempoRecibo: 25,
      tiempoSurtido: 45,
      ventasHora: 8.5,
      unidadesDia: 120,
      merma: 1.8,
      incidencias: 2,
    },
    {
      tienda: 'Sur',
      tiempoRecibo: 30,
      tiempoSurtido: 50,
      ventasHora: 7.2,
      unidadesDia: 95,
      merma: 2.1,
      incidencias: 3,
    },
    {
      tienda: 'Norte',
      tiempoRecibo: 35,
      tiempoSurtido: 55,
      ventasHora: 6.8,
      unidadesDia: 85,
      merma: 2.5,
      incidencias: 4,
    },
    {
      tienda: 'Satélite',
      tiempoRecibo: 22,
      tiempoSurtido: 40,
      ventasHora: 9.2,
      unidadesDia: 135,
      merma: 1.5,
      incidencias: 1,
    },
    {
      tienda: 'Santa Fe',
      tiempoRecibo: 20,
      tiempoSurtido: 38,
      ventasHora: 10.5,
      unidadesDia: 150,
      merma: 1.2,
      incidencias: 0,
    },
  ]

  const obtenerColorCelda = (valor: number, meta: number, tipo: 'menor' | 'mayor' = 'menor') => {
    if (tipo === 'menor') {
      if (valor < meta * 0.9) return 'bg-green-100 text-green-800'
      if (valor < meta * 1.1) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    } else {
      if (valor > meta * 1.1) return 'bg-green-100 text-green-800'
      if (valor > meta * 0.9) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    }
  }

  const promedios = {
    tiempoRecibo:
      kpisOperativos.length > 0 ? kpisOperativos.reduce((sum, kpi) => sum + kpi.tiempoRecibo, 0) / kpisOperativos.length : 0,
    tiempoSurtido:
      kpisOperativos.length > 0 ? kpisOperativos.reduce((sum, kpi) => sum + kpi.tiempoSurtido, 0) / kpisOperativos.length : 0,
    ventasHora:
      kpisOperativos.length > 0 ? kpisOperativos.reduce((sum, kpi) => sum + kpi.ventasHora, 0) / kpisOperativos.length : 0,
    unidadesDia:
      kpisOperativos.length > 0 ? kpisOperativos.reduce((sum, kpi) => sum + kpi.unidadesDia, 0) / kpisOperativos.length : 0,
    merma: kpisOperativos.length > 0 ? kpisOperativos.reduce((sum, kpi) => sum + (typeof kpi.merma === 'string' ? parseFloat(kpi.merma) : kpi.merma), 0) / kpisOperativos.length : 0,
    incidencias:
      kpisOperativos.length > 0 ? kpisOperativos.reduce((sum, kpi) => sum + kpi.incidencias, 0) / kpisOperativos.length : 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-section-title">KPIs Estratégicos - Vista Ejecutiva</h1>
          <p className="admin-section-subtitle">
            Métricas de desempeño consolidadas - {periodo === 'mes' ? 'Último Mes' : periodo === 'semana' ? 'Última Semana' : periodo === 'trimestre' ? 'Último Trimestre' : 'Último Año'}
            {dashboardData && (
              <span className="ml-2 text-sm opacity-70">
                (Actualizado: {new Date().toLocaleDateString('es-MX')})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Última Semana</SelectItem>
              <SelectItem value="mes">Último Mes</SelectItem>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
              <SelectItem value="año">Último Año</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => setModalExportar(true)}
            disabled={cargandoDatos}
          >
            {cargandoDatos ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar Dashboard
              </>
            )}
          </Button>
          <Dialog open={modalAlertas} onOpenChange={setModalAlertas}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar Alertas</DialogTitle>
                <DialogDescription>
                  Define umbrales personalizables para los KPIs
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Umbral de Alerta (Amarillo)</Label>
                  <Input type="number" placeholder="% de desviación" />
                </div>
                <div className="space-y-2">
                  <Label>Umbral Crítico (Rojo)</Label>
                  <Input type="number" placeholder="% de desviación" />
                </div>
                <Button
                  onClick={() => {
                    alert('Alertas configuradas (simulado)')
                    setModalAlertas(false)
                  }}
                  className="w-full"
                >
                  Guardar Configuración
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setModalAlertas(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurar Alertas
          </Button>
        </div>
      </div>

      {/* Modal de Exportar Dashboard */}
      <Dialog open={modalExportar} onOpenChange={setModalExportar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Dashboard</DialogTitle>
            <DialogDescription>
              Selecciona el formato para exportar el dashboard de KPIs del {periodo === 'mes' ? 'Último Mes' : periodo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => handleExportarDashboard('pdf')}
                disabled={cargandoDatos}
                className="flex flex-col items-center gap-3 h-auto py-6"
                variant="outline"
              >
                <FileText className="w-8 h-8" style={{ color: '#ef4444' }} />
                <div className="text-center">
                  <div className="font-bold">Exportar como PDF</div>
                  <div className="text-xs opacity-70">Formato para imprimir</div>
                </div>
              </Button>
              <Button
                onClick={() => handleExportarDashboard('excel')}
                disabled={cargandoDatos}
                className="flex flex-col items-center gap-3 h-auto py-6"
                variant="outline"
              >
                <FileSpreadsheet className="w-8 h-8" style={{ color: '#10b981' }} />
                <div className="text-center">
                  <div className="font-bold">Exportar como Excel</div>
                  <div className="text-xs opacity-70">Formato CSV editable</div>
                </div>
              </Button>
            </div>
            {cargandoDatos && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Cargando datos del último mes...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="estrategicos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estrategicos">Estratégicos</TabsTrigger>
          <TabsTrigger value="tacticos">Tácticos</TabsTrigger>
          <TabsTrigger value="operativos">Operativos</TabsTrigger>
        </TabsList>

        <TabsContent value="estrategicos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpisEstrategicos.map((kpi, idx) => (
              <KPICard key={idx} {...kpi} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tacticos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpisTacticos.map((kpi, idx) => (
              <KPICard key={idx} {...kpi} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operativos" className="mt-6">
          {/* Resumen del Último Mes */}
          {dashboardData && dashboardData.resumen && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card style={{ background: '#86a9ed', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#0F172A' }}>
                        Total Ventas
                      </p>
                      <p className="text-2xl font-extrabold" style={{ color: '#0F172A' }}>
                        ${dashboardData.resumen.totalVentas.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8" style={{ color: '#0F172A', opacity: 0.7 }} />
                  </div>
                </CardContent>
              </Card>
              <Card style={{ background: '#86a9ed', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#0F172A' }}>
                        Total Tiendas
                      </p>
                      <p className="text-2xl font-extrabold" style={{ color: '#0F172A' }}>
                        {dashboardData.resumen.totalTiendas}
                      </p>
                    </div>
                    <Package className="w-8 h-8" style={{ color: '#0F172A', opacity: 0.7 }} />
                  </div>
                </CardContent>
              </Card>
              <Card style={{ background: '#86a9ed', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#0F172A' }}>
                        Ticket Promedio
                      </p>
                      <p className="text-2xl font-extrabold" style={{ color: '#0F172A' }}>
                        ${dashboardData.resumen.promedioTicket.toLocaleString()}
                      </p>
                    </div>
                    <Target className="w-8 h-8" style={{ color: '#0F172A', opacity: 0.7 }} />
                  </div>
                </CardContent>
              </Card>
              <Card style={{ background: '#86a9ed', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#0F172A' }}>
                        Rotación Inventario
                      </p>
                      <p className="text-2xl font-extrabold" style={{ color: '#0F172A' }}>
                        {dashboardData.resumen.rotacionInventario.toFixed(2)}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8" style={{ color: '#0F172A', opacity: 0.7 }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Indicador de carga */}
          {cargandoDatos && periodo === 'mes' && (
            <div className="admin-stat-card mb-6">
              <div className="p-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--color-teal-400)' }} />
                <p className="font-bold" style={{ color: 'var(--color-neutral-100)' }}>
                  Cargando datos del último mes...
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-neutral-300)' }}>
                  Obteniendo información de ventas, inventario y tiendas
                </p>
              </div>
            </div>
          )}

          <div className="admin-stat-card">
            <div className="p-6">
              <h3 className="text-black font-bold text-xl mb-2">KPIs Operativos por Tienda</h3>
              <p className="text-gray-700 font-semibold mb-4">
                Métricas operativas detalladas por sucursal - {periodo === 'mes' ? 'Último Mes' : periodo}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tienda
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tiempo Recibo (min)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tiempo Surtido (min)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Ventas/Hora
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Unidades/Día
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Merma %
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Incidencias
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpisOperativos.map((kpi, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {kpi.tienda}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${obtenerColorCelda(
                            kpi.tiempoRecibo,
                            30,
                            'menor'
                          )}`}
                        >
                          {kpi.tiempoRecibo}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${obtenerColorCelda(
                            kpi.tiempoSurtido,
                            50,
                            'menor'
                          )}`}
                        >
                          {kpi.tiempoSurtido}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${obtenerColorCelda(
                            kpi.ventasHora,
                            8,
                            'mayor'
                          )}`}
                        >
                          {kpi.ventasHora.toFixed(1)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${obtenerColorCelda(
                            kpi.unidadesDia,
                            100,
                            'mayor'
                          )}`}
                        >
                          {kpi.unidadesDia}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${obtenerColorCelda(
                            kpi.merma,
                            2,
                            'menor'
                          )}`}
                        >
                          {kpi.merma.toFixed(1)}%
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${obtenerColorCelda(
                            kpi.incidencias,
                            2,
                            'menor'
                          )}`}
                        >
                          {kpi.incidencias}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="px-4 py-3 text-sm text-gray-900">Promedio</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {promedios.tiempoRecibo.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {promedios.tiempoSurtido.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {promedios.ventasHora.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {promedios.unidadesDia.toFixed(0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {promedios.merma.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {promedios.incidencias.toFixed(1)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
