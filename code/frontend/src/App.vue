<template>
  <div class="min-h-screen flex flex-col">
    <Toaster rich-colors />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
</script>

<style></style>
