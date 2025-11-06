'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Header } from '@/components/cliente/Header'

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute rolEsperado="cliente">
      <div className="flex flex-col min-h-screen cliente-page" style={{ 
        background: 'var(--cliente-background)',
        fontFamily: 'var(--font-untitled-sans)',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}


