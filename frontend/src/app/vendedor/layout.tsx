'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Sidebar } from '@/components/vendedor/Sidebar'
import { Header } from '@/components/vendedor/Header'

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute rolEsperado="vendedor">
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: 'var(--color-neutral-925)' }}>
        <Sidebar />
        <div className="flex-1 w-full lg:ml-72 min-w-0">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden" style={{ background: 'var(--color-neutral-925)' }}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}


