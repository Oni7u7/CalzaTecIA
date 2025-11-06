'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Columna {
  key: string
  label: string
  type?: 'text' | 'number'
  editable?: boolean
}

interface TablaEditableProps {
  titulo?: string
  columnas: Columna[]
  datos: Record<string, any>[]
  onDatosChange: (datos: Record<string, any>[]) => void
  onAgregarFila?: () => void
  onEliminarFila?: (index: number) => void
}

export function TablaEditable({
  titulo,
  columnas,
  datos,
  onDatosChange,
  onAgregarFila,
  onEliminarFila,
}: TablaEditableProps) {
  const actualizarCelda = (index: number, columna: string, valor: any) => {
    const nuevosDatos = [...datos]
    nuevosDatos[index] = { ...nuevosDatos[index], [columna]: valor }
    onDatosChange(nuevosDatos)
  }

  return (
    <Card style={{ 
      background: 'var(--color-neutral-900)', 
      border: '1px solid var(--color-neutral-800)' 
    }}>
      {titulo && (
        <CardHeader>
          <CardTitle style={{ 
            color: 'var(--color-neutral-100)', 
            fontFamily: 'var(--font-family-roobert-pro)' 
          }}>
            {titulo}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ 
                background: 'var(--color-neutral-800)',
                borderBottom: '1px solid var(--color-neutral-700)'
              }}>
                {columnas.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ 
                      color: 'var(--color-neutral-100)', 
                      fontFamily: 'var(--font-family-roobert-pro)' 
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                {onEliminarFila && (
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold w-20"
                    style={{ 
                      color: 'var(--color-neutral-100)', 
                      fontFamily: 'var(--font-family-roobert-pro)' 
                    }}
                  >
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {datos.map((fila, index) => (
                <tr 
                  key={index} 
                  className="transition-colors"
                  style={{ 
                    borderBottom: '1px solid var(--color-neutral-800)',
                    background: 'var(--color-neutral-900)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-neutral-800)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-neutral-900)'
                  }}
                >
                  {columnas.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.editable !== false ? (
                        <Input
                          type={col.type || 'text'}
                          value={fila[col.key] || ''}
                          onChange={(e) =>
                            actualizarCelda(
                              index,
                              col.key,
                              col.type === 'number' ? Number(e.target.value) : e.target.value
                            )
                          }
                          className="w-full login-input"
                        />
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--color-neutral-100)' }}>{fila[col.key] || '-'}</span>
                      )}
                    </td>
                  ))}
                  {onEliminarFila && (
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEliminarFila(index)}
                        style={{
                          color: '#ef4444'
                        }}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {onAgregarFila && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={onAgregarFila}
                className="flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)',
                  color: 'var(--color-neutral-100)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
                }}
              >
                <Plus className="w-4 h-4" />
                Agregar Fila
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


