import isMobile from 'ismobilejs';
/*

 The following properties of the global isMobile object will either be true or false
 Apple devices

 isMobile.apple.phone
 isMobile.apple.ipod
 isMobile.apple.tablet
 isMobile.apple.device (any mobile Apple device)

 Android devices

 isMobile.android.phone
 isMobile.android.tablet
 isMobile.android.device (any mobile Android device)

 Amazon Silk devices (also passes Android checks)

 isMobile.amazon.phone
 isMobile.amazon.tablet
 isMobile.amazon.device (any mobile Amazon Silk device)

 Windows devices

 isMobile.windows.phone
 isMobile.windows.tablet
 isMobile.windows.device (any mobile Windows device)

 Specific seven inch devices

 isMobile.seven_inch
 true if the device is one of the following 7" devices:
 Nexus 7
 Kindle Fire
 Nook Tablet 7 inch
 Galaxy Tab 7 inch

 "Other" devices

 isMobile.other.blackberry_10
 isMobile.other.blackberry
 isMobile.other.opera (Opera Mini)
 isMobile.other.firefox
 isMobile.other.chrome
 isMobile.other.device (any "Other" device)

 Aggregate Groupings

 isMobile.any - any device matched
 isMobile.phone - any device in the 'phone' groups above
 isMobile.tablet - any device in the 'tablet' groups above

 */
export const isAndroid = isMobile.android.device;

export const isIOS =isMobile.apple.device;

export const ratio = window.devicePixelRatio || 1;

// Define the users device screen dimensions
const screen = {
    width : window.screen.width * ratio,
    height : window.screen.height * ratio
};

export const isIphoneX =
    isIOS && (
        (screen.width === 1125 && screen.height === 2436)   //iphoneX
        ||
        (screen.width === 828 && screen.height === 1792)    //iphoneXR
        ||
        (screen.width === 1125 && screen.height === 2436)    //iphoneXS
        ||
        (screen.width === 1242 && screen.height === 2688)   //iphoneXSMAX
        ||
        (screen.width === 828 && screen.height === 1792)   //iphone 11
        ||
        (screen.width === 1125 && screen.height === 2436)   //iphone 11 Pro
        ||
        (screen.width === 1242 && screen.height === 2688)   //iphone 11 Pro Max
    ); // 刘海屏+虚拟home按键的iphone版本

/*
 设备 	分辨率 	PPI 	状态栏高度 	导航栏高度 	标签栏高度

 iPhone X
 1125×2436 px 	458PPI 	88px 	176px 	--

 iPhone6P、6SP、7P、8P
 1242×2208 px 	401PPI 	60px 	132px 	146px

 iPhone6 - 6S - 7
 750×1334 px 	326PPI 	40px 	88px 	98px

 iPhone5 - 5C - 5S
 640×1136 px 	326PPI 	40px 	88px 	98px

 iPhone4 - 4S
 640×960 px 	326PPI 	40px 	88px 	98px

 iPhone & iPod Touch第一代、第二代、第三代
 320×480 px 	163PPI 	20px 	44px 	49px

* */

//判断屏幕是否为全面屏
export const isFullScreen =function() {
    //这里根据返回值 true 或false ,返回true的话 则为全面屏
    var result = false;
    var rate = window.screen.height / window.screen.width;
    var limit = window.screen.height === window.screen.availHeight ? 1.8 : 1.65; // 临界判断值
    if (rate > limit) {
        result = true;
    }
    return result;
}

export const statusBarHeight = (function () {
    let height;
    if(isIOS){
        if(screen.width === 1125 && screen.height === 2436){
            height = 88;
        }else if(screen.width === 1242 && screen.height === 2208 ){
            height = 60;
        }else if(screen.width === 750 && screen.height === 1334 ){
            height = 40;
        }else if(screen.width === 640 && screen.height === 1136 ){
            height = 40;
        }else if(screen.width === 640 && screen.height === 960 ){
            height = 40;
        }else{
            height = 88;
        }
    }else {
        if (screen.width === 1442 && screen.height === 2562) {
            height = 28;
        } else if (screen.width === 1080.75 && screen.height === 2244) {
            height = 33;
        } else if (isFullScreen()) {
            // 安卓全面屏
            height = 30;
        } else { 
            height = 20;
        }
    }
    return height;
})();

export const isBelowAndroid5=function(){    //是否为anroid5以下版本
    var ua = navigator.userAgent;
    if( ua.indexOf("Android") >= 0 ){
        var androidVersion = parseFloat(ua.slice(ua.indexOf("Android")+8));
        return androidVersion < 5;
    }
}

export default {
    ratio,isAndroid,isIOS,isIphoneX,isBelowAndroid5,isFullScreen
}
