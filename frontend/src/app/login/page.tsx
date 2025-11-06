'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, Mail, Lock, AlertCircle, UserPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const usuario = await login(email, password)

      if (usuario) {
        console.log('✅ Login exitoso, redirigiendo a:', usuario.ruta)
        // Redirigir según el rol
        router.push(usuario.ruta)
      } else {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.')
      }
    } catch (err: any) {
      console.error('❌ Error en login:', err)
      // Manejar errores de conexión
      if (err?.message?.includes('fetch') || err?.message?.includes('Failed to fetch')) {
        setError('Error de conexión. Por favor, verifica tu conexión a internet y las credenciales de Supabase.')
      } else {
        setError('Error al iniciar sesión. Por favor, intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-neutral-950)' }}>
        <div className="w-full max-w-md">
          {/* Logo y Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2" style={{ 
              color: 'var(--color-neutral-100)',
              fontFamily: 'var(--font-family-roobert-pro)'
            }}>
              CalzaTecIA
            </h1>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-neutral-300)' }}>
              Sistema de Gestión de Calzado
            </p>
          </div>

          {/* Formulario de Login */}
          <Card className="rounded-3xl shadow-2xl" style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader className="p-12 pb-8">
              <CardTitle className="text-3xl font-extrabold mb-2 flex items-center gap-3" style={{ color: 'var(--color-neutral-100)' }}>
                <LogIn className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="font-semibold text-base" style={{ color: 'var(--color-neutral-300)' }}>
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold" style={{ color: 'var(--color-neutral-200)' }}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-neutral-400)' }} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 pr-4 py-3 login-input"
                      style={{ paddingLeft: '3rem' }}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold" style={{ color: 'var(--color-neutral-200)' }}>
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-neutral-400)' }} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-4 py-3 login-input"
                      style={{ paddingLeft: '3rem' }}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)' 
                  }}>
                    <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                    <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: 'var(--gradient-secondary)',
                    color: 'var(--color-neutral-925)',
                    fontFamily: 'var(--font-family-roobert-pro)'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              {/* Link to Register */}
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-neutral-400)' }}>
                  ¿No tienes cuenta?{' '}
                  <Link href="/registro" className="hover:opacity-80 transition-opacity font-bold" style={{ color: 'var(--color-teal-400)' }}>
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botón de regresar */}
          <div className="mt-6 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 mx-auto"
                style={{
                  borderColor: 'var(--color-neutral-700)',
                  color: 'var(--color-neutral-300)'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar al inicio
              </Button>
            </Link>
          </div>

          {/* Información adicional */}
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-400)' }}>
              ¿Necesitas ayuda? Contacta al administrador del sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
