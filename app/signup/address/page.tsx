'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useLanguage } from '@/components/language-provider'

export default function AddressSignup() {
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const tempUser = localStorage.getItem('tempUser')
    if (!tempUser) {
      router.push('/signup')
    }
  }, [router])

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      alert(t('must_agree_terms'))
      return
    }
    const tempUser = JSON.parse(localStorage.getItem('tempUser') || '{}')
    const fullUser = {
      ...tempUser,
      address: { street, number, complement, neighborhood, city, state, zipCode }
    }
    localStorage.setItem('user', JSON.stringify(fullUser))
    localStorage.removeItem('tempUser')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/cyber-bg.jpg')] bg-cover bg-center p-4 md:p-0">
      <div className="w-full max-w-md space-y-8 bg-black/70 backdrop-blur-sm border border-primary/20 shadow-[0_0_15px_rgba(0,128,255,0.5)] md:rounded-lg md:p-8">
        <div className="space-y-2 text-center">
          <div className="relative">
            <FaMapMarkerAlt className="mx-auto h-12 w-12 text-primary animate-pulse" />
            <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {t('base_location')} <span className="text-primary/70">[{t('checkpoint')}]</span>
          </h1>
          <p className="text-sm text-primary/70">
            {t('set_spawn_point')}
          </p>
        </div>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={t('zip_code')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={t('street')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder={t('number')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder={t('complement')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={t('district')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder={t('city')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder={t('state')}
              className="bg-black/50 border-primary/20 focus:border-primary/50 focus:ring-primary/50"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('accept_terms')}
            </label>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_10px_rgba(0,128,255,0.3)]"
          >
            {t('complete_registration')} →
          </Button>
        </form>
      </div>
    </div>
  )
}

