'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaUserPlus } from 'react-icons/fa'
import { useLanguage } from '@/components/language-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [document, setDocument] = useState('')
  const router = useRouter()
  const { t } = useLanguage()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert(t('passwords_dont_match'))
      return
    }
    const user = { 
      name, email, password, phone, birthdate, document
    }
    localStorage.setItem('tempUser', JSON.stringify(user))
    router.push('/signup/address')
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/cyber-bg.jpg')] bg-cover bg-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] dark:shadow-[0_0_15px_rgba(0,128,255,0.5)]">
        <CardHeader className="space-y-2 text-center">
          <div className="relative inline-flex mx-auto">
            <FaUserPlus className="h-12 w-12 text-primary" />
            <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('player_registration')} <span className="text-primary">[{t('new_game')}]</span>
          </CardTitle>
          <CardDescription>
            {t('create_player_profile')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={t('player_name')}
                className="bg-background/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="password"
                placeholder={t('password')}
                className="bg-background/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder={t('confirm_password')}
                className="bg-background/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder={t('contact_number')}
                className="bg-background/50"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder={t('birth_date')}
                className="bg-background/50"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={t('id_number')}
                className="bg-background/50"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t('continue_quest')} →
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('already_have_account')}{" "}
            <Link href="/" className="text-primary hover:underline">
              {t('login_continue_journey')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

