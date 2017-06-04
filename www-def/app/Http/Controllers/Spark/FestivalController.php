<?php

namespace App\Http\Controllers\Spark;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models as Model;

class FestivalController extends Controller
{
  public function addFestival(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'name' => 'required|string',
      'intro' => 'required|string',
      'sponsor' => 'required|string',
      'startTime' => 'required|numeric',
      'endTime' => 'required|numeric',
      'addr' => 'required|string'
    ]);
    if ($params === false || !($request->file('festLogo')->isValid())) {
      return self::$ERROR1;
    }
    extract($params);
    $fileName = "spark_fest_" . time() . ".png";
    $result = $request->file('festLogo')->storeAs('logo', $fileName, 'public');
    $festObj = Model\SfFestival::create([
      'orger_id' => $userId,
      'name' => $name,
      'intro' => $intro,
      'sponsor' => $sponsor,
      'start_time' => $startTime,
      'end_time' => $endTime,
      'addr' => $addr,
      'logo_url' => "http://localhost/campusvc/public/storage/logo/$fileName" 
    ]);
    $festId = $festObj->fest_id;
    Model\SfUser::where('user_id', $userId)->update(['cur_fest_id' => $festId]);
    return $this->output(['festId' => $festId]);
  }

  public function getUserFestInfo(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $festIdArr = Model\SfUser::where('user_id', $userId)->pluck('cur_fest_id');
    $festId = $festIdArr[0];
    if ($festId === 0) {
      $festId = Model\SfFestival::max('fest_id');
    }
    if (!$festId) {
      return self::$ERROR2;
    }
    $festInfo = Model\SfFestival::select('fest_id', 'orger_id', 'name', 'intro', 'sponsor', 'start_time', 'end_time', 'addr', 'logo_url')->find($festId)->toArray();
    $festInfo['isMentor'] = Model\SfFestMentor::where([['fest_id', $festId], ['user_id', $userId]])->count();
    $festList = Model\SfFestival::select('fest_id', 'name')->get()->toArray();
    $projIds = Model\SfFestProject::where('fest_id', $festId)->pluck('proj_id');
    $projList = Model\User::join('project', 'user.user_id', '=', 'project.leader_id')
      ->whereIn('project.proj_id', $projIds)
      ->select('user.avatar_url', 'user.nick_name', 'project.proj_id', 'project.name', 'project.logo_url', 'project.tag')
      ->get()->toArray();
    foreach ($projList as &$value) {
      $projId = $value['proj_id'];
      $imageNum = Model\SfProjProgress::where([['proj_id', $projId], ['image_url', '<>', '']])->count();
      $contentNum = Model\SfProjProgress::where([['proj_id', $projId], ['content', '<>', '']])->count();
      $comntNum = Model\SfComnt::where('proj_id', $projId)->count();
      $comntNum = $comntNum > 3 ? 3 : $comntNum;
      $value['progScore'] = ($imageNum + $contentNum) * 5 + $comntNum * 10;
      $tScore = Model\SfProjScore::where('proj_id', $projId)->avg('t_score');
      $aScore = Model\SfProjScore::where('proj_id', $projId)->avg('a_score');
      $bScore = Model\SfProjScore::where('proj_id', $projId)->avg('b_score');
      $cScore = Model\SfProjScore::where('proj_id', $projId)->avg('c_score');
      $value['projScore'] = round(($tScore + $aScore + $bScore + $cScore) / 4 * 100) / 100;
      $value['isMember'] = Model\SfProjMember::where([['proj_id', $projId], ['user_id', $userId]])->count();
    }
    $festInfo['festList'] = $festList;
    $festInfo['projList'] = $projList;
    return $this->output(['festInfo' => $festInfo]);
  }

  public function getFestInfo(Request $request)
  {
    $params = $this->validation($request, [
      'festId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $festInfo = Model\SfFestival::select('orger_id', 'name', 'intro', 'sponsor', 'logo_url')->find($festId)->toArray();
    $mentorIds = Model\SfFestMentor::where('fest_id', $festId)
      ->pluck('user_id');
    $festInfo['mentors'] = Model\User::whereIn('user_id', $mentorIds)
      ->select('user_id', 'avatar_url', 'nick_name')
      ->get()->toArray();
    $projIds = Model\SfFestProject::where('fest_id', $festId)->pluck('proj_id');
    $projList = Model\Project::join('user', 'project.leader_id', '=', 'user.user_id')
      ->whereIn('project.proj_id', $projIds)
      ->select('project.proj_id', 'project.name', 'project.logo_url', 'user.avatar_url', 'user.nick_name')
      ->get()->toArray();
    //foreach ($projList as &$value) {
    //$projId = $value['proj_id'];
    //$imageNum = Model\SfProjProgress::where([['proj_id', $projId], ['image_url', '<>', '']])->count();
    //$contentNum = Model\SfProjProgress::where([['proj_id', $projId], ['content', '<>', '']])->count();
    //$comntNum = Model\SfComnt::where(['proj_id', $projId])->count();
    //$comntNum = $comntNum > 3 ? 3 : $comntNum;
    //$value['progScore'] = ($imageNum + $contentNum) * 5 + $comntNum * 10;
    //}
    $festInfo['projList'] = $projList;
    return $this->output(['festInfo' => $festInfo]);
  }

  public function updFestInfo(Request $request)
  {
    $params = $this->validation($request, [
      'festId' => 'required|numeric',
      'festInfo' => 'required|array'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $data = $this->arrayKeyToLine($festInfo);
    $result = Model\SfFestival::where('fest_id', $festId)->update($data);
    return $this->output(['updated' => $result]);
  }

  public function delFestival(Request $request)
  {
    $params = $this->validation($request, [
      'festId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    Model\SfFestival::where('fest_id', $festId)->delete();
    Model\SfFestProject::where('fest_id', $festId)->delete();
    Model\SfFestMentor::where('fest_id', $festId)->delete();
    Model\SfUser::where('cur_fest_id', $festId)->update(['cur_fest_id' => 0]);
    return $this->output(['deleted' => 'success']);
  }

  public function addFestProject(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'festId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\SfFestProject::firstOrCreate([
      'fest_id' => $festId,
      'proj_id' => $projId
    ]);
    Model\SfUser::where('user_id', $userId)->update(['cur_fest_id' => $festId, 'cur_proj_id' => $projId]);
    return $this->output(['temp' => $result]);
  }

  public function delFestProject(Request $request)
  {
    $params = $this->validation($request, [
      'festId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\SfFestProject::where([
      ['fest_id', '=', $festId],
      ['proj_id', '=', $projId]
    ])->delete();
    return $this->output(['deleted' => $result]);
  }

  public function addFestMentor(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'festId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\SfFestMentor::firstOrCreate(['user_id' => $userId, 'fest_id' => $festId]);
    return $this->output(['temp' => $result]);
  }

  public function delFestMentor(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'festId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $map = [
      ['user_id', '=', $userId],
      ['fest_id', '=', $festId]
    ];
    $result = Model\SfFestMentor::where($map)->delete();
    return $this->output(['deleted' => $result]);
  }
}
