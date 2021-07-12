// import React from 'react';
// import {
// 	storiesOf
// } from '@storybook/react';
// import {
// 	ShortcutDelay,
// 	CustomDelay
// } from '../../dna/Delay';
// import {
// 	action
// } from '@storybook/addon-actions';
// import {
// 	boolean,
// 	text,
// 	select,
// 	object
// } from '@storybook/addon-knobs';
// import styles from "@sambego/storybook-styles";
// import moment from 'moment';


// const ShortcutDelayDesc = `
//   ## 提供设置延时功能的组件，包括 ShortcutDelay（弹出框）&CustomDelay
//   ** ShortcutDelay（弹出框） **
//   ~~~js
//   import {
// 	ShortcutDelay,
// 	CustomDelay
//   } from '../../dna/Delay';

//   const timerObj = {
// 	time: moment('2018-05-29 10:24:54'),
// 	status: {
// 		pwr: 1
// 	},
// 	enable: 1
//     }
//   		<ShortcutDelay 
// 		title = {"定时"}
// 		leftButton = {"cross"} 
// 		closeSelf={action("closeSelf")}
// 		timer={timerObj}
// 		deleteTimer={action("deleteTimer")}
// 		addTimer={action("addTimer")}
// 		success={action("success")}
// 		/>

//   ~~~
// `
// const ShortcutInfoConfig = {
// 	inline: false,
// 	source: false,
// 	propTables: [ShortcutDelay]
// };

// const CustomInfoConfig = {
// 	inline: false,
// 	source: false,
// 	propTables: [CustomDelay]
// };

// const timerObj = {
// 	time: moment('2018-05-29 10:24:54'),
// 	status: {
// 		pwr: 1
// 	},
// 	enable: 1
// }

// storiesOf('dna/Delay', module)

// 	.addWithInfo('ShortcutDelay', ShortcutDelayDesc, () => (
// 		<ShortcutDelay 
// 		title = {text("title", "定时")}
// 		leftButton = {select("leftButton",["cross","back"])} 
// 		closeSelf={action("closeSelf")}
// 		timer={object("timer",timerObj)}
// 		deleteTimer={action("deleteTimer")}
// 		addTimer={action("addTimer")}
// 		success={action("success")}
// 		/>
// 	), ShortcutInfoConfig)
// 	.addWithInfo('CustomDelay', () => (
// 		<CustomDelay 

// 		 />
// 	), CustomInfoConfig);