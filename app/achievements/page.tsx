'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Gamepad, Sword, Zap, Star } from 'lucide-react'
import { getAchievements, Achievement } from '@/lib/user-progression'
import { useLanguage } from '@/components/language-provider'

export default function Achievements() {
  const router = useRouter()
  const [achievementsState, setAchievements] = useState<Achievement[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    setAchievements(getAchievements(t))
  }, [t])

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-primary">{t('achievements')}</h1>
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

