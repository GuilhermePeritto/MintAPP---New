'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from '@/components/language-provider'

interface Friend {
  id: number
  name: string
  avatar: string
}

const MOCK_FRIENDS: Friend[] = [
  { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg" },
  { id: 2, name: "Bob Smith", avatar: "/placeholder.svg" },
  { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg" },
]

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS)
  const [inviteEmail, setInviteEmail] = useState('')
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the invitation to your backend
    console.log('Inviting:', inviteEmail)
    setInviteEmail('')
    // Show a success message to the user
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-primary">{t('friends')}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('invite_friend')}</CardTitle>
          <CardDescription>{t('invite_friend_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex space-x-2">
            <Input
              type="email"
              placeholder={t('friend_email')}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">{t('send_invite')}</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4 text-primary">{t('your_friends')}</h2>
      <div className="space-y-4">
        {friends.map((friend) => (
          <Card key={friend.id}>
            <CardContent className="flex items-center p-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-semibold">{friend.name}</h3>
              </div>
              <Button variant="outline" size="sm">{t('challenge')}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

