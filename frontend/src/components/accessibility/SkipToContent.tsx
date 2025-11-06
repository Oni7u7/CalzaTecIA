'use client'

import Link from 'next/link'

export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="skip-to-content"
      aria-label="Saltar al contenido principal"
    >
      Saltar al contenido principal
    </Link>
  )
}



