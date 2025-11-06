'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PuntoDato {
  fecha?: string
  mes?: string
  semana?: string
  valor: number
  [key: string]: any
}

interface GraficaTendenciaProps {
  datos: PuntoDato[]
  tipo: 'linea' | 'barra' | 'area'
  color?: string
  altura?: number
  mostrarGrid?: boolean
  mostrarLeyenda?: boolean
  mostrarTooltip?: boolean
}

export function GraficaTendencia({
  datos,
  tipo,
  color = '#3b82f6',
  altura = 300,
  mostrarGrid = true,
  mostrarLeyenda = false,
  mostrarTooltip = true,
}: GraficaTendenciaProps) {
  const configGrafica = {
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  }

  const renderGrafica = () => {
    switch (tipo) {
      case 'linea':
        return (
          <LineChart data={datos} margin={configGrafica.margin}>
            {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis
              dataKey={datos[0]?.fecha ? 'fecha' : datos[0]?.mes ? 'mes' : 'semana'}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            {mostrarTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            )}
            {mostrarLeyenda && <Legend />}
            <Line
              type="monotone"
              dataKey="valor"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )

      case 'barra':
        return (
          <BarChart data={datos} margin={configGrafica.margin}>
            {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis
              dataKey={datos[0]?.fecha ? 'fecha' : datos[0]?.mes ? 'mes' : 'semana'}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            {mostrarTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            )}
            {mostrarLeyenda && <Legend />}
            <Bar dataKey="valor" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )

      case 'area':
        return (
          <AreaChart data={datos} margin={configGrafica.margin}>
            {mostrarGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis
              dataKey={datos[0]?.fecha ? 'fecha' : datos[0]?.mes ? 'mes' : 'semana'}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            {mostrarTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            )}
            {mostrarLeyenda && <Legend />}
            <Area
              type="monotone"
              dataKey="valor"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        )

      default:
        return null
    }
  }

  if (!datos || datos.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ height: `${altura}px` }}
      >
        <p className="text-gray-500">No hay datos para mostrar</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: `${altura}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderGrafica()}
      </ResponsiveContainer>
    </div>
  )
}



