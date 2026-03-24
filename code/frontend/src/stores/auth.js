import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAPIStore } from "./api";
export const useAuthStore = defineStore("auth", () => {
  const apiStore = useAPIStore();
  const currentUser = ref(undefined);

  const isLoggedIn = computed(() => {
    return currentUser.value !== undefined;
  });
  // Example: registered vs guest
  const isAnonymous = computed(() => !isLoggedIn.value);
  // Capabilities based on user type/coins/etc.
  const canAccessHistory = computed(() => isLoggedIn.value);
  const canAccessLeaderboard = computed(() => isLoggedIn.value);
  const canAccessStore = computed(
    () => isLoggedIn.value && (currentUser.value?.coins_balance ?? 0) >= 0
  );
  const loginAsGuest = () => {
    currentUser.value = undefined;
  };
  const login = async (credentials) => {
    await apiStore.postLogin(credentials);
    const response = await apiStore.getAuthUser();
    currentUser.value = response.data;
    return response.data;
  };
  const logout = async () => {
    await apiStore.postLogout();
    currentUser.value = undefined;
  };
  const addCoins = async (amount) => {
    if (!currentUser.value) return;
    await apiStore.postAddCoins(amount);
    currentUser.value.coins_balance += amount;
  };
  const removeCoins = async (amount) => {
    if (!currentUser.value) return;
    await apiStore.postRemoveCoins(amount);
    currentUser.value.coins_balance -= amount;
  };

  const getStats = async () => {
    if (!currentUser.value) return null;
    const response = await apiStore.getUserStats();
    return response.data;
  };

  return {
    currentUser,
    isAnonymous,
    canAccessHistory,
    canAccessLeaderboard,
    canAccessStore,
    isLoggedIn,
    loginAsGuest,
    login,
    logout,
    removeCoins,
    addCoins,
    getStats,
  };
});
