<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScReply extends Model
{
  use SoftDeletes;
  protected $table = 'sc_reply';
  protected $primaryKey = 'reply_id';
  public $incrementing = true;
  public $timestamps = true;
  protected $guarded = [];
  protected $dates = ['deleted_at'];
}
