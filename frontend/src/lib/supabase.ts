import { createClient } from '@supabase/supabase-js'

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window === 'undefined') {
    // En el servidor, solo mostrar warning
    console.warn(
      '⚠️ Faltan las variables de entorno de Supabase. Por favor, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local'
    )
  } else {
    // En el cliente, mostrar error más visible
    console.error(
      '❌ Faltan las variables de entorno de Supabase.\n' +
      'Por favor, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local'
    )
  }
}

// Crear el cliente de Supabase
// Si las variables no están configuradas, usar valores vacíos (fallará en runtime)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Tipos para TypeScript
export type SupabaseClient = typeof supabase

