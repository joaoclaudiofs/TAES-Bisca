import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import { useAPIStore } from "./api";

export const useNotificationStore = defineStore("notification", () => {
  const apiStore = useAPIStore();
  const notifications = ref([]);
  const showDropdown = ref(false);
  const loading = ref(false);

  // Computed
  const hasUnread = computed(() => notifications.value.some((n) => !n.read));
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length
  );

  // Fetch notifications from database
  async function fetchNotifications() {
    try {
      loading.value = true;
      const response = await apiStore.getNotifications();
      notifications.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Fetch unread count from database
  async function fetchUnreadCount() {
    try {
      const response = await apiStore.getUnreadCount();
      return response.data.unread_count;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return 0;
    }
  }

  // Predefined notification types
  function notifyNewLeader(leaderName) {
    addNotification({
      type: "scoreboard_leader",
      title: "New Scoreboard Leader!",
      message: `${leaderName} is now #1 on the leaderboard!`,
      route: "/scoreboard",
    });
  }

  function notifyNewCustomization(itemName) {
    addNotification({
      type: "new_customization",
      title: "New Item Available!",
      message: `Check out the new "${itemName}" in the store!`,
      route: "/store",
    });
  }

  function notifyVictory(coinsEarned) {
    addNotification({
      type: "achievement",
      title: "Victory!",
      message: `You won and earned ${coinsEarned} coins!`,
      route: "/dashboard",
    });
  }

  function notifySystem(title, message) {
    addNotification({
      type: "system",
      title,
      message,
    });
  }

  // Mark notification as read
  async function markAsRead(notificationId) {
    const notification = notifications.value.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;

      try {
        await apiStore.markNotificationAsRead(notificationId);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        notification.read = false; // Rollback on error
      }
    }
  }

  // Mark all as read (only visible notifications)
  async function markAllAsRead() {
    const previousState = notifications.value.map((n) => ({
      id: n.id,
      read: n.read,
    }));

    // Check if there are unread notifications
    if (!notifications.value.some((n) => !n.read)) {
      return; // Nothing to mark as read
    }

    // Optimistically update UI
    notifications.value.forEach((n) => (n.read = true));

    try {
      // Call API endpoint - it handles marking all visible notifications as read
      await apiStore.markAllNotificationsAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Rollback on error
      previousState.forEach((prev) => {
        const notification = notifications.value.find((n) => n.id === prev.id);
        if (notification) notification.read = prev.read;
      });
      toast.error("Failed to mark all as read");
    }
  }

  // Delete notification (dismiss in database)
  async function deleteNotification(notificationId) {
    const index = notifications.value.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      const removed = notifications.value.splice(index, 1)[0];

      try {
        await apiStore.dismissNotification(notificationId);
      } catch (error) {
        console.error("Failed to dismiss notification:", error);
        notifications.value.splice(index, 0, removed); // Rollback
        toast.error("Failed to dismiss notification");
      }
    }
  }

  // Clear all notifications (only visible ones)
  async function clearAll() {
    const previousNotifications = [...notifications.value];
    const notificationIds = notifications.value.map((n) => n.id);

    // Optimistically clear UI
    notifications.value = [];

    try {
      // Dismiss each visible notification
      await Promise.all(
        notificationIds.map((id) => apiStore.dismissNotification(id))
      );
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
      notifications.value = previousNotifications; // Rollback
      toast.error("Failed to clear notifications");
    }
  }

  // Show toast notification using vue-sonner
  function showToast(notification) {
    const toastType =
      notification.type === "achievement"
        ? "success"
        : notification.type === "system"
        ? "info"
        : "message";

    toast[toastType](notification.title, {
      description: notification.message,
      duration: 5000,
    });
  }

  // Toggle dropdown
  function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
  }

  function closeDropdown() {
    showDropdown.value = false;
  }

  // Reset store
  function reset() {
    notifications.value = [];
    showDropdown.value = false;
  }

  return {
    // State
    notifications,
    showDropdown,
    loading,

    // Computed
    hasUnread,
    unreadCount,

    // Actions
    fetchNotifications,
    fetchUnreadCount,
    notifyNewLeader,
    notifyNewCustomization,
    notifyVictory,
    notifySystem,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    showToast,
    toggleDropdown,
    closeDropdown,
    reset,
  };
});
