'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface GameResult {
  id: string
  date: string
  facility: string
  score: string
  notes?: string
  players?: Array<{
    id: string
    name: string
    number: string
    position: string
    goals: number
    assists: number
  }>
}

const MOCK_GAME_RESULTS: GameResult[] = [
  {
    id: '1',
    date: '2023-07-15',
    facility: 'Central Arena',
    score: '3 - 2',
    notes: 'Great game!',
    players: [
      { id: '1', name: 'John Doe', number: '10', position: 'Forward', goals: 2, assists: 1 },
      { id: '2', name: 'Jane Smith', number: '7', position: 'Midfielder', goals: 1, assists: 2 }
    ]
  },
  {
    id: '2',
    date: '2023-07-10',
    facility: 'Downtown Field',
    score: '1 - 1',
    notes: 'Tough match',
    players: [
      { id: '3', name: 'Mike Johnson', number: '9', position: 'Forward', goals: 1, assists: 0 },
      { id: '4', name: 'Sarah Wilson', number: '5', position: 'Defender', goals: 0, assists: 1 }
    ]
  },
]

export default function GameResults() {
  const router = useRouter()
  const { t } = useLanguage()
  const [gameResults, setGameResults] = useState<GameResult[]>(MOCK_GAME_RESULTS)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  return (
    <div className="mx-auto px-5 sm:px-4 md:px-6 space-y-6 pt-4">
      <div className="flex items-center mb-6">
        {isMobile && (
          <Button
            variant="ghost"
            className="mr-2 p-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">{t('game_results')}</h1>
      </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <Button onClick={() => router.push('/register-game/new')} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> {t('add_game_results')}
          </Button>
        </div>

      <div className="space-y-4">
        {gameResults.map((result) => (
          <Card
            key={result.id}
            className="hover:bg-accent transition-colors cursor-pointer"
            onClick={() => router.push(`/register-game/${result.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{result.facility}</h3>
                  <p className="text-sm text-muted-foreground">{result.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">{result.score}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.players?.length || 0} {t('players')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

