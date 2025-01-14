'use client'

import { Button } from "@/components/ui/button"
import { Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'

export function WalletButton() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/wallet')}
      title={t('wallet')}
    >
      <Wallet className="h-5 w-5 text-primary" />
    </Button>
  )
}

