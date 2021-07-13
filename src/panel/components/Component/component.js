/*
 * @Author: your name
 * @Date: 2020-12-07 14:14:32
 * @LastEditTime: 2021-07-13 10:07:07
 * @LastEditors: Please set LastEditors
 * @Description: Class组件
 * @FilePath: \curtain\src\panel\components\component\component.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './index.less';

class Component extends React.PureComponent {
  constructor(props) {
    // 构造函数
    super(props);
    this.state = {};
    console.log(props);
  }
  static propTypes = {
    label: PropTypes.string, // 左侧文本
    className: PropTypes.oneOfType([
      // 样式
      PropTypes.string,
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    label: 'Component',
  };

  componentDidMount() {
    // DOM加载完成
  }
  componentDidUpdate() {
    // DOM更新
  }
  componentWillUnmount() {
    // DOM卸载
  }

  render() {
    const { className } = this.props;
    const classes = Array.isArray(className) ? className : [className];

    return <div className={classNames(...classes)}>Component</div>;
  }
}

export default Component;
