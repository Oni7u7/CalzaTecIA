'use client'

import { useRouter } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ModuloCardProps {
  titulo: string
  descripcion: string
  icono: LucideIcon
  ruta: string
  className?: string
}

export function ModuloCard({ titulo, descripcion, icono: Icono, ruta, className }: ModuloCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(ruta)
  }

  return (
    <Card
      className={cn(
        "admin-stat-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full" style={{ background: 'var(--gradient-primary)' }}>
            <Icono className="w-8 h-8" style={{ color: 'var(--color-neutral-925)' }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
              {titulo}
            </h3>
            <p className="text-base font-semibold" style={{ color: 'var(--color-neutral-300)' }}>{descripcion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

