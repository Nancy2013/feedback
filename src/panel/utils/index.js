/*
 * @Author: your name
 * @Date: 2020-11-26 16:24:58
 * @LastEditTime: 2021-07-14 15:41:38
 * @LastEditors: Please set LastEditors
 * @Description: utils function
 * @FilePath: \curtain\src\panel\utils.js
 */
import sdk from 'broadlink-jssdk';
import moment from 'moment';
import $ from 'jquery';
import { statusBarHeight, ratio, isIOS } from 'componentsPath/device';

/**
 * @description: 请求设备信息
 * @param {*} async  isRoom 默认请求位置信息
 * @return {*} 设备信息对象
 */
const getDeviceInfo = async (isRoom = true) => {
  const { platformSDK, __getStatus__ } = sdk;
  const deviceInfo = {};
  const { name } = await __getStatus__(); // 名称
  deviceInfo.name = name;

  if (isRoom) {
    const device = (await platformSDK.getDevice()) || {}; // 基本信息：subDeviceID
    console.log('[subDeviceID]', JSON.stringify(device));
    if (device.subDeviceID) {
      const room =
        (await platformSDK.callNative('getDeviceRoom', [
          { did: device.subDeviceID },
        ])) || {}; // 位置
      console.log('[room]', JSON.stringify(room));
      deviceInfo.room = room.name;
    }
  }

  console.log('[deviceInfo]', JSON.stringify(deviceInfo));
  return deviceInfo;
};

/**
 * @description: 加载图片
 * @param {*}
 * @return {*} 图片的对象
 */
const importImgs = () => {
  const context = require.context('../images', false, /\.(png|jpe?g|svg|gif)$/);
  const imgs = context.keys().reduce((imgs, key) => {
    const img = context(key);
    const name = key.replace(/(^\.\/|\.(png|jpe?g|svg|gif)$)/g, '');
    imgs[name] = img;
    return imgs;
  }, []);
  return imgs;
};

const debugFixed = () => {
  var oHeight = document.documentElement.clientHeight; //获取当前页面高度
  window.addEventListener('resize', function () {
    var resizeHeight = document.documentElement.clientHeight;
    console.log('[oHeight]', oHeight, ' [resizeHeight]', resizeHeight);
    if (resizeHeight < oHeight) {
      //键盘弹出
      $('.main').css('padding-bottom', '50px');
    } else {
      //键盘收起
      $('.main').css('padding-bottom', '0px');
    }
  });
};

/**
 * @description: 查询设备状态栏高度
 * @param {*} async
 * @return {*} 状态栏高度
 */
const getStatusBar = async () => {
  const { platformSDK } = sdk;
  const setting = await platformSDK.callNative('getSystemSettings');
  let height = 0;
  if (setting && setting.statusBarHeight > 0) {
    height =
      (isIOS
        ? setting.statusBarHeight
        : setting.statusBarHeight / window.devicePixelRatio) + 'px';
  }

  const statusBar = height / ratio || statusBarHeight;
  return statusBar;
};

//打开模态框前调用
const fixedBody = () => {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
};

//关闭模态框后调用
const looseBody = () => {
  var body = document.body;
  body.style.position = 'static';
  var top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  body.style.top = '';
};

/** 获得url的参数
 * @method getUrlParams
 * @param {string} key 需要查找的参数的key
 */
export const getUrlParams = (key) => {
  let search = window.location.search.split('?')[1] || '';
  let locationParams = search ? decodeURIComponent(search).split('&') : [];
  let paramsObj = {};
  locationParams.forEach((_e, _i) => {
    try {
      paramsObj[_e.split('=')[0]] = JSON.parse(_e.split('=')[1]);
    } catch (err) {
      paramsObj[_e.split('=')[0]] = _e.split('=')[1];
    }
  });
  if (key) {
    return paramsObj[key] || '';
  } else {
    return paramsObj;
  }
};

/** 格式化nickname
 * @method formatNickName
 */
export const formatNickName = (nickName) => {
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (re.test(nickName)) {
    let arr = nickName.split('@');
    let tmp = arr[0].substring(0, arr[0].length - 2);
    //let replaceStr = new Array(tmp.length+1).join("*");
    nickName = nickName.replace(tmp, '*');
  } else if (nickName.length >= 9) {
    let tmp = nickName.substring(3, nickName.length - 4);
    // let replaceStr = new Array(tmp.length+1).join("*");
    nickName = nickName.replace(tmp, '*');
  }
  return nickName;
};
/** 格式化时间
 * @method formatTime
 */
export const formatTime = (time) => {
  time = moment(time * 1000);
  let d = time.calendar(null, {
    sameDay: '[today]',
    lastDay: '[yesterday]',
    nextDay: 'YYYY.MM.DD',
    nextWeek: 'YYYY.MM.DD',
    lastWeek: 'YYYY.MM.DD',
    sameElse: 'YYYY.MM.DD',
  });
  return d;
};
export const formatTag = (post) => {
  let tagName = '';
  if (post.replied && post.replied === 1) {
    // 官方已回复
    tagName = 'replied';
  }
  if (post.resolved && post.resolved === 1) {
    // 已解决
    tagName = 'resolved';
  }
  return tagName;
};

export {
  getDeviceInfo,
  importImgs,
  debugFixed,
  getStatusBar,
  fixedBody,
  looseBody,
};
