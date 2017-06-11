<?php

namespace App\Http\Controllers\Campus;

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
            'intro' => 'required|string'
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
            'origin' => 4
        ]);
        $projId = $projObj->proj_id;
        Model\SfProjMember::updateOrCreate(['proj_id' => $projId, 'user_id' => $userId], ['is_leader' => 1]);
        Model\SfUser::where('user_id', $userId)->update(['cur_proj_id' => $projId]);
        return $this->output(['proj_id' => $projId]);
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
        Model\SfFestProject::where('proj_id', $projId)->delete();
        Model\SfUser::where('cur_proj_id', $projId)->update(['cur_proj_id' => 0]);
        Model\ScProjMember::where('proj_id', $projId)->delete();
        Model\ScCampProject::where('proj_id', $projId)->delete();
        Model\ScUser::where('cur_proj_id', $projId)->update(['cur_proj_id' => 0]);
        Model\VmProjMember::where('proj_id', $projId)->delete();
        Model\VmMeetProject::where('proj_id', $projId)->delete();
        //Model\VmUser::where('cur_proj_id', $projId)->update(['cur_proj_id' => 0]);
        return $this->output(['deleted' => $result]);
    }

    public function getProjList(Request $request)
    {
        $params = $this->validation($request, [
            'type' => 'required|numeric'
        ]);
        if ($params === false) {
            return self::$ERROR1;
        }
        extract($params);
        if ($type === 0) {
            $projList = Model\Project::join('user', 'project.leader_id', '=', 'user.user_id')
                //->whereIn('project.proj_id', $projIds)
                ->select('project.proj_id', 'project.name', 'project.tag', 'project.logo_url', 'user.avatar_url', 'user.nick_name')
                ->orderBy('project.created_at', 'desc')
                ->get()->toArray();
        } else if ($type === 1) {
            $projIds = Model\SfFestProject::pluck('proj_id');
            $projList = Model\Project::join('user', 'project.leader_id', '=', 'user.user_id')
                ->whereIn('project.proj_id', $projIds)
                ->select('project.proj_id', 'project.name', 'project.tag', 'project.logo_url', 'user.avatar_url', 'user.nick_name')
                ->orderBy('project.created_at', 'desc')
                ->get()->toArray();
        } else if ($type === 2) {
            $projIds = Model\ScCampProject::pluck('proj_id');
            $projList = Model\Project::join('user', 'project.leader_id', '=', 'user.user_id')
                ->whereIn('project.proj_id', $projIds)
                ->select('project.proj_id', 'project.name', 'project.tag', 'project.logo_url', 'user.avatar_url', 'user.nick_name')
                ->orderBy('project.created_at', 'desc')
                ->get()->toArray();
        } else if ($type === 3) {
            $projIds = Model\VmMeetProject::pluck('proj_id');
            $projList = Model\Project::join('user', 'project.leader_id', '=', 'user.user_id')
                ->whereIn('project.proj_id', $projIds)
                ->select('project.proj_id', 'project.name', 'project.tag', 'project.logo_url', 'user.avatar_url', 'user.nick_name')
                ->orderBy('project.created_at', 'desc')
                ->get()->toArray();
        } else if ($type === 4) {
            $festProjIds = Model\SfFestProject::pluck('proj_id')->toArray();
            $campProjIds = Model\ScCampProject::pluck('proj_id')->toArray();
            $meetProjIds = Model\VmMeetProject::pluck('proj_id')->toArray();
            $projIds = array_unique(array_merge($festProjIds, $campProjIds, $meetProjIds));
            $projList = Model\Project::join('user', 'project.leader_id', '=', 'user.user_id')
                ->whereNotIn('project.proj_id', $projIds)
                ->select('project.proj_id', 'project.name', 'project.tag', 'project.logo_url', 'user.avatar_url', 'user.nick_name')
                ->orderBy('project.created_at', 'desc')
                ->get()->toArray();
        }
        return $this->output(['projList' => $projList]);
    }
}
