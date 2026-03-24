import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '../../stores/game';

describe('unit test us11 - Começar um jogo', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    // deterministic turn (player starts) and avoid bot auto-play side effects
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    store = useGameStore();
    if (typeof store.setAutoPlay === 'function') store.setAutoPlay(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('setBoard distribui 9 cartas para cada jogador, define trunfo e deixa 21 no deck', () => {
    store.setBoard();

    expect(store.playerHand.length).toBe(9);
    expect(store.botHand.length).toBe(9);
    expect(store.trump).toBeTruthy();
    expect(store.deck.length).toBe(21);
  });

  it('todas as 40 cartas são únicas após o deal (sem duplicados entre mãos, deck e trunfo)', () => {
    store.setBoard();

    const ids = new Set();

    for (const c of store.playerHand) ids.add(c.id);
    for (const c of store.botHand) ids.add(c.id);
    for (const c of store.deck) ids.add(c.id);

    // trump pode ser um objeto único
    if (store.trump && store.trump.id != null) ids.add(store.trump.id);

    // total de cartas no jogo é 40
    expect(ids.size).toBe(40);

    // garantir que não haja sobreposição entre mãos
    const playerIds = new Set(store.playerHand.map(c => c.id));
    const botIds = new Set(store.botHand.map(c => c.id));
    for (const id of playerIds) expect(botIds.has(id)).toBe(false);
  });

  it('chamar setBoard novamente limpa as mãos', () => {
    store.setBoard();

    // inserir carta de teste na mão do jogador
    const fake = { id: 99999, suit: 'test', face: 'X' };
    store.playerHand.push(fake);
    expect(store.playerHand.findIndex(c => c.id === fake.id)).toBeGreaterThan(-1);

    
    store.setBoard();
    expect(store.playerHand.length).toBe(9);
    expect(store.playerHand.findIndex(c => c.id === fake.id)).toBe(-1);
  });
});