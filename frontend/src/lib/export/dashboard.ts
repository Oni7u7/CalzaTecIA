// Funciones para exportar el dashboard de KPIs
import { calcularKPIsReales } from '../supabase/kpis'
import { supabase } from '../supabase'

export interface DashboardData {
  periodo: string
  fechaExportacion: string
  kpisEstrategicos: any[]
  kpisTacticos: any[]
  kpisOperativos: any[]
  resumen: {
    totalVentas: number
    totalTiendas: number
    promedioTicket: number
    rotacionInventario: number
  }
}

/**
 * Obtener datos del dashboard para el último mes
 */
export async function obtenerDatosUltimoMes(): Promise<DashboardData> {
  try {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const fechaInicio = inicioMes.toISOString().split('T')[0]
    const fechaFin = hoy.toISOString().split('T')[0]

    // Obtener ventas del mes
    const { data: ventas, error: ventasError } = await supabase
      .from('ventas')
      .select('total, fecha, tienda_id')
      .eq('estado', 'completada')
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)

    if (ventasError) {
      console.error('Error al obtener ventas:', ventasError)
    }

    // Obtener tiendas
    const { data: tiendas, error: tiendasError } = await supabase
      .from('tiendas')
      .select('id, nombre, codigo')
      .eq('estado', 'activa')

    if (tiendasError) {
      console.error('Error al obtener tiendas:', tiendasError)
    }

    // Calcular KPIs reales
    const kpisReales = await calcularKPIsReales()

    // Calcular totales
    const totalVentas = ventas?.reduce((sum, v) => sum + Number(v.total || 0), 0) || 0
    const totalTiendas = tiendas?.length || 0
    const tickets = ventas?.length || 0
    const promedioTicket = tickets > 0 ? totalVentas / tickets : 0

    // Calcular KPIs operativos por tienda
    const kpisOperativos = await Promise.all(
      (tiendas || []).map(async (tienda) => {
        const ventasTienda = ventas?.filter(v => v.tienda_id === tienda.id) || []
        const ventasTiendaTotal = ventasTienda.reduce((sum, v) => sum + Number(v.total || 0), 0)
        const ticketsTienda = ventasTienda.length
        
        // Obtener inventario de la tienda
        const { data: inventario } = await supabase
          .from('inventario')
          .select('cantidad, cantidad_minima')
          .eq('tienda_id', tienda.id)
          .eq('estado', 'disponible')

        const unidadesDia = inventario?.reduce((sum, i) => sum + (i.cantidad || 0), 0) || 0
        const ventasHora = ticketsTienda > 0 ? (ticketsTienda / (hoy.getDate() * 8)).toFixed(1) : '0'

        return {
          tienda: tienda.nombre,
          tiempoRecibo: Math.floor(Math.random() * 20) + 20, // Simulado por ahora
          tiempoSurtido: Math.floor(Math.random() * 20) + 35, // Simulado por ahora
          ventasHora: parseFloat(ventasHora),
          unidadesDia: Math.round(unidadesDia / hoy.getDate()),
          merma: parseFloat((Math.random() * 1.5 + 1).toFixed(1)), // Simulado por ahora
          incidencias: Math.floor(Math.random() * 5), // Simulado por ahora
        }
      })
    )

    return {
      periodo: 'Último Mes',
      fechaExportacion: new Date().toLocaleString('es-MX'),
      kpisEstrategicos: [],
      kpisTacticos: [],
      kpisOperativos,
      resumen: {
        totalVentas: Math.round(totalVentas),
        totalTiendas,
        promedioTicket: Math.round(promedioTicket * 100) / 100,
        rotacionInventario: kpisReales.rotacion_inventario,
      },
    }
  } catch (error) {
    console.error('Error al obtener datos del último mes:', error)
    return {
      periodo: 'Último Mes',
      fechaExportacion: new Date().toLocaleString('es-MX'),
      kpisEstrategicos: [],
      kpisTacticos: [],
      kpisOperativos: [],
      resumen: {
        totalVentas: 0,
        totalTiendas: 0,
        promedioTicket: 0,
        rotacionInventario: 0,
      },
    }
  }
}

/**
 * Exportar dashboard a PDF
 */
