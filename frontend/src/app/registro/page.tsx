'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Rol {
  id: string
  nombre: string
  descripcion: string
}

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rolSeleccionado, setRolSeleccionado] = useState<string>('')
  const [roles, setRoles] = useState<Rol[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [success, setSuccess] = useState(false)

  // Cargar roles disponibles
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const { data, error: rolesError } = await supabase
          .from('roles')
          .select('id, nombre, descripcion')
          .order('nivel', { ascending: true })

        if (rolesError) {
          console.error('Error al cargar roles:', rolesError)
          setError('Error al cargar roles. Por favor, recarga la página.')
        } else if (data) {
          // Filtrar el rol de moderador - solo el administrador puede crear moderadores
          const rolesDisponibles = data.filter(r => r.nombre !== 'moderador')
          setRoles(rolesDisponibles)
          // Establecer cliente como rol por defecto
          const clienteRol = rolesDisponibles.find(r => r.nombre === 'cliente')
          if (clienteRol) {
            setRolSeleccionado(clienteRol.id)
          }
        }
      } catch (err) {
        console.error('Error al cargar roles:', err)
        setError('Error al cargar roles. Por favor, recarga la página.')
      } finally {
        setLoadingRoles(false)
      }
    }

    cargarRoles()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres')
      return
    }

    if (!rolSeleccionado) {
      setError('Debes seleccionar un rol')
      return
    }

    setLoading(true)

    try {
      let data: any = null
      let insertError: any = null

      // Intentar usar la función crear_solicitud_registro de PostgreSQL
      try {
        const rpcResult = await supabase.rpc('crear_solicitud_registro', {
          p_nombre: nombre,
          p_email: email,
          p_password_hash: password, // En producción debe ser hash
          p_rol_id: rolSeleccionado
        })
        
        data = rpcResult.data
        insertError = rpcResult.error

        // Si la función RPC no está disponible o hay error, usar inserción directa
        if (insertError && (insertError.message?.includes('function') || insertError.message?.includes('does not exist'))) {
          console.log('Función RPC no disponible, usando inserción directa')
          insertError = null // Resetear el error para intentar inserción directa
        }
      } catch (rpcErr: any) {
        // Si hay error en RPC, intentar inserción directa
        if (rpcErr.message?.includes('function') || rpcErr.message?.includes('does not exist')) {
          console.log('Función RPC no disponible, usando inserción directa')
        } else {
          throw rpcErr
        }
      }

      // Si RPC falló o no está disponible, usar inserción directa
      if (!data && !insertError) {
        const directResult = await supabase
          .from('solicitudes_registro')
          .insert([{
            nombre,
            email,
            password_hash: password,
            rol_id: rolSeleccionado,
            estado: 'pendiente'
          }])
          .select()
          .single()

        data = directResult.data
        insertError = directResult.error
      }

      if (insertError) {
        console.error('❌ Error completo al crear solicitud:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        })
        
        // Si el error es que la tabla no existe
        if (insertError.message?.includes('solicitudes_registro') || insertError.message?.includes('table') || insertError.message?.includes('schema cache')) {
          setError('La tabla de solicitudes no existe. Por favor, ejecuta el script SQL de configuración en Supabase primero.')
        }
        // Si el error es de RLS (Row Level Security)
        else if (insertError.message?.includes('row-level security') || insertError.message?.includes('RLS')) {
          setError('Error de permisos. Por favor, ejecuta el script SQL de configuración en Supabase para desactivar RLS.')
        } 
        // Si el error es de duplicado
        else if (insertError.code === '23505' || insertError.message?.includes('duplicate') || insertError.message?.includes('unique')) {
          setError('Este email ya está registrado. Por favor, inicia sesión o usa otro email.')
        } 
        // Si hay un mensaje de error específico
        else if (insertError.message) {
          setError(`Error: ${insertError.message}`)
        } 
        // Error genérico
        else {
          setError('Error al crear la cuenta. Por favor, ejecuta el script SQL de configuración en Supabase.')
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      setError('')
      
      // Mostrar mensaje de éxito y redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err) {
      setError('Error al crear la cuenta. Por favor, intenta de nuevo.')
      console.error('Error en registro:', err)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-neutral-950)' }}>
          <Card className="w-full max-w-md rounded-3xl shadow-2xl" style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-green)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-neutral-100)' }}>
                Solicitud Enviada
              </h2>
              <p className="text-base mb-6" style={{ color: 'var(--color-neutral-300)' }}>
                Tu solicitud de registro ha sido enviada exitosamente. 
              </p>
              <p className="text-base mb-4 font-semibold" style={{ color: 'var(--color-teal-400)' }}>
                En breve te aceptaremos la solicitud y podrás iniciar sesión.
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--color-neutral-400)' }}>
                Serás redirigido al login en unos segundos...
              </p>
              <Link href="/login">
                <Button className="w-full" style={{
                  background: 'var(--gradient-secondary)',
                  color: 'var(--color-neutral-925)'
                }}>
                  Ir al Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              Crear Nueva Cuenta
            </p>
          </div>

          {/* Formulario de Registro */}
          <Card className="rounded-3xl shadow-2xl" style={{ 
            background: 'var(--color-neutral-900)', 
            border: '1px solid var(--color-neutral-800)' 
          }}>
            <CardHeader className="p-12 pb-8">
              <CardTitle className="text-3xl font-extrabold mb-2 flex items-center gap-3" style={{ color: 'var(--color-neutral-100)' }}>
                <UserPlus className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
                Registrarse
              </CardTitle>
              <CardDescription className="font-semibold text-base" style={{ color: 'var(--color-neutral-300)' }}>
                Completa el formulario para solicitar acceso al sistema. Selecciona el rol que deseas tener.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-bold" style={{ color: 'var(--color-neutral-200)' }}>
                    Nombre Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-neutral-400)' }} />
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="pl-12 pr-4 py-3 login-input"
                      style={{ paddingLeft: '3rem' }}
                      disabled={loading}
                    />
                  </div>
                </div>

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
                      minLength={4}
                      className="pl-12 pr-4 py-3 login-input"
                      style={{ paddingLeft: '3rem' }}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold" style={{ color: 'var(--color-neutral-200)' }}>
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-neutral-400)' }} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={4}
                      className="pl-12 pr-4 py-3 login-input"
                      style={{ paddingLeft: '3rem' }}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Rol Selection */}
                <div className="space-y-2">
                  <Label htmlFor="rol" className="text-sm font-bold" style={{ color: 'var(--color-neutral-200)' }}>
                    Tipo de Usuario (Rol)
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10" style={{ color: 'var(--color-neutral-400)' }} />
                    {loadingRoles ? (
                      <div className="pl-12 pr-4 py-3 rounded-md" style={{ 
                        background: 'var(--color-neutral-800)',
                        border: '1px solid var(--color-neutral-700)',
                        color: 'var(--color-neutral-400)'
                      }}>
                        Cargando roles...
                      </div>
                    ) : (
                      <Select
                        value={rolSeleccionado}
                        onValueChange={setRolSeleccionado}
                        disabled={loading}
                      >
                        <SelectTrigger 
                          className="pl-12 pr-4 py-3 login-input"
                          style={{ paddingLeft: '3rem' }}
                        >
                          <SelectValue placeholder="Selecciona tu rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((rol) => (
                            <SelectItem key={rol.id} value={rol.id}>
                              <div className="flex flex-col">
                                <span className="font-semibold capitalize">{rol.nombre}</span>
                                <span className="text-xs opacity-70">{rol.descripcion}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                    Selecciona el tipo de usuario que deseas ser: Cliente (comprar productos), Vendedor (gestionar ventas) o Administrador (acceso completo). El rol de Moderador solo puede ser asignado por un administrador.
                  </p>
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
                  {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
                </Button>
              </form>

              {/* Link to Login */}
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-400)' }}>
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--color-teal-400)' }}>
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botón de regresar */}
          <div className="mt-6 text-center">
            <Link href="/login">
              <Button
                variant="outline"
                className="flex items-center gap-2 mx-auto"
                style={{
                  borderColor: 'var(--color-neutral-700)',
                  color: 'var(--color-neutral-300)'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar al login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

