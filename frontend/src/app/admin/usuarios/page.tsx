'use client'

import { useState, useMemo, useEffect } from 'react'
import { TablaUsuarios } from '@/components/admin/TablaUsuarios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, UserPlus, GraduationCap, PieChart, Loader2 } from 'lucide-react'
import { ESTRUCTURA_ORGANIZACIONAL, Usuario } from '@/lib/orgData'
import { useRouter } from 'next/navigation'
import { crearUsuario, UsuarioCompleto, obtenerRoles, Rol } from '@/lib/supabase/usuarios'
import { useUsuarios } from '@/hooks/useUsuarios'

// Función helper para convertir UsuarioCompleto (Supabase) a Usuario (orgData)
function convertirUsuarioSupabaseAOrgData(usuarioSupabase: UsuarioCompleto): Usuario {
  // Generar un ID numérico único basado en el hash del string ID
  const idNumerico = usuarioSupabase.id.split('-').reduce((acc, val) => acc + parseInt(val.slice(0, 2), 16), 0) % 1000000
  
  return {
    id: idNumerico,
    nombre: usuarioSupabase.nombre,
    email: usuarioSupabase.email,
    rol: usuarioSupabase.rol?.nombre || 'sin_rol',
    supervisor_id: usuarioSupabase.supervisor_id 
      ? usuarioSupabase.supervisor_id.split('-').reduce((acc, val) => acc + parseInt(val.slice(0, 2), 16), 0) % 1000000
      : null,
    tienda: usuarioSupabase.tienda?.nombre || 'Sin tienda'
  }
}

