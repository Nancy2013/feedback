// import React from 'react';
// import {
// 	storiesOf
// } from '@storybook/react';
// import NavBar from '../../../dna/NavBar';
// import {
// 	boolean,
// 	text,
// 	object,
// 	array,
// } from '@storybook/addon-knobs';


// const TITLE = "我是标题";
// const SUBTITLE = "我是副标题"
// const oneRightButton = {
// 	text: "设置",
// 	handler: () => console.log("设置页面")
// }
// const twoRightButton = [{
// 	text: "设置",
// 	handler: () => console.log("设置页面")
// }, {
// 	text: "属性",
// 	handler: () => console.log("属性页面")
// }]

// const NavBarDesc = `
// ## dna 自定义 导航栏
//   ** 导航栏 **
//   ~~~js
//   import NavBar from '../../../dna/NavBar';

//   	<NavBar 
// 		title={"title"}
// 		exit={true}
// 		right={${JSON.stringify(oneRightButton)}}
// 		opacity={false}
// 		/>

//   ~~~
// `;
// const NavBarHasSubtitleDesc = `
// ## dna 自定义 导航栏
//   ** 增加副标题导航栏 **
//   ~~~js
//   import NavBar from '../../../dna/NavBar';

//   	<NavBar 
// 		title={"title"}
// 		exit={true}
// 		right={ ${JSON.stringify(oneRightButton)}}
// 		opacity={false}
// 		/>

//   ~~~
// `;
// const NavBarRightMoreDesc = `
// ## dna 自定义 导航栏
//   ** 右边菜单为多个导航栏 **
//   ~~~js
//   import NavBar from '../../../dna/NavBar';

//   	<NavBar 
// 		title={"title"}
// 		exit={true}
// 		right={${JSON.stringify(twoRightButton)}}
// 		opacity={false}
// 		/>

//   ~~~
// `;
// const InfoConfig = {
// 	inline: false,
// 	source: false,
// 	propTables: [NavBar]
// };
// storiesOf('dna/NavBar', module)
// 	.addWithInfo('NavBar', NavBarDesc, () => (
// 		<NavBar 
// 		title={text("title",TITLE)}
// 		exit={boolean("exit",true)}
// 		right={object("right",oneRightButton)}
// 		opacity={boolean("opacity",false)}
// 		/>
// 	), InfoConfig)
// 	.addWithInfo('NavBarHasSubtitle', NavBarHasSubtitleDesc, () => (
// 		<NavBar 
// 		title={text("title",TITLE)}
// 		exit={boolean("exit",true)}
// 		subtitle={text("subtitle",SUBTITLE)}
// 		right={object("right",oneRightButton)}
// 		opacity={boolean("opacity",false)}
// 		/>
// 	), InfoConfig)
// 	.addWithInfo('NavBarRightMore', NavBarRightMoreDesc, () => (
// 		<NavBar 
// 		title={text("title",TITLE)}
// 		exit={boolean("exit",true)}
// 		subtitle={text("subtitle",SUBTITLE)}
// 		right={object("right",twoRightButton)}
// 		opacity={boolean("opacity",false)}
// 		/>
// 	), InfoConfig)