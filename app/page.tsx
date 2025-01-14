'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaGoogle, FaFacebook, FaApple, FaUserCircle } from 'react-icons/fa'
import { useLanguage } from '@/components/language-provider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      router.push('/dashboard')
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = { email, password }
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/cyber-bg.jpg')] bg-cover bg-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6 bg-card/95 backdrop-blur-sm border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_15px_rgba(0,128,255,0.5)] rounded-lg p-6 sm:p-8">
        <div className="space-y-2 text-center">
          <div className="relative inline-flex">
            <FaUserCircle className="h-12 w-12 text-primary" />
            <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('login')} <span className="text-primary">/</span> {t('start')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('access_gaming_hub')}
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={t('email')}
              className="bg-background/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={t('password')}
              className="bg-background/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t('enter')}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t('continue_with')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="w-full">
            <FaGoogle className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full">
            <FaFacebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full">
            <FaApple className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {t('no_account')}{" "}
          <Link href="/signup" className="text-primary hover:underline">
            {t('create_account')}
          </Link>
        </p>
      </div>
    </div>
  )
}

