<?php

namespace App\Http\Controllers\Common;

include_once __DIR__ . '/aes/wxBizDataCrypt.php';
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models as Model;

class UserController extends Controller
{
  public function register(Request $request){
    $params = $this->validation($request, [
      'code' => 'required|string',
      'rawData' => 'required|string',
      'iv' => 'required|string',
      'type' => 'required|numeric'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    switch ($type) {
      case 1:
        $appId = "wx981c0f2acb244293";
        $appSecret = "802f929b8e2e937483ef719215a5b1cf";
        break;
      case 2:
        $appId = "wxd94ad08cbeb19cea";
        $appSecret = "00a9bdf7fe8f8b1b8c9143f4426c25f3";
        break;
      case 3:
        $appId = "wx92f10f1fb67ef51e";
        $appSecret = "745f91c316673e69bb7434662ce88ee0";
        break;
      case 4:
        $appId = "wx574b06f8d36fc4bf";
        $appSecret = "ac0dd7cb06ebd3ebf78b990d3fd3e021";
        break;
      default:
        return self::$ERROR2;
    }
    $url = "https://api.weixin.qq.com/sns/jscode2session?appid=$appId&secret=$appSecret&js_code=$code&grant_type=authorization_code";
    $resJson = file_get_contents($url);
    $resArr = json_decode($resJson, true);
    if (array_key_exists('errcode', $resArr)) {
      return self::$ERROR2;
    }
    $pc = new \WXBizDataCrypt($appId, $resArr['session_key']);
    $errCode = $pc->decryptData($rawData, $iv, $data);
    if ($errCode !== 0) {
      return self::$ERROR2;
    } 
    $data = json_decode($data, true);
    $unionId = isset($data['unionId']) ? $data['unionId'] : $data['openId'];
    $userInfo = Model\User::updateOrCreate(['union_id' => $unionId], [
      'nick_name' => $data['nickName'],
      'avatar_url' => $data['avatarUrl']
    ]);
    return $userInfo;
  }

  public function getQrcode(Request $request){
    $params = $this->validation($request, [
      'path' => 'required|string',
      'name' => 'required|string',
      'type' => 'numeric|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $filePath = __DIR__ . "/../../../../public/static/qrcode/$name.png";
    if (is_file($filePath)) {
      return $this->output(['exist' => 1]);
    }
    switch ($type) {
      case 1:
        $appId = "wx981c0f2acb244293";
        $appSecret = "802f929b8e2e937483ef719215a5b1cf";
        break;
      case 2:
        $appId = "wxd94ad08cbeb19cea";
        $appSecret = "00a9bdf7fe8f8b1b8c9143f4426c25f3";
        break;
      case 3:
        $appId = "wx92f10f1fb67ef51e";
        $appSecret = "745f91c316673e69bb7434662ce88ee0";
        break;
      case 4:
        $appId = "wx574b06f8d36fc4bf";
        $appSecret = "ac0dd7cb06ebd3ebf78b990d3fd3e021";
        break;
      default:
        return self::$ERROR2;
    }
    $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appId&secret=$appSecret";
    $resData = file_get_contents($url);
    $resArr = json_decode($resData, true);
    $accessToken = $resArr['access_token'];
    if ($accessToken){
      $url = "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=$accessToken";
      $data = json_encode(array('path'=>$path, 'width'=>200));
      //var_dump($data);
      $opts = array(
        'http'=> array(
          'method'=>'POST',
          'header'=>"Content-type: application/x-www-form-urlencoded",
          'content'=>$data
        )
      );
      $context = stream_context_create($opts);
      $resData = file_get_contents($url, false, $context);
      $result = file_put_contents($filePath, $resData);
      return $this->output(['temp' => $result]);
    }
  }

public function getWxCode(Request $request){
    $params = $this->validation($request, [
      'path' => 'required|string',
      'name' => 'required|string',
      'type' => 'numeric|string'
    ]);
    if ($params === false) {
      return self::$ERROR1;
    }
    extract($params);
    $filePath = __DIR__ . "/../../../../public/static/wxcode/$name.png";
    if (is_file($filePath)) {
      return $this->output(['exist' => 1]);
    }
    switch ($type) {
      case 1:
        $appId = "wx981c0f2acb244293";
        $appSecret = "802f929b8e2e937483ef719215a5b1cf";
        break;
      case 2:
        $appId = "wxd94ad08cbeb19cea";
        $appSecret = "00a9bdf7fe8f8b1b8c9143f4426c25f3";
        break;
      case 3:
        $appId = "wx92f10f1fb67ef51e";
        $appSecret = "745f91c316673e69bb7434662ce88ee0";
        break;
      case 4:
        $appId = "wx574b06f8d36fc4bf";
        $appSecret = "ac0dd7cb06ebd3ebf78b990d3fd3e021";
        break;
      default:
        return self::$ERROR2;
    }
    $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appId&secret=$appSecret";
    $resData = file_get_contents($url);
    $resArr = json_decode($resData, true);
    $accessToken = $resArr['access_token'];
    if ($accessToken){
      $url = "https://api.weixin.qq.com/wxa/getwxacode?access_token=$accessToken";
      $data = json_encode(array('path'=>$path, 'width'=>200));
      $opts = array(
        'http'=> array(
          'method'=>'POST',
          'header'=>"Content-type: application/x-www-form-urlencoded",
          'content'=>$data
        )
      );
      $context = stream_context_create($opts);
      $resData = file_get_contents($url, false, $context);
      $result = file_put_contents($filePath, $resData);
      return $this->output(['temp' => $result]);
    }
  }
}
