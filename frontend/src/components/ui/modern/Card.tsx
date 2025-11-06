'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
  gradient?: boolean
  className?: string
}

export function ModernCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  gradient = false,
  className = '',
}: CardProps) {
  const colors = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      icon: 'text-blue-500',
      border: 'border-blue-200 dark:border-blue-500/20',
      gradient: 'from-blue-500 to-cyan-500',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-500/10',
      icon: 'text-green-500',
      border: 'border-green-200 dark:border-green-500/20',
      gradient: 'from-green-500 to-emerald-500',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      icon: 'text-purple-500',
      border: 'border-purple-200 dark:border-purple-500/20',
      gradient: 'from-purple-500 to-pink-500',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      icon: 'text-orange-500',
      border: 'border-orange-200 dark:border-orange-500/20',
      gradient: 'from-orange-500 to-red-500',
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-500/10',
      icon: 'text-pink-500',
      border: 'border-pink-200 dark:border-pink-500/20',
      gradient: 'from-pink-500 to-rose-500',
    },
  }

  const colorScheme = colors[color]

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        ${gradient
          ? `bg-gradient-to-br ${colorScheme.gradient} text-white shadow-xl shadow-${color}-500/50`
          : `bg-white dark:bg-slate-800 border ${colorScheme.border} shadow-lg hover:shadow-xl`
        }
        transition-all duration-300 cursor-pointer
        ${className}
      `}
    >
      {/* Patrón de fondo decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-wide ${
                gradient ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {title}
            </p>
            <h3
              className={`text-4xl font-bold mt-2 ${
                gradient ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}
            >
              {value}
            </h3>
          </div>

          <div
            className={`
            p-3 rounded-xl
            ${gradient ? 'bg-white/20' : colorScheme.bg}
          `}
          >
            <Icon className={`w-6 h-6 ${gradient ? 'text-white' : colorScheme.icon}`} />
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-2">
          <span
            className={`
              flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg
              ${
                trend.isPositive
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }
            `}
          >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span
              className={`text-sm font-medium ${
                gradient ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              vs mes anterior
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

