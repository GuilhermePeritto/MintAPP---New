'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Trophy, Star, ChevronLeft } from 'lucide-react'

interface Achievement {
  name: string
  xpReward: number
}

interface Booking {
  id: number
  facilityName: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  price: number
  duration: number
  xpEarned?: number
  achievements?: Achievement[]
}

const MOCK_BOOKINGS: Booking[] = [
  { 
    id: 1, 
    facilityName: "Central Arena", 
    date: "2023-07-15", 
    time: "14:00", 
    status: "upcoming", 
    price: 50, 
    duration: 60 
  },
  { 
    id: 2, 
    facilityName: "VR Zone", 
    date: "2023-07-10", 
    time: "16:30", 
    status: "completed", 
    price: 75, 
    duration: 90, 
    xpEarned: 100, 
    achievements: [
      { name: "First Visit", xpReward: 50 },
      { name: "Team Player", xpReward: 50 }
    ] 
  },
  { 
    id: 3, 
    facilityName: "Laser Tag Field", 
    date: "2023-07-05", 
    time: "18:00", 
    status: "cancelled", 
    price: 40, 
    duration: 45 
  },
]

function formatDate(dateString: string, language: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export default function MyReservations() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const router = useRouter()
  const { t, language } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  const totalXP = bookings.reduce((sum, booking) => sum + (booking.xpEarned || 0), 0)
  const nextLevelXP = 1000 // This should be calculated based on the user's current level
  const progress = (totalXP / nextLevelXP) * 100

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <div className="flex items-center mb-6">
        {isMobile && (
          <Button
            variant="ghost"
            className="mr-2 p-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">{t('my_reservations')}</h1>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/20">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">{t('your_progress')}</h2>
          <div className="flex items-center mb-2">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="font-medium">{t('total_xp')}: {totalXP}</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">{nextLevelXP - totalXP} {t('xp_to_next_level')}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card 
            key={booking.id} 
            className="bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-colors cursor-pointer"
            onClick={() => router.push(`/my-reservations/${booking.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{booking.facilityName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(booking.date, language)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {t(booking.status)}
                  </div>
                  {booking.xpEarned && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="text-sm font-medium">{booking.xpEarned} XP</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const getStatusColor = (status: Booking['status']) => {
  switch (status) {
    case 'upcoming':
      return 'text-green-500'
    case 'completed':
      return 'text-blue-500'
    case 'cancelled':
      return 'text-red-500'
    default:
      return 'text-muted-foreground'
  }
}

