import React, { Component } from 'react';
import style from './MainSwitch.less';
import classNames from 'classnames';

import {ReactComponent as PowerOn} from './image/pwrOn.svg'
import {ReactComponent as PowerOff} from './image/pwrOff.svg'
import PropTypes from 'prop-types';
/**
*京东平台 总开关
* */
class MainSwitch extends React.Component {
    static propTypes = {
		text: PropTypes.string,
        on: PropTypes.bool,
        disable: PropTypes.bool,
        onClick: PropTypes.func
    };
    render() {
        const {on,text,onClick,disable}=this.props;
        return (
            <div className={classNames(style.box,{[style.on]:on},{[style.disable]:disable})}>
                <span>{text}</span>
                <div onClick={onClick}>
                    {on ? <PowerOn className={classNames(style.svgStyleOn,{[style.disable]:disable})} /> : <PowerOff className={classNames(style.svgStyleOff,{[style.disable]:disable})}  />}
                </div>
            </div>
        );
    }
}
export default MainSwitch;
