/*
 * @Author: your name
 * @Date: 2021-07-12 17:16:42
 * @LastEditTime: 2021-07-29 15:05:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\services\appAsk.js
 */
import axios from 'axios';
// const BASE_URL =
//   'https://3079592a830389510fadef125fa3cd71appservice.ibroadlink.com';
const BASE_URL = '';

let commonHeader = {
  licenseid: '1a04dfbce6df97d592a694af8824f6c3',
  language: 'en',
  userid: '',
};
const commonResult = (res) => {
  if (res.status === 200) {
    return res.data;
  } else {
    return {
      status: res.status,
    };
  }
};
// 设置axios的返回拦截-超时处理-设置超时时间6s，因为配置了mock，所以本地环境是不生效的
axios.defaults.timeout = 6000;
axios.interceptors.response.use(
  (response) => {
    console.error('response', response);
    return response;
  },
  (error) => {
    if (error.message.includes('timeout')) {
      let error = {
        status: '-3004', // 返回超时的错误码
        msg: 'timeout',
      };
      return Promise.reject(error);
    } else {
      let error = {
        status: '502', // 返回超时的错误码
        msg: 'timeout',
      };
      return Promise.reject(error);
    }
  }
);

/** 提交问题反馈
 * @method postFeedback
 */
export const postFeedback = (userid = '', lid, params) => {
  console.log('params', params);
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/post`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/**  获得帖子列表
 * @method
 * userid='', lid, params
 */

export const getMyPosts = (userid = '', lid, params) => {
  console.log('【getMyPosts】', 'userid: ', userid, ' lid: ', lid);
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/my`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 删除帖子
 * @method removeThread
 */
export const removeThread = (userid = '', lid, params) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/removethread`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 帖子已解决
 * @method setResolved
 */
export const setResolved = (userid = '', lid, params) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/resolved`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 获取帖子详情
 * @method getPostDetail
 */
export const getPostDetail = (userid, lid, params) => {
  console.log('【getPostDetail】', 'userid: ', userid, ' lid: ', lid);
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/thread`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 获取家庭
 * @method getFamilyList
 */
export const getFamilyList = (obj) => {
  // const {loginInfo} = this.state;
  // let lid = JSON.parse(localStorage.getItem('area'));
  const timestamp = Math.floor(new Date().getTime() / 1000);

  let params = {};
  let head = {
    userid: obj.userId.toString(),
    loginsession: obj.loginSession.toString(),
    licenseid: obj.lid.toString(),
    messageId: timestamp.toString(),
  };
  return axios.post(`${BASE_URL}/appsync/group/member/getfamilylist`, params, {
    headers: head,
  });
};

/**  删除回帖
 * @method removePost
 */
export const removePost = (userid, lid, params) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/removepost`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 回复帖子／评论
 * @method rePly
 */
export const rePly = (userid, lid, params) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/reply`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 上传文件
 * @method uploadFile
 */
export const uploadFile = (userid, lid, file) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/staticfilesys/feebback/upload`, file, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        'Content-Type': 'multiple/form-data',
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

// 订阅问题 我也有此问题
export const followPost = (userid, lid, params) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/follow`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 取消关注
 * @method unFollowPost
 */
export const unFollowPost = (userid, lid, params) => {
  return axios
    .post(`${BASE_URL}/userfeedback/v2/feedback/unfollow`, params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};
