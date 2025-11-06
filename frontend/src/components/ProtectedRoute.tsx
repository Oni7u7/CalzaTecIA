'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUsuarioActual, verificarRol } from '@/lib/auth'
import { UsuarioAutenticado, Rol } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  rolEsperado: Rol
}

export function ProtectedRoute({ children, rolEsperado }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usuarioActual = getUsuarioActual()
    
    if (!usuarioActual) {
      router.push('/login')
      return
    }

    if (!verificarRol(rolEsperado)) {
      router.push(usuarioActual.ruta)
      return
    }

    setUsuario(usuarioActual)
    setLoading(false)
  }, [router, rolEsperado, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  return <>{children}</>
}



