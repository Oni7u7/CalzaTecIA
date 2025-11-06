'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Power, GraduationCap, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Usuario } from '@/lib/orgData'
import { ESTRUCTURA_ORGANIZACIONAL } from '@/lib/orgData'

interface TablaUsuariosProps {
  usuarios: Usuario[]
  onUsuarioClick?: (usuario: Usuario, accion: string) => void
}

export function TablaUsuarios({ usuarios, onUsuarioClick }: TablaUsuariosProps) {
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState<string>('todos')
  const [filtroTienda, setFiltroTienda] = useState<string>('todas')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const usuariosPorPagina = 10

  const roles = Array.from(new Set(usuarios.map((u) => u.rol)))
  const tiendas = Array.from(new Set(usuarios.map((u) => u.tienda)))

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      !busqueda ||
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    const coincideRol = filtroRol === 'todos' || usuario.rol === filtroRol
    const coincideTienda = filtroTienda === 'todas' || usuario.tienda === filtroTienda
    const coincideEstado = filtroEstado === 'todos' // Por ahora todos están activos

    return coincideBusqueda && coincideRol && coincideTienda && coincideEstado
  })

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina)
  const inicio = (paginaActual - 1) * usuariosPorPagina
  const fin = inicio + usuariosPorPagina
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin)

  const obtenerSupervisor = (supervisorId: number | null): string => {
    if (!supervisorId) return '-'
    const supervisor = ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.find((u) => u.id === supervisorId)
    return supervisor ? `${supervisor.nombre} (${supervisor.email})` : '-'
  }

  return (
    <div className="admin-stat-card">
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
          Usuarios del Sistema
        </h3>
        <p className="font-semibold mb-4" style={{ color: 'var(--color-neutral-300)' }}>
          Lista completa de usuarios registrados
        </p>
        <div className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none z-10" style={{ color: 'var(--color-neutral-400)' }} />
            <Input
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 sm:pl-10 login-input text-sm sm:text-base"
            />
          </div>
          <Select value={filtroRol} onValueChange={setFiltroRol}>
            <SelectTrigger className="w-full sm:w-48 login-input text-sm sm:text-base">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
              <SelectItem value="todos" style={{ color: 'var(--color-neutral-100)' }}>Todos los roles</SelectItem>
              {roles.map((rol) => (
                <SelectItem key={rol} value={rol} style={{ color: 'var(--color-neutral-100)' }}>
                  {rol.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroTienda} onValueChange={setFiltroTienda}>
            <SelectTrigger className="w-full sm:w-48 login-input text-sm sm:text-base">
              <SelectValue placeholder="Tienda" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
              <SelectItem value="todas" style={{ color: 'var(--color-neutral-100)' }}>Todas las tiendas</SelectItem>
              {tiendas.map((tienda) => (
                <SelectItem key={tienda} value={tienda} style={{ color: 'var(--color-neutral-100)' }}>
                  {tienda}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-full sm:w-48 login-input text-sm sm:text-base">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'var(--color-neutral-900)', border: '1px solid var(--color-neutral-800)' }}>
              <SelectItem value="todos" style={{ color: 'var(--color-neutral-100)' }}>Todos los estados</SelectItem>
              <SelectItem value="activo" style={{ color: 'var(--color-neutral-100)' }}>Activo</SelectItem>
              <SelectItem value="inactivo" style={{ color: 'var(--color-neutral-100)' }}>Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-neutral-800)', background: 'var(--color-neutral-800)' }}>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>ID</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Nombre</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden md:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Email</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Rol</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden lg:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Supervisor</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap hidden md:table-cell" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Tienda</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Estado</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Acciones</th>
                </tr>
              </thead>
            <tbody>
              {usuariosPagina.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-b transition-colors"
                  style={{ 
                    borderColor: 'var(--color-neutral-800)',
                    background: 'var(--color-neutral-900)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-neutral-800)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-neutral-900)'
                  }}
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)' }}>{usuario.id}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)' }}>{usuario.nombre}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap hidden md:table-cell" style={{ color: 'var(--color-neutral-300)' }}>{usuario.email}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <Badge className="font-bold text-xs capitalize whitespace-nowrap"
                      style={{
                        background: 'rgba(35, 247, 221, 0.2)',
                        color: 'var(--color-teal-400)',
                        border: '1px solid rgba(35, 247, 221, 0.3)'
                      }}
                    >
                      {usuario.rol.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap hidden lg:table-cell" style={{ color: 'var(--color-neutral-300)' }}>
                    {obtenerSupervisor(usuario.supervisor_id)}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap hidden md:table-cell" style={{ color: 'var(--color-neutral-300)' }}>{usuario.tienda}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <Badge className="font-bold text-xs whitespace-nowrap"
                      style={{
                        background: 'rgba(0, 230, 118, 0.2)',
                        color: 'var(--color-green)',
                        border: '1px solid rgba(0, 230, 118, 0.3)'
                      }}
                    >
                      Activo
                    </Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUsuarioClick?.(usuario, 'editar')}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        style={{
                          color: 'var(--color-teal-400)',
                          background: 'rgba(35, 247, 221, 0.1)'
                        }}
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUsuarioClick?.(usuario, 'activar')}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        style={{
                          color: 'var(--color-green)',
                          background: 'rgba(0, 230, 118, 0.1)'
                        }}
                      >
                        <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUsuarioClick?.(usuario, 'capacitacion')}
                        className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:inline-flex"
                        style={{
                          color: 'var(--color-teal-300)',
                          background: 'rgba(129, 251, 233, 0.1)'
                        }}
                      >
                        <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUsuarioClick?.(usuario, 'eliminar')}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        style={{
                          color: '#ef4444',
                          background: 'rgba(239, 68, 68, 0.1)'
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {usuariosPagina.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--color-neutral-400)' }}>
              No se encontraron usuarios con los filtros aplicados.
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              Mostrando {inicio + 1} - {Math.min(fin, usuariosFiltrados.length)} de{' '}
              {usuariosFiltrados.length} usuarios
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm text-gray-600">
                Página {paginaActual} de {totalPaginas}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}


