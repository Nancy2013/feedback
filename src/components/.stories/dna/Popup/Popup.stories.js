import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import {
	action
} from '@storybook/addon-actions';
import Popup from '../../../dna/Popup';
// import './test.css'

import {
	boolean,
	text,
	object,
} from '@storybook/addon-knobs';
// const {tab,closeSelf,clickaway,title,leftButton,rightButton,defaultActiveKey,children}=this.props;

const handelClose = () => {
	console.log("close popup")
}
const handelRightButtonClick = () => {
	console.log("click rightButton")
}

const PopupChild = () => {

	return (
		<div style={{"height":"200px",display:"flex","justify-content":"center","align-items":"center"}}>2122</div>
	)
}

const rightButtonObj = {
	text: "保存",
	onClick: handelRightButtonClick,
};
const PopupDesc = `
## 弹出框组件
  ** 用法 **
  ~~~js
  import Popup from '../../../dna/Popup';
  const PopupChild = () => {

	return (
		<div style={{"height":"200px",display:"flex","justify-content":"center","align-items":"center"}}>2122</div>
	)
   }

		<Popup  onClick={action('clicked')} 
		title={'弹出框'}
		 clickaway={true}
		 closeSelf={()=>{handelClose()}} 
		 tab={false}
		 rightButton={${JSON.stringify(rightButtonObj)}}
		 defaultActiveKey={'defaultActiveKey'}
		 >
		{<PopupChild />}
		 </Popup>
 
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [Popup]
};


storiesOf('dna/Popup', module)

	.addWithInfo('Popup', PopupDesc, () => (
		<Popup  onClick={action('clicked')} 
		title={text('title','弹出框')}
		 clickaway={boolean("clickaway",true)}
		 closeSelf={()=>{handelClose()}} 
		 tab={boolean("tab",false)}
		 rightButton={object('rightButton',rightButtonObj)}
		 defaultActiveKey={text("defaultActiveKey",'defaultActiveKey')}
		 >
		{<PopupChild />}
		 </Popup>
	), InfoConfig)