export interface Rol {
  id: number
  nombre: string
  supervisor: string | null
  nivel: number
}

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: string
  supervisor_id: number | null
  tienda: string
}

export const ESTRUCTURA_ORGANIZACIONAL = {
  roles: [
    { id: 1, nombre: 'admin', supervisor: null, nivel: 1 },
    { id: 2, nombre: 'director_nacional', supervisor: 'admin', nivel: 2 },
    { id: 3, nombre: 'gerente_nacional', supervisor: 'director_nacional', nivel: 3 },
    { id: 4, nombre: 'gerente_tienda', supervisor: 'gerente_nacional', nivel: 4 },
    { id: 5, nombre: 'supervisor_operaciones', supervisor: 'gerente_tienda', nivel: 5 },
    { id: 6, nombre: 'coordinador_piso', supervisor: 'gerente_tienda', nivel: 5 },
    { id: 7, nombre: 'encargado_bodega', supervisor: 'supervisor_operaciones', nivel: 6 },
    { id: 8, nombre: 'encargado_seguridad', supervisor: 'gerente_tienda', nivel: 5 },
    { id: 9, nombre: 'lider_ventas', supervisor: 'coordinador_piso', nivel: 6 },
    { id: 10, nombre: 'asistente_operativo', supervisor: 'lider_ventas', nivel: 7 },
    { id: 11, nombre: 'comprador', supervisor: null, nivel: 8 },
  ] as Rol[],

  usuarios_demo: [
    {
      id: 1,
      nombre: 'Administrador General',
      email: 'admin@calzatec.com',
      rol: 'admin',
      supervisor_id: null,
      tienda: 'Corporativo',
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza',
      email: 'director@calzatec.com',
      rol: 'director_nacional',
      supervisor_id: 1,
      tienda: 'Corporativo',
    },
    {
      id: 3,
      nombre: 'Ana López',
      email: 'gerente.nacional@calzatec.com',
      rol: 'gerente_nacional',
      supervisor_id: 2,
      tienda: 'Región Centro',
    },
    {
      id: 4,
      nombre: 'María García',
      email: 'vendedor@calzatec.com',
      rol: 'gerente_tienda',
      supervisor_id: 3,
      tienda: 'Calzando México - Centro',
    },
    {
      id: 5,
      nombre: 'Pedro Ramírez',
      email: 'supervisor@calzatec.com',
      rol: 'supervisor_operaciones',
      supervisor_id: 4,
      tienda: 'Calzando México - Centro',
    },
    {
      id: 6,
      nombre: 'Laura Martínez',
      email: 'coordinador@calzatec.com',
      rol: 'coordinador_piso',
      supervisor_id: 4,
      tienda: 'Calzando México - Centro',
    },
    {
      id: 7,
      nombre: 'José Hernández',
      email: 'bodega@calzatec.com',
      rol: 'encargado_bodega',
      supervisor_id: 5,
      tienda: 'Calzando México - Centro',
    },
    {
      id: 8,
      nombre: 'Roberto Díaz',
      email: 'seguridad@calzatec.com',
      rol: 'encargado_seguridad',
      supervisor_id: 4,
      tienda: 'Calzando México - Centro',
    },
    {
      id: 9,
      nombre: 'Sofía Torres',
      email: 'lider@calzatec.com',
      rol: 'lider_ventas',
      supervisor_id: 6,
      tienda: 'Calzando México - Centro',
    },
    {
      id: 10,
      nombre: 'Juan Pérez',
      email: 'cliente@calzatec.com',
      rol: 'asistente_operativo',
      supervisor_id: 9,
      tienda: 'Calzando México - Centro',
    },
  ] as Usuario[],
}

export function obtenerUsuarioPorEmail(email: string): Usuario | undefined {
  return ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.find((u) => u.email === email)
}

export function obtenerSupervisor(usuario: Usuario): Usuario | undefined {
  if (!usuario.supervisor_id) return undefined
  return ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.find((u) => u.id === usuario.supervisor_id)
}

export function obtenerColaboradores(usuarioId: number): Usuario[] {
  return ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.filter((u) => u.supervisor_id === usuarioId)
}

export function obtenerRolPorNombre(nombreRol: string): Rol | undefined {
  return ESTRUCTURA_ORGANIZACIONAL.roles.find((r) => r.nombre === nombreRol)
}

