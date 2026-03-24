<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
            <div class="text-center space-y-2">
                <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <p class="text-sm text-gray-600">
                    Enter your credentials to access your account
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="space-y-4 rounded-md bg-white p-6 shadow-sm">
                    <div class="space-y-1">
                        <label for="email" class="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <Input id="email" v-model="formData.email" type="email" autocomplete="email" required
                            placeholder="you@example.com" />
                    </div>

                    <div class="space-y-1">
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Input id="password" v-model="formData.password" type="password" autocomplete="current-password"
                            required placeholder="••••••••" />
                    </div>
                </div>

                <Button type="submit" class="w-full" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
                </Button>

                <div class="text-center text-sm">
                    <span class="text-gray-600">Don't have an account? </span>
                    <RouterLink to="/" class="font-medium text-blue-600 hover:text-blue-500">
                        Go back home
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const router = useRouter()

const formData = ref({
    email: '',
    password: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    try {
        // First, actually wait for the API/login result
        const user = await authStore.login(formData.value)

        // Then show feedback based on that resolved value
        toast.success(`Login successful - ${user?.name || 'Player'}`)

        console.log('Login successful:', user)
        // Only runs when login did NOT throw (correct credentials)
        router.push('/dashboard')
    } catch (error) {
        // Login/API failed -> stay on page and show error
        console.error('Login failed:', error)
        toast.error(
            `[API] Error logging in - ${error?.response?.data?.message || 'Invalid credentials'}`
        )
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped></style>