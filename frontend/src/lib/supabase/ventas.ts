// Servicios para gestión de ventas
import { supabase } from '../supabase'

export interface Venta {
  id: string
  ticket: string
  fecha: string
  hora: string
  vendedor_id: string | null
  tienda_id: string | null
  cliente_id: string | null
  subtotal: number
  iva: number
  descuento: number
  total: number
  metodo_pago: string
  estado: string
  notas: string | null
  created_at: string
  updated_at: string
  // Relaciones
  vendedor?: any
  cliente?: any
  tienda?: any
  items?: VentaItem[]
}

export interface VentaItem {
  id: string
  venta_id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  talla: string | null
  color: string | null
  created_at: string
  // Relaciones
  producto?: any
}

export interface CrearVentaRequest {
  vendedor_id?: string | null
  tienda_id?: string | null
  cliente_id?: string | null
  items: Array<{
    producto_id: string
    cantidad: number
    precio_unitario: number
    talla?: string | null
    color?: string | null
  }>
  descuento?: number
  metodo_pago: string
  notas?: string | null
}

/**
 * Crear una nueva venta
 */
export async function crearVenta(ventaData: CrearVentaRequest): Promise<Venta | null> {
  try {
    // Calcular totales
    const subtotal = ventaData.items.reduce(
      (sum, item) => sum + item.precio_unitario * item.cantidad,
      0
    )
    const descuento = ventaData.descuento || 0
    const subtotalConDescuento = subtotal - descuento
    const iva = subtotalConDescuento * 0.16 // IVA 16%
    const total = subtotalConDescuento + iva

    // Generar número de ticket
    const ticket = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Crear venta
    const { data: venta, error: ventaError } = await supabase
      .from('ventas')
      .insert([{
        ticket,
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        vendedor_id: ventaData.vendedor_id,
        tienda_id: ventaData.tienda_id,
        cliente_id: ventaData.cliente_id,
        subtotal,
        iva,
        descuento,
        total,
        metodo_pago: ventaData.metodo_pago,
        estado: 'completada',
        notas: ventaData.notas || null
      }])
      .select()
      .single()

    if (ventaError || !venta) {
      console.error('Error al crear venta:', ventaError)
      throw ventaError
    }

    // Crear items de venta
    const items = ventaData.items.map(item => ({
      venta_id: venta.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.precio_unitario * item.cantidad,
      talla: item.talla || null,
      color: item.color || null
    }))

    const { error: itemsError } = await supabase
      .from('venta_items')
      .insert(items)

    if (itemsError) {
      console.error('Error al crear items de venta:', itemsError)
      // Intentar eliminar la venta creada
      await supabase.from('ventas').delete().eq('id', venta.id)
      throw itemsError
    }

    // Actualizar inventario y registrar movimientos
    for (const item of ventaData.items) {
      // Obtener inventario actual
      const { data: inventario, error: inventarioError } = await supabase
        .from('inventario')
        .select('*')
        .eq('producto_id', item.producto_id)
        .eq('tienda_id', ventaData.tienda_id)
        .single()

      if (!inventarioError && inventario) {
        // Actualizar cantidad
        await supabase
          .from('inventario')
          .update({ cantidad: inventario.cantidad - item.cantidad })
          .eq('id', inventario.id)

        // Registrar movimiento
        await supabase
          .from('movimientos_inventario')
          .insert([{
            producto_id: item.producto_id,
            tienda_origen_id: ventaData.tienda_id,
            cantidad: item.cantidad,
            tipo: 'venta',
            motivo: `Venta ${ticket}`,
            usuario_id: ventaData.vendedor_id,
            referencia_id: venta.id
          }])
      }
    }

    // Obtener venta completa con relaciones
    return await obtenerVentaPorId(venta.id)
  } catch (error) {
    console.error('Error en crearVenta:', error)
    return null
  }
}

/**
 * Obtener una venta por ID
 */
