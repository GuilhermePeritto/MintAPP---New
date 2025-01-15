'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Plus, Trash2, Save } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Goal, HandHelpingIcon as Assist, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useEditTracker } from '@/hooks/useEditTracker'
import { EditNotification } from '@/components/edit-notification'


interface TeamStats {
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  totalMinutes: number
}

interface Player {
  id: string
  name: string
  number: string
  position: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
  rating: number
  teamSide: 'home' | 'away'
}

interface GameResult {
  id: string
  date: string
  facility: string
  score: string
  notes: string
  players: Player[]
  homeTeam: string
  awayTeam: string
}

const POSITIONS = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward'
]

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// This should match the mock data from the main page
const MOCK_GAME_RESULTS = [
  { 
    id: '1', 
    date: '2023-07-15', 
    facility: 'Central Arena', 
    score: '3 - 2',
    notes: 'Great game!',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    players: [
      { id: '1', name: 'John Doe', number: '10', position: 'Forward', goals: 2, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 90, rating: 8, teamSide: 'home' },
      { id: '2', name: 'Jane Smith', number: '7', position: 'Midfielder', goals: 1, assists: 2, yellowCards: 1, redCards: 0, minutesPlayed: 80, rating: 7, teamSide: 'home' }
    ]
  },
  { 
    id: '2', 
    date: '2023-07-10', 
    facility: 'Downtown Field', 
    score: '1 - 1',
    notes: 'Tough match',
    homeTeam: 'Team C',
    awayTeam: 'Team D',
    players: [
      { id: '3', name: 'Mike Johnson', number: '9', position: 'Forward', goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90, rating: 6, teamSide: 'away' },
      { id: '4', name: 'Sarah Wilson', number: '5', position: 'Defender', goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 75, rating: 7, teamSide: 'home' }
    ]
  },
]

