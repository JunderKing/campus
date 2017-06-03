<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScComnt extends Model
{
  use SoftDeletes;
  protected $table = 'sc_comnt';
  protected $primaryKey = 'comnt_id';
  public $incrementing = true;
  public $timestamps = true;
  protected $guarded = [];
  protected $dates = ['deleted_at'];
}
