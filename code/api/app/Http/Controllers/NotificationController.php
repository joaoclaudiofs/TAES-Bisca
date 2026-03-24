<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     * GET /api/notifications
     */
    public function index(Request $request)
    {
        $user = $request->user();


        // Get global notifications or notifications targeted to this user
        $notifications = Notification::where(function ($query) use ($user) {
            $query->where('is_global', 1)
                ->orWhere(function ($q) use ($user) {
                    $q->where('is_global', 0)
                        ->whereRaw("EXISTS (
                    SELECT 1 
                    FROM json_each(json_extract(notifications.data, '$'), '$.user_ids')
                    WHERE value = ?
                )", [$user->id]);
                });
        })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            // Exclude dismissed notifications (This part is perfect)
            ->whereNotExists(function ($query) use ($user) {
                $query->select(DB::raw(1))
                    ->from('user_notifications')
                    ->whereColumn('user_notifications.notification_id', 'notifications.id')
                    ->where('user_notifications.user_id', $user->id)
                    ->whereNotNull('user_notifications.dismissed_at');
            })
            ->orderByDesc('created_at')
            ->get();


        // Get user's read/dismissed status for these notifications
        $notificationIds = $notifications->pluck('id');
        $userNotifications = UserNotification::where('user_id', $user->id)
            ->whereIn('notification_id', $notificationIds)
            ->get()
            ->keyBy('notification_id');

        // Attach read/dismissed status to each notification
        $notificationsData = $notifications->map(function ($notification) use ($userNotifications) {
            $userNotif = $userNotifications->get($notification->id);

            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'route' => $notification->route,
                'data' => $notification->data,
                'created_at' => $notification->created_at,
                'read' => $userNotif ? !is_null($userNotif->read_at) : false,
                'dismissed' => $userNotif ? !is_null($userNotif->dismissed_at) : false,
            ];
        });

        return response()->json($notificationsData);
    }

    /**
     * Get unread notification count
     * GET /api/notifications/unread-count
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        // Get count of notifications that user hasn't read
        $notificationIds = Notification::where(function ($query) use ($user) {
            $query->where('is_global', true)
                ->orWhereJsonContains('data->user_ids', (string)$user->id);
        })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->pluck('id');

        $readNotificationIds = UserNotification::where('user_id', $user->id)
            ->whereIn('notification_id', $notificationIds)
            ->whereNotNull('read_at')
            ->pluck('notification_id');

        $unreadCount = $notificationIds->diff($readNotificationIds)->count();

        return response()->json(['unread_count' => $unreadCount]);
    }

    /**
     * Mark notification as read
     * POST /api/notifications/{id}/read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        // Check if notification exists
        $notification = Notification::findOrFail($id);

        // Create or update user notification
        UserNotification::updateOrCreate(
            [
                'user_id' => $user->id,
                'notification_id' => $id,
            ],
            [
                'read_at' => now(),
                'created_at' => now(),
            ]
        );

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     * POST /api/notifications/read-all
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        // Get all active notification IDs currently visible to this user (not dismissed)
        $notificationIds = Notification::where(function ($query) use ($user) {
            $query->where('is_global', 1)
                ->orWhere(function ($q) use ($user) {
                    $q->where('is_global', 0)
                        ->whereRaw("EXISTS (
                    SELECT 1 
                    FROM json_each(json_extract(notifications.data, '$'), '$.user_ids')
                    WHERE value = ?
                )", [$user->id]);
                });
        })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            // Exclude dismissed notifications (This part is perfect)
            ->whereNotExists(function ($query) use ($user) {
                $query->select(DB::raw(1))
                    ->from('user_notifications')
                    ->whereColumn('user_notifications.notification_id', 'notifications.id')
                    ->where('user_notifications.user_id', $user->id)
                    ->whereNotNull('user_notifications.dismissed_at');
            })
            ->pluck('id');
        // Mark all as read
        foreach ($notificationIds as $notificationId) {
            UserNotification::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_id' => $notificationId,
                ],
                [
                    'read_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Dismiss notification
     * POST /api/notifications/{id}/dismiss
     */
    public function dismiss(Request $request, $id)
    {
        $user = $request->user();

        // Check if notification exists
        $notification = Notification::findOrFail($id);

        // Create or update user notification
        UserNotification::updateOrCreate(
            [
                'user_id' => $user->id,
                'notification_id' => $id,
            ],
            [
                'dismissed_at' => now(),
                'read_at' => now(), // Also mark as read when dismissed
            ]
        );

        return response()->json(['message' => 'Notification dismissed']);
    }

    /**
     * Clear all dismissed notifications
     * DELETE /api/notifications/clear
     */
    public function clearAll(Request $request)
    {
        $user = $request->user();

        // Get all notification IDs for this user
        $notificationIds = Notification::where(function ($query) use ($user) {
            $query->where('is_global', 1)
                ->orWhere(function ($q) use ($user) {
                    $q->where('is_global', 0)
                        ->whereRaw("EXISTS (
                    SELECT 1 
                    FROM json_each(json_extract(notifications.data, '$'), '$.user_ids')
                    WHERE value = ?
                )", [$user->id]);
                });
        })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            // Exclude dismissed notifications (This part is perfect)
            ->whereNotExists(function ($query) use ($user) {
                $query->select(DB::raw(1))
                    ->from('user_notifications')
                    ->whereColumn('user_notifications.notification_id', 'notifications.id')
                    ->where('user_notifications.user_id', $user->id)
                    ->whereNotNull('user_notifications.dismissed_at');
            })->pluck('id');

        // Mark all as dismissed
        foreach ($notificationIds as $notificationId) {
            UserNotification::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_id' => $notificationId,
                ],
                [
                    'dismissed_at' => now(),
                    'read_at' => now(),
                ]
            );
        }

        return response()->json(['message' => 'All notifications cleared']);
    }

    /**
     * Create a new notification (Admin only - for testing)
     * POST /api/notifications
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'route' => 'nullable|string|max:255',
            'data' => 'nullable|array',
            'is_global' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $notification = Notification::create($validated);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification
        ], 201);
    }
}
