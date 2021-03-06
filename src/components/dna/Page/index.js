/*
 * @Author: your name
 * @Date: 2021-07-12 14:38:34
 * @LastEditTime: 2021-07-20 15:28:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\components\dna\Page\index.js
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { statusBarHeight, isIOS, isIphoneX } from '../../device';
import style from './page.less';
import sdk from 'broadlink-jssdk';

export default class extends React.PureComponent {
  static propTypes = {
    //保留头部区域（防止导航栏遮挡到内容）
    saveTop: PropTypes.bool,
    //保留底部区域（防止底部的操作按钮遮挡到内容）
    saveBottom: PropTypes.bool,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    saveTop: true,
    saveBottom: false,
  };
  state = {
    statusBarHeight: statusBarHeight,
  };

  componentDidMount() {
    if (sdk.platform === 'dna') {
      sdk.platformSDK.callNative('getSystemSettings').then((setting) => {
        if (setting && setting.statusBarHeight > 0) {
          this.setState({
            statusBarHeight: isIOS
              ? setting.statusBarHeight
              : setting.statusBarHeight / window.devicePixelRatio,
          });
        }
      });
    }
  }

  render() {
    const { saveTop, saveBottom, className, children } = this.props;
    const classes = Array.isArray(className) ? className : [className];

    const bottomCss = saveBottom
      ? isIphoneX
        ? style.saveBottomX
        : style.saveBottom
      : null;

    return (
      <div
        className={classNames(style.page, ...classes)}
        style={{ paddingTop: this.state.statusBarHeight + 'px' }}
      >
        <div
          className={classNames({ [style.navbarHeight]: saveTop }, bottomCss)}
        >
          {children}
        </div>
      </div>
    );
  }
}
