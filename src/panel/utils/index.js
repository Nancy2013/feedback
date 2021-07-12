/*
 * @Author: your name
 * @Date: 2020-11-26 16:24:58
 * @LastEditTime: 2021-03-25 14:27:38
 * @LastEditors: Please set LastEditors
 * @Description: utils function
 * @FilePath: \curtain\src\panel\utils.js
 */
import sdk from 'broadlink-jssdk';
import $ from 'jquery'
import {statusBarHeight,ratio,isIOS} from "componentsPath/device";

// profiles 
// eslint-disable-next-line
const intfs = PROFILE.suids && PROFILE.suids[0] && PROFILE.suids[0].intfs;

/**
 * @description: 获得设备属性
 * @param {*}
 * @return {*} 属性数组
 */
const getKeys = () => Object.keys(intfs)

/**
 * @description: 请求设备信息
 * @param {*} async  isRoom 默认请求位置信息
 * @return {*} 设备信息对象
 */
const getDeviceInfo = async (isRoom=true) => {
  const { platformSDK, __getStatus__ } = sdk;
  const deviceInfo = {};
  const { name } =await __getStatus__(); // 名称
  deviceInfo.name=name

  if (isRoom) {
    const device = await platformSDK.getDevice() || {}; // 基本信息：subDeviceID
    console.log("[subDeviceID]", JSON.stringify(device));
    if (device.subDeviceID) { 
      const room = await platformSDK.callNative("getDeviceRoom", [{ did: device.subDeviceID }]) || {} // 位置
      console.log("[room]", JSON.stringify(room));
      deviceInfo.room = room.name;
    }
  }
  
  console.log("[deviceInfo]", JSON.stringify(deviceInfo));
  return deviceInfo;
}

/**
 * @description: 加载图片
 * @param {*}
 * @return {*} 图片的对象
 */
const importImgs = () => {
  const context = require.context('../images', false, /\.(png|jpe?g|svg|gif)$/);
  const imgs = context.keys().reduce((imgs,key) => {
    const img = context(key);
    const name = key.replace(/(^\.\/|\.(png|jpe?g|svg|gif)$)/g, '');
    imgs[name] = img;
    return imgs;
  },[]);
  return imgs;
}

const debugFixed = () => { 
  var oHeight = document.documentElement.clientHeight;  //获取当前页面高度
  window.addEventListener("resize",function () {
    var resizeHeight = document.documentElement.clientHeight;
     console.log('[oHeight]',oHeight,' [resizeHeight]',resizeHeight);
    if ( resizeHeight < oHeight ) {
        //键盘弹出
      $('.main').css('padding-bottom','50px');
    } else {
        //键盘收起
      $('.main').css('padding-bottom','0px');
    }
  });
}

/**
 * @description: 查询设备状态栏高度
 * @param {*} async
 * @return {*} 状态栏高度
 */
const getStatusBar = async () => {
  const { platformSDK } = sdk
  const setting = await platformSDK.callNative('getSystemSettings')
  let height = 0;
  if (setting && setting.statusBarHeight > 0) {
    height=(isIOS ? setting.statusBarHeight : (setting.statusBarHeight / window.devicePixelRatio)) + 'px'
  }

  const statusBar = (height / ratio) || statusBarHeight;
  return statusBar;
}

//打开模态框前调用
const fixedBody=()=> {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
}

//关闭模态框后调用
const looseBody=()=> {
  var body = document.body;
  body.style.position = 'static';
  var top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  body.style.top = '';
}

export {
  getKeys,
  getDeviceInfo,
  importImgs,
  debugFixed,
  getStatusBar,
  fixedBody,
  looseBody,
}

