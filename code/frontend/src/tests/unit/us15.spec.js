import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/game'

describe('US15 - Fazer uma bandeira', () => {
  let game

  beforeEach(() => {
    setActivePinia(createPinia())
    game = useGameStore()

    //reset 
    game.playerScore = 0
    game.botScore = 0
    game.bandeira = false
    game.playerWins = []
    game.botWins = []
  })

  it('quando o jogador atinge 120 pontos é declarado vencedor (bandeira)', async () => {
    //10 As (110) + 1 sete (10) = 120 pontos
    const highScoreCards = [
      ...Array.from({ length: 10 }, () => ({ face: 'A' })),
      { face: '7' },
    ]

    game.playerWins = [...highScoreCards]
    game.botWins = []

    const playerPoints = game.calculatePoints(game.playerWins)
    const botPoints = game.calculatePoints(game.botWins)

    expect(playerPoints).toBe(120)
    expect(playerPoints).toBeGreaterThan(botPoints)

    await game.endGame()
    
    expect(game.bandeira).toBe(true)
    expect(game.playerScore).toBe(4)
  })

  it('não é bandeira se ficar abaixo de 120 pontos', async () => {
    // 10 As = 110 pontos
    const almostCards = Array.from({ length: 10 }, () => ({ face: 'A' }))

    game.playerWins = [...almostCards]
    game.botWins = []

    const playerPoints = game.calculatePoints(game.playerWins)
    expect(playerPoints).toBe(110)
    expect(playerPoints).toBeLessThan(120)

    await game.endGame()

    expect(game.bandeira).toBe(false)
    expect(game.playerScore).not.toBe(4)
  })
})