'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getUsuarioActual } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCheck, UserX, Mail, Calendar, Shield, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface SolicitudRegistro {
  id: string
  nombre: string
  email: string
  rol_id: string
  rol?: {
    nombre: string
    descripcion: string
  }
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  fecha_solicitud: string
  fecha_aprobacion: string | null
  aprobado_por: string | null
  notas: string | null
}

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudRegistro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState<string | null>(null)

  const cargarSolicitudes = async () => {
    try {
      setLoading(true)
      setError('')

      // Obtener solicitudes con información del rol
      const { data, error: fetchError } = await supabase
        .from('solicitudes_registro')
        .select(`
          *,
          roles:rol_id (
            nombre,
            descripcion
          )
        `)
        .order('fecha_solicitud', { ascending: false })

      if (fetchError) {
        console.error('Error al cargar solicitudes:', fetchError)
        setError('Error al cargar las solicitudes. Por favor, recarga la página.')
        return
      }

      // Mapear los datos para incluir el rol
      const solicitudesMapeadas = (data || []).map((s: any) => ({
        ...s,
        rol: Array.isArray(s.roles) ? s.roles[0] : s.roles
      }))

      setSolicitudes(solicitudesMapeadas)
    } catch (err) {
      console.error('Error al cargar solicitudes:', err)
      setError('Error al cargar las solicitudes. Por favor, recarga la página.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  const aprobarSolicitud = async (solicitudId: string) => {
    try {
      setProcesando(solicitudId)
      setError('')

      const usuarioActual = getUsuarioActual()
      if (!usuarioActual || !usuarioActual.id) {
        setError('No se pudo obtener tu información de usuario. Por favor, inicia sesión nuevamente.')
        return
      }

      // Intentar usar la función RPC de PostgreSQL
      const { data: rpcData, error: rpcError } = await supabase.rpc('aprobar_solicitud_registro', {
        p_solicitud_id: solicitudId,
        p_aprobado_por: usuarioActual.id,
        p_tienda_id: null
      })

      if (rpcError) {
        // Si la función RPC no está disponible, usar actualización directa
        console.log('Función RPC no disponible, usando actualización directa')
        
        // Obtener datos de la solicitud
        const { data: solicitudData, error: solicitudError } = await supabase
          .from('solicitudes_registro')
          .select('*')
          .eq('id', solicitudId)
          .single()

        if (solicitudError || !solicitudData) {
          setError('No se pudo obtener la información de la solicitud.')
          return
        }

        // Crear usuario directamente
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .insert([{
            nombre: solicitudData.nombre,
            email: solicitudData.email,
            password_hash: solicitudData.password_hash,
            rol_id: solicitudData.rol_id,
            activo: true,
            fecha_ingreso: new Date().toISOString()
          }])
          .select()
          .single()

        if (usuarioError) {
          console.error('Error al crear usuario:', usuarioError)
          setError(`Error al crear el usuario: ${usuarioError.message}`)
          return
        }

        // Actualizar solicitud
        const { error: updateError } = await supabase
          .from('solicitudes_registro')
          .update({
            estado: 'aprobada',
            aprobado_por: usuarioActual.id,
            fecha_aprobacion: new Date().toISOString()
          })
          .eq('id', solicitudId)

        if (updateError) {
          console.error('Error al actualizar solicitud:', updateError)
          setError('Error al actualizar la solicitud.')
          return
        }
      }

      // Recargar solicitudes
      await cargarSolicitudes()
    } catch (err: any) {
      console.error('Error al aprobar solicitud:', err)
      setError(`Error al aprobar la solicitud: ${err.message || 'Error desconocido'}`)
    } finally {
      setProcesando(null)
    }
  }

  const rechazarSolicitud = async (solicitudId: string, motivo?: string) => {
    try {
      setProcesando(solicitudId)
      setError('')

      const usuarioActual = getUsuarioActual()
      if (!usuarioActual || !usuarioActual.id) {
        setError('No se pudo obtener tu información de usuario. Por favor, inicia sesión nuevamente.')
        return
      }

      const { error: updateError } = await supabase
        .from('solicitudes_registro')
        .update({
          estado: 'rechazada',
          aprobado_por: usuarioActual.id,
          fecha_aprobacion: new Date().toISOString(),
          notas: motivo || 'Solicitud rechazada por el administrador'
        })
        .eq('id', solicitudId)

      if (updateError) {
        console.error('Error al rechazar solicitud:', updateError)
        setError('Error al rechazar la solicitud.')
        return
      }

      // Recargar solicitudes
      await cargarSolicitudes()
    } catch (err: any) {
      console.error('Error al rechazar solicitud:', err)
      setError(`Error al rechazar la solicitud: ${err.message || 'Error desconocido'}`)
    } finally {
      setProcesando(null)
    }
  }

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente')
  const solicitudesProcesadas = solicitudes.filter(s => s.estado !== 'pendiente')

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <Badge className="font-bold" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            Pendiente
          </Badge>
        )
      case 'aprobada':
        return (
          <Badge className="font-bold" style={{ background: 'rgba(0, 230, 118, 0.2)', color: 'var(--color-green)', border: '1px solid rgba(0, 230, 118, 0.3)' }}>
            Aprobada
          </Badge>
        )
      case 'rechazada':
        return (
          <Badge className="font-bold" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            Rechazada
          </Badge>
        )
      default:
        return null
    }
  }

  const getRolNombre = (solicitud: SolicitudRegistro) => {
    if (solicitud.rol) {
      return solicitud.rol.nombre
    }
    // Si no hay rol en la relación, intentar obtenerlo
    return 'Sin rol asignado'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="admin-section-title text-2xl sm:text-3xl lg:text-4xl flex items-center gap-3">
          <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--color-teal-400)' }} />
          Gestión de Solicitudes de Registro
        </h1>
        <p className="admin-section-subtitle text-sm sm:text-base">
          Aproba o rechaza las solicitudes de registro de nuevos usuarios
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Botón de recargar */}
      <div className="flex justify-end">
        <Button
          onClick={cargarSolicitudes}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Recargar
        </Button>
      </div>

      {/* Solicitudes Pendientes */}
      <Card style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--color-neutral-100)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
            Solicitudes Pendientes ({solicitudesPendientes.length})
          </CardTitle>
          <CardDescription>
            Estas solicitudes requieren tu atención
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8" style={{ color: 'var(--color-neutral-300)' }}>
              Cargando solicitudes...
            </div>
          ) : solicitudesPendientes.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--color-neutral-300)' }}>
              No hay solicitudes pendientes
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudesPendientes.map((solicitud) => (
                <Card
                  key={solicitud.id}
                  className="border-2"
                  style={{
                    background: 'var(--color-neutral-800)',
                    borderColor: 'var(--color-neutral-700)'
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                            <Mail className="w-6 h-6" style={{ color: 'var(--color-neutral-925)' }} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--color-neutral-100)' }}>
                              {solicitud.nombre}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>
                              {solicitud.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" style={{ color: 'var(--color-neutral-400)' }} />
                            <span style={{ color: 'var(--color-neutral-300)' }}>
                              Rol solicitado: <span className="font-bold capitalize">{getRolNombre(solicitud)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: 'var(--color-neutral-400)' }} />
                            <span style={{ color: 'var(--color-neutral-300)' }}>
                              {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {getEstadoBadge(solicitud.estado)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => aprobarSolicitud(solicitud.id)}
                          disabled={procesando === solicitud.id}
                          className="flex items-center gap-2"
                          style={{
                            background: 'var(--gradient-secondary)',
                            color: 'var(--color-neutral-925)'
                          }}
                        >
                          {procesando === solicitud.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => {
                            const motivo = prompt('¿Motivo del rechazo? (opcional)')
                            rechazarSolicitud(solicitud.id, motivo || undefined)
                          }}
                          disabled={procesando === solicitud.id}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          {procesando === solicitud.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solicitudes Procesadas */}
      {solicitudesProcesadas.length > 0 && (
        <Card style={{ background: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--color-neutral-100)' }}>
              <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
              Solicitudes Procesadas ({solicitudesProcesadas.length})
            </CardTitle>
            <CardDescription>
              Historial de solicitudes aprobadas y rechazadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {solicitudesProcesadas.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="p-4 rounded-lg border"
                  style={{
                    background: 'var(--color-neutral-800)',
                    borderColor: 'var(--color-neutral-700)'
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold" style={{ color: 'var(--color-neutral-100)' }}>
                          {solicitud.nombre}
                        </h4>
                        {getEstadoBadge(solicitud.estado)}
                      </div>
                      <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>
                        {solicitud.email}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-400)' }}>
                        Rol: <span className="font-bold capitalize">{getRolNombre(solicitud)}</span>
                        {solicitud.fecha_aprobacion && (
                          <> • Procesada el {new Date(solicitud.fecha_aprobacion).toLocaleDateString('es-MX')}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

