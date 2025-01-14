'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do PWA')
      } else {
        console.log('Usuário recusou a instalação do PWA')
      }
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  if (!showInstallButton) return null

  return (
    <Button
      onClick={handleInstall}
      className="fixed bottom-4 right-4 z-50"
    >
      Instalar App
    </Button>
  )
}

