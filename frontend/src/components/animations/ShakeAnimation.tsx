'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ShakeAnimationProps {
  children: ReactNode
  trigger: boolean
}

export function ShakeAnimation({ children, trigger }: ShakeAnimationProps) {
  return (
    <motion.div
      animate={trigger ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}



