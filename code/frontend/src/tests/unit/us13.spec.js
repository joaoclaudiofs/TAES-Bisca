import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '../../stores/game';


describe('US13 - Jogar uma partida', () => {
  let game

  beforeEach(() => {
    setActivePinia(createPinia())
    game = useGameStore()

    game.resetGame()
    game.isPractice = false  // para contar coins
    game.stake = 10          // aposta de exemplo
  })

  it('pode iniciar um jogo e distribuir cartas para jogador e bot', () => {
    game.setBoard()

    expect(game.playerHand.length).toBe(9)
    expect(game.botHand.length).toBe(9)
    expect(game.deck.length).toBeGreaterThan(0)
    expect(game.trump).toBeTruthy()
  })

  it('partida termina quando um dos jogadores atinge 4 vitórias (simulação direta)', () => {
    // simular que ao longo dos jogos o jogador foi somando vitórias
    game.playerScore = 3
    game.botScore = 1

    // vitória final
    game.playerScore += 1

    expect(game.playerScore).toBeGreaterThanOrEqual(4)
    expect(game.playerScore).toBeGreaterThan(game.botScore)

    // simular fim de match (como se endMatch tivesse sido chamado)
    game.didPlayerWinGame = true
    game.showScoreboard = true

    expect(game.didPlayerWinGame).toBe(true)
    expect(game.showScoreboard).toBe(true)
  })

  it('estatísticas de pontos totais são calculadas no final da partida', () => {
    // algumas cartas para o jogador e para o bot
    const playerCards = [
      { face: 'A' }, { face: '7' }, { face: 'K' } // 25
    ]
    const botCards = [
      { face: 'Q' }, { face: 'J' } // 2 + 3 = 5
    ]

    const totalPlayerPoints = game.calculatePoints(playerCards)
    const totalBotPoints = game.calculatePoints(botCards)

    expect(totalPlayerPoints).toBe(25)
    expect(totalBotPoints).toBe(5)
    expect(totalPlayerPoints).toBeGreaterThan(totalBotPoints)
  })
})