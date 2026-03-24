<template>
  <div
    class="min-h-screen flex flex-col bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Anonymous User Banner -->
    <div v-if="isAnonymous"
      class="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="h-5 w-5 bg-yellow-500 rounded-full flex items-center justify-center">
            <UserIcon class="h-3 w-3 text-white" />
          </div>
          <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Guest Mode - Practice games only • No coins, history, or customizations
          </span>
        </div>
        <Button variant="ghost" size="sm" @click="goToLogin"
          class="text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800/20">
          Sign In
        </Button>
      </div>
    </div>

    <!-- Header Section -->
    <div class="px-4 pt-8 pb-6">
      <!-- User Profile Section -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <Avatar
            class="h-16 w-16 rounded-full ring-2 ring-blue-500/60 shadow-sm overflow-hidden bg-blue-500/10 flex items-center justify-center">
            <AvatarImage :src="avatarUrl" class="h-full w-full object-cover" />
          </Avatar>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ isLoggedIn ? `${userName}` : 'Welcome!' }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ isLoggedIn ? 'Ready to play?' : 'Playing as Guest' }}
            </p>
          </div>
        </div>

        <!-- Actions (Coin Balance for logged in / Navigation for anonymous) -->
        <div class="flex items-center gap-1 shrink-0">
          <!-- Coin Balance (for registered users) -->
          <Badge v-if="isLoggedIn" variant="secondary" class="px-2 py-1">
            <CoinIcon class="h-4 w-4 mr-1 text-yellow-500" />
            {{ coinBalance }}
          </Badge>

          <!-- Notification Bell (for registered users) -->
          <NotificationBell v-if="isLoggedIn" />

          <!-- Logout button for logged in users -->
          <Button v-if="isLoggedIn" variant="ghost" size="icon" @click="handleLogout"
            class="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <LogOutIcon class="h-4 w-4" />
          </Button>

          <!-- Go to Home button for anonymous users -->
          <Button v-if="isAnonymous" variant="ghost" size="icon" @click="goToHome"
            class="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <HomeIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Actions Section -->
    <div class="px-4 space-y-4 flex-1">
      <!-- Ranked / Real Match (only for logged in users) -->
      <Card v-if="isLoggedIn" class="p-6 bg-linear-to-r from-blue-500 to-blue-600 text-white border-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-1">
              Ranked Match
            </h3>
            <p class="text-blue-100 text-sm">
              Spend coins to play ranked matches, earn more coins, and track your progress.
            </p>

            <!-- Coin cost + balance info -->
            <div class="mt-3 flex flex-col space-y-1 text-xs">
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-600/40">
                  <CoinIcon class="h-3 w-3 mr-1 text-yellow-300" />
                  <span>Entry Fee: <strong>50 coins</strong></span>
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-end space-y-2">
            <PlayIcon class="h-8 w-8" />
          </div>
        </div>
        <Button @click="startRankedGame" variant="secondary"
          class="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="coinBalance < 50">
          <GamepadIcon class="h-4 w-4 mr-2" />
          <span v-if="coinBalance >= 50">Start Match</span>
          <span v-else>Not enough coins (50 required)</span>
        </Button>
      </Card>

      <!-- Practice Section (available to everyone) -->
      <Card class="p-5 border border-dashed border-blue-300 dark:border-blue-700 bg-white/70 dark:bg-gray-900/40">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Practice vs Bot
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Play unranked games against the AI.
              <span v-if="isAnonymous">
                No coins, history or customization progress will be saved while playing as guest.
              </span>
              <span v-else>
                Perfect for testing new strategies without affecting your stats.
              </span>
            </p>
          </div>
          <GamepadIcon class="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <Button @click="startPracticeGame" variant="outline"
          class="w-full mt-3 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30">
          <GamepadIcon class="h-4 w-4 mr-2" />
          Start Practice
        </Button>
      </Card>

      <!-- Navigation Grid -->
      <div class="grid grid-cols-2 gap-4">

        <!-- Match History - Only for registered users (FULL WIDTH) -->
        <Card
          v-if="canAccessHistory"
          class="col-span-2 p-4 cursor-pointer hover:shadow-lg transition-shadow"
          @click="viewMatchHistory"
        >
          <div class="flex flex-col items-center text-center space-y-2">
            <div class="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <TrophyIcon class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Match History</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Track performance</p>
          </div>
        </Card>

        <!-- Limited Features Message for Anonymous (Match History FULL WIDTH) -->
        <Card v-if="isAnonymous" class="col-span-2 p-4 opacity-60">
          <div class="flex flex-col items-center text-center space-y-2">
            <div class="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <TrophyIcon class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="font-semibold text-gray-500 dark:text-gray-400">Match History</h3>
            <p class="text-xs text-gray-400">Register to unlock</p>
          </div>
        </Card>

        <!-- Personal Stats - Only for registered users (2ª linha, meia largura) -->
        <Card
          v-if="canAccessHistory"
          class="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          @click="viewPersonalStats"
        >
          <div class="flex flex-col items-center text-center space-y-2">
            <div class="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <UserIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">My Stats</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Personal records</p>
          </div>
        </Card>

        <!-- Personal Stats Locked for Anonymous -->
        <Card v-if="isAnonymous" class="p-4 opacity-60">
          <div class="flex flex-col items-center text-center space-y-2">
            <div class="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <UserIcon class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="font-semibold text-gray-500 dark:text-gray-400">My Stats</h3>
            <p class="text-xs text-gray-400">Register to unlock</p>
          </div>
        </Card>

        <!-- Global Scoreboard - Only for registered users -->
        <Card
          v-if="canAccessLeaderboard"
          class="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          @click="viewGlobalScoreboard"
        >
          <div class="flex flex-col items-center text-center space-y-2">
            <div class="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Crown class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Global rankings</p>
          </div>
        </Card>

        <!-- Leaderboard Locked for Anonymous -->
        <Card v-if="isAnonymous" class="p-4 opacity-60">
          <div class="flex flex-col items-center text-center space-y-2">
            <div class="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Crown class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="font-semibold text-gray-500 dark:text-gray-400">Leaderboard</h3>
            <p class="text-xs text-gray-400">Register to unlock</p>
          </div>
        </Card>
      </div>

      <!-- Store Card - Only for registered users -->
      <Card v-if="canAccessStore" class="p-4 cursor-pointer hover:shadow-lg transition-shadow" @click="goToStore">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <ShoppingBagIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Store</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">Buy cosmetics & themes</p>
            </div>
          </div>
          <ChevronRightIcon class="h-5 w-5 text-gray-400" />
        </div>
      </Card>

      <!-- Store Locked for Anonymous -->
      <Card v-if="isAnonymous" class="p-4 opacity-60">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ShoppingBagIcon class="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-500 dark:text-gray-400">Store</h3>
              <p class="text-xs text-gray-400">Register to unlock</p>
            </div>
          </div>
          <ChevronRightIcon class="h-5 w-5 text-gray-400" />
        </div>
      </Card>

      <!-- Customization Card - only for logged in users -->
      <Card v-if="isLoggedIn" class="p-4 cursor-pointer hover:shadow-lg transition-shadow" @click="openCustomization">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <CustomizationsIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Customizations</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">Decks, avatars & themes</p>
            </div>
          </div>
          <ChevronRightIcon class="h-5 w-5 text-gray-400" />
        </div>
      </Card>
    </div>

    <!-- Bottom padding for mobile navigation (only when logged in) -->
    <div v-if="isLoggedIn" class="h-20"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import {
  Play as PlayIcon,
  Gamepad2 as GamepadIcon,
  History as HistoryIcon,
  Trophy as TrophyIcon,
  User as UserIcon,
  Crown,
  Palette as CustomizationsIcon,
  ChevronRight as ChevronRightIcon,
  Coins as CoinIcon,
  ShoppingBag as ShoppingBagIcon,
  LogOut as LogOutIcon,
  Home as HomeIcon
} from 'lucide-vue-next'

