'use client'

import { Button } from "@/components/ui/button"
import { History } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'

export function BookingHistoryButton() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/booking-history')}
      title={t('booking_history')}
    >
      <History className="h-5 w-5 text-primary" />
    </Button>
  )
}

