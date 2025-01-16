'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Gamepad, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Reservation {
  id: number
  locationName: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    locationName: "Cyber Arena",
    date: "2024-01-20",
    time: "15:00",
    status: "upcoming"
  },
  {
    id: 2,
    locationName: "VR Zone",
    date: "2024-01-18",
    time: "18:30",
    status: "completed"
  },
  {
    id: 3,
    locationName: "Game Over Pub",
    date: "2024-01-15",
    time: "20:00",
    status: "cancelled"
  }
]

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const getStatusColor = (status: Reservation['status']) => {
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-2 sm:p-4 pb-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Your Quests</h1>
        <p className="text-muted-foreground">Manage your upcoming gaming sessions</p>
      </div>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="bg-gray-900/50 border-primary/20 hover:border-primary transition-colors">
            <CardHeader className="p-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-lg mb-1 sm:mb-0">{reservation.locationName}</span>
                <span className={`text-sm ${getStatusColor(reservation.status)}`}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </span>
              </CardTitle>
              <CardDescription>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {reservation.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {reservation.time}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">View location</span>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white">
                  <Gamepad className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

