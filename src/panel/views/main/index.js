/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-07-21 15:30:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \panel\Main.js
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import List from './List';

const Main = (props) => {
  console.log('【main】', props);
  const { userId } = props;

  return userId ? <List {...props} /> : <></>;
};

export default injectIntl(Main);
