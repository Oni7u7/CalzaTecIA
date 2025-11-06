// Servicios para gestión de tiendas
import { supabase } from '../supabase'

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
  // Relaciones
  gerente?: any
  personal?: any[]
}

export interface TiendaConEstadisticas extends Tienda {
  ventas_mes?: number
  inventario_total?: number
  rotacion?: number
  personal_count?: number
}

/**
 * Obtener todas las tiendas
 */
export async function obtenerTiendas(opciones?: {
  estado?: string
  limite?: number
  offset?: number
}): Promise<Tienda[]> {
  try {
    let query = supabase
      .from('tiendas')
      .select(`
        *,
        gerente:usuarios!tiendas_gerente_id_fkey(*)
      `)

    if (opciones?.estado) {
      query = query.eq('estado', opciones.estado)
    }

    if (opciones?.limite) {
      query = query.limit(opciones.limite)
    }
    if (opciones?.offset) {
      query = query.range(opciones.offset, opciones.offset + (opciones.limite || 50) - 1)
    }

    query = query.order('nombre', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener tiendas:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerTiendas:', error)
    return []
  }
}

/**
 * Obtener una tienda por ID con estadísticas
 */
export async function obtenerTiendaPorId(id: string): Promise<TiendaConEstadisticas | null> {
  try {
    // Obtener tienda básica
    const { data: tienda, error: tiendaError } = await supabase
      .from('tiendas')
      .select(`
        *,
        gerente:usuarios!tiendas_gerente_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (tiendaError || !tienda) {
      console.error('Error al obtener tienda:', tiendaError)
      return null
    }

    // Obtener estadísticas
    const [ventasMes, inventarioTotal, personalCount] = await Promise.all([
      obtenerVentasMes(id),
      obtenerInventarioTotal(id),
      obtenerPersonalCount(id)
    ])

    return {
      ...tienda,
      ventas_mes: ventasMes,
      inventario_total: inventarioTotal,
      personal_count: personalCount,
      rotacion: inventarioTotal > 0 ? (ventasMes / inventarioTotal) * 100 : 0
    }
  } catch (error) {
    console.error('Error en obtenerTiendaPorId:', error)
    return null
  }
}

/**
 * Obtener ventas del mes de una tienda
 */
async function obtenerVentasMes(tiendaId: string): Promise<number> {
  try {
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('ventas')
      .select('total')
      .eq('tienda_id', tiendaId)
      .eq('estado', 'completada')
      .gte('fecha', inicioMes.toISOString().split('T')[0])

    if (error) {
      console.error('Error al obtener ventas del mes:', error)
      return 0
    }

    return data?.reduce((sum, venta) => sum + Number(venta.total || 0), 0) || 0
  } catch (error) {
    return 0
  }
}

/**
 * Obtener inventario total de una tienda
 */
async function obtenerInventarioTotal(tiendaId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('inventario')
      .select('cantidad')
      .eq('tienda_id', tiendaId)
      .eq('estado', 'disponible')

    if (error) {
      console.error('Error al obtener inventario total:', error)
      return 0
    }

    return data?.reduce((sum, item) => sum + (item.cantidad || 0), 0) || 0
  } catch (error) {
    return 0
  }
}

/**
 * Obtener cantidad de personal de una tienda
 */
async function obtenerPersonalCount(tiendaId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('tienda_personal')
      .select('*', { count: 'exact', head: true })
      .eq('tienda_id', tiendaId)
      .eq('activo', true)

    if (error) {
      console.error('Error al obtener personal count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    return 0
  }
}

/**
 * Obtener personal de una tienda
 */
export async function obtenerPersonalTienda(tiendaId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('tienda_personal')
      .select(`
        *,
        usuario:usuarios(*)
      `)
      .eq('tienda_id', tiendaId)
      .eq('activo', true)
      .order('fecha_asignacion', { ascending: false })

    if (error) {
      console.error('Error al obtener personal:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerPersonalTienda:', error)
    return []
  }
}

/**
 * Crear una nueva tienda
 */
export async function crearTienda(tienda: {
  nombre: string
  codigo: string
  ubicacion?: string | null
  direccion?: string | null
  telefono?: string | null
  email?: string | null
  horario?: string | null
  gerente_id?: string | null
  estado?: string
  fecha_apertura?: string | null
}): Promise<Tienda | null> {
  try {
    const { data, error } = await supabase
      .from('tiendas')
      .insert([{
        ...tienda,
        estado: tienda.estado || 'activa'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error al crear tienda:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en crearTienda:', error)
    return null
  }
}

/**
 * Actualizar una tienda
 */
export async function actualizarTienda(
  id: string,
  actualizacion: Partial<Tienda>
): Promise<Tienda | null> {
  try {
    const { data, error } = await supabase
      .from('tiendas')
      .update(actualizacion)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar tienda:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en actualizarTienda:', error)
    return null
  }
}

/**
 * Obtener KPIs de una tienda
 */
export async function obtenerKPIsTienda(tiendaId: string): Promise<{
  ventas_promedio: number
  tickets_promedio: number
  merma: number
  exactitud: number
}> {
  try {
    // Calcular KPIs básicos
    const ventasMes = await obtenerVentasMes(tiendaId)
    const { count: ticketsCount } = await supabase
      .from('ventas')
      .select('*', { count: 'exact', head: true })
      .eq('tienda_id', tiendaId)
      .eq('estado', 'completada')
      .gte('fecha', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])

    const diasMes = new Date().getDate()
    const ventasPromedio = diasMes > 0 ? ventasMes / diasMes : 0
    const ticketsPromedio = (ticketsCount || 0) / (diasMes || 1)

    // KPIs simulados (en producción se calcularían desde movimientos_inventario)
    return {
      ventas_promedio: Math.round(ventasPromedio),
      tickets_promedio: Math.round(ticketsPromedio),
      merma: 1.8, // Por ahora simulado
      exactitud: 94 // Por ahora simulado
    }
  } catch (error) {
    console.error('Error en obtenerKPIsTienda:', error)
    return {
      ventas_promedio: 0,
      tickets_promedio: 0,
      merma: 0,
      exactitud: 0
    }
  }
}


