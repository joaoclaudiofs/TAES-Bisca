<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="px-4 py-4 flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3">
          <ArrowLeftIcon class="h-5 w-5" />
        </Button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Match History</h1>
      </div>
    </div>

    <div class="px-4 py-6 max-w-4xl mx-auto space-y-4">

      <div v-if="loading" class="text-center text-sm text-gray-500">Loading...</div>
      <div v-else>
        <div v-if="matches.length === 0" class="text-center text-gray-500">No matches yet.</div>
        <div class="space-y-3">
          <div v-for="m in matches" :key="m.id" class="p-2 bg-white rounded-lg shadow-sm flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold">
                {{ m.result === 'win' ? 'Win' : (m.result === 'loss' ? 'Loss' : 'Unknown') }}
                <span class="text-xs text-gray-400"> — {{ formatDate(m.ended_at) }}</span>
              </div>

              <div class="text-xs text-gray-500 mt-1">
                Opponent: {{ m.opponent_name }}
              </div>

              <div class="text-xs text-gray-500 mt-2">
                Points: {{ m.player1_points ?? m.total_player1_points ?? '–' }} — {{ m.player2_points ?? m.total_player2_points ?? '–' }}
              </div>
              <div class="text-xs text-gray-500">
                Score: {{ m.player1_marks ?? m.match_player1_marks ?? '–' }} — {{ m.player2_marks ?? m.match_player2_marks ?? '–' }}
              </div>
            </div>

            <div class="text-right">
              <Button size="xs" class="px-2 py-1 text-xs" @click="viewMatch(m)">Details</Button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <Button size="sm" @click="prevPage" :disabled="meta.current_page <= 1">Previous</Button>
          <div class="text-xs text-gray-500">Page {{ meta.current_page }} / {{ meta.last_page }}</div>
          <Button size="sm" @click="nextPage" :disabled="meta.current_page >= meta.last_page">Next</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAPIStore } from '@/stores/api'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'

const router = useRouter()
const goBack = () => router.back()

const apiStore = useAPIStore()
const matches = ref([])
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 })
const loading = ref(false)
const page = ref(1)

function formatDate(dt) {
  if (!dt) return '–'
  return new Date(dt).toLocaleString()
}

async function loadPage(p = 1) {
  loading.value = true
  try {
    const res = await apiStore.getUserMatches(p, meta.value.per_page || 15)
    const payload = res.data
    
    if (Array.isArray(payload)) {
      matches.value = payload
      meta.value = {
        current_page: 1,
        last_page: 1,
        per_page: payload.length,
        total: payload.length
      }
    } else {
      matches.value = payload.data || []
      meta.value = payload.meta || meta.value
    }
  } catch (err) {
    console.error('Failed to load matches', err)
  } finally {
    loading.value = false
  }
}

function prevPage() {
  if (meta.value.current_page > 1) {
    loadPage(meta.value.current_page - 1)
  }
}
function nextPage() {
  if (meta.value.current_page < meta.value.last_page) {
    loadPage(meta.value.current_page + 1)
  }
}

function viewMatch(match) {
  router.push({ name: 'match-games', params: { matchId: match.id } })
}

onMounted(() => loadPage(1))
</script>

<style scoped></style>