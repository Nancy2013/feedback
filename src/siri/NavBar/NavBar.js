import React from 'react';
import PropTypes from 'prop-types';
import style from './NavBar.less';

import sdk from 'broadlink-jssdk'
import classnames from 'classnames'
import {statusBarHeight,ratio} from '../../components/device'
import {isIOS} from '../../components/device';
/**
 * dna导航栏
 * */
class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            // right:Array.isArray(this.props.right)?this.props.right:[this.props.right]
        };
    };
    static PROPERTY = "PROPERTY";       //右键handel特殊类型，方法为打开属性页
    static propTypes = {
        subtitle: PropTypes.string,     //副标题（房间）不传则不显示
        title: PropTypes.string,        //标题
        color:PropTypes.string,         //自定义文字颜色
        exit: PropTypes.bool,           //左键是否退出,true:退出,false:回退,默认false,只有首页才会退出
        right: PropTypes.oneOfType([    //右键
            PropTypes.object,           //1.类型是object 为单个按键 {text:"右键显示字符",handler:func} 右侧显示text，点击后调用handler方法 ,若右键方法为 NavBar.PROPERTY 则默认为属性
            PropTypes.array,            //2.类型array 为单个或多个按键 [{text:"右键显示字符1",handler:func1},{text:"右键显示字符2",handler:func2},...]
            //数组长度为0，右键不显示；大于1时，右侧会显示【...】点击出现详细菜单；等于1时，同object类型。
            //3.不传为undefined 右键为【...】，点击打开属性页
        ]),
        opacity: PropTypes.bool,        //是否透明 ture 透明 false 黑色
        noListIcon: PropTypes.bool,     //强制不显示右列表图标
    };

    static defaultProps = {
        subtitle: "",
        title: "",
        exit: false,
        color:'#fff',
    };

    state={
        statusBarHeight:0
    };

    componentDidMount(){
        //隐藏APP导航栏
        if( sdk.platform === 'dna'){
            sdk.platformSDK.navbar.hide();
            sdk.platformSDK.callNative('getSystemSettings').then(setting => {
                if (setting && setting.statusBarHeight > 0) {
                    this.setState({
                        statusBarHeight: (isIOS?setting.statusBarHeight:(setting.statusBarHeight/window.devicePixelRatio)) + 'px'
                    })
                }
            })
        }
    }

    pretreatRight = () => {
        let right;
        if (!Array.isArray(this.props.right)) {
            right = [this.props.right];
        } else {
            right = this.props.right;
        }
        return right;
    };

    closeWebView = () => {
        sdk.platformSDK.closeWebView();
    };

    openPropertyPage = () => {
        sdk.platformSDK.openDevicePropertyPage();
    };

    callRight = (index) => {

        let right = this.pretreatRight();
        if (right === undefined) {
            this.openPropertyPage();
            return;
        }
        if (right.length > index && right[index].handler) {
            if (typeof (right[index].handler) === "function") {
                right[index].handler();
            }
            else if (right[index].handler === NavBar.PROPERTY) {
                this.openPropertyPage();
            }
        }
    };

    clickLeft = () => {
        if (this.props.exit) {
            this.closeWebView();
        } else {
            window.history.back();
        }
    };

    clickRight = () => {
        let right = this.pretreatRight();
        if (right.length > 1) {
            this.openMenu();
        } else {
            if (this.props.right === undefined) {
                this.openPropertyPage();
            } else {
                this.callRight(0)
            }
        }
    };

    clickMenu = (index) => {
        this.callRight(index);
        this.closeMenu();
    };

    closeMenu = () => {
        this.setState({
            showMenu: false
        })
    };
    openMenu = () => {
        this.setState({
            showMenu: true
        })
    };

    render() {
        const { title, subtitle, exit, opacity,color, noListIcon} = this.props;
        let right = this.pretreatRight();
        const colorStyle = opacity ? { background: "none" } : {background:color==="#000000"?"#ffffff":""};
        const colorText=color?{color:color}:{};
        let rightList, rightButton;
        const listIcon = (
            <svg t="1513131881851" className="icon" viewBox="0 0 1024 1024" version="1.1" p-id="35192"
                 width="200" height="200">
                <path
                    d="M232.727273 512m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z"
                    fill={color} p-id="35193"></path>
                <path
                    d="M581.818182 512m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z"
                    fill={color} p-id="35194"></path>
                <path
                    d="M930.909091 512m-93.090909 0a93.090909 93.090909 0 1 0 186.181818 0 93.090909 93.090909 0 1 0-186.181818 0Z"
                    fill={color} p-id="35195"></path>
            </svg>
        );
        if (right.length === 1 && right[0] === undefined) {
            rightList = "";
            rightButton = listIcon;
        } else {
            rightList = right.map(({ text, handler }, index) => {
                return (<div key={"r" + index} onClick={this.clickMenu.bind(this, index)}>{text}</div>);
            });
            rightButton = (function () {
                if (right.length > 1 || (exit&&!noListIcon))
                    return (listIcon);
                if (right.length === 1 && right[0].text)
                    return (<p>{right[0].text}</p>);
                if(right.length === 1 && right[0].icon )
                    return (<img src={right[0].icon} alt="" style={{width: "0.58rem"}}/>)
                return "";
            })()
        }
        const backIcon= (
            <svg t="1513131888484" className="icon" viewBox="0 0 1024 1024" version="1.1" p-id="35302" width="200" height="200">
                <path
                    d="M451.265164 837.818182l-330.472728-325.818182 330.472728-325.818182a46.545455 46.545455 0 0 0 0-69.818182 50.269091 50.269091 0 0 0-70.749091 0L14.6688 477.090909a48.872727 48.872727 0 0 0 0 69.818182l365.847273 361.192727a49.803636 49.803636 0 0 0 35.374545 14.429091 49.803636 49.803636 0 0 0 35.374546-14.429091 46.545455 46.545455 0 0 0 0-69.818182z"
                    fill={color} p-id="35303"></path>
            </svg>
        );
        const statusBar = (this.state.statusBarHeight/ratio)||statusBarHeight;

        return (
            <div>
                <div className={ style.navBox} style={colorStyle} >
                    <div style={{height:statusBar}}></div>
                    <div className={style.bottomHeight} style={colorText}>
                        <div className={style.leftBox} onClick={this.clickLeft}>{backIcon}</div>
                        <div className={style.titleBox}>
                            <p className={classnames({ [style.lineHeight]: !subtitle })}>{title}</p>
                            <span>{subtitle}</span>
                        </div>
                        <div className={style.rightBox} onClick={this.clickRight}>
                            {
                                rightButton
                            }
                        </div>
                    </div>
                    <div className={classnames(style.navClickBox, { "none": !this.state.showMenu })}>
                        <div className={style.maskLayer} onClick={this.closeMenu}></div>
                        <div className={style.navClick}>
                            {rightList}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}
export default NavBar;
