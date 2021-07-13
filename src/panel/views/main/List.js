/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-13 11:23:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import style from 'stylesPath/index.less';

const Component = (props) => {
  const { className, history } = props;
  return (
    <div className={className}>
      <div onClick={() => history.push('/detail/1')}>详情</div>
      <div onClick={() => history.push('/add')}>添加</div>
      <div onClick={() => history.push('/success')}>成功</div>
    </div>
  );
};

export default injectIntl(Component);
