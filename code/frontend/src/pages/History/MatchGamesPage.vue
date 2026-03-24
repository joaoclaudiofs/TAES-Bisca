<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 shadow-sm">
            <div class="px-4 py-4 flex items-center">
                <Button variant="ghost" size="sm" @click="goBack" class="mr-3">
                    <ArrowLeftIcon class="h-5 w-5" />
                </Button>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                    Match Games
                </h1>
            </div>
        </div>

        <div class="px-4 py-6 max-w-3xl mx-auto space-y-4">
            <div v-if="loading" class="text-center text-sm text-gray-500">
                Loading games...
            </div>

            <div v-else>
                <div class="space-y-3">
                    <div v-for="(g, index) in games" :key="g.id"
                        class="relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-between">
                        
                        <div v-if="getResult(g).label"
                            class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            :class="getResult(g).class">
                            {{ getResult(g).label }}
                        </div>

                        <div v-if="getAchievement(g)"
                            class="absolute top-2 right-12 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            :class="getAchievement(g).class">
                            {{ getAchievement(g).label }}
                        </div>

                        <div>
                            <div class="text-sm font-semibold">
                                Game {{ index + 1 }}
                                <span class="text-xs text-gray-400">
                                    {{ formatTime(g.total_time) }}
                                </span>
                            </div>

                            <div class="text-xs text-gray-500 mt-1">
                                Points:
                                {{ g.player1_points }} — {{ g.player2_points }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAPIStore } from '@/stores/api'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/button/Button.vue'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const apiStore = useAPIStore()
const authStore = useAuthStore()

const currentUserId = computed(() => authStore.currentUser?.id)

const matchId = route.params.matchId
const games = ref([])
const loading = ref(false)

function goBack() {
    router.back()
}

function getResult(game) {
    if (game.is_draw == 1) {
        return { label: 'Draw', class: 'bg-yellow-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100' }
    }

    if (game.winner_user_id == currentUserId.value) {
        return { label: 'Win', class: 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' }
    } else {
        return { label: 'Loss', class: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' }
    }
}

function getAchievement(game) {
    //bandeira
    if (game.player1_points === 120 || game.player2_points === 120) {
        return { label: 'Bandeira', class: 'bg-purple-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100' }
    }

    //capote
    if (game.player1_points >= 91 || game.player2_points >= 91) {
        return { label: 'Capote', class: 'bg-blue-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100' }
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
}

onMounted(async () => {
    loading.value = true
    try {
        const res = await apiStore.getMatchGames(matchId)
        games.value = Array.isArray(res.data) ? res.data : []
    } catch (err) {
        console.error('Failed to load match games', err)
        games.value = []
    } finally {
        loading.value = false
    }
})
</script>