import React from 'react';
import PropTypes from 'prop-types';
import style from './NavBar.less';
import backIcon from './images/back.svg';
import homeIcon from './images/home.svg';
import exidIcon from './images/exid.svg';
import closeIcon from './images/close.png';
import dotIcon from './images/dot.png';
import MessageIcon from './images/message.png';
import sdk from 'broadlink-jssdk';
import { injectIntl } from 'react-intl';
import { inject, toggleInject } from 'componentsPath/injector';
import classnames from 'classnames';
import Device from 'componentsPath/device.js';
import './index.css';
const getUrlParams = (key) => {
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
const urlParams = getUrlParams() || {};
/**
 * dna导航栏
 * */
class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      exit: props.exit,
      right: true,
      ready: props.ready,
      // right:Array.isArray(this.props.right)?this.props.right:[this.props.right]
    };
  }
  static PROPERTY = 'PROPERTY'; //右键handel特殊类型，方法为打开属性页
  static propTypes = {
    subtitle: PropTypes.string, //副标题（房间）不传则不显示
    title: PropTypes.string, //标题
    exit: PropTypes.bool, //左键是否退出,true:退出,false:回退,默认false,只有首页才会退出
    right: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.bool,
    ]),
    rightSubhead: PropTypes.object, // 右侧的副标题
    onBack: PropTypes.func,
    opacity: PropTypes.bool, //是否透明 ture 透明 false 黑色
    className: PropTypes.string,
    left: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  };

  static defaultProps = {
    subtitle: '',
    title: '',
    exit: false,
    onBack: () => {
      window.history.back();
    },
    className: '',
    right: true,
  };
  componentDidMount() {
    const { left } = this.props;
    const { exit } = this.state;
    const t = this;
    if (
      !Device.isPC &&
      sdk &&
      sdk.platform !== 'mock' &&
      this.props.ready === true &&
      !urlParams.nav
    ) {
      sdk.platformSDK.navbar.hide();
      sdk.platformSDK.navbar.backHandler(() => {
        if (typeof left === 'string' && left === 'empty') {
          t.props.onBack ? t.props.onBack() : window.history.back();
        } else if (JSON.stringify(left) == '{}' || !left) {
          if (exit) {
            t.closeWebView();
          } else {
            t.props.onBack ? t.props.onBack() : window.history.back();
          }
        } else if (left === 'close') {
          t.props.onBack ? t.props.onBack() : window.history.back();
        } else {
          left.handler();
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    let { left, exit } = nextProps;
    if (
      !Device.isPC &&
      sdk &&
      nextProps.ready === true &&
      sdk.platform !== 'mock' &&
      !urlParams.nav
    ) {
      this.setState({
        ready: true,
      });
      sdk.platformSDK.navbar.hide();
      sdk.platformSDK.navbar.backHandler(() => {
        if (typeof left === 'string' && left === 'empty') {
          nextProps.onBack ? nextProps.onBack() : window.history.back();
        } else if (JSON.stringify(left) == '{}' || !left) {
          if (exit) {
            sdk.platformSDK.closeWebView();
          } else {
            nextProps.onBack ? nextProps.onBack() : window.history.back();
          }
        } else if (left === 'close') {
          this.props.onBack ? this.props.onBack() : window.history.back();
        } else {
          left.handler();
        }
      });
    }
  }
  componentWillUnmount() {
    if (
      !Device.isPC &&
      sdk &&
      sdk.platform !== 'mock' &&
      this.props.ready === true &&
      !urlParams.nav
    ) {
      sdk.platformSDK.navbar.hide();
    }
  }
  closeWebView = () => {
    sdk.platformSDK.closeWebView();
  };

  openPropertyPage = () => {
    sdk.platformSDK.openDevicePropertyPage();
  };
  clickLeft = () => {
    const { left, exit } = this.props;
    if (typeof left === 'string' && left === 'empty') {
      return null;
    } else if (JSON.stringify(left) == '{}' || !left) {
      if (exit) {
        this.closeWebView();
      } else {
        this.props.onBack ? this.props.onBack() : window.history.back();
      }
    } else if (left === 'close') {
      this.props.onBack ? this.props.onBack() : window.history.back();
    } else {
      left.handler();
    }
  };

  clickRight = () => {
    const { right } = this.props;
    if (right && right.handler) {
      right.handler();
    } else {
      sdk.platformSDK.closeWebView();
    }
  };

  closeMenu = () => {
    this.setState({
      showMenu: false,
    });
  };
  openMenu = () => {
    this.setState({
      showMenu: true,
    });
  };
  handleClickHome = () => {
    this.props.backHome && this.props.backHome();
  };
  formatRightSubhead() {
    const { exit, backHome, rightSubhead } = this.props;
    let rightUrl = undefined;
    if (rightSubhead) {
      if (rightSubhead.type === 'message') {
        rightUrl = MessageIcon;
      }
    }
    return rightUrl;
  }
  handleClickLeftSub() {
    this.props.backHome && this.props.backHome();
  }
  handleClickRightSub() {
    const { rightSubhead } = this.props;
    if (rightSubhead && rightSubhead.handler) {
      rightSubhead.handler();
    }
  }

  render() {
    const {
      ready,
      title,
      subtitle,
      exit,
      opacity,
      rightSubhead,
      noPaddingBottom,
      className,
      left,
      right,
    } = this.props;
    let rightButton = <img src={exidIcon} alt="" />;
    const colorStyle = opacity ? { background: 'none' } : {};
    let leftSubheadIcon = !exit && this.props.backHome ? homeIcon : undefined;
    let rightSubheadIcon = this.formatRightSubhead();
    let leftIcon = undefined;
    if (left === 'close' || !left) {
      if (left && left === 'close') {
        leftIcon = closeIcon;
      } else {
        leftIcon = backIcon;
      }
    }
    return !Device.isPC &&
      ready &&
      !(
        urlParams.origin &&
        (urlParams.origin === 'website' || urlParams.origin === 'copy')
      ) &&
      !urlParams.nav ? (
      <div>
        <div
          className={classnames(style.navBox, {
            [className]: !!className,
            navBar: true,
            [style.textNavBar]: (right && right.text) || (left && left.text),
          })}
          style={colorStyle}
        >
          <div className={style.topHeight}></div>
          <div className={style.bottomHeight}>
            <div
              className={classnames(
                `${style.leftBox} ${style.bgIcon} ${style.btnBox}`,
                { [style.textLeftBox]: left && left.text }
              )}
              onClick={this.clickLeft}
              style={!leftIcon ? {} : { backgroundImage: `url(${leftIcon})` }}
            >
              {left && left.text ? left.text : null}
            </div>
            {rightSubheadIcon || leftSubheadIcon ? (
              <div
                className={classnames(
                  `subrightBox ${style.rightSunheadBtn} ${style.bgIcon}`,
                  {
                    [style.rightSunheadBtnNone]: !leftSubheadIcon,
                  }
                )}
                onClick={this.handleClickLeftSub.bind(this)}
                style={{ backgroundImage: `url(${leftSubheadIcon})` }}
              ></div>
            ) : null}
            <div
              className={classnames(style.titleBox, {
                [style.titleBoxHaveSubtitle]: !!subtitle,
              })}
            >
              <div
                className={classnames(style.titleBoxTitle, {
                  [style.lineHeight]: !subtitle,
                })}
              >
                {title}
              </div>
              <span>{subtitle}</span>
            </div>
            {rightSubheadIcon || leftSubheadIcon ? (
              <div
                className={classnames(
                  `subrightBox ${style.rightSunheadBtn} ${style.bgIcon}`,
                  {
                    [style.rightSunheadBtnNone]: !rightSubheadIcon,
                  }
                )}
                onClick={this.handleClickRightSub.bind(this)}
                style={{ backgroundImage: `url(${rightSubheadIcon})` }}
              >
                {rightSubhead && rightSubhead.new ? (
                  <div
                    className={style.circle}
                    style={{ backgroundImage: `url(${dotIcon})` }}
                  ></div>
                ) : null}
              </div>
            ) : null}
            {right ? (
              <div
                className={classnames(
                  `rightBox ${style.rightBox} ${style.btnBox}`,
                  { [style.textRightBox]: right && right.text }
                )}
                onClick={this.clickRight}
                style={
                  right.text ? {} : { backgroundImage: `url(${exidIcon})` }
                }
              >
                {right && right.text ? right.text : ''}
              </div>
            ) : (
              <div
                className={classnames(`rightBox ${style.rightBox}`, {
                  [style.textLeftBox]: left && left.text,
                })}
              >
                {left && left.text ? left.text : null}
              </div>
            )}
          </div>
          <div
            className={classnames(style.navClickBox, {
              none: !this.state.showMenu,
            })}
          >
            <div className={style.maskLayer} onClick={this.closeMenu}></div>
            <div className={style.navClick}></div>
          </div>
        </div>

        {noPaddingBottom === undefined && (
          <div className={style.navHeight}></div>
        )}
      </div>
    ) : null;
  }
}
export default inject((selector) => {
  // 此处是用来获取设备的状态
  let ready = selector.getReady();
  return {
    ready,
  };
})(injectIntl(NavBar));
