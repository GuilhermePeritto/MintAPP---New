'use client'

import { useLanguage } from '@/components/language-provider'
import { ClipboardList, History, Home, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: Home, label: 'home', href: '/dashboard' },
  { icon: Search, label: 'search', href: '/search' },
  { icon: History, label: 'reservations', href: '/my-reservations' },
  { icon: ClipboardList, label: 'match_registration', href: '/register-game' },
]

export function MobileNav() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[9999]">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.href}>
            <button
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center justify-center w-16 h-16 text-muted-foreground hover:text-primary"
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{t(item.label)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

