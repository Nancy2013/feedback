/*
 * @Author: your name
 * @Date: 2021-07-12 17:16:42
 * @LastEditTime: 2021-07-13 15:13:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\services\appAsk.js
 */
import axios from 'axios';

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

// productlist
/** 获取获取分类列表
 * @method getProductList
 */
export const getProductList = (userid, lid, countryCode, categoryid) => {
  userid = userid || '';
  lid = lid || '';
  return axios
    .post(
      '/farm/product/v1/system/resource/productlist',
      {
        categoryid: categoryid || '',
      },
      {
        headers: {
          ...commonHeader,
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
          countryCode: countryCode,
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};
/** 获取文章分类列表
 * @method getArticleList
 */
export const getArticleList = (userid = '', lid, categoryid) => {
  return axios
    .post(
      '/userfeedback/v2/help/articlelist',
      {
        categoryid: categoryid,
      },
      {
        headers: {
          ...commonHeader,
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
        },
      }
    )
    .then(function (response) {
      console.log(response, 'articlelist');
      if (response.status === 200 && response.data.status === 0) {
        let res = { status: 0, msg: response.data.msg || '', result: [] };
        let resList = [];
        response.data.result.forEach((_e) => {
          if (_e.articles && _e.articles.length > 0) {
            resList.push(_e);
          }
        });
        res.result = resList;
        return res;
      } else {
        return response.data;
      }
    })
    .catch(function (error) {
      console.error(error, 'articlelist');
      return error;
    });
};
/** 获得文章详情
 * @method getArticleDetail
 * @param {number} articleid 文章的id
 */
export const getArticleDetail = (userid = '', lid, articleid) => {
  return axios
    .post(
      '/userfeedback/v2/help/article',
      {
        articleid: Number(articleid),
      },
      {
        headers: {
          ...commonHeader,
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
        },
      }
    )
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      console.error(err, '获得文章详情 error');
      return err;
    });
};
/** 有帮助
 * @method setUseful
 */
export const setUseful = (userid = '', lid, params) => {
  return axios
    .post('/userfeedback/v2/help/useful', params, {
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
      console.error(err, '有帮助 error');
      return err;
    });
};
/** 搜索帮助
 * @method searchHelp
 * @param {object} params 搜索的参数
 */
export const searchHelp = (userid = '', lid, params) => {
  return axios
    .post('/userfeedback/v2/help/search', params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      if (res.status === 200 && res.data.status === 0) {
        const categories = res.data.result.categories;
        const categoriesMapping = {};
        categories.forEach((_e, _i) => {
          categoriesMapping[_e.categoryid] = { ..._e };
        });
        return {
          ...res.data,
          categoriesMapping: {
            ...categoriesMapping,
          },
        };
      } else {
        return {
          status: res.data.status || res.status,
        };
      }
    })
    .catch((err) => {
      return err;
    });
};
/** 搜索反馈的内容
 * @method searchfeedback
 */

