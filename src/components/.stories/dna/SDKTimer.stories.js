// import React from 'react';
// import {
// 	storiesOf
// } from '@storybook/react';
// import {
// 	boolean,
// 	array,
// 	select
// } from '@storybook/addon-knobs';
// import SDKTimer from '../../dna/SDKTimer';
// // static propTypes = {
// //     //命令设置界面
// //     setting:PropTypes.oneOfType([
// //         PropTypes.func,
// //         PropTypes.element,
// //     ]).isRequired,
// //     //定时内容的描述
// //     desc:PropTypes.func.isRequired,
// //     //命令设置为标准交互，还是完全自定义
// //     settingType:PropTypes.oneOf(['inline'/*未实现*/, 'standard','custom']),
// //     //是否支持循环定时
// //     supportRecycle:PropTypes.bool
// // };
// const fakeMatch = {
// 	url: '/timer'
// }

// storiesOf('dna/SDKTimer', module)
// 	.addWithJSX('SDKTimer', () => (
// 		<SDKTimer 
//        settingType={array("settingType",["standard","custom"])}
//        supportRecycle={boolean("supportRecycle",false)}
//        match={fakeMatch}
// 		/>
// 	));