SparkFestival({
  'login': {
    post: {
      code: 'string',
      rawData: 'string',
      iv: 'string'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      userInfo: {
        uid: 'int',
        avatar: 'string',
        nickName: 'string',
        cpRole: 'int',
        sfRole: 'int',
        curFestid: 'int',
        isMentor: 'int',
        isCaptain: 'int'
      }
    }
  },
  'getUserInfo': {
    post: {
      uid: 'int',
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      userInfo: {
        uid: 'int',
        avatar: 'string',
        nickName: 'string',
        cpRole: 'int',
        sfRole: 'int',
        curFestid: 'int',
        isMentor: 'int',
        isCaptain: 'int'
      }
    }
  },
  'getQrcode': {
    post: {
      path: 'string',
      name: 'string'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      name: 'string'
    }
  },
  'changeCurFest' : {
    post: {
      uid: 'int',
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'addOrger': {
    post: {
      uid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'delOrger': {
    post: {
      uid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'addFestMentor': {
    post: {
      uid: 'int',
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'delFestMentor': {
    post: {
      uid: 'int'
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'addFestCaptain': {
    post: {
      uid: 'int'
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'delFestCaptain': {
    post: {
      uid: 'int'
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'addProjMember': {
    post: {
      uid: 'int'
      projid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'delProjMember': {
    post: {
      uid: 'int'
      projid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'delFestMember: {
    post: {
      uid: 'int'
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'getFestUserInfo': {
    post: {
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      festUserInfo: {
        mentors: [{
          uid: 'int',
          avatar: 'url',
          nickName: 'string'
        }],
        captains: [{
          uid: 'int',
          avatar: 'url',
          ncikName: 'string'
        }],
        members: [{
          uid: 'uid',
          avatar: 'url',
          nickName: 'string'
        }]
      }
    }
  },
  'addFest': {
    post: {
      title: 'string',
      intro: 'string',
      addr: 'string',
      stime: 'int',
      etime: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      festid: 'int'
    }
  },
  'getFestInfo': {
    post: {
      uid: 'int',
      festid: 'int'
    },
    success: {
      errcode: '0',
      errmsg: 'success',
      festInfo: {
        title: 'string',
        intro: 'string',
        addr: 'string',
        logos: [{
          url: 'string'
        }],
        stime: 'int',
        etime: 'inte'
      }
    }
  },
  'getAllFestInfo': {
    get: null,
    success: {
      errcode: '0',
      errmsg: 'success',
      allFests: [{
        festid: 'int',
        title: 'string'
      }]
    }
  },
  'updateFestInfo': {
    post: {
      festid: 'int',
      festInfo: {
        key: value
      }
    },
    success: {
      errcode: '0',
      errmsg: 'success'
    }
  },
  'getFestProjInfo': {
    post: {
      festid: 'int'
    },
    success: {
      errcode: 'int',
      errmsg: 'success',
      projInfo: {
        projid: 'int',
        title: 'string',
        intro: 'string',
        members: [{
          avatar: 'url',
          nickName: 'string'
        }]
      }
    }
  },
  'addProj': {
    post: {
      uid: 'int',
      festid: 'int',
      title: 'string',
      intro: 'string',
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      projid: 'int'
    }
  },
  'getUserProjInfo': {
    post: {
      uid: 'int',
      festid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      projInfo: {
        captainid: 'int',
        title: 'string',
        intro: 'string',
        members: [{
          uid: 'int',
          avatar: 'string',
          nickName: 'string'
        }]
      }
    }
  },
  'getProjInfo': {
    post: {
      projid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      projInfo: {
        captainid: 'int',
        title: 'string',
        intro: 'string',
        members: [{
          uid: 'int',
          avatar: 'string',
          nickName: 'string'
        }]
      }
    }
  },
  'updateProjInfo': {
    post: {
      projid: 'int',
      projInfo: {
        title: 'string',
        intro: 'string'
      }
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'getProjProgInfo': {
    post: {
      projid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      progInfo: [{
        stepid: 'int',
        url: 'url',
        desc: 'string'
      }]
    }
  },
  'updateProjProgImg': {
    post: {
      projid: 'int',
      stepid: 'int',
      file: 'file'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      name: 'string'
    }
  },
  'updateProjProgDesc': {
    post: {
      projid: 'int',
      stepid: 'int',
      desc: 'string'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'addProjCmnt': {
    post: {
      projid: 'int',
      content: 'string'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'delProjCmnt': {
    post: {
      uid: 'int',
      cmntid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'addProjScore': {
    post: {
      uid: 'int',
      projid: 'int',
      tscore: 'int',
      ascore: 'int',
      bscore: 'int',
      cscore: 'int',
      cmnt: 'string'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  },
  'getProjCmnt': {
    post: {
      projid: 'int'
    },
    success: {
      errcode: 0,
      errmsg: 'success',
      cmnts: [{
        uid: 'int',
        avatar: 'url',
        nickName: 'string',
        cmntid: 'int',
        content: 'string',
        replies: [{
          uid: 'int',
          nickName: 'string',
          replyid: 'int',
          targetReplyid: 'int',
          targetNickName: 'string',
          content: 'string'
        }]
      }]
    }
  },
  'addCmntReply': {
    post: {
      uid: 'int',
      cmntid: 'int',
      targetid: 'int',
      content: 'string'
    },
    success: {
      errcode: 0,
      errmsg: 'success'
    }
  }
})
SpeedupCamp({})
VentureMeeting({})
CampusVc({})
