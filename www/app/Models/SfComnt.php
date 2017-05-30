<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SfComnt extends Model
{
  use SoftDeletes;
  protected $table = 'sf_comnt';
  protected $primaryKey = 'comnt_id';
  public $incrementing = true;
  public $timestamps = true;
  protected $guarded = [];
  protected $dates = ['deleted_at'];
}
