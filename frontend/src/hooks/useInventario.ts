// Hook personalizado para inventario
import { useState, useEffect, useCallback } from 'react'
import { obtenerInventarioTienda, obtenerInventarioGlobal, InventarioConProducto, InventarioGlobal } from '@/lib/supabase/inventario'

export function useInventarioTienda(tiendaId: string, opciones?: {
  categoria?: string
  estado?: string
  bajo_stock?: boolean
}) {
  const [inventario, setInventario] = useState<InventarioConProducto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventario = useCallback(async () => {
    if (!tiendaId) return

    setLoading(true)
    setError(null)

    try {
      const data = await obtenerInventarioTienda(tiendaId, opciones)
      setInventario(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario')
      setInventario([])
    } finally {
      setLoading(false)
    }
  }, [tiendaId, JSON.stringify(opciones)])

  useEffect(() => {
    fetchInventario()
  }, [fetchInventario])

  return {
    inventario,
    loading,
    error,
    refetch: fetchInventario
  }
}

export function useInventarioGlobal(opciones?: {
  categoria?: string
  estado?: 'Disponible' | 'Bajo Stock' | 'Agotado'
}) {
  const [inventario, setInventario] = useState<InventarioGlobal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventario = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await obtenerInventarioGlobal(opciones)
      setInventario(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario')
      setInventario([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opciones)])

  useEffect(() => {
    fetchInventario()
  }, [fetchInventario])

  return {
    inventario,
    loading,
    error,
    refetch: fetchInventario
  }
}


