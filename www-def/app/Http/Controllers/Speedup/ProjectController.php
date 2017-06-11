<?php

namespace App\Http\Controllers\Speedup;

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
      'campId' => 'required|numeric'
    ]);
    if ($params === false || !($request->file('projLogo')->isValid())) {
      return self::$ERROR1;
    }
    extract($params);
    $fileName = "speedup_project_" . time() . ".png";
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
    Model\ScUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
    if ($campId > 0) {
      Model\ScCampProject::create(['camp_id' => $campId, 'proj_id' => $projId]);
      Model\ScUser::where('user_id', $userId)->update(['cur_camp_id' => $campId]);
    }
    return $this->output(['proj_id' => $projId]);
  }

  public function getUserProjInfo(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $projId = Model\ScUser::where('user_id', $userId)->pluck('cur_proj_id');
    if ($projId[0] === 0) {
      return $this->output(['projInfo' => ['proj_id' => 0]]);
    }
    $projInfo = Model\Project::where('proj_id', $projId[0])
      ->select('proj_id', 'leader_id', 'name', 'intro', 'logo_url', 'province', 'tag', 'origin')
      ->first()->toArray();
    $memberIds = Model\ScProjMember::where('proj_id', $projId)->orderBy('is_leader', 'desc')->pluck('user_id');
    $members = Model\User::whereIn('user_id', $memberIds)->select('user_id', 'avatar_url', 'nick_name')->get()->toArray();
    $projInfo['members'] = $members;
    return $this->output(['projInfo' => $projInfo]);
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
    $memberIds = Model\ScProjMember::where('proj_id', $projId)->orderBy('is_leader', 'desc')->pluck('user_id');
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
      'campId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $campProjIds = Model\ScCampProject::where('camp_id', $campId)->pluck('proj_id');
    $projList = Model\Project::where('leader_id', $userId)
      ->whereNotIn('proj_id', $campProjIds)
      ->select('proj_id', 'name')
      ->get()->toArray();
    return $this->output(['projList' => $projList]);
  }

  //public function getCampProjList(Request $request)
  //{
    //$params = $this->validation($request, [
      //'userId' => 'required|numeric'
    //]);
    //if ($params === false) {
      //return self::$ERROR1;
    //}
    //extract($params);
    //$user = Model\ScUser::where('user_id', $userId)->pluck('cur_camp_id');
    //$campId = $user[0];
    //if ($campId === 0) {
      //$campId = Model\ScCamp::max('camp_id');
    //}
    //$projIds = Model\ScCampProj::where('camp_id', $campId)->pluck('proj_id');
    //if (count($projIds) === 0) {
      //return $this->output(['projList' => []]);
    //}
    //$projList = Model\User::join('sc_project as B', 'user.user_id', '=', 'B.leader_id')
      //->whereIn('B.proj_id', $projIds)
      //->select('user.avatar_url', 'user.nick_name', 'B.proj_id', 'B.name', 'B.logo_url')
      //->get()->toArray();
    //return $this->output(['projList' => $projList]);
  //}

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
    $isExist = Model\ScProjMember::where($map)->count();
    if ($isExist > 0) {
      return $this->output(['isExist' => 1]);
    }
    $result = Model\ScProjMember::create(['user_id' => $userId, 'proj_id' => $projId]);
    Model\ScUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
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
    $result = Model\ScProjMember::where($map)->delete();
    return $this->output(['deleted' => $result]);
  }
}
