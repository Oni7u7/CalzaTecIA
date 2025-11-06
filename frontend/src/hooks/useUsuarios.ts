// Hook personalizado para usuarios
import { useState, useEffect, useCallback } from 'react'
import { obtenerUsuarios, obtenerUsuarioPorId, UsuarioCompleto } from '@/lib/supabase/usuarios'

export function useUsuarios(opciones?: {
  activo?: boolean
  rol_id?: string
  tienda_id?: string
  supervisor_id?: string
}) {
  const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await obtenerUsuarios(opciones)
      setUsuarios(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opciones)])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  return {
    usuarios,
    loading,
    error,
    refetch: fetchUsuarios
  }
}

export function useUsuario(id: string | null) {
  const [usuario, setUsuario] = useState<UsuarioCompleto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuario = useCallback(async () => {
    if (!id) {
      setUsuario(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await obtenerUsuarioPorId(id)
      setUsuario(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuario')
      setUsuario(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchUsuario()
  }, [fetchUsuario])

  return {
    usuario,
    loading,
    error,
    refetch: fetchUsuario
  }
}


