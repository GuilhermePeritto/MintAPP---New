'use client'

import { useState, useEffect } from 'react'
import { Toast } from "@/components/ui/toast"
import { useLanguage } from '@/components/language-provider'

interface XpNotificationProps {
  xp: number
  level?: number
}

export function XpNotification({ xp, level }: XpNotificationProps) {
  const [show, setShow] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [xp, level])

  if (!show) return null

  return (
    <Toast>
      <div className="flex items-center">
        {level ? (
          <>
            <span className="text-xl font-bold mr-2">{t('level_up')}</span>
            <span>{t('new_level', { level })}</span>
          </>
        ) : (
          <span>{t('xp_earned', { xp })}</span>
        )}
      </div>
    </Toast>
  )
}

