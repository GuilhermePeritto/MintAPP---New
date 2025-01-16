'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Achievement, getAchievements } from '@/lib/user-progression'
import { ChevronLeft, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Achievements() {
  const router = useRouter()
  const [achievementsState, setAchievements] = useState<Achievement[]>([])
  const { t } = useLanguage()
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

  useEffect(() => {
    setAchievements(getAchievements(t))
  }, [t])

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-5">
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
        <h1 className="text-2xl font-bold text-primary">{t('achievements')}</h1>
      </div>
      <div className="grid gap-4">
        {achievementsState.map((achievement) => (
          <Card key={achievement.id} className={`bg-card border-primary/20 ${achievement.unlocked ? 'border-primary' : ''}`}>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`rounded-full p-2 ${achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 flex items-center">
                  {achievement.name}
                  {achievement.unlocked && <Zap className="h-4 w-4 text-yellow-500 ml-2" />}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <p className="text-xs text-primary">+{achievement.xpReward} XP</p>
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {achievement.progress} / {achievement.maxProgress}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

