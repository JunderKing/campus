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
    $fileName = "spark_project_" . time() . ".png";
    $result = $request->file('projLogo')->storeAs('logo', $fileName, 'public');
    $projObj = Model\Project::create([
      'leader_id' => $userId,
      'name' => $name,
      'logo_url' => "http://www.campus.com/storage/logo/$fileName",
      'province' => 4,
      'tag' => $tag,
      'intro' => $intro,
      'origin' => 2
    ]);
    $projId = $projObj->proj_id;
    Model\SfProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
    Model\ScProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
    Model\VmProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
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
      $projId = Model\SfFestMember::where(['user_id', $userId])
        ->orderBy('created_at', 'desc')
        ->pluck('proj_id');
      if (count($projId) === 0) {
        return $this->output(['projInfo' => ['proj_id' => 0]]);
      }
      Model\SfUser::where('user_id', $userId)->update(['cur_proj_id' => $projId[0]]);
    }
    $projInfo = Model\Project::where('proj_id', $projId[0])
      ->select('proj_id', 'leader_id', 'name', 'intro', 'logo_url', 'province', 'tag', 'origin')
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
    Model\SfFestProject::where('proj_id', $projId)->delete();
    Model\SfProjMember::where('proj_id', $projId)->delete();
    Model\SfProjProgress::where('proj_id', $projId)->delete();
    Model\SfProjScore::where('proj_id', $projId)->delete();
    Model\SfUser::where('cur_proj_id', $projId)->update(['cur_proj_id' => 0]);
    $campMemberNum = Model\ScProjMember::where('proj_id', $projId)->count();
    $meetMemberNum = Model\VmProjMember::where('proj_id', $projId)->count();
    if ($campMemberNum === 0 && $meetMemberNum === 0) {
      Model\Project::where('proj_id', $projId)->delete();
    }
    return $this->output(['deleted' => 'success']);
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
    $projIds = Model\SfProjMember::where('user_id', $userId)->pluck('proj_id');
    $projList = Model\Project::whereIn('proj_id', $projIds)
      ->select('proj_id', 'name')
      ->orderBy('created_at', 'desc')
      ->get()->toArray();
    return $this->output(['projList' => $projList]);
  }

  public function getAvlProjList(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'festId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $festProjIds = Model\SfFestProject::where('fest_id', $festId)->pluck('proj_id');
    $projList = Model\Project::where('leader_id', $userId)
      ->whereNotIn('proj_id', $festProjIds)
      ->select('proj_id', 'name')
      ->get()->toArray();
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
    $isExist = Model\SfProjMember::where($map)->count();
    if (!$isExist) {
      $result = Model\SfProjMember::create(['user_id' => $userId, 'proj_id' => $projId]);
    }
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

  public function getProgInfo(Request $request)
  {
    $params = $this->validation($request, [
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $progInfo = Model\SfProjProgress::where('proj_id', $projId)
      ->select('step_num', 'image_url', 'content')
      ->orderBy('step_num', 'asc')
      ->get()->toArray();
    return $this->output(['progInfo' => $progInfo]);
  }

  public function updProgImage(Request $request)
  {
    $params = $this->validation($request, [
      'stepNum' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false || !($request->file('progImage')->isValid())) {
      return self::$ERROR1;
    }
    extract($params);
    $fileName = "spark_proj_step" . time() . ".png";
    $result = $request->file('progImage')->storeAs('progress', $fileName, 'public');
    $imageUrl = "http://www.campus.com/storage/progress/$fileName";
    $isExist = Model\SfProjProgress::where([['proj_id', $projId], ['step_num', $stepNum]])->count();
    if (!$isExist) {
      Model\SfProjProgress::create([
        'proj_id' => $projId,
        'step_num' => $stepNum,
        'image_url' => $imageUrl
      ]);
    } else {
      Model\SfProjProgress::where([['proj_id', $projId], ['step_num', $stepNum]])
        ->update(['image_url' => $imageUrl]);
    }
    return $this->output(['imageUrl' => $imageUrl]);
  }

  public function updProgContent(Request $request)
  {
    $params = $this->validation($request, [
      'stepNum' => 'required|numeric',
      'projId' => 'required|numeric',
      'content' => 'required|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $isExist = Model\SfProjProgress::where([['proj_id', $projId], ['step_num', $stepNum]])->count();
    if (!$isExist) {
      Model\SfProjProgress::create([
        'proj_id' => $projId,
        'step_num' => $stepNum,
        'content' => $content
      ]);
    } else {
      Model\SfProjProgress::where([['proj_id', $projId], ['step_num', $stepNum]])
        ->update(['content' => $content]);
    }
    return $this->output(['temp' => 'success']);
  }
}
