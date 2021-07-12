/*
 * @Author: your name
 * @Date: 2020-11-27 17:25:02
 * @LastEditTime: 2020-12-14 15:22:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \curtain\src\panel\components\CurtainAnimation\panel.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './index.less';

class Panel extends React.PureComponent{ 
  constructor(props) { 
    // 构造函数
    super(props)
  }
  
  static propTypes = {
    className: PropTypes.oneOfType([ // 样式
      PropTypes.string,
      PropTypes.array,
    ]),
    label: PropTypes.string, // 左侧文本
    image: PropTypes.oneOfType([ // 图片按钮
        PropTypes.string,
        PropTypes.object,
        
    ]),
    border:PropTypes.bool,  // 是否有底部线
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
    const {className, label,border } = this.props;
    const classes = Array.isArray(className) ? className : [className];
    return (
      <div className={classNames(style.panel,...classes)}>
        <div className={classNames(style.extra, {[style.border]:border})}>
          <div className={style.left}>{label}</div>
          <div className={style.right}>
            {this.props.children}
           </div>
        </div>
      </div>
    )
  };
};

export default Panel;