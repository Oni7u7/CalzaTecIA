'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckCircle2, Clock, UserPlus, MessageSquare } from 'lucide-react'

interface Notificacion {
  id: string
  tipo: 'aprobacion' | 'asignada' | 'evaluacion' | 'comentario'
  mensaje: string
  fecha: string
  leida: boolean
  competenciaId?: number
  competenciaNombre?: string
}

export function NotificacionesCapacitacion({ userId }: { userId: number }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const key = `notificaciones_${userId}`
    const data = localStorage.getItem(key)
    if (data) {
      setNotificaciones(JSON.parse(data))
    } else {
      // Generar notificaciones de ejemplo
      const notificacionesEjemplo: Notificacion[] = [
        {
          id: '1',
          tipo: 'aprobacion',
          mensaje: 'Tu supervisor aprobó la competencia: Uso del sistema POS',
          fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          leida: false,
          competenciaId: 43,
          competenciaNombre: 'Uso del sistema POS',
        },
        {
          id: '2',
          tipo: 'comentario',
          mensaje: 'Comentario nuevo de tu supervisor en: Atención al cliente',
          fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          leida: false,
          competenciaId: 45,
          competenciaNombre: 'Atención al cliente',
        },
      ]
      localStorage.setItem(key, JSON.stringify(notificacionesEjemplo))
      setNotificaciones(notificacionesEjemplo)
    }
  }, [userId])

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length

  const marcarComoLeida = (id: string) => {
    const actualizadas = notificaciones.map((n) =>
      n.id === id ? { ...n, leida: true } : n
    )
    setNotificaciones(actualizadas)
    
    if (typeof window !== 'undefined') {
      const key = `notificaciones_${userId}`
      localStorage.setItem(key, JSON.stringify(actualizadas))
    }
  }

  const marcarTodasComoLeidas = () => {
    const actualizadas = notificaciones.map((n) => ({ ...n, leida: true }))
    setNotificaciones(actualizadas)
    
    if (typeof window !== 'undefined') {
      const key = `notificaciones_${userId}`
      localStorage.setItem(key, JSON.stringify(actualizadas))
    }
  }

  const obtenerIcono = (tipo: string) => {
    switch (tipo) {
      case 'aprobacion':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'asignada':
        return <UserPlus className="w-4 h-4 text-blue-600" />
      case 'evaluacion':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'comentario':
        return <MessageSquare className="w-4 h-4 text-purple-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha)
    const ahora = new Date()
    const diffMs = ahora.getTime() - fechaObj.getTime()
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDias === 0) return 'Hoy'
    if (diffDias === 1) return 'Ayer'
    if (diffDias < 7) return `Hace ${diffDias} días`
    return fechaObj.toLocaleDateString('es-MX')
  }

  // Detectar si estamos en el contexto del cliente
  const esContextoCliente = typeof window !== 'undefined' && window.location.pathname.includes('/cliente')

  return (
    <DropdownMenu open={abierto} onOpenChange={setAbierto}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          style={esContextoCliente ? {
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)'
          } : {}}
        >
          <Bell className="w-5 h-5" style={{ color: esContextoCliente ? '#f5e6d3' : '#6b7280' }} />
          {notificacionesNoLeidas > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80"
        style={esContextoCliente ? {
          backgroundColor: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.5)'
        } : {}}
      >
        <DropdownMenuLabel 
          className="flex items-center justify-between"
          style={esContextoCliente ? { color: '#f5e6d3' } : {}}
        >
          <span>Notificaciones</span>
          {notificacionesNoLeidas > 0 && (
            <Badge style={esContextoCliente ? {
              backgroundColor: 'rgba(245, 230, 211, 0.3)',
              color: '#f5e6d3',
              border: '1px solid rgba(245, 230, 211, 0.5)'
            } : {}}>
              {notificacionesNoLeidas}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={esContextoCliente ? {
          borderColor: 'rgba(255, 255, 255, 0.2)'
        } : {}} />
        <div className="max-h-96 overflow-y-auto">
          {notificaciones.length === 0 ? (
            <div className="p-4 text-center text-sm" style={{ color: esContextoCliente ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>
              No hay notificaciones
            </div>
          ) : (
            <div className="space-y-1">
              {notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    !notificacion.leida ? (esContextoCliente ? 'bg-purple-600 border-l-2 border-purple-300' : 'bg-blue-50 border-l-2 border-blue-500') : ''
                  }`}
                  style={esContextoCliente ? {
                    backgroundColor: !notificacion.leida ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                    color: '#ffffff'
                  } : {
                    backgroundColor: !notificacion.leida ? '#dbeafe' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (esContextoCliente) {
                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.4)'
                    } else {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (esContextoCliente) {
                      e.currentTarget.style.backgroundColor = !notificacion.leida ? 'rgba(139, 92, 246, 0.3)' : 'transparent'
                    } else {
                      e.currentTarget.style.backgroundColor = !notificacion.leida ? '#dbeafe' : 'transparent'
                    }
                  }}
                  onClick={() => marcarComoLeida(notificacion.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{obtenerIcono(notificacion.tipo)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium" style={{ color: esContextoCliente ? '#ffffff' : '#111827' }}>
                        {notificacion.mensaje}
                      </p>
                      <p className="text-xs" style={{ color: esContextoCliente ? 'rgba(255, 255, 255, 0.7)' : '#6b7280' }}>
                        {formatearFecha(notificacion.fecha)}
                      </p>
                    </div>
                    {!notificacion.leida && (
                      <div className="w-2 h-2 rounded-full mt-2" style={{ 
                        backgroundColor: esContextoCliente ? '#ffffff' : '#3b82f6' 
                      }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {notificaciones.length > 0 && (
          <>
            <DropdownMenuSeparator style={esContextoCliente ? {
              borderColor: 'rgba(255, 255, 255, 0.2)'
            } : {}} />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                style={esContextoCliente ? {
                  color: '#f5e6d3'
                } : {}}
                onClick={marcarTodasComoLeidas}
              >
                Marcar todas como leídas
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

