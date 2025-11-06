// Datos simulados para desarrollo y testing

export interface ProductoInventario {
  id: number
  sku: string
  nombre: string
  categoria: 'Casual' | 'Formal' | 'Deportivo'
  talla: string
  precio: number
  costo: number
  stockTotal: number
  valorTotal: number
  distribucion: { tienda: string; stock: number }[]
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado'
  imagen?: string
  fechaIngreso?: string
  ultimaVenta?: string
}

export interface TiendaCompleta {
  id: number
  nombre: string
  ubicacion: string
  direccion: string
  telefono: string
  horario: string
  gerente: string
  gerenteEmail: string
  personal: number
  estado: 'Activa' | 'Inactiva'
  ventasMes: number
  inventario: number
  rotacion: number
  fechaApertura: string
  kpis: {
    ventasPromedio: number
    ticketsPromedio: number
    merma: number
    exactitud: number
  }
  historialVentas: {
    mes: string
    ventas: number
  }[]
}

export interface KPIDatosHistoricos {
  nombre: string
  nivel: 'estrategico' | 'tactico' | 'operativo'
  datosMensuales: {
    mes: string
    valor: number
    meta: number
  }[]
  datosSemanales?: {
    semana: string
    valor: number
  }[]
}

export interface MovimientoInventario {
  id: number
  fecha: string
  tipo: 'entrada' | 'salida' | 'transferencia' | 'ajuste'
  producto: string
  sku: string
  tiendaOrigen?: string
  tiendaDestino?: string
  cantidad: number
  motivo: string
  usuario: string
}

// Productos de inventario (50 productos)
export const PRODUCTOS_INVENTARIO: ProductoInventario[] = Array.from({ length: 50 }, (_, i) => {
  const categorias: ('Casual' | 'Formal' | 'Deportivo')[] = ['Casual', 'Formal', 'Deportivo']
  const tallas = ['22', '23', '24', '25', '26', '27', '28', '29', '30']
  const estados: ('Disponible' | 'Bajo Stock' | 'Agotado')[] = [
    'Disponible',
    'Disponible',
    'Disponible',
    'Bajo Stock',
    'Agotado',
  ]

  const categoria = categorias[i % categorias.length]
  const talla = tallas[i % tallas.length]
  const precioBase = categoria === 'Formal' ? 1500 : categoria === 'Deportivo' ? 1200 : 1000
  const precio = precioBase + (Math.random() * 500 - 250)
  const costo = precio * 0.6
  const stockTotal = Math.floor(Math.random() * 200) + 10
  const estado = estados[Math.floor(Math.random() * estados.length)]

  const tiendas = ['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe']
  const distribucion = tiendas.map((tienda) => ({
    tienda,
    stock: Math.floor(stockTotal * (0.15 + Math.random() * 0.15)),
  }))

  return {
    id: i + 1,
    sku: `ZAP-${String(i + 1).padStart(3, '0')}`,
    nombre: `${categoria} ${talla} - Modelo ${i + 1}`,
    categoria,
    talla,
    precio: Math.round(precio),
    costo: Math.round(costo),
    stockTotal,
    valorTotal: Math.round(stockTotal * precio),
    distribucion,
    estado,
    fechaIngreso: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    ultimaVenta:
      Math.random() > 0.3
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        : undefined,
  }
})

