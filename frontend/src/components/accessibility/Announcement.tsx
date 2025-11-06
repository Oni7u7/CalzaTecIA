'use client'

import { useEffect, useRef } from 'react'

interface AnnouncementProps {
  message: string
  priority?: 'polite' | 'assertive'
}

export function Announcement({ message, priority = 'polite' }: AnnouncementProps) {
  const announcementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (announcementRef.current && message) {
      announcementRef.current.textContent = message
    }
  }, [message])

  return (
    <div
      ref={announcementRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  )
}



