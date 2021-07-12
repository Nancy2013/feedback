# 项目

TCL 问题反馈

# 账号

# 蓝湖

## 定制化

# 命令

## npm start

> 调试模式：会指定启动浏览器，JS 自动引用 mock(根据 profile 实现的模拟设备)

## npm run build

> 打测试包 ，可用于上传 JD、国美、移动、KIT 平台,也可拷贝到手机上（智慧星）。  
> `但有大量调试代码(sourcemap采用eval)，不可用于正式发布`

## npm run prod

> 正式发布包

## 配置项

在`package.json`中有几个额外配置项目：

```
   iotPlatform 表示当前平台，默认值为dna。目前支持 jd dna gome andlink
   iotProtocol 表示当前代码中使用的参数协议，默认值为dna。目前支持 jd dna gome andlink
   supportCustomScene 是否支持（开发了）自定义场景，默认值为false。只在iotPlatform为dna的情况下，该配置项才起作用。

   theme 配置组件的主题，目前只支持配置主题色`@theme-color`
```

## build/prod 参数：

```
-J, --jd        指定为京东平台打包
-D, --dna       指定为古北（博联）平台打包
-G, --gome      指定为国美平台打包
-A, --andlink'  指定为移动（andlink）平台打包
-k, --sourcemap 保留sourcemaps(DNA平台的prod包默认不生成sourcemaps)
```

以上参数只能传其中之一。传入以上参数会覆盖`package.json`中的`iotPlatform`配置。

```
-c, --cp <dir> 将编译结果拷贝到<dir>
```

传入改参数可以将编译后的文件拷贝到指定地点（大多数情况下是拷贝到手机上，方便调试）。目前支持`绝对路径`或者`ftp路径`。

### 关于 DNA 平台的 sourcemaps 问题

由于 DNA 平台是需要下载整个 UI 包的，保留 sourcemaps 文件会导致 UI 包太大。目前在 prod 模式下，DNA 平台不会生成 UI 包，但会在 JS 文件尾部还是会设置好 sourceMappingURL:

> http://localhost:8888/static/js/4.9e4db678.chunk.js.map

如果线上的项目需要调试（UI 包本身是没有 sourcemap 的）

1. 需要找到当时输出的版本源码，加上`--sourcemap`参数重新打包生成 sourcemap
2. 在 build\zh-cn 目录下启动 web server，既可以使用 chrome inspector 进行调试

## 传入参数示例：

> 向 npm 脚本传入参数，要使用--标明。

1. 开发京东的 UI 包  
   npm run build -- --jd  
   npm run prod -- -J

2. 使用国美的 UI 包  
   npm run build -- --gome  
   npm run prod -- -G

3. 不传入参数则表示博联 UI 包  
   npm run build  
   npm run prod

4. 打包成功后将其拷贝到特定地址，比如已经在手机上启动了 FTP 服务（大多数手机文件管理器或者文件管理 APP 都提供该功能）  
   npm run build -- --cp ftp://192.168.1.102:3721/Android/data/cn.com.broadlink.econtrol.plus/cache/let/ui/0000000000000000000000002d5e0000/

## 适配多平台

一套代码适配多平台需要将平台参数的映射关系配置在`public/platforms.js`中

## 打包出错与 strings.js 问题

现在脚本对 public 目录下的`strings-语言代码-国家代码.js`文件(APP 自定义场景会用到,其中`-国家代码`可以省略)进行强制检测。但脚手架中没有该文件，所以默认情况下，打包会失败(npm start 不收影响)。

从 kit 后台下载（在默认 UI 包中）正确的`strings.js`与`profile.js`文件，并且按照规则放入 public 目录后即可打包成功。

> 详见： #15

# 目录结构

```
|-- .bowerrc
    |-- README.md
    |-- package.json
    |-- scripts 打包脚本目录
    |-- config  webpack的配置文件
    |-- public  You can also add other assets to the public folder.参考creat-react-app相关章节
    |-- src 代码目录
        |-- .mock   在浏览器运行时候所用到的mock文件
        |-- directoryList.md
        |-- index.html
        |-- mddir.js
        |-- routing.js
        |-- server.js
        |-- components 通用的组件目录
            |-- dna         博联平台特有组件
            |-- gome        国美平台特有组件
            |-- jd          京东平台特有组件
            |-- injector.js 向设备注入设备状态，后面章节有详细解释
            |-- logic.js    维护设备状态查询、控制的业务逻辑，，后面章节有详细解释
            |-- 待补充
        |-- panel       面板代码目录（一般开发只需要修改此处的代码）
        |-- custom-scene 开发自定义场景界面的目录,参考该目录下readme
```

`components`中提供了通用的组件，但在项目中如果有定制化需要可以进行修改。

# injector.js

提供注入设备属性的方法  
**injector.js**提供两个方法:

- inject： 注入一个或多个设备属性，默认注入 control 控制方法
- toggleInject：注入一个设备属性，然后注入的组件 props 将提供一个 onClick 方法来快速切换注入的设备属性值为 1/0；可用于开关按钮