// Tiendas completas (5 tiendas)
export const TIENDAS_COMPLETAS: TiendaCompleta[] = [
  {
    id: 1,
    nombre: 'Calzando México - Centro',
    ubicacion: 'Ciudad de México, Centro',
    direccion: 'Av. Juárez 123, Col. Centro, CDMX',
    telefono: '5555-1234',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'María García',
    gerenteEmail: 'vendedor@calzando.com',
    personal: 8,
    estado: 'Activa',
    ventasMes: 450230,
    inventario: 2340,
    rotacion: 45,
    fechaApertura: '2020-01-15',
    kpis: {
      ventasPromedio: 15000,
      ticketsPromedio: 1245,
      merma: 1.8,
      exactitud: 94,
    },
    historialVentas: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      ventas: 400000 + Math.random() * 100000,
    })),
  },
  {
    id: 2,
    nombre: 'Calzando México - Sur',
    ubicacion: 'Ciudad de México, Sur',
    direccion: 'Av. Insurgentes Sur 456, Col. Del Valle, CDMX',
    telefono: '5555-1235',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'Pedro Ramírez',
    gerenteEmail: 'supervisor@calzando.com',
    personal: 6,
    estado: 'Activa',
    ventasMes: 380000,
    inventario: 1890,
    rotacion: 42,
    fechaApertura: '2021-03-20',
    kpis: {
      ventasPromedio: 12600,
      ticketsPromedio: 1180,
      merma: 2.1,
      exactitud: 92,
    },
    historialVentas: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      ventas: 350000 + Math.random() * 80000,
    })),
  },
  {
    id: 3,
    nombre: 'Calzando México - Norte',
    ubicacion: 'Ciudad de México, Norte',
    direccion: 'Av. Constituyentes 789, Col. Lomas, CDMX',
    telefono: '5555-1236',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'Laura Martínez',
    gerenteEmail: 'coordinador@calzando.com',
    personal: 7,
    estado: 'Activa',
    ventasMes: 320000,
    inventario: 1650,
    rotacion: 38,
    fechaApertura: '2021-06-10',
    kpis: {
      ventasPromedio: 10600,
      ticketsPromedio: 1120,
      merma: 2.5,
      exactitud: 90,
    },
    historialVentas: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      ventas: 300000 + Math.random() * 60000,
    })),
  },
  {
    id: 4,
    nombre: 'Calzando México - Plaza Satélite',
    ubicacion: 'Naucalpan, Estado de México',
    direccion: 'Plaza Satélite, Local 234, Naucalpan, Edo. Méx.',
    telefono: '5555-1237',
    horario: 'Lun-Dom 10:00-22:00',
    gerente: 'Ana López',
    gerenteEmail: 'gerente.nacional@calzando.com',
    personal: 10,
    estado: 'Activa',
    ventasMes: 520000,
    inventario: 2800,
    rotacion: 52,
    fechaApertura: '2022-01-05',
    kpis: {
      ventasPromedio: 17300,
      ticketsPromedio: 1350,
      merma: 1.5,
      exactitud: 96,
    },
    historialVentas: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      ventas: 480000 + Math.random() * 120000,
    })),
  },
  {
    id: 5,
    nombre: 'Calzando México - Santa Fe',
    ubicacion: 'Ciudad de México, Santa Fe',
    direccion: 'Centro Santa Fe, Local 567, CDMX',
    telefono: '5555-1238',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'Carlos Mendoza',
    gerenteEmail: 'director@calzando.com',
    personal: 12,
    estado: 'Activa',
    ventasMes: 680000,
    inventario: 3500,
    rotacion: 58,
    fechaApertura: '2022-05-15',
    kpis: {
      ventasPromedio: 22600,
      ticketsPromedio: 1480,
      merma: 1.2,
      exactitud: 98,
    },
    historialVentas: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      ventas: 650000 + Math.random() * 150000,
    })),
  },
]

