/*
 * @Author: your name
 * @Date: 2021-07-15 16:49:31
 * @LastEditTime: 2021-07-21 14:12:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\components\UserInfo\UserInfo.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import style from './index.less';
import DefaultIcon from './images/defaultIcon.png';

class UserInfo extends React.Component {
  static defaultProps = {
    icon: '', // 设置为true的话， 代表提示就会出现一次
    name: '', //标志，当once设置为true的时候才会使用
    time: parseInt(new Date().getTime() / 1000),
    official: false,
    formatTime: true, // 格式化时间为 今天 昨天 年 月 日
  };
  static propTypes = {
    classNames: PropTypes.string,
    icon: PropTypes.string, // 设置为true的话， 代表提示就会出现一次
    name: PropTypes.string, //标志，当once设置为true的时候才会使用
    time: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    official: PropTypes.bool,
    formatTime: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      official: props.official,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { official } = this.state;
    if (nextProps.official !== official) {
      this.setState({
        official: nextProps.official,
      });
    }
  }
  render() {
    const { icon, name, time, formatTime } = this.props;
    const { official } = this.state;
    return (
      <div className={classNames(style.userInfo)} ref={(el) => (this.el = el)}>
        {/* <div className={style.userIcon}>
          {icon ? <img src={icon} /> : <img src={DefaultIcon} />}
          {official ? <div className="officialIcon"></div> : null}
        </div> */}
        <div
          className={classNames(style.userName, {
            [style.official]: official,
          })}
        >
          {name}
        </div>
        <div className={style.time}>
          {formatTime ? moment(time * 1000).format('YYYY.MM.DD HH:mm') : time}
        </div>
      </div>
    );
  }
}
export default UserInfo;
