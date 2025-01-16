'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Calendar, Clock, MapPin, Star, Trophy, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

function BookingDetailsModal({ booking }: { booking: Booking }) {
  const { t, language } = useLanguage()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmitReview = () => {
    toast({
      title: t('review_submitted'),
      description: t('thank_you_feedback'),
    })
  }

  const totalXpEarned = booking.achievements?.reduce((sum, achievement) => sum + achievement.xpReward, 0) || 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-colors cursor-pointer">
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('booking_details')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium text-lg">{booking.facilityName}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)}`}>
                {t(booking.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t('date')}:</span>
                  <span className="text-sm">{formatDate(booking.date, language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t('time')}:</span>
                  <span className="text-sm">{booking.time}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t('duration')}:</span>
                  <span className="text-sm">{booking.duration} {t('minutes')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t('price')}:</span>
                  <span className="text-sm">${booking.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {booking.achievements && booking.achievements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{t('achievements')}</h4>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Total: {totalXpEarned} XP</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {booking.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{achievement.name}</span>
                    </div>
                    <span className="text-sm font-medium">+{achievement.xpReward} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">{t('rate_and_review')}</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      rating >= star
                        ? "fill-primary text-primary"
                        : "fill-muted stroke-muted-foreground"
                    )}
                  />
                </Button>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">{t('add_comment')}</Label>
              <Textarea
                id="comment"
                placeholder={t('share_your_experience')}
                className="min-h-[100px]"
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleSubmitReview}>
              {t('submit_review')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const totalXP = bookings.reduce((sum, booking) => sum + (booking.xpEarned || 0), 0)
  const nextLevelXP = 1000 // This should be calculated based on the user's current level
  const progress = (totalXP / nextLevelXP) * 100

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-4 md:p-6 pb-5">
      <h1 className="text-2xl font-bold mb-6 text-primary">{t('booking_history')}</h1>

      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/20">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
          <div className="flex items-center mb-2">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="font-medium">Total XP: {totalXP}</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">{nextLevelXP - totalXP} XP to next level</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <BookingDetailsModal key={booking.id} booking={booking} />
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

const getStatusBadgeColor = (status: Booking['status']) => {
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

