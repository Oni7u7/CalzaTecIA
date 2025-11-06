'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

interface SuccessAnimationProps {
  message?: string
}

export function SuccessAnimation({ message = 'Guardado exitosamente' }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
      >
        <CheckCircle2 className="w-5 h-5" />
      </motion.div>
      <span className="font-medium">{message}</span>
    </motion.div>
  )
}



