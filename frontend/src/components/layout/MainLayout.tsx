'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: React.ReactNode
  role?: 'admin' | 'vendedor' | 'cliente'
}

export function MainLayout({ children, role = 'admin' }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Fondo con gradiente sutil */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-900/50 pointer-events-none" />

      {/* Navbar Superior Moderno */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      {/* Sidebar Moderno */}
      <Sidebar isOpen={sidebarOpen} role={role} />

      {/* Contenido Principal */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}



