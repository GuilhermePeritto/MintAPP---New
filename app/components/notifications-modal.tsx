'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Notification {
  id: number
  title: string
  message: string
  date: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your booking for Central Soccer Field on July 15th has been confirmed.",
    date: "2023-07-10"
  },
  {
    id: 2,
    title: "New Facility Added",
    message: "Check out the new Indoor Badminton Center now available for booking!",
    date: "2023-07-08"
  },
  {
    id: 3,
    title: "Maintenance Notice",
    message: "The Downtown Basketball Court will be closed for maintenance on July 20th.",
    date: "2023-07-05"
  }
]

export function NotificationsModal() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5 text-primary" />
          {notifications.length > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary p-0 text-[10px] text-black"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-primary">Notifications</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="mb-4 p-3 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-primary">{notification.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

