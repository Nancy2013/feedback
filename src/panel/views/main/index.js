/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-08-09 17:40:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \panel\Main.js
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Device from 'componentsPath/device.js';
import NavBar from 'componentsPath/dna/NavBar';
import Page from 'componentsPath/dna/Page';
import add from '@/panel/images/add.svg';
import List from './List';
import style from 'stylesPath/index.less';

const Main = (props) => {
  console.log('【main】', props);
  const {
    userId,
    intl: { formatMessage },
    history,
  } = props;

  return (
    <Page className={classNames({ [style.paddingBottomX]: Device.isIphoneX })}>
      <NavBar
        title={formatMessage({ id: 'feedBack' })}
        exit
        opacity
        color={'#000'}
        className={style.navbarHook}
        right={{
          icon: add,
          handler: () => {
            history.push('/add');
          },
        }}
      />
      {userId ? <List {...props} /> : <></>}
    </Page>
  );
};

export default injectIntl(Main);
