# broadlink-reactui  
broadlink-reactui 为开发设备控制面板提供了一系列react组件  
# 安装
>npm install --save broadlink-reactui

# 组件
## 跨平台通用组件
**京东平台UI风格组件**

| 组件 | 说明 |
| -------- | -------- |
| Modal | 弹出框，如confirm 、alert等。可以直接通过静态方法调用。如Modal.alert   |
| TimePicker   | 时间选择插件，支持时间点与时长   |
| Toast   | toast小时，使用方法类似Modal   |
| Scroller   | 非时间类型的滚动选择插件，如枚举、数字选择  |
| Image | 封装thml中的img，解决svg的适配性问题   |
| stateful   | HOC组件，接收一个key:props的map，让组件变得有状态   |
| TransitionSwitch   | 让改switch下的页面切换有动画效果  |

## dna/
**智慧星设备面板组件**

| 组件 | 说明 |
| -------- | -------- |
| dna/ActivityIndicator   | 弹出框形式的加载中界面   |
| dna/BottomButton   | 永远置于屏幕底部的Button   |
| dna/Button   | 普通Button组件，一般与stateful-button或者stateful HOC组件配合使用   |
| dna/CircleSelect   | 空调中圆形选择框的组件  |
| dna/ColorPicker  | 颜色选择组件   |
| dna/Delay   | 提供设置延时功能的组件，包括 ShortcutDelay（弹出框）&CustomDelay  |
| dna/FromNowDescription   | 现实给定时间距离现在的描述   |
| dna/HistoryRecord   | 历史记录组件   |
| dna/LoadingPage   | 嵌入整个界面的加载中界面  |
| dna/NavBar  | 导航栏  |
| dna/Page   | Page组件，同事提供了iphonex的实现   |
| dna/Popup   | 弹出框组件   |
| dna/SDKTimer   | sdk定时组件   |
| Slider   | 滑动条，基于bootstrap-slider实现  |
| SwitchButton  | checkbox风格的开关button   |
| function-grid   | HOC组件，提供枚举类型的排列、选择、disable等功能   |
| countdown-timer   | HOC组件提供最新定时倒计时功能，注入countdown prop   |

## jd/
**京东平台UI风格组件**

| 组件 | 说明 |
| -------- | -------- |
| jd/BottomButton   | 永远置于屏幕底部的Button   |
| jd/Popup   | 弹出框组件   |
| jd/MainSwitch   | 插座类型设备的总开关部分   |
| jd/PowerButton   | 开关按钮  |
| jd/Popup   | 弹出框组件   |
| jd/FunctionBlock   | 京东UI上的一个功能区域，一般代表一个功能参数如 pwr、mode   |
| jd/Slider   | 滑动条，基于bootstrap-slider实现  |
| jd/SwitchButton  | checkbox风格的开关button   |
| jd/Top   | 头部状态显示区域（不包括导航栏）   |
| jd/function-grid   | HOC组件，提供枚举类型的排列、选择、disable等功能   |

## gome/
**国美平台UI风格组件**
>开发中  

# Provider  
**Provider** 提供下面几个功能。
* 使组件层级中的 inject() 方法都能够获得设备状态。正常情况下，你的根组件应该嵌套在 <Provider> 中才能使用 inject() 方法。  
* 提供国际化文案的支持，详见国际化一节。  

```js
import React, { Component } from 'react';
import App from './panel/App';

import Provider from './components/Provider';

const messages = {
    zh:{
        mainSwitch:'总开关',
        timer:'定时',
        delay:'延时',
        usbSwitch:'USB',
        lightSwitch:'夜灯',
        electricIcon:'电量'
    },
    en:{
        mainSwitch:'Main',
        timer:'Timer',
        delay:'Delay',
        usbSwitch:'USB',
        lightSwitch:'Light',
        electricIcon:'Electric'
    }
};

const settings = {
    type:'sync',
    // updateStrategy:'immediate',
};
export default class extends Component {

    render() {
        return (
            <Provider messages={messages} settings={settings}>
                <App/>
            </Provider>
        );
    }
}
```  
props参数：  
* messages 提供国际化文案；  
* settings 项目logic的配置项 ,object对象;  
   
```js
右侧为默认值
{
	//同步和异步2操作逻辑 one of 'async'/'sync'
	type = 'async',
	update = () => true,
	//每次轮询的间隔时间
	loopInterval = 3000,
	//控制完成后重启轮询的等待时间
	restartLoopTimeout = 10000,
	//在‘async’控制逻辑下，延迟发送命令的时间（小于延时的操作，会被合并）
	execDelayTimeout = 300,
	//支持参数过滤
	filter = () => true,
	//发生错误重试的次数
	retryCount = 0,
	//一般用于关闭蒙版
	onInitFail = () => true,
	onControlFail = () => true,
	onControlSuccess = () => true,
	//是否解析控制后的返回值
	ignoreResponse = false,
	//同步逻辑下，页面更新逻辑。点击立刻更新、命令成功后更新、不更新（值只依靠轮询）
	//one of 'immediate'/'success'/'loop'
	updateStrategy = 'success',
	//打开关闭loading的方法
	loading = () => true
}

```  

# injector.js  
提供注入设备属性的方法  


# 国际化  
## LocaleProvider  
开发者应该直接使用`Provider`,本节只是讲述内部逻辑。
broalink-reactui提供了一个组件LocaleProvider用于全局配置国际化文案。
LocaleProvider基于**react-intl**的**IntlProvider**实现。 增加根据navigator.languages/navigator.language中的语言信息，自动判断语言环境加载对应的语言包的功能。如果未匹配到支持的语言，则使用默认语言。


目前支持以下语言
* 简体中文
* 英文


## 增加或者修改语言包
目前组件内部支持以下语言
* 简体中文 （zh）
* 英文  (en)
如果找不到你需要的语言包，可以对照 ‘broadlink-reactui/local/en.js’

>LocaleProvider.addInternalMessage 静态方法进行添加

如新增繁体中文和修改组件内部默认文案：
```js
LocaleProvider.addInternalMessage({
    'zh-tw':{
        'internal.loading':'加載中',
        ...
    },
    'en':{
        'internal.loading':'please wait',
        ...
    }
});
```
>**组件内部国际化文案都以internal域开头。请注意区分**

## 匹配规则
LocaleProvider会基于navigator.languages/navigator.language中的语言信息，自动判断语言环境加载对应的语言包的功能。

当前浏览器语言为 ‘zh-CN’，会有一下几种情况：
```
支持种类：zh en zh-cn zh-tw
选择语言：zh-CN

支持种类：zh zh-tw en
选择语言：zh

支持种类：zh-hk zh-tw zh-SG en en-us
选择语言：zh-hk zh-tw zh-SG 三者的任意一种

支持种类：en en-us fr fr-ca
选择语言：无
```
如果根据浏览器语言无法匹配到合适语言，会在用**defaultLocale**（默认：en）。再进行一次匹配，逻辑同上。如果还是没有合适匹配结果，则会报错。

# 定制主题
broalink-reactui提供了组件主题色的设置功能。  
在项目中的package.json中加入theme属性即可  
> "theme": {
    "@theme-color": "#33b887"
  }  
定义 theme 属性时，需要配合利用 less-loader 的 modifyVars 配置来覆盖原来的样式变量。