export default function UsuariosPage() {
  const router = useRouter()
  const { usuarios: usuariosSupabase, loading, error, refetch } = useUsuarios({ activo: true })
  const [modalAbierto, setModalAbierto] = useState(false)
  const [roles, setRoles] = useState<Rol[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  
  // Cargar roles al montar el componente
  useEffect(() => {
    const cargarRoles = async () => {
      setLoadingRoles(true)
      try {
        const rolesData = await obtenerRoles()
        setRoles(rolesData)
      } catch (err) {
        console.error('Error al cargar roles:', err)
      } finally {
        setLoadingRoles(false)
      }
    }
    cargarRoles()
  }, [])
  
  // Convertir usuarios de Supabase al formato esperado por TablaUsuarios
  const usuarios = useMemo(() => {
    if (usuariosSupabase.length === 0) {
      // Si no hay usuarios de Supabase, usar datos demo como fallback
      return ESTRUCTURA_ORGANIZACIONAL.usuarios_demo
    }
    return usuariosSupabase.map(convertirUsuarioSupabaseAOrgData)
  }, [usuariosSupabase])
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol_id: '',
    supervisor_id: '',
    tienda_id: ''
  })

  const totalUsuarios = usuarios.length
  const usuariosActivos = usuarios.length // Por ahora todos están activos
  const usuariosPorRol = usuarios.reduce((acc, u) => {
    acc[u.rol] = (acc[u.rol] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleUsuarioClick = (usuario: Usuario, accion: string) => {
    switch (accion) {
      case 'editar':
        alert(`Editar usuario: ${usuario.nombre}`)
        break
      case 'activar':
        alert(`Cambiar estado de usuario: ${usuario.nombre}`)
        break
      case 'capacitacion':
        router.push(`/admin/usuarios/${usuario.id}/capacitacion`)
        break
      case 'eliminar':
        if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
          alert(`Usuario ${usuario.nombre} eliminado (simulado)`)
        }
        break
    }
  }

  const handleCrearUsuario = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!formData.nombre || !formData.email || !formData.password) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      // Hash de contraseña (en producción usar bcrypt)
      const passwordHash = formData.password // Por ahora sin hash, se debe implementar
      
      const usuarioCreado = await crearUsuario({
        nombre: formData.nombre,
        email: formData.email,
        password_hash: passwordHash,
        rol_id: formData.rol_id || null,
        supervisor_id: formData.supervisor_id || null,
        tienda_id: formData.tienda_id || null,
        activo: true
      })

      if (usuarioCreado) {
        alert('Usuario creado exitosamente')
        setModalAbierto(false)
        // Limpiar formulario
        setFormData({
          nombre: '',
          email: '',
          password: '',
          rol_id: '',
          supervisor_id: '',
          tienda_id: ''
        })
        // Recargar usuarios desde Supabase
        await refetch()
      } else {
        alert('Error al crear usuario')
      }
    } catch (error) {
      console.error('Error al crear usuario:', error)
      alert('Error al crear usuario')
    }
  }

  // Mostrar estado de carga
  if (loading && usuarios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-teal-400)' }} />
          <p className="text-sm" style={{ color: 'var(--color-neutral-300)' }}>Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si hay
  if (error && usuarios.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
        <div className="admin-stat-card">
          <div className="p-6">
            <p className="text-red-500">Error al cargar usuarios: {error}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="admin-section-title text-xl sm:text-2xl lg:text-3xl">Gestión de Usuarios del Sistema</h1>
          <p className="admin-section-subtitle text-sm sm:text-base">Administra usuarios, roles y permisos</p>
        </div>
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Agregar Nuevo Usuario</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa el formulario para crear un nuevo usuario en el sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCrearUsuario} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input 
                  placeholder="Nombre completo del usuario"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="usuario@calzando.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select value={formData.rol_id} onValueChange={(value) => setFormData({ ...formData, rol_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.length > 0 ? (
                        roles.map((rol) => (
                          <SelectItem key={rol.id} value={rol.id}>
                            {rol.nombre === 'comprador' ? 'Comprador' : rol.nombre.replace(/_/g, ' ')}
                          </SelectItem>
                        ))
                      ) : (
                        ESTRUCTURA_ORGANIZACIONAL.roles.map((rol) => (
                          <SelectItem key={rol.id} value={rol.id.toString()}>
                            {rol.nombre === 'comprador' ? 'Comprador' : rol.nombre.replace(/_/g, ' ')}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Supervisor</Label>
                  <Select value={formData.supervisor_id} onValueChange={(value) => setFormData({ ...formData, supervisor_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuariosSupabase.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tienda Asignada</Label>
                <Input 
                  placeholder="ID de la tienda"
                  value={formData.tienda_id}
                  onChange={(e) => setFormData({ ...formData, tienda_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contraseña Temporal</Label>
                <Input 
                  type="password" 
                  placeholder="Contraseña temporal"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Crear Usuario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Total de Usuarios</p>
              <p className="admin-stat-value">{totalUsuarios}</p>
            </div>
            <Users className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Usuarios Activos</p>
              <p className="admin-stat-value">{usuariosActivos}</p>
            </div>
            <UserPlus className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Nuevos Este Mes</p>
              <p className="admin-stat-value">2</p>
            </div>
            <UserPlus className="w-8 h-8" style={{ color: 'var(--color-teal-300)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Roles Diferentes</p>
              <p className="admin-stat-value">
                {Object.keys(usuariosPorRol).length}
              </p>
            </div>
            <PieChart className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
          </div>
        </div>
      </div>

      {/* Gráfica de Usuarios por Rol */}
      <div className="admin-stat-card">
        <div className="p-6">
          <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Distribución de Usuarios por Rol</h3>
          <div className="space-y-3">
            {Object.entries(usuariosPorRol).map(([rol, cantidad]) => {
              const porcentaje = Math.round((cantidad / totalUsuarios) * 100)
              return (
                <div key={rol} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold capitalize" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                      {rol.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>
                      {cantidad} ({porcentaje}%)
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'var(--color-neutral-800)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${porcentaje}%`,
                        background: 'var(--gradient-secondary)'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <TablaUsuarios usuarios={usuarios} onUsuarioClick={handleUsuarioClick} />
    </div>
  )
}
