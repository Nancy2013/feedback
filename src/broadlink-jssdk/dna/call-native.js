const BRIDGE = 'BLNativeBridge';

const _cordovaReadyPromise = new Promise(function (resolve, reject) {
  console.time('cordova');

  const script = document.createElement('script');
  // script.async = true;
  var ua = navigator.userAgent.toLowerCase();
  console.log('【ua】', ua);
  if (
    ua.match(/iphone\sos/i) + '' === 'iphone os' ||
    ua.match(/ipad/i) + '' === 'ipad'
  ) {
    script.src = './ios/cordova.js';
  } else if (ua.match(/android/i) + '' === 'android') {
    script.src = './android/cordova.js';
  }
  document.getElementsByTagName('head')[0].appendChild(script);

  document.addEventListener(
    'deviceready',
    () => {
      console.timeEnd('cordova');
      resolve();
    },
    false
  );
});

const deviceInfoPromise = async function () {
  await _cordovaReadyPromise;
  const info = await _callNative('deviceinfo');
  const device = {};
  Object.defineProperty(device, 'deviceID', {
    value: info.deviceID || null,
    writable: false,
  });
  Object.defineProperty(device, 'subDeviceID', {
    value: info.subDeviceID || null,
    writable: false,
  });
  Object.defineProperty(device, 'deviceName', {
    value: info.deviceName || null,
    writable: false,
  });
  if (device.deviceID) {
    return {
      online: info.deviceStatus + '',
      name: info.deviceName,
      deviceID: device.deviceID,
      subDeviceID: device.subDeviceID,
    };
  } else {
    throw new Error('cant get device id');
  }
};

const [localTimeout, remoteTimeout, sendCount] = (() => {
  /*eslint-disable*/
  const profile = window.PROFILE || {};
  const [local, remote] = profile.timeout || [3, 5];
  return [local * 1000, remote * 1000, profile.sendcount || 3];
})();

const _callNative = function (action, params = [], bridge = BRIDGE) {
  const uuid = Date.now().toString(36);
  return new Promise(function (resolve, reject) {
    const tag = `${uuid} ${action} ${
      action === 'devicecontrol' ? params[2]['act'] : ''
    }`;
    console.time && console.time(tag);
    console.log(`---${tag} bridge-call \n params:${JSON.stringify(params)}`);
    function onSucceed(data) {
      console.log(`+++${uuid} bridge-call-success :${data}`);
      console.timeEnd && console.timeEnd(tag);
      let response;
      try {
        response = JSON.parse(data);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(response);
    }

    function onFailed(e) {
      console.error(`+++${uuid} bridge-call-fail :${JSON.stringify(e)}`);
      console.timeEnd && console.timeEnd(tag);
      reject(e);
    }

    window.cordova.exec(onSucceed, onFailed, bridge, action, params);
  });
};

const callNativeSafe = (...arg) =>
  _cordovaReadyPromise.then(() => _callNative(...arg));

const dnaControl = async function (ctrlData, commandStr = 'dev_ctrl') {
  //控制请求超时时间
  const time = {
    localTimeout: localTimeout, //本地超时时间
    remoteTimeout: remoteTimeout, //远程超时时间
    sendCount: sendCount, //请求个数
  };

  const device = await deviceInfoPromise;
  const response = await _callNative('devicecontrol', [
    device.deviceID,
    device.subDeviceID,
    ctrlData,
    commandStr,
    time,
  ]);

  if (response.status === 0) {
    return response;
  } else {
    let errorMsg = `control device failed.code: ${response.status}, msg: ${response.msg}`;
    // console.error(errorMsg);

    let error = new Error(errorMsg);
    error.code = response.status;
    error.msg = response.msg;
    throw error;
  }
};

export { callNativeSafe as callNative, dnaControl, deviceInfoPromise };
