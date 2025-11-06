export interface Competencia {
  id: number
  nombre: string
  descripcion: string
  obligatoria: boolean
}

export const COMPETENCIAS_POR_ROL: Record<string, Competencia[]> = {
  admin: [
    {
      id: 1,
      nombre: 'Gestión estratégica',
      descripcion: 'Planificación y estrategia corporativa',
      obligatoria: true,
    },
    {
      id: 2,
      nombre: 'Administración de sistemas',
      descripcion: 'Manejo de plataformas tecnológicas',
      obligatoria: true,
    },
    {
      id: 3,
      nombre: 'Análisis de datos',
      descripcion: 'Interpretación de métricas y KPIs',
      obligatoria: true,
    },
  ],

  director_nacional: [
    {
      id: 4,
      nombre: 'Liderazgo ejecutivo',
      descripcion: 'Dirección de equipos y operaciones',
      obligatoria: true,
    },
    {
      id: 5,
      nombre: 'Análisis financiero',
      descripcion: 'Evaluación de resultados económicos',
      obligatoria: true,
    },
    {
      id: 6,
      nombre: 'Planeación estratégica',
      descripcion: 'Diseño de estrategias de expansión',
      obligatoria: true,
    },
    {
      id: 7,
      nombre: 'Gestión de cambio',
      descripcion: 'Implementación de transformaciones',
      obligatoria: false,
    },
  ],

  gerente_nacional: [
    {
      id: 8,
      nombre: 'Gestión regional',
      descripcion: 'Coordinación de múltiples tiendas',
      obligatoria: true,
    },
    {
      id: 9,
      nombre: 'Control presupuestal',
      descripcion: 'Administración de recursos',
      obligatoria: true,
    },
    {
      id: 10,
      nombre: 'Desarrollo de equipos',
      descripcion: 'Capacitación y mentoría',
      obligatoria: true,
    },
    {
      id: 11,
      nombre: 'Análisis de mercado',
      descripcion: 'Estudio de competencia y tendencias',
      obligatoria: false,
    },
  ],

  gerente_tienda: [
    {
      id: 12,
      nombre: 'Gestión de personal',
      descripcion: 'Supervisión de equipos de tienda',
      obligatoria: true,
    },
    {
      id: 13,
      nombre: 'Manejo de sistema de inventarios',
      descripcion: 'Control de stock y productos',
      obligatoria: true,
    },
    {
      id: 14,
      nombre: 'Técnicas de ventas avanzadas',
      descripcion: 'Estrategias de cierre y upselling',
      obligatoria: true,
    },
    {
      id: 15,
      nombre: 'Control de merma',
      descripcion: 'Prevención y gestión de pérdidas',
      obligatoria: true,
    },
    {
      id: 16,
      nombre: 'Análisis de KPIs',
      descripcion: 'Interpretación de métricas operativas',
      obligatoria: true,
    },
    {
      id: 17,
      nombre: 'Atención al cliente',
      descripcion: 'Resolución de quejas y fidelización',
      obligatoria: true,
    },
  ],

  supervisor_operaciones: [
    {
      id: 18,
      nombre: 'Coordinación de recepción de mercancía',
      descripcion: 'Procesos de recibo',
      obligatoria: true,
    },
    {
      id: 19,
      nombre: 'Supervisión de surtido al piso',
      descripcion: 'Gestión de abastecimiento',
      obligatoria: true,
    },
    {
      id: 20,
      nombre: 'Gestión de inventarios de bodega',
      descripcion: 'Control de almacén',
      obligatoria: true,
    },
    {
      id: 21,
      nombre: 'Control de tiempos operativos',
      descripcion: 'Optimización de procesos',
      obligatoria: true,
    },
    {
      id: 22,
      nombre: 'Manejo de incidencias',
      descripcion: 'Resolución de problemas operativos',
      obligatoria: true,
    },
  ],

  coordinador_piso: [
    {
      id: 23,
      nombre: 'Gestión de exhibición y promociones',
      descripcion: 'Visual merchandising',
      obligatoria: true,
    },
    {
      id: 24,
      nombre: 'Supervisión de vendedores',
      descripcion: 'Coaching de equipo de ventas',
      obligatoria: true,
    },
    {
      id: 25,
      nombre: 'Análisis de métricas de ventas',
      descripcion: 'Seguimiento de resultados',
      obligatoria: true,
    },
    {
      id: 26,
      nombre: 'Capacitación de equipo de ventas',
      descripcion: 'Entrenamiento continuo',
      obligatoria: true,
    },
  ],

  encargado_bodega: [
    {
      id: 27,
      nombre: 'Manejo de sistema de inventarios',
      descripcion: 'Software de control',
      obligatoria: true,
    },
    {
      id: 28,
      nombre: 'Técnicas de almacenamiento FIFO',
      descripcion: 'Primeras entradas, primeras salidas',
      obligatoria: true,
    },
    {
      id: 29,
      nombre: 'Control de merma y productos dañados',
      descripcion: 'Prevención de pérdidas',
      obligatoria: true,
    },
    {
      id: 30,
      nombre: 'Conteos cíclicos de inventario',
      descripcion: 'Auditorías periódicas',
      obligatoria: true,
    },
    {
      id: 31,
      nombre: 'Seguridad en bodega',
      descripcion: 'Protocolos de seguridad',
      obligatoria: true,
    },
    {
      id: 32,
      nombre: 'Uso de lector de código de barras',
      descripcion: 'Tecnología de escaneo',
      obligatoria: true,
    },
    {
      id: 33,
      nombre: 'Organización de ubicaciones',
      descripcion: 'Optimización de espacios',
      obligatoria: true,
    },
    {
      id: 34,
      nombre: 'Gestión de transferencias entre tiendas',
      descripcion: 'Movimientos de inventario',
      obligatoria: true,
    },
  ],

  encargado_seguridad: [
    {
      id: 35,
      nombre: 'Monitoreo de incidencias',
      descripcion: 'Vigilancia de seguridad',
      obligatoria: true,
    },
    {
      id: 36,
      nombre: 'Reportes de pérdidas',
      descripcion: 'Documentación de incidentes',
      obligatoria: true,
    },
    {
      id: 37,
      nombre: 'Control de accesos',
      descripcion: 'Gestión de entradas y salidas',
      obligatoria: true,
    },
    {
      id: 38,
      nombre: 'Auditorías de seguridad',
      descripcion: 'Inspecciones periódicas',
      obligatoria: true,
    },
  ],

  lider_ventas: [
    {
      id: 39,
      nombre: 'Cumplimiento de metas de ventas',
      descripcion: 'Alcance de objetivos',
      obligatoria: true,
    },
    {
      id: 40,
      nombre: 'Gestión de clientes',
      descripcion: 'Atención y fidelización',
      obligatoria: true,
    },
    {
      id: 41,
      nombre: 'Supervisión de asistentes',
      descripcion: 'Apoyo a vendedores',
      obligatoria: true,
    },
    {
      id: 42,
      nombre: 'Elaboración de reportes de ventas',
      descripcion: 'Análisis de resultados',
      obligatoria: true,
    },
  ],

  asistente_operativo: [
    {
      id: 43,
      nombre: 'Uso del sistema POS',
      descripcion: 'Operación de punto de venta',
      obligatoria: true,
    },
    {
      id: 44,
      nombre: 'Consulta de inventario',
      descripcion: 'Verificación de disponibilidad',
      obligatoria: true,
    },
    {
      id: 45,
      nombre: 'Atención al cliente',
      descripcion: 'Servicio de calidad',
      obligatoria: true,
    },
    {
      id: 46,
      nombre: 'Registro de ventas',
      descripcion: 'Procesamiento de transacciones',
      obligatoria: true,
    },
    {
      id: 47,
      nombre: 'Conocimiento de productos',
      descripcion: 'Información de calzado',
      obligatoria: true,
    },
    {
      id: 48,
      nombre: 'Manejo de devoluciones',
      descripcion: 'Procesos de cambios',
      obligatoria: true,
    },
  ],
}

export function obtenerCompetenciasPorRol(rol: string): Competencia[] {
  return COMPETENCIAS_POR_ROL[rol] || []
}



