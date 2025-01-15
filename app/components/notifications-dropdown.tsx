'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5 text-primary" />
          {notifications.length > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-primary p-0 text-[10px] text-primary-foreground"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-2">
              <div className="font-semibold">{notification.title}</div>
              <div className="text-sm text-muted-foreground">{notification.message}</div>
              <div className="text-xs text-muted-foreground mt-1">{notification.date}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