export const searchfeedback = (userid = '', lid, params) => {
  return axios
    .post('/userfeedback/v2/feedback/search', params, {
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
/** 查询热门问题
 * @method getHotList
 */
export const getHotList = (userid = '', lid, params = { pagesize: 10 }) => {
  return axios
    .post('/userfeedback/v2/feedback/hotlist', params, {
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
/** 提交问题反馈
 * @method postFeedback
 */
export const postFeedback = (userid = '', lid, params) => {
  console.log('params', params);
  return axios
    .post('/userfeedback/v2/feedback/post', params, {
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
/** 获得新消息的数目
 * @method getMessageCount
 */
export const getMessageCount = (userid = '', lid) => {
  // userfeedback/v2/message/count
  return axios
    .post(
      '/userfeedback/v2/message/count',
      {
        status: 0,
      },
      {
        headers: {
          ...commonHeader,
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
        },
      }
    )
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

/** 获得消息列表
 * @method getMyMessage
 */
export const getMyMessage = (userid = '', lid, params) => {
  return axios
    .post('/userfeedback/v2/message/my', params, {
      headers: {
        ...commonHeader,
        userid: userid,
        licenseid: lid,
        language: window.useLocale ? window.useLocale : commonHeader.language,
      },
    })
    .then((res) => {
      console.error('res', res);
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
  return axios
    .post('/userfeedback/v2/feedback/my', params, {
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
    .post('/userfeedback/v2/feedback/removethread', params, {
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
    .post('/userfeedback/v2/feedback/resolved', params, {
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
  return axios
    .post('/userfeedback/v2/feedback/thread', params, {
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

// 获取家庭下的设备列表
export const getDeviceList = (obj) => {
  // const {loginInfo} = this.state;
  // let lid = JSON.parse(localStorage.getItem('area'));
  const timestamp = Math.floor(new Date().getTime() / 1000);
  let params = {};
  let head = {
    // "Token": CryptoJS.MD5(JSON.stringify(params) + "xgx3d*fe3478$ukx"),
    // "Timestamp": timestamp,
    userid: obj.userId.toString(),
    loginsession: obj.loginSession.toString(),
    familyid: obj.familyId.toString(), //家庭id
    licenseid: obj.lid.toString(),
    messageId: timestamp.toString(),
  };
  console.log(params, head, '获取设备参数');
  let url = '/appsync/group/dev/query';
  if (obj.pids && obj.pids.length > 0) {
    params.pids = [...obj.pids];
    url = url + '?filter=select';
  }
  return axios.post(url, params, { headers: head });
};
/** 获取获取分类列表
 * @method getCateGoryList
 */
export const getCateGoryList = (userid, lid) => {
  userid = userid || '';
  lid = lid || '';
  return axios
    .post(
      '/userfeedback/v2/help/categorylist',
      {
        categoryid: 0,
      },
      {
        headers: {
          ...commonHeader,
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
        },
      }
    )
    .then(function (response) {
      console.log(response, 'getCateGoryList');
      return response.data;
    })
    .catch(function (error) {
      console.error(error, 'getCateGoryList');
      return error;
    });
};
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
  return axios.post('/appsync/group/member/getfamilylist', params, {
    headers: head,
  });
};
/**  删除回帖
 * @method removePost
 */
export const removePost = (userid, lid, params) => {
  return axios
    .post('/userfeedback/v2/feedback/removepost', params, {
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
    .post('/userfeedback/v2/feedback/reply', params, {
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
 * userfeedback/v2/staticfilesys/feebback/upload
 */
export const uploadFile = (userid, lid, file) => {
  return axios
    .post('/userfeedback/v2/staticfilesys/feebback/upload', file, {
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
// 社区主题筛选
export const filterData = (userid, lid, params) => {
  return axios.post('/userfeedback/v2/feedback/filter', params, {
    headers: {
      ...commonHeader,
      userid: userid,
      licenseid: lid,
      language: window.useLocale ? window.useLocale : commonHeader.language,
    },
  });
};
// 订阅问题 我也有此问题
export const followPost = (userid, lid, params) => {
  return axios
    .post('/userfeedback/v2/feedback/follow', params, {
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
export const unFollowPost = (userid, lid, params) => {
  return axios
    .post('/userfeedback/v2/feedback/unfollow', params, {
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

export const getCategoryList2 = (userid, lid, countryCode) => {
  return axios
    .post(
      '/farm/product/v1/system/resource/categorylist',
      {},
      {
        headers: {
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
          countryCode: countryCode,
        },
      }
    )
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};

// 获取产品详情
// farm/product/v1/system/resource/product/info
export const getProductInfo = (userid, lid, countryCode, pid) => {
  return axios
    .post(
      '/farm/product/v1/system/resource/product/info',
      { pid: pid },
      {
        headers: {
          userid: userid,
          licenseid: lid,
          language: window.useLocale ? window.useLocale : commonHeader.language,
          countryCode: countryCode,
        },
      }
    )
    .then((res) => {
      return commonResult(res);
    })
    .catch((err) => {
      return err;
    });
};
