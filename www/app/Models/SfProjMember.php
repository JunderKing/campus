<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SfProjMember extends Model
{
  //use SoftDeletes;
  protected $table = 'sf_proj_member';
  //protected $primaryKey = '';
  //public $incrementing = false;
  public $timestamps = true;
  protected $guarded = [];
  //protected $dates = ['deleted_at'];
}
