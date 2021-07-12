/*
 * @Author: your name
 * @Date: 2020-11-26 16:43:39
 * @LastEditTime: 2021-03-10 09:44:16
 * @LastEditors: Please set LastEditors
 * @Description: config
 * @FilePath: \curtain\src\panel\config.js
 */
const config = {
  gear: {
    low: 2,
    high: 1,
    close: 0,
  },
  headHeat: {
    min: 15,
    max: 60,
    step: 1
  },
  wash: [
    { min: 1, max: 30, step: 1, },
    { min:10,max:90,step:10,}
  ],
  oven: {
    standardSteam: {
      temp: {
        min: 85,
        max: 100,
        default: 100,
      },
      time: {
        min: 5,
        max: 120,
        default: 40,
      },
    },
    heatSteam: {
      temp: {
        min: 100,
        max: 120,
        default: 120,
      },
      time: {
        min: 5,
        max: 120,
        default: 60,
      },
    },
    standardOven: {
      temp: {
        min: 100,
        max: 200,
        default: 200,
      },
      time: {
        min: 5,
        max: 120,
        default: 25,
      },
    },
    humidifyOven: {
      temp: {
        min: 100,
        max: 200,
        default: 200,
      },
      time: {
        min: 5,
        max: 120,
        default: 45,
      },
    },
    bakeRoast: {
      temp: {
        min: 100,
        max: 200,
        default: 200,
      },
      time: {
        min: 5,
        max: 120,
        default: 45,
      },
    },
    heatDisinfect: {
      temp: 120,
      time: 50,
    },
    ferment: {
      temp: 38,
      time: {
        min: 20,
        max: 99,
        default: 60,
      },
    },
    defrost: {
      temp: {
        min: 55,
        max: 65,
        default: 55,
      },
      time: {
        min: 5,
        max: 60,
        default: 40,
      },
    },
  },
  error: function (code) {
    const texts = [
      '',
      '燃气泄漏保护',
      '防火墙报警',
      '防火墙温度传感器1（左）开路故障',
      '防火墙温度传感器2（右）开路故障',
      '烟机电源板通信故障',
      '蒸烤电源板通信故障',
      'ZCD电路故障',
      '腔体温度传感器故障',
      '蒸汽发射器温度传感器故障',
      '蒸箱干烧报警',
      '腔体温度过高报警',
      '蒸汽加热管故障',
      '底部加热管故障',
      '顶部加热管故障',
      '风机加热管故障',
    ];
    const err = {
      code: `E${code}`,
      msg: texts[code],
    };
    return err;
  },
}

export default config