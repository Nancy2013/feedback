# TimerSceneSiriSetting.js

由于定时、场景、siri的命令设置都是一样的交互，所以把之前panel/index的Setting组件提取出来共用  
该js是需要开发的，调试完定时Setting后，意味着siri和customScene也调试完毕，无需额外开发siri和customScene。

## cmd

type: object,  例如{pwr: 1}, 代表当前已保存的指令 

## updateCmd

type: function, 接收一个对象，用于覆盖已经保存的cmd

## themeColor

type: string, 通常用于已选择的状态的背景颜色
由于siri、scene页面的主题颜色与‘控制页面’的themeColor可能不一致,所以增加该配置