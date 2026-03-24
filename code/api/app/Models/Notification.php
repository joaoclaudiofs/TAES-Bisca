<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'title',
        'message',
        'route',
        'data',
        'is_global',
        'expires_at',
    ];

    protected $casts = [
        'data' => 'array',
        'is_global' => 'boolean',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    /**
     * Get the users who have seen this notification
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_notifications')
            ->withPivot('read_at', 'dismissed_at')
            ->withTimestamps();
    }

    /**
     * Get user notifications for this notification
     */
    public function userNotifications()
    {
        return $this->hasMany(UserNotification::class);
    }
}
