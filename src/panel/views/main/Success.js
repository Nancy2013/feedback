/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-13 10:21:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import style from 'stylesPath/index.less';

const Component = (props) => {
  const { className } = props;
  return <div className={className}>Success</div>;
};

export default Component;
