'use client'

import { useLanguage } from '@/components/language-provider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { CalendarIcon, Check, ChevronLeft, Clock, DollarSign, MapPin, Star, Users } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Mock facility data - in a real app, this would come from your API
const MOCK_FACILITY = {
  id: '1',
  name: "Central Soccer Field",
  category: "Soccer Fields",
  rating: 4.8,
  description: "A modern soccer field with professional-grade turf and excellent facilities. Perfect for both casual games and competitive matches.",
  images: [
    "/placeholder.svg",
    "/placeholder.svg?1",
    "/placeholder.svg?2",
    "/placeholder.svg?3",
  ],
  address: "123 Sports Avenue, Cityville",
  openingHours: "Monday to Sunday: 6:00 AM - 10:00 PM",
  pricePerHour: 50,
  capacity: "22 players (11 vs 11)",
  amenities: [
    { name: "Parking", icon: "Car" },
    { name: "Lockers", icon: "LockKeyhole" },
    { name: "Showers", icon: "Shower" },
    { name: "Equipment Rental", icon: "Football" },
    { name: "Floodlights", icon: "Lightbulb" },
    { name: "Spectator Seating", icon: "Users" },
  ]
}

// Mock facility images - in a real app, these would come from your backend
const FACILITY_IMAGES = [
  "/placeholder.svg",
  "/placeholder.svg?1",
  "/placeholder.svg?2",
  "/placeholder.svg?3",
]

export default function BookingPage({ params }: { params: { facilityId: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [field, setField] = useState('')
  const { t } = useLanguage()
  const router = useRouter()

  // In a real app, you would fetch the facility data based on the facilityId
  const facility = MOCK_FACILITY

  const handleBooking = () => {
    if (date && startTime && endTime && field) {
      // Here you would typically send the booking data to your backend
      console.log('Booking:', { facilityId: params.facilityId, date, startTime, endTime, field })
      // After successful booking, redirect to a confirmation page or dashboard
      router.push('/dashboard')
    }
  }

  return (
    <div className="mx-auto px-8 sm:px-4 md:px-6 py-6">
      <div className="flex items-center mb-6 space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="p-0 hover:bg-transparent"
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">{facility.name}</h1>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{t('facility_details')}</TabsTrigger>
          <TabsTrigger value="booking">{t('booking_details')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {FACILITY_IMAGES.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-64 w-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${facility.name} - ${t('image')} ${index + 1}`}
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{facility.name}</h2>
                  <p className="text-sm text-muted-foreground">{facility.category}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{facility.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">{t('facility_description')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {facility.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      <span>{facility.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span>{facility.openingHours}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span>{t('price_per_hour', { price: facility.pricePerHour })}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span>{facility.capacity}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">{t('amenities')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {facility.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('facility_reviews')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-60 overflow-y-auto space-y-4 pr-2">
                {[1, 2, 3, 4, 5].map((review) => (
                  <div key={review} className="border-b pb-4 last:border-b-0">
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
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">{t('write_review')}</h4>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button key={star} variant="ghost" size="sm" className="p-0 h-8 w-8">
                      <Star className={`h-6 w-6 ${star <= 3 ? 'text-yellow-500' : 'text-gray-300'}`} />
                    </Button>
                  ))}
                </div>
                <Textarea placeholder={t('write_your_review')} className="w-full" />
                <Button className="w-full">{t('submit_review')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">{t('select_date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{t('pick_a_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">{t('start_time')}</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">{t('end_time')}</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
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
                onClick={handleBooking}
                className="w-full"
                disabled={!date || !startTime || !endTime || !field}
              >
                {t('confirm_booking')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

