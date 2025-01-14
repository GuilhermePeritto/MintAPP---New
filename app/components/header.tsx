'use client'

import { useLanguage } from '@/components/language-provider'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Activity, CreditCard, Gamepad, HelpCircle, History, LogOut, Settings, Trophy, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookingHistoryButton } from './booking-history-button'
import { NotificationsDropdown } from './notifications-dropdown'

export function Header() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Gamepad className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary text-lg">{t('app_name')}</span>
        </Link>
        <div className="flex items-center space-x-4">
          <NotificationsDropdown />
          <BookingHistoryButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full"
              >
                <Image
                  src="/placeholder.svg"
                  alt="Profile"
                  className="rounded-full object-cover"
                  fill
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{t('user_name')}</p>
                  <p className="text-xs leading-none text-muted-foreground">{t('user_email')}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/achievements')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>{t('achievements')}</span>
                  <Badge className="ml-auto" variant="secondary">7</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/friends')}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  <span>{t('friends')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/game-details')}
                >
                  <Gamepad className="mr-2 h-4 w-4" />
                  <span>{t('match_registration')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/booking-history')}
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>{t('booking_history')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/payment-methods')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{t('payment_methods')}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/help')}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>{t('help_support')}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

