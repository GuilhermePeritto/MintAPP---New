'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GlowingCard } from "@/components/ui/glowing-card"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Gamepad, Trophy, Users, Zap } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useLanguage } from '@/components/language-provider'
import { BookingModal } from '@/components/booking-modal'
import { OnboardingModal } from '@/components/onboarding-modal'
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card";

interface Facility {
  id: number
  name: string
  rating: number
  image: string
  category: string
}

const MOCK_FACILITIES: Facility[] = [
  { id: 1, name: "Central Soccer Field", rating: 4.8, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 2, name: "Riverside Soccer Complex", rating: 4.6, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 3, name: "Downtown Soccer Arena", rating: 4.7, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 4, name: "Community Soccer Ground", rating: 4.5, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 5, name: "Main Basketball Court", rating: 4.7, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 6, name: "Lakeside Basketball Arena", rating: 4.5, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 7, name: "Indoor Basketball Center", rating: 4.9, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 8, name: "Park Basketball Court", rating: 4.6, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 9, "name": "City Tennis Club", rating: 4.8, image: "/placeholder.svg", category: "Tennis Courts" },
  { id: 10, "name": "Sunshine Tennis Center", rating: 4.7, image: "/placeholder.svg", category: "Tennis Courts" },
  { id: 11, "name": "Grand Slam Tennis Courts", rating: 4.9, image: "/placeholder.svg", category: "Tennis Courts" },
  { id: 12, "name": "Community Tennis Park", rating: 4.5, image: "/placeholder.svg", category: "Tennis Courts" },
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const categories = Array.from(new Set(MOCK_FACILITIES.map(fac => fac.category)))

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 px-3 sm:px-4 md:px-6">
      {/* Player Stats */}
      <GlowingCard className="bg-primary/5 p-4 mb-6" glowColor="rgba(0, 128, 255, 0.2)">
        <h2 className="text-xl font-bold mb-2 text-primary">{t('athlete_stats')}</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm">{t('level')} 12</span>
          </div>
          <div className="flex items-center">
            <Gamepad className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm">7 {t('facilities_visited')}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm">25 {t('friends')}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>XP: 2450 / 3000</span>
            <span>Level 13</span>
          </div>
          <Progress value={81.67} className="h-2" />
        </div>
      </GlowingCard>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder={t('search_facilities')}
            className="w-full pl-9 bg-background/50 border-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 space-y-6">
        {categories.map((category, index) => (
          <div key={`category-${index}`}>
            <h2 className="text-lg font-bold mb-4 text-primary">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_FACILITIES
                .filter(fac => fac.category === category)
                .map((facility) => (
                  <BookingModal 
                    key={`facility-${facility.id}`}
                    facilityName={facility.name}
                    facilityImage={facility.image}
                    category={facility.category}
                    rating={facility.rating}
                    onBooking={(date, startTime, endTime, field) => {
                      console.log('Booking:', facility.name, date, startTime, endTime, field)
                      // Here you would typically send the booking information to your backend
                    }}
                  >
                    <GlowingCard className="bg-card/50 border-primary/20 overflow-hidden hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative h-48">
                          <Image
                            src={facility.image}
                            alt={facility.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm">{facility.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </GlowingCard>
                  </BookingModal>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Featured Facility */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4 text-primary">{t('featured_facility')}</h2>
        <Card className="bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 dark:from-primary/40 dark:via-primary/60 dark:to-primary/40">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Olympic Sports Complex</h3>
            <p className="text-sm sm:text-base mb-4 text-muted-foreground">Experience world-class facilities for multiple sports!</p>
            <Button variant="secondary" size="sm" className="w-full sm:w-auto">
              {t('book_now')}
              <Zap className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      {showOnboarding && <OnboardingModal />}
    </div>
  )
}

