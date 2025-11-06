export type Rol = 'admin' | 'moderador' | 'vendedor' | 'cliente' | 'comprador'

export interface Usuario {
  email: string
  password: string
  rol: Rol
  nombre: string
  ruta: string
}

export interface UsuarioAutenticado {
  email: string
  rol: Rol
  nombre: string
  ruta: string
  id?: string
  rol_id?: string | null
  tienda_id?: string | null
}


