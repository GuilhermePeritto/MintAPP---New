'use client'

import { EditNotification } from '@/components/edit-notification'
import { useLanguage } from '@/components/language-provider'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditTracker } from '@/hooks/useEditTracker'
import { Calendar, ChevronLeft, Clock, MapPin } from 'lucide-react'
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
  courtNumber: number
  playerCount: number
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0')
  return `${hour}:00`
})

const DURATIONS = [30, 60, 90, 120]
const COURTS = [1, 2, 3, 4, 5]
const PLAYER_COUNTS = Array.from({ length: 20 }, (_, i) => i + 1)

export default function EditReservation({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params) // Unwrapping params

  const router = useRouter()
  const { t } = useLanguage()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [validationError, setValidationError] = useState<string>('')
  const { edits, addEdit, undoLastEdit } = useEditTracker()

  useEffect(() => {
    // Mock fetching booking details based on unwrappedParams
    const mockBooking: Booking = {
      id: parseInt(unwrappedParams.id), // Use the unwrapped params
      facilityName: "Central Arena",
      date: "2024-01-20",
      time: "14:00",
      status: "upcoming",
      price: 50,
      duration: 60,
      courtNumber: 3,
      playerCount: 10
    }
    setBooking(mockBooking)
  }, [unwrappedParams.id]) // Adjust dependency to use unwrapped params

  const handleInputChange = (field: keyof Booking, value: string | number) => {
    if (!booking) return
    setBooking(prev => {
      const newState = { ...prev, [field]: value }
      addEdit({ field, oldValue: prev[field], newValue: value })
      return newState
    })
  }

  const validateBooking = (): boolean => {
    if (!booking) return false

    const bookingDate = new Date(booking.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (bookingDate < today) {
      setValidationError(t('date_cannot_be_in_past'))
      return false
    }

    if (!booking.time) {
      setValidationError(t('time_required'))
      return false
    }

    if (!booking.duration) {
      setValidationError(t('duration_required'))
      return false
    }

    setValidationError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateBooking()) return

    // In a real app, send the updated booking to an API
    console.log('Updating booking:', booking)
    router.push(`/my-reservations/${params.id}`)
  }

  if (!booking) {
    return null
  }

  return (
    <div className="mx-auto px-5 sm:px-4 md:px-6 space-y-6">
      <EditNotification editCount={edits.length} onUndo={undoLastEdit} />
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="mr-2 px-0"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">{t('modify_reservation')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{booking.facilityName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  {t('date')}
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={booking.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  <Clock className="w-4 h-4 inline-block mr-2" />
                  {t('time')}
                </Label>
                <Select
                  value={booking.time}
                  onValueChange={(value) => handleInputChange('time', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_time')} />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">{t('duration')} ({t('minutes')})</Label>
                <Select
                  value={booking.duration.toString()}
                  onValueChange={(value) => handleInputChange('duration', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_duration')} />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} {t('minutes')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courtNumber">
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  {t('court_number')}
                </Label>
                <Select
                  value={booking.courtNumber.toString()}
                  onValueChange={(value) => handleInputChange('courtNumber', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_court')} />
                  </SelectTrigger>
                  <SelectContent>
                    {COURTS.map((court) => (
                      <SelectItem key={court} value={court.toString()}>
                        {t('court')} {court}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="playerCount">{t('player_count')}</Label>
                <Select
                  value={booking.playerCount.toString()}
                  onValueChange={(value) => handleInputChange('playerCount', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_player_count')} />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYER_COUNTS.map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} {count === 1 ? t('player') : t('players')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {validationError && (
              <Alert variant="destructive">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('save_changes')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

