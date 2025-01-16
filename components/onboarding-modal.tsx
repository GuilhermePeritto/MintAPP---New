'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useThemeToggle } from '@/hooks/useThemeToggle'
import { BookOpen, ChevronLeft, ChevronRight, Clipboard, CreditCard, Gamepad, Globe, Palette, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const ONBOARDING_STEPS = [
  'language',
  'theme',
  'welcome',
  'features',
  'bookings',
  'match_info',
  'ratings',
  'payments',
]

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useThemeToggle()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setIsOpen(false)
  }

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (ONBOARDING_STEPS[currentStep]) {
      case 'language':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Globe className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('choose_language')}</h2>
            </div>
            <RadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'pt')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pt" id="pt" />
                <Label htmlFor="pt">Português</Label>
              </div>
            </RadioGroup>
          </div>
        )
      case 'theme':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Palette className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('choose_theme')}</h2>
            </div>
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
          </div>
        )
      case 'welcome':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Gamepad className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('welcome_to_app')}</h2>
            </div>
            <p>{t('onboarding_welcome_message')}</p>
          </div>
        )
      case 'features':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('key_features')}</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('feature_1')}</li>
              <li>{t('feature_2')}</li>
              <li>{t('feature_3')}</li>
            </ul>
          </div>
        )
      case 'bookings':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <CreditCard className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('how_to_book')}</h2>
            </div>
            <p>{t('booking_instructions')}</p>
          </div>
        )
      case 'match_info':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Clipboard className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('match_info_registration')}</h2>
            </div>
            <p>{t('match_info_description')}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('match_info_feature_1')}</li>
              <li>{t('match_info_feature_2')}</li>
              <li>{t('match_info_feature_3')}</li>
            </ul>
          </div>
        )
      case 'ratings':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Star className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('facility_ratings')}</h2>
            </div>
            <p>{t('ratings_description')}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('ratings_feature_1')}</li>
              <li>{t('ratings_feature_2')}</li>
              <li>{t('ratings_feature_3')}</li>
            </ul>
          </div>
        )
      case 'payments':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <CreditCard className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('payment_methods')}</h2>
            </div>
            <p>{t('payment_instructions')}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="smm:max-w-[85%] sm:max-w-[425px] p-4 sm:p-6 md:p-8 rounded rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t('welcome_to_app')}</DialogTitle>
        </DialogHeader>
        <div className="py-2 sm:py-4">
          {renderStepContent()}
        </div>
        <div className="flex justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-sm sm:text-base"
          >
            <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" /> {t('previous')}
          </Button>
          <Button onClick={handleNext} className="text-sm sm:text-base">
            {currentStep === ONBOARDING_STEPS.length - 1 ? t('finish') : t('next')}
            <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

