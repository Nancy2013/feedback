/*
 * @Author: your name
 * @Date: 2021-07-14 10:33:22
 * @LastEditTime: 2021-07-14 11:29:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\views\main\EmptyPage.js
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { importImgs } from 'utilsPath';
import Page from 'componentsPath/dna/Page';
import style from 'stylesPath/index.less';

const imgs = importImgs();

const Component = (props) => {
  const {
    status,
    onRefresh,
    intl: { formatMessage },
  } = props;
  return (
    <Page>
      <div className={style.empty}>
        <div className={style.img}>
          <img src={imgs[status]} alt="" />
        </div>
        {status === 'error' && (
          <>
            <div className={style.text}>
              {' '}
              {formatMessage({ id: 'loadText' })}
            </div>
            <div
              className={style.refresh}
              onClick={() => {
                onRefresh && onRefresh();
              }}
            >
              {formatMessage({ id: 'refresh' })}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default injectIntl(Component);
