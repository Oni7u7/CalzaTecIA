'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CardColaborador } from '@/components/capacitacion/CardColaborador'
import { ModalGestionCapacitacion } from '@/components/capacitacion/ModalGestionCapacitacion'
import { Users, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import {
  obtenerUsuarioPorEmail,
  obtenerColaboradores,
  ESTRUCTURA_ORGANIZACIONAL,
} from '@/lib/orgData'
import { obtenerCompetenciasPorRol } from '@/lib/competencias'
import {
  obtenerEstadoCapacitacion,
  actualizarEstadoCompetencia,
  calcularProgresoGeneral,
  registrarHistorial,
  inicializarDatosEjemplo,
} from '@/lib/capacitacionHelpers'
import { Usuario } from '@/lib/orgData'
import { Competencia } from '@/lib/competencias'
import { EstadoCapacitacion } from '@/lib/capacitacionHelpers'

export default function EquipoPage() {
  const { user } = useAuth()
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)
  const [colaboradores, setColaboradores] = useState<Usuario[]>([])
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState<Usuario | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  useEffect(() => {
    if (!user) return

    const usuario = obtenerUsuarioPorEmail(user.email)
    if (!usuario) return

    setUsuarioActual(usuario)

    // Obtener colaboradores supervisados
    const colaboradoresData = obtenerColaboradores(usuario.id)
    setColaboradores(colaboradoresData)

    // Inicializar datos de ejemplo para colaboradores si no existen
    colaboradoresData.forEach((colaborador) => {
      inicializarDatosEjemplo(colaborador.id, colaborador.rol)
    })
  }, [user])

  const handleAbrirModal = (colaborador: Usuario) => {
    setColaboradorSeleccionado(colaborador)
    setModalAbierto(true)
  }

  const handleGuardar = (
    colaboradorId: number,
    competenciaId: number,
    actualizacion: Partial<EstadoCapacitacion>
  ) => {
    if (!usuarioActual) return

    const estadoAnterior = obtenerEstadoCapacitacion(colaboradorId)
    const competenciaAnterior = estadoAnterior[competenciaId]

    actualizarEstadoCompetencia(colaboradorId, competenciaId, actualizacion)

    // Registrar en historial
    if (actualizacion.estado === 'completada' && competenciaAnterior?.estado !== 'completada') {
      registrarHistorial(
        colaboradorId,
        usuarioActual.id,
        competenciaId,
        'completada',
        actualizacion.comentarios?.[actualizacion.comentarios.length - 1],
        competenciaAnterior?.progreso,
        100
      )
    } else if (actualizacion.progreso !== undefined && competenciaAnterior?.progreso !== actualizacion.progreso) {
      registrarHistorial(
        colaboradorId,
        usuarioActual.id,
        competenciaId,
        'progreso',
        undefined,
        competenciaAnterior?.progreso,
        actualizacion.progreso
      )
    }

    if (actualizacion.comentarios && actualizacion.comentarios.length > 0) {
      const nuevoComentario = actualizacion.comentarios[actualizacion.comentarios.length - 1]
      if (nuevoComentario && !competenciaAnterior?.comentarios.includes(nuevoComentario)) {
        registrarHistorial(
          colaboradorId,
          usuarioActual.id,
          competenciaId,
          'comentario',
          nuevoComentario
        )
      }
    }
  }

  const calcularProgresoColaborador = (colaborador: Usuario): number => {
    const competencias = obtenerCompetenciasPorRol(colaborador.rol)
    const estado = obtenerEstadoCapacitacion(colaborador.id)
    return calcularProgresoGeneral(competencias, estado)
  }

  const colaboradoresConProgreso = colaboradores.map((colaborador) => ({
    colaborador,
    progreso: calcularProgresoColaborador(colaborador),
  }))

  const promedioCapacitacion =
    colaboradoresConProgreso.length > 0
      ? Math.round(
          colaboradoresConProgreso.reduce((sum, c) => sum + c.progreso, 0) /
            colaboradoresConProgreso.length
        )
      : 0

  const colaboradoresEnRiesgo = colaboradoresConProgreso.filter((c) => c.progreso < 40).length

  if (!usuarioActual) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" style={{ color: 'var(--color-neutral-300)' }}>Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Mi Equipo - Supervisión</h1>
        <p className="mt-2 font-semibold text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Gestiona y supervisa a tu equipo de trabajo</p>
      </div>

      {/* Resumen del Equipo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Total Colaboradores</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{colaboradores.length}</p>
              </div>
              <Users className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
            </div>
          </CardContent>
        </Card>
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Promedio Capacitación</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>{promedioCapacitacion}%</p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </CardContent>
        </Card>
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>En Riesgo</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#ef4444', fontFamily: 'var(--font-family-roobert-pro)' }}>{colaboradoresEnRiesgo}</p>
              </div>
              <AlertCircle className="w-8 h-8" style={{ color: '#ef4444' }} />
            </div>
          </CardContent>
        </Card>
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Avanzados</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {colaboradoresConProgreso.filter((c) => c.progreso >= 70).length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Colaboradores */}
      <Card style={{ 
        background: 'var(--color-neutral-900)', 
        border: '1px solid var(--color-neutral-800)' 
      }}>
        <CardHeader>
          <CardTitle style={{ 
            color: 'var(--color-neutral-100)', 
            fontFamily: 'var(--font-family-roobert-pro)' 
          }}>
            Colaboradores Supervisados
          </CardTitle>
          <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
            Lista de miembros del equipo y su estado de capacitación
          </CardDescription>
        </CardHeader>
        <CardContent>
          {colaboradores.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-neutral-400)' }}>
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-neutral-500)' }} />
              <p>No tienes colaboradores asignados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colaboradoresConProgreso.map(({ colaborador, progreso }) => (
                <CardColaborador
                  key={colaborador.id}
                  colaborador={colaborador}
                  progreso={progreso}
                  onClick={() => handleAbrirModal(colaborador)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Gestión de Capacitación */}
      {colaboradorSeleccionado && (
        <ModalGestionCapacitacion
          open={modalAbierto}
          onClose={() => {
            setModalAbierto(false)
            setColaboradorSeleccionado(null)
          }}
          colaborador={colaboradorSeleccionado}
          competencias={obtenerCompetenciasPorRol(colaboradorSeleccionado.rol)}
          estadoCapacitacion={obtenerEstadoCapacitacion(colaboradorSeleccionado.id)}
          supervisorId={usuarioActual.id}
          onSave={handleGuardar}
        />
      )}
    </div>
  )
}
