'use client'

import { useState, useEffect } from 'react'
import { useTiendas } from '@/hooks/useTiendas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Store, MapPin, Users, TrendingUp, Package, Plus, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ESTRUCTURA_ORGANIZACIONAL } from '@/lib/orgData'

interface Tienda {
  id: number
  nombre: string
  ubicacion: string
  telefono: string
  horario: string
  gerente: string
  gerenteEmail: string
  personal: number
  estado: 'Activa' | 'Inactiva'
  ventasMes: number
  inventario: number
  rotacion: number
  fechaApertura: string
}

// Tiendas simuladas
const tiendasSimuladas: Tienda[] = [
  {
    id: 1,
    nombre: 'Calzando México - Centro',
    ubicacion: 'Ciudad de México, Centro',
    telefono: '5555-1234',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'María García',
    gerenteEmail: 'vendedor@calzando.com',
    personal: 8,
    estado: 'Activa',
    ventasMes: 450230,
    inventario: 2340,
    rotacion: 45,
    fechaApertura: '2020-01-15',
  },
  {
    id: 2,
    nombre: 'Calzando México - Sur',
    ubicacion: 'Ciudad de México, Sur',
    telefono: '5555-1235',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'Pedro Ramírez',
    gerenteEmail: 'supervisor@calzando.com',
    personal: 6,
    estado: 'Activa',
    ventasMes: 380000,
    inventario: 1890,
    rotacion: 42,
    fechaApertura: '2021-03-20',
  },
  {
    id: 3,
    nombre: 'Calzando México - Norte',
    ubicacion: 'Ciudad de México, Norte',
    telefono: '5555-1236',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'Laura Martínez',
    gerenteEmail: 'coordinador@calzando.com',
    personal: 7,
    estado: 'Activa',
    ventasMes: 320000,
    inventario: 1650,
    rotacion: 38,
    fechaApertura: '2021-06-10',
  },
  {
    id: 4,
    nombre: 'Calzando México - Plaza Satélite',
    ubicacion: 'Naucalpan, Estado de México',
    telefono: '5555-1237',
    horario: 'Lun-Dom 10:00-22:00',
    gerente: 'Ana López',
    gerenteEmail: 'gerente.nacional@calzando.com',
    personal: 10,
    estado: 'Activa',
    ventasMes: 520000,
    inventario: 2800,
    rotacion: 52,
    fechaApertura: '2022-01-05',
  },
  {
    id: 5,
    nombre: 'Calzando México - Santa Fe',
    ubicacion: 'Ciudad de México, Santa Fe',
    telefono: '5555-1238',
    horario: 'Lun-Dom 9:00-21:00',
    gerente: 'Carlos Mendoza',
    gerenteEmail: 'director@calzando.com',
    personal: 12,
    estado: 'Activa',
    ventasMes: 680000,
    inventario: 3500,
    rotacion: 58,
    fechaApertura: '2022-05-15',
  },
]

export default function TiendasPage() {
  const router = useRouter()
  const [tiendas] = useState<Tienda[]>(tiendasSimuladas)
  const [modalAbierto, setModalAbierto] = useState(false)

  const totalTiendas = tiendas.length
  const tiendasActivas = tiendas.filter((t) => t.estado === 'Activa').length
  const totalPersonal = tiendas.reduce((sum, t) => sum + t.personal, 0)
  const totalVentas = tiendas.reduce((sum, t) => sum + t.ventasMes, 0)

  const handleVerDetalles = (tienda: Tienda) => {
    router.push(`/admin/tiendas/${tienda.id}`)
  }

  const handleCrearTienda = () => {
    alert('Tienda creada exitosamente (simulado)')
    setModalAbierto(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="admin-section-title text-xl sm:text-2xl lg:text-3xl">Gestión de Tiendas</h1>
          <p className="admin-section-subtitle text-sm sm:text-base">Administra las tiendas y sucursales del sistema</p>
        </div>
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2">
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Agregar Nueva Tienda</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Agregar Nueva Tienda</DialogTitle>
              <DialogDescription className="text-sm">
                Completa el formulario para crear una nueva tienda
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Nombre de la Tienda</Label>
                <Input placeholder="Ej: Calzando México - Nueva Sucursal" className="text-sm sm:text-base" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Ubicación (Dirección Completa)</Label>
                <Input placeholder="Ciudad, Colonia, Dirección" className="text-sm sm:text-base" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="5555-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Horario</Label>
                  <Input placeholder="Lun-Dom 9:00-21:00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gerente Asignado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un gerente" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTRUCTURA_ORGANIZACIONAL.usuarios_demo
                      .filter((u) => u.rol === 'gerente_tienda')
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id.toString()}>
                          {u.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Apertura</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Estado Inicial</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="inactiva">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCrearTienda} className="w-full">
                Crear Tienda
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Total de Tiendas</p>
              <p className="admin-stat-value">{totalTiendas}</p>
            </div>
            <Store className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Tiendas Activas</p>
              <p className="admin-stat-value">{tiendasActivas}</p>
            </div>
            <Store className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Total Personal</p>
              <p className="admin-stat-value">{totalPersonal}</p>
            </div>
            <Users className="w-8 h-8" style={{ color: 'var(--color-teal-300)' }} />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Ventas Consolidadas</p>
              <p className="admin-stat-value">
                ${(totalVentas / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
          </div>
        </div>
      </div>

      {/* Grid de Tiendas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tiendas.map((tienda) => (
          <div key={tienda.id} className="admin-stat-card">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                    <Store className="w-5 h-5" style={{ color: 'var(--color-teal-400)' }} />
                    {tienda.nombre}
                  </h3>
                  <p className="font-semibold text-sm flex items-center gap-1" style={{ color: 'var(--color-neutral-300)' }}>
                    <MapPin className="w-4 h-4" />
                    {tienda.ubicacion}
                  </p>
                </div>
                <Badge
                  className="font-bold"
                  style={
                    tienda.estado === 'Activa'
                      ? {
                          background: 'rgba(0, 230, 118, 0.2)',
                          color: 'var(--color-green)',
                          border: '1px solid rgba(0, 230, 118, 0.3)'
                        }
                      : {
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }
                  }
                >
                  {tienda.estado}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Gerente:</span>
                  <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.gerente}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Personal:</span>
                  <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.personal} colaboradores</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Teléfono:</span>
                  <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.telefono}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Horario:</span>
                  <span className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.horario}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2 mb-4" style={{ borderColor: 'var(--color-neutral-800)' }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Ventas del Mes:</span>
                  <span className="font-bold" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                    ${tienda.ventasMes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Inventario:</span>
                  <span className="font-bold" style={{ color: 'var(--color-teal-400)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                    {tienda.inventario.toLocaleString()} unidades
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Rotación:</span>
                  <span className="font-bold" style={{ color: 'var(--color-teal-300)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.rotacion} días</span>
                </div>
              </div>

              <Button
                onClick={() => handleVerDetalles(tienda)}
                variant="outline"
                className="w-full flex items-center gap-2 font-bold"
              >
                <Eye className="w-4 h-4" />
                Ver Detalles
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
