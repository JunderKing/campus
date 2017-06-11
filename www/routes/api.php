<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'common', 'namespace' => 'Common'], function(){
  //UserController
  Route::any('getQrcode', 'UserController@getQrcode');
  Route::any('getWxcode', 'UserController@getWxcode');
});

Route::group(['prefix' => 'campus', 'namespace' => 'Campus'], function(){
  Route::any('getProjList', 'ProjectController@getProjList');
  Route::any('addProject', 'ProjectController@addProject');
  Route::any('getProjInfo', 'ProjectController@getProjInfo');
  Route::any('delProject', 'ProjectController@delProject');
  Route::any('addPost', 'PostController@addPost');
  Route::any('delPost', 'PostController@delPost');
  Route::any('getPostInfo', 'PostController@getPostInfo');
  Route::any('getPostList', 'PostController@getPostList');
});


Route::group(['prefix' => 'spark', 'namespace' => 'Spark'], function(){
  //UserController
  Route::any('login', 'UserController@login');
  Route::any('getUserInfo', 'UserController@getUserInfo');
  Route::any('addOrger', 'UserController@addOrger');
  Route::any('delOrger', 'UserController@delOrger');
  Route::any('chgCurFestival', 'UserController@chgCurFestival');
  Route::any('chgCurProject', 'UserController@chgCurProject');
  //FestivalController
  Route::any('addFestival', 'FestivalController@addFestival');
  Route::any('delFestival', 'FestivalController@delFestival');
  Route::any('updFestInfo', 'FestivalController@updFestInfo');
  Route::any('getFestInfo', 'FestivalController@getFestInfo');
  Route::any('getUserFestInfo', 'FestivalController@getUserFestInfo');
  Route::any('getAllFestList', 'FestivalController@getAllFestList');
  Route::any('addFestProject', 'FestivalController@addFestProject');
  Route::any('delFestProject', 'FestivalController@delFestProject');
  Route::any('addFestMentor', 'FestivalController@addFestMentor');
  Route::any('delFestMentor', 'FestivalController@delFestMentor');
  //ProjectController
  Route::any('addProject', 'ProjectController@addProject');
  Route::any('delProject', 'ProjectController@delProject');
  Route::any('updProjInfo', 'ProjectController@updProjInfo');
  Route::any('getProjInfo', 'ProjectController@getProjInfo');
  Route::any('getUserProjInfo', 'ProjectController@getUserProjInfo');
  Route::any('getUserProjList', 'ProjectController@getUserProjList');
  Route::any('getAvlProjList', 'ProjectController@getAvlProjList');
  Route::any('getFestProjList', 'ProjectController@getFestProjList');
  Route::any('addProjMember', 'ProjectController@addProjMember');
  Route::any('delProjMember', 'ProjectController@delProjMember');
  Route::any('getProgInfo', 'ProjectController@getProgInfo');
  Route::any('updProgImage', 'ProjectController@updProgImage');
  Route::any('updProgContent', 'ProjectController@updProgContent');
  //ComntController
  Route::any('addComnt', 'ComntController@addComnt');
  Route::any('delComnt', 'ComntController@delComnt');
  Route::any('getComnt', 'ComntController@getComnt');
  Route::any('addReply', 'ComntController@addReply');
  Route::any('addProjScore', 'ComntController@addProjScore');
  Route::any('updProjScore', 'ComntController@updProjScore');
  Route::any('delProjScore', 'ComntController@delProjScore');
  Route::any('getProjScore', 'ComntController@getProjScore');
});

