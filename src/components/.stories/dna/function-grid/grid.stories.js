import React from 'react';
import functionGrid from '../../../dna/function-grid';
import {
    storiesOf
} from '@storybook/react';
import {
    action
} from '@storybook/addon-actions';
import {
    boolean,
    number,
    text,
    withKnobs,
    object
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

import wind1Icon from './images/wind-1.svg';
import wind2Icon from './images/wind-2.svg';
import wind3Icon from './images/wind-3.svg';
import wind4Icon from './images/wind-4.svg';
import wind1GreyIcon from './images/wind-1-grey.svg';
import wind2GreyIcon from './images/wind-2-grey.svg';
import wind3GreyIcon from './images/wind-3-grey.svg';
import wind4GreyIcon from './images/wind-4-grey.svg';
import wind1BlueIcon from './images/wind-1-blue.svg';
import wind2BlueIcon from './images/wind-2-blue.svg';
import wind3BlueIcon from './images/wind-3-blue.svg';
import wind4BlueIcon from './images/wind-4-blue.svg';
import refrigerationIcon from './images/refrigeration.svg'
import refrigerationBlueIcon from './images/refrigerationBlue.svg'
import refrigerationGreyIcon from './images/refrigerationGrey.svg'
import heat from './images/heating.svg';
import heatBlue from './images/heatingBlue.svg';
import heatGrey from './images/heatingGrey.svg';
import arefactionBlue from './images/arefaction-blue.svg';
import arefactionGrey from './images/arefaction-grey.svg';
import arefaction from './images/arefaction.svg';
import blowingIn from './images/blowing-in.svg';
import blowingInBlue from './images/blowing-in-blue.svg';
import blowingInGrey from './images/blowing-in-grey.svg';
import auto from './images/auto.svg';
import autoBlue from './images/auto-blue.svg';
import autoGrey from './images/auto-grey.svg';


//首页所有白色模式与风速
const modeArray = [refrigerationIcon, heat, arefaction, blowingIn, auto];
const windArray = [auto, wind1Icon, wind2Icon, wind3Icon, wind4Icon];
//首页所有灰色模式与风速
const modeGreyArray = [refrigerationGreyIcon, heatGrey, arefactionGrey, blowingInGrey, autoGrey];
const windGreyArray = [autoGrey, wind1GreyIcon, wind2GreyIcon, wind3GreyIcon, wind4GreyIcon];
//首页所有蓝色模式与风速
const modeBlueArray = [refrigerationBlueIcon, heatBlue, arefactionBlue, blowingInBlue, autoBlue];
const windBlueArray = [autoBlue, wind1BlueIcon, wind2BlueIcon, wind3BlueIcon, wind4BlueIcon];


const AcModeBtnGroup = functionGrid(
    "ac_mode",
    new Map([
        [0, {
            text: '制冷',
            on: modeBlueArray[0],
            off: modeGreyArray[0]
        }],
        [1, {
            text: '制热',
            on: modeBlueArray[1],
            off: modeGreyArray[1]
        }],
        [2, {
            text: '除湿',
            on: modeBlueArray[2],
            off: modeGreyArray[2]
        }],
        [3, {
            text: '送风',
            on: modeBlueArray[3],
            off: modeGreyArray[3]
        }],
        [4, {
            text: '自动',
            on: modeBlueArray[4],
            off: modeGreyArray[4]
        }]
    ]),
);
const AcMarkBtnGroup = functionGrid(
    "ac_mark",
    new Map([
        [0, {
            text: '自动',
            on: windBlueArray[0],
            off: windGreyArray[0]
        }],
        [1, {
            text: '低速',
            on: windBlueArray[1],
            off: windGreyArray[1]
        }],
        [2, {
            text: '中速',
            on: windBlueArray[2],
            off: windGreyArray[2]
        }],
        [3, {
            text: '高速',
            on: windBlueArray[3],
            off: windGreyArray[3]
        }],
        [4, {
            text: '强力',
            on: windBlueArray[4],
            off: windGreyArray[4]
        }],

    ]),
);

storiesOf('dna/FunctionGrid', module)
    .addDecorator(styles({
        background: '#ffffff',
    }))
    .addWithInfo('空调模式',
        ` 
 ## HOC组件，提供枚举类型的排列、选择、disable等功能
  ** 空调模式用法 **
  ~~~js
  import functionGrid from '../../../dna/function-grid';



   const AcModeBtnGroup = functionGrid(
    "ac_mode",
    new Map([
        [0,{text: '制冷', on: modeBlueArray[0], off: modeGreyArray[0]}],
        [1,{text: '制热',on: modeBlueArray[1],off: modeGreyArray[1]}],
        [2,{text: '除湿', on: modeBlueArray[2], off: modeGreyArray[2]}],
        [3,{text: '送风',on: modeBlueArray[3],off: modeGreyArray[3]}],
        [4,{text: '自动', on: modeBlueArray[4], off: modeGreyArray[4]}]
       ]),
     );
       <AcModeBtnGroup
            onClick={action('clicked')}
            value={number('value',0)}
            disable={boolean('disable',false)}
            disabledValues={object('disabledValues',[3])}/>
  ~~~
        `, () => (
            <AcModeBtnGroup
            onClick={action('clicked')}
            value={number('value',0)}
            disable={boolean('disable',false)}
            disabledValues={object('disabledValues',[3])}/>
        ), {
            inline: false,
            source: false,
            propTables: [functionGrid]
        }, )
    .addWithInfo('风速设置',
        ` 
 ## HOC组件，提供枚举类型的排列、选择、disable等功能
  ** 风速设置用法 **
  ~~~js
  import functionGrid from '../../../dna/function-grid';

  const AcMarkBtnGroup = functionGrid(
    "ac_mark",
    new Map([
        [0, {
            text: '自动',
            on: windBlueArray[0],
            off: windGreyArray[0]
        }],
        [1, {
            text: '低速',
            on: windBlueArray[1],
            off: windGreyArray[1]
        }],
        [2, {
            text: '中速',
            on: windBlueArray[2],
            off: windGreyArray[2]
        }],
        [3, {
            text: '高速',
            on: windBlueArray[3],
            off: windGreyArray[3]
        }],
        [4, {
            text: '强力',
            on: windBlueArray[4],
            off: windGreyArray[4]
        }],

    ]),
    );

    <AcMarkBtnGroup onClick={action('clicked')} value={0}/>
  ~~~
  `, () => (
            <AcMarkBtnGroup onClick={action('clicked')} value={0}/>
        ), {
            inline: false,
            source: false,
            propTables: [functionGrid]
        }, );