import { Competencia } from './competencias'

export interface EstadoCapacitacion {
  competencia_id: number
  estado: 'pendiente' | 'en_proceso' | 'completada'
  progreso: number
  fecha_inicio?: string
  fecha_completado?: string
  comentarios: string[]
  fecha_ultima_evaluacion?: string
  prioritaria?: boolean
}

export interface HistorialCapacitacion {
  id: string
  colaborador_id: number
  supervisor_id: number
  competencia_id: number
  accion: 'iniciada' | 'progreso' | 'completada' | 'comentario' | 'asignada'
  fecha: string
  comentario?: string
  progreso_anterior?: number
  progreso_nuevo?: number
}

export function obtenerEstadoCapacitacion(userId: number): Record<number, EstadoCapacitacion> {
  if (typeof window === 'undefined') return {}
  
  const key = `capacitacion_${userId}`
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(data)
  }
  return {}
}

export function guardarEstadoCapacitacion(userId: number, estado: Record<number, EstadoCapacitacion>): void {
  if (typeof window === 'undefined') return
  
  const key = `capacitacion_${userId}`
  localStorage.setItem(key, JSON.stringify(estado))
}

export function calcularProgresoGeneral(
  competencias: Competencia[],
  estadoCapacitacion: Record<number, EstadoCapacitacion>
): number {
  if (competencias.length === 0) return 0

  let totalPonderado = 0
  let totalPeso = 0

  competencias.forEach((competencia) => {
    const estado = estadoCapacitacion[competencia.id]
    const peso = competencia.obligatoria ? 2 : 1 // Obligatorias tienen doble peso
    
    if (estado) {
      if (estado.estado === 'completada') {
        totalPonderado += 100 * peso
      } else if (estado.estado === 'en_proceso') {
        totalPonderado += estado.progreso * peso
      }
    }
    totalPeso += peso
  })

  return totalPeso > 0 ? Math.round(totalPonderado / totalPeso) : 0
}

export function obtenerProgresoPorCompetencia(
  competenciaId: number,
  estadoCapacitacion: Record<number, EstadoCapacitacion>
): EstadoCapacitacion | null {
  return estadoCapacitacion[competenciaId] || null
}

export function actualizarEstadoCompetencia(
  userId: number,
  competenciaId: number,
  actualizacion: Partial<EstadoCapacitacion>
): void {
  const estadoActual = obtenerEstadoCapacitacion(userId)
  const estadoCompetencia = estadoActual[competenciaId] || {
    competencia_id: competenciaId,
    estado: 'pendiente' as const,
    progreso: 0,
    comentarios: [],
  }

  // Mantener comentarios existentes si no se proporcionan nuevos
  const comentarios = actualizacion.comentarios !== undefined
    ? actualizacion.comentarios
    : estadoCompetencia.comentarios

  estadoActual[competenciaId] = {
    ...estadoCompetencia,
    ...actualizacion,
    competencia_id: competenciaId,
    comentarios,
  }

  guardarEstadoCapacitacion(userId, estadoActual)
}

export function agregarComentario(
  userId: number,
  competenciaId: number,
  comentario: string,
  supervisorId: number
): void {
  const estado = obtenerEstadoCapacitacion(userId)
  const competencia = estado[competenciaId]

  if (competencia) {
    competencia.comentarios.push(comentario)
    competencia.fecha_ultima_evaluacion = new Date().toISOString()
    guardarEstadoCapacitacion(userId, estado)
    registrarHistorial(userId, supervisorId, competenciaId, 'comentario', comentario)
  }
}

export function obtenerHistorialCapacitacion(userId: number): HistorialCapacitacion[] {
  if (typeof window === 'undefined') return []
  
  const key = `historial_capacitacion_${userId}`
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(data)
  }
  return []
}