export async function exportarDashboardPDF(data: DashboardData): Promise<void> {
  try {
    // Crear contenido HTML para el PDF
    const contenido = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Dashboard KPIs - ${data.periodo}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #0F172A;
            }
            h1 {
              color: #0F172A;
              border-bottom: 3px solid #86a9ed;
              padding-bottom: 10px;
            }
            h2 {
              color: #1E293B;
              margin-top: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: #86a9ed;
            }
            th {
              background: rgba(255, 255, 255, 0.15);
              color: #0F172A;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              color: #0F172A;
            }
            .resumen {
              background: #F8FAFC;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .resumen-item {
              display: inline-block;
              margin: 10px 20px;
            }
            .resumen-label {
              font-weight: bold;
              color: #1E293B;
            }
            .resumen-valor {
              font-size: 24px;
              color: #0F172A;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>Dashboard KPIs - ${data.periodo}</h1>
          <p><strong>Fecha de Exportación:</strong> ${data.fechaExportacion}</p>
          
          <div class="resumen">
            <h2>Resumen Ejecutivo</h2>
            <div class="resumen-item">
              <div class="resumen-label">Total Ventas</div>
              <div class="resumen-valor">$${data.resumen.totalVentas.toLocaleString()}</div>
            </div>
            <div class="resumen-item">
              <div class="resumen-label">Total Tiendas</div>
              <div class="resumen-valor">${data.resumen.totalTiendas}</div>
            </div>
            <div class="resumen-item">
              <div class="resumen-label">Ticket Promedio</div>
              <div class="resumen-valor">$${data.resumen.promedioTicket.toLocaleString()}</div>
            </div>
            <div class="resumen-item">
              <div class="resumen-label">Rotación Inventario</div>
              <div class="resumen-valor">${data.resumen.rotacionInventario.toFixed(2)}%</div>
            </div>
          </div>

          <h2>KPIs Operativos por Tienda</h2>
          <table>
            <thead>
              <tr>
                <th>Tienda</th>
                <th>Tiempo Recibo (min)</th>
                <th>Tiempo Surtido (min)</th>
                <th>Ventas/Hora</th>
                <th>Unidades/Día</th>
                <th>Merma %</th>
                <th>Incidencias</th>
              </tr>
            </thead>
            <tbody>
              ${data.kpisOperativos.map(kpi => {
                const merma = typeof kpi.merma === 'string' ? kpi.merma : kpi.merma.toFixed(1)
                return `
                <tr>
                  <td>${kpi.tienda}</td>
                  <td>${kpi.tiempoRecibo}</td>
                  <td>${kpi.tiempoSurtido}</td>
                  <td>${kpi.ventasHora.toFixed(1)}</td>
                  <td>${kpi.unidadesDia}</td>
                  <td>${merma}%</td>
                  <td>${kpi.incidencias}</td>
                </tr>
              `
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    // Abrir ventana para imprimir/guardar como PDF
    const ventana = window.open('', '_blank')
    if (ventana) {
      ventana.document.write(contenido)
      ventana.document.close()
      setTimeout(() => {
        ventana.print()
      }, 250)
    }
  } catch (error) {
    console.error('Error al exportar PDF:', error)
    alert('Error al exportar el dashboard. Por favor, intenta de nuevo.')
  }
}

/**
 * Exportar dashboard a Excel (CSV)
 */
export async function exportarDashboardExcel(data: DashboardData): Promise<void> {
  try {
    // Crear contenido CSV
    let csv = 'Dashboard KPIs - ' + data.periodo + '\n'
    csv += 'Fecha de Exportación: ' + data.fechaExportacion + '\n\n'
    
    csv += 'Resumen Ejecutivo\n'
    csv += 'Total Ventas,$' + data.resumen.totalVentas.toLocaleString() + '\n'
    csv += 'Total Tiendas,' + data.resumen.totalTiendas + '\n'
    csv += 'Ticket Promedio,$' + data.resumen.promedioTicket.toLocaleString() + '\n'
    csv += 'Rotación Inventario,' + data.resumen.rotacionInventario.toFixed(2) + '%\n\n'
    
    csv += 'KPIs Operativos por Tienda\n'
    csv += 'Tienda,Tiempo Recibo (min),Tiempo Surtido (min),Ventas/Hora,Unidades/Día,Merma %,Incidencias\n'
    
    data.kpisOperativos.forEach(kpi => {
      const merma = typeof kpi.merma === 'string' ? kpi.merma : kpi.merma.toFixed(1)
      csv += `${kpi.tienda},${kpi.tiempoRecibo},${kpi.tiempoSurtido},${kpi.ventasHora.toFixed(1)},${kpi.unidadesDia},${merma}%,${kpi.incidencias}\n`
    })

    // Crear blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `dashboard_kpis_${data.periodo.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al exportar Excel:', error)
    alert('Error al exportar el dashboard. Por favor, intenta de nuevo.')
  }
}

