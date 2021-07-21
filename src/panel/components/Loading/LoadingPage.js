/*
 * @Author: your name
 * @Date: 2021-07-21 17:37:21
 * @LastEditTime: 2021-07-21 17:52:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\components\Loading\LoadingPage.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './LoadingPage.less';

class LoadingPag extends React.Component {
  render() {
    return (
      <div
        className={classNames(` ${this.props.className || ''}`, {
          [style.box]: true,
        })}
      >
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
