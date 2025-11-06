'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUsuarioActual, logout as logoutAuth } from '@/lib/auth'
import { UsuarioAutenticado } from '@/types'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<UsuarioAutenticado | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usuario = getUsuarioActual()
    if (usuario) {
      setUser(usuario)
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    setLoading(false)
  }, [])

  const logout = async () => {
    await logoutAuth()
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  return {
    user,
    logout,
    isAuthenticated,
    loading
  }
}


