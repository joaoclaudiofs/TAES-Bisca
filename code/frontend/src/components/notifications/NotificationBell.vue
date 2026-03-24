<template>
    <Sheet :open="isOpen" @update:open="handleOpenChange">
        <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="relative">
                <Bell class="h-5 w-5" />
                <span v-if="notificationStore.hasUnread"
                    class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                    {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
                </span>
            </Button>
        </SheetTrigger>

        <SheetContent side="bottom" class="h-[70vh] rounded-t-xl flex flex-col">
            <SheetHeader class="border-b pb-3 shrink-0">
                <div class="flex items-center justify-between">
                    <SheetTitle>Notifications</SheetTitle>
                    <Button v-if="notificationStore.hasUnread" variant="ghost" size="sm" class="text-xs h-8"
                        @click="handleMarkAllAsRead">
                        Mark all read
                    </Button>
                </div>
                <SheetDescription class="sr-only">
                    View and manage your notifications
                </SheetDescription>
            </SheetHeader>

            <!-- Notifications List -->
            <ScrollArea class="flex-1 min-h-0">
                <!-- Loading State -->
                <div v-if="notificationStore.loading" class="py-2">
                    <div v-for="i in 3" :key="i" class="flex items-start gap-3 p-4 border-b">
                        <div class="shrink-0 h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                            <div class="h-3 bg-muted rounded animate-pulse w-full"></div>
                            <div class="h-2 bg-muted rounded animate-pulse w-1/4"></div>
                        </div>
                    </div>
                </div>

                <div v-else-if="!notificationStore.notifications || notificationStore.notifications.length === 0"
                    class="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <BellOff class="h-12 w-12 mb-3 opacity-50" />
                    <p class="text-sm">No notifications</p>
                </div>

                <div v-else class="py-2">
                    <div v-for="notification in notificationStore.notifications" :key="notification.id"
                        class="flex items-start gap-3 p-4 active:bg-muted/50 border-b last:border-b-0 transition-colors"
                        :class="{ 'bg-primary/5': !notification.read }" @click="handleNotificationClick(notification)">
                        <!-- Icon -->
                        <div class="shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                            :class="getIconBgClass(notification.type)">
                            <component :is="getIcon(notification.type)" class="h-5 w-5" />
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium">{{ notification.title }}</p>
                            <p class="text-sm text-muted-foreground mt-0.5">{{ notification.message }}</p>
                            <p class="text-xs text-muted-foreground/70 mt-1">{{ formatTime(notification.created_at) }}
                            </p>
                        </div>

                        <!-- Unread indicator -->
                        <div v-if="!notification.read" class="shrink-0 pt-1">
                            <span class="h-2.5 w-2.5 rounded-full bg-primary block"></span>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <!-- Footer -->
            <SheetFooter v-if="notificationStore.notifications && notificationStore.notifications.length > 0"
                class="border-t pt-3 shrink-0">
                <Button variant="outline" class="w-full" @click="handleClearAll">
                    Clear all notifications
                </Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
    SheetDescription
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Bell,
    BellOff,
    Trophy,
    Palette,
    Award,
    Info
} from 'lucide-vue-next';

const router = useRouter();
const notificationStore = useNotificationStore();
const isOpen = ref(false);

function handleOpenChange(open) {
    isOpen.value = open;
    if (open) {
        // Fetch latest notifications when opening
        notificationStore.fetchNotifications();
    }
}

function handleNotificationClick(notification) {
    notificationStore.markAsRead(notification.id);
    isOpen.value = false;

    if (notification.route) {
        router.push(notification.route);
    }
}

async function handleClearAll() {
    await notificationStore.clearAll();
    isOpen.value = false;
}

async function handleMarkAllAsRead() {
    await notificationStore.markAllAsRead();
}

function getIcon(type) {
    switch (type) {
        case 'scoreboard_leader':
            return Trophy;
        case 'new_customization':
            return Palette;
        case 'achievement':
            return Award;
        default:
            return Info;
    }
}

function getIconBgClass(type) {
    switch (type) {
        case 'scoreboard_leader':
            return 'bg-amber-500/20 text-amber-500';
        case 'new_customization':
            return 'bg-purple-500/20 text-purple-500';
        case 'achievement':
            return 'bg-emerald-500/20 text-emerald-500';
        default:
            return 'bg-blue-500/20 text-blue-500';
    }
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
</script>
