'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Share2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Player {
  id: string
  name: string
  number: string
  position: string
  goals: number
  assists: number
}

interface Game {
  id: string
  date: string
  opponent: string
  venue: string
  players: Player[]
  result?: string
  notes?: string
}

const MOCK_GAMES: Game[] = [
  {
    id: '1',
    date: '2023-07-15',
    opponent: 'Rival FC',
    venue: 'Home Stadium',
    players: [
      { id: '1', name: 'John Doe', number: '10', position: 'Forward', goals: 2, assists: 1 },
      { id: '2', name: 'Jane Smith', number: '8', position: 'Midfielder', goals: 0, assists: 2 },
    ],
    result: 'Win 3-1',
    notes: 'Great team performance!'
  },
  {
    id: '2',
    date: '2023-07-22',
    opponent: 'Away Team United',
    venue: 'Away Stadium',
    players: [
      { id: '1', name: 'John Doe', number: '10', position: 'Forward', goals: 1, assists: 0 },
      { id: '2', name: 'Jane Smith', number: '8', position: 'Midfielder', goals: 1, assists: 1 },
    ],
    result: 'Draw 2-2',
    notes: 'Tough match, but we managed to equalize.'
  },
]

const MOCK_VENUES = [
  { id: '1', name: 'Home Stadium' },
  { id: '2', name: 'Away Stadium' },
  { id: '3', name: 'Neutral Ground' },
]

export default function MatchRegistration() {
  const [games, setGames] = useState<Game[]>(MOCK_GAMES)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isAddingGame, setIsAddingGame] = useState(false)
  const [newGame, setNewGame] = useState<Partial<Game>>({ players: [] })
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({})
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const handleAddOrUpdateGame = () => {
    if (newGame.date && newGame.opponent && newGame.venue) {
      if (selectedGame) {
        // Update existing game
        setGames(games.map(game => game.id === selectedGame.id ? { ...game, ...newGame } as Game : game))
      } else {
        // Add new game
        const gameToAdd: Game = {
          id: (games.length + 1).toString(),
          date: newGame.date,
          opponent: newGame.opponent,
          venue: newGame.venue,
          players: newGame.players || [],
          result: newGame.result,
          notes: newGame.notes,
        }
        setGames([...games, gameToAdd])
      }
      setNewGame({ players: [] })
      setSelectedGame(null)
      setIsAddingGame(false)
    }
  }

  const handleEditGame = (game: Game) => {
    setSelectedGame(game)
    setNewGame(game)
    setIsAddingGame(true)
  }

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.number && newPlayer.position) {
      const playerToAdd: Player = {
        id: (newGame.players?.length || 0 + 1).toString(),
        name: newPlayer.name,
        number: newPlayer.number,
        position: newPlayer.position,
        goals: 0,
        assists: 0,
      }
      setNewGame(prev => ({
        ...prev,
        players: [...(prev.players || []), playerToAdd],
      }))
      setNewPlayer({})
    }
  }

  const handleUpdatePlayerStats = (playerId: string, field: keyof Player, value: number | string) => {
    setNewGame(prev => ({
      ...prev,
      players: prev.players?.map(player =>
        player.id === playerId ? { ...player, [field]: typeof value === 'number' ? value : value } : player
      ) || [],
    }))
  }

  const handleShareGame = (game: Game) => {
    // Implement sharing functionality here
    console.log('Sharing game:', game)
    alert(t('game_shared'))
  }

  return (
    <div className="mx-auto px-5 sm:px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">{t('match_registration')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('match_list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('opponent')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('venue')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('result')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.date}</TableCell>
                    <TableCell>{game.opponent}</TableCell>
                    <TableCell className="hidden md:table-cell">{game.venue}</TableCell>
                    <TableCell className="hidden md:table-cell">{game.result || t('not_played')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditGame(game)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleShareGame(game)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <Button onClick={() => { setIsAddingGame(true); setSelectedGame(null); setNewGame({ players: [] }) }} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            {t('add_match')}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isAddingGame} onOpenChange={setIsAddingGame}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedGame ? t('edit_match') : t('add_match')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                value={newGame.date || ''}
                onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="opponent">{t('opponent')}</Label>
              <Input
                id="opponent"
                value={newGame.opponent || ''}
                onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">{t('venue')}</Label>
              <Select onValueChange={(value) => setNewGame({ ...newGame, venue: value })}>
                <SelectTrigger id="venue">
                  <SelectValue placeholder={t('select_venue')} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_VENUES.map((venue) => (
                    <SelectItem key={venue.id} value={venue.name}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">{t('result')}</Label>
              <Input
                id="result"
                value={newGame.result || ''}
                onChange={(e) => setNewGame({ ...newGame, result: e.target.value })}
                placeholder="0 - 0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                value={newGame.notes || ''}
                onChange={(e) => setNewGame({ ...newGame, notes: e.target.value })}
                placeholder={t('match_notes_placeholder')}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('players')}</Label>
              <div className="space-y-2">
                {newGame.players?.map((player) => (
                  <div key={player.id} className="flex items-center space-x-2">
                    <Input
                      value={player.name}
                      onChange={(e) => handleUpdatePlayerStats(player.id, 'name', e.target.value)}
                      placeholder={t('player_name')}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      value={player.goals}
                      onChange={(e) => handleUpdatePlayerStats(player.id, 'goals', parseInt(e.target.value))}
                      placeholder={t('goals')}
                      className="w-16"
                    />
                    <Input
                      type="number"
                      value={player.assists}
                      onChange={(e) => handleUpdatePlayerStats(player.id, 'assists', parseInt(e.target.value))}
                      placeholder={t('assists')}
                      className="w-16"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewGame(prev => ({
                          ...prev,
                          players: prev.players?.filter(p => p.id !== player.id) || []
                        }))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder={t('player_name')}
                  value={newPlayer.name || ''}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                />
                <Button onClick={handleAddPlayer}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add_player')}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddOrUpdateGame}
              disabled={!newGame.date || !newGame.opponent || !newGame.venue}
            >
              {selectedGame ? t('update_match') : t('add_match')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

