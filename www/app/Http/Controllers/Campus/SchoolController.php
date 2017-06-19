<?php

namespace App\Http\Controllers\Campus;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models as Model;

class SchoolController extends Controller
{
    public function addSchool(Request $request)
    {
        $params = $this->validation($request, [
            'userId' => 'required|numeric',
            'name' => 'required|string',
            'intro' => 'required|string',
            'province' => 'required|numeric'
        ]);
        if ($params === false || !($request->file('schoolLogo')->isValid())) {
            return self::$ERROR1;
        }
        extract($params);
        $fileName = "campus_school_" . time() . ".png";
        $result = $request->file('festLogo')->storeAs('logo', $fileName, 'public');
        $schoolId = Model\SfUser::where('user_id', $userId)->first()->school_id;
        $schoolObj = Model\School::create([
            'name' => $name,
            'intro' => $intro,
            'province' => $province,
            'logo_url' => "http://www.campus.com/storage/logo/$fileName" 
        ]);
        $schoolId = $schoolObj->school_id;
        Model\SchoolAdmin::create([
            'school_id' => $schoolId,
            'user_id' => $userId
        ]);
        return $this->output(['festId' => $festId]);
    }

    public function addSchoolAdmin(Request $request)
    {
        $params = $this->validation($request, [
            'userId' => 'required|numeric',
            'schoolId' => 'required|numeric'
        ]);
        if ($params === false) {
            return self::$ERROR1;
        }
        extract($params);
        $result = Model\SchoolAdmin::create([
            'school_id' => $schoolId,
            'user_id' => $userId
        ]);
        return $this->output(['temp' => $result]);
    }

    public function addOrger(Request $request)
    {
        $params = $this->validation($request, [
            'userId' => 'required|numeric',
            'appType' => 'required|numeric',
            'schoolId' => 'required|numeric'
        ]);
        if ($params === false) {
            return self::$ERROR1;
        }
        extract($params);
        switch ($appType) {
            case 1;
            $result = Model\SfUser::where('user_id', $userId)->update(['school_id' => $schoolId]);
            break;
            case 2;
            $result = Model\ScUser::where('user_id', $userId)->update(['school_id' => $schoolId]);
            break;
            case 3;
            $result = Model\VmUser::where('user_id', $userId)->update(['school_id' => $schoolId]);
            break;
        }
        return $this->output(['updated' => $result]);
    }

    public function delOrger(Request $request)
    {
        $params = $this->validation($request, [
            'userId' => 'required|numeric',
            'appType' => 'required|numeric'
        ]);
        if ($params === false) {
            return self::$ERROR1;
        }
        extract($params);
        switch ($appType) {
        case 1:
            $result = Model\SfUser::where('user_id', $userId)->update(['school_id' => 0]);
            break;
        case 2:
            $result = Model\ScUser::where('user_id', $userId)->update(['school_id' => 0]);
            break;
        case 3:
            $result = Model\VmUser::where('user_id', $userId)->update(['school_id' => 0]);
            break;
        }
        return $this->output(['updated' => $result]);
    }

    public function getOrgerInfo (Request $request)
    {
        $params = $this->validation($request, [
            'userId' => 'required|numeric'
        ]);
        if ($params === false) {
            return self::$ERROR1;
        }
        extract($params);
        $orgerInfo['festOrgers'] = Model\User::join('sf_user', 'user.user_id', '=', 'sf_user.user_id')
            ->select('user.user_id', 'avatar_url', 'nick_name')
            ->where('school_id', 1)
            ->get()->toArray();
        $orgerInfo['campOrgers'] = Model\User::join('sc_user', 'user.user_id', '=', 'sc_user.user_id')
            ->select('user.user_id', 'avatar_url', 'nick_name')
            ->where('school_id', 1)
            ->get()->toArray();
        $orgerInfo['meetOrgers'] = Model\User::join('vm_user', 'user.user_id', '=', 'vm_user.user_id')
            ->select('user.user_id', 'avatar_url', 'nick_name')
            ->where('school_id', 1)
            ->get()->toArray();
        return $this->output(['orgerInfo' => $orgerInfo]);
    }
}
