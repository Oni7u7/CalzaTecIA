import { UsuarioAutenticado } from "@/types"
import { supabase } from "./supabase"
import { obtenerUsuarioPorEmail } from "./supabase/usuarios"

const USER_STORAGE_KEY = 'calzando_user'

// Mapeo de roles de BD a roles del frontend
const MAPEO_ROLES: Record<string, string> = {
  'administrador': 'admin',
  'admin': 'admin', // Alias adicional
  'moderador': 'moderador',
  'gerente_tienda': 'vendedor',
  'vendedor': 'vendedor', // Alias adicional
  'asistente_operativo': 'cliente',
  'cliente': 'cliente', // Alias adicional
  'supervisor_operaciones': 'admin',
  'coordinador_piso': 'vendedor',
  'encargado_bodega': 'vendedor',
  'encargado_seguridad': 'vendedor',
  'lider_ventas': 'vendedor',
  'comprador': 'admin',
  'director': 'admin',
  'gerente_nacional': 'admin',
}

// Mapeo de roles a rutas
const MAPEO_RUTAS: Record<string, string> = {
  'admin': '/admin',
  'moderador': '/moderador',
  'vendedor': '/vendedor',
  'cliente': '/cliente',
}

/**
 * Login usando Supabase
 */
export async function login(email: string, password: string): Promise<UsuarioAutenticado | null> {
  try {
    // Primero intentar con la tabla usuarios directamente (más confiable)
    console.log('🔍 Buscando usuario en BD:', email)
    const usuario = await obtenerUsuarioPorEmail(email)
    
    if (!usuario) {
      console.error('❌ Usuario no encontrado en BD:', email)
      return null
    }

    console.log('✅ Usuario encontrado:', {
      email: usuario.email,
      nombre: usuario.nombre,
      activo: usuario.activo,
      rol_nombre: usuario.rol?.nombre,
      rol_id: usuario.rol_id
    })

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      console.error('❌ Usuario inactivo:', email)
      return null
    }

    // Verificar contraseña (en producción debe ser hash)
    // Por ahora, comparación simple para desarrollo
    // Comparar sin espacios para evitar problemas
    const passwordHash = String(usuario.password_hash || '').trim()
    const passwordInput = String(password || '').trim()
    
    console.log('🔐 Verificando contraseña para:', email)
    console.log('   Hash en BD:', passwordHash)
    console.log('   Password ingresado:', passwordInput)
    console.log('   ¿Coinciden?', passwordHash === passwordInput)
    
    if (passwordHash !== passwordInput) {
      console.error('❌ Contraseña incorrecta para:', email)
      return null
    }
    
    console.log('✅ Contraseña correcta para:', email)

    // Mapear rol - obtener el nombre del rol de la BD
    const rolBD = usuario.rol?.nombre || ''
    
    // Si no hay rol en la relación, intentar obtenerlo directamente del rol_id
    let rolNombre = rolBD
    if (!rolNombre && usuario.rol_id) {
      // Si no se obtuvo el rol en la relación, intentar obtenerlo directamente
      console.log('⚠️ Rol no encontrado en relación, intentando obtener directamente...')
      try {
        const { data: rolData, error: rolError } = await supabase
          .from('roles')
          .select('nombre')
          .eq('id', usuario.rol_id)
          .single()
        
        if (rolError) {
          console.error('❌ Error al obtener rol:', rolError)
        } else if (rolData) {
          rolNombre = rolData.nombre
          console.log('✅ Rol obtenido directamente:', rolNombre)
        }
      } catch (err) {
        console.error('❌ Error al obtener rol:', err)
      }
    }
    
    const rolFrontend = MAPEO_ROLES[rolNombre] || 'cliente'
    const ruta = MAPEO_RUTAS[rolFrontend] || '/cliente'

    console.log('🎭 Mapeo de rol:', {
      rol_id: usuario.rol_id,
      rol_BD: rolNombre,
      rol_frontend: rolFrontend,
      ruta: ruta
    })

    const usuarioAutenticado: UsuarioAutenticado = {
      email: usuario.email,
      rol: rolFrontend as any,
      nombre: usuario.nombre,
      ruta,
      id: usuario.id,
      rol_id: usuario.rol_id || null,
      tienda_id: usuario.tienda_id || null,
    }

    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuarioAutenticado))
    }

    console.log('✅ Usuario autenticado exitosamente:', usuarioAutenticado)
    return usuarioAutenticado
  } catch (error) {
    console.error('Error en login:', error)
    return null
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  // Cerrar sesión de Supabase Auth
  await supabase.auth.signOut()
  
  // Limpiar localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

/**
 * Obtener usuario actual
 */
export function getUsuarioActual(): UsuarioAutenticado | null {
  if (typeof window === 'undefined') {
    return null
  }

  const usuarioStr = localStorage.getItem(USER_STORAGE_KEY)
  if (!usuarioStr) {
    return null
  }

  try {
    return JSON.parse(usuarioStr) as UsuarioAutenticado
  } catch {
    return null
  }
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return getUsuarioActual() !== null
}

/**
 * Verificar si el usuario tiene el rol esperado
 */
export function verificarRol(rolEsperado: string): boolean {
  const usuario = getUsuarioActual()
  if (!usuario) {
    return false
  }
  return usuario.rol === rolEsperado
}
