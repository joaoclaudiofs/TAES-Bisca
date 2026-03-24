<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">
    Count: {{ count }}
  </button>
</template>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>
