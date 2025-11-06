'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Brain,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  role?: 'admin' | 'vendedor' | 'cliente'
}

const navigationAdmin = [
  {
    name: 'Dashboard',
    icon: Home,
    path: '/admin',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    name: 'Entregables',
    icon: FileText,
    path: '/admin/entregables',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10',
  },
  {
    name: 'Usuarios',
    icon: Users,
    path: '/admin/usuarios',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-500/10',
  },
  {
    name: 'Tiendas',
    icon: Package,
    path: '/admin/tiendas',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-500/10',
  },
  {
    name: 'Inventario',
    icon: Package,
    path: '/admin/inventario',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
  },
  {
    name: 'KPIs',
    icon: BarChart3,
    path: '/admin/kpis',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    name: 'IA Assistant',
    icon: Brain,
    path: '/admin/ia',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    badge: 'NEW',
    highlight: true,
  },
  {
    name: 'Configuración',
    icon: Settings,
    path: '/admin/configuracion',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-500/10',
  },
]

const navigationVendedor = [
  { name: 'Dashboard', icon: Home, path: '/vendedor', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-500/10' },
  { name: 'Mi Perfil', icon: Users, path: '/vendedor/perfil', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
  { name: 'Inventario', icon: Package, path: '/vendedor/inventario', color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-500/10' },
  { name: 'Ventas', icon: ShoppingCart, path: '/vendedor/ventas', color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-500/10' },
  { name: 'Mi Equipo', icon: Users, path: '/vendedor/equipo', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-500/10' },
  { name: 'Capacitación', icon: BookOpen, path: '/vendedor/perfil', color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-500/10', badge: '3' },
  { name: 'Reportes', icon: FileText, path: '/vendedor/reportes', color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-500/10' },
]

export function Sidebar({ isOpen, role = 'admin' }: SidebarProps) {
  const pathname = usePathname()
  const navigation = role === 'admin' ? navigationAdmin : navigationVendedor

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 z-40 transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}
        backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-r border-gray-200 dark:border-slate-700
      `}
    >
      <nav className="p-3 space-y-1 h-full overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-semibold',
                isActive
                  ? `${item.bgColor} ${item.color} shadow-md`
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300',
                item.highlight && 'ring-2 ring-violet-500/50'
              )}
            >
              {/* Indicador de activo */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                />
              )}

              {/* Icono */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl transition-all group-hover:scale-110',
                  isActive ? item.bgColor : 'bg-gray-100 dark:bg-slate-800'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? item.color : 'text-gray-600 dark:text-gray-400')} />
              </div>

              {/* Texto */}
              {isOpen && (
                <>
                  <div className="flex-1">
                    <span className={cn('font-medium', isActive ? item.color : 'text-gray-700 dark:text-gray-300')}>
                      {item.name}
                    </span>
                  </div>

                  {/* Badge */}
                  {'badge' in item && item.badge && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                        item.badge === 'NEW'
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Arrow */}
                  {isActive && <ChevronRight className={cn('w-4 h-4', item.color)} />}
                </>
              )}

              {/* Tooltip para sidebar colapsado */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                  {'badge' in item && item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">{item.badge}</span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}



