'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

export default function ReportesPage() {
  const descargarReporte = (tipo: string) => {
    alert(`Descargando ${tipo}...`)
  }

  const reportes = [
    {
      titulo: 'Reporte de Ventas Diario',
      descripcion: 'Resumen completo de ventas del día',
      tipo: 'Reporte de Ventas Diario',
    },
    {
      titulo: 'Reporte de Inventario',
      descripcion: 'Estado actual del inventario de la tienda',
      tipo: 'Reporte de Inventario',
    },
    {
      titulo: 'Reporte de Capacitación',
      descripcion: 'Progreso de capacitación del equipo',
      tipo: 'Reporte de Capacitación',
    },
    {
      titulo: 'Reporte de Recepciones',
      descripcion: 'Historial de recepciones de mercancía',
      tipo: 'Reporte de Recepciones',
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Reportes</h1>
        <p className="mt-2 font-semibold text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Genera y descarga reportes del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {reportes.map((reporte, index) => (
          <Card 
            key={index} 
            className="hover:shadow-xl transition-all duration-200"
            style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ 
                color: 'var(--color-neutral-100)', 
                fontFamily: 'var(--font-family-roobert-pro)' 
              }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
                {reporte.titulo}
              </CardTitle>
              <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
                {reporte.descripcion}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => descargarReporte(reporte.tipo)}
                variant="outline"
                className="w-full flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)',
                  color: 'var(--color-neutral-100)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
                }}
              >
                <Download className="w-4 h-4" />
                Descargar Reporte
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
