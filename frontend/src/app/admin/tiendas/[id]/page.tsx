'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Store, MapPin, Users, TrendingUp, Package, Edit, ArrowLeft } from 'lucide-react'

// Datos simulados de tienda (en producción vendría de una API)
const datosTienda = {
  id: 1,
  nombre: 'Calzando México - Centro',
  ubicacion: 'Ciudad de México, Centro',
  direccion: 'Av. Juárez 123, Col. Centro, CDMX',
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
  personalAsignado: [
    { id: 1, nombre: 'Pedro Ramírez', rol: 'supervisor_operaciones', email: 'supervisor@calzando.com' },
    { id: 2, nombre: 'Laura Martínez', rol: 'coordinador_piso', email: 'coordinador@calzando.com' },
    { id: 3, nombre: 'José Hernández', rol: 'encargado_bodega', email: 'bodega@calzando.com' },
    { id: 4, nombre: 'Roberto Díaz', rol: 'encargado_seguridad', email: 'seguridad@calzando.com' },
    { id: 5, nombre: 'Sofía Torres', rol: 'lider_ventas', email: 'lider@calzando.com' },
    { id: 6, nombre: 'Juan Pérez', rol: 'asistente_operativo', email: 'cliente@calzando.com' },
  ],
}

export default function TiendaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const tiendaId = params.id
  const [tienda] = useState(datosTienda)

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/tiendas')}
            style={{ color: 'var(--color-neutral-300)' }}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.nombre}</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base truncate" style={{ color: 'var(--color-neutral-300)' }}>{tienda.ubicacion}</p>
          </div>
        </div>
        <Button 
          className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-shrink-0"
          style={{ 
            background: 'var(--gradient-secondary)',
            color: 'var(--color-neutral-925)',
            boxShadow: '0 4px 14px rgba(35, 247, 221, 0.3)'
          }}
        >
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Editar Tienda</span>
          <span className="sm:hidden">Editar</span>
        </Button>
      </div>

      {/* Información General */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="admin-stat-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Ventas del Mes</p>
                <p className="admin-stat-value mt-1" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  ${tienda.ventasMes.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Inventario</p>
                <p className="admin-stat-value mt-1" style={{ color: 'var(--color-teal-400)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {tienda.inventario.toLocaleString()} unidades
                </p>
              </div>
              <Package className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Personal</p>
                <p className="admin-stat-value mt-1" style={{ color: 'var(--color-teal-300)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {tienda.personal} colaboradores
                </p>
              </div>
              <Users className="w-8 h-8" style={{ color: 'var(--color-teal-300)' }} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Rotación</p>
                <p className="admin-stat-value mt-1" style={{ color: 'var(--color-teal-400)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.rotacion} días</p>
              </div>
              <Package className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList 
          className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2"
          style={{ 
            background: 'var(--color-neutral-800)',
            border: '1px solid var(--color-neutral-700)'
          }}
        >
          <TabsTrigger 
            value="informacion"
            className="text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)',
              fontWeight: 600
            }}
          >
            <span className="hidden sm:inline">Información</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger 
            value="personal"
            className="text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)',
              fontWeight: 600
            }}
          >
            Personal
          </TabsTrigger>
          <TabsTrigger 
            value="inventario"
            className="text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)',
              fontWeight: 600
            }}
          >
            Inventario
          </TabsTrigger>
          <TabsTrigger 
            value="desempeno"
            className="text-xs sm:text-sm px-2 sm:px-4 py-2"
            style={{ 
              color: 'var(--color-neutral-300)',
              fontFamily: 'var(--font-family-roobert-pro)',
              fontWeight: 600
            }}
          >
            <span className="hidden sm:inline">Desempeño</span>
            <span className="sm:hidden">KPI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="mt-4 sm:mt-6">
          <div className="admin-stat-card">
            <div className="p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Información Completa de la Tienda</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Nombre</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Estado</p>
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
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Ubicación</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.ubicacion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Dirección</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.direccion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Teléfono</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Horario</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.horario}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Gerente</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.gerente}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Fecha de Apertura</p>
                    <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                      {new Date(tienda.fechaApertura).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-4 sm:mt-6">
          <div className="admin-stat-card">
            <div className="p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl mb-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Personal Asignado</h3>
              <p className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Lista de colaboradores de esta tienda</p>
              <div className="space-y-3">
                {tienda.personalAsignado.map((persona) => (
                  <div
                    key={persona.id}
                    className="flex items-center justify-between p-4 rounded-lg transition-colors"
                    style={{ 
                      background: 'var(--color-neutral-800)',
                      border: '1px solid var(--color-neutral-700)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-neutral-700)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-neutral-800)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--gradient-secondary)' }}
                      >
                        <Users className="w-5 h-5" style={{ color: 'var(--color-neutral-925)' }} />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>{persona.nombre}</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>{persona.email}</p>
                        <Badge 
                          className="mt-1 text-xs capitalize font-bold"
                          style={{
                            background: 'rgba(35, 247, 221, 0.2)',
                            color: 'var(--color-teal-400)',
                            border: '1px solid rgba(35, 247, 221, 0.3)'
                          }}
                        >
                          {persona.rol.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs sm:text-sm px-2 sm:px-3"
                      style={{
                        background: 'var(--color-neutral-800)',
                        border: '1px solid var(--color-neutral-700)',
                        color: 'var(--color-neutral-100)'
                      }}
                    >
                      <span className="hidden sm:inline">Ver Perfil</span>
                      <span className="sm:hidden">Ver</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventario" className="mt-4 sm:mt-6">
          <div className="admin-stat-card">
            <div className="p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl mb-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Inventario de la Tienda</h3>
              <p className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Resumen de productos en esta tienda</p>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      background: 'rgba(35, 247, 221, 0.1)',
                      border: '1px solid rgba(35, 247, 221, 0.3)'
                    }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Total de Productos</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-teal-400)', fontFamily: 'var(--font-family-roobert-pro)' }}>1,234</p>
                  </div>
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      background: 'rgba(0, 230, 118, 0.1)',
                      border: '1px solid rgba(0, 230, 118, 0.3)'
                    }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Valor Total</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>$2,340,000</p>
                  </div>
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      background: 'rgba(35, 247, 221, 0.1)',
                      border: '1px solid rgba(35, 247, 221, 0.3)'
                    }}
                  >
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-neutral-300)' }}>Días de Cobertura</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-teal-300)', fontFamily: 'var(--font-family-roobert-pro)' }}>{tienda.rotacion}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-center py-4" style={{ color: 'var(--color-neutral-300)' }}>
                  Tabla completa de inventario disponible en el módulo de Inventario Global
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="desempeno" className="mt-4 sm:mt-6">
          <div className="admin-stat-card">
            <div className="p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl mb-2" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Gráficas de Desempeño</h3>
              <p className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: 'var(--color-neutral-300)' }}>Historial de ventas y métricas de la tienda</p>
              <div className="space-y-4">
                <div 
                  className="p-8 rounded-lg text-center"
                  style={{ 
                    background: 'var(--color-neutral-800)',
                    border: '1px solid var(--color-neutral-700)'
                  }}
                >
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-teal-400)' }} />
                  <p className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>
                    Gráficas de desempeño (simulado - en producción mostraría gráficas reales)
                  </p>
                </div>
                <div 
                  className="p-8 rounded-lg text-center"
                  style={{ 
                    background: 'var(--color-neutral-800)',
                    border: '1px solid var(--color-neutral-700)'
                  }}
                >
                  <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-teal-400)' }} />
                  <p className="font-semibold" style={{ color: 'var(--color-neutral-300)' }}>
                    Historial de ventas (simulado - en producción mostraría historial real)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


