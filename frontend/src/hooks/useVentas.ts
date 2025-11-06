// Hook personalizado para ventas
import { useState, useEffect, useCallback } from 'react'
import { obtenerVentas, obtenerEstadisticasVentas, Venta } from '@/lib/supabase/ventas'

export function useVentas(opciones?: {
  tienda_id?: string
  vendedor_id?: string
  cliente_id?: string
  estado?: string
  fecha_inicio?: string
  fecha_fin?: string
}) {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVentas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await obtenerVentas(opciones)
      setVentas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ventas')
      setVentas([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opciones)])

  useEffect(() => {
    fetchVentas()
  }, [fetchVentas])

  return {
    ventas,
    loading,
    error,
    refetch: fetchVentas
  }
}

export function useEstadisticasVentas(opciones?: {
  tienda_id?: string
  vendedor_id?: string
  fecha_inicio?: string
  fecha_fin?: string
}) {
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEstadisticas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await obtenerEstadisticasVentas(opciones)
      setEstadisticas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
      setEstadisticas(null)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opciones)])

  useEffect(() => {
    fetchEstadisticas()
  }, [fetchEstadisticas])

  return {
    estadisticas,
    loading,
    error,
    refetch: fetchEstadisticas
  }
}


