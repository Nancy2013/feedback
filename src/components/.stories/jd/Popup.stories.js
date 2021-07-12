import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import Popup from '../../jd/Popup';

import {
	action
} from '@storybook/addon-actions';
import {
	object,
	array,
	boolean,
	text
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

const stories = storiesOf('JD/Popup', module)
const PopupDesc = `
  ## 弹出框组件
  usage
  ~~~js
  import Popup from '../../jd/Popup';
  const title = "我是标题";
  const leftLabel = "关闭";
  const rightLabel = "保存";
  <Popup 
	  title={title}
	leftLabel={leftLabel}
	rightLabel={rightLabel}
	leftClick={action("leftClick")}
	 rightClick={action('rightClick')}
	 closeSelf={action('closeSelf')}
	  />
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [Popup]
};

// };
const title = "我是标题";
const leftLabel = "关闭";
const rightLabel = "保存";
stories.addWithInfo("Popup", PopupDesc, () => (
	<Popup 
	  title={text("title",title)}
	leftLabel={text("leftLabel",leftLabel)}
	rightLabel={text("rightLabel",rightLabel)}
	leftClick={action("leftClick")}
	 rightClick={action('rightClick')}
	 closeSelf={action('closeSelf')}
	  />
), InfoConfig)