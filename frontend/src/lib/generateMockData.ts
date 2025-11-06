// Generador de datos de demo impresionantes y realistas

import {
  ProductoInventario,
  TiendaCompleta,
  KPIDatosHistoricos,
  MovimientoInventario,
  PRODUCTOS_INVENTARIO,
  TIENDAS_COMPLETAS,
} from './mockData'

// Generar 100 productos variados
export function generateProductos(): ProductoInventario[] {
  const categorias: ('Casual' | 'Formal' | 'Deportivo')[] = ['Casual', 'Formal', 'Deportivo']
  const tipos = {
    Casual: ['Bota', 'Zapato', 'Sandalia', 'Mocasín', 'Oxford'],
    Formal: ['Zapato', 'Oxford', 'Derby', 'Monk', 'Brogue'],
    Deportivo: ['Tenis', 'Running', 'Training', 'Basketball', 'Trekking'],
  }
  const tallas = ['22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32']
  const colores = ['Negro', 'Blanco', 'Café', 'Azul', 'Rojo', 'Gris', 'Beige']

  const productos: ProductoInventario[] = []

  for (let i = 0; i < 100; i++) {
    const categoria = categorias[i % categorias.length]
    const tipo = tipos[categoria][Math.floor(Math.random() * tipos[categoria].length)]
    const talla = tallas[Math.floor(Math.random() * tallas.length)]
    const color = colores[Math.floor(Math.random() * colores.length)]

    const precioBase = categoria === 'Formal' ? 1500 : categoria === 'Deportivo' ? 1200 : 1000
    const precio = precioBase + (Math.random() * 500 - 250)
    const costo = precio * 0.6
    const stockTotal = Math.floor(Math.random() * 200) + 10

    const estados: ('Disponible' | 'Bajo Stock' | 'Agotado')[] = [
      'Disponible',
      'Disponible',
      'Disponible',
      'Bajo Stock',
      'Agotado',
    ]
    const estado = estados[Math.floor(Math.random() * estados.length)]

    const tiendas = ['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe']
    const distribucion = tiendas.map((tienda) => ({
      tienda,
      stock: Math.floor(stockTotal * (0.15 + Math.random() * 0.15)),
    }))

    productos.push({
      id: i + 1,
      sku: `ZAP-${String(i + 1).padStart(3, '0')}`,
      nombre: `${tipo} ${categoria} ${color} Talla ${talla}`,
      categoria,
      talla,
      precio: Math.round(precio),
      costo: Math.round(costo),
      stockTotal,
      valorTotal: Math.round(stockTotal * precio),
      distribucion,
      estado,
      fechaIngreso: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      ultimaVenta:
        Math.random() > 0.3
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
    })
  }

  return productos
}

// Generar 7 tiendas completas
export function generateTiendas(): TiendaCompleta[] {
  const ubicaciones = [
    { nombre: 'Centro', ciudad: 'Ciudad de México', direccion: 'Av. Juárez 123' },
    { nombre: 'Sur', ciudad: 'Ciudad de México', direccion: 'Av. Insurgentes Sur 456' },
    { nombre: 'Norte', ciudad: 'Ciudad de México', direccion: 'Av. Constituyentes 789' },
    { nombre: 'Satélite', ciudad: 'Naucalpan', direccion: 'Plaza Satélite, Local 234' },
    { nombre: 'Santa Fe', ciudad: 'Ciudad de México', direccion: 'Centro Santa Fe, Local 567' },
    { nombre: 'Polanco', ciudad: 'Ciudad de México', direccion: 'Av. Presidente Masaryk 123' },
    { nombre: 'Roma', ciudad: 'Ciudad de México', direccion: 'Av. Álvaro Obregón 456' },
  ]

  const gerentes = [
    'María García',
    'Pedro Ramírez',
    'Laura Martínez',
    'Ana López',
    'Carlos Mendoza',
    'Sofía Torres',
    'Juan Pérez',
  ]

  return ubicaciones.map((ubicacion, index) => {
    const ventasMes = 300000 + Math.random() * 400000
    const inventario = 1500 + Math.random() * 2000
    const rotacion = 35 + Math.random() * 25
    const personal = 6 + Math.floor(Math.random() * 7)

    return {
      id: index + 1,
      nombre: `Calzando México - ${ubicacion.nombre}`,
      ubicacion: `${ubicacion.ciudad}, ${ubicacion.nombre}`,
      direccion: `${ubicacion.direccion}, ${ubicacion.ciudad}`,
      telefono: `5555-${String(index + 1).padStart(4, '0')}`,
      horario: 'Lun-Dom 9:00-21:00',
      gerente: gerentes[index],
      gerenteEmail: `${gerentes[index].toLowerCase().replace(' ', '.')}@calzando.com`,
      personal,
      estado: 'Activa' as const,
      ventasMes: Math.round(ventasMes),
      inventario: Math.round(inventario),
      rotacion: Math.round(rotacion),
      fechaApertura: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split('T')[0],
      kpis: {
        ventasPromedio: Math.round(ventasMes / 30),
        ticketsPromedio: 1000 + Math.random() * 500,
        merma: 1 + Math.random() * 2,
        exactitud: 90 + Math.random() * 8,
      },
      historialVentas: Array.from({ length: 12 }, (_, i) => ({
        mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
        ventas: ventasMes * (0.8 + Math.random() * 0.4),
      })),
    }
  })
}

