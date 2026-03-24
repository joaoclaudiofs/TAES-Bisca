<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNotification extends Model
{
    protected $fillable = [
        'user_id',
        'notification_id',
        'read_at',
        'dismissed_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'dismissed_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    /**
     * Get the user that owns the notification
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the notification
     */
    public function notification()
    {
        return $this->belongsTo(Notification::class);
    }
}