Route::group(['prefix' => 'speedup', 'namespace' => 'Speedup'], function(){
  //UserController
  Route::any('login', 'UserController@login');
  Route::any('getUserInfo', 'UserController@getUserInfo');
  Route::any('addOrger', 'UserController@addOrger');
  Route::any('delOrger', 'UserController@delOrger');
  Route::any('chgCurCamp', 'UserController@chgCurCamp');
  Route::any('chgCurProject', 'UserController@chgCurProject');
  //CampController
  Route::any('addCamp', 'CampController@addCamp');
  Route::any('delCamp', 'CampController@delCamp');
  Route::any('updCampInfo', 'CampController@updCampInfo');
  Route::any('getCampInfo', 'CampController@getCampInfo');
  Route::any('getUserCampInfo', 'CampController@getUserCampInfo');
  Route::any('addCampProject', 'CampController@addCampProject');
  Route::any('delCampProject', 'CampController@delCampProject');
  Route::any('addCampMentor', 'CampController@addCampMentor');
  Route::any('delCampMentor', 'CampController@delCampMentor');
  //ProjectController
  Route::any('addProject', 'ProjectController@addProject');
  Route::any('delProject', 'ProjectController@delProject');
  Route::any('updProjInfo', 'ProjectController@updProjInfo');
  Route::any('getProjInfo', 'ProjectController@getProjInfo');
  Route::any('getUserProjInfo', 'ProjectController@getUserProjInfo');
  Route::any('getUserProjList', 'ProjectController@getUserProjList');
  Route::any('getAvlProjList', 'ProjectController@getAvlProjList');
  Route::any('getCampProjList', 'ProjectController@getCampProjList');
  Route::any('addProjMember', 'ProjectController@addProjMember');
  Route::any('delProjMember', 'ProjectController@delProjMember');
  //RecordController
  Route::any('addRecord', 'RecordController@addRecord');
  Route::any('delRecord', 'RecordController@delRecord');
  Route::any('updRecInfo', 'RecordController@updRecInfo');
  Route::any('getRecInfo', 'RecordController@getRecInfo');
  Route::any('getRecList', 'RecordController@getRecList');
  //GridController
  Route::any('updGridInfo', 'GridController@updGridInfo');
  Route::any('getGridInfo', 'GridController@getGridInfo');
  Route::any('getGridLog', 'GridController@getGridLog');
  //CardController
  Route::any('addCard', 'CardController@addCard');
  Route::any('delCard', 'CardController@delCard');
  Route::any('updCardInfo', 'CardController@updCardInfo');
  Route::any('getCardInfo', 'CardController@getCardInfo');
  Route::any('getGridCardList', 'CardController@getGridCardList');
  Route::any('getProjCardList', 'CardController@getProjCardList');
  //ComntController
  Route::any('addComnt', 'ComntController@addComnt');
  Route::any('delComnt', 'ComntController@delComnt');
  Route::any('getComnt', 'ComntController@getComnt');
  Route::any('addReply', 'ComntController@addReply');
});

Route::group(['prefix' => 'venture', 'namespace' => 'Venture'], function(){
  //UserController
  Route::any('login', 'UserController@login');
  Route::any('getUserInfo', 'UserController@getUserInfo');
  Route::any('addOrger', 'UserController@addOrger');
  Route::any('delOrger', 'UserController@delOrger');
  Route::any('chgCurMeeting', 'UserController@chgCurMeeting');
  Route::any('chgCurProject', 'UserController@chgCurProject');
  //MeetingController
  Route::any('addMeeting', 'MeetingController@addMeeting');
  Route::any('delMeeting', 'MeetingController@delMeeting');
  Route::any('updMeetInfo', 'MeetingController@updMeetInfo');
  Route::any('getMeetInfo', 'MeetingController@getMeetInfo');
  Route::any('getUserMeetInfo', 'MeetingController@getUserMeetInfo');
  Route::any('addMeetProject', 'MeetingController@addMeetProject');
  Route::any('delMeetProject', 'MeetingController@delMeetProject');
  Route::any('addMeetInvor', 'MeetingController@addMeetInvor');
  Route::any('delMeetInvor', 'MeetingController@delMeetInvor');
  //ProjectController
  Route::any('addProject', 'ProjectController@addProject');
  Route::any('delProject', 'ProjectController@delProject');
  Route::any('updProjInfo', 'ProjectController@updProjInfo');
  Route::any('getProjInfo', 'ProjectController@getProjInfo');
  Route::any('getUserProjInfo', 'ProjectController@getUserProjInfo');
  Route::any('getMeetProjList', 'ProjectController@getMeetProjList');
  Route::any('getAvlProjList', 'ProjectController@getAvlProjList');
  Route::any('addProjMember', 'ProjectController@addProjMember');
  Route::any('delProjMember', 'ProjectController@delProjMember');
  Route::any('getProgInfo', 'ProjectController@getProgInfo');
  Route::any('updProgImage', 'ProjectController@updProgImage');
  Route::any('updProgDesc', 'ProjectController@updProgDesc');
  //InvorController
  Route::any('addInvor', 'InvorController@addInvor');
  Route::any('delInvor', 'InvorController@delInor');
  Route::any('updInvorInfo', 'InvorController@updInvorInfo');
  Route::any('getInvorInfo', 'InvorController@getInvorInfo');
  Route::any('getMeetInvorList', 'InvorController@getMeetInvorList');
  //ComntController
  Route::any('addComnt', 'ComntController@addComnt');
  Route::any('delComnt', 'ComntController@delComnt');
  Route::any('getProjComnt', 'ComntController@getProjComnt');
  Route::any('getInvorComnt', 'ComntController@getInvorComnt');
  Route::any('addReply', 'ComntController@addReply');
  Route::any('addInvorScore', 'ComntController@addInvorScore');
  Route::any('updInvorScore', 'ComntController@updInvorScore');
  Route::any('delInvorScore', 'ComntController@delInvorScore');
  Route::any('getInvorScore', 'ComntController@getInvorScore');
  Route::any('addProjScore', 'ComntController@addProjScore');
  Route::any('updProjScore', 'ComntController@updProjScore');
  Route::any('delProjScore', 'ComntController@delProjScore');
  Route::any('getProjScore', 'ComntController@getProjScore');
});
