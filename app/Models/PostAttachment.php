<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostAttachment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'name',
        'path',
        'mime',
        'created_by'
    ];
}
