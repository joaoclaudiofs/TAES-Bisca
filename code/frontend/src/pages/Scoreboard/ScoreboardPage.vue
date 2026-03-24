<template>
    <div class="min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
            <div class="flex items-center justify-between p-4">
                <Button variant="ghost" size="icon" @click="goBack">
                    <ArrowLeft class="h-5 w-5" />
                </Button>
                <h1 class="text-lg font-semibold">Leaderboard</h1>
                <div class="w-10" />
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="p-4">
            <Card class="bg-red-50 dark:bg-red-900/20 border-red-200">
                <CardContent class="p-4 text-center">
                    <p class="text-red-600 dark:text-red-400">{{ error }}</p>
                    <Button variant="outline" size="sm" class="mt-2" @click="fetchScoreboard">
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>

        <!-- Scoreboard Content -->
        <div v-else class="p-4 space-y-6 pb-8">
            <!-- Category Tabs -->
            <div class="flex gap-2 overflow-x-auto pb-2">
                <Button v-for="tab in tabs" :key="tab.id" :variant="activeTab === tab.id ? 'default' : 'outline'"
                    size="sm" class="shrink-0" @click="activeTab = tab.id">
                    <component :is="tab.icon" class="h-4 w-4 mr-1" />
                    {{ tab.label }}
                </Button>
            </div>

            <!-- Most Wins -->
            <div v-if="activeTab === 'wins'">
                <RankingList :items="scoreboard.most_wins?.items ?? []" title="Most Victories" icon="trophy"
                    suffix="wins" :currentUserId="authStore.currentUser?.id" :loading="loading || loadingMore"
                    :userPosition="scoreboard.most_wins?.my_position" />

                <!-- Pagination -->
                <div v-if="scoreboard.most_wins?.pagination && scoreboard.most_wins.pagination.last_page > 1"
                    class="mt-4">
                    <Pagination v-slot="{ page }" :items-per-page="Number(scoreboard.most_wins.pagination.per_page)"
                        :total="scoreboard.most_wins.pagination.total" :sibling-count="1" :show-edges="true"
                        :default-page="currentPage.wins" @update:page="(p) => changePage('wins', p)">
                        <PaginationContent v-slot="{ items }">
                            <PaginationPrevious />

                            <template v-for="(item, index) in items">
                                <PaginationItem v-if="item.type === 'page'" :key="`page-${item.value}`"
                                    :value="item.value" :is-active="item.value === page">
                                    {{ item.value }}
                                </PaginationItem>
                                <PaginationEllipsis v-else :key="`ellipsis-${index}`" :index="index" />
                            </template>

                            <PaginationNext />
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <!-- Most Coins -->
            <div v-if="activeTab === 'coins'">
                <RankingList :items="scoreboard.most_coins?.items ?? []" title="Richest Players" icon="coins"
                    suffix="coins" :currentUserId="authStore.currentUser?.id" :loading="loading || loadingMore"
                    :userPosition="scoreboard.most_coins?.my_position" />

                <!-- Pagination -->
                <div v-if="scoreboard.most_coins?.pagination && scoreboard.most_coins.pagination.last_page > 1"
                    class="mt-4">
                    <Pagination v-slot="{ page }" :items-per-page="Number(scoreboard.most_coins.pagination.per_page)"
                        :total="scoreboard.most_coins.pagination.total" :sibling-count="1" :show-edges="true"
                        :default-page="currentPage.coins" @update:page="(p) => changePage('coins', p)">
                        <PaginationContent v-slot="{ items }">
                            <PaginationPrevious />

                            <template v-for="(item, index) in items">
                                <PaginationItem v-if="item.type === 'page'" :key="`page-${item.value}`"
                                    :value="item.value" :is-active="item.value === page">
                                    {{ item.value }}
                                </PaginationItem>
                                <PaginationEllipsis v-else :key="`ellipsis-${index}`" :index="index" />
                            </template>

                            <PaginationNext />
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAPIStore } from '@/stores/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import RankingList from '@/components/scoreboard/RankingList.vue'
import {
    ArrowLeft,
    Trophy,
    Coins,
    Award
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const apiStore = useAPIStore()

const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const activeTab = ref('wins')

// Track the latest request ID to ignore stale responses
const latestRequestId = {
    wins: 0,
    coins: 0
}

const abortControllers = {
    wins: null,
    coins: null
}

const currentPage = ref({
    wins: 1,
    coins: 1,
})

const tabs = [
    { id: 'wins', label: 'Victories', icon: Trophy },
    { id: 'coins', label: 'Coins', icon: Coins },
]

const scoreboard = ref({
    most_wins: [],
    most_coins: [],
})

const avatars = ref([])

async function loadAvatars() {
    const res = await apiStore.getCustomizations('avatar')
    avatars.value = res.data
}

function getAvatarUrlForUser(user) {
    const avatarId = user.current_avatar_customization_id
    if (avatarId) {
        const avatar = avatars.value.find(a => a.id === avatarId)
        if (avatar) {
            return avatar.image_url
        }
    }
    // fallback default avatar
    return 'avatars/default.jpg'
}

function attachAvatarUrls(list) {
    if (!Array.isArray(list)) return []
    return list.map(item => ({
        ...item,
        avatarUrl: getAvatarUrlForUser(item),
    }))
}

function goBack() {
    router.back()
}

async function fetchScoreboard() {
    error.value = null

    try {
        const response = await apiStore.getScoreboard(1, 10)

        // Attach avatar URLs to items
        const winsWithAvatars = attachAvatarUrls(response.data.most_wins?.items ?? [])
        const coinsWithAvatars = attachAvatarUrls(response.data.most_coins?.items ?? [])

        // Attach avatar URL to my_position
        const winsMyPos = response.data.most_wins?.my_position
            ? { ...response.data.most_wins.my_position, avatarUrl: getAvatarUrlForUser(response.data.most_wins.my_position) }
            : null
        const coinsMyPos = response.data.most_coins?.my_position
            ? { ...response.data.most_coins.my_position, avatarUrl: getAvatarUrlForUser(response.data.most_coins.my_position) }
            : null

        scoreboard.value = {
            most_wins: {
                ...response.data.most_wins,
                items: winsWithAvatars,
                my_position: winsMyPos
            },
            most_coins: {
                ...response.data.most_coins,
                items: coinsWithAvatars,
                my_position: coinsMyPos
            }
        }

        currentPage.value = { wins: 1, coins: 1 }
    } catch (err) {
        console.error('Failed to fetch scoreboard:', err)
        error.value = 'Failed to load leaderboard'
    } finally {
        loading.value = false
    }
}

async function changePage(category, page) {
    // Cancel previous request for this category if still pending
    if (abortControllers[category]) {
        abortControllers[category].abort()
    }

    // Increment request ID to track the latest request
    latestRequestId[category]++
    const currentRequestId = latestRequestId[category]

    // Create new AbortController for this category
    abortControllers[category] = new AbortController()
    loadingMore.value = true

    try {
        const response = await apiStore.getScoreboard(page, 10, abortControllers[category].signal)

        // Ignore response if this is not the latest request
        if (currentRequestId !== latestRequestId[category]) {
            return
        }

        const categoryKey = category === 'wins' ? 'most_wins' : 'most_coins'
        const rawCategory = response.data[categoryKey]

        // Attach avatar URLs to items
        const itemsWithAvatars = attachAvatarUrls(rawCategory?.items ?? [])
        const myPosWithAvatar = rawCategory?.my_position
            ? { ...rawCategory.my_position, avatarUrl: getAvatarUrlForUser(rawCategory.my_position) }
            : null

        // Replace items with new page
        scoreboard.value[categoryKey] = {
            ...rawCategory,
            items: itemsWithAvatars,
            my_position: myPosWithAvatar
        }

        // Update current page
        currentPage.value[category] = page
    } catch (err) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
            console.log(`Request canceled for ${category}`)
            return
        }
        console.error('Failed to change page:', err)
    } finally {
        // Only clear loading if this is still the latest request
        if (currentRequestId === latestRequestId[category]) {
            loadingMore.value = false
            abortControllers[category] = null
        }
    }
}

onMounted(async () => {
    loading.value = true
    await loadAvatars()
    await fetchScoreboard()
})
</script>
