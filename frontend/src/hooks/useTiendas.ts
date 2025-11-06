// Hook personalizado para tiendas
import { useState, useEffect, useCallback } from 'react'
import { obtenerTiendas, obtenerTiendaPorId, Tienda, TiendaConEstadisticas } from '@/lib/supabase/tiendas'

export function useTiendas(opciones?: {
  estado?: string
}) {
  const [tiendas, setTiendas] = useState<Tienda[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTiendas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await obtenerTiendas(opciones)
      setTiendas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tiendas')
      setTiendas([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opciones)])

  useEffect(() => {
    fetchTiendas()
  }, [fetchTiendas])

  return {
    tiendas,
    loading,
    error,
    refetch: fetchTiendas
  }
}

export function useTienda(id: string | null) {
  const [tienda, setTienda] = useState<TiendaConEstadisticas | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTienda = useCallback(async () => {
    if (!id) {
      setTienda(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await obtenerTiendaPorId(id)
      setTienda(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tienda')
      setTienda(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTienda()
  }, [fetchTienda])

  return {
    tienda,
    loading,
    error,
    refetch: fetchTienda
  }
}


