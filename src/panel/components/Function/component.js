/*
 * @Author: your name
 * @Date: 2020-12-07 14:25:16
 * @LastEditTime: 2021-07-13 10:10:53
 * @LastEditors: Please set LastEditors
 * @Description: 方法组件
 * @FilePath: \curtain\src\panel\components\Function\function.js
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import style from './index.less';

const Component = (props) => {
  const { className } = props;
  return <div className={className}>Component</div>;
};

export default Component;
