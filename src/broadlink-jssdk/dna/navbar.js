/*
 * @Author: your name
 * @Date: 2021-07-29 11:22:41
 * @LastEditTime: 2021-07-29 13:46:08
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\broadlink-jssdk\dna\navbar.js
 */
import { callNative } from './call-native';
import { isFunction } from './utils';

const custom = function (config = {}) {
  if (config.rightButtons && config.rightButtons.length) {
    for (let i = 0; i < config.rightButtons.length; i++) {
      if (
        config.rightButtons[i].handler &&
        isFunction(config.rightButtons[i].handler)
      ) {
        let name = 'BL_NAVBAR_RIGHT_HANDLER' + i;
        window[name] = config.rightButtons[i].handler;
        config.rightButtons[i].handler = name;
      }
    }
  }

  if (
    config.leftButton &&
    config.leftButton.handler &&
    isFunction(config.leftButton.handler)
  ) {
    let name = 'BL_NAVBAR_LEFT_HANDLER';
    window[name] = config.leftButton.handler;
    config.leftButton.handler = name;
  }

  return callNative('custom', [config], 'Navbar').catch((e) =>
    console.warn(e.message)
  );
};

const backHandler = function (handler) {
  return custom({
    leftButton: {
      icon: 'appBackIcon',
      handler: handler,
    },
  });
};

const hide = function () {
  return custom({
    titleBar: {
      visibility: false,
    },
  });
};

const simple = function () {
  return custom();
};

const restore = function () {
  return custom({
    titleBar: {
      backgroundColor: '#000000',
      visibility: true,
      padding: false,
    },
    rightButtons: [
      {
        icon: 'appPropertyIcon',
        handler: 'appProperty',
      },
    ],
  });
};

const transparent = function (options = {}) {
  return custom({
    titleBar: {
      backgroundColor: '#00FFFFFF',
      visibility: true,
      padding: true,
    },
    ...options,
  });
};

export default { backHandler, custom, simple, restore, transparent, hide };
