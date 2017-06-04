<?php

namespace App\Http\Controllers\Venture;

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
    $comntObj = Model\VmComnt::create([
      'comntor_id' => $userId,
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
      'userId' => 'required|numeric',
      'tarType' => 'required|numeric',
      'tarId' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\VmReply::create([
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
    Model\ScReply::where([['tar_type', 0], ['tar_id', $comntId]])->delete();
    return $this->output(['deleted' => $result]);
  }

  public function getProjComnt(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    //comnts
    $comnts = Model\VmComnt::where([['tar_type', 0], ['tar_id', $projId]])
      ->join('user', 'vm_comnt.comntor_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'vm_comnt.comnt_id', 'vm_comnt.content', 'vm_comnt.created_at')
      ->orderBy('vm_comnt.created_at', 'desc')
      ->get()->toArray();
    $comntIds = Model\VmComnt::where([['tar_type', 0], ['tar_id', $projId]])->pluck('comnt_id');
    $replies = Model\VmReply::where('tar_type', 0)
      ->whereIn('tar_id', $comntIds)
      ->join('user', 'vm_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'vm_reply.tar_id', 'vm_reply.content')
      ->orderBy('vm_reply.created_at', 'desc')
      ->get()->toArray();
    for ($index= 0; $index < count($comnts); $index++) {
      $comnts[$index]['replies'] = array();
      foreach($replies as $item) {
        if ($comnts[$index]['comnt_id']===$item['tar_id']) {
          $comnts[$index]['replies'][] = $item;
        }
      }
    }      
    //projScores
    $scores = Model\VmProjScore::where('proj_id', $projId)
      ->join('user', 'vm_proj_score.grader_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'vm_proj_score.*')
      ->orderBy('vm_proj_score.created_at', 'desc')
      ->get()->toArray();
    $scoreIds = Model\VmProjScore::where('proj_id', $projId)->pluck('score_id');
    $replies = Model\VmReply::where('tar_type', 0)
      ->whereIn('tar_id', $scoreIds)
      ->join('user', 'vm_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'vm_reply.tar_id', 'vm_reply.content')
      ->orderBy('vm_reply.created_at', 'desc')
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

  public function getInvorComnt(Request $request)
  {
    $params = $this->validation($request, [
      'invorId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    //comnts
    $comnts = Model\VmComnt::where([['tar_type', 1], ['tar_id', $invorId]])
      ->join('user', 'vm_comnt.comntor_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'vm_comnt.comnt_id', 'vm_comnt.content', 'vm_comnt.created_at')
      ->orderBy('vm_comnt.created_at', 'desc')
      ->get()->toArray();
    $comntIds = Model\VmComnt::where([['tar_type', 1], ['tar_id', $invorId]])->pluck('comnt_id');
    $replies = Model\VmReply::where('tar_type', 0)
      ->whereIn('tar_id', $comntIds)
      ->join('user', 'vm_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'vm_reply.tar_id', 'vm_reply.content')
      ->orderBy('vm_reply.created_at', 'desc')
      ->get()->toArray();
    for ($index= 0; $index < count($comnts); $index++) {
      $comnts[$index]['replies'] = array();
      foreach($replies as $item) {
        if ($comnts[$index]['comnt_id']===$item['tar_id']) {
          $comnts[$index]['replies'][] = $item;
        }
      }
    }      
    //invorScores
    $scores = Model\VmInvorScore::where('invor_id', $invorId)
      ->join('user', 'vm_invor_score.grader_id', '=', 'user.user_id')
      ->select('user.avatar_url', 'user.nick_name', 'vm_invor_score.*')
      ->orderBy('vm_invor_score.created_at', 'desc')
      ->get()->toArray();
    $scoreIds = Model\VmInvorScore::where('invor_id', $invorId)->pluck('score_id');
    $replies = Model\VmReply::where('tar_type', 1)
      ->whereIn('tar_id', $scoreIds)
      ->join('user', 'vm_reply.replier_id', '=', 'user.user_id')
      ->select('user.nick_name', 'vm_reply.tar_id', 'vm_reply.content')
      ->orderBy('vm_reply.created_at', 'desc')
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
    $result = Model\VmProjScore::updateOrCreate(
      ['proj_id' => $projId, 'grader_id' => $userId],
      ['t_score' => $tScore, 'a_score' => $aScore, 'b_score' => $bScore, 'c_score' => $cScore, 'content' => $content]
    );
    return $this->output(['temp' => $result]);
  }

  public function updInvorScore(Request $request)
  {
    $params = $this->validation($request, [
      'invorId' => 'required|numeric',
      'userId' => 'required|numeric',
      'score' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\VmInvorScore::updateOrCreate(
      ['invor_id' => $invorId, 'grader_id' => $userId],
      ['score' => $score, 'content' => $content]
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
    $projScore = Model\VmProjScore::where([['proj_id', $projId], ['grader_id', $userId]])
      ->select('t_score', 'a_score', 'b_score', 'c_score', 'content')
      ->first();
    $projScore = is_null($projScore) ? [] : $projScore->toArray();
    return $this->output(['projScore' => $projScore]);
  }

  public function getInvorScore(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'invorId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $invorScore = Model\VmInvorScore::where([['invor_id', $invorId], ['grader_id', $userId]])
      ->select('score')
      ->first();
    $invorScore = is_null($invorScore) ? ['score' => 0] : $invorScore->toArray();
    return $this->output(['invorScore' => $invorScore]);
  }
}

