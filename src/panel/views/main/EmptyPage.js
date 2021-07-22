/*
 * @Author: your name
 * @Date: 2021-07-14 10:33:22
 * @LastEditTime: 2021-07-21 16:21:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\views\main\EmptyPage.js
 */
import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import Device from 'componentsPath/device.js';
import { importImgs } from 'utilsPath';
import style from 'stylesPath/index.less';

const imgs = importImgs();

const Component = (props) => {
  const {
    status,
    onRefresh,
    intl: { formatMessage },
  } = props;
  return (
    <div
      className={classNames(style.empty, style.topBox, {
        [style.topBoxX]: Device.isIphoneX,
      })}
    >
      <div className={style.img}>
        <img src={imgs[status]} alt="" />
      </div>
      <div className={style.text}> {formatMessage({ id: status })}</div>
      {status === 'error' && (
        <div
          className={style.refresh}
          onClick={() => {
            onRefresh && onRefresh();
          }}
        >
          {formatMessage({ id: 'reload' })}
        </div>
      )}
    </div>
  );
};

export default injectIntl(Component);
