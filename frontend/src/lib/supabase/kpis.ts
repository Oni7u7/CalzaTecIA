// Servicios para KPIs y reportes
import { supabase } from '../supabase'

export interface KPI {
  id: string
  nombre: string
  nivel: 'estrategico' | 'tactico' | 'operativo'
  formula: string | null
  valor_actual: number | null
  meta: number | null
  unidad: string | null
  frecuencia: string
  fecha_calculo: string | null
  created_at: string
  updated_at: string
}

export interface KPIHistorico {
  id: string
  kpi_id: string
  valor: number
  fecha: string
  tienda_id: string | null
  created_at: string
  // Relaciones
  kpi?: KPI
  tienda?: any
}

/**
 * Obtener todos los KPIs
 */
export async function obtenerKPIs(opciones?: {
  nivel?: string
  frecuencia?: string
}): Promise<KPI[]> {
  try {
    let query = supabase
      .from('kpis')
      .select('*')

    if (opciones?.nivel) {
      query = query.eq('nivel', opciones.nivel)
    }
    if (opciones?.frecuencia) {
      query = query.eq('frecuencia', opciones.frecuencia)
    }

    query = query.order('nivel', { ascending: true })
      .order('nombre', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener KPIs:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerKPIs:', error)
    return []
  }
}

/**
 * Obtener histórico de un KPI
 */
export async function obtenerKPIHistorico(
  kpiId: string,
  opciones?: {
    tienda_id?: string
    fecha_inicio?: string
    fecha_fin?: string
    limite?: number
  }
): Promise<KPIHistorico[]> {
  try {
    let query = supabase
      .from('kpi_historico')
      .select(`
        *,
        kpi:kpis(*),
        tienda:tiendas(*)
      `)
      .eq('kpi_id', kpiId)

    if (opciones?.tienda_id) {
      query = query.eq('tienda_id', opciones.tienda_id)
    }
    if (opciones?.fecha_inicio) {
      query = query.gte('fecha', opciones.fecha_inicio)
    }
    if (opciones?.fecha_fin) {
      query = query.lte('fecha', opciones.fecha_fin)
    }

    if (opciones?.limite) {
      query = query.limit(opciones.limite)
    }

    query = query.order('fecha', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener histórico KPI:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerKPIHistorico:', error)
    return []
  }
}

/**
 * Calcular KPIs en tiempo real
 */
export async function calcularKPIsReales(tiendaId?: string): Promise<{
  ventas_mes: number
  ventas_dia: number
  tickets_dia: number
  promedio_ticket: number
  inventario_total: number
  productos_bajo_stock: number
  rotacion_inventario: number
}> {
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const inicioMes = new Date()
    inicioMes.setDate(1)
    const fechaInicioMes = inicioMes.toISOString().split('T')[0]

    // Ventas del mes
    let ventasQuery = supabase
      .from('ventas')
      .select('total, fecha')
      .eq('estado', 'completada')
      .gte('fecha', fechaInicioMes)

    if (tiendaId) {
      ventasQuery = ventasQuery.eq('tienda_id', tiendaId)
    }

    const { data: ventas } = await ventasQuery

    const ventasMes = ventas?.reduce((sum, v) => sum + Number(v.total || 0), 0) || 0
    const ventasHoy = ventas?.filter(v => v.fecha === hoy) || []
    const ventas_dia = ventasHoy.reduce((sum, v) => sum + Number(v.total || 0), 0)
    const tickets_dia = ventasHoy.length
    const promedio_ticket = tickets_dia > 0 ? ventas_dia / tickets_dia : 0

    // Inventario
    let inventarioQuery = supabase
      .from('inventario')
      .select('cantidad, cantidad_minima')
      .eq('estado', 'disponible')

    if (tiendaId) {
      inventarioQuery = inventarioQuery.eq('tienda_id', tiendaId)
    }

    const { data: inventarios } = await inventarioQuery

    const inventario_total = inventarios?.reduce((sum, i) => sum + (i.cantidad || 0), 0) || 0
    const productos_bajo_stock = inventarios?.filter(i => (i.cantidad || 0) <= (i.cantidad_minima || 0)).length || 0

    // Rotación (simplificada)
    const rotacion_inventario = inventario_total > 0 ? (ventasMes / inventario_total) * 100 : 0

    return {
      ventas_mes: Math.round(ventasMes),
      ventas_dia: Math.round(ventas_dia),
      tickets_dia,
      promedio_ticket: Math.round(promedio_ticket * 100) / 100,
      inventario_total,
      productos_bajo_stock,
      rotacion_inventario: Math.round(rotacion_inventario * 100) / 100
    }
  } catch (error) {
    console.error('Error en calcularKPIsReales:', error)
    return {
      ventas_mes: 0,
      ventas_dia: 0,
      tickets_dia: 0,
      promedio_ticket: 0,
      inventario_total: 0,
      productos_bajo_stock: 0,
      rotacion_inventario: 0
    }
  }
}

/**
 * Guardar valor histórico de KPI
 */
export async function guardarKPIHistorico(
  kpiId: string,
  valor: number,
  fecha: string,
  tiendaId?: string | null
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('kpi_historico')
      .insert([{
        kpi_id: kpiId,
        valor,
        fecha,
        tienda_id: tiendaId || null
      }])

    if (error) {
      console.error('Error al guardar histórico KPI:', error)
      return false
    }

    // Actualizar valor actual del KPI
    await supabase
      .from('kpis')
      .update({
        valor_actual: valor,
        fecha_calculo: new Date().toISOString()
      })
      .eq('id', kpiId)

    return true
  } catch (error) {
    console.error('Error en guardarKPIHistorico:', error)
    return false
  }
}


