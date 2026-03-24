import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/game'

/**
 * US14 - “Fazer um capote”
 *
 * Regra implementada em endGame (gameStore):
 *  - Se o jogador terminar um jogo com entre 91 e 119 pontos:
 *      -> recebe 2 vitórias em vez de 1
 *      -> capoteCount aumenta (mais um capote realizado)
 *
 * Aqui NÃO chamamos endGame (async, depende do fluxo do jogo).
 * Só usamos:
 *  - calculatePoints  -> para garantir que o conjunto de cartas está na zona 91‑119
 *  - variáveis locais  -> para simular a regra de capote
 */
describe('US14 - Fazer um capote', () => {
  let game

  beforeEach(() => {
    setActivePinia(createPinia())
    game = useGameStore()

    // reset
    game.playerScore = 0
    game.botScore = 0
    game.capoteCount = 0
    game.playerWins = []
    game.botWins = []

  })

  it('quando o jogador termina com 91-119 pontos recebe 2 vitórias (capote)', async () => {

    const cartasJogador = [
      { face: 'A' }, { face: 'A' }, { face: 'A' }, { face: 'A' }, // 44
      { face: '7' }, { face: '7' }, { face: '7' }, { face: '7' }, // 40 -> 84
      { face: 'K' }, { face: 'K' }, { face: 'K' },                // 12 -> 96
    ]

    game.playerWins = [...cartasJogador]
    game.botWins = []
    
    const playerPoints = game.calculatePoints(game.playerWins)
    expect(playerPoints).toBeGreaterThanOrEqual(91)
    expect(playerPoints).toBeLessThanOrEqual(119)

    await game.endGame()

    expect(game.playerScore).toBe(2)
    expect(game.capoteCount).toBe(1)
  })

  it('não há capote se o jogador tiver 90 pontos ou menos (vitória normal)', async () => {

    //  A (11) + 7 (10) + K (4) + Q (2) = 27
    const cartasJogador = [
      { face: 'A' },
      { face: '7' },
      { face: 'K' },
      { face: 'Q' },
    ]

    game.playerWins = [...cartasJogador]
    game.botWins = []
    const playerPoints = game.calculatePoints(game.playerWins)

    expect(playerPoints).toBeLessThanOrEqual(90)

    await game.endGame()

    expect(game.capoteCount).toBe(0)
    expect(game.playerScore).toBe(1)
  })
})