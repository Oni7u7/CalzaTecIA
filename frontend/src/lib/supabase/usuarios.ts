// Servicios para gestión de usuarios y roles
import { supabase } from '../supabase'

export interface Usuario {
  id: string
  nombre: string
  email: string
  password_hash: string
  rol_id: string | null
  supervisor_id: string | null
  tienda_id: string | null
  activo: boolean
  fecha_ingreso: string
  ultimo_acceso: string | null
  created_at: string
  updated_at: string
  // Relaciones
  rol?: Rol
  supervisor?: Usuario
  tienda?: Tienda
}

export interface Rol {
  id: string
  nombre: string
  nivel: number
  supervisor_rol_id: string | null
  descripcion: string | null
  permisos: any
  created_at: string
  updated_at: string
}

export interface Tienda {
  id: string
  nombre: string
  codigo: string
  ubicacion: string | null
  direccion: string | null
  telefono: string | null
  email: string | null
  horario: string | null
  gerente_id: string | null
  estado: string
  fecha_apertura: string | null
  created_at: string
  updated_at: string
}

export interface UsuarioCompleto extends Usuario {
  rol?: Rol
  supervisor?: Usuario
  tienda?: Tienda
  supervisados?: Usuario[]
}

/**
 * Obtener todos los usuarios con sus relaciones
 */
export async function obtenerUsuarios(opciones?: {
  activo?: boolean
  rol_id?: string
  tienda_id?: string
  supervisor_id?: string
  limite?: number
  offset?: number
}): Promise<UsuarioCompleto[]> {
  try {
    let query = supabase
      .from('usuarios')
      .select(`
        *,
        rol:roles(*),
        supervisor:usuarios!usuarios_supervisor_id_fkey(*),
        tienda:tiendas(*)
      `)

    if (opciones?.activo !== undefined) {
      query = query.eq('activo', opciones.activo)
    }
    if (opciones?.rol_id) {
      query = query.eq('rol_id', opciones.rol_id)
    }
    if (opciones?.tienda_id) {
      query = query.eq('tienda_id', opciones.tienda_id)
    }
    if (opciones?.supervisor_id) {
      query = query.eq('supervisor_id', opciones.supervisor_id)
    }

    if (opciones?.limite) {
      query = query.limit(opciones.limite)
    }
    if (opciones?.offset) {
      query = query.range(opciones.offset, opciones.offset + (opciones.limite || 50) - 1)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerUsuarios:', error)
    return []
  }
}

/**
 * Obtener un usuario por ID
 */
export async function obtenerUsuarioPorId(id: string): Promise<UsuarioCompleto | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        rol:roles(*),
        supervisor:usuarios!usuarios_supervisor_id_fkey(*),
        tienda:tiendas(*),
        supervisados:usuarios!usuarios_supervisor_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener usuario:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en obtenerUsuarioPorId:', error)
    return null
  }
}

/**
 * Obtener usuario por email
 */
