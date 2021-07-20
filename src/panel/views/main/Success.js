/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-20 09:58:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
import React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Page from 'componentsPath/dna/Page';
import NavBar from 'componentsPath/dna/NavBar';
import FixBottom from 'componentsPath/dna/FixBottom';
import style from 'stylesPath/index.less';

const Component = (props) => {
  const {
    intl: { formatMessage },
    history,
  } = props;

  const goList = () => {
    history.push('/');
  };
  return (
    <Page className={style.page}>
      <NavBar
        title={formatMessage({ id: 'title' })}
        color={'#000'}
        opacity
        leftHandle={goList}
      />
      <div className={classNames(style.content, style.success)}>
        <div className={style.title}>{formatMessage({ id: 'success' })}</div>
        <div className={style.text}>{formatMessage({ id: 'successText' })}</div>
      </div>
      <FixBottom adaptToX="padding" className={style.clear}>
        <div className={style.fixedBtn} onClick={goList}>
          {formatMessage({ id: 'done' })}
        </div>
      </FixBottom>
    </Page>
  );
};

export default injectIntl(Component);
