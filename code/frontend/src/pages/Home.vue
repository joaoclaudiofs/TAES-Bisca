<template>
  <div class="home">
    <div class="landing-content">
      <div class="logo-section">
        <h1 class="game-title">Card Game</h1>
        <p class="game-subtitle">Challenge yourself against the AI</p>
      </div>
      
      <div class="action-buttons">
        <router-link to="/dashboard" class="btn btn-primary">
          Enter Dashboard
        </router-link>
        <router-link to="/login" class="btn btn-secondary">
          Login
        </router-link>
        <button @click="playAsGuest" class="btn btn-outline">
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const playAsGuest = () => {
  // Set guest mode and go to dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.landing-content {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.logo-section {
  margin-bottom: 3rem;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.game-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  display: block;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background: #10b981;
  color: white;
}

.btn-secondary:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-2px);
}

@media (max-width: 400px) {
  .game-title {
    font-size: 2rem;
  }
  
  .btn {
    font-size: 1rem;
    padding: 0.9rem 1.2rem;
  }
}
</style>