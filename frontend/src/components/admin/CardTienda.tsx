'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Store, MapPin, Users, TrendingUp, Package, Eye } from 'lucide-react'

interface Tienda {
  id: number
  nombre: string
  ubicacion: string
  telefono: string
  horario: string
  gerente: string
  gerenteEmail: string
  personal: number
  estado: 'Activa' | 'Inactiva'
  ventasMes: number
  inventario: number
  rotacion: number
  fechaApertura: string
}

interface CardTiendaProps {
  tienda: Tienda
  onClick: () => void
}

export function CardTienda({ tienda, onClick }: CardTiendaProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              {tienda.nombre}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-2">
              <MapPin className="w-4 h-4" />
              {tienda.ubicacion}
            </CardDescription>
          </div>
          <Badge
            className={
              tienda.estado === 'Activa'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }
          >
            {tienda.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Gerente:</span>
            <span className="font-medium text-gray-900">{tienda.gerente}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Personal:</span>
            <span className="font-medium text-gray-900">{tienda.personal} colaboradores</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Teléfono:</span>
            <span className="font-medium text-gray-900">{tienda.telefono}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Horario:</span>
            <span className="font-medium text-gray-900">{tienda.horario}</span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Ventas del Mes:</span>
            <span className="font-bold text-green-600">
              ${tienda.ventasMes.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Inventario:</span>
            <span className="font-bold text-blue-600">
              {tienda.inventario.toLocaleString()} unidades
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Rotación:</span>
            <span className="font-bold text-orange-600">{tienda.rotacion} días</span>
          </div>
        </div>

        <Button variant="outline" className="w-full flex items-center gap-2" onClick={onClick}>
          <Eye className="w-4 h-4" />
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  )
}



