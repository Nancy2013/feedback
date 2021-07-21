import moment from 'moment';
import mock from '../commom';
import taskV2 from './taskV2';
/*
 * params:[..]    =>  {
 *                       key:value
 * vals:[..]      =>  }
 * */
const _combine = function ({ params = [], vals = [] }) {
  if (Array.isArray(params) && Array.isArray(vals)) {
    const result = {};
    params.forEach(function (v, i) {
      result[v] = vals[i][0].val;
    });
    return result;
  } else {
    console.error('_combine error !');
    return {};
  }
};

const platformSDK = (() => {
  //task 老定时协议MOCK
  const getFormat = (type) =>
    type === 0 || type === 1 ? 'YYYY-MM-DD HH:mm:ss' : 'HH:mm:ss';
  const types = [
    'timerlist',
    'delaylist',
    'periodlist',
    'cyclelist',
    'randomlist',
  ];
  let last_index = 0; //最后一个index值，用于维护index
  //格式化定时数据
  const _taskListTransform = function (tasks) {
    const timers = [];
    let get_index = 0;
    const handlerTaskList = function (list = [], type) {
      const format = getFormat(type);
      list.forEach((task) => {
        const override = {};
        override.time = moment(task.time, format);
        if (task.endtime) {
          override.endtime = moment(task.endtime, format);
        }
        timers.push({ ...task, type, ...override });
        get_index = task.index > get_index ? task.index : get_index;
      });
    };

    types.forEach((name, type) => {
      const data = tasks.data || tasks;
      handlerTaskList(data[name], type);
    });
    last_index = get_index > last_index ? get_index : last_index;
    return timers;
  };

  const addTask = function (task) {
    let this_typename = types[task.type];
    let dev_tasklist = window.localStorage.dev_tasklist
      ? JSON.parse(window.localStorage.dev_tasklist)
      : {};
    if (task.index == null) {
      task.index = last_index + 1;
      let tasks = dev_tasklist[this_typename] || [];
      tasks.push(task);
      dev_tasklist[this_typename] = tasks;
    } else {
      dev_tasklist[this_typename].forEach((time, i) => {
        if (time.index == task.index) {
          dev_tasklist[this_typename][i] = task;
        }
      });
    }
    window.localStorage.dev_tasklist = JSON.stringify(dev_tasklist);
    return Promise.resolve(_taskListTransform(dev_tasklist));
  };

  const listTask = function () {
    let p_tasks = '{"timerlist": []}';
    let tasks = JSON.parse(window.localStorage.dev_tasklist || p_tasks);
    return Promise.resolve(_taskListTransform(tasks));
  };
  const queryTask = function (type, index) {
    let tasks = JSON.parse(window.localStorage.dev_tasklist);
    const result = {};
    if (type === 3 || type === 4) {
      result.status = _combine(tasks[index].cmd1 || {});
      result.status2 = _combine(tasks[index].cmd2 || {});
    } else {
      result.status = _combine(tasks[index]);
    }
    return Promise.resolve(result);
  };

  const deleteTask = function (type, index) {
    let dev_tasklist = JSON.parse(window.localStorage.dev_tasklist);
    let this_typename = types[type];
    let new_task = [];
    dev_tasklist[this_typename].forEach((time, i) => {
      if (time.index !== index) {
        new_task.push(time);
      }
    });
    dev_tasklist[this_typename] = new_task;
    return Promise.resolve(_taskListTransform(dev_tasklist));
  };

  const allTaskDetail = function (taskList) {
    const tasksWithDetail = [];

    const getDetailByList = (list) => {
      function getDetailByIndex(index = 0) {
        const task = list[index];
        if (!task) {
          return Promise.resolve('done');
        }
        return queryTask(task.type, task.index).then(
          (detail) => {
            tasksWithDetail.push({ ...task, status: detail.status });
            return getDetailByIndex(++index);
          },
          (e = { message: 'unkown error' }) => {
            console.error(
              `type:${task.type} task:${JSON.stringify(
                task
              )} query detail fail.`
            );
            console.error(e);
            tasksWithDetail.push({ ...task, error: e });
            return getDetailByIndex(++index);
          }
        );
      }
      return getDetailByIndex();
    };
  };
  //老定时协议MOCK结束

  const closeWebView = function () {
    console.log('模拟关闭窗口成功');
    window.opener = null;
    window.open('', '_self', '');
    window.close();
  };

  const callNativeSafe = function (
    action,
    params = [],
    bridge = 'BLNativeBridge'
  ) {
    const backData = {
      init: {
        //"lid": "bbcec520f24b379971fe0f951b22a3b2"
        //"lid": "cf7a67e78338c7401deaeb96488f46fb"
        // "lid": "e32422b34ea5a3db7d8e8dd545da174d"
        // "lid": "1401476e0c0ab68eca2277527d87efa0" 中国测试集群
        lid: '26c1a19074798f60bbe038dc0c87109e',
        //"lid": "88a316ea069f0c65d0c4e49da812f038", // 云端造数据需要的licenseID
      },
      getUserInfo: {
        userId: '003962bab48d5ed8bf5be6f308b10f54',
        //  "userId": "003962bab48d5ed8bf5be6f308929299",
        nickName: '测试1号',
        userName: '测试1号',
        userIcon:
          'https://app-service-chn-467a8f05.ibroadlink.com/accountpic/a6/4e/379195b48e51af83a5dec711c318f364f639a16ddd63f2a17fd611cad1b6.png',
        loginSession: '04078d1585ca08de1acde930275b337d',
      },
      getFamilyInfo: {
        cityCode: '',
        countryCode: '1',
        familyIcon: '',
        familyId: '003fbf6e6be8c4ae563a7dd15161c98a',
        familyName: '浪里个浪',
        isAdmin: true,
        provinceCode: '',
      },
      getFamilySceneList: {
        scenes: [{ id: 'xxxx', name: '看电视', icon: '场景图标' }],
      },
      cloudServices: {
        hostName: '1401476e0c0ab68eca2277527d87efa0appservice.ibroadlink.com',
        protocol: 'https',
      },
    };
    return new Promise(function (resolve, reject) {
      const tag = ` ${action} ${
        action === 'devicecontrol' ? params[2]['act'] : ''
      }`;
      console.log(`bridge-call :${tag} params:${JSON.stringify(params)}`);
      console.log(`bridge-call-success : ${JSON.stringify(backData[action])}`);

      resolve(backData[action]);
    });
  };

  //navbar 开始
  const custom = function (config = {}) {
    console.log('自定义顶部标题栏');
  };
  const backHandler = function (handler) {
    console.log('顶部左侧返回');
  };
  const hide = function () {
    console.log('隐藏顶部标题栏');
  };
  const simple = function () {
    return custom();
  };
  const restore = function () {
    console.log('修改顶部标题栏');
  };
  const transparent = function (options = {}) {
    console.log('H5填充顶部标题栏');
  };

  return {
    task: { addTask, listTask, queryTask, deleteTask, allTaskDetail },
    taskV2,
    navbar: { backHandler, custom, simple, restore, transparent, hide },
    closeWebView,
    openDevicePropertyPage: () => {},
    getDevice: () => {},
    callNative: callNativeSafe,
  };
})();

export default {
  ...mock,
  platform: 'dna',
  platformSDK,
};
