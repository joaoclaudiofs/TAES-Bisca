import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  // State
  const count = ref(0)
  const name = ref('Vue App')

  // Getters
  const doubleCount = computed(() => count.value * 2)

  // Actions
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  function setName(newName) {
    name.value = newName
  }

  return {
    count,
    name,
    doubleCount,
    increment,
    decrement,
    reset,
    setName
  }
})
