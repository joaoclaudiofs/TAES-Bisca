<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="px-4 py-4 flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3">
          <ArrowLeftIcon class="h-5 w-5" />
        </Button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Customizations</h1>
      </div>
    </div>

    <!-- Customizations Content -->
    <div v-if="!loading" class="px-4 py-6 space-y-6">
      <!-- Avatar Section -->
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Avatar</h2>
          <span class="text-xs text-gray-500 dark:text-gray-400">Used on dashboard & during matches</span>
        </div>
        <div class="flex items-center space-x-4 mb-4">
          <Avatar class="h-16 w-16">
            <AvatarImage :src="selectedAvatarPreview" :alt="userName" />
          </Avatar>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Choose an avatar you like. Only items you purchased through the store can be selected.
            </p>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <button v-for="avatar in avatars" :key="avatar.id" type="button" :disabled="!avatar.owned"
            @click="selectAvatar(avatar.id)" :class="[
              'relative aspect-square rounded-lg border flex items-center justify-center overflow-hidden transition-all',
              selectedAvatarId === avatar.id
                ? 'border-blue-500 ring-2 ring-blue-400'
                : 'border-gray-200 dark:border-gray-700',
              !avatar.owned && 'opacity-60 cursor-not-allowed',
            ]">
            <img v-if="avatar.image" :src="avatar.image" :alt="avatar.name" class="w-full h-full object-cover" />
            <span v-else class="text-xs font-medium text-gray-700 dark:text-gray-200">
              {{ avatar.name.charAt(0).toUpperCase() }}
            </span>
            <span v-if="!avatar.owned"
              class="absolute bottom-1 left-1 right-1 text-[10px] text-center bg-black/60 text-white rounded px-1">
              Purchase in store
            </span>
          </button>
        </div>
      </Card>

      <!-- Decks Section -->
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Decks</h2>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Changes card visuals during matches
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button v-for="deck in decks" :key="deck.id" type="button" :disabled="!deck.owned"
            @click="selectDeck(deck.id)" :class="[
              'p-3 rounded-lg border flex flex-col space-y-2 transition-all text-left',
              selectedDeckId === deck.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700',
              !deck.owned && 'opacity-60 cursor-not-allowed',
            ]">
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 rounded bg-linear-to-br from-blue-500 to-indigo-500"></div>
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ deck.name }}
                </p>
                <p class="text-[11px] text-gray-500 dark:text-gray-400">
                  {{ deck.description }}
                </p>
              </div>
            </div>
            <span v-if="!deck.owned" class="text-[11px] text-amber-600 dark:text-amber-300">
              Purchase in store to use this deck.
            </span>
          </button>
        </div>
      </Card>

      <!-- Info / Persistence Note -->
      <Card class="p-4">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">How customizations work</h2>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          Items are purchased through the in-game store. Only owned avatars and decks can be
          selected here. Your selection is saved to your profile so it persists across sessions and
          is used on the dashboard and during gameplay.
        </p>
      </Card>
    </div>
    <div v-else class="px-4 py-6 space-y-6">
      <!-- Avatar card skeleton -->
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <Skeleton class="h-5 w-32" />
          <Skeleton class="h-3 w-40" />
        </div>
        <div class="flex items-center space-x-4 mb-4">
          <Skeleton class="h-16 w-16 rounded-full" />
          <div class="space-y-2 flex-1">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-1/2" />
          </div>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <Skeleton v-for="i in 8" :key="i" class="aspect-square rounded-lg" />
        </div>
      </Card>

      <!-- Decks card skeleton -->
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <Skeleton class="h-5 w-24" />
          <Skeleton class="h-3 w-40" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="i in 4" :key="i" class="p-3 rounded-lg border flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
              <Skeleton class="h-8 w-8 rounded" />
              <div class="space-y-1 flex-1">
                <Skeleton class="h-4 w-24" />
                <Skeleton class="h-3 w-32" />
              </div>
            </div>
            <Skeleton class="h-3 w-40" />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import { Skeleton } from '@/components/ui/skeleton'

// UI Components
import Card from '@/components/ui/card/Card.vue'
import Button from '@/components/ui/button/Button.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import { useAPIStore } from '@/stores/api'

const router = useRouter()
const authStore = useAuthStore()
const apiStore = useAPIStore()
const { currentUser } = storeToRefs(authStore)

// User data
const userName = computed(() => currentUser.value?.name || 'Player')
const userAvatar = computed(() => currentUser.value?.avatar || '')

const decks = ref([]);
const avatars = ref([]);
const loading = ref(true);

//tem que ser assim para receber o owned antes de apresentar os objetos
onMounted(async () => {
  try {
    const owned = await apiStore.getOwnedCustomizations();

    const av = await apiStore.getCustomizations("avatar");
    for (const avatar of av.data) {
      const item = {
        id: avatar.id,
        name: avatar.name,
        owned: false,
        image: avatar.image_url      
      }

      item.owned = owned.data.includes(item.id) || avatar.price === 0;
      avatars.value.push(item)
    }

    const de = await apiStore.getCustomizations("deck");
    for (const deck of de.data) {
      const item = {
        id: deck.id,
        name: deck.name,
        owned: false,
      }

      item.owned = owned.data.includes(item.id) || deck.price === 0;
      decks.value.push(item)
    }
  } finally {
    loading.value = false;
  }
});

// Selected customizations (persist later via API/store)
let selectedAvatarId = ref(4);
apiStore.getEquippedAvatar().then(response => {
  selectedAvatarId.value = response.data.id;
});

let selectedDeckId = ref(1);
apiStore.getEquippedDeck().then(response => {
  selectedDeckId.value = response.data.id;
});

const selectedAvatarPreview = computed(() => {
  const found = avatars.value.find(a => a.id === selectedAvatarId.value)
  return found?.image || userAvatar.value
})

const selectAvatar = id => {
  const avatar = avatars.value.find(a => a.id === id)
  if (!avatar || !avatar.owned) return
  selectedAvatarId.value = id

  apiStore.equipCustomization(id);
}

const selectDeck = id => {
  const deck = decks.value.find(d => d.id === id)
  if (!deck || !deck.owned) return
  selectedDeckId.value = id

  apiStore.equipCustomization(id);
}

const goBack = () => {
  router.push('/dashboard')
}
</script>
