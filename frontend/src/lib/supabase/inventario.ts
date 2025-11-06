// Servicios para gestión de inventario
import { supabase } from '../supabase'

export interface Inventario {
  id: string
  producto_id: string
  tienda_id: string
  cantidad: number
  cantidad_minima: number
  cantidad_maxima: number
  ubicacion_fisica: string | null
  estado: string
  created_at: string
  updated_at: string
  // Relaciones
  producto?: any
  tienda?: any
}

export interface InventarioConProducto extends Inventario {
  producto: {
    id: string
    sku: string
    nombre: string
    categoria: string
    precio: number
    costo: number | null
    imagen_url: string | null
  }
  tienda: {
    id: string
    nombre: string
    codigo: string
  }
}

export interface InventarioGlobal {
  producto_id: string
  sku: string
  nombre: string
  categoria: string
  stock_total: number
  valor_total: number
  distribucion: Array<{
    tienda_id: string
    tienda_nombre: string
    stock: number
  }>
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado'
}

/**
 * Obtener inventario de una tienda específica
 */
export async function obtenerInventarioTienda(
  tiendaId: string,
  opciones?: {
    categoria?: string
    estado?: string
    bajo_stock?: boolean
    limite?: number
    offset?: number
  }
): Promise<InventarioConProducto[]> {
  try {
    let query = supabase
      .from('inventario')
      .select(`
        *,
        producto:productos(*),
        tienda:tiendas(*)
      `)
      .eq('tienda_id', tiendaId)

    if (opciones?.estado) {
      query = query.eq('estado', opciones.estado)
    }

    // Nota: bajo_stock se filtra después de obtener los datos
    // porque Supabase no permite comparar columnas directamente en la query

    if (opciones?.limite && !opciones?.bajo_stock) {
      // Solo aplicar límite si no necesitamos filtrar por bajo_stock
      // porque el filtro de bajo_stock puede reducir los resultados
      query = query.limit(opciones.limite)
    }
    if (opciones?.offset && !opciones?.bajo_stock) {
      query = query.range(opciones.offset, opciones.offset + (opciones.limite || 50) - 1)
    }

    query = query.order('updated_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener inventario:', error)
      throw error
    }

    // Filtrar por bajo_stock si se especifica (comparar cantidad con cantidad_minima)
    let filteredData = data || []
    if (opciones?.bajo_stock) {
      filteredData = filteredData.filter((item: InventarioConProducto) => 
        item.cantidad <= item.cantidad_minima
      )
      // Aplicar límite y offset después del filtro
      if (opciones?.offset) {
        filteredData = filteredData.slice(opciones.offset, opciones.offset + (opciones.limite || filteredData.length))
      } else if (opciones?.limite) {
        filteredData = filteredData.slice(0, opciones.limite)
      }
    }

    // Filtrar por categoría si se especifica
    if (opciones?.categoria) {
      filteredData = filteredData.filter(
        (item: InventarioConProducto) => item.producto?.categoria === opciones.categoria
      )
    }

    return filteredData as InventarioConProducto[]
  } catch (error) {
    console.error('Error en obtenerInventarioTienda:', error)
    return []
  }
}

/**
 * Obtener inventario global consolidado (todas las tiendas)
 */
