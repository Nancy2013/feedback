/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-03-06 10:28:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
import React from 'react';
import {isIphoneX} from "componentsPath/device";
import classNames from 'classnames';
import style from 'stylesPath/index.less'

const Close = (props) => {
  const { formatMessage,img,setControl } = props;
  return (
    <div className={classNames(style.topBox,{[style.topBoxX]:isIphoneX})}>
      <div className={style.mainImg}>
        <img alt='' src={img} onClick={()=>setControl()}/>
      </div>
        <div className={classNames(style.tips,style.closeTips)}>
          {`${formatMessage({id:'pwr'})}${formatMessage({id:'closed'})}`}
        </div>
    </div>
  )
}

export default Close;