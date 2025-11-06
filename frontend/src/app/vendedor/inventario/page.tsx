'use client'

import { useState, useEffect } from 'react'
import { TablaInventario } from '@/components/vendedor/TablaInventario'
import { useInventarioTienda } from '@/hooks/useInventario'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Plus, AlertTriangle, TrendingUp } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Datos simulados
const productosSimulados = [
  {
    sku: 'SKU-001',
    producto: 'Zapatos Deportivos Running',
    categoria: 'Deportivos',
    talla: '42',
    cantidad: 3,
    precio: 1299,
    estado: 'Disponible' as const,
  },
  {
    sku: 'SKU-002',
    producto: 'Botas de Seguridad Industrial',
    categoria: 'Seguridad',
    talla: '40',
    cantidad: 2,
    precio: 899,
    estado: 'Disponible' as const,
  },
  {
    sku: 'SKU-003',
    producto: 'Sandalias Casuales',
    categoria: 'Casual',
    talla: '38',
    cantidad: 4,
    precio: 599,
    estado: 'Disponible' as const,
  },
  {
    sku: 'SKU-004',
    producto: 'Zapatos Formales Oxford',
    categoria: 'Formal',
    talla: '43',
    cantidad: 15,
    precio: 1599,
    estado: 'Disponible' as const,
  },
  {
    sku: 'SKU-005',
    producto: 'Tenis Deportivos',
    categoria: 'Deportivos',
    talla: '41',
    cantidad: 0,
    precio: 1099,
    estado: 'Agotado' as const,
  },
  {
    sku: 'SKU-006',
    producto: 'Mocasines Elegantes',
    categoria: 'Formal',
    talla: '39',
    cantidad: 8,
    precio: 1299,
    estado: 'Disponible' as const,
  },
  {
    sku: 'SKU-007',
    producto: 'Botines de Cuero',
    categoria: 'Casual',
    talla: '42',
    cantidad: 12,
    precio: 1399,
    estado: 'Disponible' as const,
  },
  {
    sku: 'SKU-008',
    producto: 'Zapatillas Deportivas',
    categoria: 'Deportivos',
    talla: '40',
    cantidad: 6,
    precio: 899,
    estado: 'Disponible' as const,
  },
]

export default function InventarioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>Inventario</h1>
          <p className="mt-2 font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Gestiona el inventario de tu tienda</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: 'var(--color-neutral-800)',
                  border: '1px solid var(--color-neutral-700)',
                  color: 'var(--color-neutral-100)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
                }}
              >
                <Plus className="w-4 h-4" />
                Ajustar Inventario
              </Button>
            </DialogTrigger>
            <DialogContent style={{ 
              background: 'var(--color-neutral-900)', 
              border: '1px solid var(--color-neutral-800)' 
            }}>
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--color-neutral-100)' }}>Ajustar Inventario</DialogTitle>
                <DialogDescription style={{ color: 'var(--color-neutral-300)' }}>
                  Realiza un ajuste manual del inventario
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label style={{ color: 'var(--color-neutral-300)' }}>SKU del Producto</Label>
                  <Input placeholder="Ingresa el SKU" className="login-input" />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: 'var(--color-neutral-300)' }}>Cantidad Nueva</Label>
                  <Input type="number" placeholder="0" className="login-input" />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: 'var(--color-neutral-300)' }}>Motivo del Ajuste</Label>
                  <Input placeholder="Ej: Merma, Transferencia, etc." className="login-input" />
                </div>
                <Button 
                  className="w-full font-bold shadow-lg"
                  style={{
                    background: 'var(--gradient-secondary)',
                    color: 'var(--color-neutral-925)',
                    boxShadow: '0 4px 14px rgba(35, 247, 221, 0.3)'
                  }}
                >
                  Guardar Ajuste
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all"
            style={{
              background: 'var(--color-neutral-800)',
              border: '1px solid var(--color-neutral-700)',
              color: 'var(--color-neutral-100)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            Registrar Merma
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all"
            style={{
              background: 'var(--color-neutral-800)',
              border: '1px solid var(--color-neutral-700)',
              color: 'var(--color-neutral-100)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
            }}
          >
            <TrendingUp className="w-4 h-4" />
            Solicitar Transferencia
          </Button>
        </div>
      </div>

      {/* Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Total Productos</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {productosSimulados.length}
                </p>
              </div>
              <Package className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </CardContent>
        </Card>
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Disponibles</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-green)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {productosSimulados.filter((p) => p.estado === 'Disponible').length}
                </p>
              </div>
              <Package className="w-8 h-8" style={{ color: 'var(--color-green)' }} />
            </div>
          </CardContent>
        </Card>
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Stock Bajo</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-teal-400)', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {productosSimulados.filter((p) => p.cantidad < 5 && p.estado === 'Disponible').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8" style={{ color: 'var(--color-teal-400)' }} />
            </div>
          </CardContent>
        </Card>
        <Card style={{ 
          background: 'var(--color-neutral-900)', 
          border: '1px solid var(--color-neutral-800)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-300)' }}>Agotados</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#ef4444', fontFamily: 'var(--font-family-roobert-pro)' }}>
                  {productosSimulados.filter((p) => p.estado === 'Agotado').length}
                </p>
              </div>
              <Package className="w-8 h-8" style={{ color: '#ef4444' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Inventario */}
      <TablaInventario productos={productosSimulados} />
    </div>
  )
}


