'use client'

import { useLanguage } from '@/components/language-provider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Check, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface BookingModalProps {
  facilityName: string
  facilityImage: string
  category: string
  rating: number
  onBooking: (date: Date, startTime: string, endTime: string, field: string) => void
  children: React.ReactNode
}

// Mock facility images - in a real app, these would come from your backend
const FACILITY_IMAGES = [
  "/placeholder.svg",
  "/placeholder.svg?1",
  "/placeholder.svg?2",
  "/placeholder.svg?3",
]

export function BookingModal({ facilityName, facilityImage, category, rating, onBooking, children }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [field, setField] = useState('')
  const { t } = useLanguage()

  const handleBooking = () => {
    if (date && startTime && endTime && field) {
      onBooking(date, startTime, endTime, field)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`${t('book_facility')} ${facilityName}`}</DialogTitle>
          <DialogDescription>
            {t('select_date_time')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">{t('facility_details')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
            <TabsTrigger value="booking">{t('booking_details')}</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              <Carousel className="w-full">
                <CarouselContent>
                  {FACILITY_IMAGES.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-64 w-full">
                        <Image
                          src={image}
                          alt={`${facilityName} - ${t('image')} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{facilityName}</h3>
                <p className="text-sm text-muted-foreground">{category}</p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{rating}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('facility_description')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('facility_description_text')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">{t('amenities')}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {t('parking')}
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {t('lockers')}
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {t('showers')}
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {t('equipment_rental')}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">{t('facility_reviews')}</h3>
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://i.pravatar.cc/32?img=${review}`} />
                      <AvatarFallback>U{review}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">User {review}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{t('mock_review')}</p>
                </div>
              ))}
              <div className="space-y-2">
                <h4 className="font-medium">{t('write_review')}</h4>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button key={star} variant="ghost" size="sm" className="p-0 h-8 w-8">
                      <Star className="h-6 w-6" />
                    </Button>
                  ))}
                </div>
                <Textarea placeholder={t('write_your_review')} />
                <Button>{t('submit_review')}</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="booking" className="mt-4 space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">{t('start_time')}</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">{t('end_time')}</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field">{t('select_field')}</Label>
              <Select onValueChange={setField}>
                <SelectTrigger id="field">
                  <SelectValue placeholder={t('select_field')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field1">{t('field')} 1</SelectItem>
                  <SelectItem value="field2">{t('field')} 2</SelectItem>
                  <SelectItem value="field3">{t('field')} 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              onClick={handleBooking}
              className="w-full"
              disabled={!date || !startTime || !endTime || !field}
            >
              {t('confirm_booking')}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