// Generar 500 ventas históricas (últimos 3 meses)
export function generateVentas() {
  const ventas = []
  const productos = PRODUCTOS_INVENTARIO
  const tiendas = TIENDAS_COMPLETAS
  const vendedores = ['María García', 'Pedro Ramírez', 'Laura Martínez', 'Ana López']

  // Generar ventas con tendencias realistas
  const diasDeSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const multiplicadores = [0.8, 0.9, 0.95, 1.0, 1.2, 1.5, 1.3] // Fines de semana más ventas

  for (let i = 0; i < 500; i++) {
    const fecha = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    const diaSemana = fecha.getDay()
    const multiplicador = multiplicadores[diaSemana]

    const tienda = tiendas[Math.floor(Math.random() * tiendas.length)]
    const vendedor = vendedores[Math.floor(Math.random() * vendedores.length)]
    const numProductos = Math.floor(Math.random() * 3) + 1

    const productosVenta = []
    let subtotal = 0

    for (let j = 0; j < numProductos; j++) {
      const producto = productos[Math.floor(Math.random() * productos.length)]
      const cantidad = Math.floor(Math.random() * 2) + 1
      const precioUnitario = producto.precio
      const subtotalItem = cantidad * precioUnitario

      productosVenta.push({
        producto_id: producto.id,
        nombre: producto.nombre,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal: subtotalItem,
      })

      subtotal += subtotalItem
    }

    const descuento = Math.random() > 0.8 ? subtotal * 0.1 : 0
    const iva = (subtotal - descuento) * 0.16
    const total = subtotal - descuento + iva

    ventas.push({
      id: i + 1,
      ticket: `TKT-${String(i + 1).padStart(6, '0')}`,
      fecha: fecha.toISOString().split('T')[0],
      hora: fecha.toTimeString().split(' ')[0],
      vendedor_id: Math.floor(Math.random() * 4) + 1,
      vendedor,
      tienda_id: tienda.id,
      tienda: tienda.nombre,
      productos: productosVenta,
      subtotal: Math.round(subtotal * multiplicador),
      iva: Math.round(iva * multiplicador),
      descuento: Math.round(descuento * multiplicador),
      total: Math.round(total * multiplicador),
      metodo_pago: ['efectivo', 'debito', 'credito', 'transferencia'][
        Math.floor(Math.random() * 4)
      ],
    })
  }

  return ventas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}

// Generar 1000 movimientos de inventario
export function generateMovimientosInventario(): MovimientoInventario[] {
  const movimientos: MovimientoInventario[] = []
  const productos = PRODUCTOS_INVENTARIO
  const tiendas = ['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe']
  const usuarios = [
    'María García',
    'Pedro Ramírez',
    'Laura Martínez',
    'Ana López',
    'Carlos Mendoza',
  ]

  const tipos: ('entrada' | 'salida' | 'transferencia' | 'ajuste')[] = [
    'entrada',
    'salida',
    'transferencia',
    'ajuste',
  ]

  const motivos = [
    'Recepción de mercancía',
    'Venta al cliente',
    'Transferencia entre tiendas',
    'Ajuste de inventario',
    'Devolución de proveedor',
    'Merma registrada',
    'Producto dañado',
    'Reubicación de stock',
  ]

  for (let i = 0; i < 1000; i++) {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]
    const fecha = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const producto = productos[Math.floor(Math.random() * productos.length)]
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)]
    const motivo = motivos[Math.floor(Math.random() * motivos.length)]

    let movimiento: MovimientoInventario = {
      id: i + 1,
      fecha: fecha.toISOString().split('T')[0],
      tipo,
      producto: producto.nombre,
      sku: producto.sku,
      cantidad: Math.floor(Math.random() * 50) + 1,
      motivo,
      usuario,
    }

    if (tipo === 'transferencia') {
      const tiendasSeleccionadas = [...tiendas].sort(() => Math.random() - 0.5)
      movimiento.tiendaOrigen = tiendasSeleccionadas[0]
      movimiento.tiendaDestino = tiendasSeleccionadas[1]
    } else if (tipo === 'entrada' || tipo === 'salida') {
      movimiento.tiendaOrigen = tiendas[Math.floor(Math.random() * tiendas.length)]
    }

    movimientos.push(movimiento)
  }

  return movimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}

// Función principal para generar todos los datos
export function generateAllMockData() {
  return {
    productos: generateProductos(),
    tiendas: generateTiendas(),
    ventas: generateVentas(),
    movimientos: generateMovimientosInventario(),
  }
}