// UI Components
import Card from '@/components/ui/card/Card.vue'
import Button from '@/components/ui/button/Button.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import NotificationBell from '@/components/notifications/NotificationBell.vue'
import { useAPIStore } from '@/stores/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const {
  currentUser,
  isLoggedIn,
  isAnonymous,
  canAccessStore,
  canAccessLeaderboard,
  canAccessHistory,
  canOnlyPractice
} = storeToRefs(authStore)

const apiStore = useAPIStore()

// User data based on API auth user shape
const userName = computed(() => currentUser.value?.name || 'Guest')

// User stats from auth user
const coinBalance = computed(() => currentUser.value?.coins_balance ?? 0)

// Navigation methods
const startRankedGame = () => {
  // Remove 50 coins for ranked game entry
  const stake = 50;
  authStore.removeCoins(stake)
  router.push({
    path: '/game',
    query: { isPractice: false, stake: stake }
  });
}

const startPracticeGame = () => {
  router.push({
    path: '/game',
    query: { isPractice: true }
  });
}

const avatarUrl = ref('avatars/default.jpg');
onMounted(async () => {
  if (isLoggedIn.value) {
    const response = await apiStore.getEquippedAvatar();
    avatarUrl.value = `${response.data.image_url}`;

    // Fetch notifications for logged-in users
    await notificationStore.fetchNotifications();
  }
})

const viewMatchHistory = () => {
  // Navigate to match history page
  router.push('/matches')
}

const viewPersonalStats = () => {
  router.push('/stats')
}

const viewStore = () => {
  // Navigate to store
  console.log('Navigate to store')
}

const viewGlobalScoreboard = () => {
  router.push('/scoreboard')
}

const openCustomization = () => {
  router.push('/customization')
}

const goToLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const goToHome = () => {
  router.push('/')
}
const goToStore = () => {
  router.push('/store')
}
</script>
