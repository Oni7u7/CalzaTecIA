// Hook personalizado para productos con caché y optimización
import { useState, useEffect, useCallback } from 'react'
import { buscarProductos, obtenerProductosConInventario, Producto, BusquedaProductosParams } from '@/lib/productos'

interface UseProductosOptions extends BusquedaProductosParams {
  tienda_id?: string
  autoFetch?: boolean
}

export function useProductos(opciones: UseProductosOptions = {}) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProductos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Siempre obtener productos con inventario (inventario global si no hay tienda_id)
      const data = await obtenerProductosConInventario(opciones, opciones.tienda_id)

      setProductos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
      setProductos([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opciones)])

  useEffect(() => {
    if (opciones.autoFetch !== false) {
      fetchProductos()
    }
  }, [fetchProductos, opciones.autoFetch])

  return {
    productos,
    loading,
    error,
    refetch: fetchProductos
  }
}

