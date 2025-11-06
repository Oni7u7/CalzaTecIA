'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChecklistCompetencias } from '@/components/capacitacion/ChecklistCompetencias'
import { User, Mail, Building2, Calendar, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { obtenerUsuarioPorEmail, obtenerSupervisor } from '@/lib/orgData'
import { obtenerCompetenciasPorRol } from '@/lib/competencias'
import {
  obtenerEstadoCapacitacion,
  actualizarEstadoCompetencia,
  inicializarDatosEjemplo,
  calcularProgresoGeneral,
} from '@/lib/capacitacionHelpers'

export default function PerfilPage() {
  const { user } = useAuth()
  const [usuarioActual, setUsuarioActual] = useState<any>(null)
  const [supervisor, setSupervisor] = useState<any>(null)
  const [competencias, setCompetencias] = useState<any[]>([])
  const [estadoCapacitacion, setEstadoCapacitacion] = useState<Record<number, any>>({})

  useEffect(() => {
    if (!user) return

    const usuario = obtenerUsuarioPorEmail(user.email)
    if (!usuario) return

    setUsuarioActual(usuario)

    // Obtener supervisor
    const supervisorData = obtenerSupervisor(usuario)
    setSupervisor(supervisorData)

    // Obtener competencias del rol (mapear rol si es necesario)
    const rolOrganizacional = usuario.rol === 'cliente' ? 'asistente_operativo' : usuario.rol
    const competenciasData = obtenerCompetenciasPorRol(rolOrganizacional)
    setCompetencias(competenciasData)

    // Inicializar datos de ejemplo si no existen
    inicializarDatosEjemplo(usuario.id, rolOrganizacional)

    // Obtener estado de capacitación
    const estado = obtenerEstadoCapacitacion(usuario.id)
    setEstadoCapacitacion(estado)
  }, [user])

  const handleActualizarCompetencia = (competenciaId: number, actualizacion: any) => {
    if (!usuarioActual) return

    actualizarEstadoCompetencia(usuarioActual.id, competenciaId, actualizacion)
    const nuevoEstado = obtenerEstadoCapacitacion(usuarioActual.id)
    setEstadoCapacitacion(nuevoEstado)
  }

  if (!usuarioActual) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-[#fcf7ee] min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#68301f]">Mi Perfil</h1>
        <p className="text-[#7f3921] mt-2 font-semibold">Información personal y capacitación</p>
      </div>

      {/* Información General */}
      <Card className="border-2 border-[#ecd29b] bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#fcf7ee] to-[#f6e9cf]">
          <CardTitle className="flex items-center gap-2 text-[#68301f]">
            <User className="w-5 h-5 text-[#d2802e]" />
            Información Personal
          </CardTitle>
          <CardDescription className="text-[#7f3921]">Datos de tu cuenta y perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f6e9cf] to-[#ecd29b] flex items-center justify-center shadow-lg border-2 border-[#d2802e]">
              <User className="w-12 h-12 text-[#d2802e]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#68301f]">{usuarioActual.nombre}</h3>
              <p className="text-[#7f3921] font-semibold">{usuarioActual.email}</p>
              <Badge className="bg-[#d2802e] text-white mt-2 capitalize font-bold border border-[#b45f24]">
                {usuarioActual.rol.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          {/* Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[#68301f] font-bold">
                <Mail className="w-4 h-4 text-[#d2802e]" />
                Email
              </Label>
              <Input value={usuarioActual.email} disabled className="bg-[#fcf7ee] border-[#ecd29b] text-[#68301f] font-semibold" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[#68301f] font-bold">
                <Building2 className="w-4 h-4 text-[#d2802e]" />
                Tienda Asignada
              </Label>
              <Input value={usuarioActual.tienda} disabled className="bg-[#fcf7ee] border-[#ecd29b] text-[#68301f] font-semibold" />
            </div>
            {supervisor && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[#68301f] font-bold">
                  <Users className="w-4 h-4 text-[#d2802e]" />
                  Supervisor
                </Label>
                <Input value={`${supervisor.nombre} - ${supervisor.email}`} disabled className="bg-[#fcf7ee] border-[#ecd29b] text-[#68301f] font-semibold" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan de Capacitación */}
      <ChecklistCompetencias
        competencias={competencias}
        estadoCapacitacion={estadoCapacitacion}
        esEditable={true}
        onUpdate={handleActualizarCompetencia}
        mostrarComentarios={true}
      />

      {/* Próxima Capacitación */}
      <Card className="border-2 border-[#ecd29b] bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#fcf7ee] to-[#f6e9cf]">
          <CardTitle className="text-[#68301f]">Próxima Capacitación Programada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gradient-to-r from-[#fcf7ee] to-[#f6e9cf] border-2 border-[#ecd29b] rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-[#68301f] mb-1">Uso del Sistema POS</h3>
                <p className="text-sm text-[#7f3921] mb-2 font-semibold">
                  Capacitación en el uso del sistema punto de venta y atención al cliente
                </p>
                <div className="flex items-center gap-4 text-sm text-[#d2802e] font-semibold">
                  <span>📅 20 de Enero, 2025</span>
                  <span>⏰ 9:00 AM - 12:00 PM</span>
                  <span>📍 Sede Central</span>
                </div>
              </div>
              <Badge className="bg-[#d2802e] text-white border border-[#b45f24] font-bold">Programada</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
