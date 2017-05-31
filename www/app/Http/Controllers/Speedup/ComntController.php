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
    $comnts = Model\ScComnt::where([['tar_type', $tarType], ['tar_id', $tarId]])
      ->join('user', 'sc_comnt.comntor_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'sc_comnt.comnt_id', 'sc_comnt.content', 'sc_comnt.created_at')
      ->orderBy('sc_comnt.created_at', 'desc')
      ->get()->toArray();
    $comntIds = Model\ScComnt::where([['tar_type', $tarType], ['tar_id', $tarId]])->pluck('comnt_id');
    $replies = Model\ScReply::whereIn('comnt_id', $comntIds)
      ->join('user', 'sc_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'sc_reply.comnt_id', 'sc_reply.content')
      ->orderBy('sc_reply.created_at', 'desc')
      ->get()->toArray();
    for ($index= 0; $index < count($comnts); $index++) {
      $comnts[$index]['replies'] = array();
      foreach($replies as $item) {
        if ($comnts[$index]['comnt_id']===$item['comnt_id']) {
          $comnts[$index]['replies'][] = $item;
        }
      }
    }      
    return $this->output(['comnts' => $comnts]);
  }
}