export function registrarHistorial(
  colaboradorId: number,
  supervisorId: number,
  competenciaId: number,
  accion: HistorialCapacitacion['accion'],
  comentario?: string,
  progresoAnterior?: number,
  progresoNuevo?: number
): void {
  if (typeof window === 'undefined') return
  
  const historial = obtenerHistorialCapacitacion(colaboradorId)
  const nuevoRegistro: HistorialCapacitacion = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    colaborador_id: colaboradorId,
    supervisor_id: supervisorId,
    competencia_id: competenciaId,
    accion,
    fecha: new Date().toISOString(),
    comentario,
    progreso_anterior: progresoAnterior,
    progreso_nuevo: progresoNuevo,
  }

  historial.push(nuevoRegistro)
  const key = `historial_capacitacion_${colaboradorId}`
  localStorage.setItem(key, JSON.stringify(historial))
}

export function inicializarDatosEjemplo(userId: number, rol: string): void {
  if (typeof window === 'undefined') return
  
  const key = `capacitacion_${userId}`
  const existe = localStorage.getItem(key)
  if (existe) return // Ya existe, no inicializar

  // Datos de ejemplo según el rol
  const datosEjemplo: Record<number, EstadoCapacitacion> = {}

  if (rol === 'asistente_operativo' || rol === 'cliente') {
    // 2 completadas, 3 en proceso, 1 pendiente
    datosEjemplo[43] = {
      competencia_id: 43,
      estado: 'completada',
      progreso: 100,
      fecha_inicio: '2024-01-15',
      fecha_completado: '2024-02-20',
      comentarios: [],
    }
    datosEjemplo[44] = {
      competencia_id: 44,
      estado: 'completada',
      progreso: 100,
      fecha_inicio: '2024-01-15',
      fecha_completado: '2024-02-25',
      comentarios: [],
    }
    datosEjemplo[45] = {
      competencia_id: 45,
      estado: 'en_proceso',
      progreso: 30,
      fecha_inicio: '2024-03-01',
      comentarios: [],
    }
    datosEjemplo[46] = {
      competencia_id: 46,
      estado: 'en_proceso',
      progreso: 60,
      fecha_inicio: '2024-02-15',
      comentarios: [],
    }
    datosEjemplo[47] = {
      competencia_id: 47,
      estado: 'en_proceso',
      progreso: 85,
      fecha_inicio: '2024-02-01',
      comentarios: [],
    }
    datosEjemplo[48] = {
      competencia_id: 48,
      estado: 'pendiente',
      progreso: 0,
      comentarios: [],
    }
  } else if (rol === 'gerente_tienda' || rol === 'vendedor') {
    // Datos de ejemplo para gerente de tienda
    datosEjemplo[12] = {
      competencia_id: 12,
      estado: 'completada',
      progreso: 100,
      fecha_inicio: '2024-01-01',
      fecha_completado: '2024-03-15',
      comentarios: [],
    }
    datosEjemplo[13] = {
      competencia_id: 13,
      estado: 'completada',
      progreso: 100,
      fecha_inicio: '2024-01-01',
      fecha_completado: '2024-03-20',
      comentarios: [],
    }
    datosEjemplo[14] = {
      competencia_id: 14,
      estado: 'en_proceso',
      progreso: 60,
      fecha_inicio: '2024-02-15',
      comentarios: [],
    }
    datosEjemplo[15] = {
      competencia_id: 15,
      estado: 'completada',
      progreso: 100,
      fecha_inicio: '2024-01-01',
      fecha_completado: '2024-02-28',
      comentarios: [],
    }
    datosEjemplo[16] = {
      competencia_id: 16,
      estado: 'en_proceso',
      progreso: 40,
      fecha_inicio: '2024-03-01',
      comentarios: [],
    }
    datosEjemplo[17] = {
      competencia_id: 17,
      estado: 'completada',
      progreso: 100,
      fecha_inicio: '2024-01-01',
      fecha_completado: '2024-03-10',
      comentarios: [],
    }
  }

  guardarEstadoCapacitacion(userId, datosEjemplo)
}

