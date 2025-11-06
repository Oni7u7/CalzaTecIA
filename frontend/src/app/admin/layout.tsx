'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute rolEsperado="admin">
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: 'var(--color-neutral-925)' }}>
        <Sidebar />
        <div className="flex-1 w-full lg:ml-72 min-w-0">
          <Header />
          <main className="admin-content px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-full overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