export async function obtenerInventarioGlobal(opciones?: {
  categoria?: string
  estado?: 'Disponible' | 'Bajo Stock' | 'Agotado'
  limite?: number
  offset?: number
}): Promise<InventarioGlobal[]> {
  try {
    // Obtener todos los inventarios con productos
    const { data: inventarios, error } = await supabase
      .from('inventario')
      .select(`
        *,
        producto:productos(*),
        tienda:tiendas(*)
      `)
      .eq('estado', 'disponible')

    if (error) {
      console.error('Error al obtener inventario global:', error)
      throw error
    }

    // Consolidar por producto
    const consolidado = new Map<string, InventarioGlobal>()

    inventarios?.forEach((item: any) => {
      const producto = item.producto
      if (!producto) return

      const productoId = producto.id

      if (!consolidado.has(productoId)) {
        consolidado.set(productoId, {
          producto_id: productoId,
          sku: producto.sku,
          nombre: producto.nombre,
          categoria: producto.categoria,
          stock_total: 0,
          valor_total: 0,
          distribucion: [],
          estado: 'Disponible'
        })
      }

      const consolidadoItem = consolidado.get(productoId)!
      const cantidad = item.cantidad || 0
      const precio = producto.precio || 0

      consolidadoItem.stock_total += cantidad
      consolidadoItem.valor_total += cantidad * precio
      consolidadoItem.distribucion.push({
        tienda_id: item.tienda_id,
        tienda_nombre: item.tienda?.nombre || 'Sin nombre',
        stock: cantidad
      })
    })

    // Convertir a array y determinar estado
    let resultado = Array.from(consolidado.values()).map(item => {
      // Determinar estado basado en stock total
      if (item.stock_total === 0) {
        item.estado = 'Agotado'
      } else if (item.stock_total < 10) {
        item.estado = 'Bajo Stock'
      } else {
        item.estado = 'Disponible'
      }
      return item
    })

    // Aplicar filtros
    if (opciones?.categoria) {
      resultado = resultado.filter(item => item.categoria === opciones.categoria)
    }
    if (opciones?.estado) {
      resultado = resultado.filter(item => item.estado === opciones.estado)
    }

    // Ordenar por stock total descendente
    resultado.sort((a, b) => b.stock_total - a.stock_total)

    // Aplicar paginación
    if (opciones?.offset !== undefined && opciones?.limite) {
      resultado = resultado.slice(opciones.offset, opciones.offset + opciones.limite)
    } else if (opciones?.limite) {
      resultado = resultado.slice(0, opciones.limite)
    }

    return resultado
  } catch (error) {
    console.error('Error en obtenerInventarioGlobal:', error)
    return []
  }
}

/**
 * Obtener inventario de un producto específico
 */