export async function obtenerUsuarioPorEmail(email: string): Promise<UsuarioCompleto | null> {
  try {
    // Normalizar email: trim y lowercase
    const emailNormalizado = email.trim().toLowerCase()
    console.log('🔍 Buscando usuario:', emailNormalizado)
    
    // Intentar obtener usuario sin filtrar por activo primero
    // Usar eq con email normalizado (la BD debería tener emails en lowercase)
    const { data: usuarioBasico, error: errorBasico } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', emailNormalizado)
      .maybeSingle()

    if (errorBasico) {
      // Si el error es que no se encontró (PGRST116), es normal
      if (errorBasico.code === 'PGRST116') {
        console.log('❌ Usuario no encontrado en BD:', email)
        return null
      }
      console.error('❌ Error al obtener usuario por email:', {
        message: errorBasico.message,
        details: errorBasico.details,
        hint: errorBasico.hint,
        code: errorBasico.code
      })
      return null
    }

    if (!usuarioBasico) {
      console.log('❌ Usuario no encontrado (data vacío):', email)
      return null
    }

    console.log('✅ Usuario encontrado:', {
      email: usuarioBasico.email,
      nombre: usuarioBasico.nombre,
      activo: usuarioBasico.activo,
      password_hash: usuarioBasico.password_hash
    })

    // Verificar que esté activo
    if (!usuarioBasico.activo) {
      console.log('⚠️ Usuario inactivo:', email)
      return null
    }

    // Si existe, intentar obtener con relaciones
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        rol:roles(*),
        supervisor:usuarios!usuarios_supervisor_id_fkey(*),
        tienda:tiendas(*)
      `)
      .eq('id', usuarioBasico.id)
      .single()

    if (error) {
      // Si falla con relaciones, intentar obtener el rol directamente
      console.warn('⚠️ Error al obtener relaciones del usuario, intentando obtener rol directamente:', error)
      
      if (usuarioBasico.rol_id) {
        const { data: rolData } = await supabase
          .from('roles')
          .select('*')
          .eq('id', usuarioBasico.rol_id)
          .single()
        
        if (rolData) {
          console.log('✅ Rol obtenido directamente:', rolData.nombre)
          return {
            ...usuarioBasico,
            rol: rolData
          } as UsuarioCompleto
        }
      }
      
      // Si no se puede obtener el rol, devolver el usuario básico
      console.warn('⚠️ No se pudo obtener el rol, devolviendo usuario básico')
      return usuarioBasico as UsuarioCompleto
    }

    // Verificar que el rol se obtuvo correctamente
    if (!data.rol && usuarioBasico.rol_id) {
      console.warn('⚠️ Rol no encontrado en relación, intentando obtener directamente...')
      const { data: rolData } = await supabase
        .from('roles')
        .select('*')
        .eq('id', usuarioBasico.rol_id)
        .single()
      
      if (rolData) {
        console.log('✅ Rol obtenido directamente:', rolData.nombre)
        return {
          ...data,
          rol: rolData
        }
      }
    }

    console.log('✅ Usuario con rol obtenido:', {
      email: data.email,
      rol_id: data.rol_id,
      rol_nombre: data.rol?.nombre
    })

    return data
  } catch (error) {
    console.error('Error en obtenerUsuarioPorEmail:', error)
    return null
  }
}

/**
 * Crear un nuevo usuario
 */
export async function crearUsuario(usuario: {
  nombre: string
  email: string
  password_hash: string
  rol_id?: string | null
  supervisor_id?: string | null
  tienda_id?: string | null
  activo?: boolean
}): Promise<Usuario | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        ...usuario,
        activo: usuario.activo ?? true
      }])
      .select()
      .single()

    if (error) {
      console.error('Error al crear usuario:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en crearUsuario:', error)
    return null
  }
}

/**
 * Actualizar un usuario
 */
export async function actualizarUsuario(
  id: string,
  actualizacion: Partial<Usuario>
): Promise<Usuario | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(actualizacion)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar usuario:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en actualizarUsuario:', error)
    return null
  }
}

/**
 * Eliminar un usuario (soft delete)
 */
export async function eliminarUsuario(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ activo: false })
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar usuario:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error en eliminarUsuario:', error)
    return false
  }
}

/**
 * Obtener todos los roles
 */
export async function obtenerRoles(): Promise<Rol[]> {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('nivel', { ascending: true })

    if (error) {
      console.error('Error al obtener roles:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerRoles:', error)
    return []
  }
}

/**
 * Obtener usuarios supervisados por un usuario
 */
export async function obtenerSupervisados(supervisorId: string): Promise<UsuarioCompleto[]> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        rol:roles(*),
        tienda:tiendas(*)
      `)
      .eq('supervisor_id', supervisorId)
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error al obtener supervisados:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerSupervisados:', error)
    return []
  }
}

/**
 * Actualizar último acceso de un usuario
 */
export async function actualizarUltimoAcceso(usuarioId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', usuarioId)

    if (error) {
      console.error('Error al actualizar último acceso:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error en actualizarUltimoAcceso:', error)
    return false
  }
}

