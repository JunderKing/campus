<?php

namespace App\Http\Controllers\Spark;

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
      'festId' => 'required|numeric'
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
      'logo_url' => "http://localhost/campusvc/public/storage/logo/$fileName",
      'province' => 4,
      'tag' => $tag,
      'intro' => $intro,
      'origin' => 2
    ]);
    $projId = $projObj->proj_id;
    Model\SfProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
    Model\SfUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
    if ($festId > 0) {
      Model\SfFestProject::create(['fest_id' => $festId, 'proj_id' => $projId]);
      Model\SfUser::where('user_id', $userId)->update(['cur_fest_id' => $festId]);
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
    $projId = Model\SfUser::where('user_id', $userId)->pluck('cur_proj_id');
    if ($projId[0] === 0) {
      return $this->output(['projInfo' => ['proj_id' => 0]]);
    }
    $projInfo = Model\Project::where('proj_id', $projId[0])
      ->select('proj_id', 'name', 'intro', 'logo_url', 'province', 'tag', 'origin')
      ->first()->toArray();
    $memberIds = Model\SfProjMember::where('proj_id', $projId)->orderBy('is_leader', 'desc')->pluck('user_id');
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
      ->select('proj_id', 'name', 'intro', 'logo_url', 'province', 'tag', 'origin')
      ->first()->toArray();
    $memberIds = Model\SfProjMember::where('proj_id', $projId)->orderBy('is_leader', 'desc')->pluck('user_id');
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

  //public function getFestProjList(Request $request)
  //{
    //$params = $this->validation($request, [
      //'userId' => 'required|numeric'
    //]);
    //if ($params === false) {
      //return self::$ERROR1;
    //}
    //extract($params);
    //$user = Model\SfUser::where('user_id', $userId)->pluck('cur_fest_id');
    //$festId = $user[0];
    //if ($festId === 0) {
      //$festId = Model\SfFest::max('fest_id');
    //}
    //$projIds = Model\SfFestProj::where('fest_id', $festId)->pluck('proj_id');
    //if (count($projIds) === 0) {
      //return $this->output(['projList' => []]);
    //}
    //$projList = Model\User::join('sf_project as B', 'user.user_id', '=', 'B.leader_id')
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
    $isExist = Model\SfProjMember::where($map)->count();
    if ($isExist > 0) {
      return $this->output(['isExist' => 1]);
    }
    $result = Model\SfProjMember::create(['user_id' => $userId, 'proj_id' => $projId]);
    Model\SfUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
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
    $result = Model\SfProjMember::where($map)->delete();
    return $this->output(['deleted' => $result]);
  }
}
