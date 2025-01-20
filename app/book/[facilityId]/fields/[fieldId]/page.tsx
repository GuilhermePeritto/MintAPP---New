'use client'

import { useLanguage } from '@/components/language-provider'
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
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, Clock, GrapeIcon as Grass, Ruler, Users } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock facility and field data - in a real app, this would come from your API
const MOCK_FACILITY = {
  id: '1',
  name: "Central Soccer Complex",
  fields: [
    {
      id: '1',
      name: "Field A",
      type: "11-a-side",
      surface: "Natural Grass",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      category: "Full-size Fields",
      description: "A professional-grade natural grass field perfect for full-sized soccer matches. Features excellent drainage and is maintained to the highest standards.",
      capacity: "22 players",
      dimensions: "105m x 68m"
    },
    { id: '2', name: "Field B", type: "11-a-side", surface: "Artificial Turf", images: ["/placeholder.svg"], category: "Full-size Fields", description: "A high-quality artificial turf field suitable for various sports. Offers excellent playing conditions.", capacity: "22 players", dimensions: "105m x 68m" },
    { id: '3', name: "Field C", type: "7-a-side", surface: "Artificial Turf", images: ["/placeholder.svg"], category: "Small-sided Fields", description: "Ideal for smaller games and training sessions. Durable artificial turf surface.", capacity: "14 players", dimensions: "70m x 50m" },
    { id: '4', name: "Field D", type: "5-a-side", surface: "Artificial Turf", images: ["/placeholder.svg"], category: "Small-sided Fields", description: "Perfect for casual games and training. Well-maintained artificial turf.", capacity: "10 players", dimensions: "40m x 25m" },
    { id: '5', name: "Indoor Court", type: "Futsal", surface: "Hardwood", images: ["/placeholder.svg"], category: "Indoor Courts", description: "A smooth hardwood court suitable for futsal and other indoor sports.", capacity: "10 players", dimensions: "20m x 40m" },
  ]
}

export default function FieldBookingPage({ params: initialParams }: { params: { facilityId: string; fieldId: string } }) {
  const [params, setParams] = useState<{ facilityId: string; fieldId: string } | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const resolvedParams = await initialParams; // Resolve os params
      setParams(resolvedParams);
    })();
  }, [initialParams]);

  if (!params) {
    return <div>{t('loading')}</div>; // Exibe um placeholder enquanto os params são resolvidos
  }

  const facility = MOCK_FACILITY;
  const field = facility.fields.find((f) => f.id === params.fieldId);

  if (!field) {
    return <div>{t('field_not_found')}</div>;
  }

  const handleBooking = () => {
    if (date && startTime && endTime) {
      console.log('Booking:', { facilityId: params.facilityId, fieldId: params.fieldId, date, startTime, endTime });
      router.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6 space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0 hover:bg-transparent"
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">{t('book_field', { name: field.name })}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{field.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full mb-6">
              <CarouselContent>
                {field.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-64 w-full">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${field.name} - Image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="space-y-4">
              <p className="text-lg">{field.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('capacity')}</h3>
                    <p>{field.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('dimensions')}</h3>
                    <p>{field.dimensions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Grass className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('surface')}</h3>
                    <p>{field.surface}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{t('field_type')}</h3>
                    <p>{field.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('booking_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <Button
              onClick={handleBooking}
              className="w-full"
              disabled={!date || !startTime || !endTime}
            >
              {t('confirm_booking')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

