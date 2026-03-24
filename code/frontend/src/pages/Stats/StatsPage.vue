<template>
    <div class="min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
            <div class="flex items-center justify-between p-4">
                <Button variant="ghost" size="icon" @click="goBack">
                    <ArrowLeft class="h-5 w-5" />
                </Button>
                <h1 class="text-lg font-semibold">My Stats</h1>
                <div class="w-10" />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4">
            <Card class="bg-red-50 dark:bg-red-900/20 border-red-200">
                <CardContent class="p-4 text-center">
                    <p class="text-red-600 dark:text-red-400">{{ error }}</p>
                    <Button variant="outline" size="sm" class="mt-2" @click="fetchStats">
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>

        <!-- Stats Content -->
        <div v-else class="p-4 space-y-4 pb-8">
            <!-- Overview Cards -->
            <div class="grid grid-cols-2 gap-3">
                <Card class="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200">
                    <CardContent class="p-3 text-center">
                        <Trophy class="h-6 w-6 mx-auto mb-1 text-emerald-500" />
                        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.wins }}</p>
                        <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70">Wins</p>
                    </CardContent>
                </Card>

                <Card class="bg-red-50 dark:bg-red-900/20 border-red-200">
                    <CardContent class="p-3 text-center">
                        <XCircle class="h-6 w-6 mx-auto mb-1 text-red-500" />
                        <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.losses }}</p>
                        <p class="text-xs text-red-600/70 dark:text-red-400/70">Losses</p>
                    </CardContent>
                </Card>
            </div>

            <!-- Win Rate -->
            <Card>
                <CardContent class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <TrendingUp class="h-5 w-5 text-blue-500" />
                            <span class="font-medium">Win Rate</span>
                        </div>
                        <span class="text-2xl font-bold text-blue-600">{{ stats.win_rate }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div class="bg-blue-500 h-3 rounded-full transition-all duration-500"
                            :style="{ width: `${stats.win_rate}%` }"></div>
                    </div>
                </CardContent>
            </Card>

            <!-- More Stats (matches-focused) -->
            <Card>
                <CardHeader class="pb-2">
                    <CardTitle class="text-base">Statistics</CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div class="flex items-center justify-between py-2 border-b">
                        <div class="flex items-center gap-2 text-muted-foreground">
                            <Gamepad2 class="h-4 w-4" />
                            <span>Matches</span>
                        </div>
                        <span class="font-semibold">{{ stats.total_matches }}</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b">
                        <div class="flex items-center gap-2 text-muted-foreground">
                            <Target class="h-4 w-4" />
                            <span>Total Points</span>
                        </div>
                        <span class="font-semibold">{{ stats.total_points }}</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b">
                        <div class="flex items-center gap-2 text-muted-foreground">
                            <BarChart3 class="h-4 w-4" />
                            <span>Avg Points/Match</span>
                        </div>
                        <span class="font-semibold">{{ stats.avg_points }}</span>
                    </div>
                </CardContent>
            </Card>

            <!-- Recent Matches -->
            <Card>
                <CardHeader class="pb-2">
                    <CardTitle class="text-base">Recent Matches</CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="stats.recent_matches?.length === 0" class="text-center py-6 text-muted-foreground">
                        <Gamepad2 class="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No matches played yet</p>
                    </div>
                    <div v-else class="space-y-2">
                        <div v-for="game in stats.recent_matches" :key="game.id"
                            class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <!-- Result Icon -->
                            <div class="shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                                :class="getResultClass(game.result)">
                                <Trophy v-if="game.result === 'win'" class="h-5 w-5" />
                                <XCircle v-else-if="game.result === 'loss'" class="h-5 w-5" />
                                <Minus v-else class="h-5 w-5" />
                            </div>

                            <!-- Match Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium capitalize">{{ game.result }}</span>
                                    <span class="text-muted-foreground">vs {{ game.opponent_name }}</span>
                                </div>
                                <p class="text-sm text-muted-foreground">
                                    {{ game.user_points }} - {{ game.opponent_points }} •
                                    {{ formatDate(game.played_at) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ArrowLeft,
    Trophy,
    XCircle,
    Minus,
    TrendingUp,
    Gamepad2,
    Target,
    BarChart3
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const stats = ref({
    wins: 0,
    losses: 0,
    total_matches: 0,
    win_rate: 0,
    total_points: 0,
    avg_points: 0,
    recent_matches: []
})

function goBack() {
    router.back()
}

async function fetchStats() {
    if (!authStore.currentUser?.id) {
        error.value = 'Please login to view your stats'
        loading.value = false
        return
    }

    loading.value = true
    error.value = null

    try {
        stats.value = await authStore.getStats()
    } catch (err) {
        console.error('Failed to fetch stats:', err)
        error.value = 'Failed to load statistics'
    } finally {
        loading.value = false
        console.log('stats: ', stats.value)
    }
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
}

function getResultClass(result) {
    switch (result) {
        case 'win':
            return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
        case 'loss':
            return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
        default:
            return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    }
}

onMounted(() => {
    fetchStats()
})
</script>
