'use client'

import { useState, useEffect } from 'react'
import { EditorTexto } from '@/components/entregables/EditorTexto'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Download, Building2 } from 'lucide-react'
import { Users, TrendingUp, Shield } from 'lucide-react'

const STORAGE_KEY = 'entregable_estructura'

interface EstructuraData {
  fallasRoles: string
  rediseñoEstructura: string
  estrategiaRotacion: string
  rolesCriticos: string
}

const rolesPropuestos = [
  { nivel: 1, rol: 'Administrador', descripcion: 'Máximo responsable del sistema' },
  { nivel: 2, rol: 'Director Nacional', descripcion: 'Responsable de operaciones nacionales' },
  { nivel: 3, rol: 'Gerente Nacional', descripcion: 'Gestión de múltiples tiendas' },
  { nivel: 4, rol: 'Gerente de Tienda', descripcion: 'Responsable de una tienda' },
  { nivel: 5, rol: 'Supervisor de Tienda', descripcion: 'Supervisión operativa' },
  { nivel: 6, rol: 'Vendedor Senior', descripcion: 'Ventas especializadas' },
  { nivel: 7, rol: 'Vendedor', descripcion: 'Ventas generales' },
  { nivel: 8, rol: 'Almacenista', descripcion: 'Gestión de inventario' },
  { nivel: 9, rol: 'Cajero', descripcion: 'Procesamiento de pagos' },
  { nivel: 10, rol: 'Asistente', descripcion: 'Soporte general' },
]

export default function EstructuraPage() {
  const [data, setData] = useState<EstructuraData>({
    fallasRoles: '',
    rediseñoEstructura: '',
    estrategiaRotacion: '',
    rolesCriticos: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    // Cargar datos guardados
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
    alert('Descargando Organigrama TO-BE (PDF)...')
  }

  const actualizarCampo = (campo: keyof EstructuraData, valor: string) => {
    setData((prev) => ({ ...prev, [campo]: valor }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-section-title">Problema 1: Estructura Organizacional</h1>
        <p className="admin-section-subtitle">Análisis y rediseño de la estructura organizacional</p>
      </div>

      {/* Sección de Análisis */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Análisis de Fallas Actuales
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Identifica las principales fallas en la estructura organizacional actual
          </p>
          <div className="space-y-4">
          <EditorTexto
            label="¿Cuáles son las fallas fundamentales de los roles actuales?"
            value={data.fallasRoles}
            onChange={(valor) => actualizarCampo('fallasRoles', valor)}
            placeholder="Describe las principales fallas identificadas en los roles actuales..."
            rows={8}
          />
          </div>
        </div>
      </div>

      {/* Sección de Propuesta TO-BE */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            Propuesta TO-BE
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Define la nueva estructura organizacional propuesta
          </p>
          <div className="space-y-4">
          <EditorTexto
            label="¿Cómo rediseñarían la estructura para fomentar colaboración?"
            value={data.rediseñoEstructura}
            onChange={(valor) => actualizarCampo('rediseñoEstructura', valor)}
            placeholder="Describe la nueva estructura organizacional..."
            rows={8}
          />
          <EditorTexto
            label="Estrategia para reducir rotación y desarrollar personal"
            value={data.estrategiaRotacion}
            onChange={(valor) => actualizarCampo('estrategiaRotacion', valor)}
            placeholder="Describe las estrategias propuestas..."
            rows={6}
          />
          <EditorTexto
            label="Roles críticos identificados"
            value={data.rolesCriticos}
            onChange={(valor) => actualizarCampo('rolesCriticos', valor)}
            placeholder="Lista los roles más críticos para el éxito de la organización..."
            rows={6}
          />
          </div>
        </div>
      </div>

      {/* Visualizador de Organigrama */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Organigrama TO-BE Propuesto
          </h3>
          <p className="text-gray-700 font-semibold mb-4">
            Estructura jerárquica de los 10 roles propuestos
          </p>
          <div className="space-y-3">
            {rolesPropuestos.map((rol, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  {rol.nivel}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">{rol.rol}</h3>
                  <p className="text-sm font-semibold text-gray-700">{rol.descripcion}</p>
                </div>
                {index < rolesPropuestos.length - 1 && (
                  <div className="absolute left-6 w-0.5 h-6 bg-blue-500 -bottom-3"></div>
                )}
              </div>
            ))}
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
          Descargar Organigrama TO-BE (PDF)
        </Button>
      </div>
    </div>
  )
}


