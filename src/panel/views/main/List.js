/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-14 11:28:09
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
import EmptyPage from './EmptyPage';

const Component = (props) => {
  const { history } = props;
  const onRefresh = () => {};
  return (
    <div className={classNames(style.content, style.list)}>
      <EmptyPage status="error" onRefresh={onRefresh} />
    </div>
  );
};

export default injectIntl(Component);
