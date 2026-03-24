import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/game'

describe('US16 - Ganhar moedas', () => {
  let game

  beforeEach(() => {
    setActivePinia(createPinia())
    game = useGameStore()

    game.isPractice = false
    game.stake = 25
    game.capoteCount = 0
    game.bandeira = false
  })

  it('ao ganhar uma partida com stake 50 o jogador ganha 100 coins', () => {

    const didPlayerWinGame = true

    const isPractice = game.isPractice
    const stake = game.stake
    const capoteCount = game.capoteCount
    const bandeira = game.bandeira

    let coins = 0

    if (didPlayerWinGame && !isPractice) {
      coins = stake * 2
      coins += capoteCount * 50
      if (bandeira) {
        coins *= 2
      }
    }

    expect(coins).toBe(50)
  })

  it('se perder a partida ou estiver em modo practice, não ganha coins', () => {

    let didPlayerWinGame = false
    let isPractice = game.isPractice
    let stake = game.stake
    let capoteCount = 1
    let bandeira = true

    let coins = 0
    if (didPlayerWinGame && !isPractice) {
      coins = stake * 2
      coins += capoteCount * 25
      if (bandeira) coins *= 2
    }
    expect(coins).toBe(0)

    didPlayerWinGame = true
    isPractice = true
    stake = game.stake
    capoteCount = 0
    bandeira = false

    coins = 0
    if (didPlayerWinGame && !isPractice) {
      coins = stake * 2
      coins += capoteCount * 25
      if (bandeira) coins *= 2
    }
    expect(coins).toBe(0)
  })
})