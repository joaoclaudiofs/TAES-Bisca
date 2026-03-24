<template>
    <div class="h-screen flex flex-col overflow-hidden bg-linear-to-b from-background to-muted/30">
        <!-- Top Status Bar -->
        <div class="shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
            <div class="flex items-center justify-between px-3 py-2">
                <Button variant="ghost" size="icon" class="h-8 w-8" @click="$router.push({ name: 'dashboard' })">
                    <ChevronLeft class="h-4 w-4" />
                </Button>

                <div v-if="!gameStore.isPractice" class="flex items-center gap-2">
                    <div class="flex items-center gap-1.5 bg-primary/10 rounded-full px-2 py-1">
                        <User class="h-3 w-3 text-primary" />
                        <span class="font-bold text-primary text-sm">{{ gameStore.playerScore }}</span>
                    </div>
                    <span class="text-muted-foreground text-xs">vs</span>
                    <div class="flex items-center gap-1.5 bg-rose-500/10 rounded-full px-2 py-1">
                        <Bot class="h-3 w-3 text-rose-500" />
                        <span class="font-bold text-rose-500 text-sm">{{ gameStore.botScore }}</span>
                    </div>
                </div>

                <div v-if="!gameStore.isPractice"
                    class="flex items-center gap-1 bg-amber-500/10 rounded-full px-2 py-1">
                    <Coins class="h-3 w-3 text-amber-500" />
                    <span class="font-semibold text-amber-500 text-xs">{{ gameStore.stake }}</span>
                </div>
            </div>
        </div>

        <!-- Main Game Area - Flex grow to fill available space -->
        <div class="flex-1 flex flex-col gap-2 p-3 overflow-hidden">
            <!-- Bot Hand (Collapsible) - TOP -->
            <Card class="shrink-0 bg-rose-500/5 border-rose-500/20">
                <CardHeader class="py-1.5 px-3 cursor-pointer select-none" @click="showBotHand = !showBotHand">
                    <div class="flex items-center justify-center gap-2">
                        <Bot class="h-3 w-3 text-rose-500" />
                        <CardTitle class="text-xs text-rose-500">Bot's Hand</CardTitle>
                        <Badge variant="outline" class="text-[10px] h-4 px-1">{{ gameStore.botHand.length }}</Badge>
                        <ChevronDown v-if="!showBotHand" class="h-3 w-3 text-rose-500" />
                        <ChevronUp v-else class="h-3 w-3 text-rose-500" />
                    </div>
                </CardHeader>
                <CardContent v-show="showBotHand" class="pt-0 pb-2 px-2">
                    <div class="flex gap-0 justify-center flex-wrap">
                        <div v-for="card in gameStore.botHand" :key="card.id" class="scale-50 -mx-3 -my-2">
                            <GameCard :card="card" :deck="deck" faceDown />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Turn Indicator -->
            <div class="shrink-0 flex justify-center">
                <div class="shrink-0 flex justify-center">
                    <Badge v-if="gameStore.isPlayersTurn !== null"
                        :variant="gameStore.isPlayersTurn ? 'default' : 'secondary'"
                        class="px-3 py-1 text-xs animate-pulse">
                        {{ gameStore.isPlayersTurn ? '🎯 Your turn' : '🤖 Bot playing...' }}
                    </Badge>
                    <Badge v-else
                        :variant="gameStore.isPlayersTurn ? 'default' : 'secondary'"
                        class="px-3 py-1 text-xs animate-pulse">
                        🤔 Waiting...
                    </Badge>
                </div>
            </div>

            <!-- Center Area: Deck, Trump & Board - Takes remaining space -->
            <Card class="flex-1 min-h-0 border-2 border-dashed border-muted-foreground/30 bg-muted/20">
                <CardContent class="h-full p-2 flex flex-col">
                    <!-- Board Area with Deck/Trump on side -->
                    <div class="flex-1 min-h-0 flex gap-2">
                        <!-- Left side: Deck & Trump stacked -->
                        <div class="shrink-0 flex flex-col items-center justify-center gap-2">
                            <!-- Deck -->
                            <div class="flex flex-col items-center gap-0.5">
                                <div class="relative">
                                    <div
                                        class="w-8 h-11 bg-linear-to-br from-primary/20 to-primary/40 rounded border border-primary/30 flex items-center justify-center">
                                        <Layers class="h-3 w-3 text-primary/70" />
                                    </div>
                                    <Badge variant="secondary"
                                        class="absolute -top-1 -right-1 h-3.5 w-3.5 p-0 flex items-center justify-center text-[8px]">
                                        {{ gameStore.deck.length }}
                                    </Badge>
                                </div>
                                <span class="text-[8px] text-muted-foreground">Deck</span>
                            </div>

                            <!-- Trump Card -->
                            <div class="flex flex-col items-center gap-0.5">
                                <div class="scale-50 origin-center -my-3">
                                    <GameCard :card="gameStore.trump" :deck="deck" />
                                </div>
                                <span class="text-[8px] text-muted-foreground">Trump</span>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="shrink-0 border-l border-muted-foreground/20"></div>

                        <!-- Board - Main area -->
                        <div class="flex-1 min-h-0 flex flex-col">
                            <div class="shrink-0 flex items-center justify-center gap-1 mb-1">
                                <LayoutGrid class="h-3 w-3 text-muted-foreground" />
                                <span class="text-xs text-muted-foreground font-medium">Board</span>
                            </div>
                            <div class="flex-1 flex items-center justify-center">
                                <div v-if="gameStore.board.length === 0">
                                    <p class="text-xs text-muted-foreground/50 italic">Waiting for play...</p>
                                </div>
                                <div v-else class="flex gap-2 justify-center items-center flex-wrap">
                                    <div v-for="card in gameStore.board" :key="card.id" class="scale-90">
                                        <GameCard :card="card" :deck="deck" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Player Hand - Fixed at Bottom -->
        <div class="shrink-0 bg-linear-to-t from-background to-transparent pt-1 pb-2 px-3">
            <Card class="border-primary/30 bg-primary/5 shadow-lg shadow-primary/10 overflow-visible">
                <CardHeader class="py-1 px-3">
                    <div class="flex items-center justify-center gap-2">
                        <User class="h-3 w-3 text-primary" />
                        <CardTitle class="text-xs text-primary">Your Hand</CardTitle>
                        <Badge variant="default" class="text-[10px] h-4 px-1">{{ gameStore.playerHand.length }}</Badge>
                    </div>
                </CardHeader>
                <CardContent class="pt-0 pb-3 px-2 overflow-visible">
                    <div
                        class="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent py-1">
                        <div class="flex gap-2 px-1"
                            :class="gameStore.playerHand.length <= 5 ? 'justify-center' : 'justify-start'">
                            <div v-for="card in gameStore.playerHand" :key="card.id"
                                class="shrink-0 transform transition-all duration-200 active:scale-95"
                                :class="gameStore.isPlayersTurn ? 'hover:-translate-y-1 cursor-pointer' : 'opacity-60'">
                                <GameCard :card="card" :deck="deck"
                                    @playCard="gameStore.isPlayersTurn && gameStore.playCard(card)" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- End Game Modal -->
        <Dialog :open="gameStore.showScoreboard">
            <DialogContent class="sm:max-w-md">
                <DialogHeader class="text-center">
                    <div class="flex flex-col items-center gap-3 py-2">
                        <div class="w-16 h-16 rounded-full flex items-center justify-center"
                            :class="gameStore.didPlayerWinGame ? 'bg-emerald-500/20' : 'bg-rose-500/20'">
                            <Trophy v-if="gameStore.didPlayerWinGame" class="h-8 w-8 text-emerald-500" />
                            <Frown v-else class="h-8 w-8 text-rose-500" />
                        </div>
                        <DialogTitle class="text-2xl">
                            <span :class="gameStore.didPlayerWinGame ? 'text-emerald-500' : 'text-rose-500'">
                                {{ gameStore.didPlayerWinGame ? 'Victory!' : 'Defeat' }}
                            </span>
                        </DialogTitle>
                        <DialogDescription class="sr-only">
                            Game results and final scores
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div class="space-y-4 py-4">
                    <!-- Score Comparison -->
                    <div class="grid grid-cols-2 gap-4">
                        <Card class="border-primary/30">
                            <CardContent class="p-4 flex flex-col items-center gap-2">
                                <User class="h-5 w-5 text-primary" />
                                <span class="text-xs text-muted-foreground">You</span>
                                <span v-if="!gameStore.isPractice" class="text-3xl font-bold text-primary">{{
                                    gameStore.playerScore }}</span>
                                <span v-else class="text-3xl font-bold text-primary">{{ gameStore.playerPoints }}</span>
                            </CardContent>
                        </Card>
                        <Card class="border-rose-500/30">
                            <CardContent class="p-4 flex flex-col items-center gap-2">
                                <Bot class="h-5 w-5 text-rose-500" />
                                <span class="text-xs text-muted-foreground">Bot</span>
                                <span v-if="!gameStore.isPractice" class="text-3xl font-bold text-rose-500">{{
                                    gameStore.botScore }}</span>
                                <span v-else class="text-3xl font-bold text-primary">{{ gameStore.botPoints }}</span>
                            </CardContent>
                        </Card>
                    </div>

                    <!-- Achivements -->
                    <div v-if="gameStore.capoteCount > 0" class="text-center">
                        <p class="text-xs text-muted-foreground">Capotes</p>
                        <p class="text-2xl font-bold text-amber-500">{{ gameStore.capoteCount }}</p>
                    </div>
                    <div v-if="gameStore.bandeira" class="text-center">
                        <p class="text-2xl text-green-400">Bandeira</p>
                    </div>

                    <!-- Coins -->
                    <Card v-if="!gameStore.isPractice && gameStore.didPlayerWinGame"
                        class="bg-amber-500/10 border-amber-500/30">
                        <CardContent class="p-4 flex items-center justify-center gap-3">
                            <Coins class="h-6 w-6 text-amber-500" />
                            <div class="text-center">
                                <p class="text-xs text-muted-foreground">Coins earned</p>
                                <p class="text-2xl font-bold text-amber-500">{{ gameStore.coins }}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter class="flex-col gap-2 sm:flex-col">
                    <Button class="w-full"
                        @click="() => { gameStore.resetGame(); $router.push({ name: 'dashboard' }); }">
                        <Home class="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/game';
import GameCard from '@/components/game/Card.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAPIStore } from '@/stores/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import {
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    User,
    Bot,
    Coins,
    Layers,
    LayoutGrid,
    Trophy,
    Frown,
    Home,
    RotateCcw
} from 'lucide-vue-next';

import { useRoute } from 'vue-router';
const route = useRoute();

const apiStore = useAPIStore();
let deck = ref('Classic');
apiStore.getEquippedDeck().then(response => {
    deck.value = response.data.name;
});
console.log(deck.value);

const gameStore = useGameStore();
gameStore.isPractice = route.query.isPractice === 'true';
if (gameStore.isPractice === false) {
    gameStore.stake = parseInt(route.query.stake);
}
const showBotHand = ref(false);

onMounted(() => {
    gameStore.setBoard();
});
</script>