export default function EditGame({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    number: '',
    position: '',
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 0,
    rating: 7,
    teamSide: 'home'
  })
  const [isAddingPlayer, setIsAddingPlayer] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const { edits, addEdit, undoLastEdit } = useEditTracker()

  useEffect(() => {
    const result = MOCK_GAME_RESULTS.find(game => game.id === params.id)
    if (!result) {
      router.push('/register-game')
      return
    }
    setGameResult(result)
  }, [params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (gameResult) {
      setGameResult(prev => {
        const newState = { ...prev, [name]: value }
        addEdit({ field: name, oldValue: prev[name as keyof typeof prev], newValue: value })
        return newState
      })
    }
  }

  const handlePlayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPlayer(prev => ({
      ...prev,
      [name]: name === 'goals' || name === 'assists' || name === 'yellowCards' || name === 'redCards' || name === 'minutesPlayed' || name === 'rating' ? parseInt(value) || 0 : value
    }))
  }

  const handleAddPlayer = () => {
    if (!gameResult || !validatePlayer(newPlayer)) return

    setGameResult(prev => {
      const newPlayerObj = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPlayer.name!,
        number: newPlayer.number!,
        position: newPlayer.position!,
        goals: newPlayer.goals || 0,
        assists: newPlayer.assists || 0,
        yellowCards: newPlayer.yellowCards || 0,
        redCards: newPlayer.redCards || 0,
        minutesPlayed: newPlayer.minutesPlayed || 0,
        rating: newPlayer.rating || 7,
        teamSide: newPlayer.teamSide || 'home'
      }
      const newPlayers = [...prev.players, newPlayerObj]
      addEdit({ field: 'players', oldValue: prev.players, newValue: newPlayers })
      return { ...prev, players: newPlayers }
    })
    setNewPlayer({
      name: '',
      number: '',
      position: '',
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
      rating: 7,
      teamSide: 'home'
    })
    setIsAddingPlayer(false)
  }

  const handleRemovePlayer = (playerId: string) => {
    if (!gameResult) return
    setGameResult(prev => {
      const newPlayers = prev.players.filter(player => player.id !== playerId)
      addEdit({ field: 'players', oldValue: prev.players, newValue: newPlayers })
      return { ...prev, players: newPlayers }
    })
  }

  const handleUpdatePlayerStats = (playerId: string, field: keyof Player, value: string | number) => {
    if (!gameResult) return
    setGameResult(prev => {
      const newPlayers = prev.players.map(player =>
        player.id === playerId
          ? { ...player, [field]: field === 'goals' || field === 'assists' || field === 'yellowCards' || field === 'redCards' || field === 'minutesPlayed' || field === 'rating' ? parseInt(value.toString()) || 0 : value }
          : player
      )
      addEdit({ field: `player_${playerId}_${field}`, oldValue: prev.players.find(p => p.id === playerId)?.[field], newValue: value })
      return { ...prev, players: newPlayers }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updating game result:', gameResult)
    router.push('/register-game')
  }

  const validatePlayer = (player: Partial<Player>): boolean => {
    if (!player.name || player.name.trim() === '') {
      setValidationError(t('player_name_required'))
      return false
    }
    if (!player.number || player.number.trim() === '') {
      setValidationError(t('player_number_required'))
      return false
    }
    if (!player.position) {
      setValidationError(t('player_position_required'))
      return false
    }
    if (player.minutesPlayed && (player.minutesPlayed < 0 || player.minutesPlayed > 90)) {
      setValidationError(t('invalid_minutes_played'))
      return false
    }
    setValidationError('')
    return true
  }

  const calculateTeamStats = (teamSide: 'home' | 'away'): TeamStats => {
    const teamPlayers = gameResult.players.filter(p => p.teamSide === teamSide)
    return {
      goals: teamPlayers.reduce((sum, p) => sum + p.goals, 0),
      assists: teamPlayers.reduce((sum, p) => sum + p.assists, 0),
      yellowCards: teamPlayers.reduce((sum, p) => sum + p.yellowCards, 0),
      redCards: teamPlayers.reduce((sum, p) => sum + p.redCards, 0),
      totalMinutes: teamPlayers.reduce((sum, p) => sum + p.minutesPlayed, 0),
    }
  }

  if (!gameResult) {
    return null
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <EditNotification editCount={edits.length} onUndo={undoLastEdit} />
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="mr-2 px-0"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">{t('edit_match')}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('game_details')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">{t('game_details')}</TabsTrigger>
              <TabsTrigger value="players">{t('players')}</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{t('match_date')}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={gameResult.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility">{t('facility')}</Label>
                  <Input
                    id="facility"
                    name="facility"
                    value={gameResult.facility}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score">{t('score')}</Label>
                  <Input
                    id="score"
                    name="score"
                    placeholder="e.g. 3 - 2"
                    value={gameResult.score}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('game_notes')}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={t('enter_game_notes')}
                    value={gameResult.notes}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">{t('home_team')}</Label>
                  <Input
                    id="homeTeam"
                    name="homeTeam"
                    value={gameResult.homeTeam}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">{t('away_team')}</Label>
                  <Input
                    id="awayTeam"
                    name="awayTeam"
                    value={gameResult.awayTeam}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </TabsContent>

            <TabsContent value="players" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsAddingPlayer(!isAddingPlayer)}
                  variant="outline"
                >
                  {isAddingPlayer ? t('cancel') : t('add_player')}
                  {!isAddingPlayer && <Plus className="w-4 h-4 ml-2" />}
                </Button>
              </div>

              <Collapsible
                open={isAddingPlayer}
                onOpenChange={setIsAddingPlayer}
              >
                <CollapsibleContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('add_new_player')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => { e.preventDefault(); handleAddPlayer(); }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Basic Info */}
                          <div className="space-y-4">
                            <div>
                              <Label>{t('basic_info')}</Label>
                              <Input
                                placeholder={t('player_name')}
                                value={newPlayer.name}
                                onChange={(e) => handlePlayerInputChange(e)}
                                className="mt-2"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Input
                                  placeholder="#"
                                  value={newPlayer.number}
                                  onChange={(e) => handlePlayerInputChange(e)}
                                />
                              </div>
                              <div>
                                <Select
                                  value={newPlayer.teamSide}
                                  onValueChange={(value) => handlePlayerInputChange({ target: { name: 'teamSide', value } })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('team')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="home">{gameResult.homeTeam || t('home_team')}</SelectItem>
                                    <SelectItem value="away">{gameResult.awayTeam || t('away_team')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Position and Time */}
                          <div className="space-y-4">
                            <div>
                              <Label>{t('position_and_time')}</Label>
                              <Select
                                value={newPlayer.position}
                                onValueChange={(value) => handlePlayerInputChange({ target: { name: 'position', value } })}
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder={t('select_position')} />
                                </SelectTrigger>
                                <SelectContent>
                                  {POSITIONS.map(position => (
                                    <SelectItem key={position} value={position}>
                                      {position}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Input
                              type="number"
                              placeholder={t('minutes_played')}
                              value={newPlayer.minutesPlayed}
                              onChange={(e) => handlePlayerInputChange({ target: { name: 'minutesPlayed', value: e.target.value } })}
                              min="0"
                              max="90"
                            />
                          </div>

                          {/* Stats */}
                          <div className="space-y-4">
                            <Label>{t('match_stats')}</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">{t('goals')}</Label>
                                <Input
                                  type="number"
                                  value={newPlayer.goals}
                                  onChange={(e) => handlePlayerInputChange({ target: { name: 'goals', value: e.target.value } })}
                                  min="0"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">{t('assists')}</Label>
                                <Input
                                  type="number"
                                  value={newPlayer.assists}
                                  onChange={(e) => handlePlayerInputChange({ target: { name: 'assists', value: e.target.value } })}
                                  min="0"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">{t('yellow_cards')}</Label>
                                <Input
                                  type="number"
                                  value={newPlayer.yellowCards}
                                  onChange={(e) => handlePlayerInputChange({ target: { name: 'yellowCards', value: e.target.value } })}
                                  min="0"
                                  max="2"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">{t('red_cards')}</Label>
                                <Input
                                  type="number"
                                  value={newPlayer.redCards}
                                  onChange={(e) => handlePlayerInputChange({ target: { name: 'redCards', value: e.target.value } })}
                                  min="0"
                                  max="1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {validationError && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{validationError}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex justify-end">
                          <Button type="submit" className="w-full md:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('add_player')}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home Team Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{gameResult.homeTeam || t('home_team')}</span>
                      <Badge variant="outline" className="ml-2">
                        {gameResult.players.filter(p => p.teamSide === 'home').length} {t('players')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <StatsCard
                        icon={<Goal className="h-4 w-4" />}
                        value={calculateTeamStats('home').goals}
                        label={t('goals')}
                      />
                      <StatsCard
                        icon={<Assist className="h-4 w-4" />}
                        value={calculateTeamStats('home').assists}
                        label={t('assists')}
                      />
                      <StatsCard
                        icon={<Clock className="h-4 w-4" />}
                        value={Math.round(calculateTeamStats('home').totalMinutes / (gameResult.players.filter(p => p.teamSide === 'home').length || 1))}
                        label={t('avg_minutes')}
                      />
                    </div>
                    <PlayerList 
                      players={gameResult.players.filter(p => p.teamSide === 'home')}
                      onUpdatePlayer={handleUpdatePlayerStats}
                      onRemovePlayer={handleRemovePlayer}
                      t={t}
                    />
                  </CardContent>
                </Card>

                {/* Away Team Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{gameResult.awayTeam || t('away_team')}</span>
                      <Badge variant="outline" className="ml-2">
                        {gameResult.players.filter(p => p.teamSide === 'away').length} {t('players')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <StatsCard
                        icon={<Goal className="h-4 w-4" />}
                        value={calculateTeamStats('away').goals}
                        label={t('goals')}
                      />
                      <StatsCard
                        icon={<Assist className="h-4 w-4" />}
                        value={calculateTeamStats('away').assists}
                        label={t('assists')}
                      />
                      <StatsCard
                        icon={<Clock className="h-4 w-4" />}
                        value={Math.round(calculateTeamStats('away').totalMinutes / (gameResult.players.filter(p => p.teamSide === 'away').length || 1))}
                        label={t('avg_minutes')}
                      />
                    </div>
                    <PlayerList 
                      players={gameResult.players.filter(p => p.teamSide === 'away')}
                      onUpdatePlayer={handleUpdatePlayerStats}
                      onRemovePlayer={handleRemovePlayer}
                      t={t}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleSubmit} 
            className="w-full mt-6"
          >
            <Save className="h-4 w-4 mr-2"/>
            {t('update_match')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const StatsCard = ({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <span className="text-lg font-bold">{isNaN(value) ? '0' : value}</span>
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
)

const PlayerList = ({ 
  players, 
  onUpdatePlayer, 
  onRemovePlayer,
  t 
}: { 
  players: Player[], 
  onUpdatePlayer: (id: string, field: keyof Player, value: string | number) => void,
  onRemovePlayer: (id: string) => void,
  t: (key: string) => string 
}) => (
  <div className="space-y-4">
    {players.map((player) => (
      <Card key={player.id} className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <span className="text-lg font-bold text-primary">{player.number}</span>
              </div>
              <div>
                <h4 className="font-medium">{player.name}</h4>
                <p className="text-sm text-muted-foreground">{player.position}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemovePlayer(player.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            <StatInput
              label={t('goals')}
              value={player.goals}
              onChange={(value) => onUpdatePlayer(player.id, 'goals', value)}
              min={0}
              t={t}
            />
            <StatInput
              label={t('assists')}
              value={player.assists}
              onChange={(value) => onUpdatePlayer(player.id, 'assists', value)}
              min={0}
              t={t}
            />
            <StatInput
              label={t('yellow')}
              value={player.yellowCards}
              onChange={(value) => onUpdatePlayer(player.id, 'yellowCards', value)}
              min={0}
              max={2}
              className="bg-yellow-500/10"
              t={t}
            />
            <StatInput
              label={t('red')}
              value={player.redCards}
              onChange={(value) => onUpdatePlayer(player.id, 'redCards', value)}
              min={0}
              max={1}
              className="bg-red-500/10"
              t={t}
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Label className="text-xs">{t('minutes')}</Label>
              <Input
                type="number"
                value={player.minutesPlayed}
                onChange={(e) => onUpdatePlayer(player.id, 'minutesPlayed', parseInt(e.target.value))}
                min={0}
                max={90}
                className="mt-1"
              />
            </div>
            <div className="w-24">
              <Label className="text-xs">{t('rating')}</Label>
              <Select
                value={player.rating.toString()}
                onValueChange={(value) => onUpdatePlayer(player.id, 'rating', parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATINGS.map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const StatInput = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  className,
  t 
}: { 
  label: string, 
  value: number, 
  onChange: (value: number) => void,
  min?: number,
  max?: number,
  className?: string,
  t: (key: string) => string
}) => (
  <div>
    <Label className="text-xs">{t(label)}</Label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      min={min}
      max={max}
      className={cn("mt-1", className)}
    />
  </div>
)

