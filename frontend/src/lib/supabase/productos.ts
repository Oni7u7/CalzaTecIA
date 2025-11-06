// Servicios para productos usando Supabase
import { supabase } from '../supabase'

export interface Producto {
  id: string
  sku: string
  nombre: string
  descripcion: string | null
  categoria: string
  precio: number
  costo: number | null
  marca: string | null
  modelo: string | null
  tallas_disponibles: string[] | null
  colores_disponibles: string[] | null
  imagen_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export interface ProductoConInventario extends Producto {
  stock_total?: number
  stock_por_tienda?: Array<{
    tienda_id: string
    tienda_nombre: string
    cantidad: number
  }>
}

/**
 * Obtener todos los productos
 */
export async function obtenerProductos(opciones?: {
  activo?: boolean
  categoria?: string
  limite?: number
  offset?: number
}): Promise<Producto[]> {
  try {
    let query = supabase
      .from('productos')
      .select('*')

    if (opciones?.activo !== undefined) {
      query = query.eq('activo', opciones.activo)
    }
    if (opciones?.categoria) {
      query = query.eq('categoria', opciones.categoria)
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
      console.error('Error al obtener productos:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerProductos:', error)
    return []
  }
}

/**
 * Obtener un producto por ID
 */
export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener producto:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error)
    return null
  }
}

/**
 * Buscar productos por texto
 */
export async function buscarProductosPorTexto(
  texto: string,
  opciones?: {
    categoria?: string
    limite?: number
  }
): Promise<Producto[]> {
  try {
    let query = supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .or(`nombre.ilike.%${texto}%,sku.ilike.%${texto}%,descripcion.ilike.%${texto}%`)

    if (opciones?.categoria) {
      query = query.eq('categoria', opciones.categoria)
    }

    if (opciones?.limite) {
      query = query.limit(opciones.limite)
    }

    query = query.order('nombre', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error al buscar productos:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en buscarProductosPorTexto:', error)
    return []
  }
}

/**
 * Obtener productos con inventario de una tienda
 */
export async function obtenerProductosConInventario(
  tiendaId: string,
  opciones?: {
    categoria?: string
    bajo_stock?: boolean
    limite?: number
  }
): Promise<ProductoConInventario[]> {
  try {
    // Obtener inventario de la tienda
    const { data: inventario, error: inventarioError } = await supabase
      .from('inventario')
      .select(`
        *,
        producto:productos(*)
      `)
      .eq('tienda_id', tiendaId)
      .eq('estado', 'disponible')

    if (inventarioError) {
      console.error('Error al obtener inventario:', inventarioError)
      throw inventarioError
    }

    // Agrupar por producto y calcular stock total
    const productosMap = new Map<string, ProductoConInventario>()

    inventario?.forEach((item: any) => {
      const producto = item.producto
      if (!producto) return

      const productoId = producto.id

      if (!productosMap.has(productoId)) {
        productosMap.set(productoId, {
          ...producto,
          stock_total: 0,
          stock_por_tienda: []
        })
      }

      const productoConInventario = productosMap.get(productoId)!
      const cantidad = item.cantidad || 0

      productoConInventario.stock_total = (productoConInventario.stock_total || 0) + cantidad
      productoConInventario.stock_por_tienda?.push({
        tienda_id: tiendaId,
        tienda_nombre: item.tienda?.nombre || 'Sin nombre',
        cantidad
      })
    })

    let productos = Array.from(productosMap.values())

    // Aplicar filtros
    if (opciones?.categoria) {
      productos = productos.filter(p => p.categoria === opciones.categoria)
    }
    if (opciones?.bajo_stock) {
      // Filtrar productos con stock bajo (menor a cantidad mínima)
      productos = productos.filter(p => {
        // Aquí se podría verificar contra cantidad_minima del inventario
        return (p.stock_total || 0) < 10 // Por ahora un valor fijo
      })
    }

    if (opciones?.limite) {
      productos = productos.slice(0, opciones.limite)
    }

    return productos
  } catch (error) {
    console.error('Error en obtenerProductosConInventario:', error)
    return []
  }
}

/**
 * Crear un nuevo producto
 */
export async function crearProducto(producto: {
  sku: string
  nombre: string
  descripcion?: string | null
  categoria: string
  precio: number
  costo?: number | null
  marca?: string | null
  modelo?: string | null
  tallas_disponibles?: string[] | null
  colores_disponibles?: string[] | null
  imagen_url?: string | null
  activo?: boolean
}): Promise<Producto | null> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        ...producto,
        activo: producto.activo ?? true
      }])
      .select()
      .single()

    if (error) {
      console.error('Error al crear producto:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en crearProducto:', error)
    return null
  }
}

/**
 * Actualizar un producto
 */
export async function actualizarProducto(
  id: string,
  actualizacion: Partial<Producto>
): Promise<Producto | null> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .update(actualizacion)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar producto:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en actualizarProducto:', error)
    return null
  }
}

/**
 * Eliminar un producto (soft delete)
 */
export async function eliminarProducto(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar producto:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error en eliminarProducto:', error)
    return false
  }
}


