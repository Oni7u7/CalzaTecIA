'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Download, Save, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Funciones de guardado
const guardarEntregable = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

const obtenerEntregable = (key: string): any => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Calcular progreso
const calcularProgreso = (): number => {
  const entregables = [
    'entregable_estructura',
    'entregable_procesos',
    'entregable_inventarios',
    'entregable_kpis',
    'entregable_tecnologia',
  ]

  let completados = 0
  entregables.forEach((key) => {
    const data = obtenerEntregable(key)
    if (data && Object.keys(data).length > 0) {
      completados++
    }
  })

  return Math.round((completados / entregables.length) * 100)
}

export default function EntregablesPage() {
  const pathname = usePathname()
  const [progreso, setProgreso] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    setProgreso(calcularProgreso())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGuardando(true)
      setGuardado(false)
      // Simular guardado automático de todos los entregables
      const entregables = [
        'entregable_estructura',
        'entregable_procesos',
        'entregable_inventarios',
        'entregable_kpis',
        'entregable_tecnologia',
      ]
      
      entregables.forEach((key) => {
        const data = obtenerEntregable(key)
        if (data && Object.keys(data).length > 0) {
          guardarEntregable(key, data)
        }
      })
      
      setTimeout(() => {
        setGuardando(false)
        setGuardado(true)
        setProgreso(calcularProgreso())
        setTimeout(() => setGuardado(false), 2000)
      }, 500)
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const handleDescargarTodo = () => {
    alert('Descargando todos los entregables...')
  }

  const problemas = [
    {
      id: 'estructura',
      label: 'Problema 1: Estructura Organizacional',
      ruta: '/admin/entregables/estructura',
      descripcion: 'Análisis y rediseño de la estructura organizacional',
    },
    {
      id: 'procesos',
      label: 'Problema 2: Procesos',
      ruta: '/admin/entregables/procesos',
      descripcion: 'Optimización de procesos operativos',
    },
    {
      id: 'inventarios',
      label: 'Problema 3: Inventarios',
      ruta: '/admin/entregables/inventarios',
      descripcion: 'Análisis de cobertura y rotación de inventarios',
    },
    {
      id: 'kpis',
      label: 'Problema 4: KPIs',
      ruta: '/admin/entregables/kpis',
      descripcion: 'Matriz de KPIs estratégicos, tácticos y operativos',
    },
    {
      id: 'tecnologia',
      label: 'Problema 5: Propuesta Tecnológica',
      ruta: '/admin/entregables/tecnologia',
      descripcion: 'Propuesta completa de tecnología y ROI',
    },
  ]

  const obtenerProgresoProblema = (key: string): number => {
    const data = obtenerEntregable(key)
    if (!data || Object.keys(data).length === 0) return 0
    // Calcular porcentaje basado en campos completados
    const campos = Object.values(data).filter((v) => v !== '' && v !== null && v !== undefined)
    return Math.round((campos.length / Object.keys(data).length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-section-title">Entregables del Hackathon</h1>
          <p className="admin-section-subtitle">
            Gestiona los 5 problemas identificados y sus soluciones
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {guardando && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>Guardando...</span>
              </>
            )}
            {guardado && (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Guardado</span>
              </>
            )}
          </div>
          <Button onClick={handleDescargarTodo} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar Todo
          </Button>
        </div>
      </div>

      {/* Barra de Progreso Global */}
      <div className="admin-stat-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-black font-bold text-xl">Progreso General</h3>
            <span className="text-2xl font-bold text-blue-600">{progreso}%</span>
          </div>
          <Progress value={progreso} className="h-3" />
        </div>
      </div>

      {/* Tabs de Navegación */}
      <Tabs defaultValue={problemas[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {problemas.map((problema) => (
            <TabsTrigger key={problema.id} value={problema.id}>
              {problema.label.split(': ')[1]}
            </TabsTrigger>
          ))}
        </TabsList>

        {problemas.map((problema) => {
          const progresoProblema = obtenerProgresoProblema(
            `entregable_${problema.id}`
          )
          return (
            <TabsContent key={problema.id} value={problema.id} className="mt-6">
              <div className="admin-stat-card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-black font-bold text-xl">{problema.label}</h3>
                      <p className="text-gray-700 font-semibold mt-2">{problema.descripcion}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-700 font-semibold">Progreso</div>
                      <div className="text-2xl font-bold text-blue-600">{progresoProblema}%</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Progress value={progresoProblema} className="h-2" />
                    <Link href={problema.ruta}>
                      <Button className="w-full font-bold">Ir a {problema.label}</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
