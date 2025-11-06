'use client'

import {
  Users,
  Store,
  Package,
  BarChart3,
  Brain,
} from 'lucide-react'
import { ModuloCard } from '@/components/admin/ModuloCard'

const modulos = [
  {
    titulo: 'Gestión de Usuarios',
    descripcion: 'Administra usuarios, roles y permisos del sistema',
    icono: Users,
    ruta: '/admin/usuarios',
  },
  {
    titulo: 'Tiendas',
    descripcion: 'Gestiona las tiendas y sucursales',
    icono: Store,
    ruta: '/admin/tiendas',
  },
  {
    titulo: 'Inventario Global',
    descripcion: 'Visualiza y gestiona el inventario de todas las tiendas',
    icono: Package,
    ruta: '/admin/inventario',
  },
  {
    titulo: 'KPIs Estratégicos',
    descripcion: 'Métricas y análisis de rendimiento',
    icono: BarChart3,
    ruta: '/admin/kpis',
  },
  {
    titulo: 'Análisis IA',
    descripcion: 'Análisis predictivo e inteligencia artificial',
    icono: Brain,
    ruta: '/admin/ia',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h1 className="admin-section-title text-2xl sm:text-3xl lg:text-4xl">
          Dashboard Administrativo
        </h1>
        <p className="admin-section-subtitle text-sm sm:text-base">
          Bienvenido a CalzaTec_IA - Gestiona todos los aspectos del sistema desde aquí
        </p>
      </div>

      {/* Módulos Principales */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full" style={{ background: 'var(--color-neutral-700)' }}></div>
          <h2 className="text-2xl font-extrabold" style={{ color: 'var(--color-neutral-100)' }}>Módulos Principales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulos.map((modulo) => (
            <ModuloCard
              key={modulo.ruta}
              titulo={modulo.titulo}
              descripcion={modulo.descripcion}
              icono={modulo.icono}
              ruta={modulo.ruta}
            />
          ))}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Total Usuarios</p>
              <p className="admin-stat-value">10</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-neutral-800)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Total Tiendas</p>
              <p className="admin-stat-value">5</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-neutral-800)' }}>
              <Store className="w-6 h-6" style={{ color: 'var(--color-green)' }} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Productos</p>
              <p className="admin-stat-value">100</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-neutral-800)' }}>
              <Package className="w-6 h-6" style={{ color: 'var(--color-teal-300)' }} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Ventas Hoy</p>
              <p className="admin-stat-value">156</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-neutral-800)' }}>
              <BarChart3 className="w-6 h-6" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
