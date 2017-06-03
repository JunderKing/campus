<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VmReply extends Model
{
  use SoftDeletes;
  protected $table = 'vm_reply';
  protected $primaryKey = 'reply_id';
  public $incrementing = true;
  public $timestamps = true;
  protected $guarded = [];
  protected $dates = ['deleted_at'];
}
