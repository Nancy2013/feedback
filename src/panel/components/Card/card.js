/*
 * @Author: your name
 * @Date: 2020-12-09 10:15:56
 * @LastEditTime: 2020-12-10 14:57:42
 * @LastEditors: Please set LastEditors
 * @Description: 卡片组件
 * @FilePath: \laundry-rack\src\panel\components\Card\Card.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './index.less';


class Component extends React.PureComponent{ 
  static propTypes = {
    className: PropTypes.oneOfType([ // 样式
      PropTypes.string,
      PropTypes.array,
    ]),
    data:PropTypes.array, // 展示信息
  };

  static defaultProps = {
    data:[],
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
    const { className, data} = this.props;
    const classes = Array.isArray(className) ? className : [className];
    
    return (
      <div className={classNames(style.card,...classes)}>
        {
          data.map(item => {
            return (
              <div className={style.item} key={item.text}>
                <div className={style.text}>{ item.text || item.key }</div>
                <div className={style.value}>
                  {item.value}
                  < span className={style.unit}> {item.unit}</span>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  };
};

export default Component;