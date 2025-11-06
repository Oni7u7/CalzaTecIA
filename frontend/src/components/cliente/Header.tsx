'use client'

import { useState, useEffect } from 'react'
import { LogOut, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { NotificacionesCapacitacion } from '@/components/capacitacion/NotificacionesCapacitacion'
import { obtenerUsuarioPorEmail } from '@/lib/orgData'

export function Header() {
  const { user, logout } = useAuth()
  const [hora, setHora] = useState(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ 
        background: 'var(--gradient-cliente)',
        borderBottom: '1px solid var(--cliente-border)',
        fontFamily: 'var(--font-untitled-sans)'
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-[1600px] mx-auto flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg backdrop-blur-sm flex items-center justify-center shadow-md border transition-all duration-300 group-hover:scale-110"
              style={{ 
                background: 'rgba(23, 20, 26, 0.2)',
                border: '1px solid rgba(23, 20, 26, 0.3)'
              }}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-12" style={{ color: 'var(--cliente-text-primary)' }} />
            </div>
            <h1 className="text-sm sm:text-base transition-all duration-300 hover:scale-105 truncate" 
              style={{ 
                color: 'var(--cliente-text-primary)', 
                fontFamily: 'var(--font-untitled-sans)',
                fontWeight: 900
              }}
            >
              CalzaTec_IA
            </h1>
          </div>
          <div className="hidden sm:block border-l pl-3 sm:pl-4" style={{ borderColor: 'var(--cliente-border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f5e6d3' }}>Tienda</p>
            {user && <p className="text-xs font-semibold mt-0.5 truncate max-w-[120px]" style={{ color: '#f5e6d3' }}>{user.nombre}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="text-right backdrop-blur-sm px-3 py-1.5 rounded-lg border transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'rgba(23, 20, 26, 0.2)',
              border: '1px solid var(--cliente-border)'
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#f5e6d3' }}>Hora</p>
            <p className="text-lg font-extrabold" style={{ color: '#f5e6d3', fontFamily: 'var(--font-untitled-sans)' }}>{hora}</p>
          </div>
          {/* Notificaciones */}
          {user && (() => {
            const usuario = obtenerUsuarioPorEmail(user.email)
            return usuario ? <NotificacionesCapacitacion userId={usuario.id} /> : null
          })()}
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="font-bold shadow-md px-3 py-1.5 h-8 text-xs backdrop-blur-sm transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontFamily: 'var(--font-untitled-sans)'
            }}
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            <span className="font-semibold">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

