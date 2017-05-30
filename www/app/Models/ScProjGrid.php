<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScProjGrid extends Model
{
  use SoftDeletes;
  protected $table = 'sc_proj_grid';
  protected $primaryKey = 'grid_id';
  public $incrementing = true;
  public $timestamps = true;
  protected $guarded = [];
  protected $dates = ['deleted_at'];
}
