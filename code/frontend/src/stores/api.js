import { defineStore } from "pinia";
import axios from "axios";
import { inject, ref } from "vue";
export const useAPIStore = defineStore("api", () => {
  const API_BASE_URL = inject("apiBaseURL");

  const postGame = (game) => {
    return axios.post(`${API_BASE_URL}/games`, game);
  };
  const getGames = () => {
    return axios.get(`${API_BASE_URL}/games`);
  };
  const getMatchGames = (matchId) => {
    return axios.get(`${API_BASE_URL}/matches/${matchId}/games`);
  };

  const postMatch = (match) => {
    return axios.post(`${API_BASE_URL}/matches`, match);
  };
  const updateMatch = (id, match) => {
    return axios.put(`${API_BASE_URL}/matches/${id}`, match);
  };

  const getCustomizations = (type) => {
    return axios.get(`${API_BASE_URL}/customizations/${type}`);
  };
  const getOwnedCustomizations = () => {
    return axios.get(`${API_BASE_URL}/customizations/owned`);
  };
  const getCustomizationOwned = (customizationId) => {
    return axios.get(`${API_BASE_URL}/customizations/${customizationId}/owned`);
  };
  const equipCustomization = (customizationId) => {
    return axios.post(
      `${API_BASE_URL}/customizations/${customizationId}/equip`
    );
  };

  const purchaseCustomization = (customizationId) => {
    return axios.post(
      `${API_BASE_URL}/customizations/${customizationId}/purchase`
    );
  };
  const getEquippedDeck = () => {
    return axios.get(`${API_BASE_URL}/users/me/deck`);
  };
  const getEquippedAvatar = () => {
    return axios.get(`${API_BASE_URL}/users/me/avatar`);
  };

  const token = ref();
  // AUTH
  const postLogin = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    token.value = response.data.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  };
  const postLogout = async () => {
    await axios.post(`${API_BASE_URL}/logout`);
    token.value = undefined;
    delete axios.defaults.headers.common["Authorization"];
  };
  // Users
  const getAuthUser = () => {
    return axios.get(`${API_BASE_URL}/users/me`);
  };

  // Coins
  const postAddCoins = (amount) => {
    return axios.post(`${API_BASE_URL}/users/coins/add`, { amount });
  };
  const postRemoveCoins = (amount) => {
    return axios.post(`${API_BASE_URL}/users/coins/remove`, { amount });
  };

  // Stats
  const getUserStats = () => {
    return axios.get(`${API_BASE_URL}/users/stats`);
  };

  // Scoreboard
  const getScoreboard = (page = 1, perPage = 10, signal = null) => {
    return axios.get(`${API_BASE_URL}/scoreboard`, {
      params: { page, per_page: perPage },
      signal,
    });
  };

  const getUserMatches = (page = 1, perPage = 15) => {
    return axios.get(`${API_BASE_URL}/users/me/matches`, {
      params: { page, per_page: perPage },
    });
  };

  // Notifications
  const getNotifications = () => {
    return axios.get(`${API_BASE_URL}/notifications`);
  };

  const getUnreadCount = () => {
    return axios.get(`${API_BASE_URL}/notifications/unread-count`);
  };

  const createNotification = (notification) => {
    return axios.post(`${API_BASE_URL}/notifications`, notification);
  };

  const markNotificationAsRead = (id) => {
    return axios.post(`${API_BASE_URL}/notifications/${id}/read`);
  };

  const markAllNotificationsAsRead = () => {
    return axios.post(`${API_BASE_URL}/notifications/read-all`);
  };

  const dismissNotification = (id) => {
    return axios.post(`${API_BASE_URL}/notifications/${id}/dismiss`);
  };

  const clearAllNotifications = () => {
    return axios.delete(`${API_BASE_URL}/notifications/clear`);
  };

  return {
    postGame,
    getGames,
    postLogin,
    postLogout,
    getAuthUser,
    postMatch,
    updateMatch,
    postAddCoins,
    postRemoveCoins,
    getCustomizations,
    getCustomizationOwned,
    equipCustomization,
    getUserStats,
    purchaseCustomization,
    getEquippedDeck,
    getEquippedAvatar,
    getScoreboard,
    getUserMatches,
    getMatchGames,
    getNotifications,
    getUnreadCount,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    clearAllNotifications,
    getOwnedCustomizations
  };
});
