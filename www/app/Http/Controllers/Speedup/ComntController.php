<?php

namespace App\Http\Controllers\Speedup;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models as Model;

class ComntController extends Controller
{
  public function addComnt(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'tarType' => 'required|numeric',
      'tarId' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $comntObj = Model\ScComnt::create([
      'cmntor_id' => $userId,
      'tar_type' => $tarType,
      'tar_id' => $tarId,
      'content' => $content
    ]);
    $comntId = $comntObj->comnt_id;
    return $this->output(['comntId' => $comntId]);
  }

  public function addReply(Request $request)
  {
    $params = $this->validation($request, [
      'user_id' => 'required|numeric',
      'comnt_id' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScReply::create([
      'replier_id' => $userId,
      'comnt_id' => $comntId,
      'content' => $content
    ]);
    return $this->output(['temp' => $result]);
  }

  public function delComnt(Request $request)
  {
    $params = $this->validation($request, [
      'comnt_id' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScComnt::where('comnt_id', $comntId)->delete();
    Model\ScReply::where('comnt_id', $comntId)->delete();
    return $this->output(['deleted' => $result]);
  }

  public function getComnt(Request $request)
  {
    $params = $this->validation($request, [
      'tarType' => 'required|numeric',
      'tarId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
  }
}
