'use client'

import { useState, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { useAuth } from '@/hooks/useAuth'

interface TourGuidedProps {
  steps: Step[]
  tourKey: string
  onComplete?: () => void
}

export function TourGuided({ steps, tourKey, onComplete }: TourGuidedProps) {
  const [run, setRun] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const tourCompleted = localStorage.getItem(`tour_${tourKey}_completed`)
      if (!tourCompleted) {
        setRun(true)
      }
    }
  }, [user, tourKey])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem(`tour_${tourKey}_completed`, 'true')
      setRun(false)
      onComplete?.()
    }
  }

  if (!user) return null

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#4f46e5',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        },
        buttonNext: {
          backgroundColor: '#4f46e5',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: '600',
        },
        buttonBack: {
          color: '#4f46e5',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#6b7280',
        },
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Omitir',
      }}
    />
  )
}

// Tours predefinidos
export const tourAdmin: Step[] = [
  {
    target: 'body',
    content: '¡Bienvenido! Este es tu dashboard de administrador. Te guiaré por las principales funcionalidades.',
    placement: 'center',
  },
  {
    target: '[data-tour="entregables"]',
    content: 'Aquí están los Entregables del Hackathon. Puedes editar y descargar cada sección.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="usuarios"]',
    content: 'Gestiona usuarios, tiendas e inventario desde aquí.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="kpis"]',
    content: 'Revisa KPIs estratégicos, tácticos y operativos en tiempo real.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="ia"]',
    content: 'Usa el análisis IA para obtener insights y recomendaciones inteligentes.',
    placement: 'bottom',
  },
]

export const tourVendedor: Step[] = [
  {
    target: 'body',
    content: '¡Bienvenido! Este es tu dashboard operativo. Te mostraré las herramientas disponibles.',
    placement: 'center',
  },
  {
    target: '[data-tour="dashboard"]',
    content: 'Dashboard operativo con KPIs y métricas en tiempo real.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="perfil"]',
    content: 'Tu perfil y plan de capacitación están aquí.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="equipo"]',
    content: 'Gestiona tu equipo y supervisa su capacitación.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="inventario"]',
    content: 'Control de inventario de tu tienda.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="ventas"]',
    content: 'Registro y seguimiento de ventas.',
    placement: 'bottom',
  },
]

export const tourCliente: Step[] = [
  {
    target: 'body',
    content: '¡Bienvenido! Este es el Sistema de Punto de Venta. Te guiaré paso a paso.',
    placement: 'center',
  },
  {
    target: '[data-tour="catalogo"]',
    content: 'Catálogo de productos. Busca y filtra por categoría.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="carrito"]',
    content: 'Carrito de compras. Aquí verás los productos seleccionados.',
    placement: 'left',
  },
  {
    target: '[data-tour="procesar"]',
    content: 'Procesa la venta seleccionando el método de pago.',
    placement: 'top',
  },
  {
    target: '[data-tour="historial"]',
    content: 'Tu historial de ventas está disponible en el menú.',
    placement: 'bottom',
  },
]



