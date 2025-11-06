'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Monitor, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function PresentationMode() {
  const { user } = useAuth()
  const [isPresentacion, setIsPresentacion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('presentation_mode')
      setIsPresentacion(saved === 'true')
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isPresentacion) {
        document.documentElement.classList.add('presentation-mode')
        localStorage.setItem('presentation_mode', 'true')
      } else {
        document.documentElement.classList.remove('presentation-mode')
        localStorage.removeItem('presentation_mode')
      }
    }
  }, [isPresentacion])

  const togglePresentacion = () => {
    setIsPresentacion(!isPresentacion)
    if (!isPresentacion) {
      // Solicitar pantalla completa
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error('Error al solicitar pantalla completa:', err)
        })
      }
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Solo mostrar para admin
  if (!user || user.rol !== 'admin') return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={togglePresentacion}
      className="flex items-center gap-2"
      aria-label="Modo presentación"
    >
      {isPresentacion ? (
        <>
          <X className="w-4 h-4" />
          Salir de Presentación
        </>
      ) : (
        <>
          <Monitor className="w-4 h-4" />
          Modo Presentación
        </>
      )}
    </Button>
  )
}

// Estilos CSS para modo presentación
export const presentationStyles = `
.presentation-mode {
  font-size: 1.25rem !important;
}

.presentation-mode .no-presentation {
  display: none !important;
}

.presentation-mode button[aria-label*="Eliminar"],
.presentation-mode button[aria-label*="Delete"],
.presentation-mode button[aria-label*="Eliminar"] {
  opacity: 0.3 !important;
  pointer-events: none !important;
}

.presentation-mode .card {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
}

.presentation-mode h1 {
  font-size: 3rem !important;
}

.presentation-mode h2 {
  font-size: 2.5rem !important;
}

.presentation-mode h3 {
  font-size: 2rem !important;
}
`



