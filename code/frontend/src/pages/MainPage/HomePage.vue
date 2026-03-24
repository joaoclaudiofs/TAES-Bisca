<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <Card class="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
      <div class="p-8 space-y-8">
        <!-- Logo Section -->
        <div class="text-center space-y-3">
          <div
            class="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <GamepadIcon class="h-8 w-8 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Card Game</h1>
          <p class="text-gray-600">Challenge yourself against the AI</p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <Button @click="goToLogin"
            class="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg">
            <UserIcon class="h-5 w-5 mr-2" />
            Login
          </Button>

          <Button @click="playAsGuest" variant="outline"
            class="w-full h-12 text-lg font-semibold border-2 hover:bg-gray-50" size="lg">
            <PlayIcon class="h-5 w-5 mr-2" />
            Continue as Guest
          </Button>
        </div>

        <!-- Feature Comparison -->
        <div class="space-y-4 pt-4 border-t border-gray-200">
          <div class="space-y-3">
            <div class="flex items-start space-x-3">
              <Badge variant="default" class="mt-0.5">Login</Badge>
              <div class="text-sm text-gray-600">
                <p class="font-medium text-gray-900">Full Access</p>
                <p>Coins, history, scoreboards, customizations</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <Badge variant="secondary" class="mt-0.5">Guest</Badge>
              <div class="text-sm text-gray-600">
                <p class="font-medium text-gray-900">Practice Mode</p>
                <p>Practice games only, no progress saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Gamepad2 as GamepadIcon,
  User as UserIcon,
  Play as PlayIcon
} from 'lucide-vue-next'

// UI Components
import Card from '@/components/ui/card/Card.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'

const router = useRouter()
const authStore = useAuthStore()

const goToLogin = () => {
  router.push('/login')
}

const playAsGuest = () => {
  // Set anonymous mode and go to dashboard
  authStore.loginAsGuest()
  router.push('/dashboard')
}
</script>
