/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-07-20 16:47:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \panel\Main.js
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import List from './List';
import style from 'stylesPath/index.less';

const Main = (props) => {
  console.log('【main】', props);
  const { userId } = props;

  return userId ? <List {...props} /> : <></>;
};

export default injectIntl(Main);