// KPIs con datos históricos (últimos 12 meses)
export const KPIS_DATOS_HISTORICOS: KPIDatosHistoricos[] = [
  {
    nombre: 'ROI (Return on Investment)',
    nivel: 'estrategico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 15 + Math.random() * 5 + (i * 0.3),
      meta: 20,
    })),
  },
  {
    nombre: 'Rotación de Inventario Anual',
    nivel: 'estrategico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 7 + Math.random() * 2 + (i * 0.1),
      meta: 10,
    })),
  },
  {
    nombre: 'Margen Bruto Consolidado',
    nivel: 'estrategico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 40 + Math.random() * 3 + (i * 0.2),
      meta: 45,
    })),
  },
  {
    nombre: 'Crecimiento en Ventas',
    nivel: 'estrategico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 8 + Math.random() * 5 + (i * 0.4),
      meta: 15,
    })),
  },
  {
    nombre: 'Días de Cobertura de Inventario',
    nivel: 'tactico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 45 + Math.random() * 15 + (i * 0.5),
      meta: 60,
    })),
  },
  {
    nombre: 'Exactitud de Inventario',
    nivel: 'tactico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 88 + Math.random() * 5 + (i * 0.5),
      meta: 98,
    })),
  },
  {
    nombre: 'Fill Rate (Tasa de Surtido)',
    nivel: 'tactico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 85 + Math.random() * 5 + (i * 0.3),
      meta: 95,
    })),
  },
  {
    nombre: 'Ticket Promedio',
    nivel: 'tactico',
    datosMensuales: Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(2024, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      valor: 1150 + Math.random() * 100 + (i * 8),
      meta: 1500,
    })),
  },
]

// Movimientos de inventario (últimos 30 días)
export const MOVIMIENTOS_INVENTARIO: MovimientoInventario[] = Array.from(
  { length: 100 },
  (_, i) => {
    const tipos: ('entrada' | 'salida' | 'transferencia' | 'ajuste')[] = [
      'entrada',
      'salida',
      'transferencia',
      'ajuste',
    ]
    const tiendas = ['Centro', 'Sur', 'Norte', 'Satélite', 'Santa Fe']
    const usuarios = [
      'María García',
      'Pedro Ramírez',
      'Laura Martínez',
      'Ana López',
      'Carlos Mendoza',
    ]
    const motivos = [
      'Recepción de mercancía',
      'Venta al cliente',
      'Transferencia entre tiendas',
      'Ajuste de inventario',
      'Devolución de proveedor',
      'Merma registrada',
    ]

    const tipo = tipos[Math.floor(Math.random() * tipos.length)]
    const fecha = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const producto = PRODUCTOS_INVENTARIO[Math.floor(Math.random() * PRODUCTOS_INVENTARIO.length)]

    let movimiento: MovimientoInventario = {
      id: i + 1,
      fecha: fecha.toISOString().split('T')[0],
      tipo,
      producto: producto.nombre,
      sku: producto.sku,
      cantidad: Math.floor(Math.random() * 50) + 1,
      motivo: motivos[Math.floor(Math.random() * motivos.length)],
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
    }

    if (tipo === 'transferencia') {
      const tiendasSeleccionadas = [...tiendas].sort(() => Math.random() - 0.5)
      movimiento.tiendaOrigen = tiendasSeleccionadas[0]
      movimiento.tiendaDestino = tiendasSeleccionadas[1]
    } else if (tipo === 'entrada' || tipo === 'salida') {
      movimiento.tiendaOrigen = tiendas[Math.floor(Math.random() * tiendas.length)]
    }

    return movimiento
  }
)

// Funciones helper para obtener datos
export function obtenerProductosPorTienda(tienda: string): ProductoInventario[] {
  return PRODUCTOS_INVENTARIO.filter((producto) =>
    producto.distribucion.some((dist) => dist.tienda === tienda && dist.stock > 0)
  )
}

export function obtenerProductosBajoStock(): ProductoInventario[] {
  return PRODUCTOS_INVENTARIO.filter((producto) => producto.estado === 'Bajo Stock')
}

export function obtenerProductosAgotados(): ProductoInventario[] {
  return PRODUCTOS_INVENTARIO.filter((producto) => producto.estado === 'Agotado')
}

export function obtenerMovimientosPorTienda(tienda: string): MovimientoInventario[] {
  return MOVIMIENTOS_INVENTARIO.filter(
    (movimiento) =>
      movimiento.tiendaOrigen === tienda || movimiento.tiendaDestino === tienda
  )
}

export function obtenerKPIPorNombre(nombre: string): KPIDatosHistoricos | undefined {
  return KPIS_DATOS_HISTORICOS.find((kpi) => kpi.nombre === nombre)
}



