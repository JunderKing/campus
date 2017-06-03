<?php

namespace App\Http\Controllers\Venture;

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
    $vmUserInfo = Model\VmUser::firstOrCreate(['user_id' => $userId]);
    return $this->output(['userInfo' => [
      'userId' => $userId,
      'avatarUrl' => $cmUserInfo->avatar_url,
      'nickName' => $cmUserInfo->nick_name,
      'role' => is_null($cmUserInfo->role) ? 0 : $cmUserInfo->role,
      'meetRole' => is_null($vmUserInfo->meet_role) ? 0 : $vmUserInfo->meet_role,
      'curMeetId' => is_null($vmUserInfo->cur_meet_id) ? 0 : $vmUserInfo->cur_meet_id
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
    $userInfo = Model\User::join('vm_user', 'user.user_id', '=', 'vm_user.user_id')
      ->where('user.user_id', $userId)
      ->select('user.user_id', 'user.avatar_url', 'user.nick_name', 'user.role', 'vm_user.meet_role', 'vm_user.cur_meet_id')
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
    $result = Model\VmUser::where('user_id', $userId)->update(['meet_role' => 1]);
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
    $result = Model\VmUser::where('user_id', $userId)->update(['meet_role' => 0]);
    return $this->output(['updated' => $result]);
  }

  public function chgCurMeeting(Request $request)
  {
    $params = $this->validation($request, [
      'userId' => 'required|numeric',
      'meetId' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $exist = Model\VmMeeting::find($meetId);
    if (!$exist) {
      return self::$ERROR2;
    }
    $result = Model\VmUser::where('user_id', $userId)->update(['cur_meet_id' => $meetId]);
    return $this->output(['updated' => $result]);
  }
}
