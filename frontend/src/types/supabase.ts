// Tipos de Supabase generados automáticamente
// Estos tipos se generan basándose en tu schema de base de datos
// Por ahora, usamos tipos básicos. Puedes generar tipos completos después.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nombre: string
          email: string
          password_hash: string
          rol_id: string | null
          supervisor_id: string | null
          tienda_id: string | null
          activo: boolean
          fecha_ingreso: string
          ultimo_acceso: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          password_hash: string
          rol_id?: string | null
          supervisor_id?: string | null
          tienda_id?: string | null
          activo?: boolean
          fecha_ingreso?: string
          ultimo_acceso?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          password_hash?: string
          rol_id?: string | null
          supervisor_id?: string | null
          tienda_id?: string | null
          activo?: boolean
          fecha_ingreso?: string
          ultimo_acceso?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      productos: {
        Row: {
          id: string
          sku: string
          nombre: string
          categoria: string
          subcategoria: string | null
          descripcion: string | null
          marca: string | null
          precio: number
          costo: number | null
          imagen_url: string | null
          imagenes: Json
          tallas_disponibles: Json
          colores_disponibles: Json
          materiales: Json
          especificaciones: Json
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          nombre: string
          categoria: string
          subcategoria?: string | null
          descripcion?: string | null
          marca?: string | null
          precio: number
          costo?: number | null
          imagen_url?: string | null
          imagenes?: Json
          tallas_disponibles?: Json
          colores_disponibles?: Json
          materiales?: Json
          especificaciones?: Json
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          nombre?: string
          categoria?: string
          subcategoria?: string | null
          descripcion?: string | null
          marca?: string | null
          precio?: number
          costo?: number | null
          imagen_url?: string | null
          imagenes?: Json
          tallas_disponibles?: Json
          colores_disponibles?: Json
          materiales?: Json
          especificaciones?: Json
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Agregar más tablas según necesites
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


