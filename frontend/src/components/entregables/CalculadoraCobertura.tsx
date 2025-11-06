'use client'

import { useState } from 'react'
import { TablaEditable } from './TablaEditable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface Tienda {
  nombre: string
  inventario: number
  ventaDiaria: number
  diasCobertura: number
  estado: string
}

interface CalculadoraCoberturaProps {
  tiendas: Tienda[]
  onTiendasChange: (tiendas: Tienda[]) => void
}

export function CalculadoraCobertura({ tiendas, onTiendasChange }: CalculadoraCoberturaProps) {
  const calcularCobertura = (inventario: number, ventaDiaria: number): number => {
    if (ventaDiaria === 0) return 0
    return Math.round((inventario / ventaDiaria) * 10) / 10
  }

  const obtenerEstado = (dias: number): string => {
    if (dias < 28) return 'Bajo'
    if (dias > 90) return 'Alto'
    return 'Óptimo'
  }

  const actualizarTienda = (index: number, campo: string, valor: number) => {
    const nuevasTiendas = [...tiendas]
    nuevasTiendas[index] = {
      ...nuevasTiendas[index],
      [campo]: valor,
    }

    // Recalcular días de cobertura
    const diasCobertura = calcularCobertura(
      nuevasTiendas[index].inventario,
      nuevasTiendas[index].ventaDiaria
    )
    nuevasTiendas[index].diasCobertura = diasCobertura
    nuevasTiendas[index].estado = obtenerEstado(diasCobertura)

    onTiendasChange(nuevasTiendas)
  }

  const agregarTienda = () => {
    onTiendasChange([
      ...tiendas,
      {
        nombre: `Tienda ${tiendas.length + 1}`,
        inventario: 0,
        ventaDiaria: 0,
        diasCobertura: 0,
        estado: 'Óptimo',
      },
    ])
  }

  const eliminarTienda = (index: number) => {
    onTiendasChange(tiendas.filter((_, i) => i !== index))
  }

  const tiendasConCalculo = tiendas.map((t) => ({
    nombre: t.nombre,
    inventario: t.inventario,
    ventaDiaria: t.ventaDiaria,
    diasCobertura: t.diasCobertura,
    estado: t.estado,
  }))

  const tiendasFueraRango = tiendas.filter(
    (t) => t.diasCobertura < 28 || t.diasCobertura > 90
  ).length

  const porcentajeFueraRango =
    tiendas.length > 0 ? Math.round((tiendasFueraRango / tiendas.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="text-black font-bold text-xl mb-2">Calculadora de Días de Cobertura</h3>
          <p className="text-gray-700 font-semibold mb-4">
            Benchmark: 28-90 días. Las tiendas fuera de este rango se resaltan en rojo.
          </p>
          <div>
          <TablaEditable
            columnas={[
              { key: 'nombre', label: 'Tienda', type: 'text' },
              { key: 'inventario', label: 'Inventario Actual', type: 'number' },
              { key: 'ventaDiaria', label: 'Venta Diaria Promedio', type: 'number' },
              { key: 'diasCobertura', label: 'Días de Cobertura', type: 'number', editable: false },
              { key: 'estado', label: 'Estado', type: 'text', editable: false },
            ]}
            datos={tiendasConCalculo}
            onDatosChange={(datos) => {
              datos.forEach((d, index) => {
                actualizarTienda(index, 'inventario', Number(d.inventario) || 0)
                actualizarTienda(index, 'ventaDiaria', Number(d.ventaDiaria) || 0)
              })
            }}
            onAgregarFila={agregarTienda}
            onEliminarFila={eliminarTienda}
          />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className={porcentajeFueraRango > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertTriangle className={`h-4 w-4 ${porcentajeFueraRango > 0 ? 'text-red-600' : 'text-green-600'}`} />
          <AlertDescription>
            <strong>{porcentajeFueraRango}%</strong> de tiendas fuera del rango óptimo ({tiendasFueraRango} de {tiendas.length})
          </AlertDescription>
        </Alert>

        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>{tiendas.length - tiendasFueraRango}</strong> tiendas en rango óptimo
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}


