'use client'

import { useLanguage } from '@/components/language-provider'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Calendar, Camera, CreditCard, Edit, Eye, EyeOff, HelpCircle, LogOut, Settings, Shield, Star, Trophy, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { calculateLevel, calculateXpToNextLevel, getAchievements } from '../../lib/user-progression'

interface UserStats {
  xp: number
  bookings: number
  achievements: number
  memberSince: string
}

interface UserProfile {
  name: string
  email: string
  bio: string
  avatar: string
  phone: string
  birthdate: string
  document: string
}

export default function Profile() {
  const router = useRouter()
  const { t } = useLanguage()
  const [stats, setStats] = useState<UserStats>({
    xp: 1250,
    bookings: 25,
    achievements: 7,
    memberSince: '2023'
  })
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Player One',
    email: 'player@example.com',
    bio: 'Elite Gamer',
    avatar: '/placeholder.svg',
    phone: '+1234567890',
    birthdate: '1990-01-01',
    document: '123456789'
  })
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar)

  const achievements = useMemo(() => getAchievements(t), [t])

  const menuItems = [
    { icon: <Bell className="h-5 w-5" />, label: t('notifications'), badge: "3" },
    { icon: <CreditCard className="h-5 w-5" />, label: t('payment_methods') },
    { icon: <Settings className="h-5 w-5" />, label: t('settings') },
    { icon: <HelpCircle className="h-5 w-5" />, label: t('help_support'), href: '/help' },
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedProfile = {
      ...userProfile,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      bio: formData.get('bio') as string,
      phone: formData.get('phone') as string,
      birthdate: formData.get('birthdate') as string,
      document: formData.get('document') as string,
      avatar: avatarPreview
    }
    setUserProfile(updatedProfile)
    setShowEditDialog(false)
  }

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('passwords_dont_match'))
      return
    }
    // Here you would typically send the password update to your backend
    console.log('Password updated')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const currentLevel = calculateLevel(stats.xp)
  const xpToNextLevel = calculateXpToNextLevel(stats.xp)

  return (
    <div className="min-h-screen bg-background text-foreground pb-5 px-2 sm:px-4">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col sm:flex-row sm:items-end">
          <div className="relative mb-2 sm:mb-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-primary overflow-hidden">
              <Image
                src={userProfile.avatar}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <Badge className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-xs">
              {t('level')} {currentLevel.level} - {currentLevel.title}
            </Badge>
          </div>
          <div className="sm:ml-4 sm:mb-2 flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold">{userProfile.name}</h1>
            <p className="text-sm text-primary/70">{userProfile.bio}</p>
          </div>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                <Edit className="h-4 w-4 mr-2" />
                {t('edit_profile')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('edit_profile')}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">{t('personal_info')}</TabsTrigger>
                  <TabsTrigger value="contact">{t('contact_info')}</TabsTrigger>
                  <TabsTrigger value="security">{t('security')}</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-24 h-24">
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          fill
                          className="rounded-full object-cover"
                        />
                        <Label
                          htmlFor="avatar"
                          className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('full_name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={userProfile.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('bio')}</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={userProfile.bio}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">{t('birth_date')}</Label>
                      <Input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        defaultValue={userProfile.birthdate}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {t('save_changes')}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="contact">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userProfile.email}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phone_number')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={userProfile.phone}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document">{t('id_document')}</Label>
                      <Input
                        id="document"
                        name="document"
                        defaultValue={userProfile.document}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {t('save_changes')}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="security">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('current_password')}</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                        >
                          {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('new_password')}</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        >
                          {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('confirm_new_password')}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        >
                          {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {t('passwords_dont_match')}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full">
                      {t('update_password')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-6">
        <Card className="bg-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-primary/70">{t('xp_progress')}</span>
              <span className="text-sm text-primary">{stats.xp}/{currentLevel.xpRequired + xpToNextLevel} XP</span>
            </div>
            <Progress value={(stats.xp / (currentLevel.xpRequired + xpToNextLevel)) * 100} className="h-2" />
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
              <div className="text-center">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold">{stats.xp}</div>
                <div className="text-xs text-primary/70">{t('xp')}</div>
              </div>
              <div className="text-center">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold">{stats.achievements}</div>
                <div className="text-xs text-primary/70">{t('achievements')}</div>
              </div>
              <div className="text-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold">{stats.bookings}</div>
                <div className="text-xs text-primary/70">{t('bookings')}</div>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold">{stats.memberSince}</div>
                <div className="text-xs text-primary/70">{t('member_since')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary">{t('recent_achievements')}</h2>
          <div className="grid gap-4">
            {achievements.slice(0, 3).map((achievement) => (
              <Card key={achievement.id} className="bg-card border-primary/20">
                <CardContent className="p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{achievement.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left h-10 sm:h-12 px-3 sm:px-4 hover:bg-primary/20 text-sm sm:text-base"
              onClick={() => item.href ? router.push(item.href) : null}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto bg-primary text-primary-foreground text-xs">{item.badge}</Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t('end_session')}
        </Button>
      </div>
    </div>
  )
}

