/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-07-15 16:09:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \panel\Main.js
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { injectIntl } from 'react-intl';
import { isIphoneX, isFullScreen } from 'componentsPath/device';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Page from 'componentsPath/dna/Page';

import List from './List';
import style from 'stylesPath/index.less';
import empty from '@/panel/images/empty.svg';

const Main = (props) => {
  console.log('【main】', props);
  const { userId } = props;
  return <Page className={style.bgColor}>{userId && <List {...props} />}</Page>;
};

export default injectIntl(Main);
