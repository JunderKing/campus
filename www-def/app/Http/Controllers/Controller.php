<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Validator;

class Controller extends BaseController
{
  use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

  public static $SUCCESS = ['errcode' => 0, 'errmsg' => 'Success'];
  public static $ERROR1 = ['errcode' => 1, 'errmsg' => 'Param Error'];
  public static $ERROR2 = ['errcode' => 2, 'errmsg' => 'Data Error'];
  public static $ERROR3 = ['errcode' => 3, 'errmsg' => 'Output Error'];

  public function validation(Request $request, Array $rules)
  {
    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
      return false;
    } else {
      $params = $request->only(array_keys($rules));
      foreach ($params as $key => &$value) {
        if (strpos($rules[$key], 'numeric')!==false) {
          $value = intval($value);
        }
      }
      return $params;
    }
  }

  public function output(Array $data)
  {
    $isValid = true;
    if (count($data) === 0) {
      $isValid = false;
    }
    array_walk_recursive($data, function($value, $key) use (&$isValid){
      if (is_null($value) || ($key === 'temp' && $value === false)) {
        $isValid = false;
        return;
      } 
    });
    //if (!$isValid) {
    if (false) {
      return self::$ERROR3;
    } else {
      unset($data['temp']);
      $result = $this->arrayKeyToCamel($data);
      return array_merge(self::$SUCCESS, $result);
    }
  }

  public function arrayKeyToCamel (Array $array)
  {
    $newArray = array();
    foreach ($array as $key => $value) {
      $newKey = preg_replace_callback('/([-_]+([a-z]{1}))/i',function($matches){
        return strtoupper($matches[2]);
      }, $key);
      $newArray[$newKey] = is_array($value) ? $this->arrayKeyToCamel($value) : $value;
    }
    return $newArray;
  }

  public function arrayKeyToLine (Array $array)
  {
    array_walk_recursive($array, function ($value, &$key){
      $key = preg_replace_callback('/([A-Z]{1})/',function($matches){
        return '_'.strtolower($matches[0]);
      }, $key);
    });
  }
}
