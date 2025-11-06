'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChecklistCompetencias } from '@/components/capacitacion/ChecklistCompetencias'
import { User, Mail, Building2, Calendar, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { obtenerUsuarioPorEmail, obtenerSupervisor, obtenerColaboradores } from '@/lib/orgData'
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
  const [colaboradores, setColaboradores] = useState<any[]>([])
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

    // Obtener colaboradores si es supervisor
    const colaboradoresData = obtenerColaboradores(usuario.id)
    setColaboradores(colaboradoresData)

    // Obtener competencias del rol (mapear rol si es necesario)
    const rolOrganizacional = usuario.rol === 'vendedor' ? 'gerente_tienda' : usuario.rol
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

  const progresoGeneral = calcularProgresoGeneral(competencias, estadoCapacitacion)

  if (!usuarioActual) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Mi Perfil</h1>
        <p className="mt-2 font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Gestiona tu información personal y capacitación</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3" style={{ 
          background: 'var(--color-neutral-800)', 
          border: '1px solid var(--color-neutral-700)' 
        }}>
          <TabsTrigger 
            value="general"
            className="font-semibold data-[state=active]:shadow-lg transition-all"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}
          >
            Información General
          </TabsTrigger>
          <TabsTrigger 
            value="funciones"
            className="font-semibold data-[state=active]:shadow-lg transition-all"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}
          >
            Mis Funciones
          </TabsTrigger>
          <TabsTrigger 
            value="capacitacion"
            className="font-semibold data-[state=active]:shadow-lg transition-all"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}
          >
            Plan de Capacitación
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Información General */}
        <TabsContent value="general" className="mt-6">
          <Card style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ 
                color: 'var(--color-neutral-100)', 
                fontFamily: 'var(--font-family-roobert-pro)' 
              }}>
                <User className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
                Información Personal
              </CardTitle>
              <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
                Datos de tu cuenta y perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--gradient-secondary)' }}
                >
                  <User className="w-12 h-12" style={{ color: 'var(--color-neutral-925)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{usuarioActual.nombre}</h3>
                  <p style={{ color: 'var(--color-neutral-300)' }}>{usuarioActual.email}</p>
                  <Badge 
                    className="mt-2 capitalize"
                    style={{ 
                      background: 'rgba(0, 230, 118, 0.2)',
                      color: 'var(--color-green)',
                      border: '1px solid rgba(0, 230, 118, 0.3)'
                    }}
                  >
                    {usuarioActual.rol.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>

              {/* Información */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2" style={{ color: 'var(--color-neutral-300)' }}>
                    <Mail className="w-4 h-4" style={{ color: 'var(--color-teal-400)' }} />
                    Email
                  </Label>
                  <Input 
                    value={usuarioActual.email} 
                    disabled
                    className="login-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2" style={{ color: 'var(--color-neutral-300)' }}>
                    <Building2 className="w-4 h-4" style={{ color: 'var(--color-teal-400)' }} />
                    Tienda Asignada
                  </Label>
                  <Input 
                    value={usuarioActual.tienda} 
                    disabled
                    className="login-input"
                  />
                </div>
                {supervisor && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2" style={{ color: 'var(--color-neutral-300)' }}>
                      <Users className="w-4 h-4" style={{ color: 'var(--color-teal-400)' }} />
                      Supervisor
                    </Label>
                    <Input 
                      value={`${supervisor.nombre} - ${supervisor.email}`} 
                      disabled
                      className="login-input"
                    />
                  </div>
                )}
                {colaboradores.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2" style={{ color: 'var(--color-neutral-300)' }}>
                      <Users className="w-4 h-4" style={{ color: 'var(--color-teal-400)' }} />
                      Colaboradores Supervisados
                    </Label>
                    <Input 
                      value={`${colaboradores.length} colaboradores`} 
                      disabled
                      className="login-input"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Mis Funciones */}
        <TabsContent value="funciones" className="mt-6">
          <Card style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader>
              <CardTitle style={{ 
                color: 'var(--color-neutral-100)', 
                fontFamily: 'var(--font-family-roobert-pro)' 
              }}>
                Responsabilidades del Rol
              </CardTitle>
              <CardDescription style={{ color: 'var(--color-neutral-300)' }}>
                Lista de funciones y responsabilidades asignadas a tu rol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competencias.map((competencia, index) => (
                  <div
                    key={competencia.id}
                    className="flex items-start gap-3 p-4 rounded-lg transition-colors"
                    style={{ 
                      background: 'var(--color-neutral-800)',
                      border: '1px solid var(--color-neutral-700)'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--gradient-secondary)' }}
                    >
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-neutral-925)' }}>{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{competencia.nombre}</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--color-neutral-300)' }}>{competencia.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Plan de Capacitación */}
        <TabsContent value="capacitacion" className="mt-6">
          <ChecklistCompetencias
            competencias={competencias}
            estadoCapacitacion={estadoCapacitacion}
            esEditable={true}
            onUpdate={handleActualizarCompetencia}
            mostrarComentarios={true}
          />
          <Card className="mt-6" style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader>
              <CardTitle style={{ 
                color: 'var(--color-neutral-100)', 
                fontFamily: 'var(--font-family-roobert-pro)' 
              }}>
                Próxima Capacitación Programada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                      Técnicas de Ventas Avanzadas
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-300)' }}>
                      Capacitación presencial en técnicas avanzadas de ventas y atención al cliente
                    </p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-neutral-300)' }}>
                      <span>📅 15 de Enero, 2025</span>
                      <span>⏰ 10:00 AM - 2:00 PM</span>
                      <span>📍 Sede Central</span>
                    </div>
                  </div>
                  <Badge style={{ 
                    background: 'rgba(0, 230, 118, 0.2)',
                    color: 'var(--color-green)',
                    border: '1px solid rgba(0, 230, 118, 0.3)'
                  }}>
                    Programada
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
