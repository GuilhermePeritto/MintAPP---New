'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ChevronLeft, ClipboardList, Clock, DollarSign, LucideIcon, MapPin, Star, Trophy, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

interface Booking {
  id: number
  facilityName: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  price: number
  duration: number
  xpEarned?: number
  achievements?: { name: string; xpReward: number }[]
  playerCount?: number
  facilityType?: string
  courtNumber?: number
}

const MOCK_BOOKINGS: Booking[] = [
  { 
    id: 1, 
    facilityName: "Central Arena", 
    date: "2023-07-15", 
    time: "14:00", 
    status: "upcoming", 
    price: 50, 
    duration: 60,
    playerCount: 10,
    facilityType: "Indoor Soccer Field",
    courtNumber: 3
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
    ],
    playerCount: 6,
    facilityType: "VR Gaming Room",
    courtNumber: 2
  },
  { 
    id: 3, 
    facilityName: "Laser Tag Field", 
    date: "2023-07-05", 
    time: "18:00", 
    status: "cancelled", 
    price: 40, 
    duration: 45,
    playerCount: 12,
    facilityType: "Laser Tag Arena",
    courtNumber: 1
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

export default function ReservationDetails({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const router = useRouter()
  const { t, language } = useLanguage()

  // Unwrap params using React's `use`
  const params = use(paramsPromise)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }

    const bookingId = parseInt(params.id)
    const foundBooking = MOCK_BOOKINGS.find(b => b.id === bookingId)
    if (foundBooking) {
      setBooking(foundBooking)
    } else {
      router.push('/my-reservations')
    }
  }, [params.id, router])

  if (!booking) {
    return <div>{t('loading')}</div>
  }

  const handleAddGameResults = () => {
    router.push(`/register-game/new?bookingId=${booking.id}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-2 p-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">{t('reservation_details')}</h1>
        </div>

        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/10 p-6">
              <h2 className="text-2xl font-semibold mb-2">{booking.facilityName}</h2>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {t(booking.status)}
              </div>
            </div>
            <div className="p-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <InfoItem icon={Calendar} label={t('date')} value={formatDate(booking.date, language)} />
                <InfoItem icon={Clock} label={t('time')} value={booking.time} />
                <InfoItem icon={Clock} label={t('duration')} value={`${booking.duration} ${t('minutes')}`} />
              </div>
              <div className="space-y-2">
                <InfoItem icon={DollarSign} label={t('price')} value={`$${booking.price}`} />
                <InfoItem icon={Users} label={t('player_count')} value={booking.playerCount?.toString() || 'N/A'} />
                <InfoItem icon={MapPin} label={t('court_number')} value={booking.courtNumber?.toString() || 'N/A'} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">{t('facility_details')}</h3>
            <div className="space-y-2">
              <InfoItem icon={MapPin} label={t('facility_type')} value={booking.facilityType || 'N/A'} />
            </div>
          </CardContent>
        </Card>

        {booking.xpEarned && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t('xp_and_achievements')}</h3>
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                <span className="text-lg font-medium">{t('xp_earned')}: {booking.xpEarned} XP</span>
              </div>
              {booking.achievements && booking.achievements.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t('achievements_unlocked')}:</h4>
                  <ul className="space-y-2">
                    {booking.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center bg-primary/5 rounded-lg p-2">
                        <Trophy className="w-5 h-5 mr-2 text-primary" />
                        <span>{achievement.name} (+{achievement.xpReward} XP)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <Button 
            className="w-full" 
            onClick={handleAddGameResults}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            {t('add_game_results')}
          </Button>

          {booking.status === 'upcoming' && (
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => router.push(`/my-reservations/${params.id}/edit`)}
            >
              {t('modify_reservation')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const getStatusColor = (status: Booking['status']) => {
  switch (status) {
    case 'upcoming':
      return 'bg-green-500/10 text-green-500'
    case 'completed':
      return 'bg-blue-500/10 text-blue-500'
    case 'cancelled':
      return 'bg-red-500/10 text-red-500'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const InfoItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
  <div className="flex items-center">
    <Icon className="w-5 h-5 mr-2 text-primary" />
    <span className="text-sm font-medium">{label}:</span>
    <span className="ml-2 text-sm">{value}</span>
  </div>
)

