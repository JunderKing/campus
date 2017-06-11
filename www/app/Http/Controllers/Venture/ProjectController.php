<?php

namespace App\Http\Controllers\Venture;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models as Model;

class ProjectController extends Controller
{
  public function addProject(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'name' => 'required|string',
      'province' => 'required|numeric',
      'tag' => 'required|string',
      'intro' => 'required|string',
      'meetId' => 'required|numeric'
    ]);
    if ($params === false || !($request->file('projLogo')->isValid())) {
      return self::$ERROR1;
    }
    extract($params);
    $fileName = "venture_project_" . time() . ".png";
    $result = $request->file('projLogo')->storeAs('logo', $fileName, 'public');
    $projObj = Model\Project::create([
      'leader_id' => $userId,
      'name' => $name,
      'logo_url' => "https://www.kingco.tech/storage/logo/$fileName",
      'province' => 4,
      'tag' => $tag,
      'intro' => $intro,
      'origin' => 2
    ]);
    $projId = $projObj->proj_id;
    Model\SfProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
    Model\ScProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
    Model\VmProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
    //Model\VmUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
    if ($meetId > 0) {
      Model\VmMeetProject::create(['meet_id' => $meetId, 'proj_id' => $projId]);
      Model\VmUser::where('user_id', $userId)->update(['cur_meet_id' => $meetId]);
    }
    return $this->output(['proj_id' => $projId]);
  }

  public function getProjInfo(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $projInfo = Model\Project::where('proj_id', $projId)
      ->select('proj_id', 'leader_id', 'name', 'intro', 'logo_url', 'province', 'tag', 'origin')
      ->first()->toArray();
    $memberIds = Model\VmProjMember::where('proj_id', $projId)->orderBy('is_leader', 'desc')->pluck('user_id');
    $members = Model\User::whereIn('user_id', $memberIds)->select('user_id', 'avatar_url', 'nick_name')->get()->toArray();
    $projInfo['members'] = $members;
    return $this->output(['projInfo' => $projInfo]);
  }

  public function updProjInfo(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric',
      'projInfo' => 'required|array'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\Project::where('proj_id', $projId)->update($projInfo);
    return $this->output(['updated' => $result]);
  }

  public function delProject(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\Project::where('proj_id', $projId)->delete();
    Model\SfProjMember::where('proj_id', $projId)->delete();
    Model\ScProjMember::where('proj_id', $projId)->delete();
    Model\VmProjMember::where('proj_id', $projId)->delete();
    Model\ScProjGrid::where('proj_id', $projId)->delete();
    return $this->output(['deleted' => $result]);
  }

  public function getUserProjList(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $projList = Model\Project::where('leader_id', $userId)->select('proj_id', 'name')->get()->toArray();
    return $this->output(['projList' => $projList]);
  }

  public function getAvlProjList(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'meetId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $meetProjIds = Model\VmMeetProject::where('meet_id', $meetId)->pluck('proj_id');
    $projList = Model\Project::where('leader_id', $userId)
      ->whereNotIn('proj_id', $meetProjIds)
      ->select('proj_id', 'name')
      ->get()->toArray();
    return $this->output(['projList' => $projList]);
  }

  public function getMeetProjList(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $meetIdArr = Model\VmUser::where('user_id', $userId)->pluck('cur_meet_id');
    $meetId = $meetIdArr[0];
    if ($meetId === 0) {
      $meetId = Model\VmMeet::max('meet_id');
    }
    $projIds = Model\VmMeetProject::where('meet_id', $meetId)->pluck('proj_id');
    if (count($projIds) === 0) {
      return $this->output(['projList' => []]);
    }
    $projList = Model\User::join('project', 'user.user_id', '=', 'project.leader_id')
      ->whereIn('project.proj_id', $projIds)
      ->select('user.avatar_url', 'user.nick_name', 'project.proj_id', 'project.name', 'project.tag', 'project.logo_url')
      ->get()->toArray();
    foreach ($projList as &$value) {
      $projId = $value['proj_id'];
      $tScore = Model\VmProjScore::where('proj_id', $projId)->avg('t_score');
      $aScore = Model\VmProjScore::where('proj_id', $projId)->avg('a_score');
      $bScore = Model\VmProjScore::where('proj_id', $projId)->avg('b_score');
      $cScore = Model\VmProjScore::where('proj_id', $projId)->avg('c_score');
      $value['projScore'] = round(($tScore + $aScore + $bScore + $cScore) / 4 * 100) / 100;
      $value['isMember'] = Model\VmProjMember::where([['proj_id', $projId], ['user_id', $userId]])->count();
    }
    return $this->output(['projList' => $projList]);
  }

  public function addProjMember(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $map = [
      ['user_id', '=', $userId],
      ['proj_id', '=', $projId]
    ];
    $isExist = Model\VmProjMember::where($map)->count();
    if ($isExist > 0) {
      return $this->output(['isExist' => 1]);
    }
    $result = Model\VmProjMember::create(['user_id' => $userId, 'proj_id' => $projId]);
    $meetIdArr = Model\VmUser::where('user_id', $leaderId)->pluck('cur_meet_id');
    $meetIdArr = Model\VmMeetProject::where('proj_id', $projId)->pluck('meet_id');
    $meetId = $meetIdArr[0];
    Model\VmUser::where('user_id', $userId)->update(['cur_meet_id' => $meetId]);
    //Model\VmUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
    return $this->output(['temp' => $result]);
  }

  public function delProjMember(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $map = [
      ['user_id', '=', $userId],
      ['proj_id', '=', $projId]
    ];
    $result = Model\VmProjMember::where($map)->delete();
    return $this->output(['deleted' => $result]);
  }
}
