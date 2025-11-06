// Servicios para capacitación
import { supabase } from '../supabase'

export interface Competencia {
  id: string
  nombre: string
  descripcion: string | null
  rol_id: string | null
  obligatoria: boolean
  orden: number
  created_at: string
  updated_at: string
  // Relaciones
  rol?: any
}

export interface CapacitacionUsuario {
  id: string
  usuario_id: string
  competencia_id: string
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'aprobada' | 'rechazada'
  progreso: number
  fecha_inicio: string | null
  fecha_completado: string | null
  fecha_aprobacion: string | null
  aprobado_por: string | null
  created_at: string
  updated_at: string
  // Relaciones
  usuario?: any
  competencia?: Competencia
  aprobador?: any
}

/**
 * Obtener competencias por rol
 */
export async function obtenerCompetenciasPorRol(rolId: string): Promise<Competencia[]> {
  try {
    const { data, error } = await supabase
      .from('competencias')
      .select(`
        *,
        rol:roles(*)
      `)
      .eq('rol_id', rolId)
      .order('obligatoria', { ascending: false })
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error al obtener competencias:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerCompetenciasPorRol:', error)
    return []
  }
}

/**
 * Obtener capacitaciones de un usuario
 */
export async function obtenerCapacitacionesUsuario(usuarioId: string): Promise<CapacitacionUsuario[]> {
  try {
    const { data, error } = await supabase
      .from('capacitacion_usuarios')
      .select(`
        *,
        competencia:competencias(*),
        aprobador:usuarios!capacitacion_usuarios_aprobado_por_fkey(*)
      `)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener capacitaciones:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerCapacitacionesUsuario:', error)
    return []
  }
}

/**
 * Asignar capacitación a usuario
 */
export async function asignarCapacitacion(
  usuarioId: string,
  competenciaId: string
): Promise<CapacitacionUsuario | null> {
  try {
    const { data, error } = await supabase
      .from('capacitacion_usuarios')
      .insert([{
        usuario_id: usuarioId,
        competencia_id: competenciaId,
        estado: 'pendiente',
        progreso: 0
      }])
      .select(`
        *,
        competencia:competencias(*)
      `)
      .single()

    if (error) {
      console.error('Error al asignar capacitación:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en asignarCapacitacion:', error)
    return null
  }
}

/**
 * Actualizar progreso de capacitación
 */
export async function actualizarProgresoCapacitacion(
  capacitacionId: string,
  progreso: number,
  estado?: string
): Promise<boolean> {
  try {
    const updateData: any = { progreso }
    
    if (estado) {
      updateData.estado = estado
      if (estado === 'completada' && !updateData.fecha_completado) {
        updateData.fecha_completado = new Date().toISOString()
      }
    }

    const { error } = await supabase
      .from('capacitacion_usuarios')
      .update(updateData)
      .eq('id', capacitacionId)

    if (error) {
      console.error('Error al actualizar progreso:', error)
      return false
    }

    // Registrar en historial
    await supabase
      .from('capacitacion_historial')
      .insert([{
        capacitacion_id: capacitacionId,
        accion: `Progreso actualizado a ${progreso}%`,
        detalles_json: { progreso, estado }
      }])

    return true
  } catch (error) {
    console.error('Error en actualizarProgresoCapacitacion:', error)
    return false
  }
}

/**
 * Aprobar capacitación
 */
export async function aprobarCapacitacion(
  capacitacionId: string,
  aprobadorId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('capacitacion_usuarios')
      .update({
        estado: 'aprobada',
        fecha_aprobacion: new Date().toISOString(),
        aprobado_por: aprobadorId
      })
      .eq('id', capacitacionId)

    if (error) {
      console.error('Error al aprobar capacitación:', error)
      return false
    }

    // Registrar en historial
    await supabase
      .from('capacitacion_historial')
      .insert([{
        capacitacion_id: capacitacionId,
        accion: 'Capacitación aprobada',
        usuario_id: aprobadorId
      }])

    return true
  } catch (error) {
    console.error('Error en aprobarCapacitacion:', error)
    return false
  }
}

/**
 * Agregar comentario a capacitación
 */
export async function agregarComentarioCapacitacion(
  capacitacionId: string,
  supervisorId: string,
  comentario: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('capacitacion_comentarios')
      .insert([{
        capacitacion_id: capacitacionId,
        supervisor_id: supervisorId,
        comentario
      }])

    if (error) {
      console.error('Error al agregar comentario:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error en agregarComentarioCapacitacion:', error)
    return false
  }
}

/**
 * Obtener historial de capacitación
 */
export async function obtenerHistorialCapacitacion(capacitacionId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('capacitacion_historial')
      .select(`
        *,
        usuario:usuarios(*)
      `)
      .eq('capacitacion_id', capacitacionId)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener historial:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerHistorialCapacitacion:', error)
    return []
  }
}


