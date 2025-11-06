'use client'

import { useState } from 'react'
import { TablaEditable } from './TablaEditable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface KPI {
  nombre: string
  formula: string
  meta: string
  frecuencia: string
  responsable: string
}

interface MatrizKPIsProps {
  nivel: 'estrategicos' | 'tacticos' | 'operativos'
  kpis: KPI[]
  onKPIsChange: (kpis: KPI[]) => void
  kpisPrecargados: KPI[]
}

export function MatrizKPIs({
  nivel,
  kpis,
  onKPIsChange,
  kpisPrecargados,
}: MatrizKPIsProps) {
  const agregarKPI = () => {
    onKPIsChange([
      ...kpis,
      {
        nombre: '',
        formula: '',
        meta: '',
        frecuencia: '',
        responsable: '',
      },
    ])
  }

  const eliminarKPI = (index: number) => {
    onKPIsChange(kpis.filter((_, i) => i !== index))
  }

  const titulos = {
    estrategicos: 'KPIs Estratégicos',
    tacticos: 'KPIs Tácticos',
    operativos: 'KPIs Operativos',
  }

  // Si no hay KPIs, cargar los precargados
  const datosAMostrar = kpis.length === 0 ? kpisPrecargados : kpis

  return (
    <div className="admin-stat-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-black font-bold text-xl">{titulos[nivel]}</h3>
          <Button onClick={agregarKPI} variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar KPI
          </Button>
        </div>
        <div>
        <TablaEditable
          columnas={[
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'formula', label: 'Fórmula', type: 'text' },
            { key: 'meta', label: 'Meta', type: 'text' },
            { key: 'frecuencia', label: 'Frecuencia', type: 'text' },
            { key: 'responsable', label: 'Responsable', type: 'text' },
          ]}
          datos={datosAMostrar}
          onDatosChange={(datos) => {
            onKPIsChange(datos as KPI[])
          }}
          onAgregarFila={agregarKPI}
          onEliminarFila={eliminarKPI}
        />
        </div>
      </div>
    </div>
  )
}


