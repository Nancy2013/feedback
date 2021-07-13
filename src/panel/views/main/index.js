/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-07-13 17:32:39
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
import NavBar from 'componentsPath/dna/NavBar';
import List from './List';
import style from 'stylesPath/index.less';
import empty from '@/panel/images/empty.svg';

const Main = (props) => {
  const data = [''];
  return (
    <Page className={style.bgColor}>
      {/* navbar */}
      <NavBar exit title={'title'} color={'#000'} opacity />
      <div className={style.main}>
        {data.length === 0 ? <img src={empty} /> : <List {...props} />}
      </div>
    </Page>
  );
};

export default injectIntl(Main);
