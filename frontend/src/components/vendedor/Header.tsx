'use client'

import { usePathname } from 'next/navigation'
import { LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { NotificacionesCapacitacion } from '@/components/capacitacion/NotificacionesCapacitacion'
import { obtenerUsuarioPorEmail } from '@/lib/orgData'

const titulosPorRuta: Record<string, string> = {
  '/vendedor': 'Dashboard',
  '/vendedor/perfil': 'Mi Perfil',
  '/vendedor/inventario': 'Inventario',
  '/vendedor/ventas': 'Ventas',
  '/vendedor/equipo': 'Mi Equipo',
  '/vendedor/recepciones': 'Recepciones',
  '/vendedor/reportes': 'Reportes',
}

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const titulo = titulosPorRuta[pathname] || 'Dashboard'

  return (
    <header className="vendor-navbar sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex-wrap gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="vendor-navbar-title truncate">{titulo}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl transition-all"
            style={{ 
              background: 'rgba(14, 14, 14, 0.2)',
              color: 'var(--color-neutral-925)'
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" style={{ color: 'var(--color-neutral-925)' }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: 'var(--color-neutral-925)' }} />
            )}
          </button>

          {/* Notificaciones */}
          {user && (() => {
            const usuario = obtenerUsuarioPorEmail(user.email)
            return usuario ? <NotificacionesCapacitacion userId={usuario.id} /> : null
          })()}

          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-lg backdrop-blur-sm"
              style={{ 
                background: 'rgba(14, 14, 14, 0.2)',
                border: '2px solid rgba(14, 14, 14, 0.3)',
                color: 'var(--color-neutral-100)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="text-right">
                <p className="text-xs font-extrabold truncate max-w-[120px]" style={{ color: 'var(--color-neutral-100)' }}>{user.nombre}</p>
                <p className="text-xs font-bold capitalize truncate" style={{ color: 'var(--color-neutral-300)' }}>{user.rol}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2 font-extrabold shadow-lg hover:shadow-xl transition-all px-4 py-2.5 backdrop-blur-sm"
            style={{
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline font-bold text-xs">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

