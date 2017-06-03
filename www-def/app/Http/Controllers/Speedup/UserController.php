<?php

namespace App\Http\Controllers\Speedup;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Common\UserController as CommonUser;
use App\Models as Model;

class UserController extends Controller
{
  public function login(Request $request)
  {
    $cmUser = new CommonUser();
    $cmUserInfo = $cmUser->register($request);
    if (array_key_exists('errcode', $cmUserInfo)) {
      return $cmUserInfo;
    }
    $userId = $cmUserInfo->user_id;
    $scUserInfo = Model\ScUser::firstOrCreate(['user_id' => $userId]);
    return $this->output(['userInfo' => [
      'userId' => $userId,
      'avatarUrl' => $cmUserInfo->avatar_url,
      'nickName' => $cmUserInfo->nick_name,
      'role' => is_null($cmUserInfo->role) ? 0 : $cmUserInfo->role,
      'campRole' => is_null($scUserInfo->camp_role) ? 0 : $scUserInfo->camp_role,
      'curCampId' => is_null($scUserInfo->cur_camp_id) ? 0 : $scUserInfo->cur_camp_id,
      'curProjId' => is_null($scUserInfo->cur_proj_id) ? 0 : $scUserInfo->cur_proj_id
    ]]);
  }

  public function getUserInfo(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $userInfo = Model\User::join('sc_user', 'user.user_id', '=', 'sc_user.user_id')
      ->where('user.user_id', $userId)
      ->select('user.user_id', 'user.avatar_url', 'user.nick_name', 'user.role', 'sc_user.camp_role', 'sc_user.cur_camp_id', 'sc_user.cur_proj_id')
      ->first();
    return $this->output(['userInfo' => $userInfo]);
  }

  public function addOrger(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScUser::where('user_id', $userId)->update(['camp_role' => 1]);
    return $this->output(['updated' => $result]);
  }

  public function delOrger(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $result = Model\ScUser::where('user_id', $userId)->update(['camp_role' => 0]);
    return $this->output(['updated' => $result]);
  }

  public function chgCurCamp(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'campId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $exist = Model\ScCamp::find($campId);
    if (!$exist) {
      return self::$ERROR2;
    }
    $result = Model\ScUser::where('user_id', $userId)->update(['cur_camp_id' => $campId]);
    $projIds = Model\ScCampProject::where('camp_id', $campId)->pluck('proj_id');
    $myProjIds = Model\ScProjMember::whereIn('proj_id', $projIds)->where('user_id', $userId)->pluck('proj_id');
    if (count($myProjIds) > 0) {
      $projId = Model\ScUser::where('user_id', $userId)->update(['cur_proj_id' => $myProjIds[0]]);
      return $this->output(['projId' => $projId]);
    } 
    return $this->output(['updated' => $result]);
  }

  public function chgCurProject(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'projId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $exist = Model\Project::find($projId);
    if (!$exist) {
      return self::$ERROR2;
    }
    $result = Model\ScUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
    return $this->output(['updated' => $result]);
  }
}
