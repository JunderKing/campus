<?php

namespace App\Http\Controllers\Spark;

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
    $sfUserInfo = Model\SfUser::firstOrCreate(['user_id' => $userId]);
    $curFestId = is_null($sfUserInfo->cur_fest_id) ? 0 : $sfUserInfo->cur_fest_id;
    $isMentor = Model\SfFestMentor::where([['fest_id', $curFestId], ['user_id', $userId]])->count();
    return $this->output(['userInfo' => [
      'userId' => $userId,
      'avatarUrl' => $cmUserInfo->avatar_url,
      'nickName' => $cmUserInfo->nick_name,
      'role' => is_null($cmUserInfo->role) ? 0 : $cmUserInfo->role,
      'festRole' => is_null($sfUserInfo->fest_role) ? 0 : $sfUserInfo->fest_role,
      'curFestId' => $curFestId,
      'curProjId' => is_null($sfUserInfo->cur_proj_id) ? 0 : $sfUserInfo->cur_proj_id,
      'isMentor' => $isMentor
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
    $userInfo = Model\User::join('sf_user', 'user.user_id', '=', 'sf_user.user_id')
      ->where('user.user_id', $userId)
      ->select('user.user_id', 'user.avatar_url', 'user.nick_name', 'user.role', 'sf_user.fest_role', 'sf_user.cur_fest_id', 'sf_user.cur_proj_id')
      ->first()->toArray();
    $festId = $userInfo['cur_fest_id'];
    $userInfo['isMentor'] = Model\SfFestMentor::where([['fest_id', $festId], ['user_id', $userId]])->count();
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
    $result = Model\SfUser::where('user_id', $userId)->update(['fest_role' => 1]);
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
    $result = Model\SfUser::where('user_id', $userId)->update(['fest_role' => 0]);
    return $this->output(['updated' => $result]);
  }

  public function chgCurFestival(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'festId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $exist = Model\SfFestival::find($festId);
    if (!$exist) {
      return self::$ERROR2;
    }
    Model\SfUser::where('user_id', $userId)->update(['cur_fest_id' => $festId]);
    $resArr['isMentor'] = Model\SfFestMentor::where([['fest_id', $festId], ['user_id', $userId]])->count();
    $projIds = Model\SfFestProject::where('fest_id', $festId)->pluck('proj_id');
    $myProjIds = Model\SfProjMember::whereIn('proj_id', $projIds)->where('user_id', $userId)->pluck('proj_id');
    if (count($myProjIds) > 0) {
      Model\SfUser::where('user_id', $userId)->update(['cur_proj_id' => $myProjIds[0]]);
      $resArr['curProjId'] = $myProjIds[0];
    } 
    return $this->output($resArr);
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
    $result = Model\SfUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
    return $this->output(['updated' => $result]);
  }
}
