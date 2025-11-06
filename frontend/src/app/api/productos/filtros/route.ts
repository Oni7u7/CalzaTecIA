import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Obtener parámetros de filtro
    const categoria = searchParams.get('categoria')
    const talla = searchParams.get('talla')
    const color = searchParams.get('color')
    const precioMin = searchParams.get('precio_min') ? parseFloat(searchParams.get('precio_min')!) : undefined
    const precioMax = searchParams.get('precio_max') ? parseFloat(searchParams.get('precio_max')!) : undefined
    const genero = searchParams.get('genero') // hombre, mujer, unisex
    const nombre = searchParams.get('nombre')
    const limite = searchParams.get('limite') ? parseInt(searchParams.get('limite')!) : 20

    // Construir query
    let query = supabase
      .from('productos')
      .select('*')
      .eq('activo', true)

    // Filtro por categoría
    if (categoria) {
      query = query.ilike('categoria', `%${categoria}%`)
    }

    // Filtro por nombre o SKU
    if (nombre) {
      query = query.or(`nombre.ilike.%${nombre}%,sku.ilike.%${nombre}%,descripcion.ilike.%${nombre}%`)
    }

    // Filtro por precio
    if (precioMin !== undefined) {
      query = query.gte('precio', precioMin)
    }
    if (precioMax !== undefined) {
      query = query.lte('precio', precioMax)
    }

    // Filtro por talla (en tallas_disponibles JSONB)
    if (talla) {
      query = query.contains('tallas_disponibles', [talla])
    }

    // Filtro por color (en colores_disponibles JSONB)
    if (color) {
      query = query.contains('colores_disponibles', [color])
    }

    // Filtro por género (buscar en categoría o nombre)
    if (genero) {
      const generoLower = genero.toLowerCase()
      if (generoLower === 'hombre' || generoLower === 'masculino' || generoLower === 'hombres') {
        query = query.or(`categoria.ilike.%hombre%,categoria.ilike.%masculino%,nombre.ilike.%hombre%,nombre.ilike.%masculino%`)
      } else if (generoLower === 'mujer' || generoLower === 'femenino' || generoLower === 'mujeres') {
        query = query.or(`categoria.ilike.%mujer%,categoria.ilike.%femenino%,nombre.ilike.%mujer%,nombre.ilike.%femenino%`)
      } else if (generoLower === 'unisex' || generoLower === 'unisex') {
        query = query.or(`categoria.ilike.%unisex%,nombre.ilike.%unisex%`)
      }
    }

    // Aplicar límite y ordenar
    query = query.limit(limite).order('nombre', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error al filtrar productos:', error)
      return NextResponse.json(
        { error: 'Error al filtrar productos', details: error.message },
        { status: 500 }
      )
    }

    // Formatear productos para el chatbot
    const productosFormateados = (data || []).map((producto: any) => ({
      id: producto.id,
      sku: producto.sku,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      tallas_disponibles: producto.tallas_disponibles || [],
      colores_disponibles: producto.colores_disponibles || [],
      imagen_url: producto.imagen_url,
      descripcion: producto.descripcion,
      marca: producto.marca
    }))

    return NextResponse.json({
      success: true,
      productos: productosFormateados,
      total: productosFormateados.length
    })
  } catch (error: any) {
    console.error('Error en API de filtros:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Obtener parámetros de filtro del body
    const { categoria, talla, color, precio_min, precio_max, genero, nombre, limite = 20 } = body

    // Construir query
    let query = supabase
      .from('productos')
      .select('*')
      .eq('activo', true)

    // Filtro por categoría
    if (categoria) {
      query = query.ilike('categoria', `%${categoria}%`)
    }

    // Filtro por nombre o SKU
    if (nombre) {
      query = query.or(`nombre.ilike.%${nombre}%,sku.ilike.%${nombre}%,descripcion.ilike.%${nombre}%`)
    }

    // Filtro por precio
    if (precio_min !== undefined) {
      query = query.gte('precio', precio_min)
    }
    if (precio_max !== undefined) {
      query = query.lte('precio', precio_max)
    }

    // Filtro por talla (en tallas_disponibles JSONB)
    if (talla) {
      query = query.contains('tallas_disponibles', [talla])
    }

    // Filtro por color (en colores_disponibles JSONB)
    if (color) {
      query = query.contains('colores_disponibles', [color])
    }

    // Filtro por género (buscar en categoría o nombre)
    if (genero) {
      const generoLower = genero.toLowerCase()
      if (generoLower === 'hombre' || generoLower === 'masculino' || generoLower === 'hombres') {
        query = query.or(`categoria.ilike.%hombre%,categoria.ilike.%masculino%,nombre.ilike.%hombre%,nombre.ilike.%masculino%`)
      } else if (generoLower === 'mujer' || generoLower === 'femenino' || generoLower === 'mujeres') {
        query = query.or(`categoria.ilike.%mujer%,categoria.ilike.%femenino%,nombre.ilike.%mujer%,nombre.ilike.%femenino%`)
      } else if (generoLower === 'unisex' || generoLower === 'unisex') {
        query = query.or(`categoria.ilike.%unisex%,nombre.ilike.%unisex%`)
      }
    }

    // Aplicar límite y ordenar
    query = query.limit(limite).order('nombre', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error al filtrar productos:', error)
      return NextResponse.json(
        { error: 'Error al filtrar productos', details: error.message },
        { status: 500 }
      )
    }

    // Formatear productos para el chatbot
    const productosFormateados = (data || []).map((producto: any) => ({
      id: producto.id,
      sku: producto.sku,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      tallas_disponibles: producto.tallas_disponibles || [],
      colores_disponibles: producto.colores_disponibles || [],
      imagen_url: producto.imagen_url,
      descripcion: producto.descripcion,
      marca: producto.marca
    }))

    return NextResponse.json({
      success: true,
      productos: productosFormateados,
      total: productosFormateados.length
    })
  } catch (error: any) {
    console.error('Error en API de filtros:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}

