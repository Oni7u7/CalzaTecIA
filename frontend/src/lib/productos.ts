// Funciones para buscar productos en Supabase
// Este archivo mantiene compatibilidad con el código existente
import { supabase } from './supabase'

export interface Producto {
  id: string
  sku: string
  nombre: string
  categoria: string
  subcategoria?: string
  descripcion?: string
  marca?: string
  precio: number
  costo?: number
  imagen_url?: string
  imagenes?: string[]
  tallas_disponibles?: string[]
  colores_disponibles?: string[]
  materiales?: string[]
  especificaciones?: any
  activo: boolean
  created_at: string
  updated_at: string
}

export interface ProductoConInventario extends Producto {
  stock?: number
  tienda_id?: string
}

export interface BusquedaProductosParams {
  categoria?: string
  talla?: string
  color?: string
  precioMin?: number
  precioMax?: number
  nombre?: string
  sku?: string
  activo?: boolean
  limite?: number
}

/**
 * Busca productos en Supabase con filtros
 */
export async function buscarProductos(
  params: BusquedaProductosParams = {}
): Promise<Producto[]> {
  try {
    let query = supabase
      .from('productos')
      .select('*')
      .eq('activo', params.activo !== false ? true : false)

    // Filtro por categoría
    if (params.categoria) {
      query = query.ilike('categoria', `%${params.categoria}%`)
    }

    // Filtro por nombre o SKU (búsqueda full-text)
    if (params.nombre) {
      query = query.or(`nombre.ilike.%${params.nombre}%,sku.ilike.%${params.nombre}%`)
    }

    if (params.sku) {
      query = query.ilike('sku', `%${params.sku}%`)
    }

    // Filtro por precio
    if (params.precioMin !== undefined) {
      query = query.gte('precio', params.precioMin)
    }
    if (params.precioMax !== undefined) {
      query = query.lte('precio', params.precioMax)
    }

    // Filtro por talla (en tallas_disponibles JSONB)
    if (params.talla) {
      query = query.contains('tallas_disponibles', [params.talla])
    }

    // Filtro por color (en colores_disponibles JSONB)
    if (params.color) {
      query = query.contains('colores_disponibles', [params.color])
    }

    // Límite de resultados
    if (params.limite) {
      query = query.limit(params.limite)
    } else {
      query = query.limit(20) // Límite por defecto
    }

    const { data, error } = await query.order('nombre', { ascending: true })

    if (error) {
      console.error('Error al buscar productos:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en buscarProductos:', error)
    return []
  }
}

/**
 * Busca productos por texto libre (búsqueda full-text)
 */
export async function buscarProductosPorTexto(
  texto: string,
  limite: number = 10
): Promise<Producto[]> {
  try {
    // Búsqueda en nombre y SKU
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .or(`nombre.ilike.%${texto}%,sku.ilike.%${texto}%,descripcion.ilike.%${texto}%`)
      .eq('activo', true)
      .limit(limite)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error al buscar productos por texto:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error en buscarProductosPorTexto:', error)
    return []
  }
}

/**
 * Obtiene un producto por ID
 */
export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .eq('activo', true)
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
 * Obtiene el inventario de un producto en una tienda
 * Si no se pasa tiendaId, obtiene el inventario global (suma de todas las tiendas)
 */
export async function obtenerInventarioProducto(
  productoId: string,
  tiendaId?: string
): Promise<number> {
  try {
    let query = supabase
      .from('inventario')
      .select('cantidad')
      .eq('producto_id', productoId)
      .eq('estado', 'disponible')

    if (tiendaId) {
      query = query.eq('tienda_id', tiendaId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener inventario:', error)
      return 0
    }

    // Sumar todas las cantidades disponibles
    const total = data?.reduce((sum, item) => sum + (item.cantidad || 0), 0) || 0
    
    if (total > 0) {
      console.log(`  📦 Inventario para producto ${productoId}: ${total} unidades`)
    }
    
    return total
  } catch (error) {
    console.error('Error en obtenerInventarioProducto:', error)
    return 0
  }
}

/**
 * Obtiene productos con su inventario
 * Si no se pasa tiendaId, obtiene el inventario global (suma de todas las tiendas)
 */
export async function obtenerProductosConInventario(
  params: BusquedaProductosParams = {},
  tiendaId?: string
): Promise<ProductoConInventario[]> {
  try {
    const productos = await buscarProductos(params)

    // Obtener inventario para cada producto
    // Si no hay tiendaId, obtener inventario global (suma de todas las tiendas)
    const productosConInventario = await Promise.all(
      productos.map(async (producto) => {
        const stock = await obtenerInventarioProducto(producto.id, tiendaId)
        return {
          ...producto,
          stock,
          tienda_id: tiendaId
        }
      })
    )

    console.log(`✅ Productos con inventario obtenidos: ${productosConInventario.length}`)
    productosConInventario.forEach(p => {
      if (p.stock && p.stock > 0) {
        console.log(`  - ${p.nombre} (${p.sku}): ${p.stock} unidades`)
      }
    })

    return productosConInventario
  } catch (error) {
    console.error('Error en obtenerProductosConInventario:', error)
    return []
  }
}

/**
 * Formatea productos para mostrar en el chatbot
 */
export function formatearProductosParaChat(productos: Producto[]): string {
  if (productos.length === 0) {
    return 'No encontré productos que coincidan con tu búsqueda. 😔\n\n¿Podrías intentar con otros criterios?'
  }

  let mensaje = `Encontré ${productos.length} producto${productos.length > 1 ? 's' : ''}:\n\n`

  productos.slice(0, 5).forEach((producto, index) => {
    mensaje += `${index + 1}. **${producto.nombre}**\n`
    mensaje += `   - SKU: ${producto.sku}\n`
    mensaje += `   - Categoría: ${producto.categoria}\n`
    mensaje += `   - Precio: $${producto.precio.toFixed(2)} MXN\n`
    
    if (producto.tallas_disponibles && producto.tallas_disponibles.length > 0) {
      mensaje += `   - Tallas: ${producto.tallas_disponibles.slice(0, 5).join(', ')}\n`
    }
    
    if (producto.colores_disponibles && producto.colores_disponibles.length > 0) {
      mensaje += `   - Colores: ${producto.colores_disponibles.slice(0, 3).join(', ')}\n`
    }
    
    mensaje += '\n'
  })

  if (productos.length > 5) {
    mensaje += `\n... y ${productos.length - 5} producto${productos.length - 5 > 1 ? 's' : ''} más.\n`
  }

  mensaje += '\n¿Te interesa alguno de estos productos? Puedo darte más detalles. 😊'

  return mensaje
}

