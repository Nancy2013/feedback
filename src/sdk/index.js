/*
 * @Description: SDK
 * @Author: your name
 * @Date: 2019-05-17 17:02:04
 * @LastEditTime: 2021-07-13 15:19:29
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
        // res.lid = "bbcec520f24b379971fe0f951b22a3b2";
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
      if (res.nickName && res.nickName === res.userName) {
        res.nickName = formatNickName(res.nickName);
      } else if (!res.nickName) {
        res.nickName = formatNickName(res.userName);
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
