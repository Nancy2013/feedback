/*
 * @Author: your name
 * @Date: 2020-11-23 17:22:09
 * @LastEditTime: 2020-11-25 15:28:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youbang-curtain\src\panel\index.js
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import '../flexible';
import Provider from '../components/Provider';
import App from './App';

const Root=()=>{
    const settings = {
        type:'sync',
    };
    return(
        <Provider settings={settings}>
            <App/>
        </Provider>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));