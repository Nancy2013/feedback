/*
 * @Author: your name
 * @Date: 2021-07-12 14:38:34
 * @LastEditTime: 2021-07-22 09:46:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\components\dna\LoadingPage\LoadingPage.js
 */
import React from 'react';
import style from './LoadingPage.less';
import classNames from 'classnames';

class LoadingPag extends React.Component {
  render() {
    const { className } = this.props;
    return (
      <div className={classNames(style.box, className)}>
        <div className={style.loadBox}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
export default LoadingPag;
