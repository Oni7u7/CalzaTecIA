'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Home, Search, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-neutral-925)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-0 shadow-2xl"
          style={{ 
            background: 'var(--color-neutral-900)',
            border: '1px solid var(--color-neutral-800)'
          }}
        >
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Package className="w-16 h-16" style={{ color: 'var(--color-neutral-925)' }} />
            </motion.div>
            <CardTitle className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}
            >
              ¡Oops! Página no encontrada
            </CardTitle>
            <CardDescription className="text-xl" style={{ color: 'var(--color-neutral-300)' }}>
              Parece que te has perdido. El zapato que buscas no está aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--color-neutral-925)',
                    fontFamily: 'var(--font-family-roobert-pro)',
                    fontWeight: 700
                  }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  style={{
                    borderColor: 'var(--color-neutral-700)',
                    color: 'var(--color-neutral-100)',
                    background: 'var(--color-neutral-800)'
                  }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Ir al Login
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-6 space-y-3"
              style={{ borderTop: '1px solid var(--color-neutral-800)' }}
            >
              <p className="text-center font-medium" style={{ color: 'var(--color-neutral-300)' }}>Enlaces útiles:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/ayuda"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-teal-400)' }}
                >
                  <HelpCircle className="w-4 h-4" />
                  Ayuda
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-teal-400)' }}
                >
                  Dashboard Admin
                </Link>
                <Link
                  href="/vendedor"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-green)' }}
                >
                  Dashboard Vendedor
                </Link>
                <Link
                  href="/cliente"
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-teal-400)' }}
                >
                  Dashboard Cliente
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


