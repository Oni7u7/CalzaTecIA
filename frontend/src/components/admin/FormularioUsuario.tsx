'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Usuario } from '@/lib/orgData'
import { ESTRUCTURA_ORGANIZACIONAL } from '@/lib/orgData'
import { AlertCircle } from 'lucide-react'

const schemaFormularioUsuario = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z.string().email('Email inválido'),
  rol: z.string().min(1, 'Debe seleccionar un rol'),
  supervisor_id: z.number().nullable(),
  tienda: z.string().min(1, 'Debe especificar una tienda'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número'),
})

// Tipo extendido para incluir password en el formulario
type UsuarioConPassword = Usuario & {
  password?: string
}

interface FormularioUsuarioProps {
  usuario?: Usuario | null
  onSave: (usuario: Partial<UsuarioConPassword>) => void
  onCancel: () => void
}

export function FormularioUsuario({ usuario, onSave, onCancel }: FormularioUsuarioProps) {
  const [rolSeleccionado, setRolSeleccionado] = useState<string>('')
  const [supervisoresDisponibles, setSupervisoresDisponibles] = useState<Usuario[]>([])
  const esEdicion = !!usuario

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schemaFormularioUsuario>>({
    resolver: zodResolver(schemaFormularioUsuario),
    defaultValues: {
      nombre: usuario?.nombre || '',
      email: usuario?.email || '',
      rol: usuario?.rol || '',
      supervisor_id: usuario?.supervisor_id || null,
      tienda: usuario?.tienda || '',
      password: '',
    },
  })

  const rol = watch('rol')

  useEffect(() => {
    if (rol) {
      setRolSeleccionado(rol)
      const rolData = ESTRUCTURA_ORGANIZACIONAL.roles.find((r) => r.nombre === rol)
      if (rolData?.supervisor) {
        const supervisorRol = ESTRUCTURA_ORGANIZACIONAL.roles.find(
          (r) => r.nombre === rolData.supervisor
        )
        if (supervisorRol) {
          const supervisores = ESTRUCTURA_ORGANIZACIONAL.usuarios_demo.filter(
            (u) => u.rol === supervisorRol.nombre
          )
          setSupervisoresDisponibles(supervisores)
          if (supervisores.length > 0 && !usuario?.supervisor_id) {
            setValue('supervisor_id', supervisores[0].id)
          }
        }
      } else {
        setSupervisoresDisponibles([])
        setValue('supervisor_id', null)
      }
    }
  }, [rol, usuario, setValue])

  const onSubmit = (data: z.infer<typeof schemaFormularioUsuario>) => {
    const usuarioData: Partial<UsuarioConPassword> = {
      nombre: data.nombre,
      email: data.email,
      rol: data.rol as Usuario['rol'],
      supervisor_id: data.supervisor_id,
      tienda: data.tienda,
    }

    if (!esEdicion && data.password) {
      // En producción, esto se enviaría al backend para hashear
      usuarioData.password = data.password
    }

    onSave(usuarioData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}</CardTitle>
        <CardDescription>
          {esEdicion
            ? 'Modifica la información del usuario'
            : 'Completa el formulario para crear un nuevo usuario'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor corrige los errores en el formulario
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Nombre completo del usuario"
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="usuario@calzando.com"
              disabled={esEdicion}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rol">
                Rol <span className="text-red-500">*</span>
              </Label>
              <Select
                value={rol || ''}
                onValueChange={(value) => {
                  setValue('rol', value)
                  setRolSeleccionado(value)
                }}
              >
                <SelectTrigger id="rol">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {ESTRUCTURA_ORGANIZACIONAL.roles.map((rolOption) => (
                    <SelectItem key={rolOption.id} value={rolOption.nombre}>
                      {rolOption.nombre === 'comprador' ? 'Comprador' : rolOption.nombre.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rol && (
                <p className="text-sm text-red-600">{errors.rol.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select
                value={watch('supervisor_id')?.toString() || ''}
                onValueChange={(value) => setValue('supervisor_id', parseInt(value))}
                disabled={supervisoresDisponibles.length === 0}
              >
                <SelectTrigger id="supervisor">
                  <SelectValue placeholder="Selecciona un supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisoresDisponibles.map((supervisor) => (
                    <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                      {supervisor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {supervisoresDisponibles.length === 0 && rolSeleccionado && (
                <p className="text-sm text-gray-500">Este rol no requiere supervisor</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tienda">
              Tienda Asignada <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tienda"
              {...register('tienda')}
              placeholder="Nombre de la tienda"
            />
            {errors.tienda && (
              <p className="text-sm text-red-600">{errors.tienda.message}</p>
            )}
          </div>

          {!esEdicion && (
            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña Temporal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500">
                La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


