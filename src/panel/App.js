/*
 * @Author: your name
 * @Date: 2020-11-23 17:22:09
 * @LastEditTime: 2021-03-30 17:07:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \curtain\src\panel\App.js
 */
import React from 'react';
import {
    Route,
} from 'react-router-dom'
import Switch from '../components/TransitionSwitch'
import { injectIntl } from 'react-intl';
import { inject } from "componentsPath/injector";
import Modal from 'componentsPath/Modal';
import config from 'configPath';
import Main from 'viewsPath/main';

export default inject(['pwr','err_code'])(injectIntl(class extends React.PureComponent {
    constructor(props) { 
        // 构造函数
        super(props)
        this.state = {
            message:false,
        }
        console.log(props)
    }
    componentDidMount() {
        // DOM加载完成
      }
    // 全局弹窗
    componentWillReceiveProps(nextProps) { 
    }
    
    render() {
        return (
            <Switch location={this.props.location} history={this.props.history} level={1} >
                <Route path="/" exact render={ props =>
                    <Main {...props}/>
                } />
            </Switch>
        )
    }
}))