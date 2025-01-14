'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from '@/components/language-provider'
import { Instagram, Facebook, Twitter } from 'lucide-react'
import { useThemeToggle } from '@/hooks/useThemeToggle'

export default function Settings() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { t } = useLanguage()
  const { theme, toggleTheme } = useThemeToggle()
  const [selectedLanguage, setSelectedLanguage] = useState(language)

  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    twitter: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as 'en' | 'pt')
  }

  const handleThemeChange = (value: string) => {
    toggleTheme(value as 'light' | 'dark')
  }

  const handleSocialLinkChange = (platform: keyof typeof socialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }))
  }

  const handleSave = () => {
    setLanguage(selectedLanguage)
    console.log('Saving settings:', { language: selectedLanguage, theme, socialLinks })
    // Show a success message to the user
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-primary">{t('settings')}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('language')}</CardTitle>
          <CardDescription>{t('choose_language')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pt" id="pt" />
              <Label htmlFor="pt">Português</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('theme')}</CardTitle>
          <CardDescription>{t('choose_theme')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value) => toggleTheme(value as 'light' | 'dark')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">{t('light')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">{t('dark')}</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('social_media_links')}</CardTitle>
          <CardDescription>{t('link_social_media')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Instagram className="h-5 w-5 text-primary" />
            <Input
              placeholder="Instagram username"
              value={socialLinks.instagram}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            />
            <Button onClick={() => console.log('Link Instagram')}>{t('link_account')}</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Facebook className="h-5 w-5 text-primary" />
            <Input
              placeholder="Facebook profile URL"
              value={socialLinks.facebook}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
            />
            <Button onClick={() => console.log('Link Facebook')}>{t('link_account')}</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Twitter className="h-5 w-5 text-primary" />
            <Input
              placeholder="Twitter username"
              value={socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
            />
            <Button onClick={() => console.log('Link Twitter')}>{t('link_account')}</Button>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSave}>{t('save_settings')}</Button>
    </div>
  )
}

