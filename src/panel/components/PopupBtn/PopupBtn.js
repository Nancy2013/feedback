/*
 * @Author: your name
 * @Date: 2021-07-15 16:41:46
 * @LastEditTime: 2021-07-15 16:42:15
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\components\PopupBtn\PopupBtn.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Device from 'componentsPath/device.js';
import './index.css';

class UserInfo extends React.Component {
  static defaultProps = {
    btnList: [],
    cancelText: '取消',
    clickMack: () => {},
    clickCancel: () => {},
    visible: false,
  };
  static propTypes = {
    btnList: PropTypes.array,
    cancelText: PropTypes.string,
    clickMack: PropTypes.func,
    clickCancel: PropTypes.func,
    visible: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { visible } = this.state;
    if (nextProps.visible !== visible) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }
  clickMask(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.clickMask();
  }
  render() {
    const { btnList, clickMask, cancelText, clickCancel } = this.props;
    const { visible } = this.state;
    return visible ? (
      <div className={classNames('popupBtn', { isIphoneX: Device.isIphoneX })}>
        <div className="mask" onClick={this.clickMask.bind(this)}></div>
        <div className="popupBtnWrap">
          <div className="btnList">
            {btnList.map((_e, _i) => {
              return (
                <div key={_i} className="btnItem" onClick={_e.handler}>
                  {_e.text}
                </div>
              );
            })}
          </div>
          <div className="cancelBtn" onClick={clickCancel}>
            {cancelText}
          </div>
        </div>
      </div>
    ) : null;
  }
}
export default UserInfo;
