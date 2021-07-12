/*
 * @Description: SDK
 * @Author: your name
 * @Date: 2019-05-17 17:02:04
 * @LastEditTime: 2021-07-12 17:40:51
 * @LastEditors: Please set LastEditors
 */
import sdk from 'broadlink-jssdk';

export default {
  // SDK加载
  sdkInit: (params) => sdk.ready(params),
};
