'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User,
  Package,
  ShoppingCart,
  Users,
  Truck,
  FileText,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/vendedor' },
  { icon: User, label: 'Mi Perfil', href: '/vendedor/perfil' },
  { icon: Package, label: 'Inventario', href: '/vendedor/inventario' },
  { icon: ShoppingCart, label: 'Ventas', href: '/vendedor/ventas' },
  { icon: Users, label: 'Mi Equipo', href: '/vendedor/equipo' },
  { icon: Truck, label: 'Recepciones', href: '/vendedor/recepciones' },
  { icon: FileText, label: 'Reportes', href: '/vendedor/reportes' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
        style={{ background: 'var(--gradient-secondary)' }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" style={{ color: 'var(--color-neutral-925)' }} /> : <Menu className="w-6 h-6" style={{ color: 'var(--color-neutral-925)' }} />}
      </button>

      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 z-40 transition-transform duration-300 shadow-lg",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: 'var(--color-neutral-900)', borderRight: '1px solid var(--color-neutral-800)' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b" style={{ borderColor: 'var(--color-neutral-800)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{ background: 'var(--gradient-secondary)' }}
              >
                <Zap className="w-5 h-5" style={{ color: 'var(--color-neutral-925)' }} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold whitespace-nowrap" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  CalzaTec_IA
                </h2>
                <p className="text-xs whitespace-nowrap" style={{ color: 'var(--color-neutral-300)' }}>Powered by AI</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b" style={{ borderColor: 'var(--color-neutral-800)' }}>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-neutral-100)' }}>{user.nombre}</p>
              <p className="text-xs capitalize truncate" style={{ color: 'var(--color-neutral-300)' }}>{user.rol}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/vendedor' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm",
                    "hover:scale-105 hover:shadow-lg"
                  )}
                  style={{
                    background: isActive ? 'var(--gradient-secondary)' : 'transparent',
                    color: isActive ? 'var(--color-neutral-925)' : 'var(--color-neutral-300)',
                    borderLeft: isActive ? '3px solid var(--color-green)' : 'none',
                    boxShadow: isActive ? '0 4px 14px rgba(35, 247, 221, 0.3)' : 'none'
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

