/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-04-12 09:48:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \panel\Main.js
 */
import React, { useState,useEffect,useMemo,useCallback} from 'react';
import {injectIntl} from 'react-intl';
import {isIphoneX,isFullScreen} from "componentsPath/device";
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Page from 'componentsPath/dna/Page';
import NavBar from 'componentsPath/dna/NavBar';
import Enum from 'componentsPath/dna/Enum';
import FixBottom from 'componentsPath/dna/FixBottom';
import Button from 'componentsPath/dna/Button'
import Modal from 'componentsPath/Modal';
import { control } from 'componentsPath/logic';
import { getKeys,importImgs,getDeviceInfo } from 'utilsPath';
import config from 'configPath';
import style from 'stylesPath/index.less'
import Close from './Close'

const imgs = importImgs();
const services = {};

const Main = (props) => {
    const [title, setTitle] = useState('');
    
    const {status} = useSelector(state=>state.status);
    const { intl: { formatMessage } } = props;
    console.log('[status]', JSON.stringify(status));
    
    // 查询设备
    const getInfo=async ()=>{ 
        const deviceInfo = await getDeviceInfo(false);
        const { name = formatMessage({ id: 'title' }) } = deviceInfo;
        setTitle(name);
    }
    
    useEffect(() => {
        getInfo();
        const loopId = setInterval(() => {
            getInfo();
        }, 3000);

        const clearLoopId=() => {
            if (loopId) {
                window.clearInterval(loopId)
            }
        }

        return clearLoopId;
    });
    // 控制设备
    const setControl = (srv = { key: 'pwr' }, label) => {
        // 界面跳转
        if (srv.onClick) { 
            srv.onClick(props);
            return;
        }

        const { key } = srv;
        const value = props[key] === 0 ? 1 : 0;
        control({[key]:value});
    }

    const {pwr} = status;
    return (
        <Page saveBottom className={ style.bgColor}>
                {/* navbar */}
                <NavBar exit title={title} color={'#000'} opacity/>
                
                <div className={style.main}>
                  {
                    pwr === 0 ?
                    
                    <>
                        {/* device */}
                        <div className={classNames(style.topBox,{[style.topBoxX]:isIphoneX||isFullScreen()})}>
                        </div>
   
                        {/* bottom */}
                            <FixBottom adaptToX='padding' className={[style.bottom, style.fontColor]}>
                            </FixBottom>   
                     </>
                        
                        :
                        
                        <Close formatMessage={formatMessage} img={imgs.pwr_off} setControl={setControl}/>
                    }
                </div>
            </Page>
    );
}


export default injectIntl(Main);