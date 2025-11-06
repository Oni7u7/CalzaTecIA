'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface EditorTextoProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  required?: boolean
}

export function EditorTexto({
  label,
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  rows = 6,
  className,
  required = false,
}: EditorTextoProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={label.toLowerCase().replace(/\s+/g, '-')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-h-[120px] resize-y"
      />
    </div>
  )
}



