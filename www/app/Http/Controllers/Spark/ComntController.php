<?php

namespace App\Http\Controllers\Spark;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models as Model;

class ComntController extends Controller
{
  public function addComnt(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'projId' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $comntObj = Model\SfComnt::create([
      'comntor_id' => $userId,
      'proj_id' => $projId,
      'content' => $content
    ]);
    $comntId = $comntObj->comnt_id;
    return $this->output(['comntId' => $comntId]);
  }

  public function addReply(Request $request)
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
    $result = Model\SfReply::create([
      'replier_id' => $userId,
      'tar_type' => $tarType,
      'tar_id' => $tarId,
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
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    //comnts
    $comnts = Model\SfComnt::where('proj_id', $projId)
      ->join('user', 'sf_comnt.comntor_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'sf_comnt.comnt_id', 'sf_comnt.content', 'sf_comnt.created_at')
      ->orderBy('sf_comnt.created_at', 'desc')
      ->get()->toArray();
    $comntIds = Model\SfComnt::where('proj_id', $projId)->pluck('comnt_id');
    $replies = Model\SfReply::where('tar_type', 0)
      ->whereIn('tar_id', $comntIds)
      ->join('user', 'sf_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'sf_reply.tar_id', 'sf_reply.content')
      ->orderBy('sf_reply.created_at', 'desc')
      ->get()->toArray();
    for ($index= 0; $index < count($comnts); $index++) {
      $comnts[$index]['replies'] = array();
      foreach($replies as $item) {
        if ($comnts[$index]['comnt_id']===$item['tar_id']) {
          $comnts[$index]['replies'][] = $item;
        }
      }
    }      
    //scores
    $scores = Model\SfProjScore::where('proj_id', $projId)
      ->join('user', 'sf_proj_score.grader_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'sf_proj_score.*')
      ->orderBy('sf_proj_score.created_at', 'desc')
      ->get()->toArray();
    $scoreIds = Model\SfProjScore::where('proj_id', $projId)->pluck('score_id');
    $replies = Model\SfReply::where('tar_type', 1)
      ->whereIn('tar_id', $scoreIds)
      ->join('user', 'sf_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'sf_reply.tar_id', 'sf_reply.content')
      ->orderBy('sf_reply.created_at', 'desc')
      ->get()->toArray();
    for ($index= 0; $index < count($scores); $index++) {
      $scores[$index]['replies'] = array();
      foreach($replies as $item) {
        if ($scores[$index]['score_id']===$item['tar_id']) {
          $scores[$index]['replies'][] = $item;
        }
      }
    }      
    return $this->output(['comnts' => $comnts, 'scores' => $scores]);
  }

  public function updProjScore(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric',
      'userId' => 'required|numeric',
      'tScore' => 'required|numeric',
      'aScore' => 'required|numeric',
      'bScore' => 'required|numeric',
      'cScore' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\SfProjScore::updateOrCreate(
      ['proj_id' => $projId, 'grader_id' => $userId],
      ['t_score' => $tScore, 'a_score' => $aScore, 'b_score' => $bScore, 'c_score' => $cScore, 'content' => $content]
    );
    return $this->output(['temp' => $result]);
  }

  public function getProjScore(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $projScore = Model\SfProjScore::where([['proj_id', $projId], ['grader_id', $userId]])
      ->select('t_score', 'a_score', 'b_score', 'c_score', 'content')
      ->first();
    $projScore = is_null($projScore) ? [] : $projScore->toArray();
    return $this->output(['projScore' => $projScore]);
  }
}