export async function obtenerInventarioProducto(productoId: string): Promise<InventarioConProducto[]> {
  try {
    const { data, error } = await supabase
      .from('inventario')
      .select(`
        *,
        producto:productos(*),
        tienda:tiendas(*)
      `)
      .eq('producto_id', productoId)
      .order('cantidad', { ascending: false })

    if (error) {
      console.error('Error al obtener inventario del producto:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerInventarioProducto:', error)
    return []
  }
}

/**
 * Realizar ajuste de inventario
 */
export async function ajustarInventario(
  inventarioId: string,
  cantidadNueva: number,
  motivo: string,
  usuarioId: string
): Promise<boolean> {
  try {
    // Obtener inventario actual
    const { data: inventario, error: inventarioError } = await supabase
      .from('inventario')
      .select('*')
      .eq('id', inventarioId)
      .single()

    if (inventarioError || !inventario) {
      console.error('Error al obtener inventario:', inventarioError)
      return false
    }

    // Crear registro de ajuste
    const { error: ajusteError } = await supabase
      .from('ajustes_inventario')
      .insert([{
        inventario_id: inventarioId,
        cantidad_anterior: inventario.cantidad,
        cantidad_nueva: cantidadNueva,
        motivo,
        created_by: usuarioId,
        estado: 'pendiente'
      }])

    if (ajusteError) {
      console.error('Error al crear ajuste:', ajusteError)
      return false
    }

    // Si el ajuste está aprobado automáticamente, actualizar inventario
    // (En producción, esto requeriría aprobación)
    const { error: updateError } = await supabase
      .from('inventario')
      .update({ cantidad: cantidadNueva })
      .eq('id', inventarioId)

    if (updateError) {
      console.error('Error al actualizar inventario:', updateError)
      return false
    }

    // Registrar movimiento
    await supabase
      .from('movimientos_inventario')
      .insert([{
        producto_id: inventario.producto_id,
        tienda_origen_id: inventario.tienda_id,
        cantidad: cantidadNueva - inventario.cantidad,
        tipo: 'ajuste',
        motivo,
        usuario_id: usuarioId
      }])

    return true
  } catch (error) {
    console.error('Error en ajustarInventario:', error)
    return false
  }
}

/**
 * Transferir inventario entre tiendas
 */
export async function transferirInventario(
  productoId: string,
  tiendaOrigenId: string,
  tiendaDestinoId: string,
  cantidad: number,
  motivo: string,
  usuarioId: string
): Promise<boolean> {
  try {
    // Verificar stock en tienda origen
    const { data: inventarioOrigen, error: origenError } = await supabase
      .from('inventario')
      .select('*')
      .eq('producto_id', productoId)
      .eq('tienda_id', tiendaOrigenId)
      .single()

    if (origenError || !inventarioOrigen) {
      console.error('Error al obtener inventario origen:', origenError)
      return false
    }

    if (inventarioOrigen.cantidad < cantidad) {
      throw new Error('Stock insuficiente en tienda origen')
    }

    // Actualizar inventario origen
    const { error: updateOrigenError } = await supabase
      .from('inventario')
      .update({ cantidad: inventarioOrigen.cantidad - cantidad })
      .eq('id', inventarioOrigen.id)

    if (updateOrigenError) {
      console.error('Error al actualizar inventario origen:', updateOrigenError)
      return false
    }

    // Obtener o crear inventario destino
    const { data: inventarioDestino, error: destinoError } = await supabase
      .from('inventario')
      .select('*')
      .eq('producto_id', productoId)
      .eq('tienda_id', tiendaDestinoId)
      .single()

    if (destinoError && destinoError.code === 'PGRST116') {
      // No existe, crear nuevo
      const { error: createError } = await supabase
        .from('inventario')
        .insert([{
          producto_id: productoId,
          tienda_id: tiendaDestinoId,
          cantidad,
          estado: 'disponible'
        }])

      if (createError) {
        console.error('Error al crear inventario destino:', createError)
        return false
      }
    } else if (!destinoError && inventarioDestino) {
      // Existe, actualizar
      const { error: updateDestinoError } = await supabase
        .from('inventario')
        .update({ cantidad: inventarioDestino.cantidad + cantidad })
        .eq('id', inventarioDestino.id)

      if (updateDestinoError) {
        console.error('Error al actualizar inventario destino:', updateDestinoError)
        return false
      }
    }

    // Registrar movimiento
    await supabase
      .from('movimientos_inventario')
      .insert([{
        producto_id: productoId,
        tienda_origen_id: tiendaOrigenId,
        tienda_destino_id: tiendaDestinoId,
        cantidad,
        tipo: 'transferencia',
        motivo,
        usuario_id: usuarioId
      }])

    return true
  } catch (error) {
    console.error('Error en transferirInventario:', error)
    return false
  }
}

/**
 * Obtener alertas de inventario (bajo stock)
 */
export async function obtenerAlertasInventario(tiendaId?: string): Promise<InventarioConProducto[]> {
  try {
    let query = supabase
      .from('inventario')
      .select(`
        *,
        producto:productos(*),
        tienda:tiendas(*)
      `)
      .eq('estado', 'disponible')

    if (tiendaId) {
      query = query.eq('tienda_id', tiendaId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener alertas:', error)
      throw error
    }

    // Filtrar por bajo stock (cantidad <= cantidad_minima) después de obtener los datos
    // porque Supabase no permite comparar columnas directamente en la query
    const alertas = (data || []).filter((item: InventarioConProducto) => 
      item.cantidad <= item.cantidad_minima
    )

    return alertas
  } catch (error) {
    console.error('Error en obtenerAlertasInventario:', error)
    return []
  }
}

/**
 * Obtener movimientos de inventario
 */
export async function obtenerMovimientosInventario(opciones?: {
  producto_id?: string
  tienda_id?: string
  tipo?: string
  fecha_inicio?: string
  fecha_fin?: string
  limite?: number
}): Promise<any[]> {
  try {
    let query = supabase
      .from('movimientos_inventario')
      .select(`
        *,
        producto:productos(*),
        tienda_origen:tiendas!movimientos_inventario_tienda_origen_id_fkey(*),
        tienda_destino:tiendas!movimientos_inventario_tienda_destino_id_fkey(*),
        usuario:usuarios(*)
      `)

    if (opciones?.producto_id) {
      query = query.eq('producto_id', opciones.producto_id)
    }
    if (opciones?.tienda_id) {
      query = query.or(`tienda_origen_id.eq.${opciones.tienda_id},tienda_destino_id.eq.${opciones.tienda_id}`)
    }
    if (opciones?.tipo) {
      query = query.eq('tipo', opciones.tipo)
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
      console.error('Error al obtener movimientos:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerMovimientosInventario:', error)
    return []
  }
}


