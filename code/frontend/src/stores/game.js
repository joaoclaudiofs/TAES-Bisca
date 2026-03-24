import { set } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { ref } from "vue";
import { useAPIStore } from "./api";
import { toast } from "vue-sonner";

export const useGameStore = defineStore("game", () => {
  let isPractice = ref(true);
  let stake = ref(0);

  const authStore = useAuthStore();
  const apiStore = useAPIStore();

  const deck = ref([]);

  const suits = ["hearts", "diamonds", "spades", "clubs"];

  const faces = ["A", "7", "K", "J", "Q", "6", "5", "4", "3", "2"];
  const cardPoints = {
    A: 11,
    7: 10,
    K: 4,
    J: 3,
    Q: 2,
    6: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
  };

  const MAX_WINS = 4;
  const TEST = false;

  let playerHand = ref([]);
  let botHand = ref([]);

  let playerWins = ref([]);
  let botWins = ref([]);

  const trump = ref([]);

  let board = ref([]);
  let isPlayersTurn = ref();

  let playerScore = ref(0);
  let botScore = ref(0);
  let isPlayerFirstTurn = null;

  let coins = ref(0);
  let didPlayerWinGame = ref();
  let showScoreboard = ref(false);

  let beganAt = ref(undefined);
  let endedAt = ref(undefined);
  let matchBeganAt = ref(undefined);

  let matchId = ref(undefined);
  let playerTotalPoints = ref(0);
  let botTotalPoints = ref(0);

  let bandeira = ref(false);
  let capoteCount = ref(0);

  let playerPoints = ref(0);
  let botPoints = ref(0);

  //Fisher-Yates shuffle algorithm
  function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  const setBoard = () => {
    console.log(isPractice.value);
    console.log(stake.value);

    if (
      playerTotalPoints.value + botTotalPoints.value === 0 &&
      authStore.currentUser
    ) {
      if (!isPractice.value) {
        matchBeganAt.value = new Date();
        //primeiro jogo
        const match = {
          player1_user_id: authStore.currentUser.id,
          player2_user_id: null,
          began_at: matchBeganAt.value,
          type: "9",
          status: "Playing",
          stake: stake.value,
        };

        toast.promise(apiStore.postMatch(match), {
          loading: "Sending data to API...",
          success: (data) => {
            matchId.value = data.data.id;
            return `[API] Match ${matchId.value} saved successfully`;
          },
          error: (data) =>
            `[API] Error saving match - ${data?.response?.data?.message}`,
        });
      }
    }

    deck.value = [];

    playerHand.value = [];
    botHand.value = [];

    playerWins.value = [];
    botWins.value = [];

    board.value = [];
    trump.value = [];

    //preencher o deck
    let counter = 0;
    suits.forEach((suit) => {
      faces.forEach((face) => {
        deck.value.push({
          id: counter++,
          suit: suit,
          face: face,
        });
      });
    });

    //baralhar as cartas
    shuffle(deck.value);

    //dar 9 cartas ao utilizador e ao bot
    playerHand.value = deck.value.splice(0, 9);
    botHand.value = deck.value.splice(0, 9);

    //definir o trunfo
    trump.value = deck.value.pop();

    if (isPlayerFirstTurn === null) {
      //quem começa é random
      isPlayersTurn.value = Math.random() < 0.5;
      isPlayerFirstTurn = isPlayersTurn.value;
    } else {
      //alternar quem começa
      isPlayerFirstTurn = !isPlayerFirstTurn;
      isPlayersTurn.value = isPlayerFirstTurn;
    }

    if (!isPlayersTurn.value) {
      botPlay();
    }

    beganAt.value = new Date();
  };

  const playCard = (card) => {
    //verificar se é o seu turno
    if (!isPlayersTurn.value || board.value.length === 2) {
      return;
    }

    //se a mesa estiver vazia, pode jogar qualquer carta
    const cardIndex = playerHand.value.findIndex((c) => c.id === card.id);
    if (board.value.length === 0) {
      board.value.push(card);
      playerHand.value.splice(cardIndex, 1);
      isPlayersTurn.value = false;
      botPlay();
      return;
    }

    //verificar se tem alguma carta do mesmo naipe
    const suit = board.value[0].suit;
    const hasSameSuit = playerHand.value.some((c) => c.suit === suit);

    if (deck.value.length == 0 && hasSameSuit && card.suit != suit) {
      return;
    }

    //jogar carta
    board.value.push(card);
    playerHand.value.splice(cardIndex, 1);
    finishPlay();
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function botPlay() {
    isPlayersTurn.value = false;
    //esperar 2 segundos
    await sleep(2000);

    let suit;
    if (board.value.length != 0) {
      suit = board.value[0].suit;
    } else {
      suit = trump.value.suit;
    }
    const cards = botHand.value.filter((c) => c.suit == suit);

    let card;
    if (cards.length != 0) {
      card = cards[0];
    } else {
      card = botHand.value[0];
    }

    const cardIndex = botHand.value.findIndex((c) => c.id === card.id);
    board.value.push(card);
    botHand.value.splice(cardIndex, 1);

    if (board.value.length == 1) {
      isPlayersTurn.value = true;
    } else {
      finishPlay();
    }
  }

  async function finishPlay() {
    isPlayersTurn.value = null;
    //esperar 1 segundo
    await sleep(1000);

    //verificar quem venceu
    let firstCardWinner = true;
    let firstCard = board.value[0];
    let lastCard = board.value[1];
    //se for do mesmo naipe
    if (firstCard.suit === lastCard.suit) {
      //a maior carta ganha
      if (faces.indexOf(firstCard.face) > faces.indexOf(lastCard.face)) {
        //ultima carta ganhou
        firstCardWinner = false;
      }
    }
    //se o naipe for diferente
    else {
      //se a ultima for trunfo
      if (lastCard.suit === trump.value.suit) {
        //ultima carta ganhou
        firstCardWinner = false;
      }
    }

    //verificar se o player ganhou
    let isPlayerWinner =
      (!isPlayersTurn.value && firstCardWinner) ||
      (isPlayersTurn.value && !firstCardWinner);

    //adicionar ao monte de cartas ganhas
    if (isPlayerWinner) {
      playerWins.value.push(...board.value);
    } else {
      botWins.value.push(...board.value);
    }

    //limpar a mesa
    board.value = [];

    // TEST MODE: Simulate full game completion
    /*if (TEST) {
      // Give all remaining cards as wins to simulate a complete game
      // Randomly distribute points between 61-91 for player (normal win)
      const remainingCards = [
        ...deck.value,
        ...playerHand.value,
        ...botHand.value,
      ];

      // Player wins with 61-90 points (normal win scenario)
      playerWins.value.push(
        ...remainingCards.slice(0, Math.ceil(remainingCards.length * 0.6))
      );
      botWins.value.push(
        ...remainingCards.slice(Math.ceil(remainingCards.length * 0.6))
      );

      // Clear hands and deck
      playerHand.value = [];
      botHand.value = [];
      deck.value = [];

      endGame();
      return;
    }*/

    //comprar cartas
    //quem ganhou compra primeiro
    if (deck.value.length > 0) {
      if (isPlayerWinner) {
        playerHand.value.push(deck.value.pop());
        //quem perde recebe o trunfo
        if (deck.value.length > 0) {
          botHand.value.push(deck.value.pop());
        } else {
          botHand.value.push(trump.value);
        }
      } else {
        botHand.value.push(deck.value.pop());
        //quem perde recebe o trunfo
        if (deck.value.length > 0) {
          playerHand.value.push(deck.value.pop());
        } else {
          playerHand.value.push(trump.value);
        }
      }
    }

    /*console.log("isPlayersTurn: " + isPlayersTurn.value);
        console.log("Index da primeira carta: " + faces.indexOf(firstCard.face));
        console.log("Index da segunda carta: " + faces.indexOf(lastCard.face));
        console.log("firstCardWinner: " + firstCardWinner);
        console.log("isPlayerWinner: " + isPlayerWinner);*/
    /*console.log("bot points: " + calculatePoints(botWins.value));
        console.log("player points: " + calculatePoints(playerWins.value));*/

    if (
      deck.value.length === 0 &&
      playerHand.value.length === 0 &&
      botHand.value.length === 0
    ) {
      endGame();
    }

    if (!isPlayerWinner) {
      botPlay();
    } else {
      isPlayersTurn.value = true;
    }
  }

  function calculatePoints(cards) {
    let points = 0;
    for (const card of cards) {
      //console.log(card.face);
      points += cardPoints[card.face];
    }
    return points;
  }

  async function endGame() {
    isPlayersTurn.value = null;

    playerPoints.value = calculatePoints(playerWins.value);
    playerTotalPoints.value += playerPoints.value;
    botPoints.value = calculatePoints(botWins.value);
    botTotalPoints.value += botPoints.value;

    //verificar se alguem fez bandeira (120 pontos)
    if (playerPoints.value === 120) {
      playerScore.value += MAX_WINS;
      bandeira.value = true;
    } else if (botPoints.value === 120) {
      botScore.value += MAX_WINS;
    }
    //verificar se alguem fez capote (91-119 pontos)
    else if (playerPoints.value >= 91 && playerPoints.value <= 119) {
      playerScore.value += 2;
      capoteCount.value += 1;
    } else if (botPoints.value >= 91 && botPoints.value <= 119) {
      botScore.value += 2;
    }
    //vitoria normal
    else if (playerPoints.value > botPoints.value) {
      playerScore.value += 1;
    } else if (botPoints.value > playerPoints.value) {
      botScore.value += 1;
    }

    if (!isPractice.value) {
      storeGameDb();
    }

    // TEST MODE: Automatically end match after first game
    if (TEST) {
      // Simulate match completion - give player enough wins to end match
      if (playerPoints.value > botPoints.value) {
        playerScore.value = MAX_WINS;
        botScore.value = 0;
      } else {
        botScore.value = MAX_WINS;
        playerScore.value = 0;
      }
      endMatch();
      return;
    }

    if (playerScore.value >= MAX_WINS || botScore.value >= MAX_WINS) {
      endMatch();
    } else {
      await sleep(2500);
      setBoard();
    }
  }

  function endMatch() {
    if (isPractice.value) {
      didPlayerWinGame.value = playerPoints.value > botPoints.value;
    } else {
      didPlayerWinGame.value = playerScore.value > botScore.value;
    }

    //player recebe as moedas que apostou *2, se não for practice
    coins.value = 0;
    if (didPlayerWinGame.value && !isPractice.value) {
      coins.value = stake.value * 2;
      //+25 moedas por capote
      coins.value += capoteCount.value * 25;
      //bandeira duplica os coins novamente
      if (bandeira.value) {
        coins.value *= 2;
      }
      //atualizar coins do utilizador
      authStore.addCoins(coins.value);
    }

    showScoreboard.value = true;
    if (!isPractice.value) {
      storeMatchDb();
    }
  }

  function resetGame() {
    playerScore.value = 0;
    botScore.value = 0;

    isPlayerFirstTurn = null;

    coins.value = 0;
    didPlayerWinGame.value = false;
    showScoreboard.value = false;

    playerTotalPoints.value = 0;
    botTotalPoints.value = 0;

    matchId.value = undefined;

    capoteCount.value = 0;
    bandeira.value = false;
  }

  function storeGameDb() {
    endedAt.value = new Date();

    //tem que estar logado
    if (!authStore.currentUser) {
      return;
    }

    let winnerUserId = null;
    let loserUserId = null;
    if (playerPoints.value > botPoints.value) {
      winnerUserId = authStore.currentUser ? authStore.currentUser.id : null;
      loserUserId = null;
    } else if (botPoints.value > playerPoints.value) {
      winnerUserId = null;
      loserUserId = authStore.currentUser ? authStore.currentUser.id : null;
    }

    const game = {
      player1_user_id: authStore.currentUser ? authStore.currentUser.id : null,
      type: "9", //depois quando se adicionar tipo 3 mudar
      status: "Ended",
      player2_user_id: null, //bot
      player1_points: playerPoints.value,
      player2_points: botPoints.value,
      began_at: beganAt.value,
      ended_at: endedAt.value,
      total_time: Math.ceil((endedAt.value - beganAt.value) / 1000),
      winner_user_id: winnerUserId,
      loser_user_id: loserUserId,
      is_draw: playerScore.value === botScore.value ? 1 : 0,
      match_id: matchId.value,
    };

    toast.promise(apiStore.postGame(game), {
      loading: "Sending data to API...",
      success: () => {
        return `[API] Game saved successfully`;
      },
      error: (data) =>
        `[API] Error saving game - ${data?.response?.data?.message}`,
    });
  }

  function storeMatchDb() {
    //tem que estar logado
    if (!authStore.currentUser) {
      return;
    }

    let winnerUserId = null;
    let loserUserId = null;
    if (playerScore.value > botScore.value) {
      winnerUserId = authStore.currentUser ? authStore.currentUser.id : null;
      loserUserId = null;
    } else if (botScore.value > playerScore.value) {
      winnerUserId = null;
      loserUserId = authStore.currentUser ? authStore.currentUser.id : null;
    }

    const match = {
      status: "Ended",
      ended_at: endedAt.value,
      total_time: Math.ceil((endedAt.value - matchBeganAt.value) / 1000),
      winner_user_id: winnerUserId,
      loser_user_id: loserUserId,
      player1_marks: playerScore.value,
      player2_marks: botScore.value,
      player1_points: playerTotalPoints.value,
      player2_points: botTotalPoints.value,
    };

    toast.promise(apiStore.updateMatch(matchId.value, match), {
      loading: "Sending data to API...",
      success: () => {
        return `[API] Match updated successfully`;
      },
      error: (data) =>
        `[API] Error updating match - ${data?.response?.data?.message}`,
    });
  }

  return {
    setBoard,
    deck,
    playerHand,
    botHand,
    trump,
    isPlayersTurn,
    playCard,
    board,
    playerScore,
    botScore,
    showScoreboard,
    didPlayerWinGame,
    calculatePoints,
    resetGame,
    isPractice,
    stake,
    capoteCount,
    bandeira,
    playerPoints,
    botPoints,
    coins,
    endGame, 
    playerWins,
    botWins,
  };
});
