'use client'

import { useLanguage } from '@/components/language-provider'
import { OnboardingModal } from '@/components/onboarding-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent } from '@/components/ui/carousel'
import { GlowingCard } from "@/components/ui/glowing-card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { BellIcon, Gamepad, Search, Star, Trophy, TrophyIcon, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Game {
  id: number
  date: string
  arena: string
  homeScore: number
  awayScore: number
  stats: {
    goals: number
    assists: number
    fouls: number
    yellowCards: number
    redCards: number
  }
}

interface Facility {
  id: number
  name: string
  rating: number
  image: string
  category: string
}

interface NearbyFacility extends Facility {
  city: string
  state: string
  logo: string
  location: { lat: number, lng: number }
}

const MOCK_NEARBY_FACILITIES: NearbyFacility[] = [
  {
    id: 1,
    name: "Arena Maestro",
    rating: 4.8,
    category: "Soccer Fields",
    city: "Criciúma",
    state: "SC",
    image: "/placeholder.svg",
    logo: "/placeholder.svg",
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    name: "Arena Criciúma",
    rating: 4.8,
    category: "Soccer Fields",
    city: "Criciúma",
    state: "SC",
    image: "/placeholder.svg",
    logo: "/placeholder.svg",
    location: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 3,
    name: "Arena Rio Maina",
    rating: 4.8,
    category: "Soccer Fields",
    city: "Criciúma",
    state: "SC",
    image: "/placeholder.svg",
    logo: "/placeholder.svg",
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 4,
    name: "Resenha da Bola",
    rating: 4.8,
    category: "Soccer Fields",
    city: "Criciúma",
    state: "SC",
    image: "/placeholder.svg",
    logo: "/placeholder.svg",
    location: { lat: 40.7589, lng: -73.9851 },
  },
]

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

const MOCK_RECENT_GAMES: Game[] = [
  {
    id: 1,
    date: "20/01/2025",
    arena: "Arena Maestro",
    homeScore: 1,
    awayScore: 2,
    stats: {
      goals: 1,
      assists: 0,
      fouls: 3,
      yellowCards: 1,
      redCards: 1,
    },
  },
  {
    id: 2,
    date: "20/01/2025",
    arena: "Arena Rio Maina",
    homeScore: 3,
    awayScore: 1,
    stats: {
      goals: 1,
      assists: 1,
      fouls: 1,
      yellowCards: 1,
      redCards: 0,
    },
  },
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
    <div className="min-h-screen bg-background text-foreground pb-5 px-5 sm:px-4 md:px-6 pt-4">
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
      <div className="mb-6">
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

      {/* Nearby Arenas */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-primary">{t('last_reservations')}</h2>
        <div className="pb-6 w-full">
          <div className="flex space-x-4 overflow-hidden">
            <Carousel className="flex space-x-4">
              <CarouselContent className="flex space-x-2 w-auto">
                {MOCK_NEARBY_FACILITIES.map((facility) => (
                  <div key={facility.id} className="flex flex-col items-center w-[8rem]">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-muted flex-shrink-0">
                      <Image
                        src={facility.logo || "/placeholder.svg"}
                        alt={facility.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-center">{facility.name}</span>
                  </div>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>

      {/* Featured Facility */}
      <div className='mb-6'>
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

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={`category-${index}`}>
            <h2 className="text-lg font-bold mb-4 text-primary">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Carousel className="flex space-x-4">
                <CarouselContent className="flex space-x-4 px-4">
                  {MOCK_FACILITIES
                    .filter(fac => fac.category === category)
                    .map((facility) => (
                      <Link href={`/book/${facility.id}`} key={`facility-${facility.id}`}>
                        <GlowingCard className="bg-card/50 border-primary/20 overflow-hidden hover:border-primary transition-colors cursor-pointer">
                          <CardContent className="p-0 w-[15rem] h-[20rem]">
                            <div className="relative h-48">
                              <Image
                                src={facility.image || "/placeholder.svg"}
                                alt={facility.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4 justify-between flex flex-col h-[8.5rem]">
                              <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
                              <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-sm">{facility.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </GlowingCard>
                      </Link>
                    ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Games */}
      <div className="space-y-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">{t("recent_games")}</h2>
        <div className="space-y-4">
          {MOCK_RECENT_GAMES.map((game) => (
            <Card key={game.id} className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{game.arena}</span>
                  <span className="text-sm text-muted-foreground">{game.date}</span>
                </div>
                <div className="flex justify-center items-center text-2xl font-bold mb-3">
                  <span>{game.homeScore}</span>
                  <span className="mx-2">×</span>
                  <span>{game.awayScore}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BellIcon className="w-4 h-4 mr-2 text-primary" />
                        <span>{t("goals")}:</span>
                      </div>
                      <span>{game.stats.goals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrophyIcon className="w-4 h-4 mr-2 text-primary" />
                        <span>{t("assists")}:</span>
                      </div>
                      <span>{game.stats.assists}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BellIcon className="w-4 h-4 mr-2 text-primary" />
                        <span>{t("fouls")}:</span>
                      </div>
                      <span>{game.stats.fouls}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>{t("cards")}:</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {game.stats.yellowCards > 0 && (
                          <div className="relative">
                            <div className="w-3 h-4 bg-yellow-500"></div>
                            <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-black/20 rounded-full text-[10px]">
                              {game.stats.yellowCards}
                            </div>
                          </div>
                        )}
                        {game.stats.redCards > 0 && (
                          <div className="relative">
                            <div className="w-3 h-4 bg-red-500"></div>
                            <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-black/20 rounded-full text-[10px]">
                              {game.stats.redCards}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full">
            {t("view_more")}
          </Button>
        </div>
      </div>

      {showOnboarding && <OnboardingModal />}
    </div>
  )
}