```javascript
import { inject,toggleInject} from '../components/injector.js';

//inject用法: mapStatusToProps传Arr注入多个设备属性作为props；下面例子可相当于
<App pwr={1} wind={1}/>

inject(['pwr','wind'])(App)

//inject用法: mapStatusToProps传字符串注入多个设备属性作为props；并将propName修改为value,下面例子可相当于
<App value={'设备work属性值'} onClick={(command,param,value)=>control(command)} />

const Enum = inject('work',(control) => {
	return {
		onClick: (command, param, value) => {
			control(command)
		}
	}
}, {propName: 'value'})(App)

//inject用法: mapStatusToProps传入function注入多个设备属性并预处理作为props；下列例子可以相当于:
<App ready={true} func_code={1} onClick={(command)=>{if(func_code==1){control(command)}}}/>;
//seletors包含getOnline，getName，getReady，getStatus这些与设备交互方法，

export default inject(seletors => {
    let ready = seletors.getReady();
    let {func_code} = seletors.getStatus(['func_code']);
    return {
        ready,
        func_code,
    }

},(control,{func_code})=> {
	return {
		onClick: (command) => {
		if(func_code==1){//当该设备属性func_code为1时才执行控制命令
			control(command)
		}
		}
	}})(injectIntl(App));

//toggleInject用法：配合京东开关按钮实现开关；将注入的设备属性转换为按钮所需的props。
const PowerButtonEnhance=toggleInject('pwr')(({state,onClick})=><PowerButton state={state?'on':'off'} onClick={onClick} />)

```

## control 方法

#### control(cmd，[opt])

设备控制方法

##### Arguments

1. cmd（Object）: 设备命令，一个 simple object
2. [opt] （Object）: 控制行为的配置,默认值为

```javascript
{
  /*
   * Function | false
   * Function : 打开和关闭loading界面的方法，根据传入的参数判断（true/false）
   * false ： 无需显示loading界面
   *
   * 在本脚手架中，默认会被设置为显示loading的方法
   * */
  (loading = () => true),
    /* 控制完成后重启轮询的等待时间(ms)*/
    (restartLoopTimeout = 10000),
    /*
	延迟发送命令的时间（小于延时的操作，会被合并，类似debounce），如果为0或者false则不延时以及合并。
	 * */
    (execDelayTimeout = false),
    /*
     * 是否解析控制接口的返回值，个别平台的控制接口的返回值（即设备状态，不一定得到了更新）
     * true: 根据返回值更新内存中设备状态
     * false: 忽略返回值
     * */
    (ignoreResponse = false),
    /*
     * 'immediate'|'success'|'loop'
     * 内存中设备状态的更新逻辑
     * 'immediate'：control被调用后立刻更新
     * 'success'：在控制接口的success callback 中更新
     * 'loop'：不更新（只依靠轮询）
     * */
    (updateStrategy = 'success'),
    /*
	retry为一个对象{
	errorCode: 错误码数组或者单个错误码
	retryCount: 遇到errorCode时，最大重试的次数
	}
	如，遇到网络超时（-4000），则最大重试3次,每次间隔500ms：{
	errorCode: -4000
	retryCount: 3,
        timeout:500
	}
	 * */
    (retry = null),
    /*
	 * Function | false
	 * 默认的出错处理逻辑
	 * Function ：默认的出错callback，会传入一个Error对象。如统一的toast提示。
           如果该方法的返回值是true则表示异常已经被处理，不需要再抛出。否则异常会被抛出。
	 * false ： 不做任何处理。异常会被抛出。
	 * 
	 * 在本脚手架中，默认会被设置为一个弹出toast的方法，返回值为undefined
	 * */
    (onFail = false),
    /*
     * Function | false
     * 默认的成功处理逻辑
     * Function ：默认的成功callback，会传入实际发送下去的控制命令对象
     * false ： 不做任何处理
     * */
    (onSuccess = false),
    /*
     * true | false
     * 控制是否需要放入队列中进行排队
     *
     * 暂未支持
     * */
    (queue = true);
}
```

##### Returns

(Promise)，该控制的结果，如果有异常，会 reject。需要注意的是`execDelayTimeout `如果该项目设为了大于零的值，多次的 control 有可能会被合并为一次发送，所有先前的几次条用其返回的 promise 即不会被 resolve 也不会被 reject。

##### Example

```javascript
//用异步的风格（不显示loading，不控制用户操作，界面立刻响应，多操作进行合并）进行控制
control(
  {
    pwr: 1,
  },
  {
    execDelayTimeout: 300,
    loading: false,
    updateStrategy: 'immediate',
  }
);

//控制失败使用全局默认的行为（可能为toast），而使用alert进行显示
control(
  {
    pwr: 1,
  },
  {
    onFail: false,
  }
).catch((e) => {
  alert(e.message);
});

//更多例子
```

> 详见： #16

# components 组件管理

[react-ui](http://gitlab.broadlink.com.cn/h5/react-ui)模块使用 git subtree 指令集成在本项目中的 src/components 目录下。

- 添加远程版本库  
  `git remote add components git@gitlab.broadlink.com.cn:h5/react-ui.git`
- 增加子模块（项目中已经集成）  
  `git subtree add --prefix=src/components/ components master --squash`
- 更新子模块 （react-ui 中有更新）  
  `git subtree pull --prefix=src/components/ components master --squash`
- 将修改更新到 react-ui 中  
  `git subtree push --prefix=src/components/ components 分支名`
