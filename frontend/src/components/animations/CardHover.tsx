'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardHoverProps {
  children: ReactNode
  className?: string
}

export function CardHover({ children, className = '' }: CardHoverProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}



