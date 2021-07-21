/*
 * @Description: SDK
 * @Author: your name
 * @Date: 2019-05-17 17:02:04
 * @LastEditTime: 2021-07-15 17:26:30
 * @LastEditors: Please set LastEditors
 */
import sdk from 'broadlink-jssdk';
import { formatNickName } from 'utilsPath';

// 关闭当前webView
export const closeWebView = () => {
  sdk.platformSDK.closeWebView();
};

// SDK初始化
export const initSDK = () => {
  return sdk.platformSDK
    .callNative('init')
    .then((res) => {
      if (res && res.lid) {
        return res;
      } else {
        return {
          lid: '1a04dfbce6df97d592a694af8824f6c3',
        };
      }
    })
    .catch((error) => {
      return {
        lid: '1a04dfbce6df97d592a694af8824f6c3',
      };
    });
};

// 查询个人信息
export const getUserInfo = () => {
  return sdk.platformSDK
    .callNative('getUserInfo')
    .then((res) => {
      if (res) {
        if (res.nickName && res.nickName === res.userName) {
          res.nickName = formatNickName(res.nickName);
        } else if (!res.nickName) {
          res.nickName = formatNickName(res.userName);
        }
      }
      return res;
    })
    .catch((error) => {
      console.error('getUserInfo error', error);
    });
};

// 获得域名和协议
export const getHostName = () => {
  let params = {
    method: 'get',
    interfaceName: 'URL_HOST_NAME',
  };
  return sdk.platformSDK.callNative('cloudServices', [params]);
};

/** 选择图片
 * @method selectPicture
 */

export const selectPicture = () => {
  let params = {
    picSource: ['camera', 'gallery'],
    outXPx: 0,
    outYPx: 0,
  };
  return sdk.platformSDK.callNative('selectPicture', [JSON.stringify(params)]);
};

export const uploadFileByApp = (file) => {
  let params = {
    method: 'multipart', //http 请求方法 目前支持get post multipart 文件上传
    interfaceName: 'userfeedback/v2/staticfilesys/feebback/upload',
    filePath: file,
  };
  return sdk.platformSDK
    .callNative('cloudServices', [JSON.stringify(params)])
    .then((file) => {
      return file;
    })
    .catch((res) => {
      console.error('上传图片报错', res);
    });
};
