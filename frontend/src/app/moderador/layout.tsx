'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function ModeradorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute rolEsperado="moderador">
      {children}
    </ProtectedRoute>
  )
}

