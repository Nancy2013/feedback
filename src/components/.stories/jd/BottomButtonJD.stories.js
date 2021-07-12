import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import BottomButton from '../../jd/BottomButton';
import {
	object,
	array,
} from '@storybook/addon-knobs';

const stories = storiesOf('JD/BottomButtonjd', module)

const buttonObj = {
	text: "开关",
	onClick: () => {}
}
const buttonArr = [{
	text: "开关",
	onClick: () => {}
}, {
	text: "风速",
	onClick: () => {}
}]

const BottomButtonDesc = `
  永远置于屏幕底部的Button
  ## 用法一 单个按钮 BottomButton
  ~~~js
  import BottomButton from '../../jd/BottomButton';
  
  const buttonObj = {
	  text: "开关",
	  onClick: () => {}
   }
  <BottomButton button={object("button",buttonObj)}/>
  ~~~

   ## 用法二 多个按钮 BottomButtonMulit
  ~~~js
  import BottomButton from '../../jd/BottomButton';
  
    const buttonArr = [{
	  text: "开关",
	  onClick: () => {}
    }, {
	  text: "风速",
	  onClick: () => {}
   }]
  <BottomButton button={object("button",buttonArr)}/>
  ~~~
  `;

stories.addWithInfo(
	'BottomButton',
	BottomButtonDesc,
	() => (
		<BottomButton button={object("button",buttonObj)}/>
	), {
		inline: false,
		source: false,
		propTables: [BottomButton]
	},
);
stories.addWithInfo(
	'BottomButtonMulit',
	BottomButtonDesc,
	() => (
		<BottomButton button={array("button",buttonArr)}/>
	), {
		inline: false,
		source: false,
		propTables: [BottomButton]
	},
);