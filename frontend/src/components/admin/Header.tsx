'use client'

import { usePathname } from 'next/navigation'
import { LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import { NotificacionesCapacitacion } from '@/components/capacitacion/NotificacionesCapacitacion'
import { obtenerUsuarioPorEmail } from '@/lib/orgData'

const titulosPorRuta: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/entregables': 'Entregables Hackathon',
  '/admin/usuarios': 'Gestión de Usuarios',
  '/admin/tiendas': 'Tiendas',
  '/admin/inventario': 'Inventario Global',
  '/admin/kpis': 'KPIs Estratégicos',
  '/admin/ia': 'Análisis IA',
  '/admin/configuracion': 'Configuración',
}

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const titulo = titulosPorRuta[pathname] || 'Dashboard'

  return (
    <header className="admin-navbar sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex-wrap gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="admin-navbar-title truncate">{titulo}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl transition-all"
            style={{ 
              background: 'var(--color-neutral-800)',
              color: 'var(--color-neutral-100)'
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" style={{ color: 'var(--color-teal-400)' }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: 'var(--color-neutral-300)' }} />
            )}
          </button>

          {/* Notificaciones */}
          {user && (() => {
            const usuario = obtenerUsuarioPorEmail(user.email)
            return usuario ? <NotificacionesCapacitacion userId={usuario.id} /> : null
          })()}

          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-xl border shadow-sm"
              style={{ 
                background: 'var(--color-neutral-800)',
                border: '1px solid var(--color-neutral-700)'
              }}
            >
              <div className="text-right">
                <p className="text-sm font-extrabold" style={{ color: 'var(--color-neutral-100)' }}>{user.nombre}</p>
                <p className="text-xs font-bold capitalize" style={{ color: 'var(--color-teal-400)' }}>{user.rol}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2 font-extrabold shadow-sm hover:shadow-md transition-all px-5 py-2.5"
            style={{
              borderColor: '#ef4444',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)'
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline font-bold">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

