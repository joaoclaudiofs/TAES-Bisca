<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="px-4 py-4 flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3">
          <ArrowLeftIcon class="h-5 w-5" />
        </Button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Store</h1>
      </div>
    </div>

    <div class="px-4 py-6 space-y-6 max-w-4xl mx-auto">
      <Card class="p-4">
        <p class="text-sm text-muted-foreground">Browse and buy decks and avatars.</p>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card class="p-3">
          <h3 class="text-sm font-semibold mb-3">Decks</h3>
          <div class="space-y-2">
            <div v-for="d in decks" :key="d.id" class="flex items-center justify-between">
              <div>
                <div class="font-medium">{{ d.name || d.title }}</div>
                <div class="text-xs text-muted-foreground">{{ d.desc || d.subtitle }}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-sm font-semibold text-amber-500">{{ d.price }}</div>
                <Button size="sm" @click="buy(d)" :disabled="d.owned">{{ d.owned ? 'Owned' : 'Buy' }}</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card class="p-3">
          <h3 class="text-sm font-semibold mb-3">Avatars</h3>
          <div class="space-y-2">
            <div v-for="a in avatars" :key="a.id" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Avatar class="h-8 w-8">
                  <!--<AvatarFallback>{{ a.fallback || (a.name && a.name.charAt(0)) }}</AvatarFallback>-->
                  <img :src="a.image_url" :alt="a.name" />
                </Avatar>
                <div>
                  <div class="font-medium">{{ a.name || a.title }}</div>
                  <div class="text-xs text-muted-foreground">{{ a.desc || a.subtitle }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-sm font-semibold text-amber-500">{{ a.price }}</div>
                <Button size="sm" @click="buy(a)" :disabled="a.owned">{{ a.owned ? 'Owned' : 'Buy' }}</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAPIStore } from '@/stores/api'
import { useAuthStore } from '@/stores/auth'


import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const goBack = () => router.back()

const apiStore = useAPIStore()
const authStore = useAuthStore()

const decks = ref([])
const avatars = ref([])

async function load() {
  try {
    const owned = await apiStore.getOwnedCustomizations();

    const [deckRes, avatarRes] = await Promise.all([
      apiStore.getCustomizations('deck'),
      apiStore.getCustomizations('avatar')
    ])

    decks.value = (deckRes.data || []).map(i => ({
      ...i,
      name: i.name,
      owned: false
    }))
    decks.value.forEach(d => {
      d.owned = owned.data.includes(d.id) || d.price === 0;
    });

    avatars.value = (avatarRes.data || []).map(i => ({
      ...i,
      name: i.name,
      fallback: (i.name && i.name.charAt(0)) || 'A',
      owned: false
    }))
    avatars.value.forEach(a => {
      a.owned = owned.data.includes(a.id) || a.price === 0;
    });
  } catch (err) {
    console.error('Failed to load store', err)
  }
}

onMounted(load)

async function buy(item) {
  if (!authStore.currentUser) {
    router.push('/login')
    return
  }
  try {
    await apiStore.purchaseCustomization(item.id)
    item.owned = true
    const userRes = await apiStore.getAuthUser()
    authStore.currentUser = userRes.data

    // nicer success feedback
    toast.success(`Purchased ${item.name || 'item'}. Coins: ${userRes.data?.coins_balance ?? '–'}`)
  } catch (err) {
    console.error('Purchase failed', err)

    const status = err?.response?.status
    const responseData = err?.response?.data
    const serverMsg = responseData?.message || JSON.stringify(responseData) || err?.message || 'Purchase failed'
    if (status === 409) {
      item.owned = true
      toast.error(`[API] ${serverMsg}`)
      return
    }
    if (status === 422) {
      toast.error(`[API] ${serverMsg}`)
      return
    }
    toast.error(`[API] ${serverMsg}`)
  }
}
</script>