export async function obtenerVentaPorId(id: string): Promise<Venta | null> {
  try {
    const { data, error } = await supabase
      .from('ventas')
      .select(`
        *,
        vendedor:usuarios!ventas_vendedor_id_fkey(*),
        cliente:usuarios!ventas_cliente_id_fkey(*),
        tienda:tiendas(*),
        items:venta_items(
          *,
          producto:productos(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener venta:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en obtenerVentaPorId:', error)
    return null
  }
}

/**
 * Obtener ventas con filtros
 */
export async function obtenerVentas(opciones?: {
  tienda_id?: string
  vendedor_id?: string
  cliente_id?: string
  estado?: string
  fecha_inicio?: string
  fecha_fin?: string
  limite?: number
  offset?: number
}): Promise<Venta[]> {
  try {
    let query = supabase
      .from('ventas')
      .select(`
        *,
        vendedor:usuarios!ventas_vendedor_id_fkey(*),
        cliente:usuarios!ventas_cliente_id_fkey(*),
        tienda:tiendas(*)
      `)

    if (opciones?.tienda_id) {
      query = query.eq('tienda_id', opciones.tienda_id)
    }
    if (opciones?.vendedor_id) {
      query = query.eq('vendedor_id', opciones.vendedor_id)
    }
    if (opciones?.cliente_id) {
      query = query.eq('cliente_id', opciones.cliente_id)
    }
    if (opciones?.estado) {
      query = query.eq('estado', opciones.estado)
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
    if (opciones?.offset) {
      query = query.range(opciones.offset, opciones.offset + (opciones.limite || 50) - 1)
    }

    query = query.order('fecha', { ascending: false })
      .order('hora', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener ventas:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerVentas:', error)
    return []
  }
}

/**
 * Obtener estadísticas de ventas
 */
export async function obtenerEstadisticasVentas(opciones?: {
  tienda_id?: string
  vendedor_id?: string
  fecha_inicio?: string
  fecha_fin?: string
}): Promise<{
  total_ventas: number
  total_monto: number
  promedio_ticket: number
  cantidad_tickets: number
  ventas_por_dia: Array<{ fecha: string; monto: number; tickets: number }>
}> {
  try {
    let query = supabase
      .from('ventas')
      .select('total, fecha, ticket')
      .eq('estado', 'completada')

    if (opciones?.tienda_id) {
      query = query.eq('tienda_id', opciones.tienda_id)
    }
    if (opciones?.vendedor_id) {
      query = query.eq('vendedor_id', opciones.vendedor_id)
    }
    if (opciones?.fecha_inicio) {
      query = query.gte('fecha', opciones.fecha_inicio)
    }
    if (opciones?.fecha_fin) {
      query = query.lte('fecha', opciones.fecha_fin)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener estadísticas:', error)
      throw error
    }

    const ventas = data || []
    const total_monto = ventas.reduce((sum, v) => sum + Number(v.total || 0), 0)
    const cantidad_tickets = ventas.length
    const promedio_ticket = cantidad_tickets > 0 ? total_monto / cantidad_tickets : 0

    // Agrupar por día
    const ventasPorDia = new Map<string, { monto: number; tickets: number }>()
    ventas.forEach(venta => {
      const fecha = venta.fecha
      const actual = ventasPorDia.get(fecha) || { monto: 0, tickets: 0 }
      ventasPorDia.set(fecha, {
        monto: actual.monto + Number(venta.total || 0),
        tickets: actual.tickets + 1
      })
    })

    return {
      total_ventas: cantidad_tickets,
      total_monto,
      promedio_ticket: Math.round(promedio_ticket * 100) / 100,
      cantidad_tickets,
      ventas_por_dia: Array.from(ventasPorDia.entries()).map(([fecha, datos]) => ({
        fecha,
        ...datos
      })).sort((a, b) => a.fecha.localeCompare(b.fecha))
    }
  } catch (error) {
    console.error('Error en obtenerEstadisticasVentas:', error)
    return {
      total_ventas: 0,
      total_monto: 0,
      promedio_ticket: 0,
      cantidad_tickets: 0,
      ventas_por_dia: []
    }
  }
}

/**
 * Cancelar una venta
 */
export async function cancelarVenta(ventaId: string, motivo: string): Promise<boolean> {
  try {
    // Obtener venta con items
    const venta = await obtenerVentaPorId(ventaId)
    if (!venta || venta.estado !== 'completada') {
      return false
    }

    // Revertir inventario
    if (venta.items) {
      for (const item of venta.items) {
        const { data: inventario } = await supabase
          .from('inventario')
          .select('*')
          .eq('producto_id', item.producto_id)
          .eq('tienda_id', venta.tienda_id)
          .single()

        if (inventario) {
          await supabase
            .from('inventario')
            .update({ cantidad: inventario.cantidad + item.cantidad })
            .eq('id', inventario.id)

          // Registrar movimiento de reversión
          await supabase
            .from('movimientos_inventario')
            .insert([{
              producto_id: item.producto_id,
              tienda_origen_id: venta.tienda_id,
              cantidad: item.cantidad,
              tipo: 'devolucion',
              motivo: `Cancelación venta ${venta.ticket}: ${motivo}`,
              referencia_id: ventaId
            }])
        }
      }
    }

    // Actualizar estado de venta
    const { error } = await supabase
      .from('ventas')
      .update({ estado: 'cancelada', notas: motivo })
      .eq('id', ventaId)

    if (error) {
      console.error('Error al cancelar venta:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error en cancelarVenta:', error)
    return false
  }
}


