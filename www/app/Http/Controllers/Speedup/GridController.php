<?php

namespace App\Http\Controllers\Speedup;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models as Model;

class GridController extends Controller
{
  public function updGridInfo(Request $request)
  {
    $params = $this->validation($request, [
      'gridId' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScProjGrid::where('grid_id', $gridId)->update(['content' => $content]);
    Model\ScProjGridLog::create(['grid_id' => $gridId, 'content' => $content]);
    return $this->output(['updated' => $result]);
  }

  public function getGridInfo(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric',
      'gridNum' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $map = [
      ['proj_id', '=', $projId],
      ['grid_num', '=', $gridNum]
    ];
    $gridInfo = Model\ScProjGrid::where($map)
      ->select('grid_id', 'content')
      ->first()->toArray();
    return $this->output(['gridInfo' => $gridInfo]);
  }

  public function getGridLog(Request $request)
  {
    $params = $this->validation($request, [
      'gridId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $logList = Model\ScProjGridLog::where('grid_id', $gridId)
      ->select('content', 'created_at')
      ->orderBy('created_at', 'desc')
      ->get()->toArray();
    return $this->output(['logList' => $logList]);
  }
}
