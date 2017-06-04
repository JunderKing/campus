<?php

namespace App\Http\Controllers\Speedup;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models as Model;

class CampController extends Controller
{
  public function addCamp(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'name' => 'required|string',
      'intro' => 'required|string',
      'sponsor' => 'required|string'
    ]);
    if ($params === false || !($request->file('campLogo')->isValid())) {
      return self::$ERROR1;
    }
    extract($params);
    $fileName = "speedup_camp_" . time() . ".png";
    $result = $request->file('campLogo')->storeAs('logo', $fileName, 'public');
    $campObj = Model\ScCamp::create([
      'orger_id' => $userId,
      'name' => $name,
      'intro' => $intro,
      'sponsor' => $sponsor,
      'logo_url' => "http://localhost/campusvc/public/storage/logo/$fileName" 
    ]);
    $campId = $campObj->camp_id;
    Model\ScUser::where('user_id', $userId)->update(['cur_camp_id' => $campId]);
    return $this->output(['campId' => $campId]);
  }

  public function getUserCampInfo(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $campId = Model\ScUser::where('user_id', $userId)->pluck('cur_camp_id');
    $campId = $campId[0];
    if ($campId === 0) {
      $campId = Model\ScCamp::max('camp_id');
    }
    if (!$campId) {
      return self::$ERROR2;
    }
    $campInfo = Model\ScCamp::select('camp_id', 'orger_id', 'name', 'intro', 'sponsor', 'logo_url')->find($campId)->toArray();
    $campList = Model\ScCamp::select('camp_id', 'name')->get()->toArray();
    $campInfo['campList'] = $campList;
    $projIds = Model\ScCampProject::where('camp_id', $campId)->pluck('proj_id');
    $isMember = Model\ScProjMember::where('user_id', $userId)->whereIn('proj_id', $projIds)->count();
    $isMentor = Model\ScCampMentor::where([['camp_id', $campId], ['user_id', $userId]])->count();
    $campInfo['hidden'] = $isMember||$isMentor ? 0 : 1;
    $projList = Model\User::join('project', 'user.user_id', '=', 'project.leader_id')
      ->whereIn('project.proj_id', $projIds)
      ->select('user.avatar_url', 'user.nick_name', 'project.proj_id', 'project.name', 'project.tag', 'project.logo_url')
      ->get()->toArray();
    foreach ($projList as &$value) {
      $projId = $value['proj_id'];
      $value['isMember'] = Model\ScProjMember::where([['proj_id', $projId], ['user_id', $userId]])->count();
    }
    $campInfo['projList'] = $projList;
    return $this->output(['campInfo' => $campInfo]);
  }

  public function getCampInfo(Request $request)
  {
    $params = $this->validation($request, [
      'campId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $campInfo = Model\ScCamp::select('orger_id', 'name', 'intro', 'sponsor', 'logo_url')->find($campId)->toArray();
    $mentorIds = Model\ScCampMentor::where('camp_id', $campId)
      ->pluck('user_id');
    $campInfo['mentors'] = Model\User::whereIn('user_id', $mentorIds)
      ->select('user_id', 'avatar_url', 'nick_name')
      ->get()->toArray();
    $projIds = Model\ScCampProject::where('camp_id', $campId)->pluck('proj_id');
    $leaderIds = Model\ScProjMember::whereIn('proj_id', $projIds)
      ->where('is_leader', 1)
      ->pluck('user_id');
    $campInfo['leaders'] = Model\User::whereIn('user_id', $leaderIds)
      ->select('user_id', 'avatar_url', 'nick_name')
      ->get()->toArray();
    $memberIds = Model\ScProjMember::whereIn('proj_id', $projIds)
      ->where('is_leader', 0)
      ->pluck('user_id');
    $campInfo['members'] = Model\User::whereIn('user_id', $memberIds)
      ->select('user_id', 'avatar_url', 'nick_name')
      ->get()->toArray();
    return $this->output(['campInfo' => $campInfo]);
  }

  public function updCampInfo(Request $request)
  {
    $params = $this->validation($request, [
      'campId' => 'required|numeric',
      'campInfo' => 'required|array'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $data = $this->arrayKeyToLine($campInfo);
    $result = Model\ScCamp::where('camp_id', $campId)->update($data);
    return $this->output(['updated' => $result]);
  }

  public function delCamp(Request $request)
  {
    $params = $this->validation($request, [
      'campId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScCamp::where('camp_id', $campId)->delete();
    Model\ScCampProject::where('camp_id', $campId)->delete();
    Model\ScCampMentor::where('camp_id', $campId)->delete();
    Model\ScUser::where('cur_camp_id', $campId)->update(['cur_camp_id' => 0]);
    return $this->output(['deleted' => $result]);
  }

  public function addCampProject(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'campId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScCampProject::firstOrCreate([
      'camp_id' => $campId,
      'proj_id' => $projId
    ]);
    Model\ScUser::where('user_id', $userId)->update(['cur_camp_id' => $campId, 'cur_proj_id' => $projId]);
    return $this->output(['temp' => $result]);
  }

  public function delCampProject(Request $request)
  {
    $params = $this->validation($request, [
      'campId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScCampProject::where([
      ['camp_id', '=', $campId],
      ['proj_id', '=', $projId]
    ])->delete();
    return $this->output(['deleted' => $result]);
  }

  public function addCampMentor(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'campId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScCampMentor::firstOrCreate(['user_id' => $userId, 'camp_id' => $campId]);
    return $this->output(['temp' => $result]);
  }

  public function delCampMentor(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'campId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $map = [
      ['user_id', '=', $userId],
      ['camp_id', '=', $campId]
    ];
    $result = Model\ScCampMember::where($map)->delete();
    return $this->output(['deleted' => $result]);
  }
}
