'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, BarChart3, Shield, ShoppingCart, TrendingUp, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const features = [
    {
      icon: Users,
      title: 'Gestión de Personal y Capacitación',
      description:
        'Sistema completo de capacitación con seguimiento jerárquico y evaluaciones continuas.',
      gradient: 'var(--gradient-primary)',
    },
    {
      icon: Package,
      title: 'Control de Inventario Inteligente',
      description:
        'Gestión centralizada de inventario con alertas automáticas y optimización de stock.',
      gradient: 'var(--gradient-secondary)',
    },
    {
      icon: BarChart3,
      title: 'Análisis y KPIs en Tiempo Real',
      description:
        'Dashboards ejecutivos con métricas estratégicas, tácticas y operativas en tiempo real.',
      gradient: 'var(--gradient-warm)',
    },
  ]

  const roles = [
    {
      icon: Shield,
      title: 'Administrador',
      description: 'Gestión completa del sistema, usuarios, tiendas y análisis estratégico.',
      gradient: 'var(--gradient-primary)',
    },
    {
      icon: TrendingUp,
      title: 'Vendedor',
      description: 'Dashboard operativo, gestión de equipo y control de inventario.',
      gradient: 'var(--gradient-secondary)',
    },
    {
      icon: ShoppingCart,
      title: 'Cliente',
      description: 'Sistema POS intuitivo para procesamiento rápido de ventas.',
      gradient: 'var(--gradient-warm)',
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-neutral-925)' }}>
      {/* Hero Section - Estilo MultiversX */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(35, 247, 221, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 230, 118, 0.15) 0%, transparent 50%)
            `
          }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ 
                background: 'linear-gradient(135deg, var(--color-teal-400) 0%, var(--color-green) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-family-roobert-pro)'
              }}>
                CalzaTec_IA
              </h1>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-5xl font-semibold"
              style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}
            >
              Inteligencia Artificial para el Retail de Calzado
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl max-w-2xl mx-auto"
              style={{ color: 'var(--color-neutral-300)' }}
            >
              Powered by AI • Logistics Hackathon 2025
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'var(--color-neutral-925)',
                    fontFamily: 'var(--font-family-roobert-pro)',
                    fontWeight: 700
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'var(--color-neutral-900)',
                    border: '2px solid var(--color-teal-400)',
                    color: 'var(--color-teal-400)',
                    fontFamily: 'var(--font-family-roobert-pro)',
                    fontWeight: 700
                  }}
                >
                  Registrarse
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Ilustración decorativa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
                style={{ background: 'var(--gradient-primary)' }}
              />
              <div className="relative w-full h-full rounded-full flex items-center justify-center shadow-2xl"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Package className="w-32 h-32 md:w-48 md:h-48" style={{ color: 'var(--color-neutral-925)' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Características - Estilo MultiversX */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}
          >
            Características Principales
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--color-neutral-300)' }}
          >
            Sistema completo diseñado para optimizar la gestión de tu negocio
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="h-full border-0 shadow-2xl transition-all duration-300 hover:shadow-3xl"
                style={{ 
                  background: 'var(--color-neutral-900)',
                  border: '1px solid var(--color-neutral-800)'
                }}
              >
                <CardHeader>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                    style={{ background: feature.gradient }}
                  >
                    <feature.icon className="w-8 h-8" style={{ color: 'var(--color-neutral-925)' }} />
                  </div>
                  <CardTitle className="text-2xl" style={{ color: 'var(--color-neutral-100)' }}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base" style={{ color: 'var(--color-neutral-300)' }}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Roles del Sistema - Estilo MultiversX */}
      <section className="py-20" style={{ background: 'var(--color-neutral-900)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--color-neutral-100)', fontFamily: 'var(--font-family-roobert-pro)' }}
            >
              Roles del Sistema
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-neutral-300)' }}>
              Cada usuario tiene acceso a herramientas específicas según su rol
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {roles.map((role, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full border-0 shadow-2xl"
                  style={{ 
                    background: 'var(--color-neutral-800)',
                    border: '1px solid var(--color-neutral-700)'
                  }}
                >
                  <CardHeader className="text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                      style={{ background: role.gradient }}
                    >
                      <role.icon className="w-10 h-10" style={{ color: 'var(--color-neutral-925)' }} />
                    </div>
                    <CardTitle className="text-2xl" style={{ color: 'var(--color-neutral-100)' }}>
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-center" style={{ color: 'var(--color-neutral-300)' }}>
                      {role.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer - Estilo MultiversX */}
      <footer className="py-12" style={{ background: 'var(--color-neutral-925)', borderTop: '1px solid var(--color-neutral-800)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-neutral-100)' }}>
                Desarrollado para Logistics Hackathon 2025
              </p>
              <p className="text-base font-semibold" style={{ color: 'var(--color-teal-400)' }}>
                Equipo de Desarrollo
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-neutral-300)' }}>
                - A L F A -, Diego/Onii, Amanda ❤️, Karlita :3
              </p>
            </div>
            <div className="flex justify-center gap-6 flex-wrap" style={{ color: 'var(--color-neutral-400)' }}>
              <a 
                href="mailto:calzatecia@gmail.com" 
                className="hover:opacity-80 transition-opacity flex items-center gap-2" 
                style={{ color: 'var(--color-teal-400)' }}
              >
                <Mail className="w-4 h-4" />
                calzatecia@gmail.com
              </a>
              <span>•</span>
              <a 
                href="tel:+527205472219" 
                className="hover:opacity-80 transition-opacity" 
                style={{ color: 'var(--color-teal-400)' }}
              >
                +52 720 547 2219
              </a>
            </div>
            <p className="text-sm mt-8" style={{ color: 'var(--color-neutral-500)' }}>
              © 2025 CalzaTec_IA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
