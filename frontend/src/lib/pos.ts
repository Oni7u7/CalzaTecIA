export interface ItemCarrito {
  id: string
  producto: {
    id: string
    sku: string
    nombre: string
    precio: number
    talla: string
    stock: number
  }
  cantidad: number
  subtotal: number
}

export interface Venta {
  id: string
  numeroTicket: string
  fecha: string
  hora: string
  items: ItemCarrito[]
  subtotal: number
  iva: number
  descuento: number
  total: number
  metodoPago: string
}

export function calcularTotal(items: ItemCarrito[], descuento: number = 0): {
  subtotal: number
  iva: number
  descuento: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const iva = subtotal * 0.16
  const descuentoAplicado = descuento
  const total = subtotal + iva - descuentoAplicado

  return {
    subtotal,
    iva,
    descuento: descuentoAplicado,
    total,
  }
}

export function generarNumeroTicket(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`
}

export function guardarVenta(venta: Venta): void {
  if (typeof window !== 'undefined') {
    const ventas = obtenerVentas()
    ventas.push(venta)
    localStorage.setItem('ventas_historial', JSON.stringify(ventas))
  }
}

export function obtenerVentas(): Venta[] {
  if (typeof window !== 'undefined') {
    const ventasStr = localStorage.getItem('ventas_historial')
    if (ventasStr) {
      return JSON.parse(ventasStr)
    }
  }
  return []
}



