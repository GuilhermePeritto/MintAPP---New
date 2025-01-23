'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, ChevronLeft, Clock, DollarSign, MapPin, Star, Users } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock facility data - in a real app, this would come from your API
const MOCK_FACILITY = {
  id: '1',
  name: "Central Soccer Complex",
  category: "Soccer Fields",
  rating: 4.8,
  totalReviews: 324,
  ranking: "Top 5%",
  description: "A modern soccer complex with multiple professional-grade fields and excellent facilities. Perfect for both casual games and competitive matches.",
  logo: "/placeholder.svg",
  coverImage: "/placeholder.svg",
  address: "123 Sports Avenue, Cityville",
  location: { lat: 40.7128, lng: -74.0060 },
  openingHours: "Monday to Sunday: 6:00 AM - 10:00 PM",
  pricePerHour: 50,
  capacity: "22 players per field (11 vs 11)",
  amenities: [
    { name: "Parking", icon: "Car" },
    { name: "Lockers", icon: "LockKeyhole" },
    { name: "Showers", icon: "Shower" },
    { name: "Equipment Rental", icon: "Football" },
    { name: "Floodlights", icon: "Lightbulb" },
    { name: "Spectator Seating", icon: "Users" },
  ],
  fields: [
    { id: '1', name: "Field A", type: "11-a-side", surface: "Natural Grass", image: "/placeholder.svg", category: "Full-size Fields" },
    { id: '2', name: "Field B", type: "11-a-side", surface: "Artificial Turf", image: "/placeholder.svg", category: "Full-size Fields" },
    { id: '3', name: "Field C", type: "7-a-side", surface: "Artificial Turf", image: "/placeholder.svg", category: "Small-sided Fields" },
    { id: '4', name: "Field D", type: "5-a-side", surface: "Artificial Turf", image: "/placeholder.svg", category: "Small-sided Fields" },
    { id: '5', name: "Indoor Court", type: "Futsal", surface: "Hardwood", image: "/placeholder.svg", category: "Indoor Fields" },
  ],
  recentReviews: [
    {
      id: 1,
      user: "Alice Johnson",
      avatar: "https://source.unsplash.com/random/100x100?portrait,woman",
      rating: 5,
      comment: "Excellent facilities and well-maintained fields. Highly recommended!",
      date: "2024-01-15"
    },
    {
      id: 2,
      user: "Bob Smith",
      avatar: "https://source.unsplash.com/random/100x100?portrait,man",
      rating: 4,
      comment: "Great place to play, but could use more parking spaces.",
      date: "2024-01-14"
    }
  ]
}

export default function BookingPage({ params }: { params: { facilityId: string } }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const position = userLocation || [MOCK_FACILITY.location.lat, MOCK_FACILITY.location.lng]

  const Map = dynamic(() => import("@/app/components/map"), { ssr: false });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude])
      })
    }
  }, [])

  // In a real app, you would fetch the facility data based on the facilityId
  const facility = MOCK_FACILITY

  const groupedFields = facility.fields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof facility.fields>);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="relative h-64 mb-6">
        <Image
          src={facility.coverImage || "/placeholder.svg"}
          alt={facility.name}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Image
            src={facility.logo || "/placeholder.svg"}
            alt={facility.name}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="absolute top-4 left-4 p-0 hover:bg-transparent text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{t('facility_details')}</TabsTrigger>
          <TabsTrigger value="location">{t('location')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{facility.name}</h2>
                  <p className="text-sm text-muted-foreground">{facility.category}</p>
                </div>
                <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 text-primary mr-1" />
                  <span className="font-semibold text-primary">{facility.rating}</span>
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
                      <span className="text-sm">{facility.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm">{facility.openingHours}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm">{t('price_per_hour', { price: facility.pricePerHour })}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm">{facility.capacity}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">{t('amenities')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {facility.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-5 w-5 mr-2 text-green-500" />
                          <span className="text-sm">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => router.push(`/book/${params.facilityId}/reviews`)}
                    variant="outline"
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-semibold text-lg">{facility.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {facility.totalReviews} {t('reviews')}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {facility.ranking}
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(groupedFields).map(([category, fields]) => (
            <Card key={category}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <Carousel className="w-full">
                  <CarouselContent>
                    {fields.map((field) => (
                      <CarouselItem key={field.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                          onClick={() => router.push(`/book/${params.facilityId}/fields/${field.id}`)}
                        >
                          <CardContent className="p-0">
                            <div className="relative h-48">
                              <Image
                                src={field.image || "/placeholder.svg"}
                                alt={field.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="w-full p-4 bg-card justify-between flex items-center">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-lg font-semibold text-muted-foreground mb-1">{field.name}</h4>
                                <p className="text-sm text-muted-foreground">{field.type}</p>
                              </div>
                              <span className="text-sm font-medium items-center text-muted-foreground">{field.surface}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-4">{t('facility_location')}</h3>
              <div className="h-[400px] rounded-lg">
                <Map center={position} markerPosition={position}/>
              </div>
              <p className="mt-4 text-muted-foreground">{facility.address}</p>
              <Button
                className="mt-4"
              >
                {t('get_directions